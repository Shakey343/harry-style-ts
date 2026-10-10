import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { createRef } from "react";
import ProjectDetail from "./ProjectDetail";
import { BackgroundVideoProvider } from "../context/BackgroundVideoContext";
import type { Project } from "../types/project";

const cover = { url: "https://res.cloudinary.com/x/image/upload/v1/cover.jpg", alt: "Cover" };
const base: Project = { slug: "s", title: "Shantify", cover, photos: [], audio: [] };

const renderDetail = (project: Project, onClose = () => {}) =>
  render(
    <BackgroundVideoProvider>
      <ProjectDetail project={project} onClose={onClose} closeButtonRef={createRef<HTMLButtonElement>()} />
    </BackgroundVideoProvider>
  );

describe("ProjectDetail", () => {
  it("cover-only project renders header and nothing else", () => {
    const { container } = renderDetail(base);
    expect(screen.getByRole("heading", { level: 3, name: "Shantify" })).toBeInTheDocument();
    expect(container.querySelector("p")).toBeNull();
    expect(screen.queryByRole("button", { name: /Open photo/ })).toBeNull();
    expect(container.querySelector("audio")).toBeNull();
    expect(container.querySelector("iframe")).toBeNull();
  });

  it("cover stays hidden until its image has loaded, then fades in", () => {
    renderDetail(base);
    const img = screen.getByAltText("Cover");
    expect(img).toHaveClass("opacity-0");
    fireEvent.load(img);
    expect(img).toHaveClass("opacity-100");
    expect(img).not.toHaveClass("opacity-0");
  });

  it("content fades in after the panel has grown", () => {
    renderDetail(base);
    const content = screen.getByRole("heading", { level: 3 }).closest("section")!.firstElementChild!.nextElementSibling!;
    expect(content).toHaveClass("animate-fade-in-after-grow");
  });

  it("header loads an optimised cover", () => {
    renderDetail(base);
    expect(screen.getByAltText("Cover").getAttribute("src")).toContain("/upload/f_auto,q_auto/");
  });

  it("full project renders every block in order", () => {
    const { container } = renderDetail({
      ...base,
      description: "Desc",
      blurb: "Blurb text",
      photos: [{ url: cover.url, alt: "P1" }],
      audio: [{ url: "https://x/a.mp3", name: "Track A" }],
      soundcloud: "https://soundcloud.com/a/b",
    });
    const h = screen.getByRole("heading", { level: 3 });
    const blurb = screen.getByText("Blurb text");
    const photo = screen.getByRole("button", { name: "Open photo 1" });
    const play = screen.getByRole("button", { name: "Play Track A" });
    const iframe = container.querySelector("iframe")!;
    const follows = (a: Node, b: Node) => a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING;
    expect(follows(h, blurb)).toBeTruthy();
    expect(follows(blurb, photo)).toBeTruthy();
    expect(follows(photo, play)).toBeTruthy();
    expect(follows(play, iframe)).toBeTruthy();
  });

  it("renders YouTube after SoundCloud, and Spotify without crashing", () => {
    renderDetail({
      ...base,
      soundcloud: "https://soundcloud.com/a/b",
      spotify: "https://open.spotify.com/track/abc123",
      youtube: "https://youtu.be/dQw4w9WgXcQ",
    });
    const sc = screen.getByTitle("SoundCloud player");
    const yt = screen.getByTitle("YouTube player");
    expect(sc.compareDocumentPosition(yt) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("cover links out only when link set", () => {
    const { unmount } = renderDetail(base);
    expect(screen.queryByRole("link")).toBeNull();
    unmount();
    renderDetail({ ...base, link: "https://example.com" });
    const a = screen.getByRole("link");
    expect(a).toHaveAttribute("href", "https://example.com");
    expect(a).toHaveAttribute("target", "_blank");
    expect(a).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("close button calls onClose", async () => {
    const onClose = vi.fn();
    renderDetail(base, onClose);
    await userEvent.click(screen.getByRole("button", { name: "Close project" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

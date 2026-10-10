import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { HelmetProvider } from "react-helmet-async";
import Homepage from "./Homepage";
import { BackgroundVideoProvider } from "../context/BackgroundVideoContext";

vi.mock("./ProjectSection", () => ({ default: () => null }));

const renderHomepage = () =>
  render(
    <HelmetProvider>
      <BackgroundVideoProvider>
        <Homepage />
      </BackgroundVideoProvider>
    </HelmetProvider>
  );

describe("Homepage landing", () => {
  it("has no Enter gate and autoplays the video muted", () => {
    const { container } = renderHomepage();
    expect(screen.queryByRole("button", { name: "Enter" })).toBeNull();
    expect(screen.queryByText("(Sound on)")).toBeNull();
    const video = container.querySelector("video")!;
    expect(video.autoplay).toBe(true);
    expect(video.muted).toBe(true);
  });

  it("explicitly starts muted playback on mount (iOS ignores React's muted prop)", () => {
    const play = vi.mocked(HTMLMediaElement.prototype.play);
    play.mockClear();
    const { container } = renderHomepage();
    const video = container.querySelector("video")!;
    expect(video.defaultMuted).toBe(true);
    expect(play).toHaveBeenCalled();
  });

  it("the first click anywhere turns the sound on and hides the hint", async () => {
    const { container } = renderHomepage();
    const video = container.querySelector("video")!;
    expect(screen.getByText("Tap anywhere for sound")).toBeInTheDocument();
    await userEvent.click(document.body);
    expect(video.muted).toBe(false);
    expect(screen.queryByText("Tap anywhere for sound")).toBeNull();
  });

  it("the hint sits beside the speaker button", () => {
    renderHomepage();
    const hint = screen.getByText("Tap anywhere for sound");
    const speaker = screen.getByRole("button", { name: "Turn sound on" });
    expect(hint.parentElement).toBe(speaker.parentElement);
    expect(hint.parentElement).toHaveClass("fixed");
  });

  it("the hint hides once the page is scrolled, so it never floats over content", () => {
    renderHomepage();
    expect(screen.getByText("Tap anywhere for sound")).toBeInTheDocument();
    act(() => {
      window.scrollY = 120;
      fireEvent.scroll(window);
    });
    expect(screen.queryByText("Tap anywhere for sound")).toBeNull();
    act(() => {
      window.scrollY = 0;
      fireEvent.scroll(window);
    });
    expect(screen.getByText("Tap anywhere for sound")).toBeInTheDocument();
  });

  it("a first click on the speaker button toggles once, not twice", async () => {
    const { container } = renderHomepage();
    const video = container.querySelector("video")!;
    await userEvent.click(
      screen.getByRole("button", { name: "Turn sound on" })
    );
    expect(video.muted).toBe(false);
    expect(screen.queryByText("Tap anywhere for sound")).toBeNull();
    await userEvent.click(
      screen.getByRole("button", { name: "Turn sound off" })
    );
    expect(video.muted).toBe(true);
    await userEvent.click(document.body);
    expect(video.muted).toBe(true); // a later click never overrides the visitor's choice
  });

  it("the title animates up after a second without any interaction", () => {
    vi.useFakeTimers();
    const { container } = renderHomepage();
    const title = container
      .querySelector('img[src*="harry-style"]')!
      .closest("div.absolute")!;
    const start = title.className;
    act(() => vi.advanceTimersByTime(999));
    expect(title.className).toBe(start);
    act(() => vi.advanceTimersByTime(1));
    expect(title.className).not.toBe(start);
    vi.useRealTimers();
  });
});

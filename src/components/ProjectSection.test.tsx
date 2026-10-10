import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ProjectSection from "./ProjectSection";
import { BackgroundVideoProvider } from "../context/BackgroundVideoContext";
import type { Project } from "../types/project";
import useProjects from "../hooks/useProjects";
import useMediaQuery from "../hooks/useMediaQuery";

vi.mock("../hooks/useProjects", () => ({ default: vi.fn() }));
vi.mock("../hooks/useMediaQuery", () => ({ default: vi.fn() }));

const cover = {
  url: "https://res.cloudinary.com/x/image/upload/v1/cover.jpg",
  alt: "Cover",
};
const make = (
  slug: string,
  title: string,
  extra: Partial<Project> = {}
): Project => ({
  slug,
  title,
  description: `${title} description`,
  cover,
  photos: [],
  audio: [],
  ...extra,
});

const projects: Project[] = [
  make("a", "Alpha"),
  make("b", "Bravo", { photos: [{ url: cover.url, alt: "Bravo photo" }] }),
  make("c", "Charlie"),
];

const mockedUseProjects = vi.mocked(useProjects);
const mockedUseMediaQuery = vi.mocked(useMediaQuery);

const renderSection = () =>
  render(
    <BackgroundVideoProvider>
      <ProjectSection tag="theatre" />
    </BackgroundVideoProvider>
  );

const tileNames = (el: HTMLElement) =>
  within(el)
    .queryAllByRole("button")
    .map(b => b.getAttribute("aria-label"));

beforeEach(() => {
  mockedUseProjects.mockReturnValue({ projects, status: "ready" });
  mockedUseMediaQuery.mockReturnValue(true);
  vi.mocked(Element.prototype.scrollIntoView).mockClear();
});

describe("ProjectSection", () => {
  it("renders a tile per project in resting grid", () => {
    renderSection();
    expect(screen.getByRole("button", { name: "Alpha" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bravo" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Charlie" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
    expect(screen.queryByTestId("strip-left")).toBeNull();
    expect(screen.queryByTestId("strip-right")).toBeNull();
  });

  it("selecting b shows detail with a on left and c on right", async () => {
    renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Bravo" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Bravo" })
    ).toBeInTheDocument();
    expect(tileNames(screen.getByTestId("strip-left"))).toEqual(["Alpha"]);
    expect(tileNames(screen.getByTestId("strip-right"))).toEqual(["Charlie"]);
    expect(screen.queryByRole("button", { name: "Bravo" })).toBeNull();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "start",
    });
    expect(screen.getByRole("button", { name: "Close project" })).toHaveFocus();
  });

  it("selecting first tile leaves left strip empty", async () => {
    renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Alpha" }));
    expect(
      screen.getByRole("heading", { level: 3, name: "Alpha" })
    ).toBeInTheDocument();
    expect(tileNames(screen.getByTestId("strip-left"))).toEqual([]);
    expect(tileNames(screen.getByTestId("strip-right"))).toEqual([
      "Bravo",
      "Charlie",
    ]);
  });

  it("clicking strip tile swaps directly", async () => {
    renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Bravo" }));
    await userEvent.click(
      within(screen.getByTestId("strip-right")).getByRole("button", {
        name: "Charlie",
      })
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Charlie" })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { level: 3, name: "Bravo" })
    ).toBeNull();
    expect(tileNames(screen.getByTestId("strip-left"))).toEqual([
      "Alpha",
      "Bravo",
    ]);
    expect(tileNames(screen.getByTestId("strip-right"))).toEqual([]);
  });

  it("swapping remounts the detail", async () => {
    renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Bravo" }));
    const regionB = screen.getByRole("region", { name: "Bravo" });
    regionB.scrollTop = 200;
    await userEvent.click(
      within(screen.getByTestId("strip-right")).getByRole("button", {
        name: "Charlie",
      })
    );
    const regionC = screen.getByRole("region", { name: "Charlie" });
    expect(regionC).not.toBe(regionB);
    expect(regionC.scrollTop).toBe(0);
    expect(screen.getByRole("button", { name: "Close project" })).toHaveFocus();
  });

  it("close button resets grid and focuses the previously open tile", async () => {
    renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Bravo" }));
    await userEvent.click(
      screen.getByRole("button", { name: "Close project" })
    );
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
    expect(screen.queryByTestId("strip-left")).toBeNull();
    expect(
      screen.getAllByRole("button").map(b => b.getAttribute("aria-label"))
    ).toEqual(["Alpha", "Bravo", "Charlie"]);
    expect(screen.getByRole("button", { name: "Bravo" })).toHaveFocus();
  });

  it("closing scrolls the closed tile back into view", async () => {
    renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Bravo" }));
    const scroll = vi.mocked(Element.prototype.scrollIntoView);
    scroll.mockClear();
    await userEvent.click(
      screen.getByRole("button", { name: "Close project" })
    );
    const tile = screen.getByRole("button", { name: "Bravo" });
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(scroll.mock.contexts[0]).toBe(tile);
    expect(scroll).toHaveBeenCalledWith({ behavior: "smooth", block: "center" });
  });

  it("escape resets grid", async () => {
    renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Bravo" }));
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
    expect(screen.getByRole("button", { name: "Bravo" })).toHaveFocus();
  });

  it("escape works after focus drops to the section wrapper", async () => {
    const { container } = renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Bravo" }));
    const wrapper = container.firstElementChild as HTMLElement; // the focusable section wrapper;
    wrapper.focus();
    expect(wrapper).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("heading", { level: 3 })).toBeNull();
  });

  it("escape inside lightbox closes lightbox but keeps project open", async () => {
    renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Bravo" }));
    await userEvent.click(screen.getByRole("button", { name: "Open photo 1" }));
    expect(
      screen.getByRole("dialog", { name: "Photo viewer" })
    ).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(
      screen.getByRole("heading", { level: 3, name: "Bravo" })
    ).toBeInTheDocument();
  });

  it("mobile merges strips into one row", async () => {
    mockedUseMediaQuery.mockReturnValue(false);
    renderSection();
    await userEvent.click(screen.getByRole("button", { name: "Bravo" }));
    expect(screen.queryByTestId("strip-left")).toBeNull();
    expect(screen.queryByTestId("strip-right")).toBeNull();
    const strips = screen.getAllByTestId("strip-mobile");
    expect(strips).toHaveLength(1);
    expect(tileNames(strips[0])).toEqual(["Alpha", "Charlie"]);
    expect(
      screen.getByRole("heading", { level: 3, name: "Bravo" })
    ).toBeInTheDocument();
  });

  it('loading shows placeholders; error shows "Projects unavailable right now"', () => {
    mockedUseProjects.mockReturnValue({ projects: [], status: "loading" });
    const { unmount } = renderSection();
    expect(screen.getAllByTestId("tile-placeholder").length).toBeGreaterThan(0);
    expect(screen.queryByText("Projects unavailable right now")).toBeNull();
    unmount();

    mockedUseProjects.mockReturnValue({ projects: [], status: "error" });
    renderSection();
    expect(
      screen.getByText("Projects unavailable right now")
    ).toBeInTheDocument();
    expect(screen.queryByTestId("tile-placeholder")).toBeNull();
  });
});

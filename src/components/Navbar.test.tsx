import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Navbar from "./Navbar";
import { setInView } from "../test/intersectionObserver";

const HS_LOGO = "Handwritten logo of Harry's initials - HS";

let heroTitle: HTMLDivElement;

const renderNavbar = (openModal = vi.fn()) =>
  render(
    <Navbar openModal={openModal} heroTitleRef={{ current: heroTitle }} />
  );

const bar = () => screen.getByRole("navigation").firstElementChild!;
const phoneLogo = () =>
  screen
    .queryAllByAltText(HS_LOGO)
    .find(img => img.closest("a")?.classList.contains("md:hidden"));

describe("Navbar on phones", () => {
  beforeEach(() => {
    heroTitle = document.createElement("div");
    document.body.appendChild(heroTitle);
  });

  it("shows only the menu toggle while the hero title is in view", () => {
    renderNavbar();
    setInView(heroTitle, true);
    expect(
      screen.getByRole("button", { name: "Open menu" })
    ).toBeInTheDocument();
    expect(phoneLogo()).toBeUndefined();
    expect(bar()).not.toHaveClass("max-md:bg-tangerine");
  });

  it("shows the tangerine bar and HS logo once the hero title has scrolled under the bar", () => {
    renderNavbar();
    setInView(heroTitle, false, -50);
    expect(phoneLogo()).toBeDefined();
    expect(bar()).toHaveClass("max-md:bg-tangerine");

    setInView(heroTitle, true);
    expect(phoneLogo()).toBeUndefined();
    expect(bar()).not.toHaveClass("max-md:bg-tangerine");
  });

  it("switches instantly on phones, so the title never shows through a fading bar", () => {
    renderNavbar();
    expect(bar()).toHaveClass("max-md:transition-none");
  });

  it("the toggle opens and closes the full-screen menu", async () => {
    renderNavbar();
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-menu")).toBeNull();

    await userEvent.click(toggle);
    expect(toggle).toHaveAccessibleName("Close menu");
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(toggle).toHaveClass("tham-active");
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();

    await userEvent.click(toggle);
    expect(toggle).toHaveAccessibleName("Open menu");
    expect(document.getElementById("mobile-menu")).toBeNull();
  });

  it("stops the page scrolling while the menu is open", async () => {
    renderNavbar();
    const toggle = screen.getByRole("button", { name: "Open menu" });
    await userEvent.click(toggle);
    expect(document.body.style.overflow).toBe("hidden");
    await userEvent.click(toggle);
    expect(document.body.style.overflow).toBe("");
  });

  it("tapping a link closes the menu", async () => {
    renderNavbar();
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = document.getElementById("mobile-menu")!;
    await userEvent.click(menu.querySelector('a[href="#theatre"]')!);
    expect(document.getElementById("mobile-menu")).toBeNull();
    expect(document.body.style.overflow).toBe("");
  });

  it("Get in touch closes the menu and opens the email modal", async () => {
    const openModal = vi.fn();
    renderNavbar(openModal);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    const menu = document.getElementById("mobile-menu")!;
    await userEvent.click(menu.querySelector("button")!);
    expect(openModal).toHaveBeenCalledTimes(1);
    expect(document.getElementById("mobile-menu")).toBeNull();
  });

  it("Escape closes the menu", async () => {
    renderNavbar();
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    await userEvent.keyboard("{Escape}");
    expect(document.getElementById("mobile-menu")).toBeNull();
  });
});

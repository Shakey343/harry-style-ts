import { describe, it, expect, afterEach, vi } from "vitest";
import { render } from "@testing-library/react";
import SoundCloudEmbed from "./SoundCloudEmbed";
import InstagramEmbed from "./InstagramEmbed";
import loadScript from "../../utils/loadScript";

vi.mock("../../context/BackgroundVideoContext", () => ({
  useBackgroundVideo: () => ({ mute: vi.fn() }),
}));

afterEach(() => {
  document.head.innerHTML = "";
});

describe("embeds", () => {
  it("soundcloud renders iframe for valid url", () => {
    const { container } = render(
      <SoundCloudEmbed url="https://soundcloud.com/a/b" />
    );
    const iframe = container.querySelector("iframe")!;
    expect(iframe.getAttribute("title")).toBe("SoundCloud player");
    expect(iframe.getAttribute("src")).toContain("w.soundcloud.com/player/");
    expect(iframe.getAttribute("height")).toBe("166");
    expect(iframe.getAttribute("allow")).toBe("autoplay");
  });

  it("soundcloud renders nothing for invalid url", () => {
    const { container } = render(<SoundCloudEmbed url="https://evil.com/x" />);
    expect(container.firstChild).toBeNull();
  });

  it("instagram renders nothing for invalid url", () => {
    const { container } = render(
      <InstagramEmbed url="https://evil.com/p/x/" />
    );
    expect(container.firstChild).toBeNull();
    expect(document.querySelector("script")).toBeNull();
  });

  it("loadScript appends a single script for repeated calls", () => {
    const src = "https://example.com/once.js";
    const a = loadScript(src);
    const b = loadScript(src);
    expect(a).toBe(b);
    expect(document.querySelectorAll(`script[src="${src}"]`).length).toBe(1);
  });
});

import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AudioPlayer from "./AudioPlayer";

const mute = vi.fn();
vi.mock("../../context/BackgroundVideoContext", () => ({
  useBackgroundVideo: () => ({ mute }),
}));

const a = { url: "https://x/a.mp3", name: "Track A" };
const b = { url: "https://x/b.mp3", name: "Track B" };

const audioFor = (container: HTMLElement) =>
  container.querySelector("audio") as HTMLAudioElement;

describe("AudioPlayer", () => {
  beforeEach(() => {
    mute.mockClear();
    vi.mocked(HTMLMediaElement.prototype.play).mockClear?.();
    vi.mocked(HTMLMediaElement.prototype.pause).mockClear?.();
  });

  it("play calls audio.play and mutes background video", async () => {
    render(<AudioPlayer track={a} />);
    await userEvent.click(screen.getByRole("button", { name: "Play Track A" }));
    expect(mute).toHaveBeenCalledTimes(1);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
  });

  it("playing a second player pauses the first", async () => {
    const { container } = render(
      <>
        <AudioPlayer track={a} />
        <AudioPlayer track={b} />
      </>
    );
    const [first] = Array.from(container.querySelectorAll("audio"));
    const pauseSpy = vi.fn();
    first.pause = pauseSpy;
    await userEvent.click(screen.getByRole("button", { name: "Play Track A" }));
    expect(pauseSpy).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Play Track B" }));
    expect(pauseSpy).toHaveBeenCalledTimes(1);
  });

  it("toggles label between Play and Pause", async () => {
    const { container } = render(<AudioPlayer track={a} />);
    const el = audioFor(container);
    await userEvent.click(screen.getByRole("button", { name: "Play Track A" }));
    act(() => {
      el.dispatchEvent(new Event("play"));
    });
    expect(screen.getByRole("button", { name: "Pause Track A" })).toBeTruthy();
    act(() => {
      el.dispatchEvent(new Event("pause"));
    });
    expect(screen.getByRole("button", { name: "Play Track A" })).toBeTruthy();
  });

  it("reports progress 0-100 from timeupdate", () => {
    const { container } = render(<AudioPlayer track={a} />);
    const el = audioFor(container);
    Object.defineProperty(el, "duration", { value: 200, configurable: true });
    Object.defineProperty(el, "currentTime", { value: 50, configurable: true });
    fireEvent.timeUpdate(el);
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe(
      "25"
    );
  });

  const rejectPlay = (name: string) =>
    vi
      .mocked(HTMLMediaElement.prototype.play)
      .mockImplementationOnce(() =>
        Promise.reject(Object.assign(new Error("x"), { name }))
      );

  it("rejected play does not throw or flip to Pause", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    rejectPlay("NotAllowedError");
    render(<AudioPlayer track={a} />);
    await userEvent.click(screen.getByRole("button", { name: "Play Track A" }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(screen.getByRole("button", { name: "Play Track A" })).toBeTruthy();
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0].join(" ")).toContain("Track A");
    warn.mockRestore();
  });

  it("abort error is swallowed silently", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    rejectPlay("AbortError");
    render(<AudioPlayer track={a} />);
    await userEvent.click(screen.getByRole("button", { name: "Play Track A" }));
    await act(async () => {
      await Promise.resolve();
    });
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it("unmounting pauses and releases the claim", async () => {
    const first = render(<AudioPlayer track={a} />);
    const el = audioFor(first.container);
    const pauseSpy = vi.fn();
    el.pause = pauseSpy;
    await userEvent.click(screen.getByRole("button", { name: "Play Track A" }));
    first.unmount();
    expect(pauseSpy).toHaveBeenCalledTimes(1);
    const second = render(<AudioPlayer track={b} />);
    await userEvent.click(screen.getByRole("button", { name: "Play Track B" }));
    expect(pauseSpy).toHaveBeenCalledTimes(1);
    second.unmount();
  });
});

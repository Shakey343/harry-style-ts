import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useEmbedPlayback from "./useEmbedPlayback";
import { claimPlayback, releasePlayback } from "./activeAudio";

const mute = vi.fn();
vi.mock("../../context/BackgroundVideoContext", () => ({
  useBackgroundVideo: () => ({ mute }),
}));

describe("useEmbedPlayback", () => {
  beforeEach(() => mute.mockClear());

  it("starting an embed mutes the background video and pauses the playing mp3", () => {
    const mp3 = { pause: vi.fn() };
    claimPlayback(mp3);
    const { result } = renderHook(() => useEmbedPlayback(vi.fn()));
    act(() => result.current());
    expect(mute).toHaveBeenCalledTimes(1);
    expect(mp3.pause).toHaveBeenCalledTimes(1);
    releasePlayback(mp3);
  });

  it("starting an mp3 pauses the playing embed", () => {
    const pauseEmbed = vi.fn();
    const { result } = renderHook(() => useEmbedPlayback(pauseEmbed));
    act(() => result.current());
    claimPlayback({ pause: vi.fn() });
    expect(pauseEmbed).toHaveBeenCalledTimes(1);
  });

  it("repeated play notifications from the same embed never pause itself", () => {
    const pauseEmbed = vi.fn();
    const { result, rerender } = renderHook(() => useEmbedPlayback(pauseEmbed));
    act(() => result.current());
    rerender();
    act(() => result.current());
    expect(pauseEmbed).not.toHaveBeenCalled();
  });

  it("uses the latest pause callback", () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ pause }) => useEmbedPlayback(pause),
      {
        initialProps: { pause: first },
      }
    );
    act(() => result.current());
    rerender({ pause: second });
    claimPlayback({ pause: vi.fn() });
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
  });

  it("unmounting releases the claim so it is not paused later", () => {
    const pauseEmbed = vi.fn();
    const { result, unmount } = renderHook(() => useEmbedPlayback(pauseEmbed));
    act(() => result.current());
    unmount();
    claimPlayback({ pause: vi.fn() });
    expect(pauseEmbed).not.toHaveBeenCalled();
  });
});

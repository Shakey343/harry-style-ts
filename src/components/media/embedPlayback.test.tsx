import { render, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import SoundCloudEmbed from "./SoundCloudEmbed";
import YouTubeEmbed from "./YouTubeEmbed";
import SpotifyEmbed from "./SpotifyEmbed";
import InstagramEmbed from "./InstagramEmbed";
import { claimPlayback } from "./activeAudio";

const mute = vi.fn();
vi.mock("../../context/BackgroundVideoContext", () => ({
  useBackgroundVideo: () => ({ mute }),
}));
vi.mock("../../utils/loadScript", () => ({
  default: vi.fn(() => Promise.resolve()),
}));

// Another player starting (e.g. an MP3) — should pause whichever embed is playing.
const startAnotherPlayer = () => claimPlayback({ pause: vi.fn() });

beforeEach(() => mute.mockClear());
afterEach(() => {
  delete window.SC;
  delete window.YT;
});

describe("SoundCloudEmbed playback", () => {
  it("mutes the background video on PLAY and pauses when another player starts", async () => {
    const widget = { bind: vi.fn(), unbind: vi.fn(), pause: vi.fn() };
    window.SC = {
      Widget: Object.assign(
        vi.fn(() => widget),
        { Events: { PLAY: "play" } }
      ),
    };
    const { container } = render(
      <SoundCloudEmbed url="https://soundcloud.com/a/b" />
    );

    await waitFor(() =>
      expect(widget.bind).toHaveBeenCalledWith("play", expect.any(Function))
    );
    expect(window.SC.Widget).toHaveBeenCalledWith(
      container.querySelector("iframe")
    );

    act(() => widget.bind.mock.calls[0][1]());
    expect(mute).toHaveBeenCalledTimes(1);

    startAnotherPlayer();
    expect(widget.pause).toHaveBeenCalledTimes(1);
  });
});

describe("SoundCloudEmbed unmount", () => {
  it("closing the project doesn't touch the removed iframe, and later events are ignored", async () => {
    // The real widget talks to the iframe via postMessage, which throws once
    // React has removed the iframe.
    const widget = {
      bind: vi.fn(),
      unbind: vi.fn(() => {
        throw new TypeError(
          "Cannot read properties of null (reading 'postMessage')"
        );
      }),
      pause: vi.fn(),
    };
    window.SC = {
      Widget: Object.assign(
        vi.fn(() => widget),
        { Events: { PLAY: "play" } }
      ),
    };
    const { unmount } = render(
      <SoundCloudEmbed url="https://soundcloud.com/a/b" />
    );
    await waitFor(() => expect(widget.bind).toHaveBeenCalled());

    expect(() => unmount()).not.toThrow();
    act(() => widget.bind.mock.calls[0][1]());
    expect(mute).not.toHaveBeenCalled();
  });
});

describe("YouTubeEmbed", () => {
  it("renders a nocookie player for a valid link and nothing for an invalid one", () => {
    window.YT = { Player: vi.fn(), PlayerState: { PLAYING: 1 } };
    const { container, unmount } = render(
      <YouTubeEmbed url="https://youtu.be/dQw4w9WgXcQ" />
    );
    const iframe = container.querySelector("iframe")!;
    expect(iframe.getAttribute("title")).toBe("YouTube player");
    expect(iframe.getAttribute("src")).toContain(
      "youtube-nocookie.com/embed/dQw4w9WgXcQ?enablejsapi=1"
    );
    unmount();
    const invalid = render(
      <YouTubeEmbed url="https://evil.com/watch?v=dQw4w9WgXcQ" />
    );
    expect(invalid.container.firstChild).toBeNull();
  });

  it("mutes the background video when playing starts and pauses when another player starts", async () => {
    const player = { pauseVideo: vi.fn() };
    let events: { onStateChange: (e: { data: number }) => void } | undefined;
    window.YT = {
      // A regular function: the component calls it with `new`.
      Player: vi.fn(function (
        _el: HTMLIFrameElement,
        opts: { events: typeof events }
      ) {
        events = opts.events;
        return player;
      }),
      PlayerState: { PLAYING: 1 },
    };
    render(<YouTubeEmbed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />);
    await waitFor(() => expect(events).toBeDefined());

    act(() => events!.onStateChange({ data: 2 }));
    expect(mute).not.toHaveBeenCalled();
    act(() => events!.onStateChange({ data: 1 }));
    expect(mute).toHaveBeenCalledTimes(1);

    startAnotherPlayer();
    expect(player.pauseVideo).toHaveBeenCalledTimes(1);
  });
});

describe("SpotifyEmbed", () => {
  it("renders nothing for an invalid link", () => {
    const { container } = render(
      <SpotifyEmbed url="https://open.spotify.com/user/x" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("creates a controller, mutes once per play and pauses when another player starts", async () => {
    let listener: ((e: { data: { isPaused: boolean } }) => void) | undefined;
    const controller = {
      addListener: vi.fn((_name: string, cb: typeof listener) => {
        listener = cb;
      }),
      pause: vi.fn(),
      destroy: vi.fn(),
    };
    const api = {
      createController: vi.fn(
        (
          _el: HTMLElement,
          _opts: { uri: string },
          cb: (c: typeof controller) => void
        ) => cb(controller)
      ),
    };
    const { unmount } = render(
      <SpotifyEmbed url="https://open.spotify.com/track/abc123?si=x" />
    );
    await waitFor(() =>
      expect(window.onSpotifyIframeApiReady).toBeTypeOf("function")
    );
    act(() => window.onSpotifyIframeApiReady!(api));

    await waitFor(() => expect(api.createController).toHaveBeenCalled());
    expect(api.createController.mock.calls[0][1].uri).toBe(
      "spotify:track:abc123"
    );
    expect(controller.addListener).toHaveBeenCalledWith(
      "playback_update",
      expect.any(Function)
    );

    act(() => listener!({ data: { isPaused: false } }));
    act(() => listener!({ data: { isPaused: false } }));
    expect(mute).toHaveBeenCalledTimes(1);
    act(() => listener!({ data: { isPaused: true } }));
    act(() => listener!({ data: { isPaused: false } }));
    expect(mute).toHaveBeenCalledTimes(2);

    startAnotherPlayer();
    expect(controller.pause).toHaveBeenCalledTimes(1);

    unmount();
    expect(controller.destroy).toHaveBeenCalledTimes(1);
  });
});

describe("InstagramEmbed playback", () => {
  it("mutes the background video when the visitor clicks into the post", async () => {
    vi.useFakeTimers();
    const { container } = render(
      <InstagramEmbed url="https://www.instagram.com/p/ABC123/" />
    );
    const iframe = document.createElement("iframe");
    container.firstElementChild!.appendChild(iframe); // what Instagram's embed.js does

    const outside = document.createElement("button");
    document.body.appendChild(outside);
    outside.focus();
    act(() => {
      window.dispatchEvent(new Event("blur"));
      vi.runAllTimers();
    });
    expect(mute).not.toHaveBeenCalled();

    iframe.focus();
    act(() => {
      window.dispatchEvent(new Event("blur"));
      vi.runAllTimers();
    });
    expect(mute).toHaveBeenCalledTimes(1);
    outside.remove();
    vi.useRealTimers();
  });
});

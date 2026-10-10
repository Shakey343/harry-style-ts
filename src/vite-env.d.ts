/// <reference types="vite/client" />

// Minimal shapes of the third-party player APIs the embeds use.
interface SoundCloudWidget {
  bind: (event: string, handler: () => void) => void;
  unbind: (event: string) => void;
  pause: () => void;
}

interface YouTubePlayer {
  pauseVideo: () => void;
}

interface YouTubeApi {
  Player: new (
    el: HTMLIFrameElement,
    opts: { events: { onStateChange: (e: { data: number }) => void } }
  ) => YouTubePlayer;
  PlayerState: { PLAYING: number };
}

interface SpotifyController {
  addListener: (
    event: string,
    cb: (e: { data: { isPaused: boolean } }) => void
  ) => void;
  pause: () => void;
  destroy: () => void;
}

interface SpotifyIframeApi {
  createController: (
    el: HTMLElement,
    opts: { uri: string; width?: string | number; height?: string | number },
    cb: (controller: SpotifyController) => void
  ) => void;
}

interface Window {
  instgrm?: { Embeds: { process: () => void } };
  SC?: {
    Widget: ((iframe: HTMLIFrameElement) => SoundCloudWidget) & {
      Events: { PLAY: string };
    };
  };
  YT?: YouTubeApi;
  onYouTubeIframeAPIReady?: () => void;
  onSpotifyIframeApiReady?: (api: SpotifyIframeApi) => void;
}

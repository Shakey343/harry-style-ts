import { loadScript } from "./loadScript";

// YouTube and Spotify announce readiness through a global callback rather
// than the script's load event, so each loader waits for that callback.

let youTube: Promise<YouTubeApi> | null = null;

export function loadYouTubeApi(): Promise<YouTubeApi> {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!youTube) {
    youTube = new Promise((resolve, reject) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        if (window.YT) resolve(window.YT);
      };
      loadScript("https://www.youtube.com/iframe_api").catch((err) => {
        youTube = null;
        reject(err);
      });
    });
  }
  return youTube;
}

let spotify: Promise<SpotifyIframeApi> | null = null;

export function loadSpotifyApi(): Promise<SpotifyIframeApi> {
  if (!spotify) {
    spotify = new Promise((resolve, reject) => {
      window.onSpotifyIframeApiReady = (api) => resolve(api);
      loadScript("https://open.spotify.com/embed/iframe-api/v1").catch((err) => {
        spotify = null;
        reject(err);
      });
    });
  }
  return spotify;
}

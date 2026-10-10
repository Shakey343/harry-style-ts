import { useEffect, useRef, useState } from "react";
import { spotifyEmbedPath } from "../../utils/embeds";
import { loadSpotifyApi } from "../../utils/playerApis";
import { useEmbedPlayback } from "./useEmbedPlayback";

// Single items get the compact player; collections get the taller list player.
const heightFor = (path: string) =>
  path.startsWith("track/") || path.startsWith("episode/") ? 152 : 352;

const SpotifyEmbed = ({ url }: { url: string }) => {
  const path = spotifyEmbedPath(url);
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);
  const [failed, setFailed] = useState(false);
  const onPlay = useEmbedPlayback(() => controllerRef.current?.pause());

  useEffect(() => {
    if (!path || !hostRef.current) {
      return;
    }
    let cancelled = false;
    let paused = true;
    // Spotify replaces the element it's given with its iframe, so hand it a
    // child React doesn't manage.
    const target = document.createElement("div");
    hostRef.current.appendChild(target);
    loadSpotifyApi()
      .then((api) => {
        if (cancelled) return;
        api.createController(
          target,
          { uri: `spotify:${path.replace("/", ":")}`, width: "100%", height: heightFor(path) },
          (controller) => {
            if (cancelled) {
              controller.destroy();
              return;
            }
            controllerRef.current = controller;
            // playback_update repeats while playing; act only when it starts.
            controller.addListener("playback_update", (e) => {
              if (paused && !e.data.isPaused) onPlay();
              paused = e.data.isPaused;
            });
          }
        );
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
      try {
        controllerRef.current?.destroy();
      } catch {
        // Third-party cleanup must never take the page down (cf. SoundCloud,
        // whose widget throws once its iframe is detached).
      }
      controllerRef.current = null;
      target.remove();
    };
  }, [path, onPlay]);

  if (!path) {
    return null;
  }
  if (failed) {
    return (
      <iframe
        title="Spotify player"
        width="100%"
        height={heightFor(path)}
        allow="autoplay; encrypted-media"
        loading="lazy"
        src={`https://open.spotify.com/embed/${path}`}
      />
    );
  }
  return <div ref={hostRef} className="w-full" />;
};

export default SpotifyEmbed;

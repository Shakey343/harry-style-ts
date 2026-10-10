import { useEffect, useRef } from "react";
import { isInstagramPostUrl } from "../../utils/embeds";
import loadScript from "../../utils/loadScript";
import useEmbedPlayback from "./useEmbedPlayback";

const EMBED_SCRIPT = "https://www.instagram.com/embed.js";

const InstagramEmbed = ({ url }: { url: string }) => {
  const valid = isInstagramPostUrl(url);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Instagram has no player API, so it can't be paused from outside.
  const onPlay = useEmbedPlayback(() => {});

  useEffect(() => {
    if (!valid) {
      return;
    }
    let cancelled = false;
    loadScript(EMBED_SCRIPT)
      .then(() => {
        if (!cancelled) {
          window.instgrm?.Embeds.process();
        }
      })
      .catch(() => {
        // Script failed to load: the blockquote link remains as the fallback.
      });
    return () => {
      cancelled = true;
    };
  }, [valid, url]);

  // Best available signal of playback: the page loses focus to the post's
  // iframe when the visitor clicks into it (e.g. to play a video).
  useEffect(() => {
    if (!valid) {
      return;
    }
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onWindowBlur = () => {
      timer = setTimeout(() => {
        const focused = document.activeElement;
        if (
          focused instanceof HTMLIFrameElement &&
          wrapperRef.current?.contains(focused)
        ) {
          onPlay();
        }
      }, 0);
    };
    window.addEventListener("blur", onWindowBlur);
    return () => {
      window.removeEventListener("blur", onWindowBlur);
      clearTimeout(timer);
    };
  }, [valid, onPlay]);

  if (!valid) {
    return null;
  }
  return (
    <div ref={wrapperRef}>
      <blockquote className="instagram-media" data-instgrm-permalink={url}>
        <a href={url} target="_blank" rel="noopener noreferrer">
          View this post on Instagram
        </a>
      </blockquote>
    </div>
  );
};

export default InstagramEmbed;

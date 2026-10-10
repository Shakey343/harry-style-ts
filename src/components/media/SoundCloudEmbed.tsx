import { useEffect, useRef } from "react";
import { isSoundCloudUrl, soundCloudEmbedSrc } from "../../utils/embeds";
import { loadScript } from "../../utils/loadScript";
import { useEmbedPlayback } from "./useEmbedPlayback";

const WIDGET_API = "https://w.soundcloud.com/player/api.js";

const SoundCloudEmbed = ({ url }: { url: string }) => {
  const valid = isSoundCloudUrl(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SoundCloudWidget | null>(null);
  const onPlay = useEmbedPlayback(() => widgetRef.current?.pause());

  useEffect(() => {
    if (!valid) {
      return;
    }
    let cancelled = false;
    loadScript(WIDGET_API)
      .then(() => {
        if (cancelled || !iframeRef.current || !window.SC) return;
        const widget = window.SC.Widget(iframeRef.current);
        widget.bind(window.SC.Widget.Events.PLAY, () => {
          if (!cancelled) onPlay();
        });
        widgetRef.current = widget;
      })
      .catch(() => {
        // Without the widget API the player still works; it just can't mute the video.
      });
    // No unbind: by cleanup time React has removed the iframe and the widget
    // would throw talking to it. The cancelled flag silences late events.
    return () => {
      cancelled = true;
      widgetRef.current = null;
    };
  }, [valid, url, onPlay]);

  if (!valid) {
    return null;
  }
  return (
    <iframe
      ref={iframeRef}
      title="SoundCloud player"
      width="100%"
      height={166}
      allow="autoplay"
      loading="lazy"
      src={soundCloudEmbedSrc(url)}
    />
  );
};

export default SoundCloudEmbed;

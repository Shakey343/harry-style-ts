import { useEffect, useRef } from "react";
import { youTubeEmbedSrc, youTubeVideoId } from "../../utils/embeds";
import { loadYouTubeApi } from "../../utils/playerApis";
import useEmbedPlayback from "./useEmbedPlayback";

const YouTubeEmbed = ({ url }: { url: string }) => {
  const id = youTubeVideoId(url);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const onPlay = useEmbedPlayback(() => playerRef.current?.pauseVideo());

  useEffect(() => {
    if (!id) {
      return;
    }
    let cancelled = false;
    loadYouTubeApi()
      .then(YT => {
        if (cancelled || !iframeRef.current) return;
        playerRef.current = new YT.Player(iframeRef.current, {
          events: {
            onStateChange: e => {
              if (!cancelled && e.data === YT.PlayerState.PLAYING) onPlay();
            },
          },
        });
      })
      .catch(() => {
        // Without the API the video still plays; it just can't mute the background.
      });
    return () => {
      cancelled = true;
      playerRef.current = null;
    };
  }, [id, onPlay]);

  if (!id) {
    return null;
  }
  return (
    <div className="aspect-video w-full">
      <iframe
        ref={iframeRef}
        title="YouTube player"
        className="h-full w-full"
        src={youTubeEmbedSrc(id, window.location.origin)}
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
};

export default YouTubeEmbed;

import { useEffect } from "react";
import { isInstagramPostUrl } from "../../utils/embeds";
import { loadScript } from "../../utils/loadScript";

const EMBED_SCRIPT = "https://www.instagram.com/embed.js";

const InstagramEmbed = ({ url }: { url: string }) => {
  const valid = isInstagramPostUrl(url);

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

  if (!valid) {
    return null;
  }
  return (
    <blockquote className="instagram-media" data-instgrm-permalink={url}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        View this post on Instagram
      </a>
    </blockquote>
  );
};

export default InstagramEmbed;

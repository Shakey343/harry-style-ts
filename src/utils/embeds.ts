function parseHttps(url: string): URL | null {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" ? parsed : null;
  } catch {
    return null;
  }
}

function hostMatches(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`);
}

export function isSoundCloudUrl(url: string): boolean {
  const parsed = parseHttps(url);
  return parsed !== null && hostMatches(parsed.hostname, "soundcloud.com");
}

export function soundCloudEmbedSrc(url: string): string {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23f5a58c&visual=false`;
}

export function isInstagramPostUrl(url: string): boolean {
  const parsed = parseHttps(url);
  return (
    parsed !== null &&
    hostMatches(parsed.hostname, "instagram.com") &&
    /^\/(p|reel)\/[^/]+\/?$/.test(parsed.pathname)
  );
}

const SPOTIFY_TYPES = [
  "track",
  "album",
  "playlist",
  "episode",
  "show",
  "artist",
];

// "<type>/<id>" from https://open.spotify.com/[intl-xx/]<type>/<id>.
export function spotifyEmbedPath(url: string): string | null {
  const parsed = parseHttps(url);
  if (parsed === null || parsed.hostname !== "open.spotify.com") return null;
  const match = parsed.pathname.match(
    /^(?:\/intl-[a-z-]+)?\/([a-z]+)\/([A-Za-z0-9]+)\/?$/
  );
  if (match === null || !SPOTIFY_TYPES.includes(match[1])) return null;
  return `${match[1]}/${match[2]}`;
}

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/;

export function youTubeVideoId(url: string): string | null {
  const parsed = parseHttps(url);
  if (parsed === null) return null;
  let id: string | null = null;
  if (parsed.hostname === "youtu.be") {
    id = parsed.pathname.slice(1);
  } else if (hostMatches(parsed.hostname, "youtube.com")) {
    const path = parsed.pathname.match(/^\/(?:shorts|embed)\/([^/]+)\/?$/);
    id =
      parsed.pathname === "/watch"
        ? parsed.searchParams.get("v")
        : path && path[1];
  }
  return id !== null && YOUTUBE_ID.test(id) ? id : null;
}

export function youTubeEmbedSrc(id: string, origin: string): string {
  return `https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&origin=${encodeURIComponent(origin)}`;
}

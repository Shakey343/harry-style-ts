function parseHttps(url: string): URL | null {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'https:' ? parsed : null
  } catch {
    return null
  }
}

function hostMatches(hostname: string, domain: string): boolean {
  return hostname === domain || hostname.endsWith(`.${domain}`)
}

export function isSoundCloudUrl(url: string): boolean {
  const parsed = parseHttps(url)
  return parsed !== null && hostMatches(parsed.hostname, 'soundcloud.com')
}

export function soundCloudEmbedSrc(url: string): string {
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23f5a58c&visual=false`
}

export function isInstagramPostUrl(url: string): boolean {
  const parsed = parseHttps(url)
  return (
    parsed !== null &&
    hostMatches(parsed.hostname, 'instagram.com') &&
    /^\/(p|reel)\/[^/]+\/?$/.test(parsed.pathname)
  )
}

import {
  isSoundCloudUrl,
  soundCloudEmbedSrc,
  isInstagramPostUrl,
  spotifyEmbedPath,
  youTubeVideoId,
  youTubeEmbedSrc,
} from "./embeds";

describe("isSoundCloudUrl", () => {
  it("accepts soundcloud hosts", () => {
    expect(isSoundCloudUrl("https://soundcloud.com/a/b")).toBe(true);
    expect(isSoundCloudUrl("https://m.soundcloud.com/a")).toBe(true);
  });
  it("rejects others", () => {
    expect(isSoundCloudUrl("http://evil.com/soundcloud.com")).toBe(false);
    expect(isSoundCloudUrl("not a url")).toBe(false);
    expect(isSoundCloudUrl("")).toBe(false);
  });
});

describe("soundCloudEmbedSrc", () => {
  it("builds the player url", () => {
    expect(soundCloudEmbedSrc("https://soundcloud.com/a/b")).toBe(
      "https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fa%2Fb&color=%23f5a58c&visual=false"
    );
  });
});

describe("isInstagramPostUrl", () => {
  it("accepts posts and reels", () => {
    expect(isInstagramPostUrl("https://www.instagram.com/p/ABC123/")).toBe(
      true
    );
    expect(isInstagramPostUrl("https://instagram.com/reel/XYZ")).toBe(true);
  });
  it("rejects profiles and other hosts", () => {
    expect(isInstagramPostUrl("https://www.instagram.com/harry/")).toBe(false);
    expect(isInstagramPostUrl("https://example.com/p/ABC123/")).toBe(false);
  });
});

describe("spotifyEmbedPath", () => {
  it("returns type/id for supported spotify links", () => {
    expect(
      spotifyEmbedPath("https://open.spotify.com/track/4uLU6hMCjMI75M1A2tKUQC")
    ).toBe("track/4uLU6hMCjMI75M1A2tKUQC");
    expect(
      spotifyEmbedPath("https://open.spotify.com/album/abc123?si=xyz")
    ).toBe("album/abc123");
    expect(
      spotifyEmbedPath("https://open.spotify.com/intl-de/playlist/p1")
    ).toBe("playlist/p1");
    expect(spotifyEmbedPath("https://open.spotify.com/episode/e1/")).toBe(
      "episode/e1"
    );
    expect(spotifyEmbedPath("https://open.spotify.com/show/s1")).toBe(
      "show/s1"
    );
    expect(spotifyEmbedPath("https://open.spotify.com/artist/a1")).toBe(
      "artist/a1"
    );
  });
  it("rejects other links", () => {
    expect(
      spotifyEmbedPath("https://open.spotify.com/user/someone")
    ).toBeNull();
    expect(spotifyEmbedPath("http://open.spotify.com/track/x")).toBeNull();
    expect(
      spotifyEmbedPath("https://evil.com/open.spotify.com/track/x")
    ).toBeNull();
    expect(spotifyEmbedPath("not a url")).toBeNull();
  });
});

describe("youTubeVideoId", () => {
  it("extracts the id from supported youtube links", () => {
    expect(youTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
    expect(
      youTubeVideoId("https://youtube.com/watch?v=dQw4w9WgXcQ&t=42s")
    ).toBe("dQw4w9WgXcQ");
    expect(youTubeVideoId("https://m.youtube.com/watch?v=dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
    expect(youTubeVideoId("https://youtu.be/dQw4w9WgXcQ?si=abc")).toBe(
      "dQw4w9WgXcQ"
    );
    expect(youTubeVideoId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
    expect(youTubeVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe(
      "dQw4w9WgXcQ"
    );
  });
  it("rejects other links", () => {
    expect(youTubeVideoId("https://www.youtube.com/@harry")).toBeNull();
    expect(
      youTubeVideoId("https://www.youtube.com/watch?v=bad id!")
    ).toBeNull();
    expect(youTubeVideoId("https://evil.com/watch?v=dQw4w9WgXcQ")).toBeNull();
    expect(youTubeVideoId("http://youtu.be/dQw4w9WgXcQ")).toBeNull();
  });
});

describe("youTubeEmbedSrc", () => {
  it("builds a nocookie player url with the JS API enabled", () => {
    expect(youTubeEmbedSrc("dQw4w9WgXcQ", "https://www.harrystyle.co.uk")).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?enablejsapi=1&origin=https%3A%2F%2Fwww.harrystyle.co.uk"
    );
  });
});

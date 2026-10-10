# Project Showcase — Design

**Date:** 2026-10-03
**Repos:** `harry-style` (frontend), `api-harry-style` (backend)
**Branch (both repos):** `feature/project-showcase`
**Revised:** 2026-10-05, to match the implementation: dynamic folders confirmed, built-in Title/Description fields, cache hardening, sanitized logging, PDFs ignored. 2026-10-10: Spotify and YouTube embeds; embeds coordinate playback; layout fixes (panel below navbar, sized to content, phone layout, Theatre title above the fold).

## Goal

Turn each project on the homepage from a single linked image into a rich, expandable showcase that Harry manages entirely himself from Cloudinary. Everything stays on the homepage; there is no separate project page.

### Success criteria

- Harry can add, edit, reorder and remove projects and their photos/audio using only the Cloudinary Media Library, with no code changes or redeploys.
- Every project shows title, description and cover image; blurb, photos, MP3s, SoundCloud, Spotify, YouTube and Instagram appear only when present.
- Clicking a tile expands it to screen height in place; other tiles shrink into side strips and can be clicked to swap directly.
- Tiles gently bob and tilt at rest; motion is disabled for users who prefer reduced motion.
- Malformed content in Cloudinary degrades gracefully (project or block skipped), never breaks the page.
- The site has a favicon set that meets Google's search-result requirements.

### Assumptions

- Harry's Cloudinary account uses **dynamic folders** (confirmed 2026-10-05 against the live account). Each asset carries an `asset_folder` and a Media Library `display_name`. Its `public_id` is an opaque upload id that contains no folder path.
- The Theatre and More Projects sections remain as they are.
- Harry is non-technical; conventions must be learnable from a one-page guide.

## 1. Cloudinary content convention

```
theatre/
  01-shantify/
    cover.jpg            ← metadata: Title, Description (built-in), blurb, link_to, soundcloud, spotify, youtube, instagram
    01-rehearsal.jpg     ← optional built-in Description (used as alt text)
    02-opening-night.jpg
    sea-shanty-medley.mp3
  02-pippin/
    cover.jpg
more-projects/
  01-ashatones/
    ...
```

Rules (all implemented in `buildProjects`):

- **Sections** are the top-level folders `theatre` and `more-projects`.
- **A project** is an asset folder exactly one level below a section folder (`asset_folder` = `<section>/<name>`). Its `slug` is the folder name without its number prefix, lower-cased (`01-Shantify` → `shantify`). Folder names are used as typed: `01-rock_castle` → `rock_castle`.
- **Names**: an asset's name is its `display_name` (what Harry sees and renames in the Media Library) with a known file extension removed (`cover.jpg` → `cover`). If `display_name` is missing, the last segment of `public_id` is used. No random-suffix stripping is applied.
- **Ordering** (projects and photos alike): by leading integer prefix (`01-`, `2-`, `10-`) ascending; items with no prefix come after all numbered items, sorted alphabetically.
- **Cover**: the image whose name is `cover` (case-insensitive). Required.
- **Metadata**: Cloudinary context fields on the cover.
    - **Title** (required): a custom `title` field, or else the Media Library's built-in **Title** (stored as `caption`).
    - **Description**: a custom `description` field, or else the built-in **Description** (stored as `alt`).
    - **Custom fields**: `blurb`, `link_to`, `soundcloud`, `spotify`, `youtube`, `instagram` (one link each).
    - All except the title are optional.
- **Photos**: every other image in the folder. The photo's built-in Description (`alt`) is its alt text; the fallback alt is `"<title>, photo <n>"`.
- **Audio**: assets with format `mp3` (Cloudinary stores these under resource type `video`). Display name derived from the asset name: number prefix removed, dashes/underscores → spaces, sentence case (`02-sea-shanty-medley.mp3` → `Sea shanty medley`). Ordered like photos.
- **Ignored**: any other file types (video, non-mp3 audio), PDFs (which Cloudinary stores as resource type `image`, so they're excluded by format), and nested sub-subfolders.
- **Skipped with a logged warning**: a project folder with no cover, or a cover with no title. A missing description is omitted.
- **Blurb line breaks**: rendered with `white-space: pre-line`. Still unverified whether the Media Library preserves them. If it doesn't, a follow-up adds a `|` paragraph separator.

## 2. Backend (`api-harry-style`)

### Endpoint

`GET /api/projects?section=<theatre|more-projects>`

- Unknown or missing `section` → `400 { error }`.
- Success → `200`:

```json
{
  "projects": [
    {
      "slug": "shantify",
      "title": "Shantify",
      "description": "…",
      "blurb": "…",
      "link": "https://…",
      "soundcloud": "https://soundcloud.com/…",
      "spotify": "https://open.spotify.com/track/…",
      "youtube": "https://www.youtube.com/watch?v=…",
      "instagram": "https://www.instagram.com/p/…",
      "cover": { "url": "https://res.cloudinary.com/…", "alt": "Shantify" },
      "photos": [{ "url": "…", "alt": "…" }],
      "audio": [{ "url": "…", "name": "Sea shanty medley" }]
    }
  ]
}
```

Optional fields absent from the source are omitted; `photos` and `audio` are always arrays (possibly empty).

### Structure

`index.js` is split into focused units:

- `lib/cloudinary.js`: `searchSection(section, deps)` runs a Cloudinary Search API query (`asset_folder:"<section>/*"`, `with_field: ["context","tags"]`, `max_results: 500`), following `next_cursor` until exhausted. Returns raw resources.
- `lib/buildProjects.js`: `buildProjects(section, resources, logger)` is a **pure** function that applies every rule in section 1 and returns the `projects` array.
- `lib/cache.js`: `createCache({ ttlMs, fetcher, retryAfterMs = 60s })` → `get(key)`. It behaves as follows:
    - Serves cached values for 10 minutes and refetches after expiry.
    - Concurrent `get`s for the same key share one in-flight fetch.
    - If a refetch throws and a stale value exists, it returns the stale value, logs the error, and doesn't call Cloudinary again for that key for 60 seconds. This protects the ~500 calls/hour rate limit.
    - If nothing is cached, it rethrows.
- `lib/describeError.js`: turns an error into `message (status N)` for logs. Raw axios errors are never logged, because their request config contains the Cloudinary API key and secret.
- `app.js`: `createApp({ getProjects, cloudinary })` builds the Express app (the new route plus the two legacy routes), so tests inject a fake `getProjects`.
- `index.js`: loads `.env`, wires the real search + cache into `createApp`, and listens.

### Errors

- Cloudinary failure with stale cache → serve stale, log.
- Cloudinary failure with no cache → `500 { error: "Failed to fetch projects" }`.

### Compatibility

The existing `/api/images/by-tag` endpoint is kept unchanged until the new frontend is live, then removed in a follow-up.

## 3. Frontend (`harry-style`)

### New dependency

- `motion` (MIT, free): `layout`/`layoutId` animations for the grid ↔ split reflow, and `MotionConfig reducedMotion="user"`.

### Units

- `hooks/useProjects(section)` → `{ projects, status: "loading" | "ready" | "error" }`.
- `components/ProjectSection` (existing file, rewritten): owns `selectedSlug`. Renders the resting grid when nothing is selected, otherwise `[left strip | ProjectDetail | right strip]`.
- `components/ProjectTile`: cover image button, `size: "full" | "small"`. Full tiles show the description on hover (as today's subtitle). Small tiles are labelled with the project title (`aria-label` and tooltip).
- `components/ProjectDetail`: editorial single-column content (below).
- `components/media/PhotoGrid`, `components/media/Lightbox`, `components/media/AudioPlayer`, `components/media/SoundCloudEmbed`, `components/media/SpotifyEmbed`, `components/media/YouTubeEmbed`, `components/media/InstagramEmbed`, and `components/media/useEmbedPlayback` (shared "an embed started playing" hook).
- `utils/splitAround(items, selectedIndex)` → `{ left, right }` (before → left, after → right).
- `utils/embeds.ts`: `isSoundCloudUrl`, `isInstagramPostUrl`, `soundCloudEmbedSrc(url)`, `spotifyEmbedPath(url)`, `youTubeVideoId(url)`, `youTubeEmbedSrc(id, origin)`. `utils/playerApis.ts` loads the YouTube and Spotify player APIs.
- `utils/cloudinaryUrl(url, transform)`: inserts a transformation (e.g. `w_800,f_auto,q_auto`) after `/upload/`.
- The existing `Card.tsx` is superseded by `ProjectTile` and removed.

### Interaction

- **Resting**: centred, wrapping grid as today. Each tile bobs (small translateY) and tilts (±1°) via CSS keyframes, with duration and delay derived from its index so it's deterministic. Bobbing pauses on hover.
- **Select**: the section scrolls into view. The selected tile animates to full width and screen height; the remaining tiles animate into small tiles in the left strip (projects before it) and the right strip (projects after it), still bobbing.
- **Swap**: clicking a strip tile selects it directly; the strips re-split around it.
- **Reset**: ✕ button or Escape returns to the grid; focus returns to the tile that was open.
- Each section manages its own selection independently.
- **Mobile (< md)**: both strips merge into one horizontally scrolling row above the detail, in original order.
- **Reduced motion**: no bobbing; layout changes are instant.
- **Accessibility**: tiles are `<button>`s with `aria-expanded`; the detail is a region labelled by the project title.
- **Loading**: placeholder tiles. **Error**: a quiet "Projects unavailable right now" line in the section. A response without a `projects` array also counts as an error (e.g. a misconfigured `VITE_BACKEND_URL` returning `index.html`).
- **Escape** works while focus is anywhere in the open section (the section wrapper is focusable with `tabIndex={-1}`). The detail remounts on every swap (`key={slug}`), so shared-layout animations and scroll position reset.

### Project detail (top to bottom; each block only if data exists)

1. **Header**: full-width cover (`f_auto,q_auto`) with title and description over a dark gradient. The ✕ stays visible while the detail scrolls. If `link` exists, the cover is a link (`target="_blank" rel="noopener noreferrer"`) with a small ↗ indicator.
2. **Blurb**: serif font, `white-space: pre-line`.
3. **Photos**: responsive grid of Cloudinary-resized thumbnails in order. Clicking opens the **Lightbox**: full-screen night overlay, the image at full resolution, ‹ › buttons, arrow keys and swipe navigate (wrapping), an "n / total" counter, and ✕, Escape or a backdrop click to close. Focus is trapped while open and restored on close.
4. **Audio**: one compact teal/tangerine player per MP3 (play/pause, progress bar, track name). Only one track plays at a time across the page. Starting a track mutes the homepage background video and updates its mute icon. A rejected `play()` is caught: `AbortError` is ignored, other errors are logged as warnings, and the video stays muted. Closing or swapping a project pauses and releases its players.
5. **SoundCloud**: official widget iframe built from the pasted URL.
6. **Spotify**: Spotify's player via its iFrame API (compact for a track or episode, taller for collections); plain embed iframe if the API fails to load.
7. **YouTube**: `youtube-nocookie.com` player with the IFrame Player API enabled, 16:9.
8. **Instagram**: official post embed; `embed.js` is loaded lazily the first time a project with an Instagram URL opens.

Invalid embed URLs → that block is not rendered.

**Playback coordination**: one thing plays at a time across MP3s and embeds (`activeAudio.ts` holds the current player). An embed reports that it started playing through its provider's API: SoundCloud Widget `PLAY`, YouTube `onStateChange` PLAYING, Spotify `playback_update` (paused → playing only). That mutes the background video and pauses the previous player; starting an MP3 pauses a playing embed. Instagram has no API: focus moving into its iframe (window `blur`) is treated as playback; it mutes the video but can't be paused. Embed cleanup never touches a removed iframe (SoundCloud's widget throws if unbound after React removes it).

**Layout**: the open panel scrolls to below the fixed navbar and is at most the space between the navbar and (on phones) the small-tile strip and fixed social bar; it shrinks to fit short content. Grid tiles cap at 20rem on phones; there's no horizontal scroll at 375px. The hero is shortened so the Theatre title shows at the bottom of the first screen.

### Background video coordination

The mute state in `Homepage.tsx` is lifted into a small context (`BackgroundVideoContext`) exposing `mute()`, so `AudioPlayer` can mute the video without querying the DOM.

**Landing (2026-10-10)**: there is no "Enter" gate. Browsers block audible autoplay, so the video autoplays muted (`defaultMuted` + an explicit `play()` for iOS) and the first click or Enter/Space anywhere unmutes it (`hooks/useFirstInteraction`, capture phase, removed after the first interaction). A first click on the speaker button only toggles once. A "Tap anywhere for sound" hint sits under the subtitle until then. Unmuting the video pauses whatever is playing in a project (`pauseActivePlayback`). The hero is shorter than the screen (desktop `100svh − 17.5rem`, phone `100svh − 21rem`) so the Theatre title shows above the fold while the Theatre section keeps `py-40`. The side thumbnail strips grow with the page rather than scrolling in their own box.

## 4. Favicon and SEO

- Generate from the HS logo into `public/`: `favicon.ico` (16/32/48), `favicon-48x48.png`, `apple-touch-icon.png` (180×180), `site.webmanifest`.
- Add the matching `<link>` tags to `index.html` (keep the SVG icon for modern browsers).
- Change `og:image` and `twitter:image` from the Dropbox URL to the Cloudinary headshot URL.

## 5. Testing

**Backend** (Node built-in `node:test`, no new dependencies; Cloudinary mocked):

- `buildProjects`: dynamic-folder grouping, prefix ordering, `display_name` naming (incl. a regression test from the real Shantify asset), cover detection, built-in Title/Description fallback, skip rules, MP3 detection, ignored types incl. PDFs, alt fallback, audio naming.
- `cache`: hit within TTL, refetch after TTL, stale on error, rethrow with nothing cached, in-flight dedupe, failure back-off, synchronous fetcher throws.
- `describeError`: no credential substrings in output.
- Route: 400 on bad section; response shape with mocked search.

**Frontend** (Vitest, React Testing Library, jsdom as dev dependencies):

- Pure helpers: `splitAround`, embed URL validators, `cloudinaryUrl`.
- `ProjectDetail`: conditional blocks; cover links only with `link`.
- `ProjectSection`: select, swap, reset via ✕ and Escape, focus return, loading and error states.
- `Lightbox`: open, navigate, wrap-around, close, focus restore.
- `AudioPlayer`: single active track; mutes the background video.

Test files are **git-ignored and kept local-only** (owner's decision, 2026-10-03).

**Manual checks** (dev server, before completion): motion feel, mobile layout, reduced motion, real SoundCloud, Spotify, YouTube and Instagram embeds (incl. muting the background video), favicon in the browser tab.

## 6. Rollout

1. Deploy the backend (additive).
2. Harry migrates content: creates the section and project folders; each existing tagged image becomes that project's `cover`; its old `subtitle` text goes into the built-in Description and the project name into the built-in Title.
3. Deploy the frontend.
4. Follow-up: remove `/api/images/by-tag`.

## 7. Documentation deliverables

- **Frontend README**: "Managing projects" section with the convention, field reference and API shape.
- **Shareable guide for Harry**: a plain-language "How to add or edit a project" doc covering folder layout, numbering, metadata fields and what happens when something is missing. Written 2026-10-05 as a Claude Doc.

## Out of scope

- Shareable deep links to individual projects (e.g. `#theatre/shantify`).
- Video files within projects.
- A CMS or admin UI beyond Cloudinary.

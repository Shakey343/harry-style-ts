# Project Showcase — Design

**Date:** 2026-10-03
**Repos:** `harry-style` (frontend), `api-harry-style` (backend)
**Branch (both repos):** `feature/project-showcase`

## Goal

Turn each project on the homepage from a single linked image into a rich, expandable showcase that Harry manages entirely himself from Cloudinary. Everything stays on the homepage; there is no separate project page.

### Success criteria

- Harry can add, edit, reorder and remove projects and their photos/audio using only the Cloudinary Media Library, with no code changes or redeploys.
- Every project shows title, description and cover image; blurb, photos, MP3s, SoundCloud and Instagram appear only when present.
- Clicking a tile expands it to screen height in place; other tiles shrink into side strips and can be clicked to swap directly.
- Tiles gently bob and tilt at rest; motion is disabled for users who prefer reduced motion.
- Malformed content in Cloudinary degrades gracefully (project or block skipped), never breaks the page.
- The site has a favicon set that meets Google's search-result requirements.

### Assumptions

- Harry's Cloudinary account uses **fixed folders** (public IDs include the folder path). To be confirmed; if it uses dynamic folders, only `lib/cloudinary.js` changes (`asset_folder` instead of `folder`).
- The Theatre and More Projects sections remain as they are.
- Harry is non-technical; conventions must be learnable from a one-page guide.

## 1. Cloudinary content convention

```
theatre/
  01-shantify/
    cover.jpg            ← context metadata: title, description, blurb, link_to, soundcloud, instagram
    01-rehearsal.jpg     ← optional context metadata: alt
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
- **A project** is a direct subfolder of a section folder. Its `slug` is the folder name without its number prefix (`01-shantify` → `shantify`).
- **Names**: before interpreting any asset name, strip the folder path and an optional Cloudinary random suffix matching `_[a-z0-9]{6}$` (`cover_ab12cd` → `cover`).
- **Ordering** (projects and photos alike): by leading integer prefix (`01-`, `2-`, `10-`) ascending; items with no prefix come after all numbered items, sorted alphabetically.
- **Cover**: the image whose name is `cover` (case-insensitive). Required.
- **Metadata**: Cloudinary context fields on the cover: `title` (required), `description`, `blurb`, `link_to`, `soundcloud`, `instagram`. All but `title` optional.
- **Photos**: every other image in the folder. Optional `alt` context field; fallback alt is `"<title>, photo <n>"`.
- **Audio**: assets with format `mp3` (Cloudinary stores these under resource type `video`). Display name derived from the filename: strip prefix/suffix, dashes/underscores → spaces, sentence case (`sea-shanty-medley` → `Sea shanty medley`). Ordered like photos.
- **Ignored**: any other file types (video, non-mp3 audio, documents), and nested sub-subfolders.
- **Skipped with a logged warning**: a project folder with no cover, or a cover with no `title`. A missing `description` is rendered as empty.
- **Blurb line breaks**: preserved if the Media Library keeps them. To verify in the first implementation step; if not, a blank line or `|` in the field separates paragraphs.

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

- `lib/cloudinary.js`: `searchSection(section)` runs a Cloudinary Search API query (`folder:<section>/*`, `with_field: ["context","tags"]`, `max_results: 500`), following `next_cursor` until exhausted. Returns raw resources.
- `lib/buildProjects.js`: `buildProjects(section, resources)` is a **pure** function that applies every rule in section 1 and returns the `projects` array.
- `lib/cache.js`: `createCache({ ttlMs, fetcher })` → `get(key)`. Serves cached values for 10 minutes; refetches after expiry; if a refetch throws and a stale value exists, returns the stale value (logs the error); if nothing is cached, rethrows.
- `index.js`: wires the route, exports `app` (listens only when run directly) so tests can start it on an ephemeral port.

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
- `components/media/PhotoGrid`, `components/media/Lightbox`, `components/media/AudioPlayer`, `components/media/SoundCloudEmbed`, `components/media/InstagramEmbed`.
- `utils/splitAround(items, selectedIndex)` → `{ left, right }` (before → left, after → right).
- `utils/embeds.ts`: `isSoundCloudUrl`, `isInstagramPostUrl`, `soundCloudEmbedSrc(url)`.
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
- **Loading**: placeholder tiles. **Error**: a quiet "Projects unavailable right now" line in the section.

### Project detail (top to bottom; each block only if data exists)

1. **Header**: full-width cover with title and description over a dark gradient. If `link` exists, the cover is a link (`target="_blank" rel="noopener noreferrer"`) with a small ↗ indicator.
2. **Blurb**: serif font, `white-space: pre-line`.
3. **Photos**: responsive grid of Cloudinary-resized thumbnails in order. Clicking opens the **Lightbox**: full-screen night overlay, the image at full resolution, ‹ › buttons, arrow keys and swipe navigate (wrapping), an "n / total" counter, and ✕, Escape or a backdrop click to close. Focus is trapped while open and restored on close.
4. **Audio**: one compact teal/tangerine player per MP3 (play/pause, progress bar, track name). Only one track plays at a time across the page. Starting a track mutes the homepage background video and updates its mute icon.
5. **SoundCloud**: official widget iframe built from the pasted URL.
6. **Instagram**: official post embed; `embed.js` is loaded lazily the first time a project with an Instagram URL opens.

Invalid SoundCloud or Instagram URLs → that block is not rendered.

### Background video coordination

The mute state in `Homepage.tsx` is lifted into a small context (`BackgroundVideoContext`) exposing `mute()`, so `AudioPlayer` can mute the video without querying the DOM.

## 4. Favicon and SEO

- Generate from the HS logo into `public/`: `favicon.ico` (16/32/48), `favicon-48x48.png`, `apple-touch-icon.png` (180×180), `site.webmanifest`.
- Add the matching `<link>` tags to `index.html` (keep the SVG icon for modern browsers).
- Change `og:image` and `twitter:image` from the Dropbox URL to the Cloudinary headshot URL.

## 5. Testing

**Backend** (Node built-in `node:test`, no new dependencies; Cloudinary mocked):

- `buildProjects`: grouping, prefix ordering, suffix stripping, cover detection, skip rules, MP3 detection, ignored types, alt fallback, audio naming.
- `cache`: hit within TTL, refetch after TTL, stale on error, rethrow with nothing cached.
- Route: 400 on bad section; response shape with mocked search.

**Frontend** (Vitest, React Testing Library, jsdom as dev dependencies):

- Pure helpers: `splitAround`, embed URL validators, `cloudinaryUrl`.
- `ProjectDetail`: conditional blocks; cover links only with `link`.
- `ProjectSection`: select, swap, reset via ✕ and Escape, focus return, loading and error states.
- `Lightbox`: open, navigate, wrap-around, close, focus restore.
- `AudioPlayer`: single active track; mutes the background video.

**Manual checks** (dev server, before completion): motion feel, mobile layout, reduced motion, real SoundCloud and Instagram embeds, favicon in the browser tab.

## 6. Rollout

1. Deploy the backend (additive).
2. Harry migrates content: creates the section and project folders; each existing tagged image becomes that project's `cover`; `subtitle` moves to `description`.
3. Deploy the frontend.
4. Follow-up: remove `/api/images/by-tag`.

## 7. Documentation deliverables

- **Frontend README**: "Managing projects" section with the convention, field reference and API shape.
- **Shareable guide for Harry**: a plain-language "How to add or edit a project" doc covering folder layout, numbering, metadata fields and what happens when something is missing. Written once the implementation is final.

## Out of scope

- Shareable deep links to individual projects (e.g. `#theatre/shantify`).
- Video files within projects.
- A CMS or admin UI beyond Cloudinary.

# Project Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace single-image project cards with expandable, Cloudinary-driven project showcases (blurb, ordered photos with lightbox, MP3s, SoundCloud, Instagram), plus a Google-compliant favicon set.

**Architecture:** The backend (`../api-harry-style`, Express, CommonJS) gains `GET /api/projects?section=`, which searches one Cloudinary section folder, groups assets into projects with a pure `buildProjects` function, and caches the result for 10 minutes. The frontend (`harry-style`, React 18, Vite, TS, Tailwind) fetches that endpoint per section and renders bobbing tiles that animate, using Motion `layoutId`, into a split layout: [left strip | open project | right strip].

**Tech Stack:** Node 20 `node:test` (backend tests), Express 4, axios; React 18, TypeScript 5.6, Tailwind 3, `motion`, Vitest, @testing-library/react, jsdom.

**Spec:** `docs/superpowers/specs/2026-10-03-project-showcase-design.md`

## Global Constraints

- **Consent rule (CLAUDE.md):** ask Jake before every `git switch -c`, `git commit` and file deletion. Every "Commit" step below means "show the diff summary, ask, then commit".
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
- Branch `feature/project-showcase` in both repos, created from `main`.
- Sections are exactly `theatre` and `more-projects`.
- Cloudinary is assumed to use **fixed folders**: search expression `folder:"<section>/*"`, and asset `folder` looks like `theatre/01-shantify`.
- Random suffix regex `_[a-z0-9]{6}$`; order prefix regex `^(\d+)[-_ ]`.
- Cache TTL is `10 * 60 * 1000` ms.
- Thumbnail transform is `w_800,f_auto,q_auto`. The lightbox uses `f_auto,q_auto`.
- Brand colours (Tailwind): `teal`, `bone`, `bone2`, `night`, `persian`, `tangerine`.
- The backend adds no new runtime or dev dependencies. The frontend adds only `motion` (dependency) and `vitest`, `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `jsdom` (dev).
- Keep `/api/images/by-tag` unchanged.
- **Tests are local-only (Jake's decision):** test files are git-ignored and never committed. In `harry-style`, that's `*.test.ts`, `*.test.tsx` and `src/test/`. In `api-harry-style`, it's `test/`, added to its `.gitignore` in Task 0. Write and run them as normal, but commit only the source, config and `package.json` changes. Never `git add -f` a test file.

## Review Focus

1. **Duplicate or missing numbers** (`01-a.jpg` and `01-b.jpg`, or `photo.jpg` with no number): a stable order by number, then name, with unnumbered items last. This is pinned in Task 1.
2. **Inconsistent case and stray whitespace from Harry** (`Cover.JPG`, format `MP3`, title `"  Shantify "`, whitespace-only title): cover and MP3 are still recognised, values are trimmed, and a whitespace-only title counts as missing. This is pinned in Task 1.
3. **More than 500 assets in a section:** pagination via `next_cursor` must not silently drop projects. This is pinned in Task 3.
4. **Escape while the lightbox is open:** this closes only the lightbox, not the whole project. This is pinned in Task 10.
5. **Minimal projects and edge selections** (a cover-only project, selecting the first or last tile, a section with one project): no empty blocks render and an empty strip doesn't break the layout. This is pinned in Tasks 4 and 9.

---

## Part A: Backend (`/Users/jakepople/code/Shakey343/HarryStyle/api-harry-style`)

### Task 0: Branches

- [ ] **Step 1:** Ask Jake, then in `harry-style` run `git switch -c feature/project-showcase`. The `.gitignore` change and the spec/plan docs carry over. Commit them as `docs: add project showcase spec and plan` (after asking).
- [ ] **Step 2:** Ask Jake, then in `api-harry-style` run `git switch -c feature/project-showcase`, append `test/` to its `.gitignore`, and commit `chore: keep tests local-only` (after asking).

### Task 1: `buildProjects` (pure grouping)

**Files:**
- Create: `lib/buildProjects.js`
- Test: `test/buildProjects.test.js`
- Modify: `package.json`. Set the `"test"` script to `node --test`.

**Interfaces:**
- Produces: `buildProjects(section: string, resources: Resource[], logger = console): Project[]`
  - `Resource = { public_id, folder, format, resource_type, secure_url, context?: Record<string,string> }`
  - `Project = { slug, title, description?, blurb?, link?, soundcloud?, instagram?, cover: {url, alt}, photos: {url, alt}[], audio: {url, name}[] }`. Optional keys are omitted when empty, never `undefined`.

- [ ] **Step 1: Write failing tests.** Use a `res(publicId, extra)` helper that derives `folder` from `public_id`, and defaults to `format: "jpg"`, `resource_type: "image"` and `secure_url: "https://res.cloudinary.com/x/image/upload/v1/" + publicId`. Tests:
  - `groups assets into projects by direct subfolder`: two folders give two projects. Assets directly in `theatre/` and in `theatre/01-a/nested/` are ignored.
  - `orders projects by number prefix, unnumbered last alphabetically`: `10-c`, `2-b`, `zeta`, `alpha` give slugs `["b","c","alpha","zeta"]`.
  - `orders photos by prefix then name`: `02-x`, `01-b`, `01-a`, `photo` give `01-a, 01-b, 02-x, photo`.
  - `strips Cloudinary suffix when reading names`: `theatre/01-a/cover_ab12cd` is the cover.
  - `detects cover case-insensitively`: `Cover_ab12cd` with `format: "JPG"`.
  - `maps cover context to fields and trims values`: context `{ title: "  Shantify ", description: "d", blurb: "b", link_to: "https://x", soundcloud: "https://soundcloud.com/a/b", instagram: "https://www.instagram.com/p/X/" }` gives the matching `title: "Shantify"`, `link`, etc.
  - `omits empty optional fields`: context `{ title: "T", blurb: "  " }` gives no `blurb` key and no `description` key.
  - `skips project with no cover and warns`: `logger.warn` is called once with a message containing the folder name.
  - `skips project whose title is missing or whitespace`.
  - `collects mp3s as audio with readable names`: `resource_type: "video"`, `format: "MP3"`, `public_id: "theatre/01-a/02-sea-shanty_medley_ab12cd"` gives `{ name: "Sea shanty medley" }`. A `.wav` and an `.mp4` are ignored.
  - `uses alt context or falls back`: a photo with `context.alt` keeps it. Without one it's `"Shantify, photo 2"`, where n is 1-based in sorted order. The cover's alt is the title.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL, because the module isn't found.
- [ ] **Step 3: Implement `buildProjects`.** Use the regexes from Global Constraints. The slug is the folder's last segment with the prefix removed, lowercased. The audio name is the cleaned base name, prefix removed, `[-_]+` replaced with a space, first letter upper-cased and the rest lower-cased. Sort with a comparator: `(a.order ?? Infinity) - (b.order ?? Infinity) || a.name.localeCompare(b.name)`. `context` values may be missing, so treat everything as optional strings.
- [ ] **Step 4:** Run `npm test`. Expected: all pass.
- [ ] **Step 5:** Commit `feat(api): add buildProjects folder convention parser`.

### Task 2: Cache

**Files:**
- Create: `lib/cache.js`
- Test: `test/cache.test.js`

**Interfaces:**
- Produces: `createCache({ ttlMs, fetcher: (key) => Promise<T>, now = Date.now, logger = console }) → { get(key): Promise<T> }`

- [ ] **Step 1: Write failing tests** with a fake `now` and a counting fetcher:
  - `returns cached value within ttl`: two `get("theatre")` calls, `now` advanced by `ttlMs - 1`, call the fetcher once.
  - `refetches after ttl`: `now` advanced by `ttlMs`, and the fetcher is called twice.
  - `serves stale value when refetch fails`: the second fetch rejects, `get` resolves to the first value, and `logger.error` is called.
  - `rethrows when nothing cached`.
  - `caches per key`: `theatre` and `more-projects` fetch independently.
- [ ] **Step 2:** Run `npm test`. Expected: the cache tests fail.
- [ ] **Step 3:** Implement with a `Map<key, { value, fetchedAt }>`.
- [ ] **Step 4:** Run `npm test`. Expected: all pass.
- [ ] **Step 5:** Commit `feat(api): add ttl cache with stale-on-error`.

### Task 3: Cloudinary search and `/api/projects` route

**Files:**
- Create: `lib/cloudinary.js`, `app.js`
- Modify: `index.js`. Move both existing routes into `app.js` unchanged. `index.js` becomes: load dotenv, build real deps, `createApp(deps).listen(PORT, '::', …)`.
- Test: `test/cloudinary.test.js`, `test/app.test.js`

**Interfaces:**
- Consumes: `buildProjects` (Task 1), `createCache` (Task 2).
- Produces:
  - `searchSection(section, { post = axios.post, cloudName, apiKey, apiSecret } = {}) → Promise<Resource[]>`
  - `createApp({ getProjects: (section) => Promise<Project[]>, cloudinary: { cloudName, apiKey, apiSecret } }) → express.App`

(This is a small deviation from the spec's "index.js exports app": `app.js` exports a factory, so tests can inject `getProjects` without real credentials.)

- [ ] **Step 1: Write failing `cloudinary` tests** using an injected `post` stub:
  - `posts folder search with context`: the URL is `https://api.cloudinary.com/v1_1/<cloud>/resources/search`. The body has `expression: 'folder:"theatre/*"'`, `with_field: ["context","tags"]` and `max_results: 500`. Auth is `{ username: apiKey, password: apiSecret }`.
  - `follows next_cursor across pages`: the first response is `{ resources:[r1], next_cursor:"c2" }` and the second is `{ resources:[r2] }`. The result is `[r1, r2]`, and the second body has `next_cursor: "c2"`.
- [ ] **Step 2: Write failing `app` tests.** Start `createApp({ getProjects: stub }).listen(0)` and use global `fetch`:
  - `400 for unknown section`: `?section=blog` and a missing section both return 400 `{ error }`.
  - `returns projects for valid section`: the stub resolves `[p]`, and the response is 200 `{ projects: [p] }`. The stub is called with `"more-projects"`.
  - `500 when getProjects throws`: returns `{ error: "Failed to fetch projects" }`.
- [ ] **Step 3:** Run `npm test`. Expected: the new tests fail.
- [ ] **Step 4:** Implement `searchSection`, `createApp` (the route plus the two moved routes, `cors` and `bodyParser`), and the `index.js` wiring:
  ```js
  const cache = createCache({ ttlMs: 10 * 60 * 1000, fetcher: async (s) => buildProjects(s, await searchSection(s, creds)) });
  createApp({ getProjects: (s) => cache.get(s), cloudinary: creds })
  ```
- [ ] **Step 5:** Run `npm test`. Expected: all pass. Then run `node index.js` with the real `.env` and `curl 'localhost:5001/api/projects?section=theatre'`. Expected: `{"projects":[]}`, or real projects if Harry has started migrating. If the response is empty despite folders existing, the account may use dynamic folders. Stop and report to Jake.
- [ ] **Step 6: Blurb line-break check.** Fetch one cover via the endpoint and confirm with Jake whether newlines survive. If they don't, add a rule to `buildProjects` (and a test) that replaces ` | ` with `\n\n` in `blurb`.
- [ ] **Step 7:** Commit `feat(api): add /api/projects endpoint with cloudinary search`.

---

## Part B: Frontend (`/Users/jakepople/code/Shakey343/HarryStyle/harry-style`)

### Task 4: Test setup, types and pure helpers

**Files:**
- Modify: `package.json`. Add the dev dependencies from Global Constraints and the script `"test": "vitest"`.
- Modify: `vite.config.ts`. Add `test: { environment: "jsdom", setupFiles: ["./src/test/setup.ts"], globals: true }` with `/// <reference types="vitest/config" />`.
- Modify: `tsconfig.app.json`. Add `"types": ["vitest/globals", "@testing-library/jest-dom"]`.
- Create: `src/test/setup.ts`. Import jest-dom. Stub `HTMLMediaElement.prototype.play` (resolving) and `pause`, `window.matchMedia` (default `matches: false`) and `Element.prototype.scrollIntoView`.
- Create: `src/types/project.ts`, `src/utils/splitAround.ts`, `src/utils/embeds.ts`, `src/utils/cloudinaryUrl.ts`
- Test: `src/utils/*.test.ts`

**Interfaces:**
- Produces:
  - `type Section = "theatre" | "more-projects"`, `type Photo = { url: string; alt: string }`, `type Track = { url: string; name: string }`, and `type Project` matching the backend shape. The optionals are `string | undefined`, and `photos` and `audio` are always arrays.
  - `splitAround<T>(items: T[], selectedIndex: number): { left: T[]; right: T[] }`
  - `isSoundCloudUrl(url: string): boolean`, `soundCloudEmbedSrc(url: string): string`, `isInstagramPostUrl(url: string): boolean`
  - `cloudinaryUrl(url: string, transform: string): string`

- [ ] **Step 1: Write failing tests:**
  - `splitAround`:
    - middle index splits before and after
    - index 0 gives `left: []`
    - the last index gives `right: []`
    - a single item gives both empty
  - `isSoundCloudUrl`:
    - true for `https://soundcloud.com/a/b` and `https://m.soundcloud.com/a`
    - false for `http://evil.com/soundcloud.com`, `not a url` and `""`
  - `soundCloudEmbedSrc("https://soundcloud.com/a/b")` returns `https://w.soundcloud.com/player/?url=https%3A%2F%2Fsoundcloud.com%2Fa%2Fb&color=%23f5a58c&visual=false`
  - `isInstagramPostUrl`:
    - true for `https://www.instagram.com/p/ABC123/` and `https://instagram.com/reel/XYZ`
    - false for a profile URL `https://www.instagram.com/harry/` and for other hosts
  - `cloudinaryUrl("https://res.cloudinary.com/x/image/upload/v1/a.jpg", "w_800,f_auto,q_auto")` inserts after `/upload/`. A non-Cloudinary URL is returned unchanged.
- [ ] **Step 2:** Run `npx vitest run`. Expected: FAIL.
- [ ] **Step 3:** Implement. Validators use `new URL()` inside try/catch, require `https:` and check `hostname === "soundcloud.com" || hostname.endsWith(".soundcloud.com")` (and the same pattern for Instagram), with an Instagram path matching `^/(p|reel)/[^/]+/?$`.
- [ ] **Step 4:** Run `npx vitest run && npm run build`. Expected: tests pass and the type-check is clean.
- [ ] **Step 5:** Commit `test: add vitest setup and project helpers`.

### Task 5: `useProjects` and `useMediaQuery` hooks

**Files:**
- Create: `src/hooks/useProjects.ts`, `src/hooks/useMediaQuery.ts`
- Test: `src/hooks/useProjects.test.tsx`

**Interfaces:**
- Produces:
  - `useProjects(section: Section): { projects: Project[]; status: "loading" | "ready" | "error" }`. This GETs `${import.meta.env.VITE_BACKEND_URL}api/projects?section=${section}` via axios and ignores the result if it unmounts first.
  - `useMediaQuery(query: string): boolean`. This uses `window.matchMedia` and subscribes to `change`.

- [ ] **Step 1: Write failing tests** with `vi.mock("axios")`:
  - `starts loading then ready with projects`
  - `error status when request fails`
  - `requests the section url`
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement both hooks.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add useProjects and useMediaQuery hooks`.

### Task 6: Background video context

**Files:**
- Create: `src/context/BackgroundVideoContext.tsx`
- Modify: `src/components/Homepage.tsx`. Replace the `mute` state and `document.querySelector("video")` with the context. `<video ref={videoRef}>`, the unmute button and `handlePlayBtn` use `toggleMute`/`unmute`.
- Modify: `src/App.tsx`. Wrap in `<BackgroundVideoProvider>` and `<MotionConfig reducedMotion="user">` (install `motion` here).
- Test: `src/context/BackgroundVideoContext.test.tsx`

**Interfaces:**
- Produces: `BackgroundVideoProvider` and `useBackgroundVideo(): { videoRef: RefObject<HTMLVideoElement>; muted: boolean; mute(): void; unmute(): void; toggleMute(): void }`. `unmute` also calls `video.play()`.

- [ ] **Step 1: Write failing tests:**
  - `mute sets video.muted and muted state`
  - `toggleMute unmutes and plays`
  - `mute is safe when no video mounted`
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement, and refactor Homepage. The behaviour must be identical: still starts muted, Enter unmutes, and the icon toggles.
- [ ] **Step 4:** Run the tests and `npm run build`. Then run `npm run dev` and check that Enter and mute/unmute still work.
- [ ] **Step 5:** Commit `refactor: lift background video mute into context`.

### Task 7: AudioPlayer

**Files:**
- Create: `src/components/media/activeAudio.ts`, `src/components/media/AudioPlayer.tsx`
- Test: `src/components/media/AudioPlayer.test.tsx`

**Interfaces:**
- Consumes: `useBackgroundVideo().mute` (Task 6), `Track` (Task 4).
- Produces:
  - `claimPlayback(el: HTMLAudioElement): void`. This pauses the previously claimed element if it's a different one.
  - `<AudioPlayer track={Track} />`. A play/pause button (`aria-label` "Play <name>" / "Pause <name>"), the track name, and a progress bar (`role="progressbar"`, `aria-valuenow` 0–100 from `timeupdate`). Styling is a teal background, tangerine controls and a bone name.

- [ ] **Step 1: Write failing tests** (render inside `BackgroundVideoProvider` with a mocked `mute`, or a test provider):
  - `play calls audio.play and mutes background video`
  - `playing a second player pauses the first`
  - `toggles label between Play and Pause`
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. On play: `claimPlayback(el)`, `mute()`, then `el.play()`. Sync `playing` state from the `play`, `pause` and `ended` events.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add audio player with single active track`.

### Task 8: SoundCloud and Instagram embeds

**Files:**
- Create: `src/components/media/SoundCloudEmbed.tsx`, `src/components/media/InstagramEmbed.tsx`, `src/utils/loadScript.ts`
- Test: `src/components/media/embeds.test.tsx`

**Interfaces:**
- Consumes: the validators from Task 4.
- Produces:
  - `<SoundCloudEmbed url />` renders `null` if invalid, otherwise an `<iframe title="SoundCloud player" height=166 width="100%" allow="autoplay" src={soundCloudEmbedSrc(url)}>`.
  - `<InstagramEmbed url />` renders `null` if invalid, otherwise `<blockquote className="instagram-media" data-instgrm-permalink={url}>`. On mount it calls `loadScript("https://www.instagram.com/embed.js")` and then `window.instgrm?.Embeds.process()`.
  - `loadScript(src): Promise<void>` is idempotent: a second call with the same `src` reuses the first promise and appends one `<script>` only.

- [ ] **Step 1: Write failing tests:**
  - `soundcloud renders iframe for valid url`
  - `soundcloud renders nothing for invalid url`
  - `instagram renders nothing for invalid url`
  - `loadScript appends a single script for repeated calls`
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3:** Implement. Declare `window.instgrm` in `src/vite-env.d.ts`.
- [ ] **Step 4:** Run. Expected: PASS.
- [ ] **Step 5:** Commit `feat: add soundcloud and instagram embeds`.

### Task 9: PhotoGrid, Lightbox and ProjectDetail

**Files:**
- Create: `src/components/media/Lightbox.tsx`, `src/components/media/PhotoGrid.tsx`, `src/components/ProjectDetail.tsx`
- Test: `src/components/media/Lightbox.test.tsx`, `src/components/ProjectDetail.test.tsx`

**Interfaces:**
- Consumes: `cloudinaryUrl` (Task 4), `AudioPlayer` (Task 7), the embeds (Task 8).
- Produces:
  - `<Lightbox photos index onIndexChange={(i)=>void} onClose />`. This portals to `document.body` with `role="dialog"`, `aria-modal`, `aria-label="Photo viewer"`. It has buttons "Previous photo", "Next photo" and "Close photo viewer", and an "n / total" counter. Navigation wraps. Keyboard handling is React `onKeyDown` on the dialog (ArrowLeft, ArrowRight, Escape), and every handled key calls `e.stopPropagation()`. A backdrop click closes it. Swipe: pointerdown then pointerup with |dx| > 50 navigates. Tab cycles focus among the three buttons. It focuses "Close photo viewer" on open and restores the previously focused element on close.
  - `<PhotoGrid photos title />`. These are thumbnail buttons (`aria-label="Open photo n"`) using `cloudinaryUrl(url, "w_800,f_auto,q_auto")`, and the grid owns the lightbox state.
  - `<ProjectDetail project onClose closeButtonRef />`. This is a `<section aria-labelledby>` that scrolls internally (`overflow-y-auto`). The blocks, in order and each only if data exists:
    - the header, with the cover wrapped in `<a target="_blank" rel="noopener noreferrer">` plus "↗" only when `link` is set
    - the title (`h3`, the label target) and description over a gradient
    - the blurb (`whitespace-pre-line font-serif`)
    - the PhotoGrid
    - an AudioPlayer per track
    - SoundCloudEmbed
    - InstagramEmbed
    - a ✕ button `aria-label="Close project"`, attached to `closeButtonRef`

- [ ] **Step 1: Write failing Lightbox tests:**
  - `shows counter and wraps forward from last to first`
  - `arrow keys navigate`
  - `escape closes and does not propagate`: wrap the Lightbox in a parent `div` with an `onKeyDown` spy, and assert the spy isn't called.
  - `backdrop click closes, image click does not`
  - `restores focus on close`
- [ ] **Step 2: Write failing ProjectDetail tests:**
  - `cover-only project renders header and nothing else`: no blurb, no photo buttons, no audio, no iframe.
  - `full project renders every block in order`: use `compareDocumentPosition` across the heading, blurb, the first photo button, the play button and the iframe.
  - `cover links out only when link set`
  - `close button calls onClose`
- [ ] **Step 3:** Run. Expected: FAIL.
- [ ] **Step 4:** Implement the three components.
- [ ] **Step 5:** Run. Expected: PASS.
- [ ] **Step 6:** Commit `feat: add project detail with photo lightbox`.

### Task 10: ProjectTile and ProjectSection (selection, strips, motion)

**Files:**
- Create: `src/components/ProjectTile.tsx`
- Modify: `src/components/ProjectSection.tsx` (rewrite), `src/index.css` (bob keyframes), `src/components/Homepage.tsx` (pass `tag` typed as `Section`)
- Delete: `src/components/Card.tsx`. Ask Jake first.
- Test: `src/components/ProjectSection.test.tsx`

**Interfaces:**
- Consumes: `useProjects`, `useMediaQuery` (Task 5), `splitAround` (Task 4), `ProjectDetail` (Task 9).
- Produces:
  - `<ProjectTile project size: "full" | "small" index onSelect ref />`. This is a `motion.button` with `layoutId={"tile-" + slug}` and `aria-expanded={false}`. The bob animation sits on an **inner** wrapper (class `tile-bob`), so it doesn't fight Motion's layout transforms. Its duration is `${4 + (index % 3) * 0.5}s` and its delay is `${-(index * 1.3) % 5}s`. A full tile shows the description on hover, using today's Card hover styling. A small tile is about 64×80px with `aria-label` and a `title` of the project title.
  - `<ProjectSection tag: Section />`. Outer `<LayoutGroup id={tag}>`. With no selection, it's the resting `flex flex-wrap justify-center gap-10` grid. With a selection on `md+`, it's `flex` [left strip, vertical | `motion.div layoutId={"tile-"+slug}` holding `ProjectDetail`, height `calc(100dvh - 6rem)` | right strip, vertical]. Below `md`, it's one horizontal `overflow-x-auto` strip of `[...left, ...right]` above the detail.
- **CSS for `src/index.css`:** `@keyframes bob { 0%,100% { transform: translateY(0) rotate(-1deg) } 50% { transform: translateY(-6px) rotate(1deg) } }`, `.tile-bob { animation: bob 4s ease-in-out infinite }`, `.group:hover .tile-bob { animation-play-state: paused }`, and `@media (prefers-reduced-motion: reduce) { .tile-bob { animation: none } }`.

- [ ] **Step 1: Write failing tests** (mock `useProjects` to return three projects `a`, `b`, `c`; mock `useMediaQuery` to return true):
  - `renders a tile per project in resting grid`
  - `selecting b shows detail with a on left and c on right`: query the strips by `data-testid="strip-left"` / `"strip-right"`.
  - `selecting first tile leaves left strip empty`
  - `clicking strip tile swaps directly`
  - `close button resets grid and focuses the previously open tile`
  - `escape resets grid`
  - `escape inside lightbox closes lightbox but keeps project open`
  - `mobile merges strips into one row`: `useMediaQuery` returns false, and the result is one `data-testid="strip-mobile"` with `a, c` in order.
  - `loading shows placeholders; error shows "Projects unavailable right now"`
- [ ] **Step 2:** Run. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - On select: set `selectedSlug`, call `sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" })`, and focus `closeButtonRef` after the commit, in an effect.
  - On reset: remember `lastSlug` and focus `tileRefs.current[lastSlug]` in an effect.
  - Escape is handled via `onKeyDown` on the section element.
- [ ] **Step 4:** Run the tests and `npm run build`. Expected: PASS and a clean build.
- [ ] **Step 5:** Ask Jake, then delete `Card.tsx` and confirm `npm run build` still passes.
- [ ] **Step 6:** Commit `feat: expandable project tiles with split strips`.

### Task 11: Favicon and SEO

**Files:**
- Create: `public/favicon.ico`, `public/favicon-48x48.png`, `public/apple-touch-icon.png`, `public/site.webmanifest`
- Modify: `index.html`, `src/components/Homepage.tsx` (Helmet `og:image` and `twitter:image`)

- [ ] **Step 1: Generate the icons with a throwaway script in the scratchpad.** Do not add dependencies to the project. Install `sharp` and `png-to-ico` there. Render `public/hs-logo.svg` centred on a square tangerine `#F5A58C` canvas with 12% padding, at 512, 180, 48, 32 and 16 px. The ICO bundles 16, 32 and 48.
- [ ] **Step 2:** Write `site.webmanifest` with `name: "Harry Style"`, `short_name: "Harry Style"`, icons 48 and 180, `theme_color: "#161619"` and `background_color: "#161619"`.
- [ ] **Step 3:** In `index.html`, keep the SVG icon and add `<link rel="icon" href="/favicon.ico" sizes="any">`, `<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">`, `<link rel="apple-touch-icon" href="/apple-touch-icon.png">` and `<link rel="manifest" href="/site.webmanifest">`.
- [ ] **Step 4:** Replace both Dropbox image URLs in the Helmet with `https://res.cloudinary.com/dlaso8l44/image/upload/v1744223578/Harry_Style_Headshot_Left_ulqt4z.jpg`.
- [ ] **Step 5:** Run `npm run build`, then `npm run preview`. Check that `/favicon.ico`, `/favicon-48x48.png`, `/apple-touch-icon.png` and `/site.webmanifest` each return 200, and that the tab shows the icon.
- [ ] **Step 6:** Commit `feat: add favicon set and cloudinary social image`.

### Task 12: Documentation and manual verification

**Files:**
- Modify: `README.md`. Replace the Vite template text with: project overview, scripts (`dev`, `test`, `build`), env vars (`VITE_BACKEND_URL`, EmailJS), and a "Managing projects" section (the folder convention, a field table, the ordering rules, the skip rules and the API shape, copied from spec §1–2).
- Create: a **Claude Doc** for Harry, "How to add or edit a project on your website", in plain language with no code. It covers creating a project folder, numbering, `cover.jpg` and its fields (with a table of field, required?, example), adding photos and MP3s, alt text, the ~10-minute delay before changes appear, and what happens if something is missing.

- [ ] **Step 1:** Write the README section and commit `docs: add managing projects guide` (after asking).
- [ ] **Step 2:** Create the Claude Doc and share the link with Jake for review.
- [ ] **Step 3: Manual checks** with `npm run dev` against the local backend, and a test project folder if Harry or Jake can create one:
  - the bob and tilt feel
  - the select, swap and reset animations
  - the 375px mobile layout
  - reduced motion (macOS: Accessibility → Display → Reduce motion)
  - a real SoundCloud and Instagram embed
  - an MP3 muting the background video
  - the lightbox swipe on a phone or in devtools touch mode
- [ ] **Step 4:** Run the full suites: `npx vitest run`, `npm run build` and `npm run lint` in `harry-style`, and `npm test` in `api-harry-style`. Report the results honestly.
- [ ] **Step 5:** Hand off to `superpowers:requesting-code-review`, then `superpowers:finishing-a-development-branch`.

## Follow-ups (not in this plan)

- Remove `/api/images/by-tag` after the frontend is deployed (spec §6.4).
- Switch the search to `asset_folder` if the account turns out to use dynamic folders.

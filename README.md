# Harry Style website

React 18 + TypeScript + Vite + Tailwind frontend for Harry's portfolio site. Content (projects, photos, audio) is served by the companion API in `api-harry-style`, which reads it from Cloudinary.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm test` | Vitest in watch mode (`npx vitest run` for a single run) |
| `npm run build` | `tsc -b && vite build` |
| `npm run lint` | ESLint |

Tests are Vitest here and `node --test` in the API (`npm test` in `api-harry-style`). Test files (`*.test.ts`, `*.test.tsx`, `src/test/`; `test/` in the API) are git-ignored and kept local-only by the owner's choice, so a fresh clone has no tests.

## Environment variables

Set in `.env` (not committed). Names only:

- `VITE_BACKEND_URL` - base URL of the API, with a trailing slash (requests go to `${VITE_BACKEND_URL}api/projects?section=...`)
- `VITE_EMAILJS_SERVICE_ID`, `VITE_EMAILJS_TEMPLATE_ID`, `VITE_EMAILJS_PUBLIC_KEY` - EmailJS, used by the contact modal

## Managing projects

Harry manages projects entirely in the Cloudinary Media Library; no code changes or redeploys. The two sections are `theatre` and `more-projects`.

### Folder convention

```
theatre/
  01-shantify/
    cover.jpg            <- metadata: Title, Description, blurb, link_to, soundcloud, spotify, youtube, instagram
    01-rehearsal.jpg     <- optional context metadata: alt
    02-opening-night.jpg
    sea-shanty-medley.mp3
  02-pippin/
    cover.jpg
more-projects/
  01-ashatones/
    ...
```

- A project is a direct subfolder of a section folder. Its `slug` is the folder name without the number prefix, lower-cased (`01-Shantify` -> `shantify`). Folder names are never suffix-stripped, so `01-rock_castle` -> `rock_castle`.
- The cover is the image named `cover` (case-insensitive). Required.
- Photos are all other images in the folder; audio is any `.mp3` (stored by Cloudinary as resource type `video`).

### Cover metadata (Cloudinary context fields)

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | The Media Library's built-in **Title** field (stored as `caption`) works; a custom `title` field wins if both are set. Project is skipped without one |
| `description` | no | The built-in **Description** field (stored as `alt`) works; a custom `description` field wins. Shown on hover/over the cover; omitted if missing |
| `blurb` | no | Longer text in the detail view |
| `link_to` | no | Makes the cover a link (exposed as `link`) |
| `soundcloud` | no | SoundCloud URL, rendered as the official widget |
| `spotify` | no | Spotify track, album, playlist, episode, show or artist link, rendered with Spotify's player |
| `youtube` | no | YouTube video link (`watch?v=`, `youtu.be/`, `/shorts/`, `/embed/`), rendered with the privacy-enhanced `youtube-nocookie.com` player |
| `instagram` | no | Instagram post URL, embedded |

Starting any player (an MP3, SoundCloud, Spotify or YouTube) mutes the homepage background video and pauses whichever other player was playing. Instagram has no player API, so clicking into an Instagram post counts as starting it: it mutes the video but can't be paused by other players.

Photos use their built-in **Description** (`alt`) as alt text; the fallback is `"<title>, photo <n>"`.

### Ordering and names

- Projects, photos and audio sort by leading integer prefix (`01-`, `2-`, `10-`) ascending; unnumbered items come after, alphabetically. Prefix regex: `^(\d+)[-_ ]`.
- The Cloudinary account uses **dynamic folders**: the API searches `asset_folder:"<section>/*"` and reads each file's name from its Media Library `display_name` (file extension removed), falling back to the last `public_id` segment. Renaming a file in the Media Library is enough; the `public_id` doesn't matter.
- Audio display name: number prefix removed, dashes/underscores become spaces, sentence case (`02-sea-shanty-medley.mp3` -> `Sea shanty medley`).

### Skip rules

- Project folder with no cover, or a cover with no `title`: skipped with a logged warning on the API.
- Other file types (video, non-mp3 audio), PDFs (even though Cloudinary stores them as images) and nested sub-subfolders: ignored.

### API shape

`GET /api/projects?section=<theatre|more-projects>`; unknown or missing section returns `400 { error }`; Cloudinary failure with nothing cached returns `500 { error: "Failed to fetch projects" }`.

```json
{
  "projects": [
    {
      "slug": "shantify",
      "title": "Shantify",
      "description": "...",
      "blurb": "...",
      "link": "https://...",
      "soundcloud": "https://soundcloud.com/...",
      "spotify": "https://open.spotify.com/track/...",
      "youtube": "https://www.youtube.com/watch?v=...",
      "instagram": "https://www.instagram.com/p/...",
      "cover": { "url": "https://res.cloudinary.com/...", "alt": "Shantify" },
      "photos": [{ "url": "...", "alt": "..." }],
      "audio": [{ "url": "...", "name": "Sea shanty medley" }]
    }
  ]
}
```

Optional fields absent from the source are omitted; `photos` and `audio` are always arrays.

### Caching

The API caches each section for 10 minutes and de-duplicates in-flight requests. If a refresh fails, the last good data is served and Cloudinary is not retried for 60 seconds. So Harry's changes appear within about 10 minutes.

### Known limitations and open questions

- **Blurb line breaks:** unverified whether the Media Library preserves them. The detail view renders with `white-space: pre-line`.

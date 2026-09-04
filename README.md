# so many cults — somanycults.com

Next.js (App Router) + Tailwind v4. Deployed on Vercel.

```bash
npm run dev     # http://localhost:3000
npm run build
```

## Site map

| Route | Purpose |
| --- | --- |
| `/` | Home: hero, featured release, upcoming + recent shows, photo preview |
| `/music` | Releases, streaming / pre-save links, music video |
| `/videos` | Music videos and live footage (YouTube embeds) |
| `/shows` | Upcoming and past shows |
| `/photos` | Press photos (hi-res) and live photos |
| `/about` | Bio, members, FFO, contact |
| `/epk` | Electronic press kit. **Not linked publicly** — share the URL with press directly (`noindex`, excluded from sitemap) |
| `/link-in-bio` | Link-tree page for social bios |
| `/media/fifth-element` | Standalone promo page |

## Content lives in `data/*.json`

All site content is plain JSON so it can move to a database later without touching the pages.
Typed accessors in `app/data/*.ts` are the only code that reads the JSON — pages import from there.

| File | What it holds |
| --- | --- |
| `data/band.json` | Name, subtitle, email, logo, members, FFO, bios |
| `data/links.json` | Social + streaming profile links |
| `data/releases.json` | Singles / albums: title, date, artwork, per-platform links, music video, release show |
| `data/shows.json` | Every show, past and upcoming |
| `data/venues.json` | Venue directory (name → website); venues listed here render as links on show cards |
| `data/photos.json` | Press and live photos |
| `data/credits.json` | Liner-note credit blocks (shared between releases via `creditsId`) |
| `data/tracks.json` | Demo tracks for the EPK player |
| `data/videos.json` | Music videos (YouTube URLs, newest first → homepage "Latest Video") + fifth-element page videos |

**Rule used everywhere:** an empty `url` (`""`) or a `null` field is hidden. Fill it in and it appears. No code changes needed.

### Add a show

Append to `shows` in `data/shows.json`:

```json
{
  "id": "2026-10-31-hotel-vegas",
  "date": "2026-10-31",
  "title": "So Many Cults, Band Two, Band Three",
  "venue": "Hotel Vegas",
  "address": "1502 E 6th St, Austin, TX 78702",
  "time": "Doors 9:00 PM",
  "price": "$12, 21+",
  "presenter": null,
  "festival": null,
  "lineup": ["So Many Cults", "Band Two", "Band Three"],
  "description": null,
  "ticketUrl": "https://...",
  "isReleaseShow": false
}
```

- Order in the file doesn't matter; the site sorts by `date` and moves shows to "Past" automatically (pages revalidate hourly).
- `date: null` = TBA; it is listed under Upcoming after dated shows.
- `address` is kept for records but never rendered.
- `isReleaseShow: true` adds the "★ Release Show" badge.
- `poster`: `{ "thumbnail": "/posters/thumbnails/<id>.jpg", "fullSize": "/posters/<id>.jpg" }` or `null`. Drop the flyer in `public/posters/` and make an 800px thumbnail (`sips -Z 800 in.jpg --out public/posters/thumbnails/<id>.jpg`), then run `npm run blur`.

### Announce the single / EP

Edit `data/releases.json`:

1. Set `title`, `releaseDate` (`YYYY-MM-DD`), and `artwork` (drop the image in `public/`, e.g. `/artwork/single.jpg`).
2. Paste pre-save / streaming URLs into `links`. Before release they're labeled "Pre-save"; set `status: "released"` on release day and they become "Listen".
3. Paste the YouTube URL into `video.url` (watch, share, or shorts links all work). Leave `null` until the premiere.
4. For the EP, point `releaseShowId` at the show's `id` in `shows.json` and fill in that show's date / venue.

The release with `featured: true` drives the homepage hero, `/music`, the EPK, and the link-in-bio button.

### Add lyrics

Each release in `data/releases.json` has a `tracklist` of `{ title, duration, lyrics }`. Paste lyrics as a plain string using `\n` for line breaks and a blank line (`\n\n`) between verses. The "Lyrics" row appears automatically once any track has lyrics; each track is its own collapsible entry.

### Add social / streaming links

Paste URLs into `data/links.json`. Platforms with icons: `instagram`, `tiktok`, `youtube`, `facebook`, `spotify`, `apple-music`, `bandcamp`, `youtube-music`, `amazon-music`, `tidal`, `soundcloud`. Anything else gets a generic link icon (add to `PLATFORM_ICONS` in `app/data/links.ts` if you want a specific one).

### Add press / live photos

```bash
npx -p sharp node scripts/generate-thumbnails.mjs ~/Downloads/press-photos --prefix press
```

This copies originals to `public/photos/`, writes 800px thumbnails to `public/photos/thumbnails/`, and prints JSON entries to paste into `data/photos.json` under `press` (or `live`). Fill in `photographer`, `photographerLink`, `date`, and `venue`. The first press photo becomes the homepage hero image; `featuredPhotoId` controls the link-in-bio avatar and default social share image.

### Blur-up placeholders

Every image under `public/artwork`, `public/photos` and `public/posters` gets a tiny base64 placeholder that `next/image` shows (blurred) while the real file loads. They live in `data/blur-placeholders.json`, which is committed. Regenerate it whenever you add, replace or remove images:

```bash
npm run blur
```

Images without an entry simply load without a placeholder, so forgetting this is harmless — just less polished.

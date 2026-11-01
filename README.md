# Pablo Piovano: portfolio

Personal site of Pablo Piovano: Director of AI at OZ Digital, Microsoft MVP (AI) and Docker Captain. It centralizes talks, videos, posts, open source work and community events since 2021.

Live site: https://pablitopiova.github.io/

Static HTML, CSS and vanilla JS (no framework, no build step for the page itself), published with GitHub Pages from `main`.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | Page layout: hero, What I do, book, communities, contributions, details dialog |
| `styles.css` | All styling, including the mobile rules |
| `app.js` | Renders the page, filters and the details dialog from `window.SITE` |
| `data.js` | **Generated.** Holds the profile and every contribution. Never edit by hand |
| `assets/brand/` | Logos and images (MVP, Docker, community icons, book cover) |
| `assets/themes/` | Fallback images for entries without a thumbnail |
| `tools/` | Scripts that import data and generate `data.js` |
| `data/` | **Local only, not published** (see below) |

## Data model

Each entry in `data.js` looks like this:

```js
{
  id: "p-9a838f5d",
  type: "video",          // talk, video, blog, article, community, code, mentoring, podcast, other
  date: "2026-04-17",     // real publication or event date
  dateApprox: false,      // true shows "Date to be confirmed"
  title: "OpenClawNet 1: Scaffolding, Gateway and Local Chat (Microsoft Reactor livestream)",
  area: ".NET",
  pillar: ".NET & developer tools",
  role: "Contributor",    // Author, Speaker, Organizer, Contributor...
  description: "...",
  thumbGenerated: false,  // true when the image is generated, not from the source
  url: "https://youtube.com/watch?v=...",
  source: "youtube",      // youtube, linkedin_post, linkedin_article, github, meetup...
  thumb: "https://i.ytimg.com/vi/.../hqdefault.jpg"
}
```

The profile (name, bio, links to LinkedIn, GitHub, MVP and Docker profiles) lives at the top of the same file.

## Updating the site

Requires Node.js 20 or later.

1. Import the new month: `node tools/import-month.mjs path\to\month.csv`
   (rows marked `SALTEADA` are skipped; `SOLO_SITIO` rows are typed as blog posts).
2. Regenerate the data: `node tools/build-data.mjs` (takes about a minute, it fetches thumbnails).
3. Preview locally: `node tools/serve.mjs`, then open http://localhost:4173.
4. Publish: `git add -A`, `git commit`, `git push`. GitHub Pages redeploys in about a minute.

One-off entries can be added with a small script, as in `tools/add-october.mjs`.

## Source data and privacy

`data/` holds the source of truth: the export from the MVP portal, dates and profile overrides. It is listed in `.gitignore` on purpose and is **not** in this repo, so only `data.js` is public. Keep a backup of `data/` outside the repo (for example in OneDrive), because it cannot be recovered from GitHub.

Do not commit CSV files, tokens or personal contact details. The site only publishes information that is already public.

## Conventions

- Site content is in English.
- Dates are publication dates, not upload dates.
- Page order: hero, What I do, My book, Communities I organize, Contributions.
- The MVP and Docker logos link to the official profiles.
- Thumbnails load from their original source (YouTube, LinkedIn, GitHub) and are not copied into the repo.

## Pending

- Add 2021 contributions (the current data starts in 2022).
- Fill in the few entries without a date.
- Resolve the two near-duplicate throttling repo entries, pending confirmation with the MVP Lead.
- Social preview image and favicon.

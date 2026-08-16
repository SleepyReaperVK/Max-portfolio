# Max Masarski — Portfolio Site

A production-ready portfolio site for Max Masarski, a gameplay programmer
specializing in Unreal Engine 5 (melee combat, AI behavior, animation-driven
mechanics, modular ability systems). The flagship piece is a full case study
of **Pray For Plagues**, a Souls-borne action-RPG prototype, sourced from a
Notion write-up and rebuilt here as self-hosted content and media.

The original project brief (as given, before any implementation) is preserved
at [`docs/original-brief.md`](docs/original-brief.md).

## Stack

- **React 18** + **React Router v7** (two routes, one lazy-loaded)
- **MUI v9.3.1** + **Emotion** for styling — no CSS files, no styled-components
- **Vite 8** for dev server and build (manual vendor/MUI chunk splitting, see `vite.config.js`)
- **framer-motion** for the single shared reveal-on-scroll primitive (`AnimatedReveal`)
- No test runner, no linter config — verification is `npm run check:theme`, `npm run build`, and manual browser passes

## Prerequisites

- **Node 20.19+** (or 22.12+) — matches Vite 8's own engine requirement
- **ffmpeg + ffprobe on PATH** — only needed to run the media pipeline (`npm run media`); not needed for `dev`/`build`/`preview`

## Install

```bash
npm ci
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serves the built `dist/` locally, for a final pre-deploy check |
| `npm run media` | Runs `media:fetch` then `media:optimize` — re-download and re-encode source media (see below); not part of the normal dev loop |
| `npm run media:fetch` | Downloads every media asset referenced by `content-raw/*.json` (the Notion scrape) into `media-src/`. Notion's asset URLs are signed and expire, so this only works while they're still valid — it is not re-runnable against the live Notion page indefinitely |
| `npm run media:optimize` | Converts everything in `media-src/` into self-hosted, size-budgeted assets under `public/media/` (GIF → MP4 + JPG poster, PNG/JPEG → WebP) and regenerates `src/content/mediaManifest.js`. Idempotent: unchanged sources are skipped via a content-hash cache, so re-running doesn't dirty the git tree |
| `npm run check:theme` | Custom guard script (`scripts/check-theme.mjs`) — scans `src/components`, `src/pages`, `src/content` line-by-line for hardcoded hex colors, `rgb()/rgba()`, literal font families, literal px font sizes, and literal animation durations. It enforces the project's one hard styling rule: **all design values come from the MUI theme (`src/theme/`), never from a component, page, or content string.** A line can opt out with a `check-theme-ignore` comment when a literal value is genuinely unavoidable (rare) |

## Project structure

| Path | What lives there |
|---|---|
| `src/pages/` | Route-level components: `Home.jsx` (`/`), `PrayForPlagues.jsx` (`/projects/pray-for-plagues`, lazy-loaded), `NotFound.jsx` (`*`) |
| `src/components/layout/` | `PageLayout`, `NavBar`, `Footer` — shared chrome across both routes |
| `src/components/home/` | Sections composed into the home page (hero, about, skills, projects, availability, contact) |
| `src/components/caseStudy/` | Sections composed into the Pray For Plagues case study (`CaseStudyHero`, `AtAGlance`, `SystemNav`, `SystemBreakdown`, `MediaGallery`, `Lightbox`) |
| `src/components/common/` | Cross-page primitives: `Section`, `SectionHeading`, `AnimatedReveal` (the only animation entry point — respects `prefers-reduced-motion`), `MediaFrame` (the only place in `src/components` allowed to import from `src/content`), `Seo` |
| `src/content/` | All copy and structured data — see "Editing content" below |
| `src/theme/` | The MUI theme: `palette.js`, `typography.js`, `motion.js`, `components.js`, `index.js`. The single source of truth `check:theme` enforces against |
| `scripts/` | `check-theme.mjs`, `fetch-media.mjs`, `optimize-media.mjs` |
| `content-raw/` | Raw Notion scrape (JSON), one file per project section. **Provenance only — not shipped** (read by `media:fetch`, never imported by app code) |
| `media-src/` | Original downloaded media before optimization. **Provenance only — not shipped**, gitignored |
| `public/media/` | The actual optimized, self-hosted media the site serves (89 files, ~24 MB total) |

## Routes

- `/` — home page (hero, about, skills, projects, availability, contact)
- `/projects/pray-for-plagues` — the Pray For Plagues case study (its own JS chunk, loaded only when visited)
- `*` — 404 page

## Editing content

Components never hold copy or media references directly — the flow is:

1. **Edit copy or structured data in `src/content/`** (`siteConfig.js`, `about.js`, `skills.js`, `projects.js`, and the case-study content modules). Components read from these; you should never need to touch a component to change wording, a link, or which project is featured.
2. **Media is indirected through two layers:**
   - `src/content/mediaManifest.js` — auto-generated, maps a semantic key (e.g. `hero-background`) to the actual file(s) under `public/media/` plus its real intrinsic width/height (used to reserve layout space and avoid CLS). **Do not hand-edit this file** — it's regenerated by `npm run media:optimize`.
   - `siteConfig.media` — a further layer of indirection mapping *slots* (`heroBackground`, `portrait`, `projectCover`, `caseStudyHero`, `ogCover`) to manifest keys. Content modules and components reference the slot name via `<MediaFrame mediaKey="..." />`, never the manifest key or file path directly.
3. **To swap an image**, either replace the source in `media-src/` and re-run `npm run media`, or drop a new file straight into `public/media/` and add/adjust its entry in `mediaManifest.js` by hand for a one-off (not recommended long-term — the next `npm run media` will overwrite hand edits).

## Known placeholders

Two things are intentionally left unfilled, and both are invisible while unfilled (no broken links, no empty sections):

1. **CV PDF** — `siteConfig.cv.enabled` is `false` in `src/content/siteConfig.js`, so the download-CV button is hidden. To enable: drop the PDF at `public/cv/max-masarski-cv.pdf`, then set `cv.enabled: true` in `siteConfig.js`.
2. **Showreel/YouTube link** — `siteConfig.links.youtube` is an empty string, so the showreel block stays hidden. To enable: paste the real URL into `siteConfig.links.youtube`.

Two smaller, honest content gaps (not blockers, but worth knowing):

3. **Canonical/OG domain is a placeholder** — `https://maxmasarski.dev` is used in `index.html` and `SITE_ORIGIN` in `src/components/common/Seo.jsx`. It is not a registered domain. Replace both occurrences with the real domain once one exists (see `DEPLOY.md`).
4. **`hero-background`, `project-cover`, and `case-study-hero` all resolve to the same physical image** (`/media/hero-background.webp` — see the `IMAGE_ALIASES` map in `scripts/optimize-media.mjs`). A distinct, purpose-shot project-cover image (e.g. a tighter crop or a different in-game moment) would read better on the project card than reusing the hero shot.

## Deployment

See [`DEPLOY.md`](DEPLOY.md) for the manual deploy steps and [`nginx.conf.example`](nginx.conf.example) for a starting server config. This repository does not deploy itself — there is no CI/CD wired up, and none is planned here.

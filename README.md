# Max Masarski — Portfolio Site

A production-ready portfolio site for Max Masarski, a gameplay programmer
specializing in Unreal Engine 5 (melee combat, AI behavior, animation-driven
mechanics, modular ability systems). The flagship piece is a full case study
of **Pray For Plagues**, a Souls-borne action-RPG prototype, sourced from a
Notion write-up and rebuilt here as self-hosted content and media.

The original project brief (as given, before any implementation) is preserved
at [`docs/original-brief.md`](docs/original-brief.md).

## Stack

- **React 19** + **React Router v7** (two routes, one lazy-loaded)
- **MUI v9.3.1** + **Emotion** for styling — no CSS files, no styled-components
- **Vite 8** for dev server and build (manual vendor/MUI chunk splitting, see `vite.config.js`)
- **framer-motion** for the single shared reveal-on-scroll primitive (`AnimatedReveal`)
- No test runner, no linter config — verification is `npm run check:theme`, `npm run build`, and manual browser passes

## Prerequisites

- **Node 20.19+** (or 22.12+) — matches Vite 8's own engine requirement; enforced via the `engines` field in `package.json`
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
| `npm run media` | Runs `media:fetch` then `media:optimize`. **This was a one-shot import script, not a repeatable content workflow — do not run it to update an existing image** (see "Known inconsistency" below and the media:fetch row). It has no purpose left once `media-src/` and `public/media/` are in their current state |
| `npm run media:fetch` | Downloaded every media asset referenced by `content-raw/*.json` (the Notion scrape) into `media-src/`, once, during initial content import. Notion's asset URLs are signed and expired long ago, so **this can no longer run to completion** — it hard-exits on the first failed download (`fetch-media.mjs:110`/`115`). It also has no skip-if-exists guard, so even if the URLs still worked it would silently overwrite any manual replacement already sitting in `media-src/`. Kept for provenance/reference only |
| `npm run media:optimize` | Converts everything in `media-src/` into self-hosted, size-budgeted assets under `public/media/` (GIF → MP4 + JPG poster, PNG/JPEG → WebP) and regenerates `src/content/mediaManifest.js`. Idempotent: unchanged sources are skipped via a content-hash cache, so re-running doesn't dirty the git tree |
| `npm run check:theme` | Custom guard script (`scripts/check-theme.mjs`) — scans `src/components`, `src/pages`, `src/content` line-by-line and flags the five most common hardcoded-value leaks: hex colors, `rgb()/rgba()`, literal font families, literal px font sizes, and literal animation durations. It does **not** catch named CSS colors (`red`), `hsl()`, hardcoded spacing, or shadows, and it does not scan `index.html`, `src/theme/**`, `vite.config.js`, or `public/**` at all (those are the theme's own definitions and are exempt by design). Within its scope, the rule it enforces is: **design values come from the MUI theme (`src/theme/`), not from a component, page, or content string.** A line can opt out with a `check-theme-ignore` comment when a literal value is genuinely unavoidable (rare) |

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
| `public/fonts/` | Self-hosted `.woff2` files, loaded via the `@font-face` rules in `src/theme/components.js`. This is how fonts actually ship — `@fontsource/cinzel`/`@fontsource/inter` are devDependencies used only to source these files, not runtime dependencies |
| `public/favicon.svg`, `public/robots.txt` | Static, unprocessed — copied to `dist/` as-is by Vite |
| `docs/` | `original-brief.md` (the original project brief), `manual-review-checklist.md` (the owner's hand-off checklist — including the items never verified in a browser), plus the `superpowers/` spec and plan this project was built from |

## Routes

- `/` — home page (hero, about, skills, projects, availability, contact)
- `/projects/pray-for-plagues` — the Pray For Plagues case study (its own JS chunk, loaded only when visited)
- `*` — 404 page

## Editing content

Components never hold copy or media references directly — the flow is:

1. **Edit copy or structured data in `src/content/`** (`siteConfig.js`, `about.js`, `skills.js`, `projects.js`, and the case-study content modules under `src/content/prayForPlagues/`). Components read from these; you should never need to touch a component to change wording, a link, or which project is featured.

2. **`src/content/mediaManifest.js`** is the bottom layer: auto-generated by `npm run media:optimize`, it maps a manifest key (e.g. `hero-background`) to the actual file(s) under `public/media/` plus real intrinsic width/height (used to reserve layout space and avoid CLS). `MediaFrame` (the component that renders all media) always receives a resolved manifest key as its `mediaKey` prop and looks it up directly — `mediaManifest[mediaKey]`. **Do not hand-edit this file** — the next `npm run media:optimize` overwrites it.

3. **`siteConfig.media`** sits above the manifest for *some* content, not all of it. It maps five named slots (`heroBackground`, `portrait`, `projectCover`, `caseStudyHero`, `ogCover`) to manifest keys. Two content fields store a slot name that the **page** resolves before handing a manifest key down to `MediaFrame`:
   - `projects[].cover` (`projects.js:8`, value `'projectCover'`) — resolved in `Home.jsx`
   - `prayForPlagues.hero.src` (`prayForPlagues/index.js:12`, value `'caseStudyHero'`) — resolved in `PrayForPlagues.jsx`

   Everything else that reaches `MediaFrame` — the ~30 case-study gallery images (declared as `{ key: 'ai-boss-data-asset', ... }` etc. in the `prayForPlagues/*.js` content modules, passed straight through by `MediaGallery`) — uses a raw manifest key directly and never touches `siteConfig.media` at all.

4. **To swap an image:**
   - **Cheapest, for a live slot (`heroBackground`, `ogCover`, `projectCover`, `caseStudyHero`):** repoint the slot at a different existing manifest key, e.g. `siteConfig.media.projectCover = 'some-other-key'` — no rebuild of media needed if that key's file already exists.
   - **For anything (a slot's target key, `about.js`'s `portrait`, or a raw gallery key):** replace the source in `media-src/` and re-run `npm run media:optimize` (see "Known inconsistency" below for why `npm run media` is *not* what you want here), which re-derives `mediaManifest.js` for that key without changing what any content module points at.
   - **One-off / no ffmpeg available:** drop a file straight into `public/media/` and hand-edit its entry in `mediaManifest.js` — not recommended long-term, since the next `npm run media:optimize` regenerates the whole file and will overwrite the hand edit unless the underlying source in `media-src/` was updated too.

### Known inconsistency

The `siteConfig.media` indirection layer is applied unevenly, and this README describes that as-found rather than as originally intended (re-wiring it now was ruled out of scope for a documentation-only task):

- The **portrait has no slot at all** — `about.js` holds a raw manifest key (`portrait: 'portrait'`) that `Home.jsx` passes to `AboutSection` as `portraitKey`, straight to `MediaFrame`. To change the portrait, edit `about.js`'s `portrait` field directly. (A dead `siteConfig.media.portrait` slot used to sit here, silently ignored; it was removed so nothing reads as live when it isn't.)
- `siteConfig.media.heroBackground` and `siteConfig.media.ogCover` **are** read directly (`Home.jsx`, `PrayForPlagues.jsx`) — editing those does work.
- `siteConfig.media.projectCover` and `siteConfig.media.caseStudyHero` are read only because `projects.js` and `prayForPlagues/index.js` store the slot *name* as a string and the page looks it up — editing the slot value works for these two.
- Case-study gallery images (all `prayForPlagues/*.js` content modules' `media: [...]` arrays) bypass slots entirely — edit the `key:` field directly to point at a different manifest entry.

If you're not sure which one applies to the image you're changing: **`siteConfig.media` is live for `heroBackground`, `ogCover`, `projectCover`, and `caseStudyHero` — edit the slot there. The portrait has no slot — edit the manifest key in `about.js` directly instead. For any gallery/system-breakdown image, always edit the manifest key in its content module directly — `siteConfig.media` was never in that path.**

## Known placeholders

Two things are intentionally left unfilled, and both are invisible while unfilled (no broken links, no empty sections):

1. **CV PDF** — `siteConfig.cv.enabled` is `false` in `src/content/siteConfig.js`, so the download-CV button is hidden. To enable: drop the PDF at `public/cv/max-masarski-cv.pdf`, then set `cv.enabled: true` in `siteConfig.js`.
2. **Showreel/YouTube link** — `siteConfig.links.youtube` is an empty string, so the showreel block stays hidden. To enable: paste the real URL into `siteConfig.links.youtube`.

Two smaller, honest content gaps (not blockers, but worth knowing):

3. **Canonical/OG domain is a placeholder** — `https://maxmasarski.dev` is used in `index.html` and `SITE_ORIGIN` in `src/components/common/Seo.jsx`. It is not a registered domain. Replace both occurrences with the real domain once one exists (see `DEPLOY.md`).
4. **`hero-background`, `project-cover`, and `case-study-hero` all resolve to the same physical image** (`/media/hero-background.webp` — see the `IMAGE_ALIASES` map in `scripts/optimize-media.mjs`). A distinct, purpose-shot project-cover image (e.g. a tighter crop or a different in-game moment) would read better on the project card than reusing the hero shot.

## Deployment

See [`DEPLOY.md`](DEPLOY.md) for the manual deploy steps and [`nginx.conf.example`](nginx.conf.example) for a starting server config. This repository does not deploy itself — there is no CI/CD wired up, and none is planned here.

# Design Spec — Max Masarski, Gameplay Programmer Portfolio

**Date:** 2026-08-16
**Status:** Approved design, pending implementation plan
**Repo:** `C:/Users/vadim.k/Documents/personal/max`

---

## 1. Purpose

A production-ready personal portfolio site for **Max Masarski**, a gameplay
programmer (Unreal Engine 5, C++), aimed at recruiters, studios, and
collaborators in the game industry. The site's job is to make a hiring
decision easy: show who he is, show one deep, credible engineering case
study, and state plainly that he is available for hybrid, remote, or
relocation work.

The flagship (and currently only) project is **Pray For Plagues**, a
Souls-borne action-RPG prototype built solo in UE5.

### Success criteria

1. A recruiter landing on `/` understands role, skill set, and availability within one screen and one scroll.
2. The Pray For Plagues case study reads as engineering evidence, not marketing — real system breakdowns with supporting media.
3. Availability (hybrid / remote / relocation) is visually prominent, not buried in a footer.
4. `npm run build` produces a clean static bundle deployable to a Hetzner box behind nginx.
5. The site works and looks right at 390 px, 768 px, and 1440 px, with no console errors.

### Non-goals (YAGNI)

No CMS, no i18n, no blog, no contact-form backend (mailto only), no
light/dark toggle, no unit/E2E test suite, no analytics, no admin area,
no server-side rendering.

---

## 2. Stack

| Layer | Choice | Reason |
|---|---|---|
| Build | Vite 8 | Fast dev, minimal config, plain static output |
| UI runtime | React 19 | Current stable; what MUI v9 targets |
| Components | MUI v9 | Required by the brief |
| Styling | Emotion (`styled` + `sx`) | MUI's native engine; no second CSS system |
| Layout reference | Material Kit React | Hero + card + sectioned-hierarchy conventions |
| Routing | react-router-dom v7 | Two routes, case study lazy-loaded |
| Motion | framer-motion v13 | Scroll reveal, hero entrance; MUI transitions for the small stuff |
| Media | Local files in `public/media/` | Notion URLs are signed and expire |
| Hosting | Static `dist/` on Hetzner + nginx, custom domain | User-owned infrastructure |

**Node:** 26.7.0 local. **Package manager:** npm 11.

### 2.1 Version correction (2026-08-16)

This table originally specified Vite 5 / React 18 / MUI v5 / react-router v6.
The scaffold was built on the current stable releases instead, and the
installed versions above are now authoritative. Anything written against
MUI v5 conventions must be re-checked against v9 before it is trusted.

Two v9 behaviour changes have already caused defects in this codebase:

1. **`Typography` `color` accepts only enum tokens.** The dot-path form
   `color="primary.main"` is silently dropped — the emitted class carries no
   colour declaration at all (verified in
   `node_modules/@mui/material/Typography/Typography.js`). Use `sx={{ color:
   'primary.main' }}` instead.
2. **`MuiButtonBase` injects `outline: 0`** after `CssBaseline` at equal
   specificity, so a bare `:focus-visible` rule in `theme/components.js` never
   wins. Focus rings must be declared via
   `MuiButton.styleOverrides.root` + `&.Mui-focusVisible`.

Grid/Stack layout props also leak to the DOM more readily than in v5; two
builders hit this independently.

---

## 3. Content

### 3.1 Source of truth

All copy is real, scraped from the user's public Notion site on 2026-08-16
and stored as raw JSON in `content-raw/` (kept in the repo, **not** shipped
in the bundle):

| File | Notion page |
|---|---|
| `notion-home.json` | Pray For Plagues, Souls-borne Prototype (landing) |
| `notion-overview.json` | Project Overview |
| `notion-combat.json` | Combat System Breakdown |
| `notion-interaction.json` | Interaction System Breakdown |
| `notion-audio.json` | Audio & Feedback System Breakdown |
| `notion-inventory.json` | Inventory System Breakdown |
| `notion-ai.json` | AI System Breakdown |
| `notion-level-design.json` | Level Design Breakdown |

Each file holds `{ url, text, media[] }` where `text` is the fully
expanded page text (all Notion toggles opened) and `media` is every
image/video URL found on the page.

**Rule:** builder agents transcribe from these files into
`src/content/`. They may lightly edit for grammar and typography (the
source has some typos and inconsistent spacing) but must **not** invent
technical claims, metrics, or features that are not in the source.

### 3.2 Personal details (confirmed by the user)

| Field | Value |
|---|---|
| Name | Max Masarski |
| Role | Gameplay Programmer (Unreal Engine 5) |
| Email | max.masarski@gmail.com |
| Location | Israel |
| Work preference | Hybrid / remote / **open to opportunities abroad and relocation** |
| LinkedIn | https://www.linkedin.com/in/max-masarski-86256b222/ |
| GitHub (project) | https://github.com/Maxer1189/Souls-like_GameProject |
| Photo | LinkedIn display photo (expiring URL — must be downloaded locally) |
| Domain | Custom domain on Hetzner |

### 3.3 Known placeholders

Only two, both config-driven and self-hiding:

1. **CV / resume PDF** — expected at `public/cv/max-masarski-cv.pdf`.
   `siteConfig.cv.enabled` controls whether the download button renders.
2. **YouTube showreel** — `siteConfig.links.youtube`. The showreel embed
   and nav link render only when this is a non-empty string.

Both must be marked with a `// PLACEHOLDER:` comment in `siteConfig.js`.

### 3.4 Content module shape

```
src/content/
  siteConfig.js       identity, links, availability, cv, seo/meta
  about.js            About Me prose, portrait path
  skills.js           [{ name, category, icon }]  C++, Python, UE5, Blueprints, Blender
  projects.js         [{ slug, title, tagline, summary, cover, tags, href }]
  prayForPlagues/
    index.js          hero, at-a-glance stats, overview, contributions, order of sections
    overview.js       combat.js       interaction.js
    audio.js          inventory.js    ai.js          levelDesign.js
```

Every system module exports the same shape so one component renders all
seven:

```js
export default {
  id: 'combat',
  title: 'Combat System',
  summary: '...one-paragraph hook...',
  sections: [ { heading, paragraphs: [], media: [ { src, poster, alt, caption, type } ] } ],
}
```

---

## 4. Media pipeline

Notion media URLs carry `expirationTimestamp` and signatures; they will
break within weeks. Everything is downloaded and optimized once.

- `scripts/fetch-media.mjs` — reads every `media[]` array in
  `content-raw/`, downloads to `media-src/`, writes a manifest mapping
  original URL → local filename.
- `scripts/optimize-media.mjs` — converts GIFs to **H.264 MP4** (order
  of magnitude smaller), generates a **WebP poster frame** per clip,
  resizes screenshots to a max width of 1600 px and emits WebP, and
  writes `src/content/mediaManifest.js`.
  *Correction (Task 2, landed):* the WebM/VP9 output this spec originally
  required was dropped, and the freed 8.3 MB spent on raising clips from
  480 px to 720 px wide. Every current browser plays H.264 MP4 and every
  clip carries a poster, so the second encode bought nothing.
- Output lands in `public/media/`. `media-src/` is gitignored.
- Clips render as muted, looping, `playsInline`, `preload="none"`
  `<video>` elements with the poster as the placeholder — visually a GIF,
  a fraction of the bytes, and they only load when scrolled near.

If `ffmpeg` is unavailable on the machine, the script must fall back to
copying the original files unchanged and print a clear warning rather than
failing the build.

---

## 5. Theme and visual system

Dark, cinematic, built on Material Kit React's structural conventions
(full-bleed hero, elevated cards, generous section rhythm, clear type
scale).

| Token | Value | Use |
|---|---|---|
| `background.default` | `#0B0B0D` | Page |
| `background.paper` | `#141416` | Cards, panels |
| `primary.main` | `#C8A24A` (ember gold) | CTAs, accents, active nav |
| `secondary.main` | `#7A2B2B` (dried blood) | Secondary accents, dividers |
| `text.primary` | `#EDEAE4` | Body |
| `text.secondary` | `#A09A90` | Captions, meta |
| `divider` | `rgba(200,162,74,0.18)` | Section edges |

- **Headings:** a display serif (e.g. Cinzel or Marcellus) — self-hosted, `font-display: swap`, subset to Latin.
- **Body:** Inter — self-hosted, same rules.
- **Radius:** 8 px. **Shadows:** two custom elevations only, both soft and dark.
- **Motion:** durations 200 / 400 / 700 ms; easing `cubic-bezier(0.16, 1, 0.3, 1)`. Every animation is a fade + small translate (max 24 px). No parallax, no bouncing, no scroll-jacking.
- **`prefers-reduced-motion`** is respected globally: transforms drop to instant opacity changes, and clips do not autoplay.

**Hard rule for all agents:** no hex value, spacing number, font family,
or animation duration may be written outside `src/theme/`. Components use
theme tokens and the `spacing()` scale exclusively. This is the single
constraint that keeps independently built slices looking like one site.

---

## 6. Structure

### 6.1 `/` — home, one scroll

| Order | Section | Content |
|---|---|---|
| 1 | NavBar | Transparent over hero, solid + condensed after scroll. Anchor links; mobile drawer. |
| 2 | Hero | Name, "Gameplay Programmer (Unreal Engine 5)", the Souls-borne tagline, two CTAs: *View case study* / *Get in touch*. Background: darkened gameplay screenshot. |
| 3 | Featured project | One wide `ProjectCard` for Pray For Plagues → case study route. |
| 4 | About | The real "Hello there! I'm Max..." prose + portrait. Includes the 2019-learning / 2024-development timeline and the "eager to join a team" note. |
| 5 | Skills | Grid: C++, Python, Unreal Engine 5, Blueprints, Blender. |
| 6 | **Availability** | Full-width band, accent-bordered: hybrid · remote · **open to relocation / opportunities abroad**, plus base location (Israel). Deliberately its own visual event. |
| 7 | Contact | Email (mailto), LinkedIn, GitHub, CV download (when present). |
| 8 | Footer | Name, year, links, "built with React + MUI". |

### 6.2 `/projects/pray-for-plagues` — case study (lazy-loaded)

1. Cinematic hero — title, one-line pitch, GitHub CTA.
2. At-a-glance strip — Engine: UE5 · Language: C++ / Blueprints · Role: solo developer · Foundation: GAS + attribute system · Tools: Blender.
3. Project summary + **My Role & Contributions** (the six areas from the Notion overview: gameplay engineering, AI engineering, level design, combat engineering, audio & feedback, UI & player feedback).
4. Six anchored system sections in this order: **Combat · AI · Interaction · Inventory · Audio & Feedback · Level Design**, each with prose plus its own media gallery. (The seventh Notion page, Project Overview, feeds items 2 and 3 above rather than getting its own section.) Sticky side nav on desktop, sequential on mobile.
5. Media lightbox — click any image/clip to view large; Esc / arrow keys / click-away to close; focus trapped and restored.
6. Closing CTA — GitHub repo + contact.

### 6.3 `/404`

Simple themed page with a link home.

---

## 7. Component contracts

All components are **presentational and content-agnostic**: they receive
data via props and never import from `src/content/`. Pages do the wiring.
This is what allows slices to be built and verified in isolation.

| Component | Props | Responsibility |
|---|---|---|
| `PageLayout` | `children` | NavBar + main + Footer, scroll restoration |
| `NavBar` | `links[]`, `variant` | Nav, scroll state, mobile drawer |
| `Section` | `id`, `title`, `eyebrow`, `children`, `dense` | Consistent vertical rhythm + heading treatment |
| `AnimatedReveal` | `children`, `delay`, `direction` | Single scroll-reveal primitive — the only place motion-on-scroll is implemented |
| `MediaFrame` | `src`, `poster`, `alt`, `type`, `caption` | Renders image or looping clip, lazy, aspect-ratio-stable |
| `ProjectCard` | `project`, `featured` | Project teaser, two layouts |
| `HeroSection` | `name`, `role`, `tagline`, `ctas[]`, `backgroundSrc` | Landing hero |
| `AboutSection` | `paragraphs[]`, `portrait` | About |
| `SkillsSection` | `skills[]` | Skill grid |
| `AvailabilitySection` | `modes[]`, `location`, `note` | The availability band |
| `ContactSection` | `email`, `links[]`, `cv` | Contact |
| `SystemBreakdown` | `system` | Renders one system module (prose + gallery) |
| `MediaGallery` | `items[]`, `onOpen` | Grid of `MediaFrame`s |
| `Lightbox` | `items[]`, `index`, `onClose`, `onNavigate` | Accessible overlay viewer |

**Accessibility floor for every slice:** semantic landmarks, one `h1` per
page, alt text on all media, visible focus rings, keyboard-operable
drawer/lightbox, and contrast ≥ 4.5:1 for body text.

---

## 8. Build and delivery pipeline

Eleven slices. Each is built by a **low-effort builder agent** working
from a written contract, then checked by an **Opus medium-effort
verifier agent** before anything downstream starts.

### 8.1 Slice table

| # | Slice | Owns | Depends on | Parallel with |
|---|---|---|---|---|
| 0 | Scaffold + theme + fonts | `package.json`, `vite.config.js`, `index.html`, `src/theme/*`, `src/main.jsx`, `src/App.jsx` | — | none (foundation) |
| 1 | Content modules | `src/content/**` (except `mediaManifest.js`) | 0 | 2 |
| 2 | Media fetch + optimize | `scripts/*`, `public/media/**`, `src/content/mediaManifest.js` | 0 | 1 |
| 3 | Layout shell + primitives | `components/layout/*`, `components/common/*`, `pages/*` skeletons, router | 0 | — |
| 4 | Hero | `components/home/HeroSection.jsx` | 1, 3 | 5, 6, 7 |
| 5 | About + Skills | `components/home/AboutSection.jsx`, `SkillsSection.jsx` | 1, 3 | 4, 6, 7 |
| 6 | Projects + card | `components/home/ProjectsSection.jsx`, `ProjectCard.jsx` | 1, 3 | 4, 5, 7 |
| 7 | Availability + Contact | `components/home/AvailabilitySection.jsx`, `ContactSection.jsx` | 1, 3 | 4, 5, 6 |
| 8 | Case study page | `components/caseStudy/*`, `pages/PrayForPlagues.jsx` | 1, 2, 3 | 4–7 |
| 9 | Polish pass | motion tuning, lazy media, code-split, SEO/OG tags, favicon, 404 | 4–8 | — |
| 10 | Prod build + deploy artifacts | `nginx.conf.example`, `README.md`, `DEPLOY.md`, `.gitignore` | 9 | — |

**No two concurrent agents may write the same file.** The "Owns" column is
the lock. Anything outside a slice's owned paths is read-only for that
agent.

### 8.2 Builder agent contract (per slice)

Each builder agent receives: the slice's goal, its owned file paths, the
component prop contracts from §7, the theme rule from §5, the relevant
`content-raw/` files, and its acceptance criteria. It must finish with
`npm run build` passing.

### 8.3 Verifier agent contract (per slice, Opus, medium effort)

For each slice the verifier independently:

1. Runs `npm run build` — must exit 0 with no warnings about missing modules.
2. Runs `npm run dev` and renders the affected route in real Chrome at **390 px, 768 px, 1440 px**.
3. Captures the console — **zero errors**; warnings must be explained.
4. Checks the slice's acceptance criteria one by one.
5. Confirms the theme rule: greps the slice's diff for raw hex colors, `px` font sizes, and hardcoded durations outside `src/theme/`.
6. Returns **PASS**, or **FAIL with a specific defect list** (file, line, what's wrong, what's expected).

On FAIL the builder gets one retry with the defect list. A second FAIL
escalates to the user rather than looping.

### 8.4 Integration gates

**Gate A — after slice 8.** Whole site rendered end to end: all sections
present in the right order, one consistent visual language across
independently-built sections, no layout breaks or overlapping elements at
any breakpoint, all internal links and anchors resolve, case study route
loads and its lazy chunk splits correctly.

**Gate B — after slice 10.** Production build only:

- `npm run build` clean; `npm run preview` serves without errors
- Initial JS ≤ **250 KB gzipped**; case study chunk loads separately
- No console errors on either route
- All media resolves locally (no request to `notion.so`, `notion.site`, or `licdn.com`)
- Meta/OG tags present, favicon present, 404 route works
- `prefers-reduced-motion` honoured
- No dev-only artifacts, dead files, or commented-out blocks left in

### 8.5 Deployment boundary

Slice 10 produces the build output, an example nginx config, and written
deploy instructions — and stops there. **Nothing is uploaded to the
Hetzner server by any agent.** The user deploys manually.

---

## 9. Risks

| Risk | Mitigation |
|---|---|
| Independently-built sections drift visually | Theme-token-only rule (§5), enforced by the verifier's grep step (§8.3.5) |
| Notion media URLs expire mid-build | Slice 2 runs early and downloads everything; a failed download is a hard error, not a skip |
| `ffmpeg` missing on the machine | Optimizer falls back to copying originals with a loud warning |
| Combat-page media volume hurts load time | GIF → MP4/WebM, `preload="none"`, lazy mount below the fold |
| Copy inflated beyond what the source supports | Builders transcribe from `content-raw/`; inventing technical claims is an explicit FAIL condition |
| Case study bundle bloats the landing page | Route-level lazy loading, enforced by the 250 KB budget at Gate B |

---

## 10. Open items

- CV PDF — user to supply; placeholder path reserved
- YouTube showreel URL — user to supply; section hidden until then
- Final domain name — needed only for canonical/OG URLs in slice 9

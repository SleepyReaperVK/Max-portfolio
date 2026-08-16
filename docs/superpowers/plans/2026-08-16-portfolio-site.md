# Max Masarski Portfolio Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready React + MUI portfolio site for Max Masarski (gameplay programmer, UE5) with a deep case study of the Pray For Plagues prototype, deployable as static files to a Hetzner box.

**Architecture:** Vite + React 19 SPA with two routes — a single-scroll home page and a lazy-loaded case-study page. All visual decisions live in a central MUI theme; every component is presentational and receives content as props, so eleven independently-built slices still render as one coherent site. All copy comes from pre-scraped Notion JSON in `content-raw/`; all media is downloaded and optimized into `public/media/` because the source URLs expire.

**Tech Stack:** Vite 8.2, React 19.2, MUI v9.3, Emotion 11, framer-motion 13, react-router-dom 7.18, ffmpeg (media optimization), Node 26.7.0, npm 11.17.0, ffmpeg 8.1.2 (all verified against `node_modules/` on 2026-08-16).

> **Version correction:** this plan originally specified Vite 5 / React 18 /
> MUI v5 / react-router v6. The scaffold was built on current stable instead.
> Read spec §2.1 before writing MUI code — two v5-era patterns fail silently
> under v9 (`Typography color="primary.main"` and bare `:focus-visible` rules).

**Spec:** `docs/superpowers/specs/2026-08-16-portfolio-design.md`

---

## Global Constraints

Every task's requirements implicitly include this section.

1. **No hardcoded design values outside `src/theme/`.** No hex colors, no `rgb()`, no raw `px` font sizes, no animation durations, no font families anywhere in `src/components/`, `src/pages/`, or `src/content/`. Use theme tokens (`theme.palette.*`, `theme.spacing()`, `theme.typography.*`, `theme.transitions.*`) only. This is a FAIL condition at verification.
2. **Components never import from `src/content/`.** Content flows in as props from `src/pages/*`. Only pages and `App.jsx` import content modules.
3. **Copy is transcribed, never invented.** All prose originates in `content-raw/*.json`. Grammar and typography fixes are allowed; inventing technical claims, metrics, features, or dates is a FAIL condition.
4. **No external network requests at runtime.** No `notion.so`, `notion.site`, `licdn.com`, Google Fonts CDN, or any other remote host in shipped code. Fonts and media are self-hosted from `public/`.
5. **Accessibility floor, every slice:** semantic landmarks, exactly one `<h1>` per route, alt text on every image and video, visible focus rings, keyboard operability, body-text contrast ≥ 4.5:1.
6. **`prefers-reduced-motion` is honoured** by every animated element.
7. **Responsive at 390 px, 768 px, 1440 px.** No horizontal page scroll at any width.
8. **Zero console errors** in dev or preview.
9. **File ownership is exclusive.** A task may only create/modify the files in its own **Files** block. Everything else is read-only for that task.
10. **Placeholders are config-driven and self-hiding.** Only two exist: the CV PDF (`siteConfig.cv`) and the YouTube showreel (`siteConfig.links.youtube`). Both must be marked `// PLACEHOLDER:` in `siteConfig.js` and both must cause their UI to be omitted entirely (not rendered greyed-out) while empty.
11. **Never deploy.** No task uploads, syncs, or pushes anything to any server. Task 10 produces build artifacts and instructions only.

**Confirmed personal data** (use verbatim):

| Field | Value |
|---|---|
| Name | Max Masarski |
| Role | Gameplay Programmer (Unreal Engine 5) |
| Email | maxer.masarski@gmail.com |
| Location | Israel |
| Availability | Hybrid · Remote · Open to opportunities abroad and relocation |
| LinkedIn | https://www.linkedin.com/in/max-masarski-86256b222/ |
| GitHub | https://github.com/Maxer1189/Souls-like_GameProject |

---

## Verification Model (read before Task 0)

This project has **no unit-test suite** — it is a static content site where the meaningful failures are visual, not logical (spec §1 non-goals). TDD's red/green cycle is therefore replaced by a **build-and-render cycle** that every task runs as its own gate:

**The standard verification cycle** — referenced by every task as "run the standard verification cycle":

1. `npm run build` — must exit 0, no unresolved-import warnings.
2. `npm run dev` in the background, then load the affected route in Chrome.
3. Resize to **390 px**, **768 px**, **1440 px**; screenshot each.
4. Read the browser console — **zero errors**.
5. Check the task's acceptance criteria one at a time.
6. Run the theme-token grep (Task 0 Step 8 installs it): `npm run check:theme` — must report no violations.

Each task is executed by a **low-effort builder agent** and then independently checked by an **Opus medium-effort verifier agent** that re-runs the cycle itself rather than trusting the builder's report. The verifier returns PASS, or FAIL with a defect list of `file:line — what's wrong — what's expected`. One retry on FAIL; a second FAIL escalates to the user.

---

## File Structure

| Path | Responsibility | Task |
|---|---|---|
| `package.json`, `vite.config.js`, `index.html`, `.gitignore`, `.editorconfig` | Build config, entry HTML, ignores | 0 |
| `scripts/check-theme.mjs` | Theme-token violation grep | 0 |
| `src/main.jsx` | React root, theme + CssBaseline providers, router | 0 |
| `src/theme/palette.js` | Color tokens | 0 |
| `src/theme/typography.js` | Type scale + font families | 0 |
| `src/theme/components.js` | MUI component overrides | 0 |
| `src/theme/motion.js` | Durations, easings, reveal variants | 0 |
| `src/theme/index.js` | Assembled theme export | 0 |
| `public/fonts/**` | Self-hosted Cinzel + Inter subsets | 0 |
| `src/content/siteConfig.js` | Identity, links, availability, cv, seo | 1 |
| `src/content/about.js` | About prose + portrait path | 1 |
| `src/content/skills.js` | Skill list | 1 |
| `src/content/projects.js` | Project teasers | 1 |
| `src/content/prayForPlagues/index.js` | Case-study assembly + stats + contributions | 1 |
| `src/content/prayForPlagues/{combat,ai,interaction,inventory,audio,levelDesign}.js` | One system breakdown each | 1 |
| `scripts/fetch-media.mjs` | Download all Notion media | 2 |
| `scripts/optimize-media.mjs` | GIF→MP4/WebM, WebP posters, resize | 2 |
| `src/content/mediaManifest.js` | Original URL → local asset map | 2 |
| `public/media/**` | Optimized shipped media | 2 |
| `src/components/layout/{NavBar,Footer,PageLayout}.jsx` | Chrome | 3 |
| `src/components/common/{Section,SectionHeading,AnimatedReveal,MediaFrame}.jsx` | Shared primitives | 3 |
| `src/pages/{Home,PrayForPlagues,NotFound}.jsx` | Route wiring | 3 (skeleton), 4–8 (filled) |
| `src/App.jsx` | Routes + lazy boundaries | 3 |
| `src/components/home/HeroSection.jsx` | Landing hero | 4 |
| `src/components/home/{AboutSection,SkillsSection}.jsx` | About + skills | 5 |
| `src/components/home/{ProjectsSection,ProjectCard}.jsx` | Project teasers | 6 |
| `src/components/home/{AvailabilitySection,ContactSection}.jsx` | Availability + contact | 7 |
| `src/components/project/{CaseStudyHero,AtAGlance,SystemBreakdown,SystemNav,MediaGallery,Lightbox}.jsx` | Case study | 8 |
| `index.html` meta, `src/components/common/Seo.jsx`, `public/favicon.svg` | SEO + polish | 9 |
| `README.md`, `DEPLOY.md`, `nginx.conf.example` | Delivery docs | 10 |

---

## Task 0: Scaffold, theme, and fonts

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `.gitignore`, `.editorconfig`
- Create: `src/main.jsx`, `src/App.jsx` (temporary placeholder), `src/theme/palette.js`, `src/theme/typography.js`, `src/theme/motion.js`, `src/theme/components.js`, `src/theme/index.js`
- Create: `scripts/check-theme.mjs`
- Create: `public/fonts/` (font files)

**Interfaces:**
- Consumes: nothing.
- Produces: `import theme from '@/theme'` (a MUI `Theme`); `theme.custom.motion.{fast,base,slow}` (ms numbers), `theme.custom.motion.easing` (string), `theme.custom.reveal` (framer-motion variants object); npm scripts `dev`, `build`, `preview`, `check:theme`; the `@` alias resolving to `src/`.

- [ ] **Step 1: Initialize the repo and Vite project**

```bash
cd C:/Users/vadim.k/Documents/personal/max
git init
npm create vite@latest . -- --template react
npm install
```

If `npm create` refuses because the directory is not empty, scaffold into a temp dir and copy `src/`, `index.html`, `vite.config.js`, `package.json` across — do not delete `README.md`, `content-raw/`, or `docs/`.

- [ ] **Step 2: Install dependencies**

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material react-router-dom framer-motion
```

- [ ] **Step 3: Write `.gitignore`**

```gitignore
node_modules
dist
media-src
.playwright-mcp
*.local
.DS_Store
```

- [ ] **Step 4: Configure Vite with the `@` alias**

`vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
  },
})
```

- [ ] **Step 5: Self-host the fonts**

Download **Cinzel** (600, 700) and **Inter** (400, 500, 600) as woff2 Latin subsets into `public/fonts/`. Use the Google Fonts static download or `npm i @fontsource/cinzel @fontsource/inter` and copy the woff2 files out of `node_modules/@fontsource/*/files/` into `public/fonts/`. Expected filenames:

```
public/fonts/cinzel-600.woff2
public/fonts/cinzel-700.woff2
public/fonts/inter-400.woff2
public/fonts/inter-500.woff2
public/fonts/inter-600.woff2
```

No `<link>` to fonts.googleapis.com anywhere (Global Constraint 4).

- [ ] **Step 6: Write the theme**

`src/theme/palette.js`:

```js
const palette = {
  mode: 'dark',
  background: { default: '#0B0B0D', paper: '#141416' },
  primary:   { main: '#C8A24A', light: '#DCBF77', dark: '#9C7B2E', contrastText: '#0B0B0D' },
  secondary: { main: '#7A2B2B', light: '#9C4444', dark: '#511B1B', contrastText: '#EDEAE4' },
  text:      { primary: '#EDEAE4', secondary: '#A09A90', disabled: '#6B665F' },
  divider: 'rgba(200, 162, 74, 0.18)',
  common: { black: '#000000', white: '#FFFFFF' },
}

export default palette
```

`src/theme/motion.js`:

```js
const motion = {
  fast: 200,
  base: 400,
  slow: 700,
  easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
}

// framer-motion variants — the ONLY scroll-reveal definition in the project
export const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: motion.base / 1000, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

export default motion
```

`src/theme/typography.js`:

```js
const display = '"Cinzel", "Times New Roman", serif'
const body = '"Inter", system-ui, -apple-system, sans-serif'

const typography = {
  fontFamily: body,
  h1: { fontFamily: display, fontWeight: 700, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.08, letterSpacing: '0.01em' },
  h2: { fontFamily: display, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.15 },
  h3: { fontFamily: display, fontWeight: 600, fontSize: 'clamp(1.5rem, 3vw, 2.125rem)', lineHeight: 1.2 },
  h4: { fontFamily: display, fontWeight: 600, fontSize: 'clamp(1.25rem, 2.2vw, 1.5rem)', lineHeight: 1.3 },
  h5: { fontFamily: body, fontWeight: 600, fontSize: '1.125rem', lineHeight: 1.4 },
  h6: { fontFamily: body, fontWeight: 600, fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase' },
  subtitle1: { fontFamily: body, fontWeight: 400, fontSize: '1.125rem', lineHeight: 1.6 },
  body1: { fontFamily: body, fontWeight: 400, fontSize: '1rem', lineHeight: 1.75 },
  body2: { fontFamily: body, fontWeight: 400, fontSize: '0.9375rem', lineHeight: 1.7 },
  caption: { fontFamily: body, fontWeight: 400, fontSize: '0.8125rem', lineHeight: 1.5 },
  button: { fontFamily: body, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'none' },
}

export { display, body }
export default typography
```

`src/theme/components.js` — includes the `@font-face` declarations so no component ever needs them:

```js
const fontFace = ['cinzel-600', 'cinzel-700', 'inter-400', 'inter-500', 'inter-600'].map((f) => {
  const [family, weight] = f.split('-')
  return {
    fontFamily: family === 'cinzel' ? 'Cinzel' : 'Inter',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: Number(weight),
    src: `url('/fonts/${f}.woff2') format('woff2')`,
  }
})

const components = (theme) => ({
  MuiCssBaseline: {
    styleOverrides: {
      '@font-face': fontFace,
      html: { scrollBehavior: 'smooth' },
      '@media (prefers-reduced-motion: reduce)': {
        html: { scrollBehavior: 'auto' },
        '*, *::before, *::after': {
          animationDuration: '0.01ms !important',
          transitionDuration: '0.01ms !important',
        },
      },
      body: { backgroundColor: theme.palette.background.default, overflowX: 'hidden' },
      '::selection': { background: theme.palette.primary.main, color: theme.palette.primary.contrastText },
      ':focus-visible': { outline: `2px solid ${theme.palette.primary.main}`, outlineOffset: 2 },
    },
  },
  MuiButton: {
    defaultProps: { disableElevation: true },
    styleOverrides: {
      root: { borderRadius: 8, paddingInline: theme.spacing(3), paddingBlock: theme.spacing(1.25) },
      outlinedPrimary: { borderColor: theme.palette.divider },
    },
  },
  MuiPaper: { styleOverrides: { root: { backgroundImage: 'none', borderRadius: 8 } } },
  MuiContainer: { defaultProps: { maxWidth: 'lg' } },
  MuiLink: { defaultProps: { underline: 'hover' }, styleOverrides: { root: { color: theme.palette.primary.main } } },
})

export default components
```

`src/theme/index.js`:

```js
import { createTheme } from '@mui/material/styles'
import palette from './palette'
import typography from './typography'
import components from './components'
import motion, { reveal } from './motion'

let theme = createTheme({
  palette,
  typography,
  shape: { borderRadius: 8 },
  spacing: 8,
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
})

theme = createTheme(theme, {
  components: components(theme),
  custom: {
    motion,
    reveal,
    section: { paddingBlock: { xs: theme.spacing(8), md: theme.spacing(14) } },
    maxTextWidth: '68ch',
  },
})

export default theme
```

- [ ] **Step 7: Wire the app root**

`src/main.jsx`:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { BrowserRouter } from 'react-router-dom'
import theme from '@/theme'
import App from '@/App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
```

`src/App.jsx` (temporary — Task 3 replaces it):

```jsx
import Typography from '@mui/material/Typography'

export default function App() {
  return <Typography variant="h1">Theme online</Typography>
}
```

Delete `src/App.css`, `src/index.css`, and `src/assets/react.svg` if the Vite template created them.

- [ ] **Step 8: Write the theme-token guard**

`scripts/check-theme.mjs`:

```js
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'

const ROOTS = ['src/components', 'src/pages', 'src/content']
const RULES = [
  [/#[0-9a-fA-F]{3,8}\b/, 'hardcoded hex color'],
  [/\brgba?\(/, 'hardcoded rgb/rgba color'],
  [/fontFamily\s*:\s*['"`]/, 'hardcoded font family'],
  [/fontSize\s*:\s*['"`]?\d+px/, 'hardcoded px font size'],
  [/(duration|transition)\s*:\s*['"`]?\d+m?s\b/, 'hardcoded animation duration'],
]

const files = []
const walk = (dir) => {
  let entries
  try { entries = readdirSync(dir) } catch { return }
  for (const e of entries) {
    const p = join(dir, e)
    if (statSync(p).isDirectory()) walk(p)
    else if (['.js', '.jsx'].includes(extname(p))) files.push(p)
  }
}
ROOTS.forEach(walk)

const violations = []
for (const file of files) {
  readFileSync(file, 'utf8').split(/\r?\n/).forEach((line, i) => {
    if (line.includes('check-theme-ignore')) return
    for (const [re, label] of RULES) {
      if (re.test(line)) violations.push(`${file}:${i + 1} — ${label} — ${line.trim().slice(0, 90)}`)
    }
  })
}

if (violations.length) {
  console.error(`\nTheme violations (${violations.length}):\n` + violations.join('\n') + '\n')
  process.exit(1)
}
console.log(`check:theme — clean (${files.length} files scanned)`)
```

- [ ] **Step 9: Add npm scripts**

In `package.json`, the `scripts` block must read:

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "check:theme": "node scripts/check-theme.mjs"
}
```

- [ ] **Step 10: Verify**

```bash
npm run check:theme
npm run build
npm run dev
```

Load `http://localhost:5173`. Expected: near-black background, "Theme online" in gold-ish off-white Cinzel serif, no console errors, no network request to any external host (check the Network tab — fonts must come from `/fonts/`).

**Acceptance criteria:**
- `npm run build` exits 0
- `npm run check:theme` reports clean
- Heading renders in Cinzel, loaded from `/fonts/`, with no request to fonts.googleapis.com
- Background is `#0B0B0D`
- Zero console errors

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + MUI with dark cinematic theme"
```

---

## Task 1: Content modules

**Files:**
- Create: `src/content/siteConfig.js`, `src/content/about.js`, `src/content/skills.js`, `src/content/projects.js`
- Create: `src/content/prayForPlagues/index.js`, `combat.js`, `ai.js`, `interaction.js`, `inventory.js`, `audio.js`, `levelDesign.js`
- Read-only: `content-raw/*.json`

**Interfaces:**
- Consumes: nothing (pure data).
- Produces:
  - `siteConfig` — `{ name, role, tagline, email, location, availability: { modes: string[], note: string }, links: { linkedin, github, youtube }, cv: { enabled: boolean, path: string, label: string }, seo: { title, description, ogImage } }`
  - `about` — `{ heading: string, paragraphs: string[], portrait: string }`
  - `skills` — `Array<{ name: string, category: 'Language'|'Engine'|'Tool', blurb: string }>`
  - `projects` — `Array<{ slug, title, tagline, summary, cover, tags: string[], href, featured: boolean }>`
  - `prayForPlagues` — `{ slug, title, tagline, hero: { src, alt }, stats: Array<{ label, value }>, summary: string[], contributions: Array<{ area: string, items: string[] }>, systems: System[], github: string }`
  - `System` — `{ id, title, summary, sections: Array<{ heading: string, paragraphs: string[], media: MediaRef[] }> }`
  - `MediaRef` — `{ key: string, alt: string, caption?: string }` where `key` is the manifest key Task 2 produces (media *paths* are resolved at render time via `mediaManifest`, so this task never hardcodes a file path)

- [ ] **Step 1: Read every source file**

```bash
node -e "for (const f of require('fs').readdirSync('content-raw')) console.log('==', f, JSON.parse(require('fs').readFileSync('content-raw/'+f,'utf8')).text.length)"
```

Then read all eight files in full. Every paragraph you write must be traceable to one of them.

- [ ] **Step 2: Write `siteConfig.js`**

```js
const siteConfig = {
  name: 'Max Masarski',
  role: 'Gameplay Programmer (Unreal Engine 5)',
  tagline:
    'Building expressive, systemic action gameplay — melee combat, AI behavior, animation-driven mechanics, and modular ability systems.',
  email: 'maxer.masarski@gmail.com',
  location: 'Israel',
  availability: {
    modes: ['Hybrid', 'Remote', 'Relocation'],
    note: 'Based in Israel and open to opportunities abroad and relocation.',
  },
  links: {
    linkedin: 'https://www.linkedin.com/in/max-masarski-86256b222/',
    github: 'https://github.com/Maxer1189/Souls-like_GameProject',
    // PLACEHOLDER: paste the showreel URL here; the showreel block stays hidden while this is empty
    youtube: '',
  },
  cv: {
    // PLACEHOLDER: set enabled to true once the PDF is dropped at public/cv/max-masarski-cv.pdf
    enabled: false,
    path: '/cv/max-masarski-cv.pdf',
    label: 'Download CV',
  },
  seo: {
    title: 'Max Masarski — Gameplay Programmer (Unreal Engine 5)',
    description:
      'Portfolio of Max Masarski, a gameplay programmer specializing in melee combat, AI behavior, and modular ability systems in Unreal Engine 5. Featuring Pray For Plagues, a Souls-borne action RPG prototype.',
    ogImage: '/media/og-cover.jpg',
  },
}

export default siteConfig
```

- [ ] **Step 3: Write `about.js`**

Transcribe the "About Me" prose from `content-raw/notion-home.json` verbatim (fix the missing apostrophes in "Ive" → "I've"). It must retain: the specialization list, the solo-development fact, learning UE in 2019, starting the project in 2024, the dream of releasing a title, the eagerness to join a team, and the closing "count me in" line. `portrait` is the manifest key `'portrait'`.

- [ ] **Step 4: Write `skills.js`**

Five entries from the Notion Skills table — C++, Python, Unreal Engine 5, Blueprints, Blender — each with `category` and a one-line `blurb` grounded in the overview page (e.g. C++: "Core gameplay systems, GAS attributes, and combat framework").

- [ ] **Step 5: Write `projects.js`**

One entry, `featured: true`:

```js
const projects = [
  {
    slug: 'pray-for-plagues',
    title: 'Pray For Plagues',
    tagline: 'Action RPG Combat Prototype (UE5)',
    summary:
      'A Souls-borne inspired dungeon exploration prototype featuring animation-driven melee combat, reactive AI, and a modular ability system built in C++.',
    cover: 'projectCover',
    tags: ['Unreal Engine 5', 'C++', 'Blueprints', 'GAS', 'Solo project'],
    href: '/projects/pray-for-plagues',
    featured: true,
  },
]

export default projects
```

- [ ] **Step 6: Write the six system modules**

One file per system, each exporting the `System` shape. Source mapping:

| File | Source | Sections to preserve |
|---|---|---|
| `combat.js` | `notion-combat.json` | Overview · Design Goals · Animation Layers, Move-sets & Attack Chains · Hitbox & Hurtbox System · Parry System · Weapon Framework · Lock On Target System · Foot IK System |
| `ai.js` | `notion-ai.json` | all headings present in the source |
| `interaction.js` | `notion-interaction.json` | all headings present in the source |
| `inventory.js` | `notion-inventory.json` | all headings present in the source |
| `audio.js` | `notion-audio.json` | all headings present in the source |
| `levelDesign.js` | `notion-level-design.json` | all headings present in the source |

Example of the required shape (real combat copy, abbreviated here — write the full text in the file):

```js
const combat = {
  id: 'combat',
  title: 'Combat System',
  summary:
    'An animation-driven melee framework built for weighty attacks, precise timing windows, and readable feedback — modular and data-driven so new weapons and movesets need no core logic changes.',
  sections: [
    {
      heading: 'Overview',
      paragraphs: [
        'The combat system is built around a Souls-borne inspired, animation-driven framework designed to deliver weighty attacks, precise timing windows, and clear player feedback. Each weapon features its own unique animation layer, complete with distinct light and heavy attack chains, special attacks with cooldowns, and combo-based damage multipliers that reward commitment and mastery.',
        'Combat interactions are fully systemic: hitboxes are synchronized with animation events, parryable attacks follow strict telegraph rules, and both player and enemies use a shared directional hit reaction system that reinforces impact and readability.',
      ],
      media: [],
    },
    {
      heading: 'Hitbox & Hurtbox System',
      paragraphs: [ /* ... transcribed ... */ ],
      media: [
        { key: 'combat-damage-hostile', alt: 'Damage applied only to a hostile enemy', caption: 'Damage application on hostile enemy' },
      ],
    },
  ],
}

export default combat
```

Media `key` values must match the slugs Task 2 derives from the original filenames (e.g. `OnlyHostileDamageApplication-...gif` → `combat-damage-hostile`). Coordinate by using the key naming convention `<systemId>-<short-descriptor>`; Task 2 reads these keys from the content modules to name its outputs.

- [ ] **Step 7: Write `prayForPlagues/index.js`**

```js
import combat from './combat'
import ai from './ai'
import interaction from './interaction'
import inventory from './inventory'
import audio from './audio'
import levelDesign from './levelDesign'

const prayForPlagues = {
  slug: 'pray-for-plagues',
  title: 'Pray For Plagues',
  tagline: 'Action RPG Souls-Borne Prototype — Unreal Engine 5',
  hero: { src: 'caseStudyHero', alt: 'Pray For Plagues gameplay screenshot' },
  stats: [
    { label: 'Engine', value: 'Unreal Engine 5' },
    { label: 'Languages', value: 'C++ / Blueprints' },
    { label: 'Role', value: 'Solo developer' },
    { label: 'Foundation', value: 'GAS + attribute system' },
    { label: 'Tools', value: 'Blender' },
    { label: 'Started', value: '2024' },
  ],
  summary: [ /* transcribed Project Summary from notion-overview.json */ ],
  contributions: [
    { area: 'Gameplay Engineering', items: ['Interaction System', 'Inventory System', 'Dynamic Footstep System', 'Object Destruction System'] },
    { area: 'AI Engineering', items: ['AI Attack Manager', 'Telegraphing System', 'AOE & regular damage', 'Boss behavior logic', 'AI hit reactions', 'Close- and long-range enemies', 'Built on EQS & Behavior Trees'] },
    { area: 'Level Design', items: ['Three-level dungeon', 'Encounter design', 'Environmental interaction integration'] },
    { area: 'Combat System Engineering', items: ['Weapon framework', 'Attack chains & special attacks', 'Damage multipliers', 'Parry system', 'Hit reaction system', 'Dodge system', 'Projectile spawn'] },
    { area: 'Audio & Feedback Systems', items: ['Dynamic boss soundtrack manager'] },
    { area: 'UI & Player Feedback', items: ['Player overlay UI', 'Standard enemy health bar system', 'Visibility rules', 'Unique boss UI with title display'] },
  ],
  systems: [combat, ai, interaction, inventory, audio, levelDesign],
  github: 'https://github.com/Maxer1189/Souls-like_GameProject',
}

export default prayForPlagues
```

- [ ] **Step 8: Verify**

```bash
node -e "import('./src/content/prayForPlagues/index.js').then(m => { const p = m.default; console.log('systems:', p.systems.length); p.systems.forEach(s => console.log(s.id, '| sections:', s.sections.length, '| media:', s.sections.flatMap(x => x.media).length)) })" --input-type=module
```

If that fails on ESM resolution, verify by importing the modules from a scratch React page instead. Then:

```bash
npm run check:theme
npm run build
```

**Acceptance criteria:**
- Six systems, each with ≥ 2 sections and non-empty `paragraphs`
- Every media entry has a `key` and a non-empty `alt`
- No `TODO`, `TBD`, or `Lorem` anywhere in `src/content/`
- Only the two sanctioned `// PLACEHOLDER:` markers exist, both in `siteConfig.js`
- Spot-check five paragraphs against `content-raw/` — no invented technical claims
- `npm run check:theme` clean, `npm run build` exits 0

- [ ] **Step 9: Commit**

```bash
git add src/content
git commit -m "feat(content): transcribe Notion case study and profile into content modules"
```

---

## Task 2: Media pipeline

**Files:**
- Create: `scripts/fetch-media.mjs`, `scripts/optimize-media.mjs`, `src/content/mediaManifest.js`
- Create: `public/media/**`, `media-src/**` (gitignored)
- Modify: `package.json` (add `media:fetch`, `media:optimize` scripts)
- Read-only: `content-raw/*.json`, `src/content/**` (for media keys)

**Interfaces:**
- Consumes: media keys declared in Task 1's content modules.
- Produces: `import mediaManifest from '@/content/mediaManifest'` → `Record<string, { type: 'image'|'video', src: string, poster?: string, webm?: string, width: number, height: number }>`. `src`/`poster`/`webm` are absolute public paths (`/media/...`). Task 3's `MediaFrame` and Tasks 4–8 resolve every asset through this map.

- [ ] **Step 1: Write `scripts/fetch-media.mjs`**

It must: read every `content-raw/*.json`, collect the `media[]` URLs (they are prefixed with `IMG: ` / `VIDEO: ` — strip the prefix), skip Notion UI chrome (`/icons/`, `notion-static.com` emoji, `aif.notion.so`, any URL with `width=40`), download each to `media-src/` preserving a slugged filename, and write `media-src/download-manifest.json` mapping original URL → local file. Also download the LinkedIn portrait URL supplied by the user and the two reference screenshots used as hero images. A non-200 response is a hard error — print the URL and exit 1.

Use `fetch` + `node:fs/promises`; no extra dependencies.

```bash
node scripts/fetch-media.mjs
```

- [ ] **Step 2: Verify the download**

```bash
node -e "const m=require('./media-src/download-manifest.json'); console.log(Object.keys(m).length,'files')"
```

Expected: ≥ 25 files (combat alone contributes ~15). If any file is 0 bytes, the fetch failed silently — fix before continuing.

- [ ] **Step 3: Write `scripts/optimize-media.mjs`**

Rules:
- GIF → `public/media/<key>.mp4` (H.264, `-movflags +faststart`, `-pix_fmt yuv420p`, even dimensions) **and** `public/media/<key>.webm` (VP9), plus `public/media/<key>.jpg` poster from frame 0 (max width 1280).
- PNG/JPEG → `public/media/<key>.webp`, max width 1600, quality 82; keep a `.jpg` fallback only for `og-cover`.
- Record real pixel dimensions per asset (via `ffprobe`) so `MediaFrame` can reserve aspect ratio and avoid layout shift.
- Emit `src/content/mediaManifest.js` as a plain default-exported object.
- If `ffmpeg` is not on PATH, copy sources through unchanged, still emit the manifest, and print a loud `WARNING: ffmpeg not found — media not optimized`. (ffmpeg 8.1.2 is present on this machine, so this branch should not trigger.)

Example ffmpeg invocations to use:

```bash
ffmpeg -y -i in.gif -movflags +faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -c:v libx264 -crf 23 out.mp4
ffmpeg -y -i in.gif -c:v libvpx-vp9 -crf 34 -b:v 0 out.webm
ffmpeg -y -i in.gif -vframes 1 -vf "scale='min(1280,iw)':-2" out.jpg
```

- [ ] **Step 4: Run it and check the savings**

```bash
node scripts/optimize-media.mjs
node -e "const fs=require('fs');let s=0;for(const f of fs.readdirSync('public/media'))s+=fs.statSync('public/media/'+f).size;console.log('public/media total MB:', (s/1048576).toFixed(1))"
```

Expected: total under **25 MB**, with every converted MP4 materially smaller than its source GIF. If a clip is still over 3 MB, raise its CRF and re-encode.

- [ ] **Step 5: Add npm scripts**

```json
{
  "media:fetch": "node scripts/fetch-media.mjs",
  "media:optimize": "node scripts/optimize-media.mjs",
  "media": "npm run media:fetch && npm run media:optimize"
}
```

- [ ] **Step 6: Verify key coverage**

Every media `key` referenced in `src/content/**` must exist in `mediaManifest`. Write this check inline at the bottom of `optimize-media.mjs` so it runs every time: grep the content modules for `key: '...'`, diff against the manifest keys, and exit 1 on any missing key, listing them.

**Acceptance criteria:**
- `public/media/` exists, total < 25 MB
- Every content media key resolves in `mediaManifest`
- Every clip has `.mp4`, `.webm`, and a poster `.jpg`
- Every entry carries real `width`/`height`
- `media-src/` is gitignored and **not** committed
- `npm run build` exits 0

- [ ] **Step 7: Commit**

```bash
git add scripts public/media src/content/mediaManifest.js package.json
git commit -m "feat(media): download and optimize Notion media into self-hosted assets"
```

---

## Task 3: Layout shell and shared primitives

**Files:**
- Create: `src/components/layout/NavBar.jsx`, `Footer.jsx`, `PageLayout.jsx`
- Create: `src/components/common/Section.jsx`, `SectionHeading.jsx`, `AnimatedReveal.jsx`, `MediaFrame.jsx`
- Create: `src/pages/Home.jsx`, `src/pages/PrayForPlagues.jsx`, `src/pages/NotFound.jsx` (skeletons)
- Modify: `src/App.jsx` (replace the Task 0 placeholder)

**Interfaces:**
- Consumes: `theme.custom.*` (Task 0), `siteConfig` and `prayForPlagues` (Task 1) — imported by **pages only**, `mediaManifest` (Task 2) — imported by `MediaFrame` only.
- Produces:
  - `<PageLayout navLinks={[{id,label,href}]} siteConfig children />` — `siteConfig` supplies the name in the navbar and the links in the footer
  - `<Section id title eyebrow dense children />` — vertical rhythm + optional heading
  - `<SectionHeading eyebrow title align="left"|"center" />`
  - `<AnimatedReveal delay={0} children />` — the project's only scroll-reveal
  - `<MediaFrame mediaKey alt caption ratio priority={false} onClick />` — resolves through `mediaManifest`, renders `<img>` or looping `<video>`, lazy by default

- [ ] **Step 1: Write `AnimatedReveal.jsx`**

```jsx
import { motion, useReducedMotion } from 'framer-motion'
import { useTheme } from '@mui/material/styles'

export default function AnimatedReveal({ children, delay = 0, as = 'div' }) {
  const theme = useTheme()
  const reduce = useReducedMotion()
  const MotionTag = motion[as] || motion.div

  if (reduce) return <MotionTag initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>{children}</MotionTag>

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      custom={delay}
      variants={theme.custom.reveal}
    >
      {children}
    </MotionTag>
  )
}
```

- [ ] **Step 2: Write `Section.jsx` and `SectionHeading.jsx`**

`Section` renders `<Box component="section" id={id}>` with `py: theme.custom.section.paddingBlock`, wraps children in `<Container>`, and renders a `SectionHeading` when `title` is given. `SectionHeading` renders an uppercase `variant="h6"` eyebrow in `primary.main` above a `variant="h2"` title, with a short gold rule beneath. Both must add `scrollMarginTop` equal to the navbar height so anchor links do not hide content under the bar.

- [ ] **Step 3: Write `MediaFrame.jsx`**

Behavior:
- Looks the key up in `mediaManifest`; if missing, renders a themed "missing media" box and logs a `console.warn` (never crashes).
- `type: 'image'` → `<Box component="img" loading={priority ? 'eager' : 'lazy'} decoding="async" width/height from manifest sx={{width:'100%',height:'auto',borderRadius:1}} />`
- `type: 'video'` → `<video muted loop playsInline preload="none" poster={poster}>` with `<source src={webm} type="video/webm">` then `<source src={src} type="video/mp4">`, plus fallback text. Autoplay only when in view **and** `useReducedMotion()` is false — use an `IntersectionObserver` to call `play()`/`pause()`.
- Always reserves aspect ratio from the manifest dimensions (no layout shift).
- Renders `caption` as a `<Typography variant="caption">` below.
- Calls `onClick` when provided and sets `role="button"`, `tabIndex={0}`, and Enter/Space handlers.

- [ ] **Step 4: Write `NavBar.jsx`**

`<AppBar position="fixed" elevation={0}>` that is transparent at scroll top and switches to `background.paper` with a `divider` bottom border and a subtle backdrop blur past 64 px (`useScrollTrigger`). Left: the name as a `Link` to `/`. Right (desktop `md+`): anchor links plus a contained "Get in touch" button. Mobile: hamburger opening a `<Drawer>` — must close on link click, trap focus, and close on Escape. Anchor links use `href="#id"` on the home route and navigate to `/#id` from the case-study route.

- [ ] **Step 5: Write `Footer.jsx` and `PageLayout.jsx`**

Footer: name, current year, LinkedIn/GitHub/email icon links, and a "Built with React & MUI" line. `PageLayout`: `<NavBar />`, `<Box component="main">` with top padding equal to navbar height, `<Footer />`, plus scroll restoration on route change and a skip-to-content link as the first focusable element.

- [ ] **Step 6: Write the page skeletons and `App.jsx`**

`src/App.jsx`:

```jsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import PageLayout from '@/components/layout/PageLayout'
import Home from '@/pages/Home'
import NotFound from '@/pages/NotFound'
import siteConfig from '@/content/siteConfig'

const PrayForPlagues = lazy(() => import('@/pages/PrayForPlagues'))

const NAV_LINKS = [
  { id: 'work', label: 'Work', href: '/#work' },
  { id: 'about', label: 'About', href: '/#about' },
  { id: 'skills', label: 'Skills', href: '/#skills' },
  { id: 'availability', label: 'Availability', href: '/#availability' },
  { id: 'contact', label: 'Contact', href: '/#contact' },
]

const Fallback = () => (
  <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '60vh' }}>
    <CircularProgress color="primary" />
  </Box>
)

export default function App() {
  return (
    <PageLayout navLinks={NAV_LINKS} siteConfig={siteConfig}>
      <Suspense fallback={<Fallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects/pray-for-plagues" element={<PrayForPlagues />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </PageLayout>
  )
}
```

Page skeletons render a single `<Section>` each with a temporary heading so routing is provable before Tasks 4–8 fill them.

`src/pages/Home.jsx` must ship with five numbered mount slots already in place, so Tasks 4–7 can run in parallel by replacing only their own line:

```jsx
export default function Home() {
  return (
    <>
      {/* MOUNT 1: HeroSection — Task 4 */}
      {/* MOUNT 2: ProjectsSection — Task 6 */}
      {/* MOUNT 3: AboutSection — Task 5 */}
      {/* MOUNT 4: SkillsSection — Task 5 */}
      {/* MOUNT 5: AvailabilitySection + ContactSection — Task 7 */}
    </>
  )
}
```

Each task replaces its own comment line and adds only its own imports. No task reorders or deletes another's slot.

- [ ] **Step 7: Run the standard verification cycle**

Check `/`, `/projects/pray-for-plagues`, and `/nope` (404). Confirm the navbar changes state on scroll, the mobile drawer opens and closes with keyboard only, and the case-study route pulls a separate JS chunk (Network tab).

**Acceptance criteria:**
- All three routes render inside the shell
- NavBar transparent at top, solid after 64 px
- Drawer fully keyboard-operable, Escape closes it
- Skip link is the first Tab stop and works
- `MediaFrame` renders a known image key and a known video key correctly; an unknown key degrades gracefully
- Case-study chunk is separate in the Network tab
- `npm run check:theme` clean, zero console errors at all three breakpoints

- [ ] **Step 8: Commit**

```bash
git add src/components src/pages src/App.jsx
git commit -m "feat(layout): add shell, routing, and shared UI primitives"
```

---

## Task 4: Hero section

**Files:**
- Create: `src/components/home/HeroSection.jsx`
- Modify: `src/pages/Home.jsx` (mount the hero only)

**Interfaces:**
- Consumes: `AnimatedReveal`, `MediaFrame` (Task 3); `siteConfig` via `Home.jsx` (Task 1); `mediaManifest` key for the hero background (Task 2).
- Produces: `<HeroSection name role tagline ctas={[{label,href,variant}]} backgroundKey />`.

- [ ] **Step 1: Build the component**

Full-viewport-height-minus-navbar section (`minHeight: { xs: '88vh', md: '92vh' }`). Background: the hero screenshot as a covering image with a dark gradient scrim (`linear-gradient` built from `theme.palette.background.default` with alpha via `alpha()` from `@mui/material/styles` — not a raw rgba literal, per Global Constraint 1). Content left-aligned on `md+`, centered on `xs`:

- eyebrow: `role`, `variant="h6"`, `primary.main`
- `<Typography variant="h1" component="h1">{name}</Typography>` — the page's only `h1`
- `tagline` as `variant="subtitle1"` capped at `theme.custom.maxTextWidth`
- Two buttons: contained primary "View the case study" → `/projects/pray-for-plagues`; outlined "Get in touch" → `#contact`
- A subtle scroll-cue chevron at the bottom, hidden when `prefers-reduced-motion`

Entrance: staggered `AnimatedReveal` with delays 0, 0.08, 0.16, 0.24.

- [ ] **Step 2: Run the standard verification cycle on `/`**

**Acceptance criteria:**
- Name, role, tagline, and both CTAs visible without scrolling at all three breakpoints
- Exactly one `<h1>` on the page
- Body text over the image passes 4.5:1 contrast
- Background image loads from `/media/`, `loading="eager"`
- No horizontal scroll at 390 px
- `npm run check:theme` clean, zero console errors

- [ ] **Step 3: Commit**

```bash
git add src/components/home/HeroSection.jsx src/pages/Home.jsx
git commit -m "feat(home): add hero section"
```

---

## Task 5: About and Skills sections

**Files:**
- Create: `src/components/home/AboutSection.jsx`, `src/components/home/SkillsSection.jsx`
- Modify: `src/pages/Home.jsx` (mount both)

**Interfaces:**
- Consumes: `Section`, `SectionHeading`, `AnimatedReveal`, `MediaFrame` (Task 3); `about`, `skills` (Task 1).
- Produces: `<AboutSection heading paragraphs portraitKey />`, `<SkillsSection skills />`.

- [ ] **Step 1: Build `AboutSection`**

Two-column `Grid` on `md+` (7/5 split), stacked on `xs`. Left: paragraphs at `body1`, capped at `theme.custom.maxTextWidth`. Right: portrait via `MediaFrame`, rounded, with a thin `divider`-colored border and a soft gold glow on hover (transform ≤ 4 px). Section `id="about"`.

- [ ] **Step 2: Build `SkillsSection`**

Responsive `Grid` of cards (1 col `xs`, 2 `sm`, 3 `md`). Each card: `Paper` with the skill name as `h5`, the category as an uppercase `h6` eyebrow in `primary.main`, and the blurb as `body2`. Hover: border color to `primary.main`, `translateY(-4px)`, using `theme.transitions.create` with `theme.custom.motion.fast`. Each card wrapped in `AnimatedReveal` with `delay={index * 0.06}`. Section `id="skills"`.

- [ ] **Step 3: Run the standard verification cycle on `/`**

**Acceptance criteria:**
- About prose matches `content-raw/notion-home.json` (spot-check three sentences)
- Portrait loads locally from `/media/` — no `licdn.com` request in the Network tab
- Five skill cards render; grid reflows 1/2/3 columns at 390/768/1440
- Reveal animations fire once, not on every scroll
- With `prefers-reduced-motion` forced on, content appears without transforms
- `npm run check:theme` clean, zero console errors

- [ ] **Step 4: Commit**

```bash
git add src/components/home src/pages/Home.jsx
git commit -m "feat(home): add about and skills sections"
```

---

## Task 6: Projects section and ProjectCard

**Files:**
- Create: `src/components/home/ProjectsSection.jsx`, `src/components/home/ProjectCard.jsx`
- Modify: `src/pages/Home.jsx` (mount)

**Interfaces:**
- Consumes: `Section`, `SectionHeading`, `AnimatedReveal`, `MediaFrame` (Task 3); `projects` (Task 1); `react-router-dom`'s `Link`.
- Produces: `<ProjectsSection projects />`, `<ProjectCard project featured />`.

- [ ] **Step 1: Build `ProjectCard`**

Two layouts driven by `featured`:
- `featured` → horizontal on `md+`: cover image left (60%), text right (40%); stacked on smaller.
- default → vertical card.

Contents: cover via `MediaFrame`, title `h3`, tagline `h6` eyebrow, summary `body2`, tag `Chip`s (`variant="outlined"`, small), and a "Read the case study" `Button` using `component={RouterLink} to={project.href}`. The whole card is one link target — do not nest an anchor inside an anchor; make the card a `CardActionArea` wrapping the router link, or put the link on the title and card surface with `aria-labelledby`. Hover lifts by 4 px and brightens the border.

- [ ] **Step 2: Build `ProjectsSection`**

`Section id="work"` with eyebrow "Featured project" and title "Selected work". Renders `projects.filter(p => p.featured)` first as featured cards, then the rest in a two-column grid. With a single project the layout must still look intentional — full-width featured card, no empty grid cells.

- [ ] **Step 3: Run the standard verification cycle on `/`**

**Acceptance criteria:**
- The Pray For Plagues card renders with cover, tagline, summary, and all five tags
- Clicking anywhere on the card navigates to `/projects/pray-for-plagues`
- No nested-anchor DOM warning in the console
- Keyboard: the card is reachable by Tab and activates with Enter
- Layout is intentional with exactly one project at all three breakpoints
- `npm run check:theme` clean, zero console errors

- [ ] **Step 4: Commit**

```bash
git add src/components/home src/pages/Home.jsx
git commit -m "feat(home): add featured project section"
```

---

## Task 7: Availability and Contact sections

**Files:**
- Create: `src/components/home/AvailabilitySection.jsx`, `src/components/home/ContactSection.jsx`
- Modify: `src/pages/Home.jsx` (mount both; Home is now complete)

**Interfaces:**
- Consumes: `Section`, `SectionHeading`, `AnimatedReveal` (Task 3); `siteConfig.availability`, `siteConfig.email`, `siteConfig.links`, `siteConfig.cv`, `siteConfig.location` (Task 1).
- Produces: `<AvailabilitySection modes location note />`, `<ContactSection email links cv />`.

This is the section the brief singles out as "clearly visible … not buried". It must read as its own visual event, not another card grid.

- [ ] **Step 1: Build `AvailabilitySection`**

`Section id="availability"` rendered as a full-bleed band: `background.paper`, a 2 px `primary.main` top and bottom border, and generous padding. Inside:

- eyebrow "Availability"
- `h2`: "Open to hybrid, remote, and relocation"
- three mode `Chip`s or pill boxes — **Hybrid · Remote · Relocation** — sized large, with icons (`HomeWork`, `Public`, `FlightTakeoff` from `@mui/icons-material`)
- `subtitle1`: the note — "Based in Israel and open to opportunities abroad and relocation."
- a primary CTA button to `#contact`

Full-bleed technique: `Box` with `width: '100vw'`, `marginLeft: 'calc(50% - 50vw)'` so it escapes the container without causing horizontal scroll — verify at 390 px that no scrollbar appears.

- [ ] **Step 2: Build `ContactSection`**

`Section id="contact"`, centered. Heading "Let's build something", a one-line invitation, then a row of actions:
- contained primary button → `mailto:` the email, with the address also shown as readable text (recruiters copy it)
- outlined buttons → LinkedIn, GitHub (both `target="_blank" rel="noopener noreferrer"`)
- CV download button rendered **only** when `cv.enabled` is true
- YouTube showreel link rendered **only** when `links.youtube` is a non-empty string

- [ ] **Step 3: Run the standard verification cycle on `/`**

**Acceptance criteria:**
- The availability band is visually distinct from every other section and legible at a glance
- All three modes — Hybrid, Remote, Relocation — are visible as discrete elements
- No horizontal scroll at 390 px despite the full-bleed band
- The email is both clickable and selectable as text
- With `cv.enabled: false` and empty `youtube`, neither control renders anywhere in the DOM
- Flipping `cv.enabled` to true renders the download button (revert after testing)
- `npm run check:theme` clean, zero console errors

- [ ] **Step 4: Commit**

```bash
git add src/components/home src/pages/Home.jsx
git commit -m "feat(home): add availability band and contact section"
```

---

## Task 8: Pray For Plagues case-study page

**Files:**
- Create: `src/components/project/CaseStudyHero.jsx`, `AtAGlance.jsx`, `SystemNav.jsx`, `SystemBreakdown.jsx`, `MediaGallery.jsx`, `Lightbox.jsx`
- Modify: `src/pages/PrayForPlagues.jsx`

**Interfaces:**
- Consumes: `Section`, `SectionHeading`, `AnimatedReveal`, `MediaFrame` (Task 3); `prayForPlagues` (Task 1); `mediaManifest` (Task 2).
- Produces: `<CaseStudyHero title tagline heroKey github />`, `<AtAGlance stats />`, `<SystemNav systems activeId />`, `<SystemBreakdown system onOpenMedia />`, `<MediaGallery items onOpen />`, `<Lightbox items index open onClose onNavigate />`.

- [ ] **Step 1: Build `CaseStudyHero` and `AtAGlance`**

Hero: full-bleed screenshot with scrim, `h1` = project title (the only `h1` on this route), tagline as `subtitle1`, a "View on GitHub" outlined button, and a back link to `/#work`.

`AtAGlance`: a horizontal strip of the six stats — label as uppercase `h6` in `text.secondary`, value as `h5`. Wraps to two rows on `sm`, two columns on `xs`. Separated by `divider` borders.

- [ ] **Step 2: Build `SystemNav`**

Sticky vertical nav, `position: sticky; top: navbarHeight + 24px`, visible only at `lg+` (`display: { xs: 'none', lg: 'block' }`). Lists the six system titles; the entry matching `activeId` gets `primary.main` text and a gold left border. Active tracking via a single `IntersectionObserver` over the system section elements — not a scroll listener. Clicking scrolls to the section (native anchor + `scroll-margin-top`).

- [ ] **Step 3: Build `MediaGallery` and `Lightbox`**

`MediaGallery`: responsive grid (1 col `xs`, 2 `md`) of `MediaFrame`s, each calling `onOpen(index)`.

`Lightbox`: MUI `Dialog` (`fullScreen` on `xs`, `maxWidth="lg"` otherwise) with a near-opaque backdrop. Requirements:
- Escape closes; Left/Right arrows navigate; Home/End jump to first/last
- Focus is trapped inside while open and returned to the triggering element on close (MUI `Dialog` handles trap/restore — do not re-implement it)
- Caption and a "3 of 12" counter shown below the media
- Close button has `aria-label="Close"`
- Video in the lightbox gets `controls` and is allowed to play with sound off
- Clicking the backdrop closes

- [ ] **Step 4: Build `SystemBreakdown`**

For one system: `Section id={system.id}` with eyebrow "System" and `system.title` as the heading, `system.summary` as an intro `subtitle1`, then each `section`: an `h4` heading, its paragraphs at `body1` capped at `theme.custom.maxTextWidth`, and its `MediaGallery` when `media.length > 0`. Alternate the section background subtly (`background.default` / `background.paper`) so six long systems remain navigable.

- [ ] **Step 5: Assemble `PrayForPlagues.jsx`**

Order: `CaseStudyHero` → `AtAGlance` → summary + "My Role & Contributions" (the six contribution areas as a responsive grid of lists) → a two-column layout with `SystemNav` on the left and the six `SystemBreakdown`s on the right → closing CTA (GitHub + "Get in touch" back to `/#contact`). Lightbox state (`{ items, index, open }`) lives in this page and is passed down.

- [ ] **Step 6: Run the standard verification cycle on `/projects/pray-for-plagues`**

Additionally: scroll the full page and confirm the sticky nav's active state tracks correctly; open the lightbox from three different galleries; navigate with arrows; close with Escape and confirm focus returns to the thumbnail.

**Acceptance criteria:**
- All six systems render with their full transcribed prose
- Every media item in the content modules appears on the page
- Sticky nav highlights the correct system while scrolling (desktop) and is hidden below `lg`
- Lightbox: Escape, arrows, backdrop click, focus trap, focus restore all work
- Exactly one `<h1>`
- Clips do not autoplay under `prefers-reduced-motion`
- No horizontal scroll at 390 px
- `npm run check:theme` clean, zero console errors

- [ ] **Step 7: Commit**

```bash
git add src/components/project src/pages/PrayForPlagues.jsx
git commit -m "feat(project): add Pray For Plagues case study page"
```

---

## Integration Gate A (after Task 8)

Run by an Opus medium-effort verifier before Task 9 starts. **This is a review gate, not a code task** — findings go back to the owning task's agent.

- [ ] `npm run build` exits 0
- [ ] Home renders all seven sections in order: hero, work, about, skills, availability, contact, footer
- [ ] Visual consistency across independently-built sections: one heading scale, one card treatment, one hover behavior, consistent section padding rhythm
- [ ] No overlapping or clipped elements at 390 / 768 / 1440
- [ ] Every nav anchor scrolls to the right section with the heading clear of the navbar
- [ ] Every internal link resolves; every external link opens in a new tab with `rel="noopener noreferrer"`
- [ ] The case-study route loads as a separate chunk
- [ ] Tab through both routes end to end — focus order is logical, focus is always visible
- [ ] Zero console errors on both routes

---

## Task 9: Polish pass

**Files:**
- Create: `src/components/common/Seo.jsx`, `public/favicon.svg`, `public/robots.txt`
- Modify: `index.html`, `src/pages/Home.jsx`, `src/pages/PrayForPlagues.jsx`, `src/pages/NotFound.jsx`, `vite.config.js` (if chunking needs tuning)

**Interfaces:**
- Consumes: `siteConfig.seo` (Task 1).
- Produces: `<Seo title description image path />` — sets `document.title` and upserts meta/OG/Twitter tags on mount via `useEffect` (no extra dependency needed for a two-route SPA).

- [ ] **Step 1: Base meta in `index.html`**

`lang="en"`, charset, viewport, `theme-color` `#0B0B0D`, title, description, canonical, OG (`type`, `title`, `description`, `image`, `url`), `twitter:card=summary_large_image`, favicon link. Because the domain is not final yet, put the canonical/OG URL in one clearly-commented constant so it is a one-line change later.

- [ ] **Step 2: Write `Seo.jsx` and mount it per route**

Home uses `siteConfig.seo`. The case study overrides with its own title/description ("Pray For Plagues — Souls-borne combat prototype in Unreal Engine 5 …") and the case-study hero as the OG image. `NotFound` sets a `noindex` robots meta.

- [ ] **Step 3: Motion consistency pass**

Read every component and confirm: all scroll reveals go through `AnimatedReveal`, no animation exceeds `theme.custom.motion.slow`, no element translates more than 24 px, no parallax, no scroll-jacking, and every hover transition uses `theme.transitions.create`. Fix deviations in place.

- [ ] **Step 4: Loading and bundle pass**

- Confirm only the hero image is `priority`/eager; everything else lazy
- Confirm every `<video>` is `preload="none"` with a poster
- Run `npm run build` and inspect the output sizes:

```bash
npm run build
node -e "const fs=require('fs');const d='dist/assets';const rows=fs.readdirSync(d).filter(f=>f.endsWith('.js')).map(f=>[f,(fs.statSync(d+'/'+f).size/1024).toFixed(1)+' KB']);console.table(rows)"
```

If the initial (non-lazy) JS exceeds the 250 KB gzipped budget, tune `manualChunks` or replace a heavy import (most likely cause: a barrel import from `@mui/icons-material` — import icons individually, `import HomeWork from '@mui/icons-material/HomeWork'`).

- [ ] **Step 5: 404 and robots**

`NotFound` gets the themed treatment: `h1` "Page not found", a line of copy, and a primary button home. `robots.txt` allows everything and points at the (commented, to-be-filled) sitemap URL.

- [ ] **Step 6: Cleanup**

Delete unused files, commented-out blocks, `console.log`s, and any leftover Vite template asset. Confirm `content-raw/` and `media-src/` are not imported by shipped code.

- [ ] **Step 7: Run the standard verification cycle on both routes**

**Acceptance criteria:**
- Tab title and meta change between routes (check with devtools Elements)
- OG image resolves to a real local file
- Favicon renders in the tab
- Initial JS ≤ 250 KB gzipped; case-study chunk separate
- No `console.log` in `src/`
- 404 route themed and `noindex`
- `npm run check:theme` clean, zero console errors

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(polish): SEO metadata, motion consistency, bundle and loading pass"
```

---

## Task 10: Production build and delivery artifacts

**Files:**
- Create: `README.md` (replace the current brief), `DEPLOY.md`, `nginx.conf.example`
- Modify: `package.json` (name, version, description, `private: true`)

**⚠️ Deployment boundary:** this task writes instructions and configuration only. It does **not** connect to, upload to, or modify the Hetzner server. The user deploys manually.

- [ ] **Step 1: Preserve the original brief**

Move the existing `README.md` (the original project brief) to `docs/original-brief.md` before overwriting, so the source requirements are not lost.

- [ ] **Step 2: Write `README.md`**

Sections: what the site is · stack · prerequisites (Node 20+, ffmpeg for the media scripts) · install · `npm run dev` · `npm run build` · `npm run preview` · `npm run media` (when to re-run it) · `npm run check:theme` · project structure table · **how to update content** (edit `src/content/*`, not components) · **the two placeholders** and exactly how to fill them (drop the PDF at `public/cv/max-masarski-cv.pdf` then set `cv.enabled: true`; paste the URL into `links.youtube`).

- [ ] **Step 3: Write `nginx.conf.example`**

```nginx
server {
    listen 80;
    server_name example.com www.example.com;   # replace with the real domain
    root /var/www/portfolio/dist;
    index index.html;

    # SPA fallback — required, or /projects/pray-for-plagues 404s on refresh
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Hashed assets: cache hard
    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Media and fonts: cache long, they are content-addressed by name
    location ~* \.(woff2|mp4|webm|webp|jpg|png|svg)$ {
        expires 30d;
        add_header Cache-Control "public";
    }

    # index.html must never be cached, or deploys appear not to land
    location = /index.html {
        add_header Cache-Control "no-cache, must-revalidate";
    }

    gzip on;
    gzip_types text/css application/javascript image/svg+xml application/json;
    gzip_min_length 1024;
}
```

Include a commented block noting that HTTPS should be added with certbot, and that the `try_files` line is what makes client-side routing survive a refresh.

- [ ] **Step 4: Write `DEPLOY.md`**

Numbered manual steps: `npm ci` → `npm run build` → copy `dist/` to `/var/www/portfolio/dist` on the Hetzner box (WinSCP or `scp`) → place the nginx config → `nginx -t` → reload → point the domain's A record at the server → run certbot. Add a rollback note (keep the previous `dist` as `dist.bak`) and a checklist to run after going live: both routes load, refresh on the case-study URL does not 404, media plays, mailto opens.

- [ ] **Step 5: Final production verification**

```bash
rm -rf dist
npm run build
npm run preview
```

Load the preview URL and walk both routes end to end at 390 / 768 / 1440.

**Acceptance criteria:**
- Clean `npm run build` from a removed `dist/`
- `npm run preview` serves both routes with zero console errors
- **No network request to any external host** (Network tab, both routes) — no notion.site, no licdn.com, no fonts.googleapis.com
- Initial JS ≤ 250 KB gzipped
- All media plays; posters show before load
- README documents both placeholders accurately
- `nginx.conf.example` contains the SPA `try_files` fallback

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "docs: add README, deploy guide, and nginx example config"
```

---

## Integration Gate B (after Task 10)

Final Opus verification of the production build. Nothing ships until every line passes.

- [ ] `npm ci && npm run build` clean from scratch
- [ ] `npm run preview`: both routes, zero console errors, zero 404s in the Network tab
- [ ] Initial JS ≤ 250 KB gzipped; case-study chunk loads only on its route
- [ ] `public/media/` total < 25 MB
- [ ] Zero external-host requests
- [ ] Responsive and unbroken at 390 / 768 / 1440
- [ ] Availability section (hybrid · remote · relocation) is unmissable on the home page
- [ ] All six system breakdowns present with their real prose
- [ ] `prefers-reduced-motion` honoured on both routes
- [ ] Keyboard-only pass over both routes: nav, drawer, cards, lightbox
- [ ] One `<h1>` per route; alt text on every image and video
- [ ] Only the two sanctioned placeholders remain; both are invisible while unfilled
- [ ] No dev artifacts, dead files, or `console.log`s in `src/`
- [ ] `npm run check:theme` clean

**On pass:** report to the user with the build output path, the bundle sizes, and the two open items (CV PDF, showreel URL). Do not deploy.

---

## Agent Dispatch Reference

| Task | Builder | Verifier | May run in parallel with |
|---|---|---|---|
| 0 | low-effort | Opus medium | — |
| 1 | low-effort | Opus medium | 2 |
| 2 | low-effort | Opus medium | 1 |
| 3 | low-effort | Opus medium | — |
| 4 | low-effort | Opus medium | 5, 6, 7 |
| 5 | low-effort | Opus medium | 4, 6, 7 |
| 6 | low-effort | Opus medium | 4, 5, 7 |
| 7 | low-effort | Opus medium | 4, 5, 6 |
| 8 | low-effort | Opus medium | 4–7 |
| Gate A | — | Opus medium | — |
| 9 | low-effort | Opus medium | — |
| 10 | low-effort | Opus medium | — |
| Gate B | — | Opus medium | — |

**Parallel-safety note:** Tasks 4–7 all modify `src/pages/Home.jsx`. To run them concurrently, either (a) have Task 3 leave numbered mount points in `Home.jsx` and let each agent replace only its own placeholder line, or (b) run 4–7 sequentially against `Home.jsx` while their component files are written in parallel. Option (a) is preferred; Task 3 must therefore emit `Home.jsx` with the five commented mount slots already in place.

**Every builder agent's prompt must include:** the Global Constraints block, its task section verbatim, the component contracts from the spec's §7, and this instruction — *"You own only the files in your Files block. Read anything; write nothing outside it. Finish with `npm run check:theme` and `npm run build` both passing."*

**Every verifier agent's prompt must include:** the task's acceptance criteria, the standard verification cycle, and this instruction — *"Re-run every check yourself. Do not trust the builder's report. Return PASS, or FAIL with a defect list of `file:line — what's wrong — what's expected`."*

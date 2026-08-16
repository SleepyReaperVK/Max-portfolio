#!/usr/bin/env node
// Converts everything in media-src/ (downloaded by fetch-media.mjs) into
// self-hosted, size-budgeted assets under public/media/, and emits
// src/content/mediaManifest.js mapping every content media `key` to its
// output file(s) + real pixel dimensions.
//
// GIF        -> <key>.mp4 (H.264 only — see Ruling 5, no WebM) + <key>.jpg poster
// PNG/JPEG   -> <key>.webp (max width 1600, quality 82)
// og-cover   -> also gets a .jpg fallback, cropped to a social-card ratio
//
// Source resolution is keyed off a hash of the *original Notion URL*, not the
// bare downloaded filename — two distinct source images can share the same
// generic filename (e.g. two different "ScreenShot00001.png"), and which one
// gets a plain vs. hash-suffixed name in media-src/ depends on fetch order.
// Hashing the URL directly removes that fragility (see review round 1,
// Minor 7).
//
// Idempotent: a per-key cache (media-src/.optimize-cache.json) records the
// source file's content hash and the exact manifest entry produced. A
// second run with unchanged sources re-uses the cached entry and touches no
// output file, so re-running never dirties the git tree (review round 1,
// Important 4). Any encode that does run also passes bitexact flags as a
// second line of defense against non-deterministic encoder output.
//
// If ffmpeg/ffprobe are not on PATH, falls back to copying sources through
// unchanged (loud warning), so the manifest still gets written.

import { execFileSync } from 'node:child_process'
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  copyFileSync,
  readdirSync,
  statSync,
  existsSync,
} from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'

const ROOT = process.cwd()
const SRC_DIR = path.join(ROOT, 'media-src')
const OUT_DIR = path.join(ROOT, 'public', 'media')
const CONTENT_DIR = path.join(ROOT, 'src', 'content')
const MANIFEST_PATH = path.join(CONTENT_DIR, 'mediaManifest.js')
const DOWNLOAD_MANIFEST_PATH = path.join(SRC_DIR, 'download-manifest.json')
const CACHE_PATH = path.join(SRC_DIR, '.optimize-cache.json')

mkdirSync(OUT_DIR, { recursive: true })

function sha1(input) {
  return crypto.createHash('sha1').update(input).digest('hex')
}

function urlHash(url) {
  return sha1(url).slice(0, 12)
}

// ---------------------------------------------------------------------------
// Resolve every source URL's hash -> the actual file fetch-media.mjs wrote
// it to in media-src/, via download-manifest.json (url -> filename).
// ---------------------------------------------------------------------------
const downloadManifest = JSON.parse(readFileSync(DOWNLOAD_MANIFEST_PATH, 'utf8'))
const HASH_TO_FILE = {}
for (const [url, file] of Object.entries(downloadManifest)) {
  HASH_TO_FILE[urlHash(url)] = file
}

function resolveSourceFile(hash) {
  const file = HASH_TO_FILE[hash]
  if (!file) {
    throw new Error(`No downloaded file for url-hash ${hash} — re-run \`npm run media:fetch\`.`)
  }
  const full = path.join(SRC_DIR, file)
  if (!existsSync(full)) {
    throw new Error(`media-src/${file} is missing on disk (url-hash ${hash}) — re-run \`npm run media:fetch\`.`)
  }
  return full
}

// ---------------------------------------------------------------------------
// Content key -> source URL hash. Derived mechanically from content-raw/*.json
// media[] order matched 1:1 against each content module's media[] declaration
// order (every section's item count matches the raw file's non-excluded
// media count exactly). Two AI entries were reassigned after visual review —
// see task-2-report.md "Key mapping decisions" / round-1 fix notes.
// ---------------------------------------------------------------------------

const GIF_SOURCES_HASH = {
  // combat
  'combat-state-unequipped': '3e8b01366b60',
  'combat-state-light-weapon': 'db55c8c37694',
  'combat-state-heavy-weapon': '89da03a4688f',
  'combat-hit-reaction-unarmed': '425ab8aff056',
  'combat-damage-player': 'c4a2d835668c',
  'combat-damage-hostile': '05c07b39ca06',
  'combat-parry': '951aaa1debd4',
  'combat-lock-on-switch': '24b4bb372a91',
  'combat-lock-on-death-switch': '1b6164cdaffc',
  'combat-camera-reset': '194201f45df0',
  'combat-foot-ik': '4243d356b9cd',

  // ai
  'ai-idle-to-engage': 'c8646cba6481',
  'ai-strafe-attack': 'a3f3a8008693',
  'ai-patrol-loop': '6fb4213a2a11',
  'ai-player-spotted': '59b356f3b39a',
  'ai-vision-perception': 'd6c0edf30816',
  'ai-crowd-avoidance': '90b1a1b8d806',
  'ai-boss-phase-1': '43826968afe8',
  'ai-boss-phase-transition': '3df7fca26305',
  'ai-boss-phase-2': '1ec6c18fd0a2',
  // ai-attack-types dropped (Important 3 — Unreal Editor screen recording
  // with a visible "For testing in editor onlt!!" dev note, not an in-game
  // attack showcase).

  // interaction
  'interaction-pickup-item': 'eb272a02a752',
  'interaction-open-door': '4845f92ddce7',
  'interaction-open-locked-door': '671a1f44b06c',
  'interaction-inspect-note': '3a52bbd6ee70',
  'interaction-open-chest': 'e6194a429559',
  'interaction-pickup-heavy-weapon': '07671dddd1eb',

  // inventory
  'inventory-category-showcase': 'd54350301bea',
  'inventory-stack-overflow': 'bd953db44a84',
  'inventory-action-context-menu': '048272340422',
  'inventory-key-item-usage': '753ae67df9ab',
}

const IMAGE_SOURCES_HASH = {
  // combat
  'combat-players-stats': '732c211c468a',
  'combat-weapons-stats': 'e84993f4b63c',
  'combat-damage-calc-ge': 'adf603b84510',
  'combat-weapon-data': '4a51c76badea',

  // ai
  'ai-boss-data-asset': 'c3b92b2775ed',
  'ai-attack-manager-data': 'e72ac56724ad',
  'ai-attack-manager-config': 'e0eed89a6ab8',

  // audio (fixed mapping — round 1 review caught an off-by-one; see report)
  'audio-boss-soundtrack-manager': '0c14000b96a4', // BP_DarkKnight_MusicManager
  'audio-dynamic-footstep': 'bcf95021b608', // Footstep Data Asset (Stone surface tag)
  // audio-gameplay-video-preview dropped (decorative skull/headphones cover
  // art, not a gameplay frame). audio-combat-hit-feedback dropped (no
  // scraped image depicts hit VFX/SFX/camera shake).

  // inventory
  'inventory-data-table-summary': '1d08a10866b4',
  'inventory-data-table-detail': '1775f4301a25',

  // level design
  'level-design-prison-section': 'e0a0356df7ea',
  'level-design-first-floor-entrance': 'f7fd1bfd9907',
  'level-design-first-floor-main-hall': '46f3530fb79e',
  'level-design-first-floor-idol-of-death': 'f6f4a58990dc',
  'level-design-first-floor-tunnel': '834a839f79bd',
  'level-design-first-floor-second-entrance': 'd6c1ee7ecb56',
  'level-design-second-floor-entrance': '42fa05c34d71',
  'level-design-second-floor-balcony': 'd615f028d9c6',
  'level-design-third-floor-bridge': 'b94d7b89e5b3',
  'level-design-third-floor-prayer-room': '17c74b654cf5',
  'level-design-third-floor-chamber-entrance': '530234cc2d05',
  'level-design-dungeon-environment-1': '65c7a44a4465',
  'level-design-dungeon-environment-2': '19bb970dc7d6',
  'level-design-dungeon-environment-3': '021507f84204',

  // page-level (siteConfig.media / about.js)
  portrait: '41fe79b2ef6e',
  'hero-background': '5a153634a049',
  'project-cover': '5a153634a049', // same physical image as hero-background
  'case-study-hero': '5a153634a049', // same physical image as hero-background
  'og-cover': '5a153634a049', // derivative crop of the same source, own output
}

// Keys that are the exact same physical image as another key (same URL hash)
// get their manifest entry copied from the "canonical" key instead of being
// re-encoded into a second identical file (Minor 7).
const IMAGE_ALIASES = {
  'project-cover': 'hero-background',
  'case-study-hero': 'hero-background',
}

// The 5 page-level keys named directly by src/content/siteConfig.js `media`
// block and src/content/prayForPlagues/about.js `portrait` field. These are
// not declared as `key: '...'` inside a section's media[] array, so the
// generic grep in the coverage check below can't discover them — they are
// a fixed, explicitly-specified contract (see task-2-brief.md).
const PAGE_LEVEL_KEYS = ['hero-background', 'portrait', 'project-cover', 'case-study-hero', 'og-cover']

const VIDEO_SCALE_WIDTH = 720
const MP4_CRF_LADDER = [26, 30, 34, 38, 42]
const MAX_CLIP_BYTES = 3 * 1024 * 1024
const BITEXACT_INPUT_FLAGS = ['-fflags', '+bitexact']
const BITEXACT_OUTPUT_FLAGS = ['-flags:v', '+bitexact']

function hasBinary(bin) {
  try {
    execFileSync(bin, ['-version'], { stdio: 'ignore' })
    return true
  } catch {
    return false
  }
}

const FFMPEG_OK = hasBinary('ffmpeg') && hasBinary('ffprobe')

if (!FFMPEG_OK) {
  console.warn('WARNING: ffmpeg not found — media not optimized')
}

function ffprobeDims(file) {
  const out = execFileSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'csv=p=0',
    file,
  ]).toString().trim()
  const [width, height] = out.split(',').map((n) => parseInt(n, 10))
  return { width, height }
}

function fileSize(file) {
  return statSync(file).size
}

function encodeMp4(src, out, width, crf) {
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
    ...BITEXACT_INPUT_FLAGS,
    '-i', src,
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    '-vf', `scale=${width}:-2`,
    '-c:v', 'libx264',
    '-crf', String(crf),
    ...BITEXACT_OUTPUT_FLAGS,
    out,
  ])
}

function encodePoster(src, out) {
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
    ...BITEXACT_INPUT_FLAGS,
    '-i', src,
    '-vframes', '1',
    '-vf', "scale='min(1280,iw)':-2",
    out,
  ])
}

function encodeWebp(src, out, maxWidth, quality) {
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
    ...BITEXACT_INPUT_FLAGS,
    '-i', src,
    '-vf', `scale='min(${maxWidth},iw)':-2:flags=lanczos`,
    '-quality', String(quality),
    out,
  ])
}

function encodeJpeg(src, out, maxWidth, extraVf) {
  const vf = extraVf ? `${extraVf},scale='min(${maxWidth},iw)':-2` : `scale='min(${maxWidth},iw)':-2`
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
    ...BITEXACT_INPUT_FLAGS,
    '-i', src,
    '-vf', vf,
    '-q:v', '4',
    out,
  ])
}

// ---------------------------------------------------------------------------
// Idempotency cache: key -> { sourceHash, entry }. If the source file's
// content hash is unchanged and every file the cached entry points at still
// exists, we skip re-encoding entirely (no ffmpeg call, output bytes
// untouched) — this is what makes a second run a no-op on disk.
// ---------------------------------------------------------------------------
let cache = {}
if (existsSync(CACHE_PATH)) {
  try {
    cache = JSON.parse(readFileSync(CACHE_PATH, 'utf8'))
  } catch {
    cache = {}
  }
}

function outputsExist(entry) {
  for (const field of ['src', 'poster', 'jpg']) {
    if (!entry[field]) continue
    const rel = entry[field].replace(/^\/media\//, '')
    if (!existsSync(path.join(OUT_DIR, rel))) return false
  }
  return true
}

function cacheHit(key, sourceHash) {
  const c = cache[key]
  if (!c || c.sourceHash !== sourceHash) return null
  if (!outputsExist(c.entry)) return null
  return c.entry
}

function processGif(key, sourceHash, srcPath) {
  const hit = cacheHit(key, sourceHash)
  if (hit) return { entry: hit, skipped: true }

  const mp4Path = path.join(OUT_DIR, `${key}.mp4`)
  const jpgPath = path.join(OUT_DIR, `${key}.jpg`)

  if (!FFMPEG_OK) {
    const ext = path.extname(srcPath)
    copyFileSync(srcPath, path.join(OUT_DIR, `${key}${ext}`))
    return { entry: { type: 'video', src: `/media/${key}${ext}`, width: 0, height: 0 }, skipped: false }
  }

  let mp4Size = Infinity
  for (const crf of MP4_CRF_LADDER) {
    encodeMp4(srcPath, mp4Path, VIDEO_SCALE_WIDTH, crf)
    mp4Size = fileSize(mp4Path)
    if (mp4Size <= MAX_CLIP_BYTES) break
    console.warn(`  ${key}.mp4 still ${(mp4Size / 1048576).toFixed(2)}MB at crf ${crf}, raising crf...`)
  }

  encodePoster(srcPath, jpgPath)

  const { width, height } = ffprobeDims(mp4Path)

  return {
    entry: {
      type: 'video',
      src: `/media/${key}.mp4`,
      poster: `/media/${key}.jpg`,
      width,
      height,
    },
    skipped: false,
    mp4Size,
  }
}

function processImage(key, sourceHash, srcPath) {
  const hit = cacheHit(key, sourceHash)
  if (hit) return { entry: hit, skipped: true }

  const webpPath = path.join(OUT_DIR, `${key}.webp`)

  if (!FFMPEG_OK) {
    const ext = path.extname(srcPath)
    copyFileSync(srcPath, path.join(OUT_DIR, `${key}${ext}`))
    return { entry: { type: 'image', src: `/media/${key}${ext}`, width: 0, height: 0 }, skipped: false }
  }

  encodeWebp(srcPath, webpPath, 1600, 82)
  const { width, height } = ffprobeDims(webpPath)

  const entry = { type: 'image', src: `/media/${key}.webp`, width, height }

  if (key === 'og-cover') {
    const jpgPath = path.join(OUT_DIR, `${key}.jpg`)
    // Crop toward a standard ~1.9:1 social-card ratio, centered, before
    // capping width — this is a derivative of the hero screenshot, not a
    // second unique source (see task-2-report.md).
    encodeJpeg(srcPath, jpgPath, 1200, 'crop=trunc(ih*1.9/2)*2:ih:(iw-trunc(ih*1.9/2)*2)/2:0')
    entry.jpg = `/media/${key}.jpg`
  }

  return { entry, skipped: false }
}

function main() {
  const manifest = {}
  const newCache = {}
  const clipSizes = []
  let skippedCount = 0
  let encodedCount = 0

  const orderedImageKeys = Object.keys(IMAGE_SOURCES_HASH).filter((k) => !(k in IMAGE_ALIASES))
  const total = Object.keys(GIF_SOURCES_HASH).length + orderedImageKeys.length
  let done = 0

  for (const [key, hash] of Object.entries(GIF_SOURCES_HASH)) {
    done++
    const srcPath = resolveSourceFile(hash)
    const sourceHash = sha1(readFileSync(srcPath))
    const result = processGif(key, sourceHash, srcPath)
    process.stdout.write(`[${done}/${total}] ${key} (gif -> mp4/jpg)${result.skipped ? ' [cached, unchanged]' : ''}\n`)
    if (result.skipped) skippedCount++
    else encodedCount++
    if (result.mp4Size) clipSizes.push({ key, mp4: result.mp4Size })
    manifest[key] = result.entry
    newCache[key] = { sourceHash, entry: result.entry }
  }

  for (const key of orderedImageKeys) {
    done++
    const hash = IMAGE_SOURCES_HASH[key]
    const srcPath = resolveSourceFile(hash)
    const sourceHash = sha1(readFileSync(srcPath))
    const result = processImage(key, sourceHash, srcPath)
    process.stdout.write(`[${done}/${total}] ${key} (image -> webp)${result.skipped ? ' [cached, unchanged]' : ''}\n`)
    if (result.skipped) skippedCount++
    else encodedCount++
    manifest[key] = result.entry
    newCache[key] = { sourceHash, entry: result.entry }
  }

  // Aliases: same physical file as their canonical key, no separate encode.
  for (const [aliasKey, canonicalKey] of Object.entries(IMAGE_ALIASES)) {
    manifest[aliasKey] = { ...manifest[canonicalKey] }
    newCache[aliasKey] = newCache[canonicalKey]
  }

  writeFileSync(CACHE_PATH, JSON.stringify(newCache, null, 2))

  const sortedKeys = Object.keys(manifest).sort()
  const sortedManifest = {}
  for (const k of sortedKeys) sortedManifest[k] = manifest[k]

  const banner = FFMPEG_OK
    ? '// Auto-generated by scripts/optimize-media.mjs. Do not edit by hand.'
    : '// Auto-generated by scripts/optimize-media.mjs. Do not edit by hand.\n// WARNING: generated with ffmpeg unavailable — sources copied through unoptimized.'

  const fileContents = `${banner}\nconst mediaManifest = ${JSON.stringify(sortedManifest, null, 2)}\n\nexport default mediaManifest\n`
  writeFileSync(MANIFEST_PATH, fileContents)

  // ---------------------------------------------------------------------
  // Key-coverage check: every `key: '...'` referenced anywhere under
  // src/content/** (Task 1's content modules), plus the 5 fixed
  // page-level keys, must resolve in the manifest we just wrote.
  // ---------------------------------------------------------------------
  const contentKeys = new Set()
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(full)
      } else if (entry.name.endsWith('.js')) {
        const text = readFileSync(full, 'utf8')
        const re = /key:\s*'([\w-]+)'/g
        let m
        while ((m = re.exec(text))) contentKeys.add(m[1])
      }
    }
  }
  walk(CONTENT_DIR)
  for (const k of PAGE_LEVEL_KEYS) contentKeys.add(k)

  const missing = [...contentKeys].filter((k) => !(k in sortedManifest)).sort()

  console.log('')
  console.log(`Manifest entries: ${Object.keys(sortedManifest).length}`)
  console.log(`Content keys required: ${contentKeys.size}`)
  console.log(`Encoded: ${encodedCount}, skipped (cached/unchanged): ${skippedCount}`)

  if (clipSizes.length) {
    const over = clipSizes.filter((c) => c.mp4 > MAX_CLIP_BYTES)
    if (over.length) {
      console.warn(`WARNING: ${over.length} clip(s) still over 3MB after full crf ladder:`)
      for (const c of over) console.warn(`  ${c.key}: mp4=${(c.mp4 / 1048576).toFixed(2)}MB`)
    }
  }

  if (missing.length) {
    console.error('KEY COVERAGE FAILED — missing from mediaManifest:')
    for (const k of missing) console.error(`  - ${k}`)
    process.exit(1)
  }

  console.log('Key coverage OK — every content media key resolves in mediaManifest.js')
}

main()

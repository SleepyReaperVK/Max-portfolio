#!/usr/bin/env node
// Converts everything in media-src/ (downloaded by fetch-media.mjs) into
// self-hosted, size-budgeted assets under public/media/, and emits
// src/content/mediaManifest.js mapping every content media `key` to its
// output file(s) + real pixel dimensions.
//
// GIF        -> <key>.mp4 (H.264) + <key>.webm (VP9) + <key>.jpg poster
// PNG/JPEG   -> <key>.webp (max width 1600, quality 82)
// og-cover   -> also gets a .jpg fallback, cropped to a social-card ratio
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
} from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()
const SRC_DIR = path.join(ROOT, 'media-src')
const OUT_DIR = path.join(ROOT, 'public', 'media')
const CONTENT_DIR = path.join(ROOT, 'src', 'content')
const MANIFEST_PATH = path.join(CONTENT_DIR, 'mediaManifest.js')

mkdirSync(OUT_DIR, { recursive: true })

// ---------------------------------------------------------------------------
// Source mapping — content key -> media-src filename.
//
// Derived mechanically from content-raw/*.json media[] order matched
// 1:1 against each content module's media[] declaration order (verified:
// every section's item count matches the corresponding raw file's non-
// excluded media count exactly). Two entries were reassigned based on
// visual inspection where the mechanical/positional mapping produced a
// worse fit than the alternative — see task-2-report.md "Key mapping
// decisions" for the reasoning:
//   - ai-attack-manager-data   -> Screenshot_2026-08-14_160258.png (was ...161259)
//   - ai-attack-manager-config -> Screenshot_2026-08-14_161259.png (was ...160258)
// ---------------------------------------------------------------------------

const GIF_SOURCES = {
  // combat
  'combat-state-unequipped': 'PrayForPlagues_Unequipped_showcase-ezgif.com-video-to-gif-converter.gif',
  'combat-state-light-weapon': 'PrayForPlagues_Equipped_1handed-ezgif.com-video-to-gif-converter.gif',
  'combat-state-heavy-weapon': 'PrayForPlagues_2Handed-ezgif.com-video-to-gif-converter.gif',
  'combat-hit-reaction-unarmed': 'PrayForPlagues_HitReact_Player-ezgif.com-video-to-gif-converter.gif',
  'combat-damage-player': 'PrayForPlagues_DamagAplly-ezgif.com-video-to-gif-converter.gif',
  'combat-damage-hostile': 'OnlyHostileDamageApplication-ezgif.com-video-to-gif-converter.gif',
  'combat-parry': 'PrayForPlagues_Parry-ezgif.com-video-to-gif-converter.gif',
  'combat-lock-on-switch': 'PrayForPlagues_LockOn-ezgif.com-video-to-gif-converter.gif',
  'combat-lock-on-death-switch': 'PrayForPlagues_LockOnSwitchAfterKill-ezgif.com-video-to-gif-converter.gif',
  'combat-camera-reset': 'PrayForPlagues_CameraReset-ezgif.com-video-to-gif-converter.gif',
  'combat-foot-ik': 'PrayForPlagues_FootIK-ezgif.com-video-to-gif-converter.gif',

  // ai
  'ai-idle-to-engage': 'PrayForPlagues_EnemyBossEngage-ezgif.com-video-to-gif-converter.gif',
  'ai-strafe-attack': 'PrayForPlagues_AIAttack-ezgif.com-video-to-gif-converter.gif',
  'ai-patrol-loop': 'PrayForPlagues_AIPatrol-ezgif.com-video-to-gif-converter.gif',
  'ai-player-spotted': 'PrayForPlagues_PlayerSpotted-ezgif.com-video-to-gif-converter-1-.gif',
  'ai-vision-perception': 'CryptRaiderPreviewNetMode_Standalone064-bit_PCD3DSM62026-08-1318-35-18-ezgif.com-video-to-gif-converter.gif',
  'ai-crowd-avoidance': 'Crowd_Avoid1-ezgif.com-video-to-gif-converter.gif',
  'ai-boss-phase-1': 'PrayForPlagues_Phase1-ezgif.com-video-to-gif-converter.gif',
  'ai-boss-phase-transition': 'PrayForPlagues_Phase2Begin-ezgif.com-video-to-gif-converter.gif',
  'ai-boss-phase-2': 'VideoProject7-ezgif.com-video-to-gif-converter.gif',
  'ai-attack-types': 'CryptRaider-UnrealEditor2026-08-1519-39-57-ezgif.com-video-to-gif-converter.gif',

  // interaction
  'interaction-pickup-item': 'PrayForPlagues_Pickup-ezgif.com-video-to-gif-converter.gif',
  'interaction-open-door': 'PrayForPlagues_OpenDoor-ezgif.com-video-to-gif-converter.gif',
  'interaction-open-locked-door': 'PrayForPlagues_OpendoorWithKey-ezgif.com-video-to-gif-converter.gif',
  'interaction-inspect-note': 'PrayForPlagues_NoteRead-ezgif.com-video-to-gif-converter.gif',
  'interaction-open-chest': 'PrayForPlagues_OpenChest-ezgif.com-video-to-gif-converter.gif',
  'interaction-pickup-heavy-weapon': 'PrayForPlagues_HeavyWeaponEquipped_Pickup-ezgif.com-video-to-gif-converter.gif',

  // inventory
  'inventory-category-showcase': 'PrayForPlagues_ItemCategories-ezgif.com-video-to-gif-converter.gif',
  'inventory-stack-overflow': 'PrayForPlagues_ItemSentToStash-ezgif.com-video-to-gif-converter.gif',
  'inventory-action-context-menu': 'PrayForPlagues_OperateItem-ezgif.com-video-to-gif-converter.gif',
  'inventory-key-item-usage': 'PrayForPlagues_UseKeyItem-ezgif.com-video-to-gif-converter.gif',
}

const IMAGE_SOURCES = {
  // combat
  'combat-players-stats': 'Screenshot_2026-08-04_172000.png',
  'combat-weapons-stats': 'Screenshot_2026-08-04_172245.png',
  'combat-damage-calc-ge': 'Screenshot_2026-08-04_172749.png',
  'combat-weapon-data': 'Screenshot_2026-08-04_202327.png',

  // ai
  'ai-boss-data-asset': 'Screenshot_2026-08-10_221837.png',
  'ai-attack-manager-data': 'Screenshot_2026-08-14_160258.png',
  'ai-attack-manager-config': 'Screenshot_2026-08-14_161259.png',

  // audio
  'audio-gameplay-video-preview': 'd50e818b213971ee83500fadd4a2d6b11a63ac0ad3a2aeba.avif',
  'audio-boss-soundtrack-manager': 'Screenshot_2026-08-08_223536.png',
  'audio-dynamic-footstep': 'Screenshot_2026-08-08_223431.png',
  'audio-combat-hit-feedback': 'Screenshot_2026-08-08_223730.png',

  // inventory
  'inventory-data-table-summary': 'Screenshot_2026-08-07_113226.png',
  'inventory-data-table-detail': 'Screenshot_2026-08-07_113536.png',

  // level design
  'level-design-prison-section': 'Screenshot_2026-08-09_012618.png',
  'level-design-first-floor-entrance': 'ScreenShot00000.png',
  'level-design-first-floor-main-hall': 'ScreenShot00001-46f3530f.png',
  'level-design-first-floor-idol-of-death': 'ScreenShot00004.png',
  'level-design-first-floor-tunnel': 'ScreenShot00015.png',
  'level-design-first-floor-second-entrance': 'ScreenShot00016.png',
  'level-design-second-floor-entrance': 'ScreenShot00007.png',
  'level-design-second-floor-balcony': 'ScreenShot00008.png',
  'level-design-third-floor-bridge': 'ScreenShot00011.png',
  'level-design-third-floor-prayer-room': 'ScreenShot00012.png',
  'level-design-third-floor-chamber-entrance': 'ScreenShot00014.png',
  'level-design-dungeon-environment-1': 'ScreenShot00018.png',
  'level-design-dungeon-environment-2': 'ScreenShot00019.png',
  'level-design-dungeon-environment-3': 'ScreenShot00021.png',

  // page-level (siteConfig.media / about.js)
  portrait: '1768219767441',
  'hero-background': 'ScreenShot00001.png',
  'project-cover': 'ScreenShot00001.png',
  'case-study-hero': 'ScreenShot00001.png',
  'og-cover': 'ScreenShot00001.png',
}

// The 5 page-level keys named directly by src/content/siteConfig.js `media`
// block and src/content/prayForPlagues/about.js `portrait` field. These are
// not declared as `key: '...'` inside a section's media[] array, so the
// generic grep in the coverage check below can't discover them — they are
// a fixed, explicitly-specified contract (see task-2-brief.md).
const PAGE_LEVEL_KEYS = ['hero-background', 'portrait', 'project-cover', 'case-study-hero', 'og-cover']

const VIDEO_SCALE_WIDTH = 480
const MP4_CRF_LADDER = [26, 30, 34, 38, 42]
const WEBM_CRF_LADDER = [36, 42, 46, 50, 54]
const MAX_CLIP_BYTES = 3 * 1024 * 1024

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
    '-i', src,
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    '-vf', `scale=${width}:-2`,
    '-c:v', 'libx264',
    '-crf', String(crf),
    out,
  ])
}

function encodeWebm(src, out, width, crf) {
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
    '-i', src,
    '-pix_fmt', 'yuv420p',
    '-vf', `scale=${width}:-2`,
    '-c:v', 'libvpx-vp9',
    '-crf', String(crf),
    '-b:v', '0',
    out,
  ])
}

function encodePoster(src, out) {
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
    '-i', src,
    '-vframes', '1',
    '-vf', "scale='min(1280,iw)':-2",
    out,
  ])
}

function encodeWebp(src, out, maxWidth, quality) {
  execFileSync('ffmpeg', [
    '-y', '-v', 'error',
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
    '-i', src,
    '-vf', vf,
    '-q:v', '4',
    out,
  ])
}

function processGif(key, srcFile) {
  const srcPath = path.join(SRC_DIR, srcFile)
  const mp4Path = path.join(OUT_DIR, `${key}.mp4`)
  const webmPath = path.join(OUT_DIR, `${key}.webm`)
  const jpgPath = path.join(OUT_DIR, `${key}.jpg`)

  if (!FFMPEG_OK) {
    copyFileSync(srcPath, path.join(OUT_DIR, `${key}${path.extname(srcFile)}`))
    return { type: 'video', src: `/media/${key}${path.extname(srcFile)}`, width: 0, height: 0 }
  }

  let mp4Size = Infinity
  for (const crf of MP4_CRF_LADDER) {
    encodeMp4(srcPath, mp4Path, VIDEO_SCALE_WIDTH, crf)
    mp4Size = fileSize(mp4Path)
    if (mp4Size <= MAX_CLIP_BYTES) break
    console.warn(`  ${key}.mp4 still ${(mp4Size / 1048576).toFixed(2)}MB at crf ${crf}, raising crf...`)
  }

  let webmSize = Infinity
  for (const crf of WEBM_CRF_LADDER) {
    encodeWebm(srcPath, webmPath, VIDEO_SCALE_WIDTH, crf)
    webmSize = fileSize(webmPath)
    if (webmSize <= MAX_CLIP_BYTES) break
    console.warn(`  ${key}.webm still ${(webmSize / 1048576).toFixed(2)}MB, raising crf...`)
  }

  encodePoster(srcPath, jpgPath)

  const { width, height } = ffprobeDims(mp4Path)

  return {
    type: 'video',
    src: `/media/${key}.mp4`,
    webm: `/media/${key}.webm`,
    poster: `/media/${key}.jpg`,
    width,
    height,
    _mp4Size: mp4Size,
    _webmSize: webmSize,
  }
}

function processImage(key, srcFile) {
  const srcPath = path.join(SRC_DIR, srcFile)
  const webpPath = path.join(OUT_DIR, `${key}.webp`)

  if (!FFMPEG_OK) {
    copyFileSync(srcPath, path.join(OUT_DIR, `${key}${path.extname(srcFile)}`))
    return { type: 'image', src: `/media/${key}${path.extname(srcFile)}`, width: 0, height: 0 }
  }

  encodeWebp(srcPath, webpPath, 1600, 82)
  const { width, height } = ffprobeDims(webpPath)

  const entry = { type: 'image', src: `/media/${key}.webp`, width, height }

  if (key === 'og-cover') {
    const jpgPath = path.join(OUT_DIR, `${key}.jpg`)
    // Crop toward a standard ~1.9:1 social-card ratio, centered, before
    // capping width — this is a derivative of the hero screenshot, not a
    // second unique source (see task-2-brief.md).
    encodeJpeg(srcPath, jpgPath, 1200, 'crop=trunc(ih*1.9/2)*2:ih:(iw-trunc(ih*1.9/2)*2)/2:0')
    entry.jpg = `/media/${key}.jpg`
  }

  return entry
}

function main() {
  const manifest = {}
  const clipSizes = []

  const allKeys = { ...GIF_SOURCES, ...IMAGE_SOURCES }
  const total = Object.keys(allKeys).length
  let done = 0

  for (const [key, srcFile] of Object.entries(GIF_SOURCES)) {
    process.stdout.write(`[${++done}/${total}] ${key} (gif -> mp4/webm/jpg)\n`)
    const entry = processGif(key, srcFile)
    if (entry._mp4Size) clipSizes.push({ key, mp4: entry._mp4Size, webm: entry._webmSize })
    delete entry._mp4Size
    delete entry._webmSize
    manifest[key] = entry
  }

  for (const [key, srcFile] of Object.entries(IMAGE_SOURCES)) {
    process.stdout.write(`[${++done}/${total}] ${key} (image -> webp)\n`)
    manifest[key] = processImage(key, srcFile)
  }

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

  if (clipSizes.length) {
    const over = clipSizes.filter((c) => c.mp4 > MAX_CLIP_BYTES || c.webm > MAX_CLIP_BYTES)
    if (over.length) {
      console.warn(`WARNING: ${over.length} clip(s) still over 3MB after full crf ladder:`)
      for (const c of over) console.warn(`  ${c.key}: mp4=${(c.mp4 / 1048576).toFixed(2)}MB webm=${(c.webm / 1048576).toFixed(2)}MB`)
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

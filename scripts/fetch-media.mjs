#!/usr/bin/env node
// Downloads every media asset referenced by the scraped Notion content-raw/*.json
// files (plus two page-level assets supplied directly), into media-src/.
//
// The Notion file.notion.so URLs carry an expirationTimestamp + signature and
// WILL expire. This script must run to completion before any conversion work,
// and treats a non-200 response as a hard, non-recoverable error.
//
// No extra dependencies: uses global fetch + node:fs/promises only.

import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

const ROOT = process.cwd()
const CONTENT_RAW_DIR = path.join(ROOT, 'content-raw')
const OUT_DIR = path.join(ROOT, 'media-src')

// Extra, non-Notion-scraped assets that must also be fetched before we start
// converting anything (page-level hero/portrait sources).
const EXTRA_URLS = [
  'https://media.licdn.com/dms/image/v2/D4E03AQFypGuQs6X8hQ/profile-displayphoto-scale_400_400/B4EZuyHGpqKgAg-/0/1768219767441?e=1788393600&v=beta&t=gOKWuJmVHp-PNGFUUdy6ttkSlWa1KuI7xlYOqZJ2hOY',
]

// Notion UI chrome / decoration to skip — not project evidence.
const STOCK_ART_MARKERS = [
  'Sekiro-Shadows-Die-Twice.jpeg',
  'Dark_Souls_Remastered',
  'Product_Banner-Standard_Edition',
  'Storage_Bloodborne_Wiki_Fandom.png',
  'r_bloodborne.png',
  // Official Dark Souls III promotional key art (Lothric / Soul of Cinder),
  // confirmed by review — not project evidence, licensing risk if shipped.
  '7da5911f451a4d399d9739416bec1535.jpg',
]

function isExcluded(url) {
  if (url.includes('/icons/')) return true
  if (url.includes('notion-static.com')) return true
  if (url.includes('aif.notion.so')) return true
  if (/[?&]width=40(&|$)/.test(url)) return true
  for (const marker of STOCK_ART_MARKERS) {
    if (url.includes(marker)) return true
  }
  return false
}

function shortHash(input) {
  return crypto.createHash('sha1').update(input).digest('hex').slice(0, 8)
}

function slug(name) {
  return name
    .normalize('NFKD')
    .replace(/[^\w.\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Derive a human-legible local filename from a Notion (or other) media URL.
function filenameFromUrl(url) {
  const u = new URL(url)

  if (u.pathname.includes('/image/')) {
    // vine-mandevilla-7ed.notion.site/image/<encoded-source>?...
    const encoded = u.pathname.split('/image/')[1]
    const decoded = decodeURIComponent(encoded)
    // decoded is either "attachment:<uuid>:<filename>" or a full
    // "https://.../<uuid>/<filename>" (S3-hosted) reference.
    const lastColonPart = decoded.split(':').pop()
    const candidate = lastColonPart.includes('/')
      ? lastColonPart.split('/').pop()
      : lastColonPart
    return slug(candidate)
  }

  if (u.pathname.includes('/f/f/')) {
    // file.notion.so/f/f/<space>/<uuid>/<filename>?...
    const segments = u.pathname.split('/')
    return slug(segments[segments.length - 1])
  }

  // Fallback: last path segment, or a hash if there is no usable name.
  const segments = u.pathname.split('/').filter(Boolean)
  const last = segments[segments.length - 1] || ''
  if (last.includes('.')) return slug(last)
  return `asset-${shortHash(url)}.bin`
}

async function collectNotionMediaUrls() {
  const files = (await readdir(CONTENT_RAW_DIR)).filter((f) => f.endsWith('.json'))
  const urls = []
  for (const file of files) {
    const raw = await readFile(path.join(CONTENT_RAW_DIR, file), 'utf8')
    // content-raw/*.json is double-JSON-encoded.
    let data = JSON.parse(raw)
    if (typeof data === 'string') data = JSON.parse(data)
    for (const entry of data.media || []) {
      const url = entry.replace(/^IMG: /, '').replace(/^VIDEO: /, '')
      urls.push({ url, sourceFile: file })
    }
  }
  return urls
}

async function downloadOne(url, destPath) {
  const res = await fetch(url)
  if (res.status !== 200) {
    console.error(`FETCH FAILED (HTTP ${res.status}): ${url}`)
    process.exit(1)
  }
  const buf = Buffer.from(await res.arrayBuffer())
  if (buf.length === 0) {
    console.error(`FETCH FAILED (0 bytes): ${url}`)
    process.exit(1)
  }
  await writeFile(destPath, buf)
  return buf.length
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const notionEntries = await collectNotionMediaUrls()

  const seenUrls = new Set()
  const usedNames = new Set()
  const manifest = {}

  let downloaded = 0
  let skippedExcluded = 0
  let skippedDuplicate = 0

  const toFetch = []

  for (const { url } of notionEntries) {
    if (isExcluded(url)) {
      skippedExcluded++
      continue
    }
    if (seenUrls.has(url)) {
      skippedDuplicate++
      continue
    }
    seenUrls.add(url)
    toFetch.push(url)
  }

  for (const url of EXTRA_URLS) {
    if (seenUrls.has(url)) continue
    seenUrls.add(url)
    toFetch.push(url)
  }

  for (const url of toFetch) {
    let name = filenameFromUrl(url)
    if (usedNames.has(name)) {
      const ext = path.extname(name)
      const base = name.slice(0, name.length - ext.length)
      name = `${base}-${shortHash(url)}${ext}`
    }
    usedNames.add(name)

    const destPath = path.join(OUT_DIR, name)
    const size = await downloadOne(url, destPath)
    manifest[url] = name
    downloaded++
    console.log(`OK  ${size.toString().padStart(9)}B  ${name}`)
  }

  await writeFile(
    path.join(OUT_DIR, 'download-manifest.json'),
    JSON.stringify(manifest, null, 2),
  )

  console.log('')
  console.log(`Downloaded: ${downloaded}`)
  console.log(`Skipped (excluded chrome/stock art): ${skippedExcluded}`)
  console.log(`Skipped (duplicate URL): ${skippedDuplicate}`)
  console.log(`Manifest: ${path.join(OUT_DIR, 'download-manifest.json')}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

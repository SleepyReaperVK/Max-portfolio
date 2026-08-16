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

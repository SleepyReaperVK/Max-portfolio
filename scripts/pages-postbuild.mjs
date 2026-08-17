// Post-build step for GitHub Pages hosting. Run via `npm run build:pages`.
//
// Pages is a plain static file host with no rewrite rules, so a visitor who
// opens /projects/pray-for-plagues directly — or refreshes on it — would get a
// 404 instead of the app. Pages serves 404.html for any unmatched path, so an
// identical copy of index.html there hands control to the client-side router.
//
// .nojekyll stops Pages from piping the output through Jekyll, which strips
// files and directories whose names begin with an underscore.
import { copyFileSync, existsSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

const dist = resolve(import.meta.dirname, '..', 'dist')
const indexHtml = resolve(dist, 'index.html')

if (!existsSync(indexHtml)) {
  console.error('pages-postbuild: dist/index.html not found — run the build first.')
  process.exit(1)
}

copyFileSync(indexHtml, resolve(dist, '404.html'))
writeFileSync(resolve(dist, '.nojekyll'), '')

console.log('pages-postbuild — wrote dist/404.html and dist/.nojekyll')

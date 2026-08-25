import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  // The site is a GitHub Pages PROJECT site, served from
  // https://sleepyreapervk.github.io/Max-portfolio/ — not the domain root.
  // Everything that references an asset by path has to agree with this value:
  // the router basename (src/main.jsx), the @font-face URLs
  // (src/theme/components.js), the favicon and font preloads (index.html), and
  // the generated media manifest (scripts/optimize-media.mjs). Changing it
  // means changing all five together.
  base: '/Max-portfolio/',
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(process.cwd(), 'src') },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/node_modules[\\/](@mui[\\/]|@emotion[\\/])/.test(id)) return 'mui'
            if (/node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'vendor'
          }
        },
      },
    },
  },
})

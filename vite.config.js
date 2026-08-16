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
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (/react-router-dom|\breact\b|react-dom/.test(id)) return 'vendor'
            if (/@mui\/material|@emotion\/react|@emotion\/styled/.test(id)) return 'mui'
          }
        },
      },
    },
  },
})

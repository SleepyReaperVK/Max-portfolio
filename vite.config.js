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
            if (/node_modules[\\/](@mui[\\/]|@emotion[\\/])/.test(id)) return 'mui'
            if (/node_modules[\\/](react|react-dom|react-router-dom)[\\/]/.test(id)) return 'vendor'
          }
        },
      },
    },
  },
})

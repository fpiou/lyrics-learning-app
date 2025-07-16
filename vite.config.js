import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',  // Utiliser des chemins relatifs
  build: {
    outDir: 'dist',
  },
})

import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',  // Netlify utilise le domaine racine
  build: {
    outDir: 'dist',
  },
})

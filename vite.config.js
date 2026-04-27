import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Use relative asset paths so the build works on GitHub Pages subpaths
  // without needing to hardcode the repo name here.
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  }
})

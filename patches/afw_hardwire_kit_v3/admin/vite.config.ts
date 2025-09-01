
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// Admin app builds into root dist/admin with proper base path
export default defineConfig({
  base: '/admin/',
  plugins: [react(), tsconfigPaths()],
  build: {
    outDir: '../dist/admin',
    sourcemap: true,
    emptyOutDir: false
  },
  server: { port: 5273 },
  preview: { port: 4273 }
})

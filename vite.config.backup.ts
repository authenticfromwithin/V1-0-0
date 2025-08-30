import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true
  },
  define: {
    // Guard in case any lib reads process.env at runtime in the browser
    'process.env': {}
  }
})

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// Hard-wired for Node 22 & Vite 5; sourcemaps on for easier QA
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: { sourcemap: true },
  server: { port: 5173, strictPort: true },
  preview: { port: 5173, strictPort: true }
});

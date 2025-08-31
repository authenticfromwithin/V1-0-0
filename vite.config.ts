import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// ESM config to avoid CJS Node API deprecation warning.
// No visual or behavioral changes to your app.
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
  ],
});

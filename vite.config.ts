import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// ESM-safe, no vite-tsconfig-paths to avoid ESM/CJS loader conflict.
// We declare aliases explicitly to match your repo’s intent.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'components': path.resolve(__dirname, 'src/components'),
      'styles': path.resolve(__dirname, 'styles'),
      'logic': path.resolve(__dirname, 'src/logic'),
    }
  }
});

# AFW ESM Vite Config

This replaces `vite.config.ts` (CJS) with `vite.config.mts` (ESM) so that
ESM-only plugins like `vite-tsconfig-paths` can load without the
"ESM file cannot be loaded by `require`" error.

## Steps

1. Delete your existing `vite.config.ts` from the project root.
2. Copy `vite.config.mts` from this zip into the project root.
3. Ensure the plugin is installed:
   ```sh
   npm i -D vite-tsconfig-paths
   ```
4. Rebuild:
   ```sh
   npm ci
   npm run build
   ```
5. Deploy:
   ```sh
   vercel --prod
   ```

If you still see a blank page after a successful build, open your browser
console and share any red errors (file and line). That's a separate runtime
issue (usually a bad import path or missing env) and we can fix it next.

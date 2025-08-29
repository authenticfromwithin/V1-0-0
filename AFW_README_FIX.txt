AFW FIX BUNDLE — HOW TO APPLY

1) Unzip *all* files into your project root (same folder as package.json). Allow overwrite.
2) Install the alias plugin:   npm i -D vite-tsconfig-paths
3) Local check:
     npm run dev
     -> open http://localhost:5173 and you should see: "AFW app mounted ✅"
4) Production-like check:
     npm run build && npm run preview
     -> open http://localhost:4173 and confirm the same.
5) Re-enable your app:
     - In src/main.tsx, replace <App /> with your Router setup once mounting is confirmed.
     - Keep vite.config.ts and tsconfig.json from this bundle so path aliases resolve on Vercel.

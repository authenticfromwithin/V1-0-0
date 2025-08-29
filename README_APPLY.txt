AFW Hotfix Pack
----------------
What this contains:
- vercel.json : ensures SPA routing on Vercel so client routes don't 404.
- src/styles/globals.css : restores the missing global CSS import.
- src/components/System/ErrorBoundary.tsx : catches runtime errors and shows an on-screen message.
- src/components/Notifications/index.ts : ensures clean exports for the Notifications components.

How to apply:
1) Unzip into your project root (the folder that has package.json). Allow overwrite.
2) Make sure src/main.tsx imports 'styles/globals.css' and wraps the app with ErrorBoundary, e.g.
     import 'styles/globals.css'
     import ErrorBoundary from 'components/System/ErrorBoundary'
     createRoot(document.getElementById('root')!).render(
       <React.StrictMode>
         <ErrorBoundary>
           <App />
         </ErrorBoundary>
       </React.StrictMode>
     )
3) Build & deploy:
     npm ci
     npm run build
     vercel --prod
4) If a page is still blank, open the browser Console. The ErrorBoundary/boot listeners will print
   the exact error so you can fix the specific import or code path.

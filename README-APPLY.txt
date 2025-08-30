AFW Drop-in: ErrorBoundary + Debug Overlay
------------------------------------------
Place these files into your project root so they land at:
  - src/components/system/ErrorBoundary.tsx
  - public/debug-overlay.js

Then ensure your src/main.tsx imports the boundary with one of:
  import ErrorBoundary from "@/components/system/ErrorBoundary";
or
  import ErrorBoundary from "./components/system/ErrorBoundary";

...and wraps <App /> like:
  <ErrorBoundary><App /></ErrorBoundary>

(Optional) Load the overlay in index.html:
  <script src="/debug-overlay.js" defer></script>

Deploy, then open your site with ?afwdebug=1 to see helpful logs without a white screen.

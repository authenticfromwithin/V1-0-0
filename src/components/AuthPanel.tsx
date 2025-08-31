import * as React from 'react';

/**
 * Small shim to resolve the real AuthPanel no matter where it lives:
 * - ./AuthPanel.tsx
 * - ./AuthPanel/index.tsx
 * - ./AuthPanel/AuthPanel.tsx
 *
 * Keep public API stable: <AuthPanel />
 */
const modules = import.meta.glob('./AuthPanel{,/index,/**/AuthPanel}.tsx');

const LazyReal = React.lazy(async () => {
  const entries = Object.entries(modules);
  for (const [_, loader] of entries) {
    try {
      // @ts-ignore dynamic
      const m = await loader();
      if (m && (m.default || (m as any).AuthPanel)) {
        return { default: (m.default || (m as any).AuthPanel) };
      }
    } catch {
      // try next
    }
  }
  // Final fallback to avoid crash; renders a minimal panel
  return { default: () => (
    <div style={{padding:'1rem', borderRadius:12, background:'rgba(0,0,0,.35)', color:'#fff'}}>
      <p style={{opacity:.85}}>Auth panel unavailable.</p>
    </div>
  )};
});

export default function AuthPanel(props: Record<string, any>) {
  return (
    <React.Suspense fallback={<div aria-busy="true" style={{height:180}} />}> 
      <LazyReal {...props} />
    </React.Suspense>
  );
}

import React from "react";

// Rollup cannot tolerate missing static import paths.
// Use import.meta.glob to conditionally include whichever file actually exists.
const candidates = import.meta.glob([
  "./AuthPanel.tsx",
  "./AuthPanel/index.tsx",
  "./AuthPanel/AuthPanel.tsx"
]);

function resolveLoader():
  (() => Promise<{ default: React.ComponentType<any> }>) | null {
  const order = [
    "./AuthPanel.tsx",
    "./AuthPanel/index.tsx",
    "./AuthPanel/AuthPanel.tsx",
  ] as const;
  for (const key of order) {
    const loader = (candidates as any)[key];
    if (typeof loader === "function") return async () => {
      const m: any = await loader();
      const Comp = m?.default ?? m?.AuthPanel ?? m;
      return { default: (Comp || (() => null)) as React.ComponentType<any> };
    };
  }
  return null;
}

const loader = resolveLoader();

const RealAuthPanel = loader
  ? React.lazy(loader)
  : (() => null) as unknown as React.ComponentType<any>;

export default function AuthPanel(props: any) {
  return (
    <React.Suspense fallback={null}>
      <RealAuthPanel {...props} />
    </React.Suspense>
  );
}

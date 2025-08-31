import React from "react";

type AnyProps = Record<string, any>;

function useResolvedAuthPanel() {
  const [Comp, setComp] = React.useState<React.ComponentType<AnyProps> | null>(null);
  const triedRef = React.useRef(false);

  React.useEffect(() => {
    if (triedRef.current) return;
    triedRef.current = true;

    const loaders: Array<() => Promise<{ default: React.ComponentType<any> }>> = [
      () => import(/* @vite-ignore */ 'components/AuthPanel/AuthPanel'),
      () => import(/* @vite-ignore */ 'components/AuthPanel/index'),
      () => import(/* @vite-ignore */ 'components/AuthPanel'),
      () => import(/* @vite-ignore */ '@/components/AuthPanel/AuthPanel'),
      () => import(/* @vite-ignore */ '@/components/AuthPanel/index'),
      () => import(/* @vite-ignore */ '@/components/Auth/AuthPanel'),
      () => import(/* @vite-ignore */ '@/components/auth/AuthPanel'),
      () => import(/* @vite-ignore */ '@/components/auth/index'),
    ];

    (async () => {
      for (const load of loaders) {
        try {
          const mod = await load();
          if (mod && mod.default) { setComp(() => mod.default); return; }
        } catch (_e) {
          // keep trying
        }
      }
      // fall back last
      const mod = await import(/* @vite-ignore */ './System/SafeAuthPanel');
      setComp(() => mod.default);
    })();
  }, []);

  return Comp;
}

export default function AuthPanel(props: AnyProps) {
  // Allow manual fallback for demos: /?demoAuth=1
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const forceDemo = params.get('demoAuth') === '1';
  const LazyComp = useResolvedAuthPanel();

  if (forceDemo) {
    const Demo = React.lazy(() => import('./System/SafeAuthPanel'));
    return (
      <React.Suspense fallback={<div style={fallbackStyle}>Loading…</div>}>
        <Demo {...props} />
      </React.Suspense>
    );
  }

  if (!LazyComp) return <div style={fallbackStyle}>Auth panel unavailable.</div>;

  const Render = LazyComp;
  return <Render {...props} />;
}

const fallbackStyle: React.CSSProperties = {
  background: 'rgba(0,0,0,.45)',
  color: '#e9eef1',
  padding: '16px 20px',
  borderRadius: 12,
  fontSize: 16,
  lineHeight: 1.35,
  boxShadow: '0 10px 30px rgba(0,0,0,.35)',
};

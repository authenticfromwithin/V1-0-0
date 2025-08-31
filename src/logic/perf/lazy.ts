import React from 'react';
export function useInView<T extends Element>(opts?: IntersectionObserverInit){
  const ref = React.useRef<T|null>(null);
  const [vis, setVis] = React.useState(false);
  React.useEffect(()=>{
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((entries)=>{
      for (const e of entries){ if (e.isIntersecting){ setVis(true); io.disconnect(); break; } }
    }, opts || { rootMargin: '120px' });
    io.observe(el);
    return ()=>io.disconnect();
  }, [opts]);
  return { ref, inView: vis } as const;
}



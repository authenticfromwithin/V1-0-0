import React from "react";

type Layer = {
  src: string;
  speed?: number;
  className?: string;
  blendMode?: React.CSSProperties['mixBlendMode'];
  type?: 'image' | 'video';
};

type Props = {
  layers?: Layer[];
  interactive?: boolean;
  children?: React.ReactNode;
};

export default function Parallax({ layers = [], interactive = true, children }: Props){
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const frameRef = React.useRef<number | null>(null);

  const validLayers = Array.isArray(layers) ? layers.filter(l => l && typeof l.src === 'string') : [];

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !interactive) return;

    let ax = 0, ay = 0;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width/2;
      const cy = rect.top + rect.height/2;
      ax = (e.clientX - cx) / rect.width;
      ay = (e.clientY - cy) / rect.height;
    };
    el.addEventListener('mousemove', onMove);

    const step = () => {
      if (!containerRef.current) return;
      const nodes = containerRef.current.querySelectorAll<HTMLElement>('[data-parallax-layer]');
      nodes.forEach((n) => {
        const spd = Number(n.dataset.speed || 0);
        n.style.transform = `translate3d(${(-ax*20*spd).toFixed(2)}px, ${(-ay*18*spd).toFixed(2)}px, 0)`;
      });
      frameRef.current = window.requestAnimationFrame(step);
    };
    frameRef.current = window.requestAnimationFrame(step);

    return () => {
      el.removeEventListener('mousemove', onMove);
      if (frameRef.current != null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [interactive]);

  return (
    <div ref={containerRef} className="parallax-root">
      {validLayers.map((l, i) => {
        const style: React.CSSProperties = { mixBlendMode: l.blendMode };
        return (
          <div key={i} data-parallax-layer data-speed={l.speed ?? 0} className={`parallax-layer ${l.className || ''}`} style={style}>
            {l.type === 'video' ? (
              <video
                src={l.src}
                className="parallax-media"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img src={l.src} alt="" className="parallax-media" />
            )}
          </div>
        );
      })}
      <div className="parallax-children">{children}</div>
    </div>
  );
}
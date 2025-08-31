import * as React from 'react';

type Layer = {
  src: string;
  speed?: number;       // parallax multiplier
  className?: string;
  blendMode?: React.CSSProperties['mixBlendMode'];
  type?: 'img' | 'video';
};

type Props = {
  layers?: Layer[];
  interactive?: boolean;
  children?: React.ReactNode;
};

function isVideo(src: string) {
  return src.endsWith('.webm') || src.endsWith('.mp4') || src.endsWith('.ogg');
}

export default function Parallax({ layers = [], interactive = true, children }: Props) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const mouse = React.useRef({ x: 0, y: 0 });

  const safeLayers = Array.isArray(layers) ? layers.filter(Boolean) : [];

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onMouse = (e: MouseEvent) => {
      const rect = root.getBoundingClientRect();
      mouse.current.x = (e.clientX - rect.left) / rect.width - 0.5;
      mouse.current.y = (e.clientY - rect.top) / rect.height - 0.5;
    };

    if (interactive) {
      root.addEventListener('mousemove', onMouse);
    }

    const tick = () => {
      const mx = mouse.current.x, my = mouse.current.y;
      Array.from(root.querySelectorAll<HTMLElement>('[data-parallax]')).forEach(el => {
        const s = Number(el.dataset.speed || '0');
        if (!Number.isFinite(s)) return;
        const tx = (mx * s * 20);
        const ty = (my * s * 12);
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (interactive) root.removeEventListener('mousemove', onMouse);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [interactive]);

  return (
    <div ref={rootRef} className="parallax-root">
      <div className="parallax-layers">
        {safeLayers.map((L, i) => {
          const speed = L.speed ?? 0;
          const style: React.CSSProperties = {
            mixBlendMode: L.blendMode,
          };
          const common = (
            <div
              key={i}
              data-parallax
              data-speed={String(speed)}
              className={['parallax-layer', L.className].filter(Boolean).join(' ')}
              style={style}
            >
              {(() => {
                const t = L.type ?? (isVideo(L.src) ? 'video' : 'img');
                if (t === 'video') {
                  return (
                    <video
                      src={L.src}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="parallax-media"
                    />
                  );
                }
                return <img src={L.src} alt="" className="parallax-media" decoding="async" />;
              })()}
            </div>
          );
          return common;
        })}
      </div>
      <div className="parallax-children">{children}</div>
    </div>
  );
}

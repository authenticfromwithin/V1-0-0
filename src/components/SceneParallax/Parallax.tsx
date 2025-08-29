import React from "react";

type Layer = { src?: string; depth: number; opacity?: number };
type Props = { layers: Layer[]; className?: string; style?: React.CSSProperties };

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

export default function Parallax({ layers, className, style }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const target = React.useRef({ x: 0, y: 0 });
  const current = React.useRef({ x: 0, y: 0 });
  const reduce = React.useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  React.useEffect(() => {
    if (reduce) return;
    const el = ref.current; if (!el) return;

    const onMove = (px: number, py: number) => {
      target.current.x = px; target.current.y = py;
    };

    const onMouse = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      onMove(px, py);
    };

    const handleOrientation = (e: DeviceOrientationEvent) => {
      const nx = (Number(e.gamma) || 0) / 45;
      const ny = (Number(e.beta) || 0) / 45;
      onMove(Math.max(-0.75, Math.min(0.75, nx * 0.25)), Math.max(-0.75, Math.min(0.75, ny * 0.15)));
    };

    let raf = 0;
    const loop = () => {
      current.current.x = lerp(current.current.x, target.current.x, 0.06);
      current.current.y = lerp(current.current.y, target.current.y, 0.06);
      Array.from(el.children).forEach((child) => {
        const depth = (child as HTMLElement).dataset.depth; if (!depth) return;
        const d = parseFloat(depth);
        (child as HTMLElement).style.transform = `translate3d(${current.current.x * d * -12}px, ${current.current.y * d * -8}px, 0)`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener('mousemove', onMouse);
    let didRequest = false;
    const enableOrientation = async () => {
      try {
        const anyDO = (DeviceOrientationEvent as any);
        if (anyDO && typeof anyDO.requestPermission === 'function') {
          const res = await anyDO.requestPermission();
          if (res === 'granted') window.addEventListener('deviceorientation', handleOrientation);
        } else {
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } catch {}
    };
    const touchStart = () => { if (!didRequest) { didRequest = true; enableOrientation(); } };
    window.addEventListener('touchstart', touchStart, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('deviceorientation', handleOrientation as any);
      window.removeEventListener('touchstart', touchStart);
    };
  }, [reduce]);

  return (
    <div ref={ref} className={className} style={{ position: 'relative', overflow: 'hidden', pointerEvents:'none', ...style }} aria-hidden>
      {layers.map((l, i) => (
        <div key={i} data-depth={l.depth}
          style={{ position: 'absolute', inset: 0, background: l.src ? `url(${l.src}) center/cover no-repeat` : 'transparent', opacity: l.opacity ?? 1, willChange: 'transform' }} />
      ))}
    </div>
  );
}

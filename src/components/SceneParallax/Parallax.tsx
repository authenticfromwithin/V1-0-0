import React, { useEffect, useRef } from "react";

type BlendMode = React.CSSProperties["mixBlendMode"];

type Layer = {
  key?: string;
  speed?: number; // 0..1 parallax response
  src?: string;   // image or video
  className?: string;
  style?: React.CSSProperties;
  blendMode?: BlendMode;
  type?: "image" | "video" | "auto";
};

export type ParallaxProps = {
  layers?: Layer[];
  children?: React.ReactNode;
  interactive?: boolean;
};

const isVideo = (src?: string) => {
  if (!src) return false;
  const s = src.toLowerCase();
  return s.endsWith(".webm") || s.endsWith(".mp4") || s.endsWith(".ogg");
};

export default function Parallax({ layers = [], children, interactive = true }: ParallaxProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<Array<HTMLElement | null>>([]);
  const rafRef = useRef<number | null>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  // Maintain ref slots for each layer
  layerRefs.current = (Array.isArray(layers) ? layers : []).map((_, i) => layerRefs.current[i] ?? null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      target.current.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
      target.current.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
    };

    root.addEventListener("pointermove", onPointerMove, { passive: true });

    const animate = () => {
      // spring easing
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;

      const safe = Array.isArray(layers) ? layers : [];
      for (let i = 0; i < safe.length; i++) {
        const el = layerRefs.current[i];
        if (!el) continue;
        const speed = Number.isFinite(safe[i]?.speed as number) ? (safe[i]?.speed as number) : 0;
        const tx = current.current.x * 10 * speed;
        const ty = current.current.y * 10 * speed;
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [layers, interactive]);

  const safeLayers = Array.isArray(layers) ? layers.filter(Boolean) : [];

  return (
    <div ref={rootRef} className="parallax-root relative w-full h-full overflow-hidden">
      {safeLayers.map((layer, idx) => {
        const { src, className, style, blendMode, key, type } = layer || {};
        const useVideo = type === "video" || (type !== "image" && isVideo(src));

        const commonProps = {
          ref: (el: HTMLElement | null) => (layerRefs.current[idx] = el),
          className: ["parallax-layer pointer-events-none absolute inset-0 will-change-transform", className || ""].filter(Boolean).join(" "),
          style: { ...(style || {}), mixBlendMode: blendMode, zIndex: (style?.zIndex as number | undefined) ?? 0 } as React.CSSProperties,
          "data-layer-index": idx,
        };

        if (!src) return <div {...(commonProps as any)} key={key ?? idx} />;

        if (useVideo) {
          return (
            <div {...(commonProps as any)} key={key ?? idx}>
              <video className="w-full h-full object-cover" autoPlay muted playsInline loop preload="auto">
                <source src={src} />
              </video>
            </div>
          );
        }

        return (
          <div
            {...(commonProps as any)}
            key={key ?? idx}
            style={{ ...(commonProps.style as React.CSSProperties), backgroundImage: `url("${src}")`, backgroundSize: "cover", backgroundPosition: "center" }}
          />
        );
      })}
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}

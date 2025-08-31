import React, { useEffect, useRef } from "react";

type BlendMode = React.CSSProperties["mixBlendMode"];

type Layer = {
  key?: string;
  /** 0 (static) .. 1 (moves most) */
  speed?: number;
  /** If provided, renders as image or video depending on extension */
  src?: string;
  className?: string;
  style?: React.CSSProperties;
  /** e.g. "screen" to let fire punch through darker bg */
  blendMode?: BlendMode;
  /** Force type; otherwise inferred from src */
  type?: "image" | "video" | "auto";
};

export type ParallaxProps = {
  /** Optional collection of layers. Defaults to [] so .map is always safe. */
  layers?: Layer[];
  /** Optional children rendered on top of layers (e.g., panels/UI) */
  children?: React.ReactNode;
  /** Whether to enable pointer-based parallax (default: true) */
  interactive?: boolean;
};

const isVideo = (src?: string) => {
  if (!src) return false;
  const lower = src.toLowerCase();
  return lower.endsWith(".webm") || lower.endsWith(".mp4") || lower.endsWith(".ogg");
};

export default function Parallax({
  layers = [],
  children,
  interactive = true,
}: ParallaxProps) {
  // Root container ref (HTMLDivElement)
  const rootRef = useRef<HTMLDivElement | null>(null);
  // Per-layer element refs
  const layerRefs = useRef<Array<HTMLElement | null>>([]);
  // rAF handle for cleanup
  const rafRef = useRef<number | null>(null);
  // Pointer target values
  const target = useRef({ x: 0, y: 0 });
  // Current animated values (springy easing)
  const current = useRef({ x: 0, y: 0 });

  // Ensure refs array length matches layers length
  layerRefs.current = (Array.isArray(layers) ? layers : []).map((_, i) => layerRefs.current[i] ?? null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const onPointerMove = (e: PointerEvent) => {
      if (!interactive) return;
      const rect = root.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      // Normalize to [-1, 1]
      target.current.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (rect.width / 2)));
      target.current.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (rect.height / 2)));
    };

    // Passive listener for best perf
    root.addEventListener("pointermove", onPointerMove, { passive: true });

    const animate = () => {
      // Easing
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;

      // Apply transforms to each layer with full guards
      const safeLayers = Array.isArray(layers) ? layers : [];
      for (let i = 0; i < safeLayers.length; i++) {
        const el = layerRefs.current[i];
        if (!el) continue;
        const speed = Number.isFinite(safeLayers[i]?.speed as number) ? (safeLayers[i]?.speed as number) : 0;
        const tx = current.current.x * 10 * speed; // translate up to ~10px at speed=1
        const ty = current.current.y * 10 * speed;
        // Avoid layout thrash: only transform
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      }

      rafRef.current = window.requestAnimationFrame(animate);
    };

    rafRef.current = window.requestAnimationFrame(animate);

    return () => {
      root.removeEventListener("pointermove", onPointerMove);
      if (rafRef.current !== null) {
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
        const inferredIsVideo = type === "video" || (type !== "image" && isVideo(src));
        const commonProps = {
          ref: (el: HTMLElement | null) => {
            layerRefs.current[idx] = el;
          },
          className: [
            "parallax-layer pointer-events-none absolute inset-0 will-change-transform",
            className || "",
          ]
            .filter(Boolean)
            .join(" "),
          style: {
            ...style,
            mixBlendMode: blendMode,
            // default stacking ensures layers sit behind panels unless caller overrides via zIndex
            zIndex: (style?.zIndex as number | undefined) ?? 0,
          } as React.CSSProperties,
          "data-layer-index": idx,
        };

        if (!src) {
          // Empty layer container if only used for tint/gradients provided via style
          return <div {...(commonProps as any)} key={key ?? idx} />;
        }

        if (inferredIsVideo) {
          return (
            <div {...(commonProps as any)} key={key ?? idx}>
              <video
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                loop
                preload="auto"
              >
                <source src={src} />
              </video>
            </div>
          );
        }

        // Image layer
        return (
          <div
            {...(commonProps as any)}
            key={key ?? idx}
            style={{
              ...(commonProps.style as React.CSSProperties),
              backgroundImage: `url("${src}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        );
      })}

      {/* Foreground children (e.g., auth panel) */}
      {children ? <div className="relative z-10">{children}</div> : null}
    </div>
  );
}

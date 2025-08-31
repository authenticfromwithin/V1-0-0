import React from "react";

type Layer = {
  src: string;
  speed?: number;
  className?: string;
  blendMode?: React.CSSProperties["mixBlendMode"];
  type?: "image" | "video";
};

type Props = {
  layers?: Layer[];
  interactive?: boolean;
  children?: React.ReactNode;
};

export default function Parallax({ layers = [], interactive = false, children }: Props) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const rafRef = React.useRef<number | null>(null);

  const safeLayers = Array.isArray(layers) ? layers.filter(Boolean) : [];

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || !interactive) return;

    let running = true;
    const onScroll = () => {
      if (rafRef.current != null) return;
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        if (!running || !el) return;
        const y = window.scrollY || 0;
        const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-parallax-speed]"));
        for (const n of nodes) {
          const sp = parseFloat(n.dataset.parallaxSpeed || "0");
          n.style.transform = `translate3d(0, ${Math.round(y * sp)}px, 0)`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      running = false;
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [interactive]);

  return (
    <div ref={containerRef} style={{ position: "relative", overflow: "hidden" }}>
      {safeLayers.map((l, i) => {
        const sp = typeof l.speed === "number" ? l.speed : 0;
        const style: React.CSSProperties = {
          position: "fixed",
          inset: 0,
          objectFit: "cover",
          width: "100%",
          height: "100%",
          mixBlendMode: l.blendMode,
          zIndex: 0 + i,
          transform: "translateZ(0)",
        };
        const commonProps = {
          key: i,
          "data-parallax-speed": sp.toString(),
          className: l.className || "",
          style,
        } as any;

        if (l.type === "video" || l.src.endsWith(".webm") || l.src.endsWith(".mp4") || l.src.endsWith(".ogg")) {
          return (
            <video {...commonProps} autoPlay muted loop playsInline preload="auto">
              <source src={l.src} />
            </video>
          );
        }
        return <img {...commonProps} src={l.src} alt="" />;
      })}
      <div style={{ position: "relative", zIndex: 1000 }}>{children}</div>
    </div>
  );
}

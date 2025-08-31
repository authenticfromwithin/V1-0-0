import React from "react";

type Layer = {
  src?: string;
  speed?: number;           // 0..1 parallax factor
  className?: string;
  blendMode?: React.CSSProperties["mixBlendMode"];
  type?: "image" | "video"; // default image
};

type Props = {
  layers?: Layer[];
  interactive?: boolean;
  children?: React.ReactNode;
};

export default function Parallax({ layers = [], interactive = false, children }: Props){
  const rootRef = React.useRef<HTMLDivElement|null>(null);
  const rafRef = React.useRef<number|undefined>(undefined);

  const sane = (layers || []).filter(Boolean).map(l => ({
    src: l?.src || "",
    speed: typeof l?.speed === "number" ? l!.speed! : 0,
    className: ["parallax-layer", l?.className].filter(Boolean).join(" "),
    blendMode: l?.blendMode,
    type: l?.type || "image" as const
  }));

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el || !interactive) return;

    let frame = 0;
    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        frame++;
        const y = window.scrollY || 0;
        const nodes = Array.from(el.querySelectorAll<HTMLElement>(".parallax-layer"));
        nodes.forEach((n) => {
          const f = Number(n.dataset.speed || "0");
          const t = Math.round(y * f);
          n.style.transform = `translate3d(0, ${t}px, 0)`;
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [interactive]);

  return (
    <div ref={rootRef} className="parallax-root">
      {sane.map((l, i) => {
        const style: React.CSSProperties = { mixBlendMode: l.blendMode as any };
        if (!l.src) return null;
        if (l.type === "video") {
          return (
            <video
              key={i}
              className={l.className}
              data-speed={String(l.speed || 0)}
              style={style}
              src={l.src}
              autoPlay
              muted
              loop
              playsInline
            />
          );
        }
        return (
          <div
            key={i}
            className={l.className}
            data-speed={String(l.speed || 0)}
            style={{ ...style, backgroundImage: `url(${l.src})` }}
          />
        );
      })}
      <div className="parallax-children">{children}</div>
    </div>
  );
}
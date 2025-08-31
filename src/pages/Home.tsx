import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Parallax from "@/components/SceneParallax/Parallax";
import { auth } from "@/logic/auth/provider";
import "@/../styles/campfire.css";

type MaybeFn = (() => void) | null;
type MaybeEl = HTMLElement | null;

export default function Home() {
  const navigate = useNavigate();
  const onReadyRef = useRef<MaybeFn | MaybeEl>(null);

  useEffect(() => {
    const maybe = onReadyRef.current;
    if (typeof maybe === "function") (maybe as () => void)();
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await auth.current?.();
        if (mounted && user) navigate("/quotes");
      } catch {}
    })();
    return () => { mounted = false; };
  }, [navigate]);

  const [AuthPanel, setAuthPanel] = useState<React.ComponentType | null>(null);
  useEffect(() => {
    import("@/components/Auth/AuthPanel")
      .then((m) => setAuthPanel(() => (m.default || (m as any))))
      .catch(() => setAuthPanel(null));
  }, []);

  const layers = [
    { src: "/assets/scenes/forest/plates/back.webp",  speed: 0.02, className: "bg" },
    { src: "/assets/scenes/forest/fire/fire.webm",     speed: 0.00, className: "fire fire-layer", blendMode: "screen", type: "video" as const },
    { src: "/assets/scenes/forest/plates/mid.webp",   speed: 0.04 },
    { src: "/assets/scenes/forest/plates/front.webp", speed: 0.07 },
  ];

  return (
    <Parallax layers={layers} interactive>
      <div className="parallax-foreground flex items-center justify-center min-h-screen">
        {AuthPanel ? <AuthPanel /> : null}
        <div id="auth-root" ref={onReadyRef as any} />
      </div>
    </Parallax>
  );
}

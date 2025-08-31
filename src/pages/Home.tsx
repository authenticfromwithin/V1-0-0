import React from "react";
import Parallax from "@/components/SceneParallax/Parallax";
import { useNavigate } from "react-router-dom";
import "@/styles/scene-parallax.css";
import AuthPanel from "@/components/AuthPanel";
import { getCurrentSafe } from "@/logic/auth/current-shim";

// Forest plates + campfire composite (no UI redesign)
const layers = [
  { src: "/assets/scenes/forest/plates/back.webp",  speed: 0.02, className: "bg" },
  { src: "/assets/scenes/forest/fire/fire.webm",     speed: 0.00, className: "fire fire-layer", blendMode: "screen", type: "video" as const },
  { src: "/assets/scenes/forest/plates/mid.webp",   speed: 0.04 },
  { src: "/assets/scenes/forest/plates/front.webp", speed: 0.07 }
] as const;

export default function Home() {
  const navigate = useNavigate();
  const stay = React.useMemo(() => new URLSearchParams(window.location.search).has("stay"), []);

  // Guarded redirect
  React.useEffect(() => {
    let live = true;
    (async () => {
      const me = await getCurrentSafe();
      if (live && me && !stay) navigate("/quotes");
    })();
    return () => { live = false; };
  }, [navigate, stay]);

  return (
    <Parallax layers={Array.isArray(layers) ? (layers as any[]) : []} interactive>
      <div className="parallax-foreground min-h-screen grid place-items-center">
        <div className="auth-panel-wrap">
          <AuthPanel />
        </div>
      </div>
    </Parallax>
  );
}

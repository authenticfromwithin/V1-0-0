import React from "react";
import Parallax from "components/SceneParallax/Parallax";
import AuthPanel from "components/AuthPanel";
import "styles/scene-parallax.css";
import "styles/home-safe.css";

export default function Home(){
  const layers = [
    { src: "/assets/scenes/forest/plates/back.webp",  speed: 0.02, className: "bg" },
    { src: "/assets/scenes/forest/fire/fire.webm",     speed: 0.00, className: "fire fire-layer", blendMode: "screen", type: "video" as const },
    { src: "/assets/scenes/forest/plates/mid.webp",   speed: 0.04, className: "mid" },
    { src: "/assets/scenes/forest/plates/front.webp", speed: 0.07, className: "front" }
  ];
  return (
    <div className="home-safe-root">
      <Parallax layers={layers} interactive>
        <div className="parallax-foreground" style={{display:"flex", minHeight:"100vh", alignItems:"center", justifyContent:"center"}}>
          <AuthPanel />
        </div>
      </Parallax>
      <div className="home-safe-fire" />
    </div>
  );
}
import React from "react";
import Parallax from "components/SceneParallax/Parallax";
import AuthPanel from "components/AuthPanel";
import "styles/scene-parallax.css";

const layers = [
  { src: "/assets/scenes/forest/plates/back.webp",  speed: 0.02, className: "bg" },
  { src: "/assets/scenes/forest/fire/fire.webm",    speed: 0.00, className: "fire", blendMode: "screen", type: "video" as const },
  { src: "/assets/scenes/forest/plates/mid.webp",   speed: 0.04, className: "mid" },
  { src: "/assets/scenes/forest/plates/front.webp", speed: 0.07, className: "front" }
];

export default function Home(){
  return (
    <Parallax layers={layers} interactive>
      <div className="home-center">
        <AuthPanel />
      </div>
    </Parallax>
  );
}
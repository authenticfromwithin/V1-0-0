import React from "react"
import Parallax from "components/SceneParallax/Parallax"
import "@/styles/scene-parallax.css"
import AuthPanel from "components/AuthPanel"
import { current } from "logic/auth/provider"
import { useNavigate } from "react-router-dom"

export default function Home(){
  const navigate = useNavigate()
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    (async () => {
      try{
        const me = await current()
        // Only redirect when /quotes exists in your router. No-op otherwise.
        if (me && typeof me === "object" && (me as any).id && window.location.pathname === "/") {
          // navigate("/quotes") // keep parked for now
        }
      } finally {
        setReady(true)
      }
    })()
  }, [navigate])

  const layers = [
    { src: "/assets/scenes/forest/plates/back.webp",  speed: 0.02, className: "bg" },
    { src: "/assets/scenes/forest/fire/fire.webm",     speed: 0.00, className: "fire fire-layer", blendMode: "screen", type: "video" as const },
    { src: "/assets/scenes/forest/plates/mid.webp",   speed: 0.04 },
    { src: "/assets/scenes/forest/plates/front.webp", speed: 0.07 },
  ]

  return (
    <div className="home-root">
      <Parallax layers={layers} interactive>
        <div className="parallax-foreground">
          <AuthPanel />
        </div>
      </Parallax>
      {!ready && <div className="boot-safety"/>}
    </div>
  )
}

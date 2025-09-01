import React, { useEffect, useState } from "react"

export default function Preloader() {
  const [ready, setReady] = useState(false)
  useEffect(() => {
    let done = false
    const onReady = () => { if (!done) { done = true; setReady(true) } }
    window.addEventListener("scene:ready", onReady)
    const failSafe = setTimeout(onReady, 1800)
    return () => { window.removeEventListener("scene:ready", onReady); clearTimeout(failSafe) }
  }, [])
  if (ready) return null
  return (
    <div className="preloader" aria-busy="true">
      <div className="ring"></div>
      <div className="preloader-copy">Preparing the night…</div>
    </div>
  )
}

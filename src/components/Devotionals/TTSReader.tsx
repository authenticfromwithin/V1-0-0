import React from "react"

export default function TTSReader({ text }: { text: string }) {
  const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined

  React.useEffect(() => {
    return () => {
      try { synth?.cancel() } catch {}
    }
  }, [synth])

  const speak = () => {
    if (!synth || !text?.trim()) return
    try {
      const u = new SpeechSynthesisUtterance(text.trim())
      u.rate = 0.95
      u.pitch = 1
      synth.cancel()
      synth.speak(u)
    } catch {}
  }

  return (
    <button className="btn" type="button" onClick={speak} title="Read aloud">
      🔊 Read
    </button>
  )
}

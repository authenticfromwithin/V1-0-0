import React, { useEffect, useRef, useState } from "react"

export function AudioToggle() {
  const ctxRef = useRef<AudioContext | null>(null)
  const [on, setOn] = useState(false)

  useEffect(() => {
    const handler = () => (on ? stop() : start())
    window.addEventListener("afw:audio-toggle", handler)
    return () => { window.removeEventListener("afw:audio-toggle", handler); ctxRef.current?.close().catch(()=>{}) }
  }, [on])

  const start = async () => {
    if (!ctxRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      ctxRef.current = ctx
      const bufferSize = 2 * ctx.sampleRate
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      let lastOut = 0.0
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1
        output[i] = (lastOut + 0.02 * white) / 1.02
        lastOut = output[i]
        output[i] *= 0.2
      }
      const noise = ctx.createBufferSource()
      noise.buffer = noiseBuffer
      noise.loop = true
      const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 800
      const gain = ctx.createGain(); gain.gain.value = 0.15
      noise.connect(filter).connect(gain).connect(ctx.destination)
      noise.start()

      const crack = ctx.createGain(); crack.gain.value = 0.0; crack.connect(ctx.destination)
      const scheduleCrackle = () => {
        const t = ctx.currentTime + Math.random() * 2 + 1
        const burst = ctx.createBufferSource()
        const b = ctx.createBuffer(1, 0.03 * ctx.sampleRate, ctx.sampleRate)
        const d = b.getChannelData(0)
        for (let i = 0; i < d.length; i++) d[i] = (Math.random()*2-1) * (1 - i/d.length)
        burst.buffer = b
        crack.gain.setValueAtTime(0.0, t)
        crack.gain.linearRampToValueAtTime(0.05, t + 0.005)
        crack.gain.linearRampToValueAtTime(0.0, t + 0.08)
        burst.connect(crack)
        burst.start(t)
        setTimeout(scheduleCrackle, 1200 + Math.random()*1200)
      }
      scheduleCrackle()
    }
    await ctxRef.current!.resume()
    setOn(true)
  }

  const stop = async () => {
    await ctxRef.current?.suspend()
    setOn(false)
  }

  return (
    <button className="btn ghost" onClick={()=> (on ? stop() : start())} aria-pressed={on} title="Toggle ambience (A)">
      {on ? "🔊 Ambience" : "🔈 Ambience"}
    </button>
  )
}

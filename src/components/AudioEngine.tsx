import React, { useEffect, useRef, useState } from "react"

function makeContext() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return ctx
}
type Engine = {
  start(): Promise<void>
  stop(): void
  isOn(): boolean
}
function createEngine(): Engine {
  let ctx: AudioContext | null = null
  let padOsc1: OscillatorNode | null = null
  let padOsc2: OscillatorNode | null = null
  let padGain: GainNode | null = null
  let noiseSrc: AudioBufferSourceNode | null = null
  let noiseGain: GainNode | null = null
  let crackleGain: GainNode | null = null
  let tick: number | null = null

  const start = async () => {
    if (!ctx) ctx = makeContext()
    if (ctx.state === "suspended") await ctx.resume()

    // Soft pad
    padGain = ctx.createGain(); padGain.gain.value = 0.06
    padOsc1 = ctx.createOscillator(); padOsc1.type = "sine"; padOsc1.frequency.value = 138 // C#3
    padOsc2 = ctx.createOscillator(); padOsc2.type = "sine"; padOsc2.frequency.value = 207 // G#3 (a fifth-ish)
    const detune = ctx.createGain(); detune.gain.value = 0.002
    padOsc1.connect(padGain); padOsc2.connect(padGain); padGain.connect(ctx.destination)
    padOsc1.start(); padOsc2.start()

    // Wind (filtered noise)
    const len = ctx.sampleRate * 2
    const buf = ctx.createBuffer(1, len, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * 0.6
    noiseSrc = ctx.createBufferSource(); noiseSrc.buffer = buf; noiseSrc.loop = true
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 800
    noiseGain = ctx.createGain(); noiseGain.gain.value = 0.018
    noiseSrc.connect(lp); lp.connect(noiseGain); noiseGain.connect(ctx.destination); noiseSrc.start()

    // Crackle (short bursts)
    crackleGain = ctx.createGain(); crackleGain.gain.value = 0.0; crackleGain.connect(ctx.destination)
    tick = window.setInterval(() => {
      if (!ctx) return
      const b = ctx.createBuffer(1, 1024, ctx.sampleRate)
      const d = b.getChannelData(0)
      for (let i=0;i<d.length;i++) d[i] = (Math.random()*2-1) * (1 - i/d.length)
      const s = ctx.createBufferSource(); s.buffer = b
      const g = ctx.createGain(); g.gain.value = 0.0
      s.connect(g); g.connect(crackleGain!)
      s.start()
      // envelope
      const now = ctx.currentTime
      g.gain.cancelScheduledValues(now)
      g.gain.setValueAtTime(0.0, now)
      g.gain.linearRampToValueAtTime(0.02 + Math.random()*0.02, now + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2 + Math.random()*0.2)
    }, 900 + Math.floor(Math.random()*600))
    crackleGain.gain.value = 1.0
  }

  const stop = () => {
    try {
      tick && clearInterval(tick); tick = null
      padOsc1?.stop(); padOsc2?.stop(); noiseSrc?.stop()
      padOsc1 = padOsc2 = null; noiseSrc = null
      padGain?.disconnect(); noiseGain?.disconnect(); crackleGain?.disconnect()
      padGain = noiseGain = crackleGain = null
      ctx?.suspend()
    } catch {}
  }

  const isOn = () => !!ctx && ctx.state !== "suspended"

  return { start, stop, isOn }
}

export default function AudioEngine({ autostart=false }: { autostart?: boolean }) {
  const ref = useRef<Engine | null>(null)
  const [on,setOn] = useState(false)

  useEffect(() => { ref.current = createEngine(); }, [])

  useEffect(() => {
    const kick = () => {
      if (!ref.current) return
      if (!on && autostart) {
        ref.current.start().then(()=> setOn(true)).catch(()=>{})
      }
      window.removeEventListener("pointerdown", kick)
      window.removeEventListener("keydown", kick)
    }
    window.addEventListener("pointerdown", kick)
    window.addEventListener("keydown", kick)
    return () => { window.removeEventListener("pointerdown", kick); window.removeEventListener("keydown", kick) }
  }, [autostart,on])

  const toggle = async () => {
    if (!ref.current) return
    if (on) { ref.current.stop(); setOn(false) }
    else { try { await ref.current.start(); setOn(true) } catch {} }
  }

  return (
    <button className={"music-toggle"+(on?" on":"")} onClick={toggle} title={on?"Music: on":"Music: off"} aria-label="Toggle music">
      ♪
    </button>
  )
}

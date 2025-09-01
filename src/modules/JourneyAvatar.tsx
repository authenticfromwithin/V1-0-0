import React, { useEffect, useRef, useState } from "react"
import { loadEcho, saveEcho, EchoState } from "../utils/echo"

export default function JourneyAvatar(){
  const [state, setState] = useState<EchoState>(loadEcho())
  const ref = useRef<HTMLCanvasElement|null>(null)

  useEffect(()=>{
    const c = ref.current!
    const ctx = c.getContext("2d")!
    const dpr = Math.min(devicePixelRatio||1, 2)
    let w = c.width = Math.floor(innerWidth * dpr)
    let h = c.height = Math.floor((innerHeight*0.7) * dpr)

    let doves: {x:number;y:number;vx:number;vy:number;life:number}[] = []

    const draw = ()=>{
      ctx.clearRect(0,0,w,h)

      // background mood wash
      const moodTint:any = { calm:"#0c1520", hopeful:"#0e1a12", bright:"#20160c", deep:"#160e20" }
      ctx.fillStyle = moodTint[state.mood] || "#0c1216"
      ctx.fillRect(0,0,w,h)

      // avatar outline
      ctx.strokeStyle = "rgba(255,255,255,0.6)"
      ctx.lineWidth = 2
      const cx=w*0.5, cy=h*0.56
      ctx.beginPath(); ctx.arc(cx, cy-90, 50, 0, Math.PI*2); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx-70, cy-40); ctx.quadraticCurveTo(cx, cy-120, cx+70, cy-40); ctx.quadraticCurveTo(cx+90, cy+120, cx, cy+160); ctx.quadraticCurveTo(cx-90, cy+120, cx-70, cy-40); ctx.closePath(); ctx.stroke()

      // growth aura
      const aura = ctx.createRadialGradient(cx, cy, 20, cx, cy, 220)
      aura.addColorStop(0, `rgba(255,230,180,${0.10 + state.growth/500})`)
      aura.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = aura; ctx.fillRect(0,0,w,h)

      // fruit emblem
      const fruitColors:any = { fig:"#c59aca", olive:"#9fc28a", pomegranate:"#e06d6d", grape:"#8aa0e6" }
      ctx.fillStyle = fruitColors[state.fruit] || "#c59aca"
      ctx.beginPath(); ctx.arc(cx, cy+10, 10, 0, Math.PI*2); ctx.fill()

      // doves
      doves.forEach(d=>{
        d.x+=d.vx; d.y+=d.vy; d.life-=1
        ctx.fillStyle = "rgba(255,255,255,0.9)"
        ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x-6, d.y+3); ctx.lineTo(d.x-2, d.y-1); ctx.closePath(); ctx.fill()
      })
      doves = doves.filter(d=>d.life>0)

      requestAnimationFrame(draw)
    }
    draw()

    return ()=>{}
  },[state])

  const set = (patch: Partial<EchoState>) => {
    const next = { ...state, ...patch }
    setState(next); saveEcho(next)
  }

  const releaseDoves = () => {
    const c = ref.current!
    const ctx = c.getContext("2d")!
    const dpr = Math.min(devicePixelRatio||1, 2)
    let w = c.width = Math.floor(innerWidth * dpr)
    let h = c.height = Math.floor((innerHeight*0.7) * dpr)
    const flock = Math.floor(6 + state.growth/10)
    const arr: any[] = []
    for(let i=0;i<flock;i++){
      arr.push({ x:w*0.5, y:h*0.5, vx:(Math.random()*1.2+0.4), vy:-(Math.random()*0.6+0.2), life: 120+Math.random()*60 })
    }
    ;(window as any).__afw_doves = (window as any).__afw_doves || []
    ;(window as any).__afw_doves.push(...arr)
    set({ doves: flock })
  }

  return (
    <section className="avatar-wrap">
      <div className="avatar-stage"><canvas ref={ref}/></div>
      <aside className="avatar-panel glass">
        <h3>My Journey</h3>
        <label>Growth: <input type="range" min="0" max="100" value={state.growth} onChange={e=>set({ growth: Number(e.target.value) })} /></label>
        <div className="ctl grid">
          <div>
            <div>Mood</div>
            <select value={state.mood} onChange={e=>set({ mood: e.target.value as any })}>
              <option value="calm">calm</option>
              <option value="hopeful">hopeful</option>
              <option value="bright">bright</option>
              <option value="deep">deep</option>
            </select>
          </div>
          <div>
            <div>Fruit</div>
            <select value={state.fruit} onChange={e=>set({ fruit: e.target.value as any })}>
              <option value="fig">fig</option>
              <option value="olive">olive</option>
              <option value="pomegranate">pomegranate</option>
              <option value="grape">grape</option>
            </select>
          </div>
        </div>
        <button className="btn" onClick={releaseDoves}>Release doves</button>
        <p className="hint">Echo persists across modules. Try toggling to Healing.</p>
      </aside>
    </section>
  )
}

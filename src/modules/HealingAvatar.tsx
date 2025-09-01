import React, { useEffect, useRef, useState } from "react"
import { loadEcho } from "../utils/echo"

type Systems = { nervous:boolean; cardio:boolean; gut:boolean }

export default function HealingAvatar(){
  const [systems, setSystems] = useState<Systems>({ nervous:true, cardio:false, gut:false })
  const [pulse, setPulse] = useState(0)
  const [echo, setEcho] = useState(loadEcho())
  const ref = useRef<HTMLCanvasElement|null>(null)

  useEffect(()=>{
    const onEcho = (e: any)=> setEcho(e.detail || loadEcho())
    window.addEventListener("afw:echo", onEcho)
    return ()=> window.removeEventListener("afw:echo", onEcho)
  },[])

  useEffect(()=>{
    const c = ref.current!
    const ctx = c.getContext("2d")!
    const dpr = Math.min(devicePixelRatio||1, 2)
    let w = c.width = Math.floor(innerWidth * dpr)
    let h = c.height = Math.floor((innerHeight*0.7) * dpr)

    const draw = ()=>{
      ctx.clearRect(0,0,w,h)
      // avatar silhouette
      ctx.fillStyle = "rgba(0,0,0,0.55)"
      const cx = w*0.5, cy = h*0.55
      ctx.beginPath()
      ctx.arc(cx, cy-90, 50, 0, Math.PI*2)     // head
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(cx-70, cy-40); ctx.quadraticCurveTo(cx, cy-120, cx+70, cy-40) // shoulders
      ctx.quadraticCurveTo(cx+90, cy+120, cx, cy+160)
      ctx.quadraticCurveTo(cx-90, cy+120, cx-70, cy-40)
      ctx.closePath(); ctx.fill()

      // mood tint from echo
      const tints:any = { calm:"rgba(120,180,255,0.18)", hopeful:"rgba(140,220,160,0.18)", bright:"rgba(255,210,120,0.18)", deep:"rgba(180,140,255,0.18)" }
      ctx.fillStyle = tints[echo.mood] || "rgba(255,200,140,0.15)"
      ctx.beginPath(); ctx.arc(cx, cy, 140 + Math.sin(pulse)*4, 0, Math.PI*2); ctx.fill()

      // systems overlays
      if (systems.nervous){
        ctx.strokeStyle = "rgba(160,200,255,0.8)"
        ctx.lineWidth = 2
        for(let i=0;i<12;i++){ const a=i/12*Math.PI*2; ctx.beginPath(); ctx.moveTo(cx,cy-60); ctx.lineTo(cx+Math.cos(a)*80, cy-60+Math.sin(a)*80); ctx.stroke() }
      }
      if (systems.cardio){
        ctx.strokeStyle = "rgba(255,90,90,0.85)"
        ctx.lineWidth = 3
        ctx.beginPath()
        let x0 = cx-60, y0 = cy
        ctx.moveTo(x0, y0)
        for(let x=0;x<=120;x+=6){
          const y = y0 + Math.sin((x+pulse*30)/15)*10
          ctx.lineTo(x0+x, y)
        }
        ctx.stroke()
      }
      if (systems.gut){
        ctx.fillStyle = "rgba(255,200,120,0.55)"
        for(let i=0;i<12;i++){
          ctx.beginPath()
          const x = cx-30 + (i%4)*20
          const y = cy+20 + Math.floor(i/4)*16
          ctx.arc(x, y, 7 + Math.sin(pulse*6+i)*1.2, 0, Math.PI*2); ctx.fill()
        }
      }

      // growth halo from echo.growth
      const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, 220)
      g.addColorStop(0, `rgba(255,220,170,${0.08 + echo.growth/600})`)
      g.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = g; ctx.fillRect(0,0,w,h)

      pulse += 0.02
      requestAnimationFrame(draw)
    }
    draw()
  },[systems, echo])

  return (
    <section className="avatar-wrap">
      <div className="avatar-stage"><canvas ref={ref}/></div>
      <aside className="avatar-panel glass">
        <h3>Healing From Within</h3>
        <div className="ctl">
          <label><input type="checkbox" checked={systems.nervous} onChange={e=>setSystems(s=>({...s, nervous:e.target.checked}))}/> Nervous system</label>
          <label><input type="checkbox" checked={systems.cardio}  onChange={e=>setSystems(s=>({...s, cardio:e.target.checked}))}/> Cardiovascular</label>
          <label><input type="checkbox" checked={systems.gut}     onChange={e=>setSystems(s=>({...s, gut:e.target.checked}))}/> Gut</label>
        </div>
        <button className="btn" onClick={()=>setPulse(p=>p+0.6)}>Soothe pulse</button>
        <p className="hint">Echo: mood {echo.mood}, fruit {echo.fruit}, growth {echo.growth}%</p>
      </aside>
    </section>
  )
}

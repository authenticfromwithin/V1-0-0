
import React, { useEffect, useRef, useState } from 'react'

function useAnnouncements() {
  const [banner, setBanner] = useState<string | null>(null)
  useEffect(() => {
    fetch('/content/announcements.json')
      .then(r => r.json())
      .then(data => {
        const active = data?.announcements?.find((a:any) => a.active)
        if (active) setBanner(active.message)
      })
      .catch(() => {})
  }, [])
  return banner
}

// Disable copy/paste/drag/drop for authenticity
function useLockClipboard() {
  useEffect(() => {
    const block = (e: Event) => { e.preventDefault() }
    const types = ['copy','cut','paste','dragstart','drop','contextmenu']
    types.forEach(t => document.addEventListener(t, block))
    return () => types.forEach(t => document.removeEventListener(t, block))
  }, [])
}

function FireCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null)
  useEffect(() => {
    const c = ref.current!
    const dpr = Math.min(window.devicePixelRatio||1, 2)
    const ctx = c.getContext('2d', { alpha: false })!
    let w = c.width = Math.floor(innerWidth * dpr)
    let h = c.height = Math.floor(innerHeight * dpr)

    const rnd = (n:number)=>Math.random()*n
    let sparks = new Array(220).fill(0).map(()=>({x:rnd(w), y:h-rnd(40), vx:(rnd(1)-0.5)*0.4, vy:-rnd(1)-0.6, life:rnd(60)+20}))

    const draw = () => {
      ctx.fillStyle = '#050608'
      ctx.fillRect(0,0,w,h)

      // glow
      const g = ctx.createRadialGradient(w/2, h*0.85, 10, w/2, h, Math.max(w,h)*0.8)
      g.addColorStop(0, 'rgba(255,180,80,0.27)')
      g.addColorStop(0.6,'rgba(40,24,10,0.1)')
      g.addColorStop(1,'rgba(0,0,0,1)')
      ctx.fillStyle = g
      ctx.fillRect(0,0,w,h)

      // embers
      sparks.forEach(s => {
        s.x += s.vx; s.y += s.vy; s.life -= 1
        s.vy -= 0.005
        if (s.life<=0 || s.y<0 || s.x<0 || s.x>w) {
          s.x = rnd(w); s.y = h - rnd(30); s.vx = (rnd(1)-0.5)*0.35; s.vy = -rnd(1)-0.5; s.life = rnd(60)+20
        }
        const r = Math.max(0.5, (s.life/80)*2.2)
        ctx.globalCompositeOperation = 'lighter'
        ctx.fillStyle = 'rgba(255,160,60,0.18)'
        ctx.beginPath(); ctx.arc(s.x, s.y, r*3, 0, Math.PI*2); ctx.fill()
        ctx.fillStyle = 'rgba(255,220,150,0.8)'
        ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI*2); ctx.fill()
        ctx.globalCompositeOperation = 'source-over'
      })
      requestAnimationFrame(draw)
    }
    const onResize = () => {
      w = c.width = Math.floor(innerWidth * dpr)
      h = c.height = Math.floor(innerHeight * dpr)
    }
    window.addEventListener('resize', onResize)
    draw()
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return <canvas className="fire" ref={ref} />
}

export default function App() {
  const banner = useAnnouncements()
  useLockClipboard()

  const [journal, setJournal] = useState(localStorage.getItem('afw:journal')||'')
  useEffect(() => { localStorage.setItem('afw:journal', journal) }, [journal])

  const [guideOpen, setGuideOpen] = useState(false)

  return (
    <div className="stage">
      <div className="nav">
        <div className="logo">AFW</div>
        <div className="menu">
          <button className="btn" onClick={()=>setGuideOpen(true)}>First‑time Guide</button>
          <a className="btn" href="/admin" rel="noreferrer">Admin</a>
        </div>
      </div>

      <FireCanvas />

      <div className="copy">
        <div>
          <h1 className="title">Authentic From Within</h1>
          <p className="subtitle">A sacred, cinematic, therapeutic space — nighttime forest; fire as the light.</p>
          <div className="journal">
            <h3>Journal (local‑only)</h3>
            <p>Your writing never leaves your device. Copy/paste and drag‑drop are disabled by design.</p>
            <textarea
              value={journal}
              onChange={(e)=>setJournal(e.target.value)}
              placeholder="Breathe. Begin with one honest line…"
            />
          </div>
        </div>
      </div>

      {banner && <div className="banner">{banner}</div>}

      {guideOpen && (
        <div style={{position:'fixed',inset:0, background:'rgba(0,0,0,0.6)', backdropFilter:'blur(6px)', display:'grid', placeItems:'center', zIndex:20}} onClick={()=>setGuideOpen(false)}>
          <div style={{maxWidth:800, background:'rgba(20,20,24,0.95)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:16, padding:20}} onClick={e=>e.stopPropagation()}>
            <h2>First‑time Guide</h2>
            <p>AFW protects your reflections. Nothing is uploaded; the admin can never see your journal.</p>
            <p>Use the theme toggle (coming), gentle audio (optional), and avatars to explore healing & devotion.</p>
            <button className="btn" onClick={()=>setGuideOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}

import React from "react"

type Layer = {
  src: string
  speed?: number
  className?: string
  blendMode?: React.CSSProperties['mixBlendMode']
  type?: 'image' | 'video'
}

type Props = {
  layers?: Layer[]
  children?: React.ReactNode
  interactive?: boolean
}

export default function Parallax({ layers = [], children, interactive = false }: Props){
  const rootRef = React.useRef<HTMLDivElement|null>(null)
  const rafRef = React.useRef<number| null>(null)
  const mouse = React.useRef({x:0,y:0})

  React.useEffect(() => {
    const root = rootRef.current
    if (!root) return

    function onMove(e: MouseEvent){
      if (!interactive) return
      const r = root.getBoundingClientRect()
      mouse.current.x = (e.clientX - r.left) / r.width - 0.5
      mouse.current.y = (e.clientY - r.top) / r.height - 0.5
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    function tick(){
      const host = rootRef.current
      if (host){
        const els = host.querySelectorAll('[data-speed]')
        els.forEach((el) => {
          const speed = parseFloat((el as HTMLElement).dataset.speed || '0')
          const x = mouse.current.x * speed * 20
          const y = mouse.current.y * speed * 10
          ;(el as HTMLElement).style.transform = `translate3d(${x}px, ${y}px, 0)`
        })
      }
      rafRef.current = window.requestAnimationFrame(tick)
    }
    rafRef.current = window.requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current)
    }
  }, [interactive])

  const safeLayers = Array.isArray(layers) ? layers.filter(l => !!l && typeof l.src === 'string') : []

  return (
    <div ref={rootRef} className="parallax-root">
      {safeLayers.map((layer, i) => {
        const type = layer.type || (layer.src.endsWith('.webm') || layer.src.endsWith('.mp4') ? 'video' : 'image')
        const commonProps = {
          className: ['parallax-layer', layer.className].filter(Boolean).join(' '),
          style: { mixBlendMode: layer.blendMode, } as React.CSSProperties,
          'data-speed': String(layer.speed ?? 0)
        } as any
        return (
          <div key={i} {...commonProps}>
            {type === 'video'
              ? <video src={layer.src} autoPlay muted loop playsInline preload="auto" />
              : <img src={layer.src} alt="" loading="eager" decoding="async" />}
          </div>
        )
      })}
      <div className="parallax-children">{children}</div>
    </div>
  )
}

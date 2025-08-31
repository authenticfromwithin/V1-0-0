import React from 'react'
type Props = { children: React.ReactNode }
export default function NoUploadZone({ children }: Props){
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(()=>{
    const el = ref.current; if (!el) return
    const stop = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); }
    el.addEventListener('dragover', stop)
    el.addEventListener('drop', stop)
    return ()=>{ el.removeEventListener('dragover', stop); el.removeEventListener('drop', stop); }
  },[])
  return <div ref={ref}>{children}</div>
}





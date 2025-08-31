import React from 'react';

export default function MoodWheel({ value, onChange }:{ value:number; onChange:(v:number)=>void }){
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(()=>{
    const el = ref.current; if (!el) return;
    const on = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width/2);
      const y = e.clientY - (r.top + r.height/2);
      const angle = Math.atan2(y, x);
      const v = Math.cos(angle);
      onChange(Math.max(-1, Math.min(1, v)));
    };
    const down = (e: MouseEvent) => { on(e); window.addEventListener('mousemove', on); window.addEventListener('mouseup', up); };
    const up = () => { window.removeEventListener('mousemove', on); window.removeEventListener('mouseup', up); };
    el.addEventListener('mousedown', down);
    return ()=>{ el.removeEventListener('mousedown', down); window.removeEventListener('mousemove', on); window.removeEventListener('mouseup', up); };
  }, [onChange]);

  const pct = (value + 1) / 2;
  return (
    <div ref={ref} role="slider" aria-valuemin={-1} aria-valuemax={1} aria-valuenow={value}
      style={{width:140, height:140, borderRadius:'50%', border:'1px solid var(--afw-border)', position:'relative', userSelect:'none'}}>
      <div style={{position:'absolute', inset:10, borderRadius:'50%', background:'radial-gradient(60% 60% at 50% 50%, rgba(255,190,140,.25), transparent)'}}/>
      <div style={{position:'absolute', inset:0, display:'grid', placeItems:'center', fontSize:12, opacity:.8}}>Mood</div>
      <div style={{position:'absolute', left:`${pct*100}%`, top:'50%', transform:'translate(-50%, -50%)', width:8, height:8, borderRadius:'50%', background:'#fff'}}/>
    </div>
  );
}



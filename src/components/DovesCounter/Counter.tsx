import React from 'react';
import { getPref, setPref } from '@/logic/prefs';

const KEY = 'progress:doves';

export function getDoves(){ return Number(getPref(KEY, 0)); }
export function awardDove(n=1){ const v = Math.max(0, getDoves() + n); setPref(KEY, v); return v; }
export function resetDoves(){ setPref(KEY, 0); }

export default function DovesCounter(){
  const [count, setCount] = React.useState<number>(()=> getDoves());
  React.useEffect(()=>{
    const i = setInterval(()=> setCount(getDoves()), 2000);
    return ()=> clearInterval(i);
  }, []);
  return (
    <div title="Gentle progress" style={{display:'inline-flex', alignItems:'center', gap:6, fontSize:14, opacity:.9}}>
      <span aria-hidden="true">🕊️</span>
      <strong>{count}</strong>
    </div>
  );
}






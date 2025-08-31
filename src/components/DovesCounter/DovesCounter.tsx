import React from 'react';
import { Metrics } from '@/logic/metrics/localMetrics';

const Dove = ({filled}:{filled:boolean}) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{opacity: filled?1:.35}}>
    <path d="M2 12c4 0 6-3 7-6 1 3 3 6 7 6-3 2-5 3-7 8-1-5-4-6-7-8z" fill="currentColor"/>
  </svg>
);

export default function DovesCounter(){
  const [n, setN] = React.useState(0);
  React.useEffect(()=>{
    const id = setInterval(()=>{
      const m = Metrics.get();
      const minutes = m?.minutes || 0;
      setN(Math.max(0, Math.min(12, Math.floor(minutes/10)))); // 1 dove / 10 minutes
    }, 3000);
    return ()=>clearInterval(id);
  },[]);
  return (
    <div aria-label="Journey progress" title={`${n} doves`} style={{display:'flex', gap:4, alignItems:'center', opacity:.9}}>
      {Array.from({length:12}).map((_,i)=> <Dove key={i} filled={i<n}/>)}
    </div>
  );
}




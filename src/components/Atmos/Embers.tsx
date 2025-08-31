import React from 'react';

// SVG-based embers (very subtle). Reduced-motion aware.
export default function Embers(){
  const reduce = React.useMemo(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches,[]);
  if (reduce) return null;
  const dots = Array.from({length:28}, (_,i)=>i);
  return (
    <svg aria-hidden viewBox="0 0 100 56" preserveAspectRatio="none"
      style={{position:'absolute', inset:0, opacity:.25, mixBlendMode:'screen', pointerEvents:'none'}}>
      {dots.map((i)=>{
        const x = (i*13)%100, y = (i*7)%56, r = (i%3===0? .18 : .12);
        const dur = 6 + (i%5);
        return <circle key={i} cx={x} cy={y} r={r}>
          <animate attributeName="cy" values={`${y};${y-8};${y}`} dur={`${dur}s`} repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.2;0.45;0.2" dur={`${dur}s`} repeatCount="indefinite"/>
        </circle>;
      })}
    </svg>
  );
}



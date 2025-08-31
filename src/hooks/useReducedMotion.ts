import { useEffect, useState } from 'react';
export default function useReducedMotion(){
  const [reduced, setReduced] = useState(false);
  useEffect(()=>{
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const set = () => setReduced(mq.matches);
    set(); mq.addEventListener ? mq.addEventListener('change', set) : mq.addListener(set);
    return ()=> { mq.removeEventListener ? mq.removeEventListener('change', set) : mq.removeListener(set); };
  }, []);
  useEffect(()=>{
    const el = document.documentElement;
    if (reduced) el.setAttribute('data-motion', 'reduced'); else el.removeAttribute('data-motion');
  }, [reduced]);
  return reduced;
}





import React,{useEffect,useRef,useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth } from '@/logic/auth/provider';
import '@/../styles/home-safe.css';

type MaybeFn=(()=>void)|null; type MaybeEl=HTMLElement|null;

export default function Home(){
  const navigate=useNavigate();
  const location=useLocation();
  const stay = new URLSearchParams(location.search).has('stay'); // <-- add ?stay to bypass redirect
  const onReadyRef=useRef<MaybeFn|MaybeEl>(null);
  const backRef=useRef<HTMLDivElement|null>(null); const midRef=useRef<HTMLDivElement|null>(null); const frontRef=useRef<HTMLDivElement|null>(null); const fireRef=useRef<HTMLDivElement|null>(null);

  useEffect(()=>{ const root=document.documentElement; const prev=root.getAttribute('data-page'); root.setAttribute('data-page','home'); return ()=>{ if(prev) root.setAttribute('data-page',prev); else root.removeAttribute('data-page'); };},[]);

  // Redirect only if user AND not staying
  useEffect(()=>{ let mounted=true; (async()=>{ try{ const user=await auth.current?.(); if(mounted && user && !stay) navigate('/quotes'); }catch{} })(); return ()=>{ mounted=false; }; },[navigate, stay]);

  useEffect(()=>{ const root=document.body; if(!root) return; const layers=[{el:backRef.current,speed:.02},{el:midRef.current,speed:.04},{el:frontRef.current,speed:.07},{el:fireRef.current,speed:0}].filter(l=>l.el) as {el:HTMLElement;speed:number;}[]; let raf:number|null=null; const tgt={x:0,y:0}, cur={x:0,y:0};
    const onPointer=(e:PointerEvent)=>{ const r=root.getBoundingClientRect(); const cx=r.left+r.width/2, cy=r.top+r.height/2; tgt.x=Math.max(-1,Math.min(1,(e.clientX-cx)/(r.width/2))); tgt.y=Math.max(-1,Math.min(1,(e.clientY-cy)/(r.height/2))); };
    const animate=()=>{ cur.x+=(tgt.x-cur.x)*.06; cur.y+=(tgt.y-cur.y)*.06; layers.forEach(({el,speed})=>{ const tx=(cur.x*10*speed).toFixed(2); const ty=(cur.y*10*speed).toFixed(2); el.style.transform=`translate3d(${tx}px, ${ty}px, 0)`; }); raf=requestAnimationFrame(animate); };
    root.addEventListener('pointermove', onPointer, { passive: true }); raf=requestAnimationFrame(animate);
    return ()=>{ root.removeEventListener('pointermove', onPointer); if(raf!=null) cancelAnimationFrame(raf); };
  },[]);

  const [AuthPanel,setAuthPanel]=useState<React.ComponentType|null>(null);
  useEffect(()=>{ import('@/components/Auth/AuthPanel').then(m=>setAuthPanel(()=> (m.default||(m as any)))).catch(()=>setAuthPanel(null));},[]);

  return (<div className='home-safe-root'>
    <div ref={backRef} className='home-safe-layer home-safe-back'/>
    <div ref={fireRef} className='home-safe-fire'/>
    <div ref={midRef} className='home-safe-layer home-safe-mid'/>
    <div ref={frontRef} className='home-safe-layer home-safe-front'/>
    <div className='parallax-foreground flex items-center justify-center min-h-screen'>
      {AuthPanel ? <AuthPanel /> : null}
      <div id='auth-root' ref={onReadyRef as any} />
    </div>
  </div>);
}
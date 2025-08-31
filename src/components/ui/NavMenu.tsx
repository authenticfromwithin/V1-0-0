import React from 'react';
import { NavLink } from 'react-router-dom';

export default function NavMenu(){
  const [open, setOpen] = React.useState(false);
  React.useEffect(()=>{
    const close = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (!t.closest('.afw-menu')) setOpen(false);
    };
    document.addEventListener('click', close);
    return ()=> document.removeEventListener('click', close);
  }, []);
  const Item = ({to, children}:{to:string, children:React.ReactNode}) => <NavLink to={to} onClick={()=>setOpen(false)} className="menu-item">{children}</NavLink>;
  return (
    <div className="afw-menu" style={{position:'relative'}}>
      <button onClick={()=>setOpen(!open)} aria-expanded={open} aria-haspopup="menu" style={{padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}>☰</button>
      {open && (
        <div role="menu" style={{position:'absolute', right:0, top:'calc(100% + 8px)', minWidth:200, border:'1px solid var(--afw-border)', borderRadius:12, background:'rgba(6,8,11,.95)', backdropFilter:'blur(8px)', padding:8, display:'grid', gap:6}}>
          <Item to="/">Home</Item>
          <Item to="/healing">Healing</Item>
          <Item to="/journey">My Journey</Item>
          <Item to="/devotionals">Devotionals</Item>
          <Item to="/quotes">Quotes</Item>
          <Item to="/guide">Guide</Item>
          <Item to="/qa">QA</Item>
        </div>
      )}
    </div>
  );
}





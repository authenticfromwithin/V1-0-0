import React,{useEffect,useRef,useState} from "react";
type Item={id:string;label:string;href:string;onClick?:()=>void};
export default function Dropdown({items,label="Modules"}:{items:Item[];label?:string}){
  const [open,setOpen]=useState(false); const ref=useRef<HTMLDivElement|null>(null);
  useEffect(()=>{ const onDoc=(e:MouseEvent)=>{ if(!ref.current?.contains(e.target as any)) setOpen(false) }; document.addEventListener("mousedown",onDoc); return ()=>document.removeEventListener("mousedown",onDoc); },[]);
  const go=(it:Item)=>(ev:React.MouseEvent)=>{ ev.preventDefault(); setOpen(false); if(it.onClick) it.onClick(); else location.hash=it.href };
  return (<div className="dd" ref={ref}><button className="btn" aria-haspopup="menu" aria-expanded={open} onClick={()=>setOpen(v=>!v)}>{label} ▾</button>{open&&(<div className="dd-menu" role="menu">{items.map(it=>(<a key={it.id} role="menuitem" className="dd-item" href={it.href} onClick={go(it)}>{it.label}</a>))}</div>)}</div>);
}

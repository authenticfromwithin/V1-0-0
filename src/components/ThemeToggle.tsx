import React,{useEffect,useState} from "react";
const THEMES=["forest","ocean","mountain","autumn","snow"] as const;
type Theme=typeof THEMES[number];
export function ThemeToggle(){
  const [t,setT]=useState<Theme>(()=> (localStorage.getItem("afw:theme") as Theme) || "forest");
  useEffect(()=>{
    document.documentElement.setAttribute("data-theme", t);
    document.body.setAttribute("data-theme", t);
    localStorage.setItem("afw:theme", t);
  },[t]);
  return (<select className="btn select" value={t} onChange={e=>setT(e.target.value as Theme)} aria-label="Theme">{THEMES.map(x=><option key={x} value={x}>{x}</option>)}</select>);
}

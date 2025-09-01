import React,{useEffect,useState} from "react";
type Link={label:string;href:string;platform?:string};
export default function Donations(){ const [links,setLinks]=useState<Link[]>([]);
  useEffect(()=>{ fetch("/content/donate.links.json").then(r=>r.json()).then(d=> setLinks(d.links||[])).catch(()=> setLinks([])) },[]);
  return (<main className="copy"><div><h1 className="title">Donations</h1><p className="subtitle">Lanterns lit by your support.</p>
    <div className="glass" style={{maxWidth:720,margin:"0 auto"}}>{links.length? links.map((l,i)=>(<a key={i} className="btn" href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)) : <div className="author">No links yet.</div>}</div>
  </div></main>); }

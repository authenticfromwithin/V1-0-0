import React,{useEffect,useState} from "react";
export default function Journal(){
  const [txt,setTxt]=useState(localStorage.getItem("afw:journal")||"");
  useEffect(()=>{ try{ localStorage.setItem("afw:journal",txt) }catch{} },[txt]);
  return (<main className="copy"><div className="journal glass">
    <h2>Journal (local-only)</h2>
    <p>Your writing never leaves your device.</p>
    <textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Breathe. Begin with one honest line…"/>
  </div></main>);
}

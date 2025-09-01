import React,{useEffect,useMemo,useState} from "react";
type Q={id:string;text:string;author?:string};
export default function Quotes(){
  const [qs,setQs]=useState<Q[]>([]);
  const [i,setI]=useState(0);
  useEffect(()=>{
    fetch("/content/quotes.manifest.json").then(r=>r.json()).then(d=>{ const items=(d?.categories?.[0]?.items||[]) as Q[]; setQs(items.length?items:[{id:"q1",text:"Begin with one honest breath.",author:"Rumique Davids"}]); }).catch(()=> setQs([{id:"q1",text:"Begin with one honest breath.",author:"Rumique Davids"}]));
  },[]);
  const cur = qs[i] || null;
  const next = ()=> setI(v => (v+1) % Math.max(1,qs.length));
  const prev = ()=> setI(v => (v-1+Math.max(1,qs.length)) % Math.max(1,qs.length));
  return (<main className="copy">
    <div className="quotes-hero glass">
      <div className="q-text">“{cur?.text||""}”</div>
      {cur?.author ? <div className="q-author">— {cur.author}</div> : null}
      <div className="q-actions"><button className="btn ghost" onClick={prev}>‹ Prev</button><button className="btn" onClick={next}>Next ›</button></div>
    </div>
    <div className="quote-list glass">
      {qs.map((q,idx)=>(<div key={q.id} className={"quote-item"+(idx===i?" active":"")}>“{q.text}” {q.author? <span className="author">— {q.author}</span>:null}</div>))}
    </div>
  </main>);
}

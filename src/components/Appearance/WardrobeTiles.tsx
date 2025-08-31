import React from 'react';

type Grade = 'neutral'|'warm'|'cool';

export default function WardrobeTiles({ value, onChange }:{ value: Grade; onChange:(g:Grade)=>void }){
  const Tile = ({g, label, style}:{g:Grade; label:string; style:any}) => (
    <button onClick={()=>onChange(g)} aria-pressed={value===g}
      style={{padding:6, borderRadius:10, border: value===g? '1px solid #fff':'1px solid rgba(255,255,255,.2)', background:'transparent'}}>
      <div style={{width:88, height:56, borderRadius:8, ...style}}/>
      <div style={{marginTop:4, fontSize:12, opacity:.85, textAlign:'center'}}>{label}</div>
    </button>
  );
  return (
    <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
      <Tile g="neutral" label="Neutral" style={{background:'linear-gradient(135deg, rgba(255,255,255,.08), rgba(255,255,255,.02))'}}/>
      <Tile g="warm" label="Warm" style={{background:'linear-gradient(135deg, rgba(255,200,150,.28), rgba(255,200,150,.06))'}}/>
      <Tile g="cool" label="Cool" style={{background:'linear-gradient(135deg, rgba(150,200,255,.28), rgba(150,200,255,.06))'}}/>
    </div>
  );
}





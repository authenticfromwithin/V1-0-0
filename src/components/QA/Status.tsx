import React from 'react';
export default function StatusRow({label, ok, detail}:{label:string; ok:boolean; detail?:string}){
  return (
    <div style={{display:'flex', justifyContent:'space-between', gap:12, alignItems:'center',
      border:'1px solid rgba(255,255,255,.12)', padding:'8px 10px', borderRadius:10}}>
      <span style={{opacity:.9}}>{label}</span>
      <span aria-label={ok? 'ok':'fail'}>{ok? '✅' : '⚠️'}</span>
    </div>
  );
}



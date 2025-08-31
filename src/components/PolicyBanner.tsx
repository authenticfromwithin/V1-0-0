import React from 'react'

export default function PolicyBanner(){
  const [seen, setSeen] = React.useState(() => localStorage.getItem('afw:policySeen') === '1')
  if (seen) return null
  return (
    <aside style={{position:'sticky', top:0, zIndex:50, padding:'8px 12px', background:'rgba(15,17,22,.6)', backdropFilter:'blur(8px)', borderBottom:'1px solid rgba(255,255,255,.08)'}}>
      <p style={{margin:0, fontSize:14, opacity:.9}}>
        Your journal is <strong>local‑only</strong>. Copy/paste, drag, and right‑click are disabled in protected spaces.
      </p>
      <button onClick={()=>{localStorage.setItem('afw:policySeen','1'); setSeen(true);}} style={{marginTop:6, padding:'4px 8px', borderRadius:8, border:'1px solid rgba(255,255,255,.15)', background:'transparent', color:'inherit'}}>Got it</button>
    </aside>
  )
}



import React from 'react';
import type { AppearanceVariant } from 'types/profile';
import { getActiveProfileData, setAppearance } from 'logic/auth/store';

export default function VariantTiles({ kind }:{ kind:'healing'|'journey' }){
  const prof = getActiveProfileData();
  const current = (prof?.appearance as any)?.[kind] as AppearanceVariant || 'A';
  const [sel, setSel] = React.useState<AppearanceVariant>(current);

  const apply = async (v: AppearanceVariant) => {
    setSel(v);
    try{ await setAppearance(kind, v); }catch{ /* ignore if locked */ }
  };

  const Tile = ({v, label}:{v:AppearanceVariant; label:string}) => (
    <button onClick={()=>apply(v)} aria-pressed={sel===v}
      style={{padding:6, borderRadius:10, border: sel===v? '1px solid #fff':'1px solid rgba(255,255,255,.2)', background:'transparent'}}>
      <div style={{width:88, height:56, borderRadius:8, background:`linear-gradient(135deg, rgba(255,255,255,.12), rgba(255,255,255,.04))`, display:'grid', placeItems:'center', fontSize:18}}>{label}</div>
      <div style={{marginTop:4, fontSize:12, opacity:.85, textAlign:'center'}}>Variant {v}</div>
    </button>
  );

  return (
    <div>
      <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
        <Tile v="A" label="A" />
        <Tile v="B" label="B" />
        {/* Optionally extend to C later */}
      </div>
      <p style={{opacity:.75, fontSize:12, marginTop:6}}>Applies immediately on this device; videos prefer the chosen variant if available.</p>
    </div>
  );
}

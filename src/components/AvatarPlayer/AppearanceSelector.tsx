import React from 'react';
import type { Appearance, Archetype, Variant } from '@/logic/avatars/appearance';
import { useAppearance } from '@/logic/avatars/appearance';

export default function AppearanceSelector({ kind, syncBoth=false }:{ kind:'healing'|'journey'; syncBoth?: boolean }){
  const [ap, setAp] = useAppearance(kind);

  const set = (next: Partial<Appearance>) => {
    const merged = { ...ap, ...next };
    setAp(merged);
    if (syncBoth){
      try {
        const other = kind === 'healing' ? 'journey' : 'healing';
        localStorage.setItem(`afw:appearance:${other}`, JSON.stringify(merged));
      } catch {}
    }
  };

  const onArch = (e: React.ChangeEvent<HTMLSelectElement>) => set({ archetype: e.target.value as Archetype });
  const onVar  = (e: React.ChangeEvent<HTMLSelectElement>) => set({ variant: e.target.value as Variant });

  return (
    <div style={{display:'flex', gap:8, alignItems:'center', flexWrap:'wrap'}}>
      <label style={{display:'flex', gap:6, alignItems:'center'}}>
        <span style={{opacity:.8, width:72}}>Archetype</span>
        <select value={ap.archetype} onChange={onArch} style={{padding:'6px 8px', borderRadius:8, background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.2)'}}>
          <option value=''>Default</option>
          <option value='archetype-a'>A</option>
          <option value='archetype-b'>B</option>
        </select>
      </label>
      <label style={{display:'flex', gap:6, alignItems:'center'}}>
        <span style={{opacity:.8, width:72}}>Variant</span>
        <select value={ap.variant} onChange={onVar} style={{padding:'6px 8px', borderRadius:8, background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.2)'}}>
          <option value=''>Default</option>
          <option value='variant-01'>v01</option>
          <option value='variant-02'>v02</option>
        </select>
      </label>
    </div>
  );
}




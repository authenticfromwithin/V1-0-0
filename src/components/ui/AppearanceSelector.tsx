import React from 'react';
import { getVariant, setVariant } from 'logic/prefs';

type Props = { rig: 'healing'|'journey'; options?: string[] };

export default function AppearanceSelector({ rig, options = ['variant-01','variant-02'] }: Props){
  const [val, setVal] = React.useState<string>(() => getVariant(rig));

  React.useEffect(()=>{
    setVariant(rig, val);
    // expose as data attribute for theme/style hooks if needed
    document.documentElement.setAttribute(`data-${rig}-variant`, val);
  }, [rig, val]);

  return (
    <label style={{display:'inline-flex', alignItems:'center', gap:8}}>
      <span style={{opacity:.85, minWidth:80}}>Appearance</span>
      <select value={val} onChange={e=>setVal(e.target.value)} style={{padding:'6px 10px', borderRadius:8, border:'1px solid var(--afw-border)', background:'transparent', color:'inherit'}}>
        {options.map(o => <option key={o} value={o}>{o.replace('variant-','Set ')}</option>)}
      </select>
    </label>
  );
}

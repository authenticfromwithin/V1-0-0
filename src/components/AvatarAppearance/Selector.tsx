import React from 'react';
import { getProfile, setProfile, type AvatarProfile, type Archetype, type Variant } from 'logic/avatars/profile';

const archetypes: { value: Archetype; label: string }[] = [
  { value: 'archetype-a', label: 'Masculine (A)' },
  { value: 'archetype-b', label: 'Feminine (B)' },
];

const variants: { value: Variant; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'variant-01', label: 'Variant 01' },
  { value: 'variant-02', label: 'Variant 02' },
];

export default function AppearanceSelector(){
  const [profile, setLocal] = React.useState<AvatarProfile>(() => getProfile());

  const update = (next: Partial<AvatarProfile>) => {
    const p = { ...profile, ...next };
    setLocal(p);
    setProfile(p);
  };

  return (
    <section style={{border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:12}}>
      <strong>Appearance</strong>
      <div style={{height:8}}/>
      <div style={{display:'flex', gap:10, flexWrap:'wrap'}}>
        {archetypes.map(a => (
          <label key={a.value} style={{display:'flex', alignItems:'center', gap:6, padding:'4px 8px', borderRadius:8, border:'1px solid rgba(255,255,255,.12)', background: profile.archetype===a.value?'rgba(255,255,255,.06)':'transparent'}}>
            <input type="radio" name="archetype" checked={profile.archetype===a.value} onChange={()=>update({ archetype: a.value })}/>
            <span>{a.label}</span>
          </label>
        ))}
      </div>
      <div style={{height:10}}/>
      <label style={{display:'flex', alignItems:'center', gap:8}}>
        <span style={{opacity:.85, width:90}}>Variant</span>
        <select value={profile.variant} onChange={(e)=>update({ variant: e.currentTarget.value as any })}
          style={{padding:'6px 10px', borderRadius:8, background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.15)'}}>
          {variants.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
        </select>
      </label>
      <p style={{marginTop:8, opacity:.75, fontSize:12}}>Choice is saved on this device only.</p>
    </section>
  );
}

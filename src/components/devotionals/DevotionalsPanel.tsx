import React from 'react';
import Button from '../ui/Button';
import { loadDevotionalsManifest, loadDevotionalsForMonth, todayISO } from '../../logic/content/loader';
import DevotionalCard from './DevotionalCard';
import type { DevotionalsManifest, Devotional } from '../../types/content';

function ymStr(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
}

export default function DevotionalsPanel() {
  const [manifest, setManifest] = React.useState<DevotionalsManifest|null>(null);
  const [month, setMonth] = React.useState<string>(ymStr(new Date()));
  const [list, setList] = React.useState<Devotional[]>([]);
  const [today, setToday] = React.useState<string>(todayISO());

  React.useEffect(() => {
    (async () => {
      const man = await loadDevotionalsManifest();
      setManifest(man);
    })().catch(console.error);
  }, []);

  React.useEffect(() => {
    if (!manifest) return;
    loadDevotionalsForMonth(month, manifest).then(setList).catch(console.error);
  }, [manifest, month]);

  return (
    <div style={{display:'grid', gap:12}}>
      <div className="afw-card" style={{padding:12, display:'flex', gap:8, alignItems:'center'}}>
        <strong>Devotionals</strong>
        <div style={{marginLeft:'auto', display:'flex', gap:6}}>
          <Button small onClick={() => setMonth(ymStr(new Date()))}>This month</Button>
        </div>
      </div>
      <div style={{display:'grid', gap:12}}>
        {list.length === 0 && <div className="afw-card" style={{padding:12}}>No devotionals for {month} yet.</div>}
        {list.map(d => (
          <DevotionalCard key={d.id} {...d} />
        ))}
      </div>
    </div>
  );
}
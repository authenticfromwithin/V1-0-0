import React from 'react';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import { loadQuotesManifest, loadQuotesForCategory, markQuoteWorked, isQuoteWorked, setTheme, getTheme } from '../../logic/content/loader';
import type { QuoteItem, QuotesManifest } from '../../types/content';

const THEMES = ['forest','ocean','mountain','autumn','snow'] as const;

export default function QuotesPanel() {
  const [manifest, setManifest] = React.useState<QuotesManifest|null>(null);
  const [category, setCategory] = React.useState<string>('identity');
  const [list, setList] = React.useState<QuoteItem[]>([]);
  const [current, setCurrent] = React.useState<QuoteItem|null>(null);
  const [theme, setThemeState] = React.useState<string>(getTheme());

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    setTheme(theme);
  }, [theme]);

  React.useEffect(() => {
    (async () => {
      const man = await loadQuotesManifest();
      setManifest(man);
      const firstCat = man.categories.includes('identity') ? 'identity' : man.categories[0];
      setCategory(firstCat);
    })().catch(console.error);
  }, []);

  React.useEffect(() => {
    if (!manifest) return;
    loadQuotesForCategory(category, manifest).then(qs => {
      setList(qs);
      setCurrent(qs[Math.floor(Math.random()*qs.length)] || null);
    }).catch(console.error);
  }, [category, manifest]);

  function nextRandom() {
    if (!list.length) return;
    setCurrent(list[Math.floor(Math.random()*list.length)]);
  }
  function markWorked() {
    if (!current) return;
    markQuoteWorked(current.id);
    // Force rerender
    setCurrent({...current});
  }

  return (
    <div style={{display:'grid', gridTemplateColumns:'260px 1fr', gap:16}}>
      <aside style={{display:'grid', gap:12, alignContent:'start'}}>
        <ThemeToggle value={theme} onChange={setThemeState} options={[...THEMES]} />
        <div className="afw-card" style={{padding:12}}>
          <div style={{opacity:.8, marginBottom:8}}>Categories</div>
          <div style={{display:'grid', gap:8}}>
            {(manifest?.categories || []).map(cat => (
              <button key={cat} onClick={()=>setCategory(cat)}
                className={`px-3 py-1 ${category===cat ? 'border border-white/30' : 'border border-white/10'}`}
                style={{ background: category===cat ? 'rgba(255,255,255,0.08)' : 'transparent', borderRadius: 10, textAlign:'left' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="afw-card" style={{padding:12}}>
          <div style={{opacity:.8, marginBottom:8}}>Progress</div>
          <div style={{fontSize:13}}>
            Worked: {list.filter(q => isQuoteWorked(q.id)).length} / {list.length}
          </div>
        </div>
      </aside>

      <main style={{display:'grid', gap:12}}>
        <div style={{display:'flex', gap:8}}>
          <Button onClick={nextRandom}>Show another</Button>
          <Button variant="ghost" onClick={()=>setCategory(category)}>Refresh</Button>
        </div>
        {current ? (
          <div className="afw-card" style={{padding:16}}>
            <div style={{fontSize:12, opacity:.7, marginBottom:6}}>Category: {category}</div>
            <div style={{display:'grid', gap:12}}>
              <div style={{fontSize:22, lineHeight:1.5}}>{current.text}</div>
              {current.context && <div style={{opacity:.9}}>Context: {current.context}</div>}
              {current.reflectionPrompt && <div>Reflection: {current.reflectionPrompt}</div>}
              <label style={{display:'flex', gap:8, alignItems:'center', marginTop:10}}>
                <input type="checkbox" checked={isQuoteWorked(current.id)} onChange={markWorked} />
                <span>{isQuoteWorked(current.id) ? 'Worked through' : 'Mark as worked through'}</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="afw-card" style={{padding:16}}>Loading quotes…</div>
        )}
      </main>
    </div>
  );
}
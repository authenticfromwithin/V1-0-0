
import React from 'react';

const KEY = 'afw:theme';
type ThemeName = '' | 'ocean' | 'mountain' | 'autumn' | 'snow'; // '' = forest (default)

function applyTheme(t: ThemeName){
  const el = document.documentElement;
  if (!t) el.removeAttribute('data-theme');
  else el.setAttribute('data-theme', t);
  try { localStorage.setItem(KEY, t); } catch {}
  window.dispatchEvent(new CustomEvent('afw:theme', { detail: t }));
}

export default function ThemeToggle(){
  const [theme, setTheme] = React.useState<ThemeName>(() => (localStorage.getItem(KEY) as ThemeName) || '');

  React.useEffect(()=>{ applyTheme(theme); }, []);
  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = (e.target.value as ThemeName);
    setTheme(val); applyTheme(val);
  };

  return (
    <label style={{display:'inline-flex', alignItems:'center', gap:8}}>
      <span style={{opacity:.85}}>Theme</span>
      <select value={theme} onChange={onChange}
        aria-label="Select visual theme"
        style={{background:'transparent', color:'inherit', border:'1px solid rgba(255,255,255,.25)', borderRadius:10, padding:'6px 10px'}}>
        <option value="">Forest (default)</option>
        <option value="ocean">Ocean</option>
        <option value="mountain">Mountain</option>
        <option value="autumn">Autumn</option>
        <option value="snow">Snow</option>
      </select>
    </label>
  );
}

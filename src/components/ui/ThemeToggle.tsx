import React from 'react';
type Props = { value: string; onChange: (v:string)=>void; options: string[] };
export default function ThemeToggle({ value, onChange, options }: Props) {
  return (
    <div className="afw-card" style={{display:'flex', gap:8, padding:'8px 10px'}}>
      {options.map(opt => (
        <button key={opt}
          onClick={()=>onChange(opt)}
          className={`px-3 py-1 ${value===opt ? 'border border-white/30' : 'border border-white/10'}`}
          style={{ background: value===opt ? 'rgba(255,255,255,0.08)' : 'transparent', borderRadius: 10 }}>
          {opt}
        </button>
      ))}
    </div>
  );
}
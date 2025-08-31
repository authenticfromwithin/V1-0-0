import React from 'react'
import { loadPrefs, savePrefs, setTheme } from '@/logic/prefs/prefs'
import { exportLocal } from '@/logic/analytics/analytics'
type Props = { open: boolean; onClose(): void }
export default function SettingsPanel({ open, onClose }: Props) {
  const [reduceMotion, setRM] = React.useState(false)
  const [audioMaster, setAM] = React.useState(1)
  const [theme, setThemeVal] = React.useState<'forest'|'ocean'|'mountain'|'autumn'|'snow'|'none'>('none')
  React.useEffect(() => { if (!open) return; const p = loadPrefs(); setRM(!!p.reduceMotion); setAM(p.audioMaster ?? 1); setThemeVal((p.theme as any) || 'none') }, [open])
  function save() { savePrefs({ reduceMotion, audioMaster, theme: theme==='none'? undefined : theme }); if (theme && theme !== 'none') setTheme(theme as any); onClose() }
  async function exportNDJSON() { const blob = await exportLocal(); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'afw-analytics.ndjson'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url) }
  if (!open) return null
  return (<div style={wrap} role="dialog" aria-modal="true" aria-label="Settings"><div style={card}><div style={rowTop}><strong>Settings</strong><button onClick={onClose} style={btn}>Close</button></div><div style={row}><label><input type="checkbox" checked={reduceMotion} onChange={e=>setRM(e.target.checked)} /> Reduce motion</label></div><div style={row}><label>Audio master</label><input type="range" min={0} max={1} step={0.01} value={audioMaster} onChange={e=>setAM(parseFloat(e.target.value))} /></div><div style={row}><label>Theme</label><select value={theme} onChange={e=>setThemeVal(e.target.value as any)}><option value="none">System/Current</option><option value="forest">Night Forest</option><option value="ocean">Ocean</option><option value="mountain">Mountain</option><option value="autumn">Autumn</option><option value="snow">Snow</option></select></div><div style={row}><button onClick={save} style={btn}>Save</button><button onClick={exportNDJSON} style={btn}>Export analytics (NDJSON)</button></div><div style={{fontSize:12, opacity:.7, marginTop:8}}>Journals are never exported here — only anonymous telemetry queued locally.</div></div></div>) }
const wrap: React.CSSProperties = { position:'fixed', inset:0, display:'grid', placeItems:'center', background:'rgba(0,0,0,0.55)', zIndex:9999 }
const card: React.CSSProperties = { width:'min(520px,92vw)', padding:16, borderRadius:14, background:'rgba(10,10,10,0.7)', border:'1px solid rgba(255,255,255,0.12)', color:'white' }
const rowTop: React.CSSProperties = { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }
const row: React.CSSProperties = { display:'grid', gap:6, margin:'8px 0' }
const btn: React.CSSProperties = { padding:'8px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'inherit', cursor:'pointer' }




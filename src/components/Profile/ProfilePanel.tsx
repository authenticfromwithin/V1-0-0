import React from 'react'
import { getMyProfile, upsertMyProfile, type PublicProfile } from '@/logic/profile/profiles'
import { setTheme } from '@/logic/prefs/prefs'
type Props = { open: boolean; onClose(): void }
export default function ProfilePanel({ open, onClose }: Props) {
  const [displayName, setDisplayName] = React.useState('')
  const [avatar, setAvatar] = React.useState<'seeker'|'pilgrim'|'watcher'|'none'>('none')
  const [theme, setThemeLocal] = React.useState<'forest'|'ocean'|'mountain'|'autumn'|'snow'|'none'>('none')
  const [saving, setSaving] = React.useState(false); const [error, setError] = React.useState<string | null>(null)
  React.useEffect(() => { if (open) load() }, [open])
  async function load() { try { const p = await getMyProfile(); setDisplayName(p?.display_name || ''); setAvatar((p?.avatar_archetype as any) || 'none'); setThemeLocal((p?.theme as any) || 'none') } catch (e: any) { setError(e?.message || 'Failed to load profile') } }
  async function save() {
    try {
      setSaving(true); setError(null)
      await upsertMyProfile({ display_name: displayName || null, avatar_archetype: avatar==='none'? null : avatar, theme: theme==='none'? null : theme })
      if (theme && theme !== 'none') setTheme(theme as any)
      onClose()
    } catch (e: any) { setError(e?.message || 'Failed to save') } finally { setSaving(false) }
  }
  if (!open) return null
  return (
    <div style={wrap} role="dialog" aria-modal="true" aria-label="Profile">
      <div style={card}>
        <div style={rowTop}><strong>Profile</strong><button onClick={onClose} style={btn}>Close</button></div>
        {error && <div style={bad}>{error}</div>}
        <div style={row}><label style={lbl}>Display name</label><input value={displayName} onChange={e=>setDisplayName(e.target.value)} style={input} /></div>
        <div style={row}><label style={lbl}>Avatar archetype</label><select value={avatar} onChange={e=>setAvatar(e.target.value as any)} style={input}><option value="none">—</option><option value="seeker">Seeker</option><option value="pilgrim">Pilgrim</option><option value="watcher">Watcher</option></select></div>
        <div style={row}><label style={lbl}>Preferred theme</label><select value={theme} onChange={e=>setThemeLocal(e.target.value as any)} style={input}><option value="none">—</option><option value="forest">Night Forest</option><option value="ocean">Ocean</option><option value="mountain">Mountain</option><option value="autumn">Autumn</option><option value="snow">Snow</option></select></div>
        <div style={row}><button onClick={save} style={btn} disabled={saving}>{saving?'Saving…':'Save'}</button></div>
      </div>
    </div>
  )
}
const wrap: React.CSSProperties = { position:'fixed', inset:0, display:'grid', placeItems:'center', background:'rgba(0,0,0,0.55)', zIndex:9999 }
const card: React.CSSProperties = { width:'min(520px,92vw)', padding:16, borderRadius:14, background:'rgba(10,10,10,0.7)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(8px)', color:'white' }
const rowTop: React.CSSProperties = { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }
const row: React.CSSProperties = { display:'grid', gap:6, margin:'8px 0' }
const lbl: React.CSSProperties = { fontSize:12, opacity:.85 }
const input: React.CSSProperties = { padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'inherit' }
const btn: React.CSSProperties = { padding:'8px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'inherit', cursor:'pointer' }
const bad: React.CSSProperties = { color:'#ffb4b4', fontSize:12, marginBottom:8 }






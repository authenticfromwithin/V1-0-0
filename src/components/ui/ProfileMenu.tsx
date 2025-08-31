import React from 'react'
import type { User } from '@/logic/auth/auth'
type Props = { user: User; onSignOut(): void; onOpenProfile(): void; onOpenSettings(): void; onOpenSupport(): void; onOpenFeedback(): void; onOpenNotifications(): void }
export default function ProfileMenu({ user, onSignOut, onOpenProfile, onOpenSettings, onOpenSupport, onOpenFeedback, onOpenNotifications }: Props) {
  const [open, setOpen] = React.useState(false)
  React.useEffect(() => { const fn = (e: MouseEvent) => { if (!(e.target as HTMLElement).closest('#afw-profile-menu')) setOpen(false) }; document.addEventListener('click', fn); return () => document.removeEventListener('click', fn) }, [])
  return (
    <div id="afw-profile-menu" style={{ position:'relative' }}>
      <button onClick={()=>setOpen(v=>!v)} style={chip}>{user.email}</button>
      {open && (
        <div style={menu} role="menu">
          <button style={item} onClick={onOpenNotifications}>Notifications</button>
          <button style={item} onClick={onOpenFeedback}>Feedback</button>
          <button style={item} onClick={onOpenSupport}>Technical Support</button>
          <div style={sep} />
          <button style={item} onClick={onOpenProfile}>Profile</button>
          <button style={item} onClick={onOpenSettings}>Settings</button>
          <div style={sep} />
          <button style={{...item, color:'#ffb4b4'}} onClick={onSignOut}>Sign out</button>
        </div>
      )}
    </div>
  )
}
const chip: React.CSSProperties = { fontSize:12, opacity:.9, padding:'6px 10px', border:'1px solid rgba(255,255,255,0.18)', borderRadius:999, background:'rgba(255,255,255,0.06)', color:'inherit', cursor:'pointer' }
const menu: React.CSSProperties = { position:'absolute', right:0, top:'calc(100% + 8px)', width:260, background:'rgba(10,10,10,0.92)', border:'1px solid rgba(255,255,255,0.16)', borderRadius:12, padding:6, display:'grid', gap:6, zIndex:9999 }
const item: React.CSSProperties = { textAlign:'left', padding:'9px 10px', border:'1px solid rgba(255,255,255,0.12)', borderRadius:8, background:'rgba(255,255,255,0.06)', color:'inherit', cursor:'pointer' }
const sep: React.CSSProperties = { height:1, background:'rgba(255,255,255,0.1)', margin:'4px 6px' }






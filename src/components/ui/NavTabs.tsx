import React from 'react'
const TABS = [
  { href: '/healing', label: 'Healing' },
  { href: '/journey', label: 'My Journey' },
  { href: '/devotionals', label: 'Devotionals' },
  { href: '/quotes', label: 'Quotes' },
]
export default function NavTabs() {
  const [path, setPath] = React.useState<string>(typeof window !== 'undefined' ? window.location.pathname : '/')
  React.useEffect(() => {
    const fn = () => setPath(window.location.pathname)
    window.addEventListener('popstate', fn)
    return () => window.removeEventListener('popstate', fn)
  }, [])
  return (
    <nav aria-label="Primary" style={wrap}>
      {TABS.map(t => {
        const active = path.startsWith(t.href)
        return <a key={t.href} href={t.href} style={{...tab, ...(active?tabActive:{})}}>{t.label}</a>
      })}
    </nav>
  )
}
const wrap: React.CSSProperties = { display:'flex', gap:10, alignItems:'center', padding:'6px 8px', background:'rgba(255,255,255,0.04)', borderRadius:999, border:'1px solid rgba(255,255,255,0.12)' }
const tab: React.CSSProperties = { padding:'6px 10px', borderRadius:999, textDecoration:'none', color:'inherit', opacity:.9, border:'1px solid transparent' }
const tabActive: React.CSSProperties = { background:'rgba(255,255,255,0.08)', borderColor:'rgba(255,255,255,0.14)' }

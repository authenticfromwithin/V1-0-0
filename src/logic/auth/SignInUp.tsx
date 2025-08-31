import React, { useEffect, useMemo, useState } from 'react'
import { LocalAuth } from '@/logic/auth/localAuth'
import { SupabaseAuth } from '@/logic/auth/supabaseAuth'
import { hasSupabaseEnv, type User, type AuthProvider } from '@/logic/auth/auth'
import { saveEncryptedProfile, loadEncryptedProfile } from '@/logic/auth/secureProfile'

type Mode = 'signin' | 'signup'
type Props = { open: boolean; onClose(): void; onAuth(u: User | null): void }

const SignInUpModal: React.FC<Props> = ({ open, onClose, onAuth }) => {
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passphrase, setPassphrase] = useState('') // encryption key
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const provider: AuthProvider = useMemo(() => {
    return hasSupabaseEnv() ? new SupabaseAuth() : new LocalAuth()
  }, [])

  useEffect(() => {
    if (!open) { setEmail(''); setPassword(''); setPassphrase(''); setError(null) }
  }, [open])

  async function afterAuth(u: User) {
    try {
      if (!hasSupabaseEnv()) return // no cloud storage without Supabase
      if (mode === 'signup') {
        // Require passphrase to create encrypted profile
        if (!passphrase || passphrase.length < 8) throw new Error('Passphrase must be at least 8 characters')
        await saveEncryptedProfile(u.id, passphrase, {
          email: u.email,
          createdAt: new Date().toISOString(),
          deviceId: navigator.userAgent
        })
      } else if (mode === 'signin' && passphrase) {
        // Optional: unlock profile if user provides passphrase
        await loadEncryptedProfile(u.id, passphrase).catch(() => null)
      }
    } catch (e: any) {
      console.warn('Secure profile step:', e?.message || e)
    }
  }

  async function go() {
    try {
      setLoading(true); setError(null)
      const u = mode === 'signin'
        ? await provider.signIn(email, password)
        : await provider.signUp(email, password)
      await afterAuth(u)
      onAuth(u); onClose()
    } catch (e: any) {
      setError(e?.message || 'Authentication failed')
    } finally { setLoading(false) }
  }

  if (!open) return null
  return (
    <div style={wrap} role="dialog" aria-modal="true" aria-label="Sign in or Sign up">
      <div style={card}>
        <div style={rowTop}>
          <strong>{mode === 'signin' ? 'Sign in' : 'Create account'}</strong>
          <span style={pill}>{hasSupabaseEnv() ? 'Cloud (encrypted profile)' : 'Local'}</span>
        </div>
        <div style={row}>
          <input type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} style={input} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} style={input} />
        </div>

        {mode === 'signup' ? (
          <div style={row}>
            <input
              type="password"
              placeholder="Private passphrase (min 8 chars) — for encrypted profile"
              value={passphrase}
              onChange={e=>setPassphrase(e.target.value)}
              style={{...input, borderColor:'rgba(255,200,120,.4)'}}
            />
          </div>
        ) : (
          <div style={row}>
            <input
              type="password"
              placeholder="Passphrase to unlock encrypted profile (optional)"
              value={passphrase}
              onChange={e=>setPassphrase(e.target.value)}
              style={input}
            />
          </div>
        )}

        {error && <div style={err}>{error}</div>}
        <div style={row}>
          <button onClick={go} style={btn} disabled={loading}>{loading ? 'Please wait…' : (mode==='signin'?'Sign in':'Create account')}</button>
          <button onClick={onClose} style={{...btn, opacity:.7}}>Cancel</button>
        </div>
        <div style={muted}>
          {mode === 'signin' ? (
            <>No account yet? <a onClick={()=>setMode('signup')} style={link}>Create one</a></>
          ) : (
            <>Have an account? <a onClick={()=>setMode('signin')} style={link}>Sign in</a></>
          )}
        </div>
        <div style={micro}>
          {hasSupabaseEnv()
            ? 'Your profile metadata is encrypted client‑side with your passphrase and stored in our DB. We cannot decrypt it.'
            : 'Accounts are local to this device. No data is uploaded.'}
        </div>
      </div>
    </div>
  )
}

const wrap: React.CSSProperties = { position:'fixed', inset:0, display:'grid', placeItems:'center', background:'rgba(0,0,0,0.5)', zIndex:9999 }
const card: React.CSSProperties = { width:'min(560px,92vw)', padding:16, borderRadius:14, background:'rgba(10,10,10,0.65)', border:'1px solid rgba(255,255,255,0.12)', backdropFilter:'blur(8px)' }
const rowTop: React.CSSProperties = { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }
const row: React.CSSProperties = { display:'flex', gap:8, marginBottom:10, flexWrap:'wrap' }
const input: React.CSSProperties = { flex:1, minWidth:240, padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.06)', color:'inherit' }
const btn: React.CSSProperties = { padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.2)', background:'rgba(255,255,255,0.1)', color:'inherit', cursor:'pointer', fontWeight:600 }
const muted: React.CSSProperties = { fontSize:12, opacity:.8 }
const micro: React.CSSProperties = { fontSize:11, opacity:.65, marginTop:6 }
const err: React.CSSProperties = { fontSize:12, color:'#ffb4b4', marginBottom:8 }
const link: React.CSSProperties = { cursor:'pointer', textDecoration:'underline' }
const pill: React.CSSProperties = { fontSize:11, opacity:.85, border:'1px solid rgba(255,255,255,0.18)', padding:'3px 8px', borderRadius:999 }

export default SignInUpModal






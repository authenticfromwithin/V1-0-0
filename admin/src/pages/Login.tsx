import React from 'react'
import { supabase } from '@/lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)
  const nav = useNavigate()

  async function go() {
    try {
      setLoading(true); setError(null)
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      // Ensure this user is an admin
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('admins').select('user_id').eq('user_id', user?.id).maybeSingle()
      if (!data) throw new Error('Not authorized')
      nav('/', { replace: true })
    } catch (e: any) {
      setError(e?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="center">
      <div className="card">
        <h2 style={{marginTop:0}}>AFW Admin — Sign in</h2>
        <div className="row">
          <input type="email" placeholder="admin@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {error && <div className="bad" style={{margin:'8px 0'}}>{error}</div>}
        <div className="row">
          <button className="btn" onClick={go} disabled={loading}>{loading?'Please wait…':'Sign in'}</button>
        </div>
        <div className="muted" style={{marginTop:8}}>Access is limited to admin accounts only.</div>
      </div>
    </div>
  )
}

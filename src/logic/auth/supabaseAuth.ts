import { createClient } from '@supabase/supabase-js'
import type { AuthProvider, AuthChangeHandler, User } from './auth'
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
if (!url || !anon) console.warn('Supabase env missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
export const supabase = (url && anon) ? createClient(url, anon) : null
export class SupabaseAuth implements AuthProvider {
  name: 'supabase' = 'supabase'
  onChange(cb: AuthChangeHandler) {
    if (!supabase) return () => {}
    const { data: sub } = supabase.auth.onAuthStateChange(async (_, s) => {
      const u = s?.user ? { id: s.user.id, email: s.user.email || '' } : null
      cb(u)
    })
    return () => { sub?.subscription.unsubscribe() }
  }
  async current(): Promise<User | null> {
    if (!supabase) return null
    const { data } = await supabase.auth.getUser()
    const u = data.user; return u ? { id: u.id, email: u.email || '' } : null
  }
  async signUp(email: string, password: string): Promise<User> {
    if (!supabase) throw new Error('Auth not configured')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    const u = data.user; if (!u) throw new Error('Sign-up failed')
    return { id: u.id, email: u.email || '' }
  }
  async signIn(email: string, password: string): Promise<User> {
    if (!supabase) throw new Error('Auth not configured')
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const u = data.user; if (!u) throw new Error('Sign-in failed')
    return { id: u.id, email: u.email || '' }
  }
  async signOut(): Promise<void> { if (supabase) await supabase.auth.signOut() }
}





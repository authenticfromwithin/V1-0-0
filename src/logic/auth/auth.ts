export type User = { id: string; email: string }
export type AuthChangeHandler = (u: User | null) => void
export interface AuthProvider {
  current(): Promise<User | null>
  signUp(email: string, password: string): Promise<User>
  signIn(email: string, password: string): Promise<User>
  signOut(): Promise<void>
  onChange(cb: AuthChangeHandler): () => void
  name: 'supabase'
}
export function hasSupabaseEnv() {
  return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY
}

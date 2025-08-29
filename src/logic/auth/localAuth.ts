import type { AuthProvider, AuthChangeHandler, User } from './auth'

const KEY_USERS = 'afw_auth_users_v1'
const KEY_SESSION = 'afw_auth_session_v1'

type StoredUser = { id: string; email: string; hash: string; salt: string }

async function hashPassword(password: string, saltB64: string): Promise<string> {
  const enc = new TextEncoder()
  const salt = Uint8Array.from(atob(saltB64), c => c.charCodeAt(0))
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 150_000, hash: 'SHA-256' }, key, 256)
  const bytes = new Uint8Array(bits)
  let bin = ''; for (let i=0;i<bytes.length;i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

function getUsers(): StoredUser[] {
  try { return JSON.parse(localStorage.getItem(KEY_USERS) || '[]') } catch { return [] }
}
function setUsers(u: StoredUser[]) { localStorage.setItem(KEY_USERS, JSON.stringify(u)) }

function setSession(u: User | null) { localStorage.setItem(KEY_SESSION, u ? JSON.stringify(u) : '') }
function getSession(): User | null { try { return JSON.parse(localStorage.getItem(KEY_SESSION) || 'null') } catch { return null } }

export class LocalAuth implements AuthProvider {
  name: 'local' = 'local'
  private listeners: Set<AuthChangeHandler> = new Set()
  async current(): Promise<User | null> { return getSession() }

  onChange(cb: AuthChangeHandler) { this.listeners.add(cb); return () => this.listeners.delete(cb) }
  private emit(u: User | null) { for (const cb of this.listeners) cb(u) }

  async signUp(email: string, password: string): Promise<User> {
    email = email.trim().toLowerCase()
    if (!email || !password) throw new Error('Email and password required')
    const users = getUsers()
    if (users.some(u => u.email === email)) throw new Error('Account already exists on this device')
    const salt = crypto.getRandomValues(new Uint8Array(16))
    let bin = ''; for (let i=0;i<salt.length;i++) bin += String.fromCharCode(salt[i])
    const saltB64 = btoa(bin)
    const hash = await hashPassword(password, saltB64)
    const u: StoredUser = { id: crypto.randomUUID?.() || (Math.random().toString(36).slice(2)+Date.now().toString(36)), email, hash, salt: saltB64 }
    users.push(u); setUsers(users)
    const pub: User = { id: u.id, email: u.email }
    setSession(pub); this.emit(pub)
    return pub
  }

  async signIn(email: string, password: string): Promise<User> {
    email = email.trim().toLowerCase()
    const users = getUsers()
    const found = users.find(u => u.email === email)
    if (!found) throw new Error('No such account on this device')
    const hash = await hashPassword(password, found.salt)
    if (hash !== found.hash) throw new Error('Wrong password')
    const pub: User = { id: found.id, email: found.email }
    setSession(pub); this.emit(pub)
    return pub
  }

  async signOut(): Promise<void> { setSession(null); this.emit(null) }
}

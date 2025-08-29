import { createClient } from '@supabase/supabase-js'

const url = process.env.SUPABASE_URL as string
const anon = process.env.SUPABASE_ANON_KEY as string
const service = process.env.SUPABASE_SERVICE_ROLE_KEY as string
if (!url || !anon || !service) {
  throw new Error('Missing SUPABASE_* env vars')
}

export function supabaseForUser(accessToken?: string) {
  const client = createClient(url, anon, {
    auth: { persistSession: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined
  })
  return client
}

export function supabaseService() {
  return createClient(url, service, { auth: { persistSession: false } } as any)
}

export function getCookieName() {
  return process.env.SESSION_COOKIE_NAME || 'afw_sess'
}
export function getCookieDomain() {
  return process.env.SESSION_COOKIE_DOMAIN
}
export function cookieSecure() {
  return String(process.env.SESSION_COOKIE_SECURE || 'true') === 'true'
}

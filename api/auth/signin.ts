import type { VercelRequest, VercelResponse } from '@vercel/node'

import { supabaseService, getCookieName, getCookieDomain, cookieSecure } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' })

  const svc = supabaseService()
  const { data, error } = await svc.auth.signInWithPassword({ email, password })
  if (error || !data.session) return res.status(400).json({ error: error?.message || 'signin failed' })

  const token = data.session.access_token
  const cookieName = getCookieName()
  const domain = getCookieDomain()
  res.setHeader('Set-Cookie', `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; ${cookieSecure() ? 'Secure; ' : ''}${domain ? `Domain=${domain}; ` : ''}Max-Age=2592000`)
  return res.status(200).json({ ok: true })
}


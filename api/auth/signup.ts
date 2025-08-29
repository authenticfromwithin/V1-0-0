import type { VercelRequest, VercelResponse } from '@vercel/node'

import { supabaseService, getCookieName, getCookieDomain, cookieSecure } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { firstName, lastName, email, password } = req.body || {}
  if (!email || !password || !firstName || !lastName) return res.status(400).json({ error: 'Missing fields' })

  const svc = supabaseService()
  const { data: authData, error: authErr } = await svc.auth.admin.createUser({ email, password, email_confirm: true })
  if (authErr || !authData.user) return res.status(400).json({ error: authErr?.message || 'createUser failed' })
  const uid = authData.user.id

  const { error: profErr } = await svc.from('profiles_public').upsert({ id: uid, first_name: firstName, last_name: lastName }, { onConflict: 'id' })
  if (profErr) return res.status(400).json({ error: profErr.message })

  const { data: sessionData, error: signInErr } = await svc.auth.signInWithPassword({ email, password })
  if (signInErr || !sessionData.session) return res.status(400).json({ error: signInErr?.message || 'signin failed' })

  const token = sessionData.session.access_token
  const cookieName = getCookieName()
  const domain = getCookieDomain()
  res.setHeader('Set-Cookie', `${cookieName}=${token}; Path=/; HttpOnly; SameSite=Lax; ${cookieSecure() ? 'Secure; ' : ''}${domain ? `Domain=${domain}; ` : ''}Max-Age=2592000`)
  return res.status(200).json({ ok: true })
}


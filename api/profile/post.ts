import type { VercelRequest, VercelResponse } from '@vercel/node'

import { supabaseForUser, getCookieName } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const token = (req.cookies && req.cookies[getCookieName()]) || ''
  if (!token) return res.status(401).json({ error: 'Not signed in' })

  const { first_name, last_name } = req.body || {}
  const user = supabaseForUser(token)
  const { data: me, error: meErr } = await user.auth.getUser(token)
  if (meErr || !me.user) return res.status(401).json({ error: 'Invalid session' })

  const { error: upErr } = await user.from('profiles_public').upsert({ id: me.user.id, first_name, last_name }, { onConflict: 'id' })
  if (upErr) return res.status(400).json({ error: upErr.message })
  return res.status(200).json({ ok: true })
}


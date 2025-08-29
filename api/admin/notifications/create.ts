import type { VercelRequest, VercelResponse } from '@vercel/node'

import { supabaseForUser, getCookieName } from '../../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const token = (req.cookies && req.cookies[getCookieName()]) || ''
  if (!token) return res.status(401).json({ error: 'Not signed in' })

  const user = supabaseForUser(token)
  const { data: isAdmin, error: adminErr } = await user.rpc('is_admin')
  if (adminErr) return res.status(400).json({ error: adminErr.message })
  if (!isAdmin) return res.status(403).json({ error: 'Forbidden' })

  const { title, body } = req.body || {}
  if (!title || !body) return res.status(400).json({ error: 'Missing title/body' })

  const { error } = await user.from('notifications').insert({ title, body })
  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ ok: true })
}


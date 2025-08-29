import type { VercelRequest, VercelResponse } from '@vercel/node'

import { supabaseForUser, getCookieName } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })
  const token = (req.cookies && req.cookies[getCookieName()]) || ''
  if (!token) return res.status(401).json({ error: 'Not signed in' })

  const user = supabaseForUser(token)
  const { data: me, error: meErr } = await user.auth.getUser(token)
  if (meErr || !me.user) return res.status(401).json({ error: 'Invalid session' })

  const { data: prof, error: profErr } = await user.from('profiles_public').select('first_name,last_name').eq('id', me.user.id).single()
  if (profErr) return res.status(400).json({ error: profErr.message })

  return res.status(200).json({ id: me.user.id, email: me.user.email, first_name: prof?.first_name || '', last_name: prof?.last_name || '' })
}


import type { VercelRequest, VercelResponse } from '@vercel/node'

import { getCookieName } from '../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const cookieName = getCookieName()
  res.setHeader('Set-Cookie', `${cookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`)
  return res.status(200).json({ ok: true })
}


import { createClient } from '@supabase/supabase-js'
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
export const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
if (!SUPABASE_URL || !SUPABASE_ANON) console.warn('Supabase env missing in Admin. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.')
export const supabase = (SUPABASE_URL && SUPABASE_ANON) ? createClient(SUPABASE_URL, SUPABASE_ANON) : null

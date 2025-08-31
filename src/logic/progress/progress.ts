import { supabase } from '@/logic/auth/supabaseAuth'
export type ProgressEvent = { t: number; page: 'home'|'healing'|'journey'|'quotes'|'devotionals'; intent?: string; theme?: string; avatar?: string; meta?: Record<string, any> }
export async function recordProgress(ev: ProgressEvent) { if (!supabase) return; const { data: { user } } = await supabase.auth.getUser(); if (!user) return; try { await supabase.from('progress_events').insert({ ...ev, user_id: user.id }) } catch (e) { console.warn('progress insert failed', e) } }




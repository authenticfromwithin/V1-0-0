import { supabase } from '@/logic/auth/supabaseAuth'
export type PublicProfile = { user_id: string; first_name?: string|null; last_name?: string|null; display_name?: string|null; theme?: 'forest'|'ocean'|'mountain'|'autumn'|'snow'|null; avatar_archetype?: 'seeker'|'pilgrim'|'watcher'|null; created_at?: string; updated_at?: string }
export async function getMyProfile(){ if(!supabase) return null; const { data:{ user } } = await supabase.auth.getUser(); if(!user) return null; const { data, error } = await supabase.from('profiles_public').select('*').eq('user_id', user.id).maybeSingle(); if(error) throw error; return data as any }
export async function upsertMyProfile(p: Omit<PublicProfile,'user_id'>){ if(!supabase) return; const { data:{ user } } = await supabase.auth.getUser(); if(!user) throw new Error('Not signed in'); const payload = { user_id:user.id, ...p, updated_at:new Date().toISOString() }; const { error } = await supabase.from('profiles_public').upsert(payload, { onConflict:'user_id' }); if(error) throw error }




export async function getProfile(){
  const r = await fetch('/api/profile', { method: 'GET' })
  if (!r.ok) throw new Error((await r.json()).error || 'Profile load failed')
  return r.json()
}
export async function updateProfile(p: {first_name?: string; last_name?: string}){
  const r = await fetch('/api/profile', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(p) })
  if (!r.ok) throw new Error((await r.json()).error || 'Profile update failed')
}



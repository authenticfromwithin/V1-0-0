export async function signup(firstName: string, lastName: string, email: string, password: string){
  const r = await fetch('/api/auth/signup', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ firstName, lastName, email, password }) })
  if (!r.ok) throw new Error((await r.json()).error || 'Signup failed')
}
export async function signin(email: string, password: string){
  const r = await fetch('/api/auth/signin', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ email, password }) })
  if (!r.ok) throw new Error((await r.json()).error || 'Signin failed')
}
export async function signout(){
  const r = await fetch('/api/auth/signout', { method: 'POST' })
  if (!r.ok) throw new Error((await r.json()).error || 'Signout failed')
}
export async function me(){
  const r = await fetch('/api/profile', { method: 'GET' })
  if (!r.ok) throw new Error((await r.json()).error || 'Not signed in')
  return r.json()
}





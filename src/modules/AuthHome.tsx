import React, { useState } from "react"
import { signIn, signUp, exportUserForAdmin } from "../utils/auth"
import AudioEngine from "../components/AudioEngine"

export default function AuthHome({ onAuthed }: { onAuthed: () => void }) {
  const [tab, setTab] = useState<"signup"|"signin">("signup")
  const [firstName, setFirst] = useState("")
  const [lastName, setLast] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPass] = useState("")
  const [agree, setAgree] = useState(false)
  const [err, setErr] = useState<string|null>(null)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    if (tab === "signup") {
      const msg = signUp({ firstName, lastName, email, password, agree })
      if (msg) setErr(msg); else onAuthed()
    } else {
      const msg = signIn({ email, password })
      if (msg) setErr(msg); else onAuthed()
    }
  }

  return (
    <main className="copy">
      <img className="afw-logo" src="/assets/logo/afw-logo.png" alt="Authentic From Within" />
      <div className="auth-card" role="region" aria-label="AFW Sign Up / Sign In">
        <div className="tabs">
          <button className={"tab"+(tab==="signup"?" active":"")} onClick={()=>{setTab("signup"); setErr(null)}}>
            SIGN UP
          </button>
          <button className={"tab"+(tab==="signin"?" active":"")} onClick={()=>{setTab("signin"); setErr(null)}}>
            SIGN IN
          </button>
        </div>

        <form className="form" onSubmit={submit}>
          {tab==="signup" && (
            <>
              <label className="field"><span>First Name</span><input value={firstName} onChange={e=>setFirst(e.target.value)} required /></label>
              <label className="field"><span>Last Name</span><input value={lastName} onChange={e=>setLast(e.target.value)} /></label>
            </>
          )}
          <label className="field"><span>Email</span><input type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
          <label className="field"><span>Password</span><input type="password" value={password} onChange={e=>setPass(e.target.value)} required /></label>

          {tab==="signup" && (
            <label className="agree">
              <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} />
              <span>I accept the <a href="/legal/terms.html" target="_blank" rel="noreferrer">Terms &amp; Conditions</a>, <a href="/legal/privacy.html" target="_blank" rel="noreferrer">Privacy Policy</a></span>
            </label>
          )}

          {err && <div className="error" role="alert">{err}</div>}

          <button className="cta" type="submit">{tab==="signup" ? "SIGN UP" : "SIGN IN"}</button>
        </form>

        <div className="minor-actions">
          <button className="linkish" type="button" onClick={exportUserForAdmin} title="Export profile for Admin import">Export profile for Admin</button>
        </div>
      </div>

      {/* Music toggle in corner; autostarts after first interaction */}
      <AudioEngine autostart={true}/>
    </main>
  )
}


import React from "react"

export default function AuthPanel(){
  return (
    <div className="auth-panel">
      <div className="panel">
        <h2>Welcome</h2>
        <div className="actions">
          <button>Sign In</button>
          <button className="secondary">Sign Up</button>
        </div>
      </div>
    </div>
  )
}

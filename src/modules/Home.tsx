import React, { useEffect, useState } from "react"

export default function Home(){
  const [journal, setJournal] = useState(localStorage.getItem("afw:journal")||"")
  useEffect(()=>{ localStorage.setItem("afw:journal", journal) }, [journal])

  return (
    <main className="copy">
      <div>
        <h1 className="title title-bloom">Authentic From Within</h1>
        <p className="subtitle">A sacred, cinematic, therapeutic space — nighttime forest; fire as the light.</p>
        <div className="journal glass">
          <h3>Journal (local-only)</h3>
          <p>Your writing never leaves your device. Copy/paste and drag-drop are disabled by design.</p>
          <textarea
            value={journal}
            onChange={e=>setJournal(e.target.value)}
            placeholder="Breathe. Begin with one honest line…"
          />
        </div>
      </div>
    </main>
  )
}

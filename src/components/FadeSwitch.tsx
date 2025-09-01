import React, { ReactNode, useEffect, useState } from "react"

type Props = { id: string; children: ReactNode }

export default function FadeSwitch({ id, children }: Props) {
  const [view, setView] = useState<{ id: string; children: ReactNode }>({ id, children })
  const [phase, setPhase] = useState<"" | "exit" | "enter">("")

  useEffect(() => {
    if (id === view.id) return
    setPhase("exit")
    const t = setTimeout(() => {
      setView({ id, children })
      setPhase("enter")
      const t2 = setTimeout(() => setPhase(""), 240)
      return () => clearTimeout(t2)
    }, 180)
    return () => clearTimeout(t)
  }, [id, children])

  return <div className={`view ${phase ? `view-${phase}` : ""}`}>{view.children}</div>
}

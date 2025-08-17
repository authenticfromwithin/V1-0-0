import React, { useEffect, useRef } from "react";
import { attachClipboardGuards } from "guards/clipboard";

export default function Healing() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const guard = attachClipboardGuards(ref.current, { enableContextMenu: false });
    return () => guard.teardown();
  }, []);
  return (
    <main ref={ref} className="page">
      <h2>Healing From Within</h2>
      <p>Begin a gentle, biologically-rooted healing journey.</p>
    </main>
  );
}

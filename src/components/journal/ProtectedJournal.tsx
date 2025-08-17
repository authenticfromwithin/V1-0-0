import React, { useEffect, useRef } from "react";
import { attachClipboardGuards } from "guards/clipboard";

type Props = { children?: React.ReactNode };

export default function ProtectedJournal({ children }: Props) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    const guard = attachClipboardGuards(container.current, { enableContextMenu: false });
    return () => guard.teardown();
  }, []);

  return <section ref={container} className="journal-protected">{children}</section>;
}

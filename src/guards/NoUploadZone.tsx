import React from 'react';
import { GUARD_MESSAGES } from '../logic/guards/messages';

/** Wrap any area to block file drops/uploads. */
export default function NoUploadZone({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const node = ref.current!;
    function stop(e: DragEvent) {
      e.preventDefault(); e.stopPropagation();
      document.dispatchEvent(new CustomEvent('afw:guard:blocked', { detail: { type: 'dragDrop', message: GUARD_MESSAGES.dragDrop } }));
    }
    node.addEventListener('dragover', stop as any);
    node.addEventListener('drop', stop as any);
    return () => {
      node.removeEventListener('dragover', stop as any);
      node.removeEventListener('drop', stop as any);
    };
  }, []);

  return <div ref={ref}>{children}</div>;
}

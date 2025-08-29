import React from 'react';

type Props = { children: React.ReactNode };

export default function GlobalDropGuard({ children }: Props){
  React.useEffect(()=>{
    const stop = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); };
    window.addEventListener('dragover', stop);
    window.addEventListener('drop', stop);
    return ()=>{
      window.removeEventListener('dragover', stop);
      window.removeEventListener('drop', stop);
    };
  }, []);
  return <>{children}</>;
}

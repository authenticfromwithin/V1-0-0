export type ClipboardOptions = { enableContextMenu?: boolean };
export function attachClipboardGuards(root: HTMLElement, opts: ClipboardOptions = {}){
  const stop = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
  const onKey = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && ['c','x','v','a','s'].includes(e.key.toLowerCase())) stop(e);
  };
  root.addEventListener('copy', stop);
  root.addEventListener('cut', stop);
  root.addEventListener('paste', stop);
  root.addEventListener('keydown', onKey as any);
  if (!opts.enableContextMenu){
    root.addEventListener('contextmenu', stop);
  }
  return {
    teardown(){
      root.removeEventListener('copy', stop);
      root.removeEventListener('cut', stop);
      root.removeEventListener('paste', stop);
      root.removeEventListener('keydown', onKey as any);
      if (!opts.enableContextMenu){
        root.removeEventListener('contextmenu', stop);
      }
    }
  };
}



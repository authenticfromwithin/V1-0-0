import { GUARD_MESSAGES } from '../logic/guards/messages';

export type GuardOptions = {
  scope?: HTMLElement | Document;
  allowCopy?: boolean;
  allowCut?: boolean;
  allowPaste?: boolean;
  allowContext?: boolean;
  allowDragDrop?: boolean;
  onBlock?: (type: keyof typeof GUARD_MESSAGES) => void;
};

/** Attach listeners that prevent clipboard & context actions inside a scope */
export function installClipboardGuards(opts: GuardOptions = {}) {
  const scope = opts.scope ?? document;
  const onBlock = opts.onBlock ?? ((type) => {
    // Fire a custom event the app can listen to (for toasts etc.)
    document.dispatchEvent(new CustomEvent('afw:guard:blocked', { detail: { type, message: GUARD_MESSAGES[type] } }));
  });

  function block(ev: Event, type: keyof typeof GUARD_MESSAGES, allow?: boolean) {
    if (allow) return;
    ev.preventDefault();
    ev.stopPropagation();
    onBlock(type);
  }

  const onCopy = (e: ClipboardEvent) => block(e, 'copy', opts.allowCopy);
  const onCut = (e: ClipboardEvent) => block(e, 'cut', opts.allowCut);
  const onPaste = (e: ClipboardEvent) => block(e, 'paste', opts.allowPaste);
  const onContext = (e: MouseEvent) => block(e, 'context', opts.allowContext);
  const onDragOver = (e: DragEvent) => block(e, 'dragDrop', opts.allowDragDrop);
  const onDrop = (e: DragEvent) => block(e, 'dragDrop', opts.allowDragDrop);

  scope.addEventListener('copy', onCopy, true);
  scope.addEventListener('cut', onCut, true);
  scope.addEventListener('paste', onPaste, true);
  scope.addEventListener('contextmenu', onContext, true);
  scope.addEventListener('dragover', onDragOver, true);
  scope.addEventListener('drop', onDrop, true);

  // Keyboard combos for good measure
  const onKeyDown = (e: KeyboardEvent) => {
    const k = e.key.toLowerCase();
    const meta = e.metaKey || e.ctrlKey;
    // Block Ctrl/Cmd + C/X/V
    if (meta && (k === 'c' || k === 'x' || k === 'v')) {
      block(e, k === 'c' ? 'copy' : k === 'x' ? 'cut' : 'paste', (k === 'c' && opts.allowCopy) || (k === 'x' && opts.allowCut) || (k === 'v' && opts.allowPaste));
    }
  };
  scope.addEventListener('keydown', onKeyDown, true);

  return () => {
    scope.removeEventListener('copy', onCopy, true);
    scope.removeEventListener('cut', onCut, true);
    scope.removeEventListener('paste', onPaste, true);
    scope.removeEventListener('contextmenu', onContext, true);
    scope.removeEventListener('dragover', onDragOver, true);
    scope.removeEventListener('drop', onDrop, true);
    scope.removeEventListener('keydown', onKeyDown, true);
  };
}

// src/guards/clipboard.ts
// Compile-safe clipboard/context/drag guards for CRA + TypeScript.

export type ClipboardGuardOptions = {
  allowCopy?: boolean;
  allowCut?: boolean;
  allowPaste?: boolean;
  allowContextMenu?: boolean;
  allowDragDrop?: boolean;
};

const defaults: ClipboardGuardOptions = {
  allowCopy: false,
  allowCut: false,
  allowPaste: false,
  allowContextMenu: false,
  allowDragDrop: false,
};

type Scope = Document | Window | HTMLElement;

function block(evt: Event, allow?: boolean) {
  if (!allow) {
    evt.preventDefault();
    evt.stopPropagation();
  }
}

/**
 * Install global guards that prevent copy/cut/paste/context menu/drag-drop
 * unless explicitly allowed via options.
 *
 * Returns an uninstall function to remove all listeners.
 */
export function installClipboardGuards(
  scope: Scope = document,
  options: Partial<ClipboardGuardOptions> = {}
) {
  const opts: ClipboardGuardOptions = { ...defaults, ...options };

  const onCopy = (evt: Event) => block(evt, opts.allowCopy);
  const onCut = (evt: Event) => block(evt, opts.allowCut);
  const onPaste = (evt: Event) => block(evt, opts.allowPaste);
  const onContext = (evt: Event) => block(evt, opts.allowContextMenu);
  const onDrop = (evt: Event) => block(evt, opts.allowDragDrop);

  scope.addEventListener('copy', onCopy as EventListener, true);
  scope.addEventListener('cut', onCut as EventListener, true);
  scope.addEventListener('paste', onPaste as EventListener, true);
  scope.addEventListener('contextmenu', onContext as EventListener, true);
  scope.addEventListener('drop', onDrop as EventListener, true);
  scope.addEventListener('dragover', onDrop as EventListener, true);

  return () => {
    scope.removeEventListener('copy', onCopy as EventListener, true);
    scope.removeEventListener('cut', onCut as EventListener, true);
    scope.removeEventListener('paste', onPaste as EventListener, true);
    scope.removeEventListener('contextmenu', onContext as EventListener, true);
    scope.removeEventListener('drop', onDrop as EventListener, true);
    scope.removeEventListener('dragover', onDrop as EventListener, true);
  };
}

export default installClipboardGuards;

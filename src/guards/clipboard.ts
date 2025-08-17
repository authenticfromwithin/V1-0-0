// src/guards/clipboard.ts
// Compile-safe clipboard/context/drag guards with flexible API.
//
// Usage supported:
//   installClipboardGuards()                                   // default: document scope
//   installClipboardGuards(el)                                 // HTMLElement scope
//   installClipboardGuards({ scope: el, onBlock: t => {...} }) // options object
//   installClipboardGuards(el, { allowCopy: true })            // scope + options

export type GuardKind = 'copy' | 'cut' | 'paste' | 'contextmenu' | 'dragDrop';

export type ClipboardGuardOptions = {
  /** Allow specific actions (default: false for all). */
  allowCopy?: boolean;
  allowCut?: boolean;
  allowPaste?: boolean;
  allowContextMenu?: boolean;
  allowDragDrop?: boolean;
  /** Optional callback when an action is blocked. */
  onBlock?: (type: GuardKind) => void;
  /** Optional explicit scope if passing options as a single object. */
  scope?: Scope;
};

type Scope = Document | Window | HTMLElement;

const defaults: Required<Omit<ClipboardGuardOptions, 'onBlock' | 'scope'>> = {
  allowCopy: false,
  allowCut: false,
  allowPaste: false,
  allowContextMenu: false,
  allowDragDrop: false,
};

function hasAddEventListener(v: any): v is Scope {
  return !!v && typeof v.addEventListener === 'function';
}

function block(evt: Event, type: GuardKind, allow: boolean | undefined, onBlock?: (t: GuardKind) => void) {
  if (!allow) {
    evt.preventDefault();
    evt.stopPropagation();
    onBlock?.(type);
  }
}

// Overloads
export function installClipboardGuards(options?: Partial<ClipboardGuardOptions>): () => void;
export function installClipboardGuards(scope?: Scope, options?: Partial<ClipboardGuardOptions>): () => void;

// Impl
export function installClipboardGuards(a?: any, b?: any) {
  let scope: Scope = typeof document !== 'undefined' ? document : ({} as Document);
  let options: Partial<ClipboardGuardOptions> = {};

  if (a && hasAddEventListener(a)) {
    scope = a as Scope;
    options = (b ?? {}) as Partial<ClipboardGuardOptions>;
  } else if (a && typeof a === 'object') {
    const opt = a as Partial<ClipboardGuardOptions>;
    if (opt.scope && hasAddEventListener(opt.scope)) scope = opt.scope;
    options = opt;
  }

  const opts: ClipboardGuardOptions = { ...defaults, ...options };

  const onCopy    = (evt: Event) => block(evt, 'copy',        opts.allowCopy,        opts.onBlock);
  const onCut     = (evt: Event) => block(evt, 'cut',         opts.allowCut,         opts.onBlock);
  const onPaste   = (evt: Event) => block(evt, 'paste',       opts.allowPaste,       opts.onBlock);
  const onContext = (evt: Event) => block(evt, 'contextmenu', opts.allowContextMenu, opts.onBlock);
  const onDrag    = (evt: Event) => block(evt, 'dragDrop',    opts.allowDragDrop,    opts.onBlock);

  scope.addEventListener('copy',        onCopy as EventListener,    true);
  scope.addEventListener('cut',         onCut  as EventListener,    true);
  scope.addEventListener('paste',       onPaste as EventListener,   true);
  scope.addEventListener('contextmenu', onContext as EventListener, true);
  scope.addEventListener('drop',        onDrag as EventListener,    true);
  scope.addEventListener('dragover',    onDrag as EventListener,    true);

  return () => {
    scope.removeEventListener('copy',        onCopy as EventListener,    true);
    scope.removeEventListener('cut',         onCut  as EventListener,    true);
    scope.removeEventListener('paste',       onPaste as EventListener,   true);
    scope.removeEventListener('contextmenu', onContext as EventListener, true);
    scope.removeEventListener('drop',        onDrag as EventListener,    true);
    scope.removeEventListener('dragover',    onDrag as EventListener,    true);
  };
}

export default installClipboardGuards;
type Guard = {
  teardown: () => void;
  enable: () => void;
  disable: () => void;
};

type Options = {
  enableContextMenu?: boolean; // default false
};

const blocked = ["copy","cut","paste","dragstart","drop","dragover"];
const alwaysBlocked = ["selectstart"];
const contextEvt = "contextmenu";

export function attachClipboardGuards(root: HTMLElement, opts: Options = {}): Guard {
  const listeners: Array<[string, EventListener]> = [];

  const handler = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const add = (el: HTMLElement, type: string, fn: EventListener) => {
    el.addEventListener(type, fn, { passive: false, capture: true } as AddEventListenerOptions);
    listeners.push([type, fn]);
  };

  const enable = () => {
    [...blocked, ...alwaysBlocked].forEach(t => add(root, t, handler));
    if (!opts.enableContextMenu) add(root, contextEvt, handler);
  };

  const disable = () => {
    listeners.forEach(([type, fn]) => root.removeEventListener(type, fn, true));
    listeners.length = 0;
  };

  enable();
  return { teardown: disable, enable, disable };
}
export * from "../../guards/clipboard";

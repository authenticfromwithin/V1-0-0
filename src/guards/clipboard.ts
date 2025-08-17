type Guard = { teardown: () => void; enable: () => void; disable: () => void; };
type Options = { enableContextMenu?: boolean };

const blocked = ["copy","cut","paste","dragstart","drop","dragover"];
const alwaysBlocked = ["selectstart"];
const contextEvt = "contextmenu";

export function attachClipboardGuards(root: HTMLElement, opts: Options = {}): Guard {
  const listeners: Array<[string, EventListener]> = [];
  const handler = (e: Event) => { e.preventDefault(); e.stopPropagation(); };
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

import React from 'react';
import { installClipboardGuards } from '../guards/clipboard';

/** Protected journal textarea.
 *  - Blocks copy/cut/paste/context/drag&drop inside this element.
 *  - Adds data-protected-journal attr so CSS can style it (see journal.css).
 */
type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  onBlocked?: (message: string) => void;
};
export default function ProtectedJournal({ onBlocked, ...rest }: Props) {
  const ref = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const el = ref.current!;
    el.setAttribute('data-protected-journal', 'true');
    const uninstall = installClipboardGuards({
      scope: el,
      onBlock: (_type) => {
        const message = 'This journal is protected. Clipboard actions are disabled here.';
        onBlocked?.(message);
        // Basic fallback: title attribute shows native tooltip
        el.title = message;
      }
    });
    return () => uninstall();
  }, [onBlocked]);

  return <textarea ref={ref} {...rest} />;
}

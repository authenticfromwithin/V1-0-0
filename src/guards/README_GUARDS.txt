AFW — Guards & Policy Pack

What this adds
- Clipboard guards (copy/cut/paste) + right-click/context + drag/drop blocking.
- ProtectedJournal textarea that automatically applies the guards.
- NoUploadZone wrapper to block file drops in any section.
- PolicyBanner component to remind users this is a private space.

How to use
1) Global (optional): in your app root, call `installClipboardGuards()` once to guard the whole app.
   import { installClipboardGuards } from './guards';
   React.useEffect(() => installClipboardGuards(), []);

2) Journal field:
   import { ProtectedJournal } from './guards';
   <ProtectedJournal rows={12} placeholder="Your private reflection..." />

3) No uploads in a section:
   import { NoUploadZone } from './guards';
   <NoUploadZone><YourComponent/></NoUploadZone>

4) Policy banner:
   import { PolicyBanner } from './guards';
   <PolicyBanner />

Notes
- Browsers cannot block screenshots. The guards cover clipboard, context menu, and drag/drop.
- If you need to temporarily allow paste for a specific input, use:
   installClipboardGuards({ scope: element, allowPaste: true });

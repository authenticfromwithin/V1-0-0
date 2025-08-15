import React from 'react';

/** Small banner that states privacy policy in-app (non-dismissive tone). */
export default function PolicyBanner() {
  return (
    <div className="afw-card" style={{padding:'8px 12px', fontSize:13}} role="note" aria-live="polite">
      <strong>Private by design.</strong>&nbsp;Copy, paste, uploads and downloads are disabled in protected spaces. Your reflections remain on this device.
    </div>
  );
}

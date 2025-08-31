import React from 'react';

/**
 * Show the HTTPS warning only in production. Never in dev/preview.
 */
export default function InsecureBanner() {
  const show = typeof window !== 'undefined'
    && window.location.protocol !== 'https:'
    && !import.meta.env.DEV;

  if (!show) return null;
  return (
    <div style={bar}>
      Warning: This page is not loaded over HTTPS. Your connection may not be secure.
    </div>
  );
}

const bar: React.CSSProperties = {
  position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 9999,
  background: '#E53935', color: '#fff', padding: '8px 12px', textAlign: 'center',
  fontSize: 14, letterSpacing: '.01em'
};

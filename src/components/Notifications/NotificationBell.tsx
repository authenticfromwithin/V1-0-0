import React from 'react'

export default function NotificationBell({ count = 0 }: { count?: number }) {
  return (
    <div style={{ position: 'relative', display: 'inline-block' }} aria-label="Notifications">
      <span role="img" aria-hidden>🔔</span>
      {count > 0 && (
        <span style={{
          position: 'absolute', top: -6, right: -6,
          background: 'crimson', color: 'white',
          borderRadius: 10, padding: '0 6px', fontSize: 12
        }}>{count}</span>
      )}
    </div>
  )
}



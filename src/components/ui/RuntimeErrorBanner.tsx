import React from 'react'

type Props = { error?: unknown }

export default function RuntimeErrorBanner({ error }: Props) {
  if (!error) return null
  return (
    <div style={{
      position: 'fixed', bottom: 12, left: 12, right: 12,
      padding: 12, background: '#fee', color: '#900',
      border: '1px solid #f99', borderRadius: 8, zIndex: 9999
    }}>
      <strong>Runtime error:</strong> {String(error)}
    </div>
  )
}

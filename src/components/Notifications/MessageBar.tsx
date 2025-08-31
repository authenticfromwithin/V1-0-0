import React from 'react'

export default function MessageBar({ text }: { text: string }) {
  return (
    <div style={{
      background: '#f6f7f9',
      border: '1px solid #e5e7eb',
      borderRadius: 6,
      padding: '8px 10px',
      color: '#374151'
    }}>{text}</div>
  )
}



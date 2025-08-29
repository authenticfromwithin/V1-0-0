import React from 'react'
import MessageBar from './MessageBar'

export type Notification = {
  id: string
  title: string
  body?: string
}

type Props = {
  items?: Notification[]
}

export default function NotificationsPanel({ items = [] }: Props) {
  if (!items.length) {
    return <MessageBar text="No notifications yet." />
  }
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
      <h3 style={{ marginTop: 0 }}>Notifications</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map(n => (
          <li key={n.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <div style={{ fontWeight: 600 }}>{n.title}</div>
            {n.body && <div style={{ color: '#555', fontSize: 14 }}>{n.body}</div>}
          </li>
        ))}
      </ul>
    </div>
  )
}

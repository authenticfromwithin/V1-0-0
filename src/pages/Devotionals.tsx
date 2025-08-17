import React, { useEffect, useState } from "react";
type Devo = { id: string; title: string; date: string; passage?: string };

export default function Devotionals() {
  const [items, setItems] = useState<Devo[]>([]);
  useEffect(() => {
    fetch("/content/devotionals.manifest.json")
      .then(r => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  }, []);
  return (
    <main className="page">
      <h2>Transfiguration From Within</h2>
      <ul className="list">
        {items.map(d => (
          <li key={d.id}>
            <h3>{d.title}</h3>
            <div className="meta">{new Date(d.date).toDateString()}</div>
            {d.passage && <p className="passage">{d.passage}</p>}
          </li>
        ))}
      </ul>
    </main>
  );
}

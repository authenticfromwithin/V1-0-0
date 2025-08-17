import React, { useEffect, useState } from "react";
type Quote = { text: string; author?: string };

export default function Quotes() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  useEffect(() => {
    fetch("/content/quotes.manifest.json")
      .then(r => r.json())
      .then(setQuotes)
      .catch(() => setQuotes([]));
  }, []);
  return (
    <main className="page">
      <h2>Authentic From Within</h2>
      <ul className="list">
        {quotes.map((q, i) => (
          <li key={i}>
            <blockquote>{q.text}</blockquote>
            {q.author && <cite>— {q.author}</cite>}
          </li>
        ))}
      </ul>
    </main>
  );
}

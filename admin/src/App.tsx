import React, { useEffect, useState } from "react"
import { validate, Kind } from "./validate"

type Ann = { id:string; title:string; message:string; severity:"info"|"warn"|"error"; active:boolean }
type Link = { label:string; href:string; platform?:string }
type QuoteItem = { id:string; text:string; author?:string }
type QuoteCategory = { id:string; name:string; items: QuoteItem[] }

export default function App() {
  const [announcements, setAnnouncements] = useState<Ann[]>([])
  const [msg, setMsg] = useState("")
  const [tab, setTab] = useState<"manage"|"validate"|"donate"|"quotes">("manage")

  useEffect(() => {
    fetch("/content/announcements.json").then(r=>r.json()).then(d=>setAnnouncements(d.announcements||[])).catch(()=>setAnnouncements([]))
  }, [])

  const addAnn = () => {
    const next:Ann = { id: `ann-${Date.now()}`, title: "Note", message: msg, severity:"info", active: true }
    const updated = [next, ...announcements]
    setAnnouncements(updated)
    alert("Copy JSON to /public/content/announcements.json and redeploy.")
    console.log(JSON.stringify({ announcements: updated }, null, 2))
  }

  return (
    <div style={{padding:20, color:"#e9eef2", background:"#0b0f12", minHeight:"100vh"}}>
      <h1>AFW Admin</h1>
      <div style={{display:"flex", gap:8, marginBottom:10}}>
        <button onClick={()=>setTab("manage")}>Manage</button>
        <button onClick={()=>setTab("donate")}>Donate Links</button>
        <button onClick={()=>setTab("quotes")}>Quotes</button>
        <button onClick={()=>setTab("validate")}>Validate JSON</button>
      </div>

      {tab==="manage" && (
        <>
          <p>Site manifests only. Journals are private and never accessible here.</p>
          <div style={{display:"flex", gap:8}}>
            <input style={{flex:1, padding:8}} placeholder="Write a banner message..." value={msg} onChange={e=>setMsg(e.target.value)} />
            <button onClick={addAnn}>Add announcement</button>
          </div>
          <pre style={{whiteSpace:"pre-wrap", background:"#11171b", padding:12, marginTop:16, borderRadius:8}}>
{JSON.stringify({ announcements }, null, 2)}
          </pre>
        </>
      )}

      {tab==="donate" && <DonateLinksEditor />}

      {tab==="quotes" && <QuotesEditor />}

      {tab==="validate" && <Validator />}
    </div>
  )
}

function DonateLinksEditor(){
  const [links, setLinks] = useState<Link[]>([])
  const [label, setLabel] = useState("Support AFW")
  const [href, setHref] = useState("https://example.org/donate")
  const [platform, setPlatform] = useState("generic")

  useEffect(() => {
    fetch("/content/donate.links.json").then(r=>r.json()).then(d=>setLinks(d.links||[])).catch(()=>setLinks([]))
  }, [])

  const add = () => {
    const next = [...links, { label, href, platform }]
    const payload = { links: next }
    const err = validate("donate", payload as any)
    if (err) { alert("Invalid donate.links.json: " + err); return }
    setLinks(next)
    alert("Copy JSON to /public/content/donate.links.json and redeploy.")
    console.log(JSON.stringify(payload, null, 2))
  }

  return (
    <div style={{marginTop:8}}>
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:8}}>
        <input placeholder="Label" value={label} onChange={e=>setLabel(e.target.value)} />
        <input placeholder="https://…" value={href} onChange={e=>setHref(e.target.value)} />
        <input placeholder="platform" value={platform} onChange={e=>setPlatform(e.target.value)} />
        <button onClick={add}>Add</button>
      </div>
      <pre style={{whiteSpace:"pre-wrap", background:"#11171b", padding:12, marginTop:12, borderRadius:8}}>
{JSON.stringify({ links }, null, 2)}
      </pre>
    </div>
  )
}

function QuotesEditor(){
  const [cats, setCats] = useState<QuoteCategory[]>([])
  const [catName, setCatName] = useState("Authentic From Within")
  const [text, setText] = useState("")
  const [author, setAuthor] = useState("Rumique Davids")
  const [catId, setCatId] = useState<string>("default")

  useEffect(() => {
    fetch("/content/quotes.manifest.json").then(r=>r.json()).then((d:any)=>{
      const existing: QuoteCategory[] = (d.categories||[]).map((c:any)=>({ id:c.id, name:c.name, items:c.items||[] }))
      if (existing.length===0) existing.push({ id:"default", name:"Authentic From Within", items:[] })
      setCats(existing); setCatId(existing[0].id)
    }).catch(()=>setCats([{ id:"default", name:"Authentic From Within", items:[] }]))
  }, [])

  const addQuote = () => {
    const id = "q-" + Date.now()
    const next = cats.map(c => c.id===catId ? { ...c, items: [...c.items, { id, text, author }] } : c)
    const payload:any = { version: 1, categories: next }
    const err = validate("quotes", payload)
    if (err) { alert("Invalid quotes.manifest.json: " + err); return }
    setCats(next)
    alert("Copy JSON to /public/content/quotes.manifest.json and redeploy.")
    console.log(JSON.stringify(payload, null, 2))
    setText("")
  }

  const addCategory = () => {
    const id = "cat-" + Date.now()
    setCats([...cats, { id, name: catName, items: [] }])
    setCatId(id)
  }

  return (
    <div style={{marginTop:8}}>
      <div style={{display:"flex", gap:8, marginBottom:10}}>
        <select value={catId} onChange={e=>setCatId(e.target.value)}>
          {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input placeholder="New category name" value={catName} onChange={e=>setCatName(e.target.value)} />
        <button onClick={addCategory}>Add Category</button>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"2fr 1fr auto", gap:8}}>
        <input placeholder="Quote text" value={text} onChange={e=>setText(e.target.value)} />
        <input placeholder="Author" value={author} onChange={e=>setAuthor(e.target.value)} />
        <button onClick={addQuote}>Add Quote</button>
      </div>
      <pre style={{whiteSpace:"pre-wrap", background:"#11171b", padding:12, marginTop:12, borderRadius:8}}>
{JSON.stringify({ version:1, categories: cats }, null, 2)}
      </pre>
    </div>
  )
}

function Validator(){
  const [kind, setKind] = useState<Kind>("announcements")
  const [raw, setRaw] = useState("{}")
  const [result, setResult] = useState<string>("")

  const run = () => {
    try {
      const data = JSON.parse(raw)
      const err = validate(kind, data)
      setResult(err ? "❌ " + err : "✅ valid")
    } catch(e:any) {
      setResult("❌ JSON parse error: " + String(e))
    }
  }

  return (
    <div style={{marginTop:12}}>
      <div style={{display:"flex", gap:8, marginBottom:8}}>
        <select value={kind} onChange={e=>setKind(e.target.value as Kind)}>
          <option value="announcements">announcements.json</option>
          <option value="quotes">quotes.manifest.json</option>
          <option value="devotionals">devotionals.manifest.json</option>
          <option value="donate">donate.links.json</option>
        </select>
        <button onClick={run}>Validate</button>
      </div>
      <textarea style={{width:"100%", minHeight:220, background:"#0c1115", color:"#e9eef2", padding:10, border:"1px solid #223", borderRadius:8}}
        value={raw} onChange={e=>setRaw(e.target.value)} placeholder="Paste JSON here..." />
      <div style={{marginTop:8, padding:8, background:"#141a20", border:"1px solid #263241", borderRadius:8}}>{result}</div>
    </div>
  )
}

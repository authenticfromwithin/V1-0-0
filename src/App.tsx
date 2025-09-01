import React, { useEffect, useState } from "react"
import { Scene } from "./components/Scene"
import { ThemeToggle } from "./components/ThemeToggle"
import AuthHome from "./modules/AuthHome"
import Quotes from "./modules/Quotes"
import Journal from "./modules/Journal"
import Donations from "./modules/Donations"
import { readRoute, navTo, onRoute, Route } from "./utils/router"
import { isAuthed, getUser, signOut } from "./utils/auth"
import "./styles.css"

function useRoute():[Route,(r:Route)=>void]{
  const [route,setRoute]=useState<Route>(readRoute())
  useEffect(()=> onRoute(()=>setRoute(readRoute())),[])
  return [route,(r)=>{ navTo(r); setRoute(r) }]
}

export default function App(){
  const [route, nav] = useRoute()
  const [authed, setAuthed] = useState<boolean>(()=>isAuthed())
  const user = getUser()

  useEffect(()=>{
    if (!authed && route !== "home") nav("home")
    if (authed && route === "home") nav("quotes")
  },[authed,route])

  const onAuthed = () => { setAuthed(true); nav("quotes") }
  const doSignOut = () => { signOut(); setAuthed(false); nav("home") }

  return (
    <div className="stage">
      <div className="scene" aria-hidden="true"><Scene/></div>

      {!authed && route==="home" && <AuthHome onAuthed={onAuthed}/>}

      {authed && (
        <header className="nav">
          <div className="left"><div className="brand">AFW</div></div>
          <nav className="menu">
            <a className={"btn"+(route==="quotes"?" active":"")} href="#/quotes" onClick={(e)=>{e.preventDefault(); nav("quotes")}}>Authentic From Within</a>
            <a className={"btn"+(route==="healing"?" active":"")} href="#/healing" onClick={(e)=>{e.preventDefault(); nav("healing")}}>Healing From Within</a>
            <a className={"btn"+(route==="journey"?" active":"")} href="#/journey" onClick={(e)=>{e.preventDefault(); nav("journey")}}>Transfiguration From Within</a>
            <a className={"btn"+(route==="donations"?" active":"")} href="#/donations" onClick={(e)=>{e.preventDefault(); nav("donations")}}>Donations</a>
            <a className={"btn"+(route==="journal"?" active":"")} href="#/journal" onClick={(e)=>{e.preventDefault(); nav("journal")}}>Notebook</a>
            <ThemeToggle/>
            <button className="btn ghost" onClick={doSignOut} title="Sign out">Sign out{user?.firstName ? ` (${user.firstName})` : ""}</button>
            <a className="btn" href="/admin" rel="noreferrer">Admin</a>
          </nav>
        </header>
      )}

      {authed && route==="quotes" && <Quotes/>}
      {authed && route==="journal" && <Journal/>}
      {authed && route==="donations" && <Donations/>}
      {authed && route==="healing" && <main className="copy"><div className="glass"><h2>Healing From Within</h2><p>Arriving next: avatar + breath sessions.</p></div></main>}
      {authed && route==="journey" && <main className="copy"><div className="glass"><h2>Transfiguration From Within</h2><p>Devotional reader with Greek/Hebrew toggle incoming.</p></div></main>}
    </div>
  )
}

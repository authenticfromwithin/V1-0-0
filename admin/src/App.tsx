import React from 'react'
import { supabase } from './logic/supabaseClient'
import Events from './pages/Events'
import Progress from './pages/Progress'
import Profiles from './pages/Profiles'
import Notifications from './pages/Notifications'
import Feedback from './pages/Feedback'

function useHashRoute() {
  const [route, setRoute] = React.useState(window.location.hash.slice(1) || 'events')
  React.useEffect(() => {
    const fn = () => setRoute(window.location.hash.slice(1) || 'events')
    window.addEventListener('hashchange', fn)
    return () => window.removeEventListener('hashchange', fn)
  }, [])
  return [route, (r:string)=>{ window.location.hash = r }] as const
}

export default function App(){
  const [route, go] = useHashRoute()
  return (
    <div>
      <header>
        <div style={{fontWeight:800,letterSpacing:1}}>AFW Admin</div>
        <nav>
          <a href="#events" className={route==='events'?'active':''}>Events</a>
          <a href="#progress" className={route==='progress'?'active':''}>Progress</a>
          <a href="#profiles" className={route==='profiles'?'active':''}>Profiles</a>
          <a href="#notifications" className={route==='notifications'?'active':''}>Notifications</a>
          <a href="#feedback" className={route==='feedback'?'active':''}>Feedback</a>
        </nav>
      </header>
      <div className="container">
        {!supabase && <div className="bad card">Supabase not configured. Add env vars and redeploy.</div>}
        {route==='events' && <Events/>}
        {route==='progress' && <Progress/>}
        {route==='profiles' && <Profiles/>}
        {route==='notifications' && <Notifications/>}
        {route==='feedback' && <Feedback/>}
      </div>
    </div>
  )
}

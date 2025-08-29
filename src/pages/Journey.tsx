import React, { useEffect, useState } from 'react'
import Parallax from 'components/SceneParallax/Parallax'
import ThemeToggle from 'components/ui/ThemeToggle'
import ProfileMenu from 'components/ui/ProfileMenu'
import ProfilePanel from 'components/Profile/ProfilePanel'
import SettingsPanel from 'components/Settings/SettingsPanel'
import NotificationsPanel from 'components/Notifications/NotificationsPanel'
import FeedbackPanel from 'components/Feedback/FeedbackPanel'
import SupportPanel from 'components/Support/SupportPanel'
import NavTabs from 'components/ui/NavTabs'
import { auth } from 'logic/auth/provider';
import type { User } from 'logic/auth/auth'
import MoodWheel from 'components/MoodWheel/MoodWheel'
import RequireAuth from 'guards/RequireAuth'

export default function Journey(){
  const [user,setUser]=useState<User|null>(null)
  const [showProfile,setShowProfile]=useState(false)
  const [showSettings,setShowSettings]=useState(false)
  const [showSupport,setShowSupport]=useState(false)
  const [showFeedback,setShowFeedback]=useState(false)
  const [showNotifications,setShowNotifications]=useState(false)
  useEffect(()=>{(async()=>setUser(await auth.current()))(); const un=auth.onChange(setUser); return()=>{un()}},[])
  return (<RequireAuth>
    <div style={{position:'relative',minHeight:'100vh',color:'white'}}>
      <div style={{position:'absolute',inset:0,zIndex:0}}><Parallax/></div>
      <header style={{position:'relative',zIndex:2,display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,padding:'12px 16px',flexWrap:'wrap'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}><NavTabs/></div>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <ThemeToggle/>
          {user && <ProfileMenu user={user}
            onSignOut={async()=>{ await auth.signOut(); window.location.href='/' }}
            onOpenProfile={()=>setShowProfile(true)}
            onOpenSettings={()=>setShowSettings(true)}
            onOpenSupport={()=>setShowSupport(true)}
            onOpenFeedback={()=>setShowFeedback(true)}
            onOpenNotifications={()=>setShowNotifications(true)}
          />}
        </div>
      </header>
      <main style={{position:'relative',zIndex:2,padding:'16px'}}>
        <MoodWheel onChange={()=>{}}/>
      </main>
      <ProfilePanel open={showProfile} onClose={()=>setShowProfile(false)}/>
      <SettingsPanel open={showSettings} onClose={()=>setShowSettings(false)}/>
      <SupportPanel open={showSupport} onClose={()=>setShowSupport(false)}/>
      <FeedbackPanel open={showFeedback} onClose={()=>setShowFeedback(false)}/>
      <NotificationsPanel open={showNotifications} onClose={()=>setShowNotifications(false)}/>
    </div>
  </RequireAuth>)
}



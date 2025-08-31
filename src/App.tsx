import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Pages (must already exist in your project)
import Home from './pages/Home'
import Healing from './pages/Healing'
import Journey from './pages/Journey'
import Devotionals from './pages/Devotionals'
import Quotes from './pages/Quotes'

// Minimal guard that currently lets everything through (see src/guards/RequireAuth.tsx)
import RequireAuth from './guards/RequireAuth'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/healing" element={
          <RequireAuth>
            <Healing />
          </RequireAuth>
        } />
        <Route path="/journey" element={
          <RequireAuth>
            <Journey />
          </RequireAuth>
        } />
        <Route path="/devotionals" element={<Devotionals />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}





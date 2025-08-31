import React from "react"
import { Routes, Route, Link, Navigate } from "react-router-dom"
import Home from "@/pages/Home"
import Donate from "@/pages/Donate"
import HeavenlyExpress from "@/pages/HeavenlyExpress"

export default function App(){
  return (
    <div>
      <header className="afw-header">
        <nav className="afw-nav">
          <Link to="/">Home</Link>
          <Link to="/donate">Donations</Link>
          {/* Heavenly Express intentionally hidden from nav at launch */}
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/heavenly" element={<HeavenlyExpress />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

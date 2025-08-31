import React from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "@/pages/Home";
import Donate from "@/pages/Donate";
import HeavenlyExpress from "@/pages/HeavenlyExpress";
import ErrorBoundary from "components/System/ErrorBoundary";

function Header() {
  const loc = useLocation();
  return (
    <header style={{position:'fixed', top:0, left:0, right:0, display:'flex', gap:16, padding:'12px 16px', zIndex:50}}>
      <Link to="/" aria-current={loc.pathname==='/' ? 'page' : undefined}>Home</Link>
      <Link to="/donate" aria-current={loc.pathname==='/donate' ? 'page' : undefined}>Donations</Link>
      {/* HeavenlyExpress exists but intentionally hidden from nav */}
    </header>
  );
}

export default function App(){
  return (
    <ErrorBoundary>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/donate" element={<Donate/>} />
        <Route path="/heavenly" element={<HeavenlyExpress/>} />
      </Routes>
    </ErrorBoundary>
  );
}
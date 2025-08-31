import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '@/pages/Home';

// Minimal safe router: ensure "/" is Home. Other routes pass-through if they exist.
export default function App(){
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      {/* Keep existing pages working if present */}
      <Route path="/quotes" element={<div style={{color:'#fff',padding:24}}>Quotes page placeholder (rendered if your real /quotes route isn't wired yet).</div>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
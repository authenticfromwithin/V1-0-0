import React from "react";
import { Routes, Route, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Healing from "./pages/Healing";
import Journey from "./pages/Journey";
import Devotionals from "./pages/Devotionals";
import Quotes from "./pages/Quotes";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="app-root">
      <header className="nav">
        <Link className="brand" to="/">Authentic From Within</Link>
        <nav>
          <NavLink to="/quotes">Quotes</NavLink>
          <NavLink to="/devotionals">Devotionals</NavLink>
          <NavLink to="/healing">Healing</NavLink>
          <NavLink to="/journey">My Journey</NavLink>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quotes" element={<Quotes />} />
        <Route path="/devotionals" element={<Devotionals />} />
        <Route path="/healing" element={<Healing />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

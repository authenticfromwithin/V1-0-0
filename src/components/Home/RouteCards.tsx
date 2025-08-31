import React from 'react';
import { NavLink } from 'react-router-dom';
import Card from 'components/ui/Card';

function Item({ to, title, text }:{ to:string; title:string; text:string }){
  return (
    <NavLink to={to} style={{textDecoration:'none', color:'inherit'}}>
      <Card>
        <h3 style={{margin:'0 0 6px'}}>{title}</h3>
        <p className="afw-muted" style={{margin:0}}>{text}</p>
      </Card>
    </NavLink>
  );
}

export default function RouteCards(){
  return (
    <div className="home-grid" aria-label="Explore">
      <Item to="/devotionals" title="Daily Devotionals" text="Reading-first, with optional narration & captions."/>
      <Item to="/quotes" title="Quotes" text="Curated sayings that fit AFW’s tone."/>
      <Item to="/guide" title="Guide" text="What this sanctuary is, and how to move within it."/>
    </div>
  );
}





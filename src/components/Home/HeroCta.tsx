import React from 'react';
import { NavLink } from 'react-router-dom';
import Button from 'components/ui/Button';

export default function HeroCta(){
  return (
    <div className="home-cta" role="group" aria-label="Primary actions">
      <NavLink to="/healing"><Button variant="solid">Start Healing</Button></NavLink>
      <NavLink to="/journey"><Button variant="ghost">Start My Journey</Button></NavLink>
    </div>
  );
}



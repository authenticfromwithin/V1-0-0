import React from 'react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from 'components/ui/ThemeToggle';
import SoundToggle from 'components/ui/SoundToggle';

const cx = (isActive:boolean) => (isActive ? 'active' : undefined);

export default function Header(){
  return (
    <header role="banner" className="site-header">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="inner">
        <div className="brand">
          <span aria-label="Authentic From Within" className="logo">AFW</span>
          <span className="wordmark">Authentic From Within</span>
        </div>
        <nav aria-label="Primary" className="nav">
          <NavLink to="/" end className={({isActive})=>cx(isActive)}>Home</NavLink>
          <NavLink to="/healing" className={({isActive})=>cx(isActive)}>Healing</NavLink>
          <NavLink to="/journey" className={({isActive})=>cx(isActive)}>My Journey</NavLink>
          <NavLink to="/devotionals" className={({isActive})=>cx(isActive)}>Devotionals</NavLink>
          <NavLink to="/quotes" className={({isActive})=>cx(isActive)}>Quotes</NavLink>
          <NavLink to="/qa" className={({isActive})=>cx(isActive)}>QA</NavLink>
          <NavLink to="/tools" className={({isActive})=>cx(isActive)}>Tools</NavLink>
        </nav>
        <div className="tools">
          <SoundToggle/>
          <ThemeToggle/>
        </div>
      </div>
    </header>
  );
}

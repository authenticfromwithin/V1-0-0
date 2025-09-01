import React from "react";
export default function Splash({onEnter}:{onEnter:()=>void}){
  return (<div className="splash-overlay"><div className="splash-card glass">
    <h1 className="title title-bloom">Authentic From Within</h1>
    <p className="subtitle">Night. Forest. Firelight. Breathe in.</p>
    <div className="actions"><button className="btn" onClick={onEnter} autoFocus>Enter</button></div>
    <p className="splash-note">Your journal is private on this device.</p>
  </div></div>);
}

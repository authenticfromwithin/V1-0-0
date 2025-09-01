import React from "react"; import { createRoot } from "react-dom/client";
function App(){ return (<div style={{padding:20,color:"#e9eef2",background:"#0b0f12",minHeight:"100vh"}}><h1>AFW Admin</h1><p>Content manifests only. Journals are always private.</p></div>); }
createRoot(document.getElementById("root")!).render(<App/>);

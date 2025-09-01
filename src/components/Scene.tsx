import React,{useEffect,useRef} from "react";
export function Scene(){
  const ref=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{
    const c=ref.current!; const dpr=Math.min(devicePixelRatio||1,2);
    const ctx=c.getContext("2d",{alpha:false})!;
    let w=c.width=Math.floor(innerWidth*dpr), h=c.height=Math.floor(innerHeight*dpr);
    let theme=(document.documentElement.getAttribute("data-theme") as string)||"forest";
    const mo=new MutationObserver(()=>{ theme=(document.documentElement.getAttribute("data-theme") as string)||"forest" });
    mo.observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
    const rnd=(n:number)=>Math.random()*n;
    const stars=new Array(500).fill(0).map(()=>({x:rnd(w),y:rnd(h*0.55),r:Math.random()*1.2+0.2,a:Math.random()*0.6+0.2}));
    let embers=new Array(260).fill(0).map(()=>({x:rnd(w),y:h-rnd(70),vx:(rnd(1)-0.5)*0.35,vy:-rnd(1)-0.6,life:rnd(90)+30}));
    let bubbles=new Array(180).fill(0).map(()=>({x:rnd(w),y:h-rnd(h*0.6),r:rnd(2)+0.7,vy:-rnd(0.5)-0.25}));
    let leaves=new Array(130).fill(0).map(()=>({x:rnd(w),y:rnd(h),vx:(Math.random()<0.5?-1:1)*(rnd(0.35)+0.12),vy:rnd(0.18)+0.06,rot:rnd(Math.PI*2)}));
    let snow=new Array(240).fill(0).map(()=>({x:rnd(w),y:rnd(h),r:rnd(2.0)+0.9,vx:(rnd(0.3)-0.15),vy:rnd(0.38)+0.18}));
    const draw=()=>{
      const sky=ctx.createLinearGradient(0,0,0,h);
      if(theme==="ocean"){ sky.addColorStop(0,"#041018"); sky.addColorStop(0.55,"#0a1e2e"); sky.addColorStop(1,"#031018"); }
      else if(theme==="mountain"){ sky.addColorStop(0,"#06080b"); sky.addColorStop(0.55,"#0a0e13"); sky.addColorStop(1,"#04070a"); }
      else if(theme==="autumn"){ sky.addColorStop(0,"#0b0907"); sky.addColorStop(0.55,"#150f0a"); sky.addColorStop(1,"#090705"); }
      else if(theme==="snow"){ sky.addColorStop(0,"#0b0f14"); sky.addColorStop(0.55,"#0b0f14"); sky.addColorStop(1,"#070a0f"); }
      else { sky.addColorStop(0,"#07090c"); sky.addColorStop(0.5,"#0a0c10"); sky.addColorStop(1,"#050609"); }
      ctx.fillStyle=sky; ctx.fillRect(0,0,w,h);
      // starfield
      ctx.globalAlpha=0.9; for(const s of stars){ ctx.fillStyle=`rgba(255,255,255,${s.a})`; ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill(); } ctx.globalAlpha=1;
      // ground glow
      const tint = theme==="ocean" ? "rgba(150,200,255,0.24)" : theme==="snow" ? "rgba(220,235,255,0.22)" : theme==="autumn" ? "rgba(255,180,110,0.32)" : "rgba(255,205,130,0.35)";
      const g = ctx.createRadialGradient(w*0.5,h*0.82,10,w*0.5,h,Math.max(w,h)*0.9);
      g.addColorStop(0,tint); g.addColorStop(0.35,"rgba(45,28,12,0.25)"); g.addColorStop(1,"rgba(0,0,0,1)");
      ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      // particles
      if(theme==="forest"||theme==="autumn"){
        embers.forEach(s=>{ s.x+=s.vx; s.y+=s.vy; s.life-=1; s.vy-=0.004;
          if(s.life<=0||s.y<0||s.x<0||s.x>w){ s.x=rnd(w); s.y=h-rnd(50); s.vx=(rnd(1)-0.5)*0.3; s.vy=-rnd(1)-0.5; s.life=rnd(90)+30 }
          const r=Math.max(0.7,(s.life/120)*2.6);
          ctx.globalCompositeOperation="lighter";
          ctx.fillStyle="rgba(255,160,70,0.18)"; ctx.beginPath(); ctx.arc(s.x,s.y,r*3.3,0,Math.PI*2); ctx.fill();
          ctx.fillStyle="rgba(255,235,180,0.85)"; ctx.beginPath(); ctx.arc(s.x,s.y,r,0,Math.PI*2); ctx.fill();
          ctx.globalCompositeOperation="source-over";
        });
      }
      if(theme==="ocean"){ bubbles.forEach(b=>{ b.y+=b.vy; if(b.y<h*0.12){ b.y=h*0.9; b.x=rnd(w) } ctx.fillStyle="rgba(170,210,255,0.65)"; ctx.beginPath(); ctx.arc(b.x,b.y,b.r,0,Math.PI*2); ctx.fill(); }); }
      if(theme==="autumn"){ ctx.fillStyle="rgba(255,180,110,0.95)"; leaves.forEach(L=>{ L.x+=L.vx; L.y+=L.vy; L.rot+=0.02; if(L.y>h){ L.y=-10; L.x=rnd(w) } ctx.save(); ctx.translate(L.x,L.y); ctx.rotate(L.rot); ctx.beginPath(); ctx.moveTo(0,-4); ctx.lineTo(3,2); ctx.lineTo(-3,2); ctx.closePath(); ctx.fill(); ctx.restore(); }); }
      if(theme==="snow"){ ctx.fillStyle="rgba(255,255,255,0.92)"; snow.forEach(f=>{ f.x+=f.vx; f.y+=f.vy; if(f.y>h){ f.y=-5; f.x=rnd(w) } ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2); ctx.fill(); }); }
      // silhouettes
      if(theme==="mountain"){ ctx.fillStyle="rgba(0,0,0,0.72)"; const base=h*0.62; for(let i=0;i<7;i++){ const off=i*160+40; ctx.beginPath(); ctx.moveTo(off,base+20); ctx.lineTo(off+140,base-170); ctx.lineTo(off+280,base+20); ctx.closePath(); ctx.fill(); } }
      else if(theme==="ocean"){ ctx.fillStyle="rgba(0,0,0,0.58)"; ctx.beginPath(); ctx.moveTo(0,h*0.78); for(let x=0;x<=w;x+=40) ctx.lineTo(x,h*0.78+Math.sin(x/90)*12); ctx.lineTo(w,h); ctx.lineTo(0,h); ctx.closePath(); ctx.fill(); }
      else { ctx.fillStyle="rgba(0,0,0,0.67)"; const base=h*0.82; for(let i=0;i<w;i+=140){ ctx.beginPath(); ctx.moveTo(i+20,base+20); ctx.lineTo(i+60,base-120); ctx.lineTo(i+100,base+20); ctx.closePath(); ctx.fill(); } }
      // vignette
      const v=ctx.createRadialGradient(w*0.5,h*0.58,Math.min(w,h)*0.22,w*0.5,h*0.6,Math.max(w,h)*0.85);
      v.addColorStop(0,"rgba(0,0,0,0)"); v.addColorStop(1,"rgba(0,0,0,0.72)"); ctx.fillStyle=v; ctx.fillRect(0,0,w,h);
      requestAnimationFrame(draw);
    };
    const onR=()=>{ w=c.width=Math.floor(innerWidth*dpr); h=c.height=Math.floor(innerHeight*dpr) };
    addEventListener("resize",onR); draw(); return ()=>{ removeEventListener("resize",onR); mo.disconnect() };
  },[]);
  return <canvas className="fire" ref={ref} />;
}



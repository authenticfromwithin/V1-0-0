import React from "react";
type Props={size?:number;variant?:"auto"|"light"|"dark";className?:string;title?:string;};
export default function LogoMark({size=64,variant="auto",className="",title="Authentic From Within"}:Props){
  const style:React.CSSProperties={height:size,width:"auto"}; const v=variant==="auto"?"":`brand-${variant}`;
  return (<img src="/assets/brand/afw-logo-512.png" alt="Authentic From Within" title={title}
    className={["afw-logo",v,className].filter(Boolean).join(" ")} style={style} decoding="async" loading="eager" />);
}
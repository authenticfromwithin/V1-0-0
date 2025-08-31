import React from "react";

export default class ErrorBoundary extends React.Component<{children: React.ReactNode}, {error: any}> {
  constructor(props:any){ super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error:any){ return { error }; }
  componentDidCatch(error:any, info:any){ console.error("App crash:", error, info); }
  render(){
    if (this.state.error) {
      return <div style={{padding:16,fontFamily:"sans-serif"}}>
        <h2>Something went wrong.</h2>
        <pre style={{whiteSpace:"pre-wrap"}}>{String(this.state.error?.message||this.state.error)}</pre>
      </div>;
    }
    return this.props.children as any;
  }
}



import React from "react";

type Props = { children: React.ReactNode };
type State = { hasError: boolean, message?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(err: any) {
    return { hasError: true, message: err?.message || String(err) };
  }
  componentDidCatch(error: any, info: any) {
    if (import.meta.env.DEV) {
      // dev overlay: log only in development, never render in prod
      console.error("[AFW ErrorBoundary]", error, info);
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding:24, color:"#fff"}}>
          <h1>Something went wrong.</h1>
          {import.meta.env.DEV && <pre>{this.state.message}</pre>}
        </div>
      );
    }
    return this.props.children;
  }
}
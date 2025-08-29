import React from "react";

type Props = { children: React.ReactNode };
type State = { error?: Error };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = {};

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Surface in logs for Vercel
    console.error("App crashed:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, maxWidth: 800, margin: "40px auto" }}>
          <h1 style={{ margin: 0, fontSize: 28 }}>Something went wrong.</h1>
          <p style={{ opacity: 0.8 }}>
            The app hit a runtime error. Check the browser Console for details.
          </p>
          <pre style={{
            whiteSpace: "pre-wrap",
            background: "#111827",
            color: "#f9fafb",
            padding: 16,
            borderRadius: 8,
            overflowX: "auto"
          }}>
            {String(this.state.error.stack || this.state.error.message)}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

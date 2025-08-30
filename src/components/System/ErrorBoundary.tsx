import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; error?: unknown; info?: unknown };

/**
 * Minimal production Error Boundary.
 * - Prevents the whole app from going blank
 * - Logs details to the console (visible when using ?afwdebug=1 and opening devtools)
 */
export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // Keep it quiet unless debug flag is present, but still log for diagnostics
    // @ts-ignore
    if (typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('afwdebug')) {
      console.error('AFW ErrorBoundary caught an error:', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'}}>
          <h1 style={{margin: 0, fontSize: 22}}>Something went wrong.</h1>
          <p style={{marginTop: 8}}>Append <code>?afwdebug=1</code> to the URL for details.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

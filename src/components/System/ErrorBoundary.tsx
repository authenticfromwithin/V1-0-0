import React from 'react';

type Props = { children: React.ReactNode };
type State = { hasError: boolean; message?: string; stack?: string };

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true, message: String(error?.message ?? error), stack: error?.stack };
  }

  componentDidCatch(error: any, info: any) {
    // Always log to console
    console.error('AFW ErrorBoundary caught an error:', error, info);
    // Push into overlay if enabled
    (window as any).__AFW_PUSH_ERROR?.(error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui,Segoe UI,Roboto,Helvetica,Arial', lineHeight: 1.5 }}>
          <h1 style={{ margin: 0, fontSize: '1.25rem' }}>Something went wrong</h1>
          <p style={{ opacity: 0.85 }}>The page failed to render. Please refresh the page.</p>
          {(window as any).__AFW_DEBUG && (
            <pre style={{ whiteSpace: 'pre-wrap', opacity: 0.8 }}>
              {(this.state.message ?? '') + '\n' + (this.state.stack ?? '')}
            </pre>
          )}
        </div>
      );
    }
    return this.props.children as any;
  }
}

import './styles/globals.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import ErrorBoundary from './components/System/ErrorBoundary';
import App from './App'; // adjust if your entry component has a different path/name

const rootEl = document.getElementById('root');
if (!rootEl) {
  throw new Error('Root element #root not found');
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);



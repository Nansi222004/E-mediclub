import { createRoot } from 'react-dom/client'
import './shared/styles/index.css'
import App from './App.jsx'
import ErrorBoundary from './shared/components/ErrorBoundary'

// Suppress removeChild warnings during development
const originalError = console.error;
console.error = function(...args) {
  if (typeof args[0] === 'string' && args[0].includes('removeChild')) {
    return; // Silently ignore removeChild errors
  }
  originalError.apply(console, args);
};

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)

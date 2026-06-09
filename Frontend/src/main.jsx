import { createRoot } from 'react-dom/client'
import './shared/styles/index.css'
import App from './App.jsx'
import ErrorBoundary from './shared/components/ErrorBoundary'

// Patch DOM Node methods to prevent browser extensions (like Google Translate) from crashing React on unmounting/removal
if (typeof Node !== 'undefined' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function (child) {
    if (child && child.parentNode === this) {
      return originalRemoveChild.call(this, child);
    }
    return child;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode);
  };
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
)

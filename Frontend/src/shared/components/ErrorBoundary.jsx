import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorCount: 0,
      lastErrorTime: null
    };
    this.resetTimer = null;
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const now = Date.now();
    const timeSinceLastError = this.state.lastErrorTime ? now - this.state.lastErrorTime : Infinity;
    
    // Track error frequency
    if (timeSinceLastError < 1000) {
      this.setState(prev => ({ errorCount: prev.errorCount + 1 }));
    } else {
      this.setState({ errorCount: 1 });
    }

    this.setState({ lastErrorTime: now });

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // Silently recover from DOM manipulation errors with auto-reset
      if (this.state.error?.message?.includes('removeChild') || 
          this.state.error?.message?.includes('removeChildFromContainer')) {
        
        // Clear any pending resets
        if (this.resetTimer) clearTimeout(this.resetTimer);
        
        // Auto-reset after a short delay to allow React to recover
        this.resetTimer = setTimeout(() => {
          this.resetError();
        }, 150);
        
        return null; // Don't render anything during recovery
      }

      // For other errors, show error UI
      return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
          <div className="max-w-md text-center">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Something went wrong</h1>
            <p className="text-slate-600 mb-2 text-sm">{this.state.error?.message}</p>
            {this.state.errorCount > 2 && (
              <p className="text-slate-500 text-xs mb-4">
                This error occurred {this.state.errorCount} times. If it persists, try refreshing the page.
              </p>
            )}
            <button
              onClick={this.resetError}
              className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-semibold text-sm"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="ml-2 px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition font-semibold text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

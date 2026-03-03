import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: '#F9FAFB',
          padding: '2rem',
        }}>
          <div style={{ textAlign: 'center', maxWidth: '480px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              background: '#FEF2F2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              fontSize: '1.5rem',
            }}>
              !
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#09080E', margin: '0 0 0.5rem' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#4B5563', fontSize: '0.875rem', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#064A6C',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '7px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Refresh Page
            </button>
            {this.state.error && (
              <pre style={{
                marginTop: '2rem',
                padding: '1rem',
                background: '#F3F4F6',
                borderRadius: '7px',
                fontSize: '0.75rem',
                color: '#6B7280',
                textAlign: 'left',
                overflow: 'auto',
                maxHeight: '200px',
              }}>
                {this.state.error.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

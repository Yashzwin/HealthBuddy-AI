import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
    this.setState({ info });
  }

  reset = () => this.setState({ hasError: false, error: null, info: null });

  render() {
    if (this.state.hasError) {
      const errMsg = String(this.state.error?.message || this.state.error || 'Unknown error');
      const stack = String(this.state.error?.stack || '');
      const componentStack = String(this.state.info?.componentStack || '');

      const copyDetails = () => {
        const text = `Error: ${errMsg}\n\nStack:\n${stack}\n\nComponent stack:\n${componentStack}`;
        try {
          navigator.clipboard?.writeText(text);
        } catch {}
      };

      return (
        <div className="min-h-screen bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-3xl">
            <div className="rounded-2xl border border-destructive/30 bg-card p-6 shadow-soft sm:p-8">
              <h1 className="text-2xl font-bold text-foreground">Dashboard crashed</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Something inside the dashboard threw an error. The full details are below — please share them so I can fix it.
              </p>
              <pre className="mt-5 max-h-72 overflow-auto rounded-xl border border-border/60 bg-muted/40 p-4 text-xs leading-relaxed text-foreground whitespace-pre-wrap break-words">
                <strong>Message:</strong> {errMsg}
                {stack ? `\n\nStack:\n${stack}` : ''}
                {componentStack ? `\n\nComponent stack:\n${componentStack}` : ''}
              </pre>
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={this.reset}
                  className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow"
                >
                  Try again
                </button>
                <button
                  type="button"
                  onClick={copyDetails}
                  className="rounded-full border border-border/60 bg-card px-5 py-2 text-sm font-semibold"
                >
                  Copy error
                </button>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="rounded-full border border-border/60 bg-card px-5 py-2 text-sm font-semibold"
                >
                  Reload page
                </button>
                <button
                  type="button"
                  onClick={() => {
                    try { localStorage.clear(); } catch {}
                    window.location.href = '/';
                  }}
                  className="rounded-full border border-destructive/30 bg-destructive/5 px-5 py-2 text-sm font-semibold text-destructive"
                >
                  Clear saved data and reset
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

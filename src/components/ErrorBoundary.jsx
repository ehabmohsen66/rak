import React from 'react';
import { RefreshCw, AlertTriangle, Home } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("Uncaught React Render Error:", error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleResetState = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (window.location.hash || window.location.search) {
      window.location.href = window.location.pathname;
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-rak-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans selection:bg-rak-magenta selection:text-white">
          <div className="max-w-lg w-full bg-rak-slate-900 border border-rak-slate-800 rounded-3xl p-8 space-y-6 text-center shadow-2xl backdrop-blur-xl">
            <div className="flex justify-center">
              <BrandLogo className="h-12 w-auto" />
            </div>

            <div className="w-16 h-16 bg-rak-magenta/20 border border-rak-magenta/40 text-rak-magenta rounded-full flex items-center justify-center mx-auto shadow-magenta-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-extrabold text-white tracking-tight">
                Temporary View Disruption
              </h1>
              <p className="text-xs text-rak-slate-300 leading-relaxed">
                An unexpected component rendering anomaly occurred. Our self-healing system prevented a complete page failure.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 bg-rak-slate-950 border border-rak-slate-800 rounded-xl text-[11px] font-mono text-rak-magenta/90 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-3 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-glow flex items-center justify-center space-x-2 transition-all"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                <span>Reload Application</span>
              </button>

              <button
                onClick={this.handleResetState}
                className="w-full sm:w-auto px-6 py-3 bg-rak-slate-800 hover:bg-rak-slate-700 text-rak-slate-200 text-xs font-bold uppercase tracking-wider rounded-full border border-rak-slate-700 transition-all flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Reset View</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

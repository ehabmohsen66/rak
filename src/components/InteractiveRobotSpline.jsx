import React, { Component, Suspense, lazy } from 'react';
import { Bot, Sparkles, Cpu, Zap } from 'lucide-react';

const Spline = lazy(() => import('@splinetool/react-spline'));

class SplineErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn("Spline 3D scene load warning, rendering fallback visual:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-rak-slate-950 via-rak-slate-900 to-rak-slate-950 text-white rounded-2xl relative overflow-hidden border border-rak-slate-800">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-rak-magenta/20 rounded-full blur-3xl pointer-events-none" />
          <div className="p-4 rounded-full bg-rak-slate-900 border border-rak-magenta/40 text-rak-magenta mb-4 shadow-magenta-sm animate-pulse">
            <Bot className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white flex items-center space-x-2">
            <span>RAK AI 3D ENGINE</span>
            <Sparkles className="w-4 h-4 text-rak-magenta" />
          </h3>
          <p className="text-xs text-rak-slate-300 text-center max-w-xs mt-2 font-mono">
            Interactive AI architecture & executive editorial insights.
          </p>
          <div className="flex items-center space-x-4 pt-4 text-[10px] font-mono text-rak-magenta">
            <span className="flex items-center space-x-1"><Cpu className="w-3.5 h-3.5" /><span>GPT-4o INTEGRATED</span></span>
            <span>•</span>
            <span className="flex items-center space-x-1"><Zap className="w-3.5 h-3.5" /><span>3D HARDWARE ACCELERATED</span></span>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function InteractiveRobotSpline({ 
  scene = "https://prod.spline.design/kZ4eeUxIZoKVluWo/scene.splinecode", 
  className = "" 
}) {
  return (
    <SplineErrorBoundary>
      <Suspense
        fallback={
          <div className={`w-full h-full flex items-center justify-center bg-rak-slate-950 text-white rounded-3xl ${className}`}>
            <div className="flex items-center space-x-3 text-rak-magenta">
              <svg className="animate-spin h-6 w-6 text-rak-magenta" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"></path>
              </svg>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-rak-slate-400">Initializing RAK 3D Spline Engine...</span>
            </div>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className} 
        />
      </Suspense>
    </SplineErrorBoundary>
  );
}

export default InteractiveRobotSpline;

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Layers, 
  Code, 
  TrendingUp, 
  Video, 
  Target,
  Activity, 
  Workflow, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  ShieldCheck, 
  Sparkles,
  GitBranch,
  Radio,
  Cpu
} from 'lucide-react';

export const AgencyOrchestrationMatrix = ({ onOpenPlanner }) => {
  const [activeUnit, setActiveUnit] = useState(0);
  const [isSimulating, setIsSimulating] = useState(true);
  const [telemetryPulse, setTelemetryPulse] = useState(99.9);
  const [syncSpeed, setSyncSpeed] = useState(12);

  const units = [
    {
      id: 'strategy',
      name: 'Brand Strategy & Intel',
      code: 'UNIT-01',
      icon: Compass,
      tagline: 'Foundational Market Positioning & Core Narrative',
      color: 'from-amber-500 to-rak-magenta',
      status: 'Active Matrix Anchor',
      output: 'Brand Architecture Specs & Persona Datasets',
      downstreamSync: 'Feeds Design Tokens & Media Buying Strategy',
      metrics: [
        { label: 'Market Alignment', value: '99.4%' },
        { label: 'Strategic Intel Score', value: '98/100' },
        { label: 'Persona Mapping', value: 'Real-time' }
      ]
    },
    {
      id: 'design',
      name: 'UI/UX & Design Tokens Engine',
      code: 'UNIT-02',
      icon: Layers,
      tagline: 'Systematic Design Architecture & UI Systems',
      color: 'from-rak-magenta to-purple-600',
      status: 'Token Pipeline Syncing',
      output: 'Figma Token Schema & React Component Library',
      downstreamSync: 'Automated CI/CD Sync to Web & Ad Creatives',
      metrics: [
        { label: 'Token Sync Latency', value: '< 12ms' },
        { label: 'Accessibility Audit', value: 'WCAG AAA' },
        { label: 'Design Consistency', value: '100%' }
      ]
    },
    {
      id: 'engineering',
      name: 'Enterprise Web & WebGL Engine',
      code: 'UNIT-03',
      icon: Code,
      tagline: 'High-Performance Frontend & Web Architecture',
      color: 'from-cyan-500 to-blue-600',
      status: 'Zero-Latency Runtime',
      output: 'Vite/Next.js Core & WebGL Shader Pipelines',
      downstreamSync: 'Telemetry Feedback to Growth Engine',
      metrics: [
        { label: 'Lighthouse Score', value: '100/100' },
        { label: 'First Contentful Paint', value: '0.3s' },
        { label: 'Shader Render Rate', value: '60 FPS' }
      ]
    },
    {
      id: 'media-buying',
      name: 'Media Buying & Performance Ad Ops',
      code: 'UNIT-04',
      icon: Target,
      tagline: 'Omnichannel Paid Media & Dynamic Ad Scaling',
      color: 'from-indigo-500 to-blue-600',
      status: 'Ad Bidding Engine Live',
      output: 'Omnichannel Campaigns (Google, Meta, LinkedIn, TikTok)',
      downstreamSync: 'Drives Paid Traffic to High-CRO Landing Pages',
      metrics: [
        { label: 'ROAS Benchmark', value: '3.8x Avg' },
        { label: 'Managed Ad Spend', value: '$12.4M+' },
        { label: 'CPC Optimization', value: '-34% Cost' }
      ]
    },
    {
      id: 'telemetry',
      name: 'Growth & CRO Telemetry Engine',
      code: 'UNIT-05',
      icon: TrendingUp,
      tagline: 'Real-Time User Behavior & Conversion Optics',
      color: 'from-emerald-400 to-teal-600',
      status: 'Telemetry Stream Live',
      output: 'A/B Test Signals & Live Bidding Feedback Loop',
      downstreamSync: 'Triggers Dynamic Ad & Strategy Refinements',
      metrics: [
        { label: 'CRO Lift Benchmark', value: '+180%' },
        { label: 'Live Data Stream', value: '1.2M events/s' },
        { label: 'Conversion Velocity', value: '3.4x Industry Avg' }
      ]
    },
    {
      id: 'content',
      name: 'Creative Content & Motion Studio',
      code: 'UNIT-06',
      icon: Video,
      tagline: 'Cinematic 3D, Video Ad Creative & Copy Studio',
      color: 'from-rose-500 to-rak-magenta',
      status: 'Assets Streamed',
      output: 'High-Converting Video Ads, 3D Renders & Copy',
      downstreamSync: 'Pushed Directly to Media Buying & UI Pipelines',
      metrics: [
        { label: 'Frame Precision', value: '4K Native' },
        { label: 'Ad CTR Impact', value: '+210%' },
        { label: 'Brand Voice Score', value: '100%' }
      ]
    }
  ];

  // Auto-simulate workflow loop across 6 units
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setActiveUnit((prev) => (prev + 1) % units.length);
      setTelemetryPulse((prev) => +(99.5 + Math.random() * 0.4).toFixed(2));
      setSyncSpeed((prev) => Math.floor(8 + Math.random() * 8));
    }, 4500);
    return () => clearInterval(interval);
  }, [isSimulating, units.length]);

  const currentUnit = units[activeUnit];
  const CurrentIcon = currentUnit.icon;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-rak-slate-950 border border-rak-slate-800 p-6 sm:p-10 shadow-2xl">
      {/* Background Ambient Glow & Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-rak-magenta/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-10">
        
        {/* Header Title */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-rak-slate-800/80">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-rak-slate-900 border border-rak-magenta/40 rounded-full text-rak-magenta text-xs font-bold uppercase tracking-widest">
              <Workflow className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Inter-Unit Orchestration Framework</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Agency Unit Orchestration System.
            </h2>
            <p className="text-sm text-rak-slate-300 max-w-2xl leading-relaxed">
              How RAK 4 CREATIVE’s 6 specialized units—from Strategy & Design to Media Buying & CRO—operate as an interlocked operating engine for enterprise revenue.
            </p>
          </div>

          {/* Simulation Toggle & Live Pulse */}
          <div className="flex items-center space-x-4 bg-rak-slate-900/90 border border-rak-slate-800 p-2.5 rounded-2xl backdrop-blur-md">
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-rak-slate-950 rounded-xl border border-rak-slate-800">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 font-bold">LIVE TELEMETRY {telemetryPulse}%</span>
            </div>

            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isSimulating 
                  ? 'bg-rak-magenta text-white shadow-magenta-sm' 
                  : 'bg-rak-slate-800 text-rak-slate-300 hover:text-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
              <span>{isSimulating ? 'Auto-Orchestrating' : 'Paused'}</span>
            </button>
          </div>
        </div>

        {/* Unit Selector Pipeline Matrix (6 Units) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {units.map((unit, index) => {
            const Icon = unit.icon;
            const isActive = activeUnit === index;
            return (
              <button
                key={unit.id}
                onClick={() => {
                  setActiveUnit(index);
                  setIsSimulating(false);
                }}
                className={`relative p-3.5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between space-y-3 ${
                  isActive
                    ? 'bg-gradient-to-br from-rak-slate-900 via-rak-slate-900/90 to-rak-slate-800 border-rak-magenta shadow-magenta-sm scale-[1.02]'
                    : 'bg-rak-slate-900/50 border-rak-slate-800/80 hover:border-rak-slate-700 hover:bg-rak-slate-900/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-rak-slate-400">{unit.code}</span>
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-rak-magenta animate-ping' : 'bg-rak-slate-700'}`} />
                </div>

                <div className="flex items-center space-x-2.5">
                  <div className={`p-2 rounded-xl bg-rak-slate-800 border border-rak-slate-700 ${isActive ? 'text-rak-magenta' : 'text-rak-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-tight">{unit.name}</h3>
                  </div>
                </div>

                {/* Progress Pipeline Indicator */}
                <div className="w-full bg-rak-slate-800 h-1 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${unit.color} transition-all duration-500 ${isActive ? 'w-full' : 'w-1/4 opacity-40'}`} 
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Orchestration Active Node Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-rak-slate-900/80 border border-rak-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
          
          {/* Active Unit Focus */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="flex items-center space-x-3">
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${currentUnit.color} text-white shadow-lg`}>
                <CurrentIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-rak-magenta">{currentUnit.code}</span>
                  <span className="text-xs text-rak-slate-500">•</span>
                  <span className="text-xs text-emerald-400 font-mono font-semibold">{currentUnit.status}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {currentUnit.name}
                </h3>
              </div>
            </div>

            <p className="text-sm text-rak-slate-300 leading-relaxed font-medium">
              {currentUnit.tagline}
            </p>

            {/* Inter-Unit Output & Pipeline Handshake */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-rak-slate-950/80 border border-rak-slate-800 space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-rak-slate-400 font-bold flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Primary Unit Deliverables</span>
                </div>
                <div className="text-xs font-semibold text-white">{currentUnit.output}</div>
              </div>

              <div className="p-4 rounded-2xl bg-rak-slate-950/80 border border-rak-slate-800 space-y-1.5">
                <div className="text-[10px] font-mono uppercase text-rak-slate-400 font-bold flex items-center space-x-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-rak-magenta" />
                  <span>Automated Downstream Sync</span>
                </div>
                <div className="text-xs font-semibold text-white">{currentUnit.downstreamSync}</div>
              </div>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-rak-slate-800">
              {currentUnit.metrics.map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="text-lg sm:text-xl font-extrabold text-white tracking-tight">{m.value}</div>
                  <div className="text-[10px] font-medium text-rak-slate-400 leading-tight">{m.label}</div>
                </div>
              ))}
            </div>

          </div>

          {/* Inter-Unit Flow Diagram & Action */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-rak-slate-950/90 border border-rak-slate-800/80 rounded-2xl p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-rak-magenta" />
                  <span>Synchronized Pipeline Flow</span>
                </span>
                <span className="text-[10px] font-mono text-rak-magenta">Latency {syncSpeed}ms</span>
              </div>

              <div className="space-y-2.5">
                {units.map((u, i) => {
                  const isCurrent = i === activeUnit;
                  const Icon = u.icon;
                  return (
                    <div 
                      key={u.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                        isCurrent 
                          ? 'bg-rak-slate-900 border-rak-magenta/60 text-white shadow-md' 
                          : 'bg-rak-slate-900/40 border-rak-slate-800/60 text-rak-slate-400'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-rak-magenta' : 'text-rak-slate-500'}`} />
                        <span className="text-xs font-semibold">{u.name}</span>
                      </div>
                      
                      {isCurrent ? (
                        <span className="px-2 py-0.5 text-[9px] font-bold font-mono bg-rak-magenta/20 text-rak-magenta border border-rak-magenta/30 rounded-full animate-pulse">
                          EXECUTING
                        </span>
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={onOpenPlanner}
              className="w-full py-3.5 px-4 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-magenta-sm transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Deploy Orchestrated Agency Team</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

          </div>

        </div>

      </div>
    </section>
  );
};

export default AgencyOrchestrationMatrix;

import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Layers, 
  Code, 
  TrendingUp, 
  Video, 
  Target,
  Activity, 
  GitMerge, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  Radio,
  Cpu,
  BarChart3
} from 'lucide-react';

export const HeroAgencyOrchestrationCard = ({ onOpenPlanner }) => {
  const [activeNode, setActiveNode] = useState(0);
  const [pulseIndex, setPulseIndex] = useState(0);

  const agencyUnits = [
    {
      id: 'unit-1',
      code: 'UNIT 01',
      name: 'Strategy & Intel',
      short: 'Strategy',
      icon: Compass,
      metric: 'Positioning Sync',
      val: '100%',
      color: 'from-amber-500 to-rak-magenta',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      description: 'Feeds market insights & brand positioning data directly to UI/UX, Media Buying & Code pipelines.'
    },
    {
      id: 'unit-2',
      code: 'UNIT 02',
      name: 'UI/UX & Tokens',
      short: 'Design',
      icon: Layers,
      metric: 'Design Tokens v4.2',
      val: '99.9%',
      color: 'from-rak-magenta to-purple-500',
      badgeColor: 'text-rak-magenta bg-rak-magenta/10 border-rak-magenta/30',
      description: 'Automated CI/CD sync translates Figma design tokens straight to React & WebGL shaders.'
    },
    {
      id: 'unit-3',
      code: 'UNIT 03',
      name: 'Web & WebGL Core',
      short: 'Engine',
      icon: Code,
      metric: 'Render Speed',
      val: '60 FPS',
      color: 'from-cyan-400 to-blue-600',
      badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
      description: 'Zero-latency web architecture executing pixel-perfect code with ultra-fast page load times.'
    },
    {
      id: 'unit-4',
      code: 'UNIT 04',
      name: 'Media Buying & Ad Ops',
      short: 'Media Buying',
      icon: Target,
      metric: 'Targeted ROAS',
      val: '3.8x Avg',
      color: 'from-indigo-500 to-blue-500',
      badgeColor: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30',
      description: 'Omnichannel performance ad scaling & dynamic creative optimization synced with landing pages.'
    },
    {
      id: 'unit-5',
      code: 'UNIT 05',
      name: 'Growth Telemetry',
      short: 'Telemetry',
      icon: TrendingUp,
      metric: 'CRO Lift',
      val: '+180%',
      color: 'from-emerald-400 to-teal-500',
      badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      description: 'Live user behavior telemetry feeding real-time CRO & media bidding optimization loops.'
    },
    {
      id: 'unit-6',
      code: 'UNIT 06',
      name: 'Content & Motion',
      short: 'Motion',
      icon: Video,
      metric: '3D/Asset Stream',
      val: '4K Native',
      color: 'from-rose-500 to-rak-magenta',
      badgeColor: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
      description: 'Cinematic 3D ad creatives & micro-copy seamlessly woven into media campaigns & UI.'
    }
  ];

  // Auto-pulse workflow loop across 6 agency units
  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % agencyUnits.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [agencyUnits.length]);

  const activeUnit = agencyUnits[activeNode];
  const CurrentIcon = activeUnit.icon;

  return (
    <div className="relative rounded-3xl p-1 bg-gradient-to-b from-rak-magenta/50 via-rak-slate-800 to-rak-slate-950 shadow-2xl overflow-hidden group">
      
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-64 h-64 bg-rak-magenta/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative rounded-[22px] bg-rak-slate-950/95 p-5 sm:p-6 space-y-5 backdrop-blur-xl">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-rak-slate-800/80">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono font-extrabold uppercase text-white tracking-widest flex items-center space-x-1.5">
              <span>AGENCY ORCHESTRATION MATRIX</span>
            </span>
          </div>

          <div className="px-2.5 py-1 bg-rak-slate-900 border border-rak-slate-800 rounded-full text-[10px] font-mono text-emerald-400 font-bold flex items-center space-x-1">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>SYNC 99.9%</span>
          </div>
        </div>

        {/* 6 Interlocked Agency Units Grid Nodes */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
          {agencyUnits.map((u, index) => {
            const Icon = u.icon;
            const isSelected = activeNode === index;
            const isPulsing = pulseIndex === index;
            return (
              <button
                key={u.id}
                onClick={() => setActiveNode(index)}
                className={`relative p-2 rounded-xl border text-center transition-all duration-300 flex flex-col items-center justify-between space-y-1.5 ${
                  isSelected
                    ? 'bg-rak-slate-900 border-rak-magenta shadow-magenta-sm scale-105 z-10'
                    : isPulsing
                    ? 'bg-rak-slate-900/80 border-rak-magenta/60'
                    : 'bg-rak-slate-900/40 border-rak-slate-800/80 hover:border-rak-slate-700'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-rak-magenta text-white' : 'bg-rak-slate-800 text-rak-slate-400'}`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                
                <span className="text-[9px] font-extrabold text-white truncate w-full">{u.short}</span>
                
                {/* Active Indicator Bar */}
                <div className="w-full h-1 bg-rak-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${u.color} ${isSelected || isPulsing ? 'w-full animate-pulse' : 'w-1/3 opacity-30'}`} />
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Signal Flow Connection Pipeline */}
        <div className="relative py-2">
          <div className="h-0.5 w-full bg-rak-slate-800 relative rounded-full overflow-hidden">
            <div 
              className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-rak-magenta to-transparent animate-shimmer"
              style={{ animationDuration: '2s' }}
            />
          </div>
          <div className="flex items-center justify-between text-[9px] font-mono text-rak-slate-500 pt-1">
            <span>INTEL & MEDIA BUYING</span>
            <span className="text-rak-magenta font-bold">AUTOMATED INTER-UNIT HANDSHAKE</span>
            <span>GROWTH OUTPUT</span>
          </div>
        </div>

        {/* Active Unit Telemetry Card */}
        <div className="p-4 rounded-2xl bg-rak-slate-900/90 border border-rak-slate-800/90 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded border ${activeUnit.badgeColor}`}>
                {activeUnit.code}
              </span>
              <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <CurrentIcon className="w-4 h-4 text-rak-magenta" />
                <span>{activeUnit.name}</span>
              </h4>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-rak-slate-400 block">{activeUnit.metric}</span>
              <span className="text-xs font-mono font-extrabold text-white">{activeUnit.val}</span>
            </div>
          </div>

          <p className="text-xs text-rak-slate-300 leading-relaxed">
            {activeUnit.description}
          </p>

          <div className="pt-2 border-t border-rak-slate-800/80 flex items-center justify-between text-[10px] font-mono">
            <span className="text-rak-slate-400 flex items-center space-x-1">
              <Cpu className="w-3 h-3 text-cyan-400" />
              <span>Pipeline Status: ACTIVE</span>
            </span>
            <span className="text-emerald-400 font-bold">+180% CRO & 3.8x ROAS Sync</span>
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="pt-1">
          <button
            onClick={onOpenPlanner}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-rak-magenta to-rak-magenta-dark hover:from-rak-magenta-light hover:to-rak-magenta text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-magenta-sm transition-all duration-300 flex items-center justify-center space-x-2 group"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Orchestrated Agency Sprint</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>

    </div>
  );
};

export default HeroAgencyOrchestrationCard;

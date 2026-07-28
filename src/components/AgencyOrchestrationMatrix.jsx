import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Code, 
  TrendingUp, 
  Video, 
  Radio,
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  BarChart3,
  Layers,
  Activity,
  Workflow
} from 'lucide-react';

export const AgencyOrchestrationMatrix = ({ onOpenPlanner }) => {
  const [activeUnit, setActiveUnit] = useState(0);

  const units = [
    {
      id: 'strategy',
      name: 'Brand Strategy & Ideation',
      code: 'STAGE 01',
      icon: Compass,
      tagline: 'Market Research, Audience Insights & Core Narrative',
      color: 'from-amber-500 to-rak-magenta',
      status: 'Ideation & Positioning',
      output: 'Brand Architecture Specs & Positioning Framework',
      downstreamSync: 'Feeds Visual Identity & Campaign Strategy',
      metrics: [
        { label: 'Market Alignment', value: '100%' },
        { label: 'Strategic Intel Score', value: '98/100' },
        { label: 'Persona Mapping', value: 'Complete' }
      ]
    },
    {
      id: 'design',
      name: 'Brand Identity & Design Systems',
      code: 'STAGE 02',
      icon: Sparkles,
      tagline: 'Distinct Logos, Color Systems & Visual Architecture',
      color: 'from-rak-magenta to-purple-600',
      status: 'Visual Identity Sync',
      output: 'Logo Guidelines & Comprehensive Brand Guidelines',
      downstreamSync: 'Syncs Directly to Web & Motion Creatives',
      metrics: [
        { label: 'Brand Consistency', value: '100%' },
        { label: 'Asset Adaptability', value: 'Universal' },
        { label: 'Design System Audit', value: 'Passed' }
      ]
    },
    {
      id: 'content',
      name: 'Media & Video Production',
      code: 'STAGE 03',
      icon: Video,
      tagline: 'Commercial Video, 3D Motion Graphics & Social Content',
      color: 'from-rose-500 to-rak-magenta',
      status: 'Cinematic Production',
      output: 'High-Impact Video Ads, 3D Assets & Social Reels',
      downstreamSync: 'Pushed Directly to Digital Marketing & Media Buying',
      metrics: [
        { label: 'Production Quality', value: '4K Native' },
        { label: 'Audience Engagement', value: '+210%' },
        { label: 'Creative Recall Rate', value: '96%' }
      ]
    },
    {
      id: 'engineering',
      name: 'Web & Digital Platforms',
      code: 'STAGE 04',
      icon: Code,
      tagline: 'Custom High-Speed Websites & Web Applications',
      color: 'from-cyan-500 to-blue-600',
      status: 'Digital Experience Sync',
      output: 'Vite/React Core & Interactive Web Interfaces',
      downstreamSync: 'Optimized Landing Pages for Ad Campaigns',
      metrics: [
        { label: 'Performance Score', value: '100/100' },
        { label: 'Load Time', value: '< 0.5s' },
        { label: 'User Experience Rating', value: '99.4%' }
      ]
    },
    {
      id: 'media-buying',
      name: 'Digital Marketing & Ads',
      code: 'STAGE 05',
      icon: TrendingUp,
      tagline: 'Omnichannel Paid Media, Meta/Google Ads & SEO',
      color: 'from-indigo-500 to-blue-600',
      status: 'Ad Campaigns Live',
      output: 'Omnichannel Campaigns (Google, Meta, LinkedIn, TikTok)',
      downstreamSync: 'Drives Targeted Traffic & High ROAS Conversions',
      metrics: [
        { label: 'ROAS Average', value: '3.8x Avg' },
        { label: 'Conversion Lift', value: '+180%' },
        { label: 'Cost Optimization', value: '-34% CPC' }
      ]
    },
    {
      id: 'ooh',
      name: 'Out-Of-Home & Print Campaigns',
      code: 'STAGE 06',
      icon: Radio,
      tagline: 'Billboards, Print Media & High-Visibility Offline Branding',
      color: 'from-emerald-400 to-teal-600',
      status: '360° Offline Execution',
      output: 'Billboard Placements, Print Collaterals & Signage',
      downstreamSync: 'Completes 360° Online & Offline Brand Presence',
      metrics: [
        { label: 'Offline Impression Rate', value: 'High' },
        { label: 'Print Precision', value: 'Ultra HD' },
        { label: 'Campaign Coverage', value: '360°' }
      ]
    }
  ];

  // Continuous auto-advancing loop across stages without pause
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveUnit((prev) => (prev + 1) % units.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [units.length]);

  const currentUnit = units[activeUnit];
  const CurrentIcon = currentUnit.icon;

  return (
    <div className="relative w-full rounded-3xl bg-rak-slate-900/60 border border-rak-slate-800 p-8 sm:p-12 backdrop-blur-xl shadow-2xl space-y-10 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-rak-magenta/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-rak-slate-800/80 relative z-10">
        <div className="space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-rak-slate-900 border border-rak-magenta/30 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest shadow-magenta-sm">
            <Workflow className="w-3.5 h-3.5" />
            <span>THE RAK 360° WORKFLOW</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            How We Take Your Big Ideas <br />
            From <span className="text-gradient-magenta">Ground Zero to New Heights.</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-mono font-semibold">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>LIVE WORKFLOW ADVANCING</span>
          </div>
        </div>
      </div>

      {/* Interactive Stage Selector Bar */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 relative z-10">
        {units.map((unit, idx) => {
          const UnitIcon = unit.icon;
          const isActive = idx === activeUnit;

          return (
            <button
              key={unit.id}
              onClick={() => setActiveUnit(idx)}
              className={`flex flex-col items-start p-4 rounded-2xl border transition-all duration-300 text-left ${
                isActive
                  ? 'bg-rak-slate-900 border-rak-magenta shadow-magenta-sm scale-105 z-10'
                  : 'bg-rak-slate-900/40 border-rak-slate-800/60 hover:border-rak-slate-700 text-rak-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${isActive ? 'bg-rak-magenta text-white' : 'bg-rak-slate-800 text-rak-slate-400'}`}>
                  {unit.code}
                </span>
                <UnitIcon className={`w-4 h-4 ${isActive ? 'text-rak-magenta' : 'text-rak-slate-400'}`} />
              </div>
              <span className={`text-xs font-bold tracking-tight line-clamp-1 ${isActive ? 'text-white' : 'text-rak-slate-300'}`}>
                {unit.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Display */}
      <div className="relative z-10 rounded-2xl bg-rak-slate-900/90 border border-rak-slate-800 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-rak-slate-800/80">
          <div className="flex items-center space-x-4">
            <div className={`p-3.5 rounded-2xl bg-gradient-to-r ${currentUnit.color} text-white shadow-lg`}>
              <CurrentIcon className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-rak-magenta uppercase tracking-wider">
                {currentUnit.code} • {currentUnit.status}
              </span>
              <h3 className="text-2xl font-extrabold text-white tracking-tight mt-0.5">
                {currentUnit.name}
              </h3>
            </div>
          </div>

          <button
            onClick={onOpenPlanner}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-rak-magenta text-white font-bold text-xs uppercase tracking-wider rounded-full shadow-magenta-glow hover:bg-rak-magenta-dark transition-all hover:scale-105"
          >
            <span>Start a Project in this Stage</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-base text-rak-slate-300 leading-relaxed max-w-3xl">
          {currentUnit.tagline}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {currentUnit.metrics.map((metric, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-rak-slate-950/60 border border-rak-slate-800/80 space-y-1">
              <span className="text-[11px] font-mono text-rak-slate-400 uppercase block">{metric.label}</span>
              <span className="text-xl font-extrabold text-white tracking-tight">{metric.value}</span>
            </div>
          ))}
        </div>

        {/* Downstream Integration Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-rak-magenta/10 border border-rak-magenta/30 text-xs text-rak-slate-200 font-medium">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-rak-magenta shrink-0" />
            <span><strong>Deliverable Output:</strong> {currentUnit.output}</span>
          </div>
          <span className="text-rak-magenta font-mono font-semibold">{currentUnit.downstreamSync}</span>
        </div>
      </div>
    </div>
  );
};

export default AgencyOrchestrationMatrix;

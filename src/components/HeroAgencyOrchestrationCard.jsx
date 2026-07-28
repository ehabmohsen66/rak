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
  Layers
} from 'lucide-react';

export const HeroAgencyOrchestrationCard = ({ onOpenPlanner }) => {
  const [activeNode, setActiveNode] = useState(0);

  const agencyUnits = [
    {
      id: 'unit-1',
      code: 'STAGE 01',
      name: 'Brand Strategy & Ideation',
      short: 'Strategy',
      icon: Compass,
      metric: 'Brand Impact',
      val: '100%',
      color: 'from-amber-500 to-rak-magenta',
      badgeColor: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
      description: 'Transforming market research and audience insights into a powerful brand narrative & market positioning.'
    },
    {
      id: 'unit-2',
      code: 'STAGE 02',
      name: 'Brand Identity & Design',
      short: 'Identity',
      icon: Sparkles,
      metric: 'Design Systems',
      val: 'Complete',
      color: 'from-rak-magenta to-purple-500',
      badgeColor: 'text-rak-magenta bg-rak-magenta/10 border-rak-magenta/30',
      description: 'Crafting distinct logo systems, visual guidelines, typography, and cohesive brand design architecture.'
    },
    {
      id: 'unit-3',
      code: 'STAGE 03',
      name: 'Media & Video Production',
      short: 'Production',
      icon: Video,
      metric: 'Visual Assets',
      val: '4K Cinematic',
      color: 'from-rose-500 to-rak-magenta',
      badgeColor: 'text-rose-400 bg-rose-400/10 border-rose-400/30',
      description: 'High-end commercial video production, 3D motion graphics, photography, and engaging social media content.'
    },
    {
      id: 'unit-4',
      code: 'STAGE 04',
      name: 'Web & Mobile Development',
      short: 'Web & Tech',
      icon: Code,
      metric: 'Digital Platforms',
      val: 'Fast & Modern',
      color: 'from-cyan-400 to-blue-600',
      badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
      description: 'Custom, high-speed web apps and interactive digital platforms designed for seamless user experience.'
    },
    {
      id: 'unit-5',
      code: 'STAGE 05',
      name: 'Digital Marketing & Ads',
      short: 'Digital Marketing',
      icon: TrendingUp,
      metric: 'Campaign ROAS',
      val: 'High ROI',
      color: 'from-indigo-500 to-blue-500',
      badgeColor: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/30',
      description: 'Omnichannel media buying, targeted ad campaigns, SEO, and paid social strategy to maximize conversions.'
    },
    {
      id: 'unit-6',
      code: 'STAGE 06',
      name: 'Out-Of-Home & Print',
      short: 'OOH & Print',
      icon: Radio,
      metric: 'Offline Reach',
      val: '360° Impact',
      color: 'from-emerald-400 to-teal-500',
      badgeColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
      description: 'Large-format billboard campaigns, physical collateral, and high-visibility out-of-home advertising.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % agencyUnits.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [agencyUnits.length]);

  const activeData = agencyUnits[activeNode];
  const IconComponent = activeData.icon;

  return (
    <div className="relative w-full rounded-3xl bg-rak-slate-950 border border-rak-slate-800 p-6 sm:p-8 shadow-2xl overflow-hidden backdrop-blur-xl group">
      {/* Background Glow Effect */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rak-magenta/10 rounded-full blur-3xl pointer-events-none group-hover:bg-rak-magenta/20 transition-all duration-700" />
      
      {/* Top Header Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-rak-slate-800/80">
        <div className="flex items-center space-x-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rak-magenta opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rak-magenta"></span>
          </div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-white font-mono">
            RAK 360° CREATIVE ENGINE
          </span>
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-[11px] font-mono font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>FULL-SERVICE SYNC: 100%</span>
        </div>
      </div>

      {/* Navigation Pills: 6 Core Pillars */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 my-6">
        {agencyUnits.map((unit, idx) => {
          const NodeIcon = unit.icon;
          const isActive = idx === activeNode;

          return (
            <button
              key={unit.id}
              onClick={() => setActiveNode(idx)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 ${
                isActive
                  ? 'bg-rak-slate-900 border-rak-magenta shadow-magenta-sm scale-105'
                  : 'bg-rak-slate-900/40 border-rak-slate-800/60 hover:border-rak-slate-700 text-rak-slate-400 hover:text-white'
              }`}
            >
              <NodeIcon className={`w-5 h-5 mb-1.5 ${isActive ? 'text-rak-magenta' : 'text-rak-slate-400'}`} />
              <span className={`text-[11px] font-bold tracking-tight text-center leading-none ${isActive ? 'text-white' : 'text-rak-slate-400'}`}>
                {unit.short}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Stage Details Card */}
      <div className="relative rounded-2xl bg-rak-slate-900/90 border border-rak-slate-800 p-6 space-y-4 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-xl bg-gradient-to-r ${activeData.color} text-white shadow-md`}>
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${activeData.badgeColor}`}>
                {activeData.code}
              </span>
              <h3 className="text-lg font-extrabold text-white tracking-tight leading-tight mt-0.5">
                {activeData.name}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-rak-slate-400 block">
              {activeData.metric}
            </span>
            <span className="text-lg font-extrabold text-rak-magenta tracking-tight">
              {activeData.val}
            </span>
          </div>
        </div>

        <p className="text-xs text-rak-slate-300 leading-relaxed font-normal">
          {activeData.description}
        </p>

        {/* Dynamic Workflow Progress Bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-[10px] font-mono text-rak-slate-400">
            <span>DEPARTMENT SYNC</span>
            <span className="text-rak-magenta font-bold">IDEATION → EXECUTION → EVALUATION</span>
          </div>
          <div className="h-1.5 w-full bg-rak-slate-800 rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${activeData.color} transition-all duration-700 rounded-full`}
              style={{ width: `${((activeNode + 1) / agencyUnits.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-6">
        <button
          onClick={onOpenPlanner}
          className="w-full flex items-center justify-center space-x-2 py-4 px-6 bg-gradient-to-r from-rak-magenta to-rak-magenta-dark hover:from-rak-magenta-dark hover:to-rak-magenta text-white font-bold text-xs uppercase tracking-wider rounded-2xl shadow-magenta-glow hover:shadow-magenta-glow transition-all duration-300 group/btn"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Your Integrated Campaign Sprint</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default HeroAgencyOrchestrationCard;

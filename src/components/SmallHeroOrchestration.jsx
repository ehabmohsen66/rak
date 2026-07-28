import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Video, 
  Code, 
  TrendingUp, 
  Radio, 
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

export const SmallHeroOrchestration = ({ onOpenPlanner }) => {
  const [activeStage, setActiveStage] = useState(0);

  const stages = [
    {
      code: 'STAGE 01',
      short: 'Strategy',
      icon: Compass,
      description: 'Market research, audience profiling & brand positioning.'
    },
    {
      code: 'STAGE 02',
      short: 'Identity',
      icon: Sparkles,
      description: 'Visual identity, logo architecture & design systems.'
    },
    {
      code: 'STAGE 03',
      short: 'Production',
      icon: Video,
      description: 'Commercial video, 3D motion graphics & social reels.'
    },
    {
      code: 'STAGE 04',
      short: 'Web & Tech',
      icon: Code,
      description: 'High-speed web platforms & custom digital apps.'
    },
    {
      code: 'STAGE 05',
      short: 'Digital Marketing',
      icon: TrendingUp,
      description: 'Meta, Google & LinkedIn ad campaigns for maximum ROAS.'
    },
    {
      code: 'STAGE 06',
      short: 'OOH & Print',
      icon: Radio,
      description: 'Large format billboards, outdoor media & physical assets.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStage((prev) => (prev + 1) % stages.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [stages.length]);

  const activeData = stages[activeStage];
  const ActiveIcon = activeData.icon;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-3">
      {/* Compact Interactive Pill Bar */}
      <div className="p-2 sm:p-2.5 rounded-full bg-rak-slate-900/90 border border-rak-slate-800/80 backdrop-blur-xl shadow-2xl flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        
        {/* Indicator Badge */}
        <div className="flex items-center space-x-2 pl-3 pr-3 border-r border-rak-slate-800/80 shrink-0">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rak-magenta opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rak-magenta"></span>
          </span>
          <span className="text-[10px] font-extrabold font-mono uppercase tracking-widest text-rak-slate-300">
            360° WORKFLOW
          </span>
        </div>

        {/* 6 Stage Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {stages.map((stg, idx) => {
            const Icon = stg.icon;
            const isActive = activeStage === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveStage(idx)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-rak-magenta text-white shadow-magenta-sm scale-105'
                    : 'text-rak-slate-400 hover:text-white hover:bg-rak-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{stg.short}</span>
              </button>
            );
          })}
        </div>

        {/* Compact CTA button */}
        <button
          onClick={onOpenPlanner}
          className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-full bg-rak-magenta/20 hover:bg-rak-magenta/30 text-rak-magenta text-[10px] font-bold uppercase tracking-wider border border-rak-magenta/30 shrink-0 transition-colors"
        >
          <span>Sync</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>

      {/* Sleek 1-Line Active Stage Summary Banner */}
      <div className="flex items-center justify-center space-x-2 px-4 py-2 rounded-2xl bg-rak-slate-900/50 border border-rak-slate-800/60 backdrop-blur-md max-w-2xl mx-auto">
        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-rak-magenta/20 text-rak-magenta border border-rak-magenta/30 shrink-0">
          {activeData.code}
        </span>
        <p className="text-xs text-rak-slate-300 font-medium truncate">
          <span className="text-white font-bold mr-1.5">{activeData.short}:</span>
          {activeData.description}
        </p>
      </div>
    </div>
  );
};

export default SmallHeroOrchestration;

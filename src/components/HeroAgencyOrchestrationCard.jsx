import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  Code, 
  TrendingUp, 
  Video, 
  Radio,
  Share2,
  PlayCircle
} from 'lucide-react';
import { DotLottiePlayer } from '@dotlottie/react-player';
import '@dotlottie/react-player/dist/index.css';

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
      description: 'High-end commercial video production, 3D motion graphics, photography, and engaging social media content.'
    },
    {
      id: 'unit-4',
      code: 'STAGE 04',
      name: 'Web & Tech Platform',
      short: 'Tech',
      icon: Code,
      metric: 'Digital Platforms',
      val: 'Fast & Modern',
      color: 'from-cyan-400 to-blue-600',
      description: 'Custom, high-speed web apps and interactive digital platforms designed for seamless user experience.'
    },
    {
      id: 'unit-5',
      code: 'STAGE 05',
      name: 'Digital Marketing & Ads',
      short: 'Marketing',
      icon: TrendingUp,
      metric: 'Campaign ROAS',
      val: 'High ROI',
      color: 'from-indigo-500 to-blue-500',
      description: 'Omnichannel media buying, targeted ad campaigns, SEO, and paid social strategy to maximize conversions.'
    },
    {
      id: 'unit-6',
      code: 'STAGE 06',
      name: 'Out-Of-Home & Print',
      short: 'OOH',
      icon: Radio,
      metric: 'Offline Reach',
      val: '360° Impact',
      color: 'from-emerald-400 to-teal-500',
      description: 'Large-format billboard campaigns, physical collateral, and high-visibility out-of-home advertising.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 6);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const activeData = agencyUnits[activeNode];
  const IconComponent = activeData.icon;

  return (
    <div className="relative w-full rounded-3xl bg-white dark:bg-rak-slate-950 border border-slate-200 dark:border-white/10 p-5 sm:p-7 shadow-xl overflow-hidden backdrop-blur-xl group">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center space-x-2.5">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rak-magenta opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rak-magenta"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-800 dark:text-white font-mono">
            RAK 360° CREATIVE ENGINE
          </span>
        </div>
        <div className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-mono text-rak-magenta font-semibold">
          <Share2 className="w-3 h-3" />
          <span>LIVE FLOW</span>
        </div>
      </div>

      {/* Navigation Pills (3x2 Grid) */}
      <div className="grid grid-cols-3 gap-2 my-4">
        {agencyUnits.map((unit, idx) => {
          const NodeIcon = unit.icon;
          const isActive = idx === activeNode;

          return (
            <button
              key={unit.id}
              onClick={() => setActiveNode(idx)}
              className={`flex items-center justify-center space-x-1.5 px-2.5 py-2 rounded-xl border transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'bg-rak-magenta text-white border-rak-magenta shadow-md'
                  : 'bg-slate-100 dark:bg-rak-slate-900/60 border-slate-200 dark:border-white/10 hover:border-slate-300 text-slate-700 dark:text-rak-slate-300 hover:text-slate-900'
              }`}
            >
              <NodeIcon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-rak-slate-400'}`} />
              <span className="text-[11px] font-semibold tracking-wide whitespace-nowrap">
                {unit.short}
              </span>
            </button>
          );
        })}
      </div>

      {/* Interactive Showcase Box with Embedded Lottie Animation */}
      <div className="relative rounded-2xl bg-slate-50 dark:bg-rak-slate-900/90 border border-slate-200 dark:border-white/10 p-4 sm:p-5 overflow-hidden">
        
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          
          {/* Left / Top: Active Stage Info */}
          <div className="sm:col-span-7 space-y-2.5">
            <div className="flex items-center space-x-2.5">
              <div className={`p-2 rounded-xl bg-gradient-to-r ${activeData.color} text-white shadow-sm shrink-0`}>
                <IconComponent className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-slate-500 dark:text-rak-slate-400 uppercase tracking-widest block">
                  {activeData.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                  {activeData.name}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-rak-slate-300 leading-relaxed font-normal">
              {activeData.description}
            </p>
          </div>

          {/* Right / Bottom: Creative Lottie Social Media Canvas Container */}
          <div className="sm:col-span-5 flex items-center justify-center">
            <div className="relative w-full h-32 sm:h-36 rounded-xl bg-white dark:bg-rak-slate-950/90 border border-slate-200/80 dark:border-white/10 p-1 flex items-center justify-center shadow-inner overflow-hidden group/lottie">
              
              {/* Subtle pulsing background glow */}
              <div className="absolute inset-0 bg-gradient-to-tr from-rak-magenta/10 via-transparent to-purple-500/10 pointer-events-none" />

              {/* DotLottie Animation Component */}
              <DotLottiePlayer
                src="https://lottie.host/8f8d9ac0-8c40-4848-9177-06f72d4a7043/16IiCxPGHE.lottie"
                autoplay
                loop
                className="w-full h-full object-contain relative z-10"
              />

              {/* Overlay pill indicator */}
              <div className="absolute bottom-1.5 right-1.5 z-20 px-2 py-0.5 rounded-md bg-white/90 dark:bg-rak-slate-900/90 border border-slate-200 dark:border-white/10 text-[9px] font-mono font-bold text-rak-magenta shadow-sm">
                Social Growth
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default HeroAgencyOrchestrationCard;

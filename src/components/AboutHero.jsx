import React from 'react';
import { motion } from 'framer-motion';
import { MinimalistHero } from './MinimalistHero';

// --- Custom SVG Components for Hand-Drawn Accents ---

const ArrowMagentaLeft = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-rak-magenta stroke-current overflow-visible" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10,90 C 10,40 40,20 60,50 C 70,65 80,75 95,70" />
    <path d="M80,55 L95,70 L85,85" />
  </svg>
);

const ArrowMagentaRight = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-rak-magenta stroke-current overflow-visible" fill="none" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M90,10 C 80,60 60,80 40,60 C 20,40 40,20 60,30 C 80,40 70,70 50,80" />
    <path d="M65,75 L50,80 L55,65" />
  </svg>
);

const ArrowWhite1 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-white stroke-current overflow-visible" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20,80 Q 40,20 80,40" />
    <path d="M60,20 L80,40 L50,60" />
  </svg>
);

const ArrowWhite2 = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full text-white stroke-current overflow-visible" fill="none" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20,80 Q 40,20 80,40" />
    <path d="M60,20 L80,40 L50,60" />
  </svg>
);

const CircularBadge = () => (
  <div className="relative w-28 h-28 md:w-36 md:h-36 bg-rak-magenta rounded-full flex items-center justify-center shadow-magenta-glow rotate-12 hover:scale-105 transition-transform cursor-pointer border-[3px] border-white/10">
    <div className="absolute inset-1 animate-[spin_12s_linear_infinite]">
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <path id="circlePathAbout" d="M 50, 50 m -36, 0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" fill="none" />
        <text className="text-[10px] font-extrabold tracking-[0.18em] uppercase" fill="white">
          <textPath href="#circlePathAbout" startOffset="0%">
            RAK4CREATIVE • BOLD CREATIVITY • TECH MAGIC • 
          </textPath>
        </text>
      </svg>
    </div>
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 100 100" className="w-10 h-10 text-white stroke-current overflow-visible" fill="none" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20,80 Q 40,50 30,30 T 80,20" />
        <path d="M60,10 L80,20 L70,40" />
      </svg>
    </div>
  </div>
);

export const AboutHero = ({ onOpenPlanner }) => {
  return (
    <div className="bg-rak-slate-950 flex flex-col font-sans selection:bg-rak-magenta selection:text-white relative overflow-hidden w-full">
      {/* Installed Minimalist Hero Section */}
      <MinimalistHero onOpenPlanner={onOpenPlanner} />

      {/* Bottom Features Section */}
      <section className="bg-rak-slate-900 border-t border-rak-slate-800 text-white rounded-t-[2.5rem] md:rounded-t-[3.5rem] px-6 py-12 md:px-10 md:py-16 relative z-20 shadow-2xl mt-auto w-full">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          {/* Card 1 */}
          <div className="bg-rak-slate-950/80 rounded-[2rem] p-8 flex flex-col items-center text-center relative h-64 border border-rak-slate-800 hover:border-rak-magenta/50 transition-all">
            <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black text-white">
              BOLD<br/>CREATIVITY
            </h3>
            <p className="text-[10px] md:text-xs text-rak-slate-400 font-medium mb-auto">
              We create big ideas from ground zero and take them to new heights
            </p>
            
            <div className="relative w-full flex justify-center mt-4">
              <div className="flex items-center bg-rak-slate-900 border border-rak-slate-700 rounded-2xl p-2 pr-12 text-white shadow-lg relative z-10">
                <div className="w-8 h-8 bg-rak-magenta/20 rounded-full mr-3 border border-rak-magenta overflow-hidden flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-rak-magenta">
                  RAK
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold leading-none">Ideation to Launch</p>
                  <p className="text-[8px] text-rak-slate-400 leading-none mt-1">Full-Service Studio</p>
                </div>
              </div>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-rak-magenta text-white font-extrabold text-[10px] px-3 py-1.5 rounded-xl z-20 shadow-md">
                100% CRAFT
              </div>
            </div>

            <div className="hidden md:block absolute -right-12 bottom-8 w-16 h-16 z-30 opacity-40">
              <ArrowWhite1 />
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-rak-slate-950/80 rounded-[2rem] p-8 flex flex-col items-center text-center relative h-64 border border-rak-slate-800 hover:border-rak-magenta/50 transition-all">
            <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black text-white">
              TECH<br/>MAGIC
            </h3>
            <p className="text-[10px] md:text-xs text-rak-slate-400 font-medium mb-auto">
              Web architecture, performance ad ops, and data intelligence
            </p>
            
            <div className="relative w-full flex justify-center mt-4">
              <div className="flex items-center bg-rak-slate-900 border border-rak-slate-700 rounded-full p-1.5 text-white shadow-lg">
                <div className="bg-rak-magenta/20 border border-rak-magenta text-rak-magenta font-bold text-xs px-3 py-1.5 rounded-full mr-2">
                  8 PILLARS
                </div>
                <div className="font-bold text-xs px-3 text-white">
                  ONE STOP
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute -right-12 bottom-8 w-16 h-16 z-30 opacity-40">
              <ArrowWhite2 />
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-rak-slate-950/80 rounded-[2rem] p-8 flex flex-col items-center text-center relative h-64 border border-rak-slate-800 hover:border-rak-magenta/50 transition-all">
            <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black text-white">
              REAL<br/>IMPACT
            </h3>
            <p className="text-[10px] md:text-xs text-rak-slate-400 font-medium mb-auto">
              Online and offline presence that drives enterprise revenue
            </p>
            
            <div className="flex flex-col items-center bg-rak-magenta text-white rounded-[2rem] px-6 py-3 shadow-magenta-glow mt-4 relative w-full max-w-[220px]">
              <p className="text-[9px] font-bold uppercase tracking-wider mb-0.5">Global Presence</p>
              <p className="text-lg font-black">360° STRATEGY</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutHero;

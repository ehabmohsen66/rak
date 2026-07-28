import React from 'react';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-rak-slate-950 flex flex-col font-sans selection:bg-rak-magenta selection:text-white relative overflow-hidden w-full">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0"></div>

      {/* Hero Section */}
      <main className="flex-1 relative z-10 pt-16 pb-24 md:pt-20 md:pb-36 px-4 flex flex-col items-center justify-center w-full max-w-[1440px] mx-auto">
        
        {/* Massive Typography & Elements Container */}
        <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center justify-center text-center z-10 mt-4 mb-16">
          
          {/* Text Stack */}
          <div className="w-full flex flex-col items-center relative z-10 space-y-1 md:space-y-2">
            
            {/* #RAK4 */}
            <div className="w-full flex justify-start pl-[8%] md:pl-[20%] relative z-30">
              <h1 
                className="text-[clamp(4.5rem,12vw,160px)] font-black leading-[0.85] tracking-tighter text-rak-magenta m-0 p-0 uppercase"
                style={{ 
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow: '2px 2px 0 #5A0034, 4px 4px 0 #5A0034, 6px 6px 0 #5A0034, 8px 8px 0 #5A0034, 10px 10px 0 #5A0034, 12px 12px 0 #5A0034'
                }}
              >
                #RAK4
              </h1>
            </div>
            
            {/* CREATIVE */}
            <div className="w-full flex justify-center relative z-20">
              <h1 
                className="text-[clamp(5rem,15vw,210px)] font-black leading-[0.85] tracking-tighter text-white m-0 p-0 uppercase"
                style={{ 
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow: '2px 2px 0 #5A0034, 4px 4px 0 #5A0034, 6px 6px 0 #5A0034, 8px 8px 0 #5A0034, 10px 10px 0 #5A0034, 12px 12px 0 #5A0034'
                }}
              >
                CREATIVE
              </h1>
            </div>
            
            {/* AGENCY */}
            <div className="w-full flex justify-start pl-[12%] md:pl-[28%] relative z-10">
              <h1 
                className="text-[clamp(4.5rem,12vw,160px)] font-black leading-[0.85] tracking-tighter text-white m-0 p-0 uppercase"
                style={{ 
                  fontFamily: '"Arial Black", Impact, sans-serif',
                  textShadow: '2px 2px 0 #5A0034, 4px 4px 0 #5A0034, 6px 6px 0 #5A0034, 8px 8px 0 #5A0034, 10px 10px 0 #5A0034, 12px 12px 0 #5A0034'
                }}
              >
                AGENCY
              </h1>
            </div>

          </div>

          {/* Absolute Overlays (Cards, Arrows, Badge) */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            
            {/* Floating Glass Card 1 (Bottom Left) */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-[8%] left-[2%] md:left-[15%] z-30 pointer-events-auto"
            >
              <div className="w-40 md:w-52 aspect-[3/3.5] bg-rak-slate-900/90 backdrop-blur-xl border border-rak-magenta/40 rounded-[2rem] p-5 flex flex-col items-center justify-center rotate-[-12deg] shadow-magenta-sm hover:rotate-0 transition-transform duration-500">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-rak-magenta/20 rounded-full flex items-center justify-center mb-3 border-[2px] border-rak-magenta overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="text-center mt-1">
                  <p className="font-bold text-sm md:text-base text-white">Strategy Director</p>
                  <p className="text-[10px] md:text-xs text-rak-magenta font-mono mt-0.5">100% In-House</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Glass Card 2 (Top Right) */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-[12%] right-[2%] md:right-[18%] z-30 pointer-events-auto"
            >
              <div className="w-40 md:w-52 aspect-[3/3.5] bg-rak-slate-900/90 backdrop-blur-xl border border-rak-magenta/40 rounded-[2rem] p-5 flex flex-col items-center justify-center rotate-[12deg] shadow-magenta-sm hover:rotate-0 transition-transform duration-500">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-rak-magenta/20 rounded-full flex items-center justify-center mb-3 border-[2px] border-rak-magenta overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80" alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="text-center mt-1">
                  <p className="font-bold text-sm md:text-base text-white">Creative Lead</p>
                  <p className="text-[10px] md:text-xs text-rak-magenta font-mono mt-0.5">360° Execution</p>
                </div>
              </div>
            </motion.div>

            {/* Decorative Arrow Left */}
            <div className="absolute bottom-[0%] left-[0%] md:left-[6%] w-20 h-20 md:w-28 md:h-28 z-20">
              <ArrowMagentaLeft />
            </div>

            {/* Decorative Arrow Right */}
            <div className="absolute top-[5%] right-[0%] md:right-[8%] w-20 h-20 md:w-28 md:h-28 z-20">
              <ArrowMagentaRight />
            </div>

            {/* Circular Badge */}
            <div className="absolute bottom-[-10%] right-[2%] md:right-[12%] z-40 pointer-events-auto">
              <CircularBadge />
            </div>

          </div>
        </div>
      </main>

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

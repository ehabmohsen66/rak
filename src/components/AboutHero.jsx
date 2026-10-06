import React from 'react';


export const AboutHero = ({ onOpenPlanner }) => {
  return (
    <div className="w-full bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* 1. Full Video Banner Showcase */}
      <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[50vh] sm:min-h-[65vh] max-h-[85vh] overflow-hidden bg-slate-950 flex items-center justify-center shadow-2xl">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/videos/about-banner.mp4" type="video/mp4" />
          <source src="/videos/RAK4-WebsiteAbout Page banner-021026.mp4" type="video/mp4" />
        </video>
        {/* Subtle cinematic gradient framing */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
      </section>

      {/* 2. Bottom Features Section */}
      <section className="bg-white dark:bg-rak-slate-900 border-t border-slate-200 dark:border-rak-slate-800 text-slate-900 dark:text-white rounded-t-[2.5rem] md:rounded-t-[3.5rem] px-4 sm:px-6 py-10 md:px-10 md:py-16 relative z-20 shadow-2xl w-full -mt-8 sm:-mt-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          
          {/* Card 1 */}
          <div className="bg-slate-50 dark:bg-rak-slate-950/80 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center relative min-h-[220px] border border-slate-200 dark:border-rak-slate-800 hover:border-rak-magenta/50 transition-all shadow-sm">
            <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black text-slate-900 dark:text-white font-heading">
              BOLD<br/>CREATIVITY
            </h3>
            <p className="text-xs text-slate-600 dark:text-rak-slate-400 font-medium mb-4">
              We create big ideas from ground zero and take them to new heights
            </p>
            
            <div className="w-full flex items-center justify-between bg-white dark:bg-rak-slate-900 border border-slate-200 dark:border-rak-slate-700 rounded-2xl p-2.5 px-3 text-slate-900 dark:text-white shadow-sm mt-auto">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 bg-rak-magenta/10 dark:bg-rak-magenta/20 rounded-full border border-rak-magenta flex items-center justify-center text-[9px] font-bold text-rak-magenta shrink-0">
                  RAK
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold leading-none">Ideation to Launch</p>
                  <p className="text-[8px] text-slate-500 dark:text-rak-slate-400 leading-none mt-1">Full-Service Studio</p>
                </div>
              </div>
              <div className="bg-rak-magenta text-white font-extrabold text-[9px] px-2.5 py-1 rounded-xl shadow-md shrink-0">
                100% CRAFT
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-50 dark:bg-rak-slate-950/80 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center relative min-h-[220px] border border-slate-200 dark:border-rak-slate-800 hover:border-rak-magenta/50 transition-all shadow-sm">
            <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black text-slate-900 dark:text-white font-heading">
              TECH<br/>MAGIC
            </h3>
            <p className="text-xs text-slate-600 dark:text-rak-slate-400 font-medium mb-4">
              Web architecture, performance ad ops, and data intelligence
            </p>
            
            <div className="w-full flex items-center justify-center bg-white dark:bg-rak-slate-900 border border-slate-200 dark:border-rak-slate-700 rounded-2xl p-2.5 px-3 text-slate-900 dark:text-white shadow-sm mt-auto">
              <div className="bg-rak-magenta/10 dark:bg-rak-magenta/20 border border-rak-magenta text-rak-magenta font-bold text-[10px] px-3 py-1 rounded-xl mr-2">
                8 PILLARS
              </div>
              <div className="font-bold text-[10px] text-slate-900 dark:text-white">
                ONE STOP
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-50 dark:bg-rak-slate-950/80 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center relative min-h-[220px] border border-slate-200 dark:border-rak-slate-800 hover:border-rak-magenta/50 transition-all shadow-sm">
            <h3 className="text-xl md:text-2xl uppercase leading-tight mb-2 font-black text-slate-900 dark:text-white font-heading">
              REAL<br/>IMPACT
            </h3>
            <p className="text-xs text-slate-600 dark:text-rak-slate-400 font-medium mb-4">
              Online and offline presence that drives enterprise revenue
            </p>
            
            <div className="w-full flex flex-col items-center bg-rak-magenta text-white rounded-2xl p-2.5 shadow-magenta-glow mt-auto">
              <p className="text-[8px] font-bold uppercase tracking-wider">Global Presence</p>
              <p className="text-sm font-black tracking-tight font-heading">360° STRATEGY</p>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default AboutHero;

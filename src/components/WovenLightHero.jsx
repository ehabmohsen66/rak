import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowUpRight, TrendingUp, Cpu, ShieldCheck, ArrowDown } from 'lucide-react';

export const WovenLightHero = ({ onOpenPlanner = () => {} }) => {
  const stats = [
    {
      metric: '+340%',
      label: 'Average Conversion Velocity',
      tag: 'GROWTH BENCHMARK',
      color: 'text-rak-magenta'
    },
    {
      metric: '$180M+',
      label: 'Enterprise Value Created',
      tag: 'COMMERCIAL ROI',
      color: 'text-rak-cyan'
    },
    {
      metric: '100%',
      label: 'Production-Tested Blueprints',
      tag: 'EXECUTION ASSURANCE',
      color: 'text-rak-violet'
    }
  ];

  return (
    <section className="relative w-full overflow-hidden bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white border-b border-slate-200 dark:border-white/10 -mt-16 pt-32 sm:pt-40 pb-16 sm:pb-24 transition-colors duration-300">
      
      {/* Subtle Architectural Grid & Soft Ambient Light */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      
      {/* Balanced Soft Glow Orbs (Subtle, Not Overpowering) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-r from-rak-magenta/8 via-rak-violet/8 to-rak-cyan/8 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[250px] bg-rak-cyan/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 text-center">
        
        {/* Main Editorial Header Stack */}
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Refined Category Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-rak-slate-900/80 border border-slate-200 dark:border-white/10 text-rak-magenta text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-md shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Blueprints & Enterprise ROI</span>
          </motion.div>

          {/* Clean Modern Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08] font-heading"
          >
            Proven Transformations.{' '}
            <span className="block mt-1 bg-clip-text text-transparent bg-gradient-to-r from-rak-magenta via-pink-500 to-rak-violet">
              Measured at Scale.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-rak-slate-300 max-w-2xl mx-auto leading-relaxed font-normal"
          >
            Explore end-to-end case studies, digital architectures, and quantitative business breakthroughs delivered for category-defining leaders.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
          >
            <button
              onClick={onOpenPlanner}
              className="px-8 py-3.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2 cursor-pointer font-mono"
            >
              <span>Initiate Project Scope</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('case-studies-list');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  window.scrollBy({ top: 500, behavior: 'smooth' });
                }
              }}
              className="px-7 py-3.5 bg-white dark:bg-rak-slate-900/90 hover:bg-slate-100 dark:hover:bg-rak-slate-800 text-slate-800 dark:text-white border border-slate-200 dark:border-white/15 text-xs font-bold uppercase tracking-widest rounded-full backdrop-blur-md transition-all duration-200 hover:scale-105 cursor-pointer font-mono"
            >
              <span>Explore Blueprints</span>
            </button>
          </motion.div>

        </div>

        {/* 3-Column Architectural Metrics Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4"
        >
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-8 rounded-3xl bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-sm hover:shadow-md hover:border-rak-magenta/40 transition-all duration-300 text-left space-y-3 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 dark:text-rak-slate-400 uppercase">
                  {item.tag}
                </span>
                <span className="text-xs font-mono text-rak-magenta font-bold">0{idx + 1}</span>
              </div>

              <div className={`text-4xl sm:text-5xl font-black font-heading ${item.color} tracking-tight`}>
                {item.metric}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 font-medium leading-snug">
                {item.label}
              </p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default WovenLightHero;

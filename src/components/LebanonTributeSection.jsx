import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Globe2, Compass, Heart, Award, ArrowUpRight, Flame, MapPin } from 'lucide-react';
import SpotlightCard from './SpotlightCard';

export const LebanonFlag = ({ className = 'w-12 h-8' }) => (
  <motion.div
    whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
    className={`relative rounded-md overflow-hidden shadow-md border border-slate-200/50 dark:border-white/10 flex flex-col shrink-0 select-none ${className}`}
    style={{ minWidth: '36px' }}
  >
    {/* Red Top Stripe */}
    <div className="h-[28%] bg-[#EE161F] w-full" />
    
    {/* White Middle Stripe with Green Cedar */}
    <div className="h-[44%] bg-white w-full flex items-center justify-center relative px-0.5">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto text-[#00A651] fill-current drop-shadow-sm"
        style={{ maxHeight: '95%' }}
      >
        {/* Lebanese Cedar Tree Silhouette */}
        <path d="M50 8 C48 10, 46 16, 44 20 C40 20, 36 22, 33 25 C37 27, 41 27, 45 28 C41 30, 34 32, 28 36 C33 38, 39 39, 45 39 C38 43, 29 46, 22 52 C28 54, 37 54, 44 54 C36 59, 25 63, 16 71 C25 73, 36 73, 45 71 C45 76, 43 83, 41 90 L59 90 C57 83, 55 76, 55 71 C64 73, 75 73, 84 71 C75 63, 64 59, 56 54 C63 54, 72 54, 78 52 C71 46, 62 43, 55 39 C61 39, 67 38, 72 36 C66 32, 59 30, 55 28 C59 27, 63 27, 67 25 C64 22, 60 20, 56 20 C54 16, 52 10, 50 8 Z" />
      </svg>
    </div>
    
    {/* Red Bottom Stripe */}
    <div className="h-[28%] bg-[#EE161F] w-full" />
  </motion.div>
);

const PILLARS_OF_BEIRUT = [
  {
    icon: Flame,
    title: 'The Eternal Flame of Resilience',
    tagline: 'Phoenix Spirit',
    desc: 'From a historic crossroads that rebuilt itself time and time again, Beirut breathes an unstoppable creative pulse that defies all limits.',
    badge: 'Spirit'
  },
  {
    icon: Globe2,
    title: 'Global Cultural Crossroads',
    tagline: 'Bridging East & West',
    desc: 'Rooted in multilingual fluency, cinematic storytelling, and timeless Mediterranean aesthetics crafted for international stages.',
    badge: 'Reach'
  },
  {
    icon: Sparkles,
    title: 'Pioneers of Imagination',
    tagline: 'The Land of Creators',
    desc: 'Home of legendary poets, world-class architects, iconic couturiers, and modern digital innovators who redefine human connection.',
    badge: 'Heritage'
  }
];

export const LebanonTributeSection = ({ onOpenPlanner }) => {
  const [activeHighlight, setActiveHighlight] = useState(0);

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-rak-magenta/15 via-[#00A651]/10 to-[#EE161F]/15 blur-3xl opacity-70 rounded-full" />

      <div className="relative z-10 space-y-12">
        
        {/* Top Header Card */}
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-b from-white/90 via-white/70 to-slate-50/90 dark:from-rak-slate-900/90 dark:via-rak-slate-900/70 dark:to-rak-slate-950/90 border border-slate-200/80 dark:border-white/10 shadow-xl backdrop-blur-xl overflow-hidden">
          
          {/* Subtle Decorative Cedar Watermark in the background */}
          <div className="pointer-events-none absolute -right-12 -bottom-16 opacity-5 dark:opacity-10 w-96 h-96 text-[#00A651]">
            <svg viewBox="0 0 100 100" className="w-full h-full fill-current">
              <path d="M50 8 C48 10, 46 16, 44 20 C40 20, 36 22, 33 25 C37 27, 41 27, 45 28 C41 30, 34 32, 28 36 C33 38, 39 39, 45 39 C38 43, 29 46, 22 52 C28 54, 37 54, 44 54 C36 59, 25 63, 16 71 C25 73, 36 73, 45 71 C45 76, 43 83, 41 90 L59 90 C57 83, 55 76, 55 71 C64 73, 75 73, 84 71 C75 63, 64 59, 56 54 C63 54, 72 54, 78 52 C71 46, 62 43, 55 39 C61 39, 67 38, 72 36 C66 32, 59 30, 55 28 C59 27, 63 27, 67 25 C64 22, 60 20, 56 20 C54 16, 52 10, 50 8 Z" />
            </svg>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Col: Main Typography & Narrative */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge & Flag Pill */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-rak-slate-800/80 border border-slate-200 dark:border-white/10 shadow-sm">
                <LebanonFlag className="w-8 h-5 rounded-sm" />
                <span className="text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-rak-magenta via-[#EE161F] to-[#00A651] bg-clip-text text-transparent">
                  Roots of Inspiration • Beirut, Lebanon
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A651] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A651]"></span>
                </span>
              </div>

              {/* Headings */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-slate-500 dark:text-rak-slate-400 uppercase">
                  <MapPin className="w-3.5 h-3.5 text-rak-magenta" />
                  <span>From The Heart of Beirut to The World</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                  The Land of Cedars, <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-rak-magenta via-pink-500 to-amber-500 bg-clip-text text-transparent">
                    Courage & Timeless Creativity.
                  </span>
                </h2>
              </div>

              {/* Poetic description */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-rak-slate-300 leading-relaxed font-normal">
                Lebanon is more than a homeland; it is an enduring state of mind. A sacred cradle of alphabet pioneers, Mediterranean light, and invincible passion. At RAK4Creative, we carry this vibrant legacy into every digital ecosystem, campaign, and brand we build across the globe.
              </p>

              {/* Arabic Calligraphy & Quote Accent */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex items-center justify-between gap-4">
                <div className="space-y-1 text-left">
                  <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 font-serif italic">
                    "من بيروت إلى العالم.. نبضٌ لا ينطفئ وإبداعٌ يعانق الأفق"
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-rak-slate-400">
                    From Beirut to the Horizon • Endless Passion, Unbound Vision
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-rak-magenta/10 border border-rak-magenta/20 text-rak-magenta shrink-0">
                  <Heart className="w-5 h-5 fill-rak-magenta text-rak-magenta animate-pulse" />
                </div>
              </div>

            </div>

            {/* Right Col: Lebanon Cinematic Video Player (Clean on White/Transparent Background) */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-white/10 bg-white dark:bg-rak-slate-900/60 p-2 sm:p-4">
                <video
                  src="/lebanon.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto rounded-2xl object-contain bg-white dark:bg-transparent"
                />
              </div>
            </div>

          </div>

        </div>

        {/* 3 Pillars of Lebanese Creative Genius */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PILLARS_OF_BEIRUT.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <SpotlightCard
                key={idx}
                spotlightColor="rgba(236, 0, 140, 0.12)"
                borderColor="rgba(226, 232, 240, 0.8)"
                className="group relative p-7 rounded-3xl bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-rak-magenta/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-rak-magenta group-hover:bg-rak-magenta group-hover:text-white transition-all duration-300">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 dark:text-rak-slate-400 uppercase px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      {pillar.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-rak-magenta uppercase tracking-wider block">
                      {pillar.tagline}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-rak-slate-300 leading-relaxed font-normal">
                    {pillar.desc}
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-rak-slate-400">
                  <span>RAK • BEIRUT</span>
                  <span className="text-[#00A651] font-bold">★ Heritage</span>
                </div>
              </SpotlightCard>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default LebanonTributeSection;

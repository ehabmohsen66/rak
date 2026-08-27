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
  const [likesCount, setLikesCount] = useState(() => {
    const saved = localStorage.getItem('rak_beirut_love_count');
    return saved ? parseInt(saved, 10) : 2480;
  });
  const [userClicks, setUserClicks] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const handleLike = () => {
    const newCount = likesCount + 1;
    setLikesCount(newCount);
    setUserClicks((prev) => prev + 1);
    localStorage.setItem('rak_beirut_love_count', newCount.toString());

    setAnimKey((prev) => prev + 1);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);

    // Spawn bursting heart particles
    const newHearts = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() - 0.5) * 70,
      y: -40 - Math.random() * 50,
      scale: 0.8 + Math.random() * 0.5,
      rotate: (Math.random() - 0.5) * 45
    }));
    
    setFloatingHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.slice(5));
    }, 1200);
  };

  return (
    <section className="relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Inline Keyframes for Heart Animation */}
      <style>{`
        @keyframes heart-filled-pop {
          0% { transform: scale(0); opacity: 0; }
          25% { transform: scale(1.35); opacity: 1; }
          50% { transform: scale(1); filter: brightness(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes heart-celebrate-burst {
          0% { transform: scale(0); opacity: 1; }
          50% { opacity: 1; filter: brightness(1.5); }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .animate-heart-pop {
          animation: heart-filled-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .animate-heart-celebrate {
          animation: heart-celebrate-burst 0.6s ease-out forwards;
        }
      `}</style>

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-r from-rak-magenta/15 via-[#00A651]/10 to-[#EE161F]/15 blur-3xl opacity-70 rounded-full" />

      <div className="relative z-10">

        {/* Top Header Card */}
        <div className="relative rounded-3xl p-5 sm:p-6 lg:py-8 lg:px-8 bg-gradient-to-b from-white/95 via-white/80 to-slate-50/90 dark:from-rak-slate-900/90 dark:via-rak-slate-900/70 dark:to-rak-slate-950/90 border border-slate-200/80 dark:border-white/10 shadow-xl backdrop-blur-xl overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 items-center">

            {/* Left Col: Streamlined Typography & Heart Counter */}
            <div className="lg:col-span-7 space-y-3 text-left">
              
              {/* Badge & Flag Pill */}
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white dark:bg-rak-slate-800/80 border border-slate-200 dark:border-white/10 shadow-sm">
                <LebanonFlag className="w-7 h-4.5 rounded-sm" />
                <span className="text-xs font-extrabold uppercase tracking-widest bg-gradient-to-r from-rak-magenta via-[#EE161F] to-[#00A651] bg-clip-text text-transparent">
                  Roots of Inspiration • Beirut
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00A651] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00A651]"></span>
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest text-slate-500 dark:text-rak-slate-400 uppercase">
                  <MapPin className="w-3.5 h-3.5 text-[#EE161F]" />
                  <span>From The Heart of Beirut to The World</span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                  The Land of Cedars, <br className="hidden sm:inline" />
                  <span className="bg-gradient-to-r from-[#EE161F] via-rak-magenta to-amber-500 bg-clip-text text-transparent">
                    Courage & Creativity.
                  </span>
                </h2>
              </div>

              {/* Concise Narrative */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-rak-slate-300 leading-relaxed font-normal">
                A historic cradle of alphabet pioneers, Mediterranean light, and invincible passion. At RAK4Creative, we carry this vibrant creative pulse into every global brand we engineer.
              </p>

              {/* Interactive Love Beirut Counter Bar */}
              <div>
                <div className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5 text-left">
                    <div className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-100 font-serif italic">
                      "من بيروت إلى العالم.. نبضٌ وإبداعٌ لا ينطفئ"
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 dark:text-rak-slate-400">
                      Endless Passion • Global Vision
                    </div>
                  </div>

                  {/* Flag-Red Interactive Heart Button */}
                  <div className="relative shrink-0 flex items-center">
                    
                    {/* Floating heart bursts */}
                    {floatingHearts.map((heart) => (
                      <motion.div
                        key={heart.id}
                        initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
                        animate={{ opacity: 0, y: heart.y, x: heart.x, scale: heart.scale, rotate: heart.rotate }}
                        transition={{ duration: 0.9, ease: "easeOut" }}
                        className="absolute pointer-events-none z-30"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#EE161F] drop-shadow">
                          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
                        </svg>
                      </motion.div>
                    ))}

                    <motion.button
                      whileTap={{ scale: 0.94 }}
                      onClick={handleLike}
                      className="group relative flex items-center space-x-3 px-5 py-3 rounded-2xl bg-[#EE161F] hover:bg-[#D40E16] text-white shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer overflow-visible"
                      title="Click to love Beirut!"
                    >
                      {/* Animated Celebrate Heart Container */}
                      <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
                        {/* Outline Heart */}
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white/80 absolute drop-shadow-sm transition-transform group-hover:scale-110">
                          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Zm-3.585,18.4a2.973,2.973,0,0,1-3.83,0C4.947,16.006,2,11.87,2,8.967a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,8.967a1,1,0,0,0,2,0,4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,8.967C22,11.87,19.053,16.006,13.915,20.313Z" />
                        </svg>

                        {/* Filled Animated Heart */}
                        <svg 
                          key={`filled-${animKey}`}
                          viewBox="0 0 24 24" 
                          className={`w-5 h-5 fill-white absolute drop-shadow-sm ${animating ? 'animate-heart-pop' : ''}`}
                        >
                          <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
                        </svg>

                        {/* Celebrate Sparkles Burst */}
                        {animating && (
                          <svg 
                            key={`burst-${animKey}`}
                            className="absolute w-12 h-12 pointer-events-none fill-amber-300 stroke-amber-300 stroke-[2px] animate-heart-celebrate" 
                            viewBox="0 0 100 100"
                          >
                            <polygon points="10,10 20,20" />
                            <polygon points="10,50 20,50" />
                            <polygon points="20,80 30,70" />
                            <polygon points="90,10 80,20" />
                            <polygon points="90,50 80,50" />
                            <polygon points="80,80 70,70" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="flex flex-col text-left">
                        <span className="text-[10px] font-mono font-extrabold uppercase tracking-wider leading-none text-white/90">
                          Love Beirut
                        </span>
                        <span className="text-sm font-black tracking-tight leading-tight mt-0.5 text-white">
                          {likesCount.toLocaleString()} <span className="text-[10px] font-normal opacity-90">hearts</span>
                        </span>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Col: Pure Floating Lebanon Video */}
            <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
              <video
                src="/lebanon.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="w-auto h-[200px] sm:h-[240px] lg:h-[280px] object-contain mix-blend-multiply dark:mix-blend-screen"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default LebanonTributeSection;

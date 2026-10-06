import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { GradientShimmer } from './ui/GradientShimmer';

const HERO_PHRASES = [
  "Next Level.",
  "Galactic Orbit.",
  "The Global Stage.",
  "Peak Resonance."
];

const chapter = {
  id: '01',
  name: 'The Origin',
  videoUrl: '/videos/homepage-banner.mp4',
  description: 'Brand architecture, cinematic media production, enterprise software, and performance marketing under one global powerhouse.',
  actionText: 'Learn More',
  actionType: 'scroll-capabilities'
};

// --- Animation Variants ---
const textContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 }
  }
};

const textReveal = {
  hidden: { y: "100%", opacity: 0 },
  visible: { 
    y: "0%", 
    opacity: 1,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const fadeIn = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, delay: 0.25, ease: "easeOut" } 
  }
};

// --- Sub-Components ---

const FilmGrain = () => (
  <div className="pointer-events-none absolute inset-0 z-20 opacity-[0.05] mix-blend-overlay">
    <div
      className="absolute inset-0 h-full w-full"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  </div>
);

const VideoBackground = () => {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-slate-950">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover scale-105"
      >
        <source src="/videos/homepage-banner.mp4" type="video/mp4" />
        <source src="/videos/RAK4-WebsiteHomepage banner-021026.mp4" type="video/mp4" />
      </video>
      {/* Subtle clean cinematic vignette & gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
      <FilmGrain />
    </div>
  );
};

export const CinematicHeroScroll = ({ onOpenPlanner = () => {}, setActiveTab = () => {} }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleActionClick = () => {
    if (chapter.actionType === 'open-planner') {
      onOpenPlanner();
    } else {
      const el = document.getElementById('capabilities');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section className="relative w-full h-[90vh] sm:h-screen min-h-[620px] overflow-hidden flex items-center justify-start">
      {/* 1. Full-Screen Video Background */}
      <VideoBackground />

      {/* Ambient Subtle Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[300px] bg-rak-magenta/10 rounded-full blur-[160px] pointer-events-none z-10" />

      {/* 2. Chapter Content Overlay */}
      <div className="relative z-30 w-full px-6 sm:px-12 md:px-20 lg:px-28">
        <motion.div
          variants={textContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl space-y-5 sm:space-y-6 text-left"
        >
          {/* Masked Title Reveal */}
          <div className="overflow-hidden py-1">
            <motion.h1 
              variants={textReveal}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] font-heading drop-shadow-md"
            >
              We Create Big Ideas From Ground Zero & Take Them to{' '}
              <span className="inline-block relative">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={HERO_PHRASES[phraseIndex]}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="inline-block font-black"
                  >
                    <GradientShimmer gradient="sunrise" duration={5}>
                      {HERO_PHRASES[phraseIndex]}
                    </GradientShimmer>
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>
          </div>

          {/* Clean Subtitle Paragraph */}
          <motion.p 
            variants={fadeIn}
            className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl leading-relaxed font-normal drop-shadow"
          >
            {chapter.description}
          </motion.p>

          {/* Refined Action Pill Button */}
          <motion.div variants={fadeIn} className="pt-2">
            <button
              onClick={handleActionClick}
              className="relative inline-flex items-center justify-center px-7 py-3.5 text-xs font-extrabold uppercase tracking-widest text-white bg-rak-magenta rounded-full shadow-lg hover:bg-rak-magenta-dark hover:scale-105 transition-all duration-300 group overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>{chapter.actionText}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};

export default CinematicHeroScroll;

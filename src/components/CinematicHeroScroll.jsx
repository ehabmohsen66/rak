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

const VideoBackground = () => {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-slate-950">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full object-cover"
        style={{
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        <source src="/videos/homepage-banner.mp4" type="video/mp4" />
        <source src="/videos/RAK4-WebsiteHomepage banner-021026.mp4" type="video/mp4" />
      </video>
      {/* Crisp subtle vignette for text legibility without washing out video sharpness */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-950/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/25" />
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
    <section className="relative w-full min-h-[85vh] sm:min-h-screen py-28 sm:py-32 overflow-hidden flex items-center justify-start">
      {/* 1. Full-Screen Native HD Video Background */}
      <VideoBackground />

      {/* 2. Chapter Content Overlay */}
      <div className="relative z-30 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <motion.div
          variants={textContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl space-y-5 sm:space-y-6 text-left"
        >
          {/* Masked Title Reveal */}
          <div className="py-1">
            <motion.h1 
              variants={textReveal}
              className="text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.18] font-heading drop-shadow-md"
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
                    className="inline-block font-bold"
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
            className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-xl leading-relaxed font-normal drop-shadow"
          >
            {chapter.description}
          </motion.p>

          {/* Refined Action Pill Button */}
          <motion.div variants={fadeIn} className="pt-2">
            <button
              onClick={handleActionClick}
              className="relative inline-flex items-center justify-center px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white bg-rak-magenta rounded-full shadow-lg hover:bg-rak-magenta-dark hover:scale-105 transition-all duration-300 group overflow-hidden cursor-pointer"
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

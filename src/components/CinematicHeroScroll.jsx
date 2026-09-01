import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ChevronRight, PlayCircle, Sparkles, ArrowDown } from 'lucide-react';
import { GradientShimmer } from './ui/GradientShimmer';

const HERO_PHRASES = [
  "Next Level.",
  "Galactic Orbit.",
  "The Global Stage.",
  "Peak Resonance."
];

const chapters = [
  {
    id: '01',
    name: 'The Origin',
    tag: '',
    subtitle: 'Where Vision Begins',
    videoUrl: 'https://ik.imagekit.io/kqmrslzuq/Videos/1.mp4',
    description: 'Brand architecture, high-impact media production, enterprise software, and performance marketing seamlessly integrated under one global powerhouse.',
    actionText: 'Learn More',
    actionType: 'scroll-capabilities'
  },
  {
    id: '02',
    name: 'Velocity',
    tag: 'VELOCITY • MOTION & TECH',
    subtitle: 'Moving at Lightspeed',
    videoUrl: 'https://ik.imagekit.io/kqmrslzuq/Videos/2.mp4?updatedAt=1766414784088',
    description: 'From custom digital platforms to 4K cinematic commercials and viral social campaigns — we accelerate bold brands into orbit.',
    actionText: 'Our Capabilities',
    actionType: 'scroll-capabilities'
  },
  {
    id: '03',
    name: 'Immersion',
    tag: 'IMMERSION • GLOBAL REACH',
    subtitle: 'Beneath the Surface',
    videoUrl: 'https://ik.imagekit.io/kqmrslzuq/Videos/3.mp4?updatedAt=1766415070663',
    description: 'Carrying restless creativity and uncompromising execution into iconic brands engineered to move audiences across the globe.',
    actionText: 'Start a Project',
    actionType: 'open-planner'
  }
];

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
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, delay: 0.3, ease: "easeOut" } 
  }
};

// --- Sub-Components ---

const FilmGrain = () => (
  <div className="pointer-events-none absolute inset-0 z-20 opacity-[0.06] mix-blend-overlay">
    <div
      className="absolute inset-0 h-full w-full"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
      }}
    />
  </div>
);

const VideoBackground = ({ currentChapterIndex }) => {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-slate-950">
      {chapters.map((chapter, index) => (
        <motion.div
          key={chapter.id}
          initial={{ opacity: 0 }}
          animate={{
            opacity: index === currentChapterIndex ? 1 : 0,
            zIndex: index === currentChapterIndex ? 10 : 0, 
          }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full"
        >
          <video
            src={chapter.videoUrl}
            className="h-full w-full object-cover scale-105"
            autoPlay
            muted
            loop
            playsInline
          />
          {/* Multi-layer cinematic overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/65 to-slate-950/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/50" />
        </motion.div>
      ))}
      <FilmGrain />
    </div>
  );
};

const DynamicNav = ({ activeIndex, progress, onScrollNext }) => {
  const smoothProgress = useSpring(progress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="flex items-center gap-3 sm:gap-4 rounded-full bg-slate-950/85 backdrop-blur-xl border border-white/15 p-2 pl-5 sm:pl-6 pr-2 shadow-2xl"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex flex-col text-left">
        <span className="text-[10px] uppercase font-mono tracking-widest text-rak-magenta font-bold">
          Chapter {chapters[activeIndex].id} / 03
        </span>
        <AnimatePresence mode="wait">
          <motion.span
            key={activeIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-xs sm:text-sm font-bold text-white min-w-[90px] sm:min-w-[120px] truncate"
          >
            {chapters[activeIndex].name}
          </motion.span>
        </AnimatePresence>
      </div>

      <div 
        onClick={onScrollNext}
        title="Scroll down sequence"
        className="relative h-11 w-11 flex items-center justify-center cursor-pointer group"
      >
        <svg className="h-full w-full -rotate-90 transform">
          <circle cx="22" cy="22" r="16" className="stroke-white/15" strokeWidth="2" fill="none" />
          <motion.circle
            cx="22" cy="22" r="16"
            className="stroke-rak-magenta"
            strokeWidth="2.5"
            fill="none"
            strokeDasharray="100.5"
            style={{ pathLength: smoothProgress }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
          <PlayCircle size={18} fill="white" className="text-slate-950 fill-white" />
        </div>
      </div>
    </motion.div>
  );
};

export const CinematicHeroScroll = ({ onOpenPlanner = () => {}, setActiveTab = () => {} }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      const newIndex = Math.min(
        Math.floor(latest * chapters.length),
        chapters.length - 1
      );
      setActiveIndex(newIndex);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  const handleActionClick = (chapter) => {
    if (chapter.actionType === 'open-planner') {
      onOpenPlanner();
    } else {
      const el = document.getElementById('capabilities');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleScrollNext = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const stepHeight = rect.height / chapters.length;
      const nextIndex = (activeIndex + 1) % chapters.length;
      window.scrollBy({ top: stepHeight, behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={containerRef} 
      className="relative w-full" 
      style={{ height: `${chapters.length * 100}vh` }}
    >
      {/* 1. Sticky Full-Screen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between">
        <VideoBackground currentChapterIndex={activeIndex} />

        {/* Ambient Top Glow Orbs */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[550px] h-[350px] bg-rak-magenta/15 rounded-full blur-[160px] pointer-events-none z-10" />
        <div className="absolute top-1/3 right-1/4 w-[450px] h-[350px] bg-rak-cyan/10 rounded-full blur-[140px] pointer-events-none z-10" />

        {/* Floating Chapter Navigation Pill */}
        <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
          <DynamicNav 
            activeIndex={activeIndex} 
            progress={scrollYProgress} 
            onScrollNext={handleScrollNext}
          />
        </div>

        {/* Scroll Prompt Hint */}
        <div className="absolute bottom-8 right-6 sm:right-12 hidden lg:flex items-center space-x-2 z-30 text-[10px] font-mono uppercase tracking-[0.25em] text-white/50 pointer-events-none">
          <span>Scroll Sequence</span>
          <ArrowDown className="w-3.5 h-3.5 animate-bounce text-rak-magenta" />
        </div>
      </div>

      {/* 2. Scrolling Chapter Content Overlays */}
      <div className="absolute inset-0 top-0 z-30 pointer-events-none">
        {chapters.map((chapter, index) => (
          <div
            key={chapter.id}
            className="flex h-screen w-full items-center justify-start px-6 sm:px-12 md:px-20 lg:px-28"
          >
            <motion.div
              variants={textContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false, margin: "-15%" }} 
              className="max-w-4xl pointer-events-auto space-y-6 sm:space-y-8 text-left"
            >
              {/* Header Badge Line */}
              {chapter.tag && (
                <motion.div variants={fadeIn} className="flex items-center gap-3.5">
                  <div className="h-0.5 w-10 sm:w-14 bg-rak-magenta shadow-sm" />
                  <span className="text-[11px] sm:text-xs font-extrabold uppercase font-mono tracking-[0.28em] text-rak-magenta bg-rak-magenta/10 border border-rak-magenta/30 px-3 py-1 rounded-full backdrop-blur-md">
                    {chapter.tag}
                  </span>
                </motion.div>
              )}

              {/* Masked Title Reveal */}
              <div className="overflow-hidden py-1">
                {index === 0 ? (
                  <motion.h1 
                    variants={textReveal}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-heading"
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
                ) : index === 1 ? (
                  <motion.h2 
                    variants={textReveal}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-heading"
                  >
                    Crafting High-Speed Platforms &{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-rak-cyan via-blue-400 to-indigo-400 font-black">
                      3D Cinema.
                    </span>
                  </motion.h2>
                ) : (
                  <motion.h2 
                    variants={textReveal}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] font-heading"
                  >
                    Born in Beirut.{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-rak-magenta via-pink-400 to-amber-300 font-black">
                      Built to Move the World.
                    </span>
                  </motion.h2>
                )}
              </div>

              {/* Description Glass Box */}
              <motion.div 
                variants={fadeIn}
                className="max-w-xl p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/15 bg-slate-950/60 backdrop-blur-xl shadow-2xl space-y-2"
              >
                <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal">
                  {chapter.description}
                </p>
              </motion.div>

              {/* Interactive Action Button */}
              <motion.div variants={fadeIn} className="pt-2">
                <button
                  onClick={() => handleActionClick(chapter)}
                  className="group inline-flex items-center gap-4 text-white font-bold cursor-pointer"
                >
                  <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full border border-white/30 bg-white/10 backdrop-blur-md flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-rak-magenta shadow-lg">
                    <div className="absolute inset-0 bg-rak-magenta translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <ChevronRight size={22} className="relative z-10 text-white transition-transform duration-300 group-hover:translate-x-0.5" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="tracking-[0.22em] uppercase text-xs font-extrabold font-mono text-white group-hover:text-rak-magenta transition-colors">
                      {chapter.actionText}
                    </span>
                    <span className="text-[11px] text-slate-400 font-normal">
                      {index === 2 ? 'Start a conversation' : 'Explore what we do'}
                    </span>
                  </div>
                </button>
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CinematicHeroScroll;

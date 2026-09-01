import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, PlayCircle } from 'lucide-react';
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
    videoUrl: 'https://ik.imagekit.io/kqmrslzuq/Videos/1.mp4',
    description: 'Brand architecture, cinematic media production, enterprise software, and performance marketing under one global powerhouse.',
    actionText: 'Learn More',
    actionType: 'scroll-capabilities'
  },
  {
    id: '02',
    name: 'Velocity',
    videoUrl: 'https://ik.imagekit.io/kqmrslzuq/Videos/2.mp4?updatedAt=1766414784088',
    description: 'Bespoke digital platforms, commercial 3D motion, and high-conversion ad engines accelerating bold brands into orbit.',
    actionText: 'Our Capabilities',
    actionType: 'scroll-capabilities'
  },
  {
    id: '03',
    name: 'Immersion',
    videoUrl: 'https://ik.imagekit.io/kqmrslzuq/Videos/3.mp4?updatedAt=1766415070663',
    description: 'Relentless creativity and precision engineering building unforgettable brand experiences from Beirut to the world.',
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
          {/* Subtle clean cinematic vignette & gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-slate-950/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/30" />
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
      className="flex items-center gap-3 rounded-full bg-slate-950/80 backdrop-blur-xl border border-white/15 p-1.5 pl-5 pr-1.5 shadow-2xl"
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex items-center space-x-2 text-left">
        <span className="text-[10px] uppercase font-mono tracking-widest text-rak-magenta font-bold">
          {chapters[activeIndex].id}
        </span>
        <span className="text-white/20 text-xs">/</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={activeIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs font-bold text-white min-w-[80px] sm:min-w-[95px] truncate"
          >
            {chapters[activeIndex].name}
          </motion.span>
        </AnimatePresence>
      </div>

      <div 
        onClick={onScrollNext}
        title="Next sequence"
        className="relative h-9 w-9 flex items-center justify-center cursor-pointer group"
      >
        <svg className="h-full w-full -rotate-90 transform">
          <circle cx="18" cy="18" r="14" className="stroke-white/15" strokeWidth="2" fill="none" />
          <motion.circle
            cx="18" cy="18" r="14"
            className="stroke-rak-magenta"
            strokeWidth="2"
            fill="none"
            strokeDasharray="88"
            style={{ pathLength: smoothProgress }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110">
          <PlayCircle size={15} fill="white" className="text-slate-950 fill-white" />
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

        {/* Ambient Subtle Glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[500px] h-[300px] bg-rak-magenta/10 rounded-full blur-[160px] pointer-events-none z-10" />

        {/* Floating Chapter Navigation Pill */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
          <DynamicNav 
            activeIndex={activeIndex} 
            progress={scrollYProgress} 
            onScrollNext={handleScrollNext}
          />
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
              className="max-w-3xl pointer-events-auto space-y-5 sm:space-y-6 text-left"
            >
              {/* Masked Title Reveal */}
              <div className="overflow-hidden py-1">
                {index === 0 ? (
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
                ) : index === 1 ? (
                  <motion.h2 
                    variants={textReveal}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] font-heading drop-shadow-md"
                  >
                    High-Speed Tech &{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-rak-cyan via-blue-400 to-indigo-400 font-black">
                      3D Cinema.
                    </span>
                  </motion.h2>
                ) : (
                  <motion.h2 
                    variants={textReveal}
                    className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] font-heading drop-shadow-md"
                  >
                    Born in Beirut.{' '}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-rak-magenta via-pink-400 to-amber-300 font-black">
                      Built to Move the World.
                    </span>
                  </motion.h2>
                )}
              </div>

              {/* Clean Subtitle Paragraph (no bulky box) */}
              <motion.p 
                variants={fadeIn}
                className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-xl leading-relaxed font-normal drop-shadow"
              >
                {chapter.description}
              </motion.p>

              {/* Refined Action Pill Button */}
              <motion.div variants={fadeIn} className="pt-2">
                <button
                  onClick={() => handleActionClick(chapter)}
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
        ))}
      </div>
    </section>
  );
};

export default CinematicHeroScroll;

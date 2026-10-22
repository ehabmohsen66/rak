import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Volume2, VolumeX } from 'lucide-react';
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

// --- Web Audio API Synthesizer for Playful Bubble "Blip, Blip" Sounds ---
const playSingleBubbleBlip = (ctx, startTimeOffset = 0, baseFreq = 340, endFreq = 860, duration = 0.095, volume = 0.22) => {
  if (!ctx) return;
  const now = ctx.currentTime + startTimeOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  // Classic water bubble physics: rapid upward exponential pitch sweep
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  // Soft attack and clean decay to avoid clicks
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(volume, now + duration * 0.25);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.01);
};

const playBubbleCluster = (ctx) => {
  if (!ctx) return;
  // "Blip, blip!" double/triple harmonic bubble pop
  const pitchShift = 0.9 + Math.random() * 0.25;
  playSingleBubbleBlip(ctx, 0, 320 * pitchShift, 780 * pitchShift, 0.09, 0.22);
  playSingleBubbleBlip(ctx, 0.12, 410 * pitchShift, 980 * pitchShift, 0.085, 0.18);
  if (Math.random() > 0.35) {
    playSingleBubbleBlip(ctx, 0.24, 480 * pitchShift, 1120 * pitchShift, 0.07, 0.13);
  }
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

const VideoBackground = ({ videoRef, isMuted }) => {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-slate-950">
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
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
  const [soundEnabled, setSoundEnabled] = useState(false);
  const videoRef = useRef(null);
  const audioCtxRef = useRef(null);
  const bubbleTimerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const stopBubbleAudio = useCallback(() => {
    if (bubbleTimerRef.current) {
      clearInterval(bubbleTimerRef.current);
      bubbleTimerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  const toggleSound = () => {
    const nextState = !soundEnabled;
    setSoundEnabled(nextState);

    if (nextState) {
      // Unmute video element if it has an embedded audio track
      if (videoRef.current) {
        videoRef.current.muted = false;
      }

      // Initialize or resume Web Audio API context for synthesized bubble blips
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === 'suspended') {
          audioCtxRef.current.resume();
        }
        // Immediate playful "blip, blip!" feedback on toggle
        playBubbleCluster(audioCtxRef.current);

        // Ambient periodic bubble blips synced with the floating bubble animation
        if (bubbleTimerRef.current) clearInterval(bubbleTimerRef.current);
        bubbleTimerRef.current = setInterval(() => {
          if (document.visibilityState === 'visible' && audioCtxRef.current?.state === 'running') {
            playBubbleCluster(audioCtxRef.current);
          }
        }, 2400);
      }
    } else {
      stopBubbleAudio();
    }
  };

  useEffect(() => {
    return () => {
      stopBubbleAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopBubbleAudio]);

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
      <style>{`
        @keyframes bubble-eq-1 { 0%, 100% { height: 4px; } 50% { height: 14px; } }
        @keyframes bubble-eq-2 { 0%, 100% { height: 12px; } 50% { height: 5px; } }
        @keyframes bubble-eq-3 { 0%, 100% { height: 6px; } 50% { height: 15px; } }
        @keyframes bubble-float-ring {
          0% { transform: scale(0.85); opacity: 0.75; }
          100% { transform: scale(1.75); opacity: 0; }
        }
        .bubble-eq-bar-1 { animation: bubble-eq-1 0.7s ease-in-out infinite; }
        .bubble-eq-bar-2 { animation: bubble-eq-2 0.55s ease-in-out infinite; }
        .bubble-eq-bar-3 { animation: bubble-eq-3 0.8s ease-in-out infinite; }
        .bubble-pulse-ring { animation: bubble-float-ring 1.8s cubic-bezier(0.16, 1, 0.3, 1) infinite; }
      `}</style>

      {/* 1. Full-Screen Native HD Video Background */}
      <VideoBackground videoRef={videoRef} isMuted={!soundEnabled} />

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

          {/* Refined Action Pill Button + Bubble Sound Toggle */}
          <motion.div variants={fadeIn} className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={handleActionClick}
              className="relative inline-flex items-center justify-center px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white bg-rak-magenta rounded-full shadow-lg hover:bg-rak-magenta-dark hover:scale-105 transition-all duration-300 group overflow-hidden cursor-pointer"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>{chapter.actionText}</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>

            {/* Interactive Bubble Sound Toggle Button */}
            <button
              onClick={toggleSound}
              aria-label={soundEnabled ? 'Mute bubble sound' : 'Unmute bubble sound'}
              title={soundEnabled ? 'Mute Bubble Sound' : 'Play Bubble Sound (Blip, Blip!)'}
              className={`relative inline-flex items-center space-x-2.5 px-5 py-3.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xl border transition-all duration-300 cursor-pointer ${
                soundEnabled
                  ? 'bg-rak-magenta/90 border-pink-400 text-white shadow-[0_0_20px_rgba(236,0,140,0.55)] scale-105'
                  : 'bg-slate-900/75 hover:bg-slate-900/95 border-white/25 hover:border-rak-magenta/60 text-slate-100 hover:text-white shadow-lg'
              }`}
            >
              {soundEnabled && (
                <span className="absolute inset-0 rounded-full border border-pink-400 bubble-pulse-ring pointer-events-none" />
              )}
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-white shrink-0" />
                  <span>Sound On</span>
                  <span className="flex items-end space-x-0.5 h-3.5 ml-1" aria-hidden="true">
                    <span className="w-0.5 bg-white rounded-full bubble-eq-bar-1" />
                    <span className="w-0.5 bg-white rounded-full bubble-eq-bar-2" />
                    <span className="w-0.5 bg-white rounded-full bubble-eq-bar-3" />
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-rak-magenta shrink-0" />
                  <span>Bubble Sound</span>
                </>
              )}
            </button>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
};

export default CinematicHeroScroll;

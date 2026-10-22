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

const VideoBackground = ({ videoRef }) => {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-slate-950">
      <video
        ref={videoRef}
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const videoRef = useRef(null);
  const audioCtxRef = useRef(null);
  const autoOffTimerRef = useRef(null);
  const secondBlipTimerRef = useRef(null);
  const manuallyMutedRef = useRef(false);
  const hasAutoPlayedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const stopBubbleAudio = useCallback(() => {
    if (autoOffTimerRef.current) {
      clearTimeout(autoOffTimerRef.current);
      autoOffTimerRef.current = null;
    }
    if (secondBlipTimerRef.current) {
      clearTimeout(secondBlipTimerRef.current);
      secondBlipTimerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.muted = true;
    }
  }, []);

  const playBubbleOnceAndAutoOff = useCallback((ctx) => {
    stopBubbleAudio();
    hasAutoPlayedRef.current = true;
    setSoundEnabled(true);

    // Unmute the embedded video audio track for 1 cycle (~5s)
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.muted = false;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // If browser blocks unmuted video autoplay on refresh before interaction, keep video playing muted
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    }

    // Play synthesized "blip, blip" bubble clusters via Web Audio API
    const activeCtx = ctx || audioCtxRef.current;
    if (activeCtx) {
      const triggerBlips = () => {
        if (manuallyMutedRef.current || activeCtx.state !== 'running') return;
        playBubbleCluster(activeCtx);
        secondBlipTimerRef.current = setTimeout(() => {
          if (activeCtx.state === 'running' && !manuallyMutedRef.current) {
            playBubbleCluster(activeCtx);
          }
        }, 650);
      };

      if (activeCtx.state === 'running') {
        triggerBlips();
      } else if (activeCtx.state === 'suspended') {
        activeCtx.resume().then(triggerBlips).catch(() => {});
      }
    }

    // Automatically turn off after playing once so it never annoys the user
    autoOffTimerRef.current = setTimeout(() => {
      stopBubbleAudio();
      setSoundEnabled(false);
    }, 5000);
  }, [stopBubbleAudio]);

  // Autoplay bubble sound once on window load / refresh (with instant fallback if browser requires a gesture after hard refresh)
  useEffect(() => {
    manuallyMutedRef.current = false;
    hasAutoPlayedRef.current = false;

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx && (!audioCtxRef.current || audioCtxRef.current.state === 'closed')) {
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;

    const tryAutoPlayOnRefresh = async () => {
      if (manuallyMutedRef.current || hasAutoPlayedRef.current) return;

      // 1. Try unmuting the hero video directly (plays the embedded audio track immediately if allowed)
      let playedUnmuted = false;
      const video = videoRef.current;
      if (video) {
        try {
          video.currentTime = 0;
          video.muted = false;
          await video.play();
          playedUnmuted = !video.muted;
        } catch {
          video.muted = true;
          video.play().catch(() => {});
        }
      }

      // 2. Try resuming Web Audio API context for the synthesized bubble blips
      if (ctx && ctx.state === 'suspended') {
        try {
          await ctx.resume();
        } catch {
          // Suspended until gesture
        }
      }

      if (playedUnmuted || (ctx && ctx.state === 'running')) {
        playBubbleOnceAndAutoOff(ctx);
      }
    };

    tryAutoPlayOnRefresh();

    // Fallback: if browser strict autoplay policy blocked audio on hard refresh, trigger the moment the user moves, scrolls, touches, or clicks
    const unlockEvents = ['pointerdown', 'pointermove', 'mousemove', 'wheel', 'touchstart', 'keydown', 'click'];
    const removeUnlockListeners = () => {
      unlockEvents.forEach((evt) => window.removeEventListener(evt, handleUnlock));
    };

    function handleUnlock() {
      if (manuallyMutedRef.current || hasAutoPlayedRef.current) {
        removeUnlockListeners();
        return;
      }
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => {
          if (ctx.state === 'running' && !hasAutoPlayedRef.current && !manuallyMutedRef.current) {
            removeUnlockListeners();
            playBubbleOnceAndAutoOff(ctx);
          }
        }).catch(() => {});
      } else {
        removeUnlockListeners();
        playBubbleOnceAndAutoOff(ctx);
      }
    }

    unlockEvents.forEach((evt) => window.addEventListener(evt, handleUnlock, { passive: true }));

    return () => {
      removeUnlockListeners();
      stopBubbleAudio();
    };
  }, [playBubbleOnceAndAutoOff, stopBubbleAudio]);

  const toggleSound = (e) => {
    e?.stopPropagation();
    if (soundEnabled) {
      // Turn off immediately
      manuallyMutedRef.current = true;
      stopBubbleAudio();
      setSoundEnabled(false);
    } else {
      // Play once and auto-turn-off
      manuallyMutedRef.current = false;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx && (!audioCtxRef.current || audioCtxRef.current.state === 'closed')) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().then(() => playBubbleOnceAndAutoOff(ctx)).catch(() => {
          playBubbleOnceAndAutoOff(ctx);
        });
      } else {
        playBubbleOnceAndAutoOff(ctx);
      }
    }
  };

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
      <VideoBackground videoRef={videoRef} />

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

      {/* 3. Small Black Sound Icon Button — Bottom-Right of the Video */}
      <button
        onClick={toggleSound}
        aria-label={soundEnabled ? 'Turn off bubble sound' : 'Play bubble sound once'}
        title={soundEnabled ? 'Turn off sound' : 'Play bubble sound'}
        className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 w-10 h-10 rounded-full bg-black/85 hover:bg-black border border-white/15 text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 cursor-pointer"
      >
        {soundEnabled ? (
          <Volume2 className="w-4 h-4 text-white" />
        ) : (
          <VolumeX className="w-4 h-4 text-white/70" />
        )}
      </button>

    </section>
  );
};

export default CinematicHeroScroll;

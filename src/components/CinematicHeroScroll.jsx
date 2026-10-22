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
  if (!ctx || ctx.state !== 'running') return;
  const now = ctx.currentTime + startTimeOffset;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(baseFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(volume, now + duration * 0.25);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.01);
};

const playBubbleCluster = (ctx) => {
  if (!ctx || ctx.state !== 'running') return;
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

const SOUND_DURATION_MS = 12000;
const BUBBLE_BLIP_OFFSETS_MS = [
  0, 800, 1600, 2500, 3400, 4300, 5200, 6100, 7000, 8000, 9000, 10000, 11000
];

// --- Sub-Components ---
// Video is permanently muted to guarantee 100% smooth, 60fps, zero-lag playback on all browsers
const VideoBackground = React.memo(({ videoRef }) => {
  return (
    <div className="absolute inset-0 h-full w-full overflow-hidden bg-slate-950 pointer-events-none">
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
});

export const CinematicHeroScroll = ({ onOpenPlanner = () => {}, setActiveTab = () => {} }) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const videoRef = useRef(null);
  const audioElRef = useRef(null);
  const audioCtxRef = useRef(null);
  const autoOffTimerRef = useRef(null);
  const blipTimersRef = useRef([]);
  const hasAutoPlayedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Ensure video plays smoothly right away on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const stopAudio = useCallback(() => {
    if (autoOffTimerRef.current) {
      clearTimeout(autoOffTimerRef.current);
      autoOffTimerRef.current = null;
    }
    if (blipTimersRef.current.length > 0) {
      blipTimersRef.current.forEach((id) => clearTimeout(id));
      blipTimersRef.current = [];
    }
    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.currentTime = 0;
    }
    setSoundEnabled(false);
  }, []);

  const playAudioFor12Seconds = useCallback(() => {
    // Stop any existing playback and timers first
    if (autoOffTimerRef.current) clearTimeout(autoOffTimerRef.current);
    blipTimersRef.current.forEach((id) => clearTimeout(id));
    blipTimersRef.current = [];

    // 1. Play the 12s high-energy bubble track
    if (audioElRef.current) {
      audioElRef.current.currentTime = 0;
      audioElRef.current.volume = 0.95;
      audioElRef.current.play().catch(() => {});
    }

    // 2. Schedule synthesized harmonic bubble pops across the 12 seconds
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      const triggerBlips = () => {
        BUBBLE_BLIP_OFFSETS_MS.forEach((delayMs) => {
          if (delayMs === 0) {
            playBubbleCluster(ctx);
          } else {
            const timerId = setTimeout(() => {
              playBubbleCluster(ctx);
            }, delayMs);
            blipTimersRef.current.push(timerId);
          }
        });
      };

      if (ctx.state === 'suspended') {
        ctx.resume().then(triggerBlips).catch(() => {});
      } else if (ctx.state === 'running') {
        triggerBlips();
      }
    }

    setSoundEnabled(true);

    // Auto-turn off sound cleanly after exactly 12 seconds
    autoOffTimerRef.current = setTimeout(() => {
      stopAudio();
    }, SOUND_DURATION_MS);
  }, [stopAudio]);

  // Attempt automatic play on load, with first-gesture fallback if browser enforces autoplay restrictions
  useEffect(() => {
    const handleFirstGesture = () => {
      if (hasAutoPlayedRef.current) return;
      hasAutoPlayedRef.current = true;
      removeGestureListeners();
      playAudioFor12Seconds();
    };

    const removeGestureListeners = () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('touchstart', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };

    // Try playing immediately if browser permits (e.g. active user engagement or unblocked session)
    if (audioElRef.current) {
      audioElRef.current.volume = 0.95;
      const playPromise = audioElRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Autoplay succeeded!
            hasAutoPlayedRef.current = true;
            playAudioFor12Seconds();
          })
          .catch(() => {
            // Autoplay blocked by browser policy without gesture — wait for first click/tap anywhere
            window.addEventListener('pointerdown', handleFirstGesture, { once: true, passive: true });
            window.addEventListener('touchstart', handleFirstGesture, { once: true, passive: true });
            window.addEventListener('keydown', handleFirstGesture, { once: true, passive: true });
          });
      }
    }

    return () => {
      removeGestureListeners();
      stopAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [playAudioFor12Seconds, stopAudio]);

  const toggleSound = (e) => {
    e?.stopPropagation();
    hasAutoPlayedRef.current = true;

    if (soundEnabled) {
      // User clicked to mute
      stopAudio();
    } else {
      // User clicked to play -> play for 12 seconds immediately
      playAudioFor12Seconds();
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
      {/* Dedicated HTML5 audio element for the 12s bubble sound */}
      <audio
        ref={audioElRef}
        src="/videos/hero-bubble.mp3"
        preload="auto"
        className="hidden"
      />

      {/* 1. Full-Screen Native HD Video Background — Muted for 60fps zero-lag performance */}
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
        aria-label={soundEnabled ? 'Turn off sound' : 'Play sound (12s)'}
        title={soundEnabled ? 'Turn off sound' : 'Play sound (12s)'}
        className={`absolute bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 w-10 h-10 rounded-full bg-black/85 hover:bg-black border border-white/15 text-white flex items-center justify-center shadow-xl backdrop-blur-md transition-all duration-200 hover:scale-105 cursor-pointer ${
          soundEnabled ? 'ring-2 ring-rak-magenta/80 shadow-[0_0_15px_rgba(236,0,140,0.5)]' : ''
        }`}
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

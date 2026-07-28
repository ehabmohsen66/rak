import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ---------------- WordsPullUp ---------------- */
export const WordsPullUp = ({ text, className = "", showAsterisk = false, style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = text.split(" ");

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 30, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.2em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="absolute top-[0.55em] -right-[0.3em] text-[0.3em] text-rak-magenta font-bold">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
export const WordsPullUpMultiStyle = ({ segments, className = "", style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const words = [];
  segments.forEach((seg) => {
    seg.text.split(" ").forEach((w) => {
      if (w) words.push({ word: w, className: seg.className });
    });
  });

  return (
    <div ref={ref} className={`inline-flex flex-wrap justify-center ${className}`} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          initial={{ y: 30, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.25em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- Fullscreen PrismaHero ---------------- */
export const PrismaHero = () => {
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen w-full overflow-hidden bg-rak-slate-950 flex flex-col justify-end pb-12 sm:pb-16 pt-28">
      
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-75"
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4"
      />

      {/* Ambient noise & dark gradients */}
      <div className="noise-overlay pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-rak-slate-950/70 via-rak-slate-950/30 to-rak-slate-950" />

      {/* Hero Content Layer */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 items-end gap-6">
          
          {/* Huge Brand Typography */}
          <div className="col-span-12 lg:col-span-8">
            <h1
              className="font-extrabold leading-[0.88] tracking-[-0.06em] text-[15vw] sm:text-[14vw] md:text-[12vw] lg:text-[10vw] text-white selection:bg-rak-magenta select-none"
            >
              <WordsPullUp text="RAK4Creative" showAsterisk />
            </h1>
          </div>

          {/* Supporting Statement */}
          <div className="col-span-12 lg:col-span-4 pb-2 sm:pb-4">
            <motion.p
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm sm:text-base text-rak-slate-200 font-medium leading-relaxed max-w-md"
            >
              RAK4Creative is a worldwide full-service agency bound by passion and hunger to unlock potential through our unique perspectives, bold creativity, and tech magic.
            </motion.p>
          </div>

        </div>
      </div>

    </section>
  );
};

export default PrismaHero;

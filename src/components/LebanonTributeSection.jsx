import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Flame, Globe2, Sparkles } from 'lucide-react';

const CEDAR_PATH = 'M50 8 C48 10, 46 16, 44 20 C40 20, 36 22, 33 25 C37 27, 41 27, 45 28 C41 30, 34 32, 28 36 C33 38, 39 39, 45 39 C38 43, 29 46, 22 52 C28 54, 37 54, 44 54 C36 59, 25 63, 16 71 C25 73, 36 73, 45 71 C45 76, 43 83, 41 90 L59 90 C57 83, 55 76, 55 71 C64 73, 75 73, 84 71 C75 63, 64 59, 56 54 C63 54, 72 54, 78 52 C71 46, 62 43, 55 39 C61 39, 67 38, 72 36 C66 32, 59 30, 55 28 C59 27, 63 27, 67 25 C64 22, 60 20, 56 20 C54 16, 52 10, 50 8 Z';

const PILLARS_OF_BEIRUT = [
  {
    icon: Flame,
    number: '01',
    title: 'Resilience',
    desc: 'The courage to rebuild, rethink, and rise.'
  },
  {
    icon: Globe2,
    number: '02',
    title: 'Crossroads',
    desc: 'A Beirut perspective shaped for a global stage.'
  },
  {
    icon: Sparkles,
    number: '03',
    title: 'Imagination',
    desc: 'A culture that has always imagined what comes next.'
  }
];

export const LebanonFlag = ({ className = 'w-10 h-7' }) => (
  <div
    className={`relative overflow-hidden border border-white/20 flex flex-col shrink-0 ${className}`}
    aria-label="Lebanese flag"
    role="img"
  >
    <div className="h-[28%] bg-[#EE161F] w-full" />
    <div className="h-[44%] bg-white w-full flex items-center justify-center px-0.5">
      <svg viewBox="0 0 100 100" className="h-full w-auto fill-[#007A3D]" aria-hidden="true">
        <path d={CEDAR_PATH} />
      </svg>
    </div>
    <div className="h-[28%] bg-[#EE161F] w-full" />
  </div>
);

const BeirutVisual = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative min-h-[410px] sm:min-h-[500px] lg:min-h-full overflow-hidden bg-[#0A0D0B] border-t lg:border-t-0 lg:border-l border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(0,122,61,0.24),transparent_42%),radial-gradient(circle_at_84%_18%,rgba(236,0,140,0.18),transparent_28%)]" />

      <svg
        viewBox="0 0 520 620"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id="beirut-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M42 0H0V42" fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="1" />
          </pattern>
          <linearGradient id="beirut-route" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#EE161F" />
            <stop offset="0.54" stopColor="#EC008C" />
            <stop offset="1" stopColor="#FFFFFF" />
          </linearGradient>
        </defs>

        <rect width="520" height="620" fill="url(#beirut-grid)" />
        <circle cx="260" cy="310" r="188" fill="none" stroke="rgba(255,255,255,0.08)" />
        <circle cx="260" cy="310" r="128" fill="none" stroke="rgba(255,255,255,0.08)" />
        <path d="M0 494 C136 462 168 382 255 370 C373 354 402 214 520 175" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
        <motion.path
          d="M0 494 C136 462 168 382 255 370 C373 354 402 214 520 175"
          fill="none"
          stroke="url(#beirut-route)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={shouldReduceMotion ? false : { pathLength: 0, opacity: 0.25 }}
          whileInView={{ pathLength: 1, opacity: 0.9 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <circle cx="87" cy="462" r="6" fill="#EE161F" />
        <circle cx="87" cy="462" r="13" fill="none" stroke="rgba(238,22,31,0.42)" />
        <circle cx="451" cy="211" r="5" fill="#FFFFFF" />
        <circle cx="451" cy="211" r="12" fill="none" stroke="rgba(255,255,255,0.36)" />
      </svg>

      <div className="absolute left-6 top-6 sm:left-9 sm:top-9 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
        <span>01 / Origin</span>
        <span className="h-px w-10 bg-[#EE161F]" />
      </div>

      <div className="absolute right-6 top-6 sm:right-9 sm:top-9 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
        <div>33.8938° N</div>
        <div>35.5018° E</div>
      </div>

      <motion.div
        className="absolute left-1/2 top-1/2 w-[250px] -translate-x-1/2 -translate-y-[48%] sm:w-[330px] lg:w-[360px]"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.65, ease: 'easeOut' }}
      >
        <div className="absolute inset-0 scale-[1.08] blur-3xl bg-[#007A3D]/20" />
        <svg viewBox="0 0 100 100" className="relative w-full drop-shadow-[0_30px_55px_rgba(0,0,0,0.55)]" aria-hidden="true">
          <path d={CEDAR_PATH} fill="none" stroke="rgba(238,22,31,0.38)" strokeWidth="1.4" transform="translate(-2 -1)" />
          <path d={CEDAR_PATH} fill="#007A3D" />
          <path d={CEDAR_PATH} fill="none" stroke="rgba(255,255,255,0.42)" strokeWidth="0.65" />
        </svg>
      </motion.div>

      <div className="absolute bottom-7 left-6 sm:bottom-9 sm:left-9">
        <div className="font-heading text-[clamp(2.8rem,8vw,5rem)] font-black uppercase leading-none tracking-[-0.06em] text-white/95">
          Beirut
        </div>
        <div className="mt-2 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-white/45">
          <span>Mediterranean soul</span>
          <span className="h-1 w-1 rounded-full bg-rak-magenta" />
          <span>Global vision</span>
        </div>
      </div>

      <div className="absolute bottom-[128px] left-[78px] hidden sm:block font-mono text-[9px] uppercase tracking-[0.18em] text-[#ff8085]">
        From here
      </div>
      <div className="absolute right-7 top-[174px] hidden sm:block font-mono text-[9px] uppercase tracking-[0.18em] text-white/55">
        To the world
      </div>
    </div>
  );
};

export const LebanonTributeSection = ({ onOpenPlanner }) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="lebanon-tribute-title"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="relative overflow-hidden rounded-[2rem] border border-black/20 bg-[#111512] text-white shadow-[0_35px_90px_-45px_rgba(5,15,9,0.85)]">
        <div className="absolute inset-y-0 left-0 w-[65%] bg-[radial-gradient(circle_at_12%_18%,rgba(238,22,31,0.14),transparent_32%),radial-gradient(circle_at_76%_80%,rgba(236,0,140,0.12),transparent_34%)] pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-[1.18fr_0.82fr] lg:min-h-[650px]">
          <motion.div
            className="flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          >
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <LebanonFlag className="w-9 h-6" />
                <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-white/58">
                  Roots of inspiration
                </span>
                <span className="h-px w-8 bg-[#EE161F]" />
                <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.22em] text-[#72c894]">
                  Beirut, Lebanon
                </span>
              </div>

              <h2
                id="lebanon-tribute-title"
                className="mt-8 max-w-[760px] font-heading text-[clamp(2.75rem,5.2vw,5.4rem)] font-black uppercase leading-[0.92] tracking-[-0.055em]"
              >
                The land of cedars.
                <span className="mt-1 block text-[#ff3340]">Courage in every idea.</span>
              </h2>

              <p className="mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-white/68">
                Born in a city where cultures, languages, and generations meet. RAK4Creative carries Beirut&rsquo;s restless imagination into brands built to move the world.
              </p>

              <blockquote className="mt-8 max-w-xl border-l-2 border-[#EE161F] pl-5 sm:pl-6">
                <p lang="ar" dir="rtl" className="text-right font-serif text-xl sm:text-2xl font-semibold leading-relaxed text-white">
                  من بيروت إلى العالم.. نبضٌ وإبداعٌ لا ينطفئ
                </p>
                <footer className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/42">
                  An endless pulse. A global vision.
                </footer>
              </blockquote>

              <button
                type="button"
                onClick={() => onOpenPlanner?.()}
                className="group mt-9 inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 py-3 text-xs font-extrabold uppercase tracking-[0.13em] text-[#111512] transition-colors duration-200 hover:bg-rak-magenta hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-4 focus-visible:ring-offset-[#111512] cursor-pointer"
              >
                <span>Create with RAK</span>
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-12 border-y border-white/10 sm:grid sm:grid-cols-3 sm:divide-x sm:divide-white/10 lg:mt-10">
              {PILLARS_OF_BEIRUT.map((pillar) => {
                const PillarIcon = pillar.icon;

                return (
                  <article
                    key={pillar.number}
                    className="border-b border-white/10 py-5 last:border-b-0 sm:border-b-0 sm:px-5 sm:first:pl-0 sm:last:pr-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-[#ff5d66]">{pillar.number}</span>
                      <PillarIcon className="h-4 w-4 text-white/42" strokeWidth={1.6} aria-hidden="true" />
                    </div>
                    <h3 className="mt-4 text-sm font-extrabold uppercase tracking-[0.08em] text-white">{pillar.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/50">{pillar.desc}</p>
                  </article>
                );
              })}
            </div>
          </motion.div>

          <BeirutVisual />
        </div>
      </div>
    </section>
  );
};

export default LebanonTributeSection;

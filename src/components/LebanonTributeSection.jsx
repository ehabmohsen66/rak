import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export const LebanonFlag = ({ className = 'w-12 h-8' }) => (
  <motion.div
    whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
    className={`relative rounded-[3px] overflow-hidden shadow-md ring-1 ring-white/20 flex flex-col shrink-0 select-none ${className}`}
    style={{ minWidth: '28px' }}
  >
    <div className="h-[28%] bg-[#EE161F] w-full" />
    <div className="h-[44%] bg-white w-full flex items-center justify-center relative px-0.5">
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto text-[#00A651] fill-current"
        style={{ maxHeight: '95%' }}
      >
        <path d="M50 8 C48 10, 46 16, 44 20 C40 20, 36 22, 33 25 C37 27, 41 27, 45 28 C41 30, 34 32, 28 36 C33 38, 39 39, 45 39 C38 43, 29 46, 22 52 C28 54, 37 54, 44 54 C36 59, 25 63, 16 71 C25 73, 36 73, 45 71 C45 76, 43 83, 41 90 L59 90 C57 83, 55 76, 55 71 C64 73, 75 73, 84 71 C75 63, 64 59, 56 54 C63 54, 72 54, 78 52 C71 46, 62 43, 55 39 C61 39, 67 38, 72 36 C66 32, 59 30, 55 28 C59 27, 63 27, 67 25 C64 22, 60 20, 56 20 C54 16, 52 10, 50 8 Z" />
      </svg>
    </div>
    <div className="h-[28%] bg-[#EE161F] w-full" />
  </motion.div>
);

/* Destination arcs radiating from the Beirut origin node */
const ROUTES = [
  { d: 'M368 300 C 300 180, 180 150, 120 205', label: 'EU' },
  { d: 'M368 300 C 440 200, 470 250, 468 322', label: 'ASIA' },
  { d: 'M368 300 C 300 350, 190 400, 132 468', label: 'AMER' },
  { d: 'M368 300 C 390 400, 380 480, 316 556', label: 'AFR' },
];

const PILLARS = [
  { k: '01', label: 'Resilience' },
  { k: '02', label: 'Crossroads' },
  { k: '03', label: 'Imagination' },
];

export const LebanonTributeSection = ({ onOpenPlanner }) => {
  const [likesCount, setLikesCount] = useState(() => {
    try {
      const saved = localStorage.getItem('rak_beirut_love_count');
      return saved ? parseInt(saved, 10) : 2480;
    } catch {
      return 2480;
    }
  });
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const handleLike = () => {
    const newCount = likesCount + 1;
    setLikesCount(newCount);
    try {
      localStorage.setItem('rak_beirut_love_count', newCount.toString());
    } catch {
      /* storage unavailable — counter still updates for this session */
    }

    setAnimKey((prev) => prev + 1);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 600);

    const newHearts = Array.from({ length: 5 }).map((_, i) => ({
      id: Date.now() + i + Math.random(),
      x: (Math.random() - 0.5) * 70,
      y: -40 - Math.random() * 50,
      scale: 0.8 + Math.random() * 0.5,
      rotate: (Math.random() - 0.5) * 45,
    }));

    setFloatingHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => setFloatingHearts((prev) => prev.slice(5)), 1200);
  };

  return (
    <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <style>{`
        @keyframes rak-heart-pop {
          0%   { transform: scale(0); opacity: 0; }
          25%  { transform: scale(1.35); opacity: 1; }
          50%  { transform: scale(1); filter: brightness(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
        .rak-heart-pop { animation: rak-heart-pop 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }

        @keyframes rak-route-flow { to { stroke-dashoffset: -320; } }
        .rak-route { stroke-dasharray: 5 13; animation: rak-route-flow 7s linear infinite; }

        @keyframes rak-ping-ring {
          0%   { transform: scale(0.35); opacity: 0.85; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        .rak-ring { transform-origin: 368px 300px; animation: rak-ping-ring 3.4s ease-out infinite; }
        .rak-ring-2 { animation-delay: 1.15s; }
        .rak-ring-3 { animation-delay: 2.3s; }

        @keyframes rak-drift { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .rak-drift { animation: rak-drift 9s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .rak-route, .rak-ring, .rak-drift, .rak-heart-pop { animation: none !important; }
        }
      `}</style>

      <div className="relative overflow-hidden rounded-[28px] bg-[#07080B] ring-1 ring-white/10 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">

        {/* Ambient field */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -left-24 w-[560px] h-[420px] rounded-full bg-[#EC008C]/[0.16] blur-[110px]" />
          <div className="absolute top-1/3 right-0 w-[520px] h-[520px] rounded-full bg-[#00A651]/[0.10] blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-[420px] h-[260px] rounded-full bg-[#EE161F]/[0.09] blur-[100px]" />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12">

          {/* ───────────── Editorial column ───────────── */}
          <div className="lg:col-span-7 p-7 sm:p-10 lg:p-14 flex flex-col justify-center gap-7">

            {/* Eyebrow */}
            <div className="flex items-center gap-3 flex-wrap">
              <LebanonFlag className="w-8 h-5" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] text-white/55 uppercase">
                Roots of Inspiration
              </span>
              <span className="hidden sm:block h-px w-10 bg-[#EE161F]" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] text-[#00A651] uppercase">
                Beirut, Lebanon
              </span>
            </div>

            {/* Display headline — Eurostile Extended fills the measure by design */}
            <h2 className="font-heading uppercase text-white text-[2rem] leading-[1.02] sm:text-[2.6rem] sm:leading-[1.02] lg:text-[3.4rem] lg:leading-[0.98] tracking-[-0.01em]">
              The Land of Cedars.
              <span className="block mt-2 bg-gradient-to-r from-[#EE161F] via-[#EC008C] to-[#F59E0B] bg-clip-text text-transparent">
                Courage in Every Idea.
              </span>
            </h2>

            <p className="text-[15px] sm:text-base leading-relaxed text-white/60 max-w-xl">
              Born in a city where cultures, languages, and generations meet. RAK4Creative
              carries Beirut&rsquo;s restless imagination into brands built to move the world.
            </p>

            {/* Arabic pulse line */}
            <div className="border-l-2 border-[#EE161F] pl-5 py-1">
              <p className="text-lg sm:text-xl text-white font-serif" dir="rtl">
                &ldquo;من بيروت إلى العالم.. نبضٌ وإبداعٌ لا ينطفئ&rdquo;
              </p>
              <p className="mt-1.5 font-mono text-[10px] tracking-[0.24em] text-white/40 uppercase">
                An endless pulse. A global vision.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenPlanner}
                className="group inline-flex items-center gap-2.5 pl-6 pr-5 py-3.5 rounded-full bg-white text-[#07080B] font-mono text-[11px] font-bold tracking-[0.2em] uppercase transition-all duration-200 hover:bg-[#EC008C] hover:text-white"
              >
                Create with RAK
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              {/* Love Beirut counter */}
              <div className="relative">
                {floatingHearts.map((heart) => (
                  <motion.div
                    key={heart.id}
                    initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
                    animate={{
                      opacity: 0,
                      y: heart.y,
                      x: heart.x,
                      scale: heart.scale,
                      rotate: heart.rotate,
                    }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2 pointer-events-none z-30"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#EE161F]">
                      <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
                    </svg>
                  </motion.div>
                ))}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  title="Click to love Beirut"
                  className="inline-flex items-center gap-3 pl-4 pr-5 py-3 rounded-full bg-white/[0.06] ring-1 ring-white/12 hover:ring-[#EE161F]/50 hover:bg-white/[0.09] transition-all duration-200"
                >
                  <svg
                    key={animKey}
                    viewBox="0 0 24 24"
                    className={`w-[18px] h-[18px] fill-[#EE161F] ${animating ? 'rak-heart-pop' : ''}`}
                  >
                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
                  </svg>
                  <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-white/50">
                    Love Beirut
                  </span>
                  <span className="font-mono text-[13px] font-bold text-white tabular-nums">
                    {likesCount.toLocaleString()}
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Pillar rail */}
            <div className="flex items-center gap-6 sm:gap-9 pt-6 border-t border-white/10">
              {PILLARS.map((p) => (
                <div key={p.k} className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] text-[#EC008C]">{p.k}</span>
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-white/45 uppercase">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ───────────── Origin HUD panel ───────────── */}
          <div className="lg:col-span-5 relative min-h-[380px] sm:min-h-[440px] lg:min-h-0 border-t lg:border-t-0 lg:border-l border-white/10 overflow-hidden">

            <svg
              viewBox="0 0 500 700"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 w-full h-full"
              aria-hidden="true"
            >
              <defs>
                <pattern id="rakGrid" width="42" height="42" patternUnits="userSpaceOnUse">
                  <path d="M42 0H0V42" fill="none" stroke="rgba(255,255,255,0.045)" strokeWidth="1" />
                </pattern>
                <linearGradient id="rakRoute" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#EC008C" />
                  <stop offset="55%" stopColor="#EE161F" />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.15" />
                </linearGradient>
                <radialGradient id="rakCore">
                  <stop offset="0%" stopColor="#00A651" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#00A651" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="500" height="700" fill="url(#rakGrid)" />
              <circle cx="300" cy="380" r="230" fill="url(#rakCore)" />

              {/* Wireframe globe */}
              <g className="rak-drift" stroke="rgba(255,255,255,0.13)" fill="none" strokeWidth="1">
                <circle cx="300" cy="380" r="200" />
                <ellipse cx="300" cy="380" rx="200" ry="56" />
                <ellipse cx="300" cy="310" rx="187" ry="48" />
                <ellipse cx="300" cy="450" rx="187" ry="48" />
                <ellipse cx="300" cy="245" rx="155" ry="38" />
                <ellipse cx="300" cy="515" rx="155" ry="38" />
                <ellipse cx="300" cy="380" rx="133" ry="200" />
                <ellipse cx="300" cy="380" rx="66" ry="200" />
                <line x1="300" y1="180" x2="300" y2="580" />
              </g>

              {/* Radiating routes */}
              <g fill="none" stroke="url(#rakRoute)" strokeWidth="1.6" strokeLinecap="round">
                {ROUTES.map((r) => (
                  <path key={r.label} d={r.d} className="rak-route" opacity="0.9" />
                ))}
              </g>

              {/* Destination nodes */}
              <g fill="rgba(255,255,255,0.5)">
                <circle cx="120" cy="205" r="2.5" />
                <circle cx="468" cy="322" r="2.5" />
                <circle cx="132" cy="468" r="2.5" />
                <circle cx="316" cy="556" r="2.5" />
              </g>

              {/* Beirut origin node */}
              <g>
                <circle className="rak-ring" cx="368" cy="300" r="18" fill="none" stroke="#EE161F" strokeWidth="1.4" />
                <circle className="rak-ring rak-ring-2" cx="368" cy="300" r="18" fill="none" stroke="#EE161F" strokeWidth="1.4" />
                <circle className="rak-ring rak-ring-3" cx="368" cy="300" r="18" fill="none" stroke="#EE161F" strokeWidth="1.4" />
                <circle cx="368" cy="300" r="5" fill="#EE161F" />
                <circle cx="368" cy="300" r="10" fill="none" stroke="#EE161F" strokeOpacity="0.4" strokeWidth="1" />
              </g>
            </svg>

            {/* HUD overlay */}
            <div className="absolute inset-0 p-6 sm:p-8 font-mono text-[10px] tracking-[0.22em] uppercase pointer-events-none">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 text-white/45">
                  <span>01 / Origin</span>
                  <span className="h-px w-8 bg-[#EE161F]" />
                </div>
                <div className="text-right text-white/35 leading-relaxed">
                  <div>33.8938&deg; N</div>
                  <div>35.5018&deg; E</div>
                </div>
              </div>

              <div className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 text-white/35">
                To the World
              </div>

              <div className="absolute left-6 sm:left-8 bottom-6 sm:bottom-8 flex items-center gap-2.5 text-white/35">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-[#00A651] opacity-75 animate-ping" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#00A651]" />
                </span>
                <span>Signal Live</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LebanonTributeSection;

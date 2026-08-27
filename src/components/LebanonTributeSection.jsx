import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────
   Palette sampled directly from the RAK4Creative homepage hero.
   Red is reserved for one element only: the heart.
   ────────────────────────────────────────────────────────────── */
const C = {
  pageBg:   '#F9FAFC',
  surface:  '#FFFFFF',
  chip:     '#F2F5F9',
  border:   '#E4E8EF',
  navy:     '#101729',
  body:     '#717A88',
  muted:    '#A2A4A9',
  magenta:  '#EC008C',
  magentaD: '#C80074',
  coral:    '#E04E64',
  pink:     '#E1709F',
  violet:   '#CB4CDC',
  mint:     '#5FC3A2',
  heart:    '#EE161F', // the only red
};

export const LebanonFlag = ({ className = 'w-12 h-8' }) => (
  <motion.div
    whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
    className={`relative rounded-[3px] overflow-hidden shadow-sm ring-1 ring-slate-300/60 flex flex-col shrink-0 select-none ${className}`}
    style={{ minWidth: '28px' }}
  >
    <div className="h-[28%] w-full" style={{ backgroundColor: C.heart }} />
    <div className="h-[44%] bg-white w-full flex items-center justify-center relative px-0.5">
      <svg viewBox="0 0 100 100" className="h-full w-auto fill-current" style={{ maxHeight: '95%', color: '#00A651' }}>
        <path d="M50 8 C48 10, 46 16, 44 20 C40 20, 36 22, 33 25 C37 27, 41 27, 45 28 C41 30, 34 32, 28 36 C33 38, 39 39, 45 39 C38 43, 29 46, 22 52 C28 54, 37 54, 44 54 C36 59, 25 63, 16 71 C25 73, 36 73, 45 71 C45 76, 43 83, 41 90 L59 90 C57 83, 55 76, 55 71 C64 73, 75 73, 84 71 C75 63, 64 59, 56 54 C63 54, 72 54, 78 52 C71 46, 62 43, 55 39 C61 39, 67 38, 72 36 C66 32, 59 30, 55 28 C59 27, 63 27, 67 25 C64 22, 60 20, 56 20 C54 16, 52 10, 50 8 Z" />
      </svg>
    </div>
    <div className="h-[28%] w-full" style={{ backgroundColor: C.heart }} />
  </motion.div>
);

/* ──────────────────────────────────────────────────────────────
   True orthographic projection. Every node is plotted from its
   real latitude / longitude; every arc is a great circle.
   ────────────────────────────────────────────────────────────── */

const VIEW = { lat: 39, lon: 0 };
const R = 158;
const CX = 250;
const CY = 345;
const RAD = Math.PI / 180;

const BEIRUT = { lat: 33.8938, lon: 35.5018 };

const DESTINATIONS = [
  { name: 'Canada', lat: 43.6532, lon: -79.3832, label: [138, 251] },
  { name: 'GCC', lat: 24.0, lon: 50.5, label: [361, 385] },
];

const GCC_CAPITALS = [
  { lat: 24.7136, lon: 46.6753 }, // Riyadh
  { lat: 24.4539, lon: 54.3773 }, // Abu Dhabi
  { lat: 25.2854, lon: 51.5310 }, // Doha
  { lat: 29.3759, lon: 47.9774 }, // Kuwait City
  { lat: 26.2285, lon: 50.5860 }, // Manama
  { lat: 23.5880, lon: 58.3829 }, // Muscat
];

const toVec = (lat, lon) => {
  const p = lat * RAD;
  const l = lon * RAD;
  return [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
};

const P0 = VIEW.lat * RAD;
const L0 = VIEW.lon * RAD;
const EAST = [-Math.sin(L0), Math.cos(L0), 0];
const NORTH = [-Math.sin(P0) * Math.cos(L0), -Math.sin(P0) * Math.sin(L0), Math.cos(P0)];
const OUT = [Math.cos(P0) * Math.cos(L0), Math.cos(P0) * Math.sin(L0), Math.sin(P0)];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

const project = (v, lift = 1) => ({
  x: CX + dot(v, EAST) * R * lift,
  y: CY - dot(v, NORTH) * R * lift,
  visible: dot(v, OUT) >= -0.02,
});

const projectLatLon = (lat, lon, lift = 1) => project(toVec(lat, lon), lift);

const buildGraticule = () => {
  const paths = [];
  const push = (pts) => {
    if (pts.length > 1) paths.push('M' + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L'));
  };
  for (let lon = -180; lon < 180; lon += 30) {
    let run = [];
    for (let lat = -90; lat <= 90; lat += 3) {
      const p = projectLatLon(lat, lon);
      if (p.visible) run.push(p); else { push(run); run = []; }
    }
    push(run);
  }
  for (let lat = -60; lat <= 60; lat += 30) {
    let run = [];
    for (let lon = -180; lon <= 180; lon += 3) {
      const p = projectLatLon(lat, lon);
      if (p.visible) run.push(p); else { push(run); run = []; }
    }
    push(run);
  }
  return paths;
};

const buildArc = (a, b, steps = 72) => {
  const va = toVec(a.lat, a.lon);
  const vb = toVec(b.lat, b.lon);
  const omega = Math.acos(Math.max(-1, Math.min(1, dot(va, vb))));
  const sinO = Math.sin(omega);
  const height = 0.04 + 0.22 * (omega / Math.PI);
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let v;
    if (sinO < 1e-6) v = va;
    else {
      const s1 = Math.sin((1 - t) * omega) / sinO;
      const s2 = Math.sin(t * omega) / sinO;
      v = [va[0] * s1 + vb[0] * s2, va[1] * s1 + vb[1] * s2, va[2] * s1 + vb[2] * s2];
    }
    pts.push(project(v, 1 + height * Math.sin(Math.PI * t)));
  }
  return 'M' + pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join('L');
};

const GRATICULE = buildGraticule();
const ORIGIN = projectLatLon(BEIRUT.lat, BEIRUT.lon);
const NODES = DESTINATIONS.map((c) => ({ ...c, ...projectLatLon(c.lat, c.lon) }));
const ARCS = DESTINATIONS.map((c) => ({ name: c.name, d: buildArc(BEIRUT, c) }));
const CLUSTER = GCC_CAPITALS.map((c) => projectLatLon(c.lat, c.lon));

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
          50%  { transform: scale(1); filter: brightness(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .rak-heart-pop { animation: rak-heart-pop 0.6s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }

        @keyframes rak-route-flow { to { stroke-dashoffset: -400; } }
        .rak-route { stroke-dasharray: 4 12; animation: rak-route-flow 9s linear infinite; }

        @keyframes rak-ping-ring {
          0%   { transform: scale(0.4); opacity: 0.55; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        .rak-ring { animation: rak-ping-ring 3.6s ease-out infinite; }
        .rak-ring-2 { animation-delay: 1.2s; }
        .rak-ring-3 { animation-delay: 2.4s; }

        @keyframes rak-drift { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .rak-drift { animation: rak-drift 11s ease-in-out infinite; }

        @media (prefers-reduced-motion: reduce) {
          .rak-route, .rak-ring, .rak-drift, .rak-heart-pop { animation: none !important; }
        }
      `}</style>

      <div
        className="relative overflow-hidden rounded-[28px]"
        style={{
          backgroundColor: C.surface,
          border: `1px solid ${C.border}`,
          boxShadow: '0 24px 60px -32px rgba(16,23,41,0.22)',
        }}
      >
        {/* Soft brand wash */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -left-20 w-[520px] h-[380px] rounded-full blur-[110px]" style={{ backgroundColor: C.magenta, opacity: 0.07 }} />
          <div className="absolute top-1/3 right-0 w-[480px] h-[480px] rounded-full blur-[120px]" style={{ backgroundColor: C.violet, opacity: 0.06 }} />
          <div className="absolute bottom-0 left-1/3 w-[420px] h-[260px] rounded-full blur-[100px]" style={{ backgroundColor: C.mint, opacity: 0.05 }} />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-12">

          {/* ───────────── Editorial column ───────────── */}
          <div className="lg:col-span-7 p-7 sm:p-10 lg:p-14 flex flex-col justify-center gap-7">

            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-3 self-start px-4 py-2 rounded-full"
              style={{ backgroundColor: C.chip, border: `1px solid ${C.border}` }}
            >
              <LebanonFlag className="w-7 h-[18px]" />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] uppercase" style={{ color: C.body }}>
                Roots of Inspiration
              </span>
              <span className="h-3 w-px" style={{ backgroundColor: C.border }} />
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.24em] uppercase font-bold" style={{ color: C.magenta }}>
                Beirut, Lebanon
              </span>
            </div>

            {/* Headline — navy, with the homepage gradient on line two */}
            <h2
              className="font-heading uppercase text-[2rem] leading-[1.02] sm:text-[2.6rem] sm:leading-[1.02] lg:text-[3.4rem] lg:leading-[0.98] tracking-[-0.01em]"
              style={{ color: C.navy }}
            >
              The Land of Cedars.
              <span
                className="block mt-2 bg-clip-text text-transparent"
                style={{ backgroundImage: `linear-gradient(90deg, ${C.magenta}, ${C.coral}, ${C.pink}, ${C.violet})` }}
              >
                Courage in Every Idea.
              </span>
            </h2>

            <p className="text-[15px] sm:text-base leading-relaxed max-w-xl" style={{ color: C.body }}>
              Born in a city where cultures, languages, and generations meet. RAK4Creative
              carries Beirut&rsquo;s restless imagination into brands built to move the world.
            </p>

            {/* Arabic pulse line */}
            <div className="pl-5 py-1 border-l-2" style={{ borderColor: C.magenta }}>
              <p className="text-lg sm:text-xl font-serif" dir="rtl" style={{ color: C.navy }}>
                &ldquo;من بيروت إلى العالم.. نبضٌ وإبداعٌ لا ينطفئ&rdquo;
              </p>
              <p className="mt-1.5 font-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: C.muted }}>
                An endless pulse. A global vision.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenPlanner}
                className="group inline-flex items-center gap-2.5 pl-6 pr-5 py-3.5 rounded-full text-white font-mono text-[11px] font-bold tracking-[0.2em] uppercase transition-colors duration-200"
                style={{ backgroundColor: C.magenta }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = C.magentaD; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = C.magenta; }}
              >
                Create with RAK
                <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <div className="relative">
                {floatingHearts.map((heart) => (
                  <motion.div
                    key={heart.id}
                    initial={{ opacity: 1, y: 0, x: 0, scale: 0.5 }}
                    animate={{ opacity: 0, y: heart.y, x: heart.x, scale: heart.scale, rotate: heart.rotate }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="absolute left-1/2 top-1/2 pointer-events-none z-30"
                  >
                    <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: C.heart }}>
                      <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
                    </svg>
                  </motion.div>
                ))}

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  title="Click to love Beirut"
                  className="inline-flex items-center gap-3 pl-4 pr-5 py-3 rounded-full transition-all duration-200"
                  style={{ backgroundColor: C.chip, border: `1px solid ${C.border}` }}
                >
                  <svg
                    key={animKey}
                    viewBox="0 0 24 24"
                    className={`w-[18px] h-[18px] ${animating ? 'rak-heart-pop' : ''}`}
                    style={{ fill: C.heart }}
                  >
                    <path d="M17.5,1.917a6.4,6.4,0,0,0-5.5,3.3,6.4,6.4,0,0,0-5.5-3.3A6.8,6.8,0,0,0,0,8.967c0,4.547,4.786,9.513,8.8,12.88a4.974,4.974,0,0,0,6.4,0C19.214,18.48,24,13.514,24,8.967A6.8,6.8,0,0,0,17.5,1.917Z" />
                  </svg>
                  <span className="font-mono text-[11px] tracking-[0.16em] uppercase" style={{ color: C.body }}>
                    Love Beirut
                  </span>
                  <span className="font-mono text-[13px] font-bold tabular-nums" style={{ color: C.navy }}>
                    {likesCount.toLocaleString()}
                  </span>
                </motion.button>
              </div>
            </div>

            {/* Pillar rail */}
            <div className="flex items-center gap-6 sm:gap-9 pt-6" style={{ borderTop: `1px solid ${C.border}` }}>
              {PILLARS.map((p) => (
                <div key={p.k} className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] font-bold" style={{ color: C.magenta }}>{p.k}</span>
                  <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.18em] uppercase" style={{ color: C.body }}>
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ───────────── Globe: Lebanon → Canada + GCC ───────────── */}
          <div
            className="lg:col-span-5 relative min-h-[400px] sm:min-h-[460px] lg:min-h-0 overflow-hidden"
            style={{ backgroundColor: C.pageBg, borderLeft: `1px solid ${C.border}` }}
          >
            <svg
              viewBox="0 0 500 700"
              preserveAspectRatio="xMidYMid slice"
              className="absolute inset-0 w-full h-full"
              role="img"
              aria-label="Globe showing routes from Beirut, Lebanon to Canada and the GCC"
            >
              <defs>
                <pattern id="rakGrid" width="42" height="42" patternUnits="userSpaceOnUse">
                  <path d="M42 0H0V42" fill="none" stroke="rgba(16,23,41,0.045)" strokeWidth="1" />
                </pattern>
                <linearGradient id="rakRoute" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={C.magenta} />
                  <stop offset="50%" stopColor={C.coral} />
                  <stop offset="100%" stopColor={C.violet} />
                </linearGradient>
                <radialGradient id="rakCore">
                  <stop offset="0%" stopColor={C.magenta} stopOpacity="0.10" />
                  <stop offset="70%" stopColor={C.violet} stopOpacity="0.04" />
                  <stop offset="100%" stopColor={C.mint} stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="500" height="700" fill="url(#rakGrid)" />
              <circle cx={CX} cy={CY} r={R * 1.4} fill="url(#rakCore)" />

              <g className="rak-drift">
                <circle cx={CX} cy={CY} r={R} fill="rgba(255,255,255,0.75)" stroke="rgba(16,23,41,0.13)" strokeWidth="1" />

                <g fill="none" stroke="rgba(16,23,41,0.085)" strokeWidth="0.8">
                  {GRATICULE.map((d, i) => <path key={i} d={d} />)}
                </g>

                {/* Routes */}
                <g fill="none" stroke="url(#rakRoute)" strokeWidth="1.8" strokeLinecap="round">
                  {ARCS.map((a) => <path key={a.name} d={a.d} className="rak-route" />)}
                </g>

                {/* GCC member capitals */}
                <g fill={C.violet} opacity="0.55">
                  {CLUSTER.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="1.8" />)}
                </g>

                {/* Destination nodes */}
                {NODES.map((n) => (
                  <g key={n.name}>
                    <circle cx={n.x} cy={n.y} r="3.4" fill={C.violet} />
                    <circle cx={n.x} cy={n.y} r="8" fill="none" stroke={C.violet} strokeOpacity="0.3" strokeWidth="1" />
                    <text
                      x={n.label[0]}
                      y={n.label[1]}
                      textAnchor="middle"
                      fill={C.body}
                      fontFamily="monospace"
                      fontSize="10.5"
                      letterSpacing="2"
                    >
                      {n.name.toUpperCase()}
                    </text>
                  </g>
                ))}

                {/* Lebanon — verified origin */}
                <g>
                  <circle className="rak-ring" cx={ORIGIN.x} cy={ORIGIN.y} r="15" fill="none" stroke={C.magenta} strokeWidth="1.4" style={{ transformOrigin: `${ORIGIN.x}px ${ORIGIN.y}px` }} />
                  <circle className="rak-ring rak-ring-2" cx={ORIGIN.x} cy={ORIGIN.y} r="15" fill="none" stroke={C.magenta} strokeWidth="1.4" style={{ transformOrigin: `${ORIGIN.x}px ${ORIGIN.y}px` }} />
                  <circle className="rak-ring rak-ring-3" cx={ORIGIN.x} cy={ORIGIN.y} r="15" fill="none" stroke={C.magenta} strokeWidth="1.4" style={{ transformOrigin: `${ORIGIN.x}px ${ORIGIN.y}px` }} />
                  <circle cx={ORIGIN.x} cy={ORIGIN.y} r="5.5" fill={C.magenta} />
                  <circle cx={ORIGIN.x} cy={ORIGIN.y} r="10" fill="none" stroke={C.magenta} strokeOpacity="0.4" strokeWidth="1" />

                  <text x={ORIGIN.x} y={ORIGIN.y - 30} textAnchor="middle" fill={C.muted} fontFamily="monospace" fontSize="9" letterSpacing="2.4">
                    LEBANON
                  </text>
                  <text x={ORIGIN.x} y={ORIGIN.y - 16} textAnchor="middle" fill={C.navy} fontFamily="monospace" fontSize="11.5" fontWeight="bold" letterSpacing="2.2">
                    BEIRUT
                  </text>
                </g>
              </g>
            </svg>

            {/* HUD overlay */}
            <div className="absolute inset-0 p-6 sm:p-8 font-mono text-[10px] tracking-[0.2em] uppercase pointer-events-none">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3" style={{ color: C.body }}>
                  <span>01 / Origin</span>
                  <span className="h-px w-8" style={{ backgroundColor: C.magenta }} />
                </div>
                <div className="text-right leading-relaxed" style={{ color: C.muted }}>
                  <div>33.8938&deg; N</div>
                  <div>35.5018&deg; E</div>
                </div>
              </div>

              <div className="absolute right-6 sm:right-8 bottom-6 sm:bottom-8" style={{ color: C.muted }}>
                Canada &middot; GCC
              </div>

              <div className="absolute left-6 sm:left-8 bottom-6 sm:bottom-8 flex items-center gap-2.5" style={{ color: C.body }}>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full animate-ping" style={{ backgroundColor: C.mint, opacity: 0.75 }} />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ backgroundColor: C.mint }} />
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

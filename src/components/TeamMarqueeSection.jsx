import React from 'react';
import { UserCheck, Sparkles, Quote, Star } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

export const TeamMarqueeSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-rak-slate-900/60 border border-rak-slate-800 rounded-3xl py-10 md:py-16 backdrop-blur-xl shadow-2xl">
      {/* Background Decorative SVG Curve */}
      <div className="pointer-events-none absolute right-0 bottom-0 text-rak-slate-800/30">
        <svg
          className="w-[460px] h-[154px]"
          fill="none"
          viewBox="0 0 460 154"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_494_1104)">
            <path
              d="M-87.463 458.432C-102.118 348.092 -77.3418 238.841 -15.0744 188.274C57.4129 129.408 180.708 150.071 351.748 341.128C278.246 -374.233 633.954 380.602 548.123 42.7707"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="40"
            />
          </g>
          <defs>
            <clipPath id="clip0_494_1104">
              <rect fill="white" height="154" width="460" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Title */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rak-magenta text-white shadow-magenta-glow">
            <UserCheck className="w-6 h-6" />
          </div>

          <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">
            Behind RAK 4 Creative
          </span>

          <h2 className="relative font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Meet Our Creative & Tech Minds
          </h2>
          <p className="max-w-2xl text-xs sm:text-sm text-rak-slate-300 leading-relaxed">
            Our interdisciplinary team connects strategy, video production, 3D art, and high-speed web tech to elevate your brand.
          </p>
        </div>

        {/* Featured Official Team Photo (Replaces sliding stock images) */}
        <div className="relative w-full max-w-5xl mx-auto">
          <SpotlightCard
            spotlightColor="rgba(236, 0, 140, 0.25)"
            borderColor="rgba(236, 0, 140, 0.4)"
            className="p-3 sm:p-4 bg-rak-slate-950/90 border border-rak-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl group"
          >
            <div className="relative w-full overflow-hidden rounded-2xl bg-rak-slate-950 flex flex-col items-center">
              <img
                src="/rak-team.webp"
                alt="RAK 4 Creative Team"
                className="w-full h-auto object-contain rounded-2xl transition-transform duration-700 ease-out filter drop-shadow-2xl"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-rak-slate-950/70 via-transparent to-transparent pointer-events-none rounded-2xl" />
              
              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-rak-slate-950/80 backdrop-blur-md border border-rak-magenta/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-10">
                <div>
                  <span className="text-[10px] font-mono text-rak-magenta uppercase tracking-widest font-extrabold">OFFICIAL TEAM PHOTOGRAPH</span>
                  <h3 className="text-xs sm:text-sm font-bold text-white">The RAK 4 Creative Powerhouse</h3>
                </div>
                <span className="text-[10px] font-semibold text-rak-slate-300 px-2.5 py-1 bg-rak-slate-900/90 border border-rak-slate-700/80 rounded-lg shrink-0">
                  Strategy • Design • 3D • Tech • Media
                </span>
              </div>
            </div>
          </SpotlightCard>
        </div>

        {/* Executive Team Quote Banner */}
        <div className="mx-auto max-w-3xl px-6 text-center space-y-6 pt-4 border-t border-rak-slate-800/80">
          <p className="font-medium text-sm sm:text-base text-rak-slate-200 leading-relaxed italic">
            “At RAK 4 Creative, we believe every brand has a breakthrough story. Our team works side-by-side with client leaders to turn bold ideas into high-converting digital realities.”
          </p>
        </div>
      </div>
    </section>
  );
};

export default TeamMarqueeSection;

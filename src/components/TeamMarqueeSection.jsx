import React from 'react';
import { UserCheck } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';

export const TeamMarqueeSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-rak-slate-800 rounded-3xl py-10 md:py-16 backdrop-blur-xl shadow-xl transition-colors duration-300">
      {/* Background Decorative SVG Curve */}
      <div className="pointer-events-none absolute right-0 bottom-0 text-slate-200 dark:text-rak-slate-800/30">
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

          <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest font-mono">
            Behind RAK 4 Creative
          </span>

          <h2 className="relative font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight font-heading">
            Meet Our Creative & Tech Minds
          </h2>
          <p className="max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
            Our interdisciplinary team connects strategy, video production, 3D art, and high-speed web tech to elevate your brand.
          </p>
        </div>

        {/* Featured Official Team Photo */}
        <div className="relative w-full max-w-4xl mx-auto">
          <SpotlightCard
            spotlightColor="rgba(236, 0, 140, 0.2)"
            borderColor="rgba(236, 0, 140, 0.3)"
            className="p-2.5 sm:p-4 bg-slate-50 dark:bg-rak-slate-950/90 border border-slate-200 dark:border-rak-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl group"
          >
            <div className="relative w-full max-h-[80vh] overflow-hidden rounded-2xl bg-slate-950 flex flex-col items-center justify-center">
              <img
                src="/rak-team.webp"
                alt="RAK 4 Creative Team"
                className="w-full h-auto max-h-[78vh] object-contain rounded-2xl transition-transform duration-700 ease-out filter drop-shadow-2xl"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent pointer-events-none rounded-2xl" />
              
              {/* Bottom Caption Overlay */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-slate-900/90 dark:bg-rak-slate-950/85 backdrop-blur-md border border-rak-magenta/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 z-10 shadow-xl">
                <div>
                  <span className="text-[10px] font-mono text-rak-magenta uppercase tracking-widest font-extrabold">OFFICIAL TEAM PHOTOGRAPH</span>
                  <h3 className="text-xs sm:text-sm font-bold text-white font-heading">The RAK 4 Creative Powerhouse</h3>
                </div>
                <span className="text-[10px] font-semibold text-slate-300 px-2.5 py-1 bg-slate-800/90 dark:bg-rak-slate-900/90 border border-white/10 rounded-lg shrink-0 font-mono">
                  Strategy • Design • 3D • Tech • Media
                </span>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

export default TeamMarqueeSection;

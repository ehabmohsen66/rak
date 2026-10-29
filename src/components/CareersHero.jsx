import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useBanner, RichTitle, BannerMedia, BannerOverlay } from './BannerKit';
import { followBannerLink } from '../lib/banners';

export function CareersHero({ onScrollToRoles }) {
  const banner = useBanner('careers');

  return (
    <section className="relative min-h-[85vh] sm:min-h-screen w-full overflow-hidden bg-rak-slate-950 flex flex-col justify-end pb-16 sm:pb-24 pt-28">
      
      {/* Background Video Banner */}
      <div className="absolute inset-0 overflow-hidden bg-slate-950">
        <BannerMedia banner={banner} videoClassName="opacity-90" imageClassName="opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-b from-rak-slate-950/60 via-rak-slate-950/30 to-rak-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-rak-slate-950/75 via-transparent to-rak-slate-950/35" />
        <BannerOverlay banner={banner} />
      </div>

      {/* Hero Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end justify-between">
          
          <div className="w-full space-y-5 sm:w-7/12">
            {banner.title && (
              <h1 className="font-bold text-3xl sm:text-5xl md:text-6xl text-white leading-[1.12] font-heading">
                <RichTitle text={banner.title} />
              </h1>
            )}
          </div>

          <div className="w-full sm:w-5/12 space-y-6">
            {banner.subtitle && (
              <p className="text-base sm:text-lg text-rak-slate-200 leading-relaxed font-normal">
                {banner.subtitle}
              </p>
            )}

            {banner.primaryCtaLabel && (
              <button
                onClick={() => { if (!followBannerLink(banner.primaryCtaHref)) onScrollToRoles?.(); }}
                className="inline-flex items-center gap-3 rounded-full bg-rak-magenta hover:bg-rak-magenta-dark text-white px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-magenta-glow group"
              >
                <span>{banner.primaryCtaLabel}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-4 w-4 text-white" />
                </span>
              </button>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

export default CareersHero;

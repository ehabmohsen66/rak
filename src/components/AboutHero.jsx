import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useBanner, RichTitle, BannerMedia, BannerOverlay } from './BannerKit';
import { followBannerLink } from '../lib/banners';

export const AboutHero = ({ onOpenPlanner = () => {} }) => {
  const banner = useBanner('about');
  const hasCopy = Boolean(banner.eyebrow || banner.title || banner.subtitle || banner.primaryCtaLabel);

  const handlePrimary = () => {
    if (!followBannerLink(banner.primaryCtaHref)) onOpenPlanner();
  };

  return (
    <div className="w-full bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Full Video Banner Showcase */}
      <section className={`relative w-full aspect-[16/9] sm:aspect-[21/9] ${hasCopy ? 'min-h-[72vh] sm:min-h-[70vh]' : 'min-h-[50vh] sm:min-h-[65vh]'} max-h-[85vh] overflow-hidden bg-slate-950 flex items-center justify-center shadow-2xl`}>
        <div className="absolute inset-0">
          <BannerMedia banner={banner} />
        </div>
        {/* Subtle cinematic gradient framing */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
        <BannerOverlay banner={banner} />

        {hasCopy && (
          <div className="absolute inset-x-0 bottom-0 z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-10 sm:pb-14">
            <div className="max-w-3xl space-y-4 text-left text-white">
              {banner.eyebrow && (
                <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-rak-magenta-light">
                  {banner.eyebrow}
                </p>
              )}
              {banner.title && (
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold leading-[1.12] font-heading drop-shadow-md">
                  <RichTitle text={banner.title} />
                </h1>
              )}
              {banner.subtitle && (
                <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-2xl leading-relaxed drop-shadow">
                  {banner.subtitle}
                </p>
              )}
              {banner.primaryCtaLabel && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handlePrimary}
                    className="inline-flex items-center gap-2 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white bg-rak-magenta hover:bg-rak-magenta-dark rounded-full shadow-lg transition-all hover:scale-105 cursor-pointer"
                  >
                    <span>{banner.primaryCtaLabel}</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

    </div>
  );
};

export default AboutHero;

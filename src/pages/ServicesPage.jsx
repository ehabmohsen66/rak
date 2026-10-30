import React, { useState, useMemo } from 'react';
import { Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { GLSLHills } from '../components/GLSLHills';
import { useCms } from '../lib/cmsContext';
import { getPillarIcon } from '../lib/pillarIcons';
import { useBanner, RichTitle, BannerMedia, BannerOverlay } from '../components/BannerKit';
import { followBannerLink } from '../lib/banners';

export const ServicesPage = ({ onOpenPlanner }) => {
  const { content } = useCms();
  const pillars = content.pillars || [];
  const [activeCategory, setActiveCategory] = useState('All');
  const banner = useBanner('services', { count: pillars.length });

  const categories = useMemo(() => {
    const unique = Array.from(new Set(pillars.map((p) => p.category).filter(Boolean)));
    return ['All', ...unique];
  }, [pillars]);

  const filteredPillars = activeCategory === 'All' 
    ? pillars 
    : pillars.filter(p => p.category === activeCategory);

  return (
    <div className="pb-16 space-y-16 sm:space-y-24 bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      <section className="relative w-full min-h-[80vh] md:min-h-[88vh] pt-28 pb-16 bg-slate-950 flex flex-col items-center justify-center overflow-hidden border-b border-slate-200 dark:border-rak-slate-800/80">
        
        <div className="absolute inset-0 w-full h-full z-0">
          <BannerMedia
            banner={banner}
            fallback={<GLSLHills width="100%" height="100%" speed={0.4} colorRgb={[0.93, 0.0, 0.55]} />}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-transparent to-slate-950 z-[1] pointer-events-none" />
        <BannerOverlay banner={banner} className="z-[1]" />

        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-8 py-8">
          {banner.eyebrow && (
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-900/90 border border-rak-magenta/40 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-magenta-sm">
              <Sparkles className="w-4 h-4" />
              <span>{banner.eyebrow}</span>
            </div>
          )}

          {banner.title && (
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-tight font-heading px-2">
              <RichTitle text={banner.title} />
            </h1>
          )}

          {banner.subtitle && (
            <p className="text-sm sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal px-2">
              {banner.subtitle}
            </p>
          )}

          {(banner.primaryCtaLabel || (banner.secondaryCtaLabel && (pillars[0] || banner.secondaryCtaHref))) && (
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
              {banner.primaryCtaLabel && (
                <button
                  type="button"
                  onClick={() => { if (!followBannerLink(banner.primaryCtaHref)) onOpenPlanner(); }}
                  className="px-6 sm:px-8 py-3.5 sm:py-4 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-glow transition-all flex items-center space-x-2 hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span>{banner.primaryCtaLabel}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              )}

              {banner.secondaryCtaLabel && (pillars[0] || banner.secondaryCtaHref) && (
                <a
                  href={banner.secondaryCtaHref || `#${pillars[0].id}`}
                  onClick={(e) => {
                    if (banner.secondaryCtaHref) {
                      e.preventDefault();
                      followBannerLink(banner.secondaryCtaHref);
                    }
                  }}
                  className="px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
                >
                  <span>{banner.secondaryCtaLabel}</span>
                </a>
              )}
            </div>
          )}

          <div className="pt-6 sm:pt-8 border-t border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-300 mb-4 font-mono">Filter Capabilities by Domain</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta ${
                    activeCategory === cat
                      ? 'bg-rak-magenta text-white shadow-magenta-sm scale-105'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-rak-magenta/40 hover:text-white backdrop-blur-md'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {filteredPillars.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-rak-slate-900/80 border border-slate-200 dark:border-rak-slate-800 space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No capabilities match "{activeCategory}"</h2>
            <p className="text-xs text-slate-600 dark:text-rak-slate-300">Reset the filter to view all agency capability units.</p>
            <button
              type="button"
              onClick={() => setActiveCategory('All')}
              className="px-5 py-2.5 bg-rak-magenta text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer"
            >
              Show All Capabilities
            </button>
          </div>
        ) : (
          filteredPillars.map((pillar, index) => {
            const IconComp = getPillarIcon(pillar.icon);
            return (
              <div 
                key={pillar.id}
                id={pillar.id}
                className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-rak-slate-900/80 border border-slate-200 dark:border-rak-slate-800 space-y-8 hover:border-rak-magenta/40 transition-all group backdrop-blur-xl shadow-sm hover:shadow-md scroll-mt-28"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  
                  <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-rak-slate-950">
                      <img 
                        src={pillar.featuredImage} 
                        alt={pillar.title} 
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                      
                      <div className="absolute top-4 left-4 flex items-center space-x-2">
                        <span className="px-3 py-1 bg-rak-magenta text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-magenta-sm">
                          {pillar.tag}
                        </span>
                      </div>

                      <div className="absolute bottom-6 left-6 right-6 flex items-center space-x-3 p-4 rounded-xl bg-slate-900/90 dark:bg-rak-slate-950/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                        <div className="p-2.5 rounded-xl bg-rak-magenta text-white shrink-0 shadow-magenta-sm">
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white tracking-wide font-heading">{pillar.title}</div>
                          <div className="text-[11px] text-slate-300 font-medium mt-0.5 leading-snug">{pillar.subtitle}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7 space-y-6">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest font-mono">{pillar.category}</span>
                      <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">{pillar.title}</h2>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">{pillar.description}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                        <Sparkles className="w-3.5 h-3.5 text-rak-magenta" />
                        <span>Capabilities & Services Breakdown</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(pillar.items || []).map((item, i) => (
                          <div key={i} className="p-3 bg-slate-50 dark:bg-rak-slate-950/80 border border-slate-200 dark:border-rak-slate-800/90 rounded-xl text-xs font-medium text-slate-700 dark:text-rak-slate-200 flex items-start space-x-2.5">
                            <CheckCircle2 className="w-4 h-4 text-rak-magenta shrink-0 mt-0.5" />
                            <span className="leading-snug">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={onOpenPlanner}
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-sm transition-all hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
                      >
                        <span>Inquire About This Pillar</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>
            );
          })
        )}
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-gradient-to-r from-rak-magenta/10 via-white to-slate-50 dark:from-rak-magenta/20 dark:via-rak-slate-900 dark:to-rak-slate-900 border border-rak-magenta/30 rounded-3xl text-center space-y-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">Need an end-to-end strategy built for your brand?</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 max-w-xl mx-auto">
            From ground zero to new heights, RAK4Creative brings brand strategy, creative production, and digital performance marketing under one roof.
          </p>
          <button
            type="button"
            onClick={onOpenPlanner}
            className="px-8 py-3.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-glow inline-flex items-center space-x-2 hover:scale-105 transition-all cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};

export default ServicesPage;

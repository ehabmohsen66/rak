import React from 'react';
import { cn } from '../lib/utils';
import { BRAND_INFO } from '../data/contentData';

// Color gradient presets to give each client logo a distinct glowing hover effect
const GRADIENT_PRESETS = [
  { from: 'rgba(236, 0, 140, 0.5)', via: 'rgba(124, 58, 237, 0.5)', to: 'rgba(6, 182, 212, 0.5)' },
  { from: 'rgba(6, 182, 212, 0.5)', via: 'rgba(59, 130, 246, 0.5)', to: 'rgba(147, 51, 234, 0.5)' },
  { from: 'rgba(245, 158, 11, 0.5)', via: 'rgba(236, 0, 140, 0.5)', to: 'rgba(124, 58, 237, 0.5)' },
  { from: 'rgba(16, 185, 129, 0.5)', via: 'rgba(6, 182, 212, 0.5)', to: 'rgba(59, 130, 246, 0.5)' },
  { from: 'rgba(139, 92, 246, 0.5)', via: 'rgba(236, 0, 140, 0.5)', to: 'rgba(244, 63, 94, 0.5)' },
];

export const MarqueeLogoScroller = React.forwardRef(
  (
    {
      title = "Trusted by Ambitious Enterprises & Global Innovators",
      description = "Partnering with industry leaders, high-growth brands, and global institutions to deliver end-to-end digital excellence.",
      logos = [],
      speed = 'normal',
      className,
      showHeader = true,
      ...props
    },
    ref
  ) => {
    // Map speed prop to animation duration
    const durationMap = {
      normal: '40s',
      slow: '80s',
      fast: '15s',
    };
    const animationDuration = durationMap[speed] || '40s';

    // Fallback to BRAND_INFO.clients formatted with images and gradients if no logos array passed
    const logoItems = (logos.length > 0 ? logos : BRAND_INFO.clients).slice(0, 14).map((client, idx) => {
      const preset = GRADIENT_PRESETS[idx % GRADIENT_PRESETS.length];
      return {
        src: client.src || client.image,
        alt: client.alt || client.name || client.logo || `Client ${idx + 1}`,
        logoText: client.logo || client.name,
        gradient: client.gradient || preset,
      };
    });

    return (
      <>
        {/* Keyframe animation injected inline */}
        <style>{`
          @keyframes marquee-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>

        <section
          ref={ref}
          aria-label={title}
          className={cn(
            'w-full bg-rak-slate-900/80 dark:bg-rak-slate-900/80 light:bg-white/90 text-white dark:text-white light:text-slate-900 rounded-3xl border border-rak-slate-800/80 light:border-slate-200 overflow-hidden backdrop-blur-xl shadow-2xl',
            className
          )}
          {...props}
        >
          {/* Header Section */}
          {showHeader && (
            <div className="p-6 md:p-8 lg:p-10 pb-4">
              <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-4 lg:gap-8 pb-6 border-b border-rak-slate-800/80 light:border-slate-200 items-end">
                <div className="space-y-2">
                  <span className="text-xs font-extrabold text-rak-magenta uppercase tracking-widest px-3 py-1 bg-rak-magenta/10 border border-rak-magenta/30 rounded-full inline-block">
                    Client Ecosystem
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-balance text-white dark:text-white light:text-slate-900">
                    {title}
                  </h2>
                </div>
                <p className="text-rak-slate-300 dark:text-rak-slate-300 light:text-slate-600 text-xs sm:text-sm leading-relaxed text-balance">
                  {description}
                </p>
              </div>
            </div>
          )}

          {/* Marquee Section */}
          <div
            className="w-full overflow-hidden py-4"
            style={{
              maskImage:
                'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
              WebkitMaskImage:
                'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
            }}
          >
            <div
              className="flex w-max items-center gap-5 py-2 pr-5 hover:[animation-play-state:paused] transition-all duration-300 ease-in-out"
              style={{
                animation: `marquee-scroll ${animationDuration} linear infinite`,
              }}
            >
              {/* Render logos twice for seamless loop */}
              {[...logoItems, ...logoItems].map((logo, index) => (
                <div
                  key={index}
                  className="group relative h-24 w-44 shrink-0 flex items-center justify-center rounded-2xl bg-white p-4 overflow-hidden border border-white/40 shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  {/* Gradient background revealed on hover */}
                  <div
                    style={{
                      '--from': logo.gradient.from,
                      '--via': logo.gradient.via,
                      '--to': logo.gradient.to,
                    }}
                    className="absolute inset-0 scale-150 opacity-0 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100 bg-gradient-to-br from-[var(--from)] via-[var(--via)] to-[var(--to)] z-0 pointer-events-none"
                  />

                  {/* Logo Image */}
                  {logo.src ? (
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      loading="lazy"
                      decoding="async"
                      width="130"
                      height="56"
                      className="relative z-10 max-h-14 max-w-[130px] object-contain transition-transform duration-300 group-hover:scale-110 filter drop-shadow-sm"
                      style={{ imageRendering: '-webkit-optimize-contrast' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const sibling = e.currentTarget.nextElementSibling;
                        if (sibling) sibling.style.display = 'inline-block';
                      }}
                    />
                  ) : null}

                  {/* Fallback Text if image missing */}
                  <span
                    className="relative z-10 text-xs font-bold font-mono text-rak-slate-900 tracking-wider group-hover:text-white transition-colors"
                    style={{ display: logo.src ? 'none' : 'inline-block' }}
                  >
                    {logo.logoText}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }
);

MarqueeLogoScroller.displayName = 'MarqueeLogoScroller';

export default MarqueeLogoScroller;

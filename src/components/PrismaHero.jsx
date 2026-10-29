import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Globe2, ArrowDownRight, Clock, ShieldCheck, MapPin } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { useBanner, RichTitle, BannerMedia, BannerOverlay, hasCustomMedia } from "./BannerKit";
import { followBannerLink } from "../lib/banners";

/* ---------------- WordsPullUp ---------------- */
export const WordsPullUp = ({ text = "", className = "", showAsterisk = false, style }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = typeof text === "string" ? text.split(" ") : [];

  return (
    <div ref={ref} className={`inline-flex flex-wrap ${className}`} style={style}>
      {words.map((word, i) => {
        const isLast = i === words.length - 1;
        return (
          <motion.span
            key={i}
            initial={{ y: 24, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="inline-block relative"
            style={{ marginRight: isLast ? 0 : "0.28em" }}
          >
            {word}
            {showAsterisk && isLast && (
              <span className="inline-block ml-1 text-[0.45em] align-top text-rak-magenta font-bold">*</span>
            )}
          </motion.span>
        );
      })}
    </div>
  );
};

/* ---------------- WordsPullUpMultiStyle ---------------- */
export const WordsPullUpMultiStyle = ({ segments = [], className = "", style }) => {
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
          initial={{ y: 24, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-block ${w.className ?? ""}`}
          style={{ marginRight: "0.28em" }}
        >
          {w.word}
        </motion.span>
      ))}
    </div>
  );
};

/* ---------------- On-Brand RAK4Creative Contact Hero ---------------- */
const STAT_ICONS = [Clock, Globe2, ShieldCheck];

export const PrismaHero = ({ onScrollToForm, onOpenPlanner }) => {
  const banner = useBanner("contact");
  const customMedia = hasCustomMedia(banner);
  const stats = banner.stats.filter((s) => s.value || s.label);

  const handlePrimary = () => {
    if (!followBannerLink(banner.primaryCtaHref)) onScrollToForm?.();
  };
  const handleSecondary = () => {
    if (!followBannerLink(banner.secondaryCtaHref)) onOpenPlanner?.();
  };

  return (
    <section className="relative min-h-[78vh] sm:min-h-[84vh] w-full overflow-hidden bg-rak-slate-950 flex items-center pt-28 sm:pt-32 pb-16 sm:pb-24 border-b border-white/10">
      {/* Brand Architectural Background Layer */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Subtle brand architectural backdrop image with deep obsidian wash */}
        {customMedia ? (
          <>
            <div className="absolute inset-0">
              <BannerMedia banner={banner} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-rak-slate-950/60 via-rak-slate-950/50 to-rak-slate-950" />
          </>
        ) : (
          <>
            <img
              src="/rak-team.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover opacity-15 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-rak-slate-950/90 via-rak-slate-950/85 to-rak-slate-950" />
          </>
        )}
        <BannerOverlay banner={banner} />

        {/* RAK Fuchsia & Deep Slate Ambient Glow Orbs */}
        <div
          className="absolute -top-32 left-1/4 w-[34rem] h-[34rem] rounded-full blur-[140px] opacity-30"
          style={{ background: "radial-gradient(circle, #EC008C 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 right-10 w-[28rem] h-[28rem] rounded-full blur-[130px] opacity-20"
          style={{ background: "radial-gradient(circle, #C80074 0%, transparent 70%)" }}
        />

        {/* Subtle Brand Horizon Lines */}
        <div className="absolute inset-x-0 top-1/3 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        <div className="absolute inset-x-0 bottom-16 h-px bg-gradient-to-r from-transparent via-rak-magenta/30 to-transparent" />
      </div>

      {/* Main Content Container - Zero Overlap Responsive Grid */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Brand Headline & Supporting Identity Statement */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Brand Pill */}
            {banner.eyebrow && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/[0.04] border border-rak-magenta/40 backdrop-blur-md"
              >
                <span className="w-2 h-2 rounded-full bg-rak-magenta animate-pulse" />
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white font-gilroy">
                  {banner.eyebrow}
                </span>
              </motion.div>
            )}

            {/* Primary Brand Headline */}
            {banner.title && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="space-y-2"
              >
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase text-white font-heading leading-[1.1] tracking-[0.04em]">
                  <RichTitle text={banner.title} />
                </h1>
              </motion.div>
            )}

            {/* Supporting Brand Identity Paragraph */}
            {banner.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg text-rak-slate-200 font-gilroy font-medium leading-relaxed max-w-2xl"
              >
                {banner.subtitle}
              </motion.p>
            )}

            {/* Executive Trust Metrics Bar */}
            {stats.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className={`pt-2 grid grid-cols-1 gap-3 sm:gap-4 max-w-2xl ${stats.length >= 3 ? 'sm:grid-cols-3' : stats.length === 2 ? 'sm:grid-cols-2' : ''}`}
              >
                {stats.map((stat, idx) => {
                  const Icon = STAT_ICONS[idx % STAT_ICONS.length];
                  return (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
                      <div className="flex items-center space-x-2 text-rak-magenta mb-1">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-sm sm:text-base font-bold font-impact tracking-[0.06em] text-white">{stat.value}</span>
                      </div>
                      <p className="text-[11px] text-rak-slate-300 font-gilroy">{stat.label}</p>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* Right Column: RAK4Creative Brand Identity Card */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="lg:col-span-5"
          >
            <div className="relative p-6 sm:p-8 rounded-3xl bg-rak-slate-900/90 border border-white/15 shadow-2xl backdrop-blur-2xl space-y-6 overflow-hidden">
              {/* Top Fuchsia Accent Line */}
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rak-magenta via-white/80 to-rak-magenta" />

              <div className="flex items-center justify-between gap-4 pb-5 border-b border-white/10">
                <BrandLogo
                  variant="white"
                  className="h-11 sm:h-12 w-auto object-contain"
                />
                <span className="px-3 py-1 rounded-full bg-rak-magenta/15 border border-rak-magenta/40 text-rak-magenta text-[10px] font-bold uppercase tracking-[0.16em] font-gilroy shrink-0">
                  Direct Access
                </span>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-[0.16em] text-rak-magenta font-gilroy">
                  Worldwide Creative &amp; Digital Partner
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white font-heading leading-snug">
                  Ready to scale your brand across MENA, North America &amp; Europe?
                </h2>
                <p className="text-xs sm:text-sm text-rak-slate-300 font-gilroy leading-relaxed">
                  Connect directly with our managing partners and creative directors for bespoke brand systems, 3D motion, high-converting web architecture, and 360° campaigns.
                </p>
              </div>

              {/* Active Hubs Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-white font-heading">
                    <MapPin className="w-3.5 h-3.5 text-rak-magenta shrink-0" />
                    <span>BEIRUT HQ</span>
                  </div>
                  <p className="text-[11px] text-rak-slate-300 font-gilroy">Downtown District, Lebanon</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-1">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-white font-heading">
                    <MapPin className="w-3.5 h-3.5 text-rak-magenta shrink-0" />
                    <span>TORONTO HUB</span>
                  </div>
                  <p className="text-[11px] text-rak-slate-300 font-gilroy">King Street West, Canada</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                {onScrollToForm && banner.primaryCtaLabel && (
                  <button
                    type="button"
                    onClick={handlePrimary}
                    className="flex-1 py-3.5 px-5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-[0.14em] rounded-xl shadow-magenta-glow flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <span>{banner.primaryCtaLabel}</span>
                    <ArrowDownRight className="w-4 h-4" />
                  </button>
                )}
                {onOpenPlanner && banner.secondaryCtaLabel && (
                  <button
                    type="button"
                    onClick={handleSecondary}
                    className="py-3.5 px-5 bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 text-xs font-bold uppercase tracking-[0.14em] rounded-xl flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-rak-magenta" />
                    <span>{banner.secondaryCtaLabel}</span>
                  </button>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default PrismaHero;

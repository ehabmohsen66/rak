import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  Share2,
  Check,
  Copy,
  FileText,
  Images,
  ExternalLink,
  Lock,
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageCircle,
  Sparkles,
  Layers
} from 'lucide-react';
import { useCms } from '../lib/cmsContext';
import { normalizeShowcases, toEmbedDocumentUrl } from '../lib/showcases';

function trackShowcaseEvent(action, params = {}) {
  try {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', action, params);
    }
  } catch {
    // Ignore analytics errors
  }
}

function cleanWhatsappDigits(raw = '') {
  return String(raw || '').replace(/[^0-9]/g, '');
}

export const ShowcasePage = ({
  slug = null,
  onNavigateSite = () => {},
  onOpenPlanner = () => {}
}) => {
  const { content } = useCms();
  const brandInfo = content?.brandInfo || {};
  const showcases = useMemo(() => normalizeShowcases(content?.showcases), [content?.showcases]);

  const activeShowcases = useMemo(
    () => showcases.filter((s) => s.active !== false),
    [showcases]
  );

  const hub = useMemo(() => {
    if (!slug) return null;
    const clean = String(slug).toLowerCase().trim();
    return activeShowcases.find((s) => s.id.toLowerCase() === clean) || null;
  }, [slug, activeShowcases]);

  // PIN lock state
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [unlocked, setUnlocked] = useState(false);

  // Modals: Share, PDF Viewer, Gallery Lightbox
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activePdfItem, setActivePdfItem] = useState(null);
  const [activeGallery, setActiveGallery] = useState(null); // { item, index }

  useEffect(() => {
    if (!hub) return;
    if (!hub.pinCode) {
      setUnlocked(true);
      return;
    }
    try {
      const saved = window.sessionStorage.getItem(`rak_showcase_pin_${hub.id}`);
      setUnlocked(saved === hub.pinCode);
    } catch {
      setUnlocked(false);
    }
  }, [hub]);

  // Keyboard navigation for modals
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShareOpen(false);
        setActivePdfItem(null);
        setActiveGallery(null);
      } else if (activeGallery && activeGallery.item.mediaItems.length > 1) {
        if (e.key === 'ArrowRight') {
          setActiveGallery((prev) =>
            prev
              ? { ...prev, index: (prev.index + 1) % prev.item.mediaItems.length }
              : null
          );
        } else if (e.key === 'ArrowLeft') {
          setActiveGallery((prev) =>
            prev
              ? {
                  ...prev,
                  index:
                    (prev.index - 1 + prev.item.mediaItems.length) %
                    prev.item.mediaItems.length
                }
              : null
          );
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeGallery]);

  // 1. Directory View (/showcase)
  if (!slug) {
    const directoryHubs = activeShowcases.filter((s) => s.listedInDirectory !== false);
    return (
      <div className="min-h-screen bg-[#07080B] text-white flex flex-col justify-between px-4 py-10 sm:py-16 relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse at 25% 20%, rgba(236,0,140,0.28), transparent 55%), radial-gradient(ellipse at 80% 80%, rgba(33,57,103,0.35), transparent 55%)'
          }}
        />

        <div className="relative z-10 max-w-3xl w-full mx-auto space-y-10">
          <div className="flex items-center justify-between">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateSite('home', '/');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold tracking-wider uppercase backdrop-blur-md transition-colors"
            >
              <img src="/RAK4CREATIVE-LOGO-WHITE.png" alt="RAK 4 CREATIVE" className="h-4 w-auto" />
              <span>Main Site</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="text-center space-y-3 pt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rak-magenta/15 border border-rak-magenta/35 text-[11px] font-bold uppercase tracking-[0.2em] text-rak-magenta-light">
              <Layers className="w-3.5 h-3.5" />
              Industry & Client Hubs
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight">
              RAK Showcase Hubs
            </h1>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              Curated portfolios, branding concepts, 3D architectural renders, and performance case studies tailored by sector.
            </p>
          </div>

          {directoryHubs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {directoryHubs.map((item) => (
                <a
                  key={item.id}
                  href={`/showcase/${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateSite('showcase', `/showcase/${item.id}`);
                  }}
                  className="group relative rounded-3xl overflow-hidden border border-white/15 bg-white/[0.04] hover:border-rak-magenta/60 p-6 flex items-center gap-4 backdrop-blur-xl shadow-xl transition-all hover:-translate-y-0.5"
                >
                  {item.avatarUrl ? (
                    <img
                      src={item.avatarUrl}
                      alt={item.title}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white/25 shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-rak-magenta flex items-center justify-center font-bold text-base shrink-0">
                      RAK
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-base font-bold text-white truncate group-hover:text-rak-magenta-light transition-colors">
                      {item.title}
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-slate-300 line-clamp-2 mt-0.5">{item.subtitle}</p>
                    )}
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-white shrink-0 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-white/15 bg-white/[0.04] p-8 text-center space-y-4 backdrop-blur-xl">
              <p className="text-sm text-slate-300">
                Use your dedicated showcase URL provided by the RAK 4 CREATIVE team, or request a tailored sector portfolio below.
              </p>
              <button
                type="button"
                onClick={onOpenPlanner}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-rak-magenta hover:bg-rak-magenta-dark text-xs font-bold uppercase tracking-widest text-white transition-all cursor-pointer"
              >
                <span>Request Sector Portfolio</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <div className="relative z-10 text-center pt-12 text-[11px] text-slate-400">
          © {new Date().getFullYear()} RAK 4 CREATIVE • Beirut & Toronto
        </div>
      </div>
    );
  }

  // 2. Missing / Inactive Hub Fallback
  if (!hub) {
    return (
      <div className="min-h-screen bg-[#07080B] text-white flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-3xl border border-white/15 bg-white/[0.04] p-8 text-center space-y-5 backdrop-blur-xl shadow-2xl">
          <img
            src="/RAK4CREATIVE-LOGO-WHITE.png"
            alt="RAK 4 CREATIVE"
            className="h-8 w-auto mx-auto"
          />
          <h1 className="text-2xl font-bold font-heading">Showcase Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            This showcase link may have moved or is currently private. Visit our main portfolio or contact our team for access.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateSite('home', '/');
              }}
              className="px-6 py-3 rounded-full bg-rak-magenta hover:bg-rak-magenta-dark text-xs font-bold uppercase tracking-wider text-white transition-colors"
            >
              Visit RAK4Creative.com
            </a>
          </div>
        </div>
      </div>
    );
  }

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/showcase/${hub.id}`
      : `https://rak4creative.com/showcase/${hub.id}`;

  const whatsappDigits = cleanWhatsappDigits(hub.whatsapp || brandInfo.whatsapp);
  const contactEmail = (hub.contactEmail || brandInfo.contactEmail || '').trim();
  const visibleItems = (hub.items || []).filter((it) => it.active !== false && it.title.trim() !== '');

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput.trim() === hub.pinCode) {
      setUnlocked(true);
      setPinError(false);
      try {
        window.sessionStorage.setItem(`rak_showcase_pin_${hub.id}`, hub.pinCode);
      } catch {
        // Ignore storage restrictions
      }
    } else {
      setPinError(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: hub.title,
          text: hub.subtitle || `${hub.title} — RAK 4 CREATIVE`,
          url: shareUrl
        });
        return;
      } catch {
        // User cancelled or unsupported; fall back to share modal
      }
    }
    setShareOpen(true);
  };

  const handleItemAction = (item) => {
    trackShowcaseEvent('showcase_item_click', {
      showcase_slug: hub.id,
      item_title: item.title,
      item_type: item.type,
      destination_url: item.url || ''
    });

    if (item.type === 'pdf' && item.url) {
      setActivePdfItem(item);
      return;
    }

    if (item.type === 'gallery') {
      if (item.mediaItems && item.mediaItems.length > 0) {
        setActiveGallery({ item, index: 0 });
        return;
      }
      if (item.url) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    const url = String(item.url || '').trim();
    if (!url) return;
    if (url.startsWith('/') && !url.startsWith('//')) {
      onNavigateSite('home', url);
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getButtonAppearance = () => {
    const radiusClass = hub.buttonRadius === 'rounded' ? 'rounded-2xl' : 'rounded-full';
    if (hub.buttonStyle === 'glass') {
      return {
        className: `${radiusClass} bg-white/14 hover:bg-white/22 border border-white/30 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.35)]`,
        style: { color: hub.buttonTextColor || '#FFFFFF' }
      };
    }
    if (hub.buttonStyle === 'outline') {
      return {
        className: `${radiusClass} bg-black/25 hover:bg-black/40 border-2 backdrop-blur-md shadow-lg`,
        style: {
          borderColor: hub.buttonColor || '#FFFFFF',
          color: hub.buttonTextColor || '#FFFFFF'
        }
      };
    }
    return {
      className: `${radiusClass} border border-white/15 shadow-[0_12px_28px_rgba(0,0,0,0.42)]`,
      style: {
        backgroundColor: hub.buttonColor || '#213967',
        color: hub.buttonTextColor || '#FFFFFF'
      }
    };
  };

  const btnAppearance = getButtonAppearance();

  return (
    <div
      className="relative min-h-screen w-full text-white flex flex-col justify-between overflow-x-hidden selection:bg-rak-magenta selection:text-white"
      style={{ backgroundColor: hub.backgroundColor || '#101829' }}
    >
      {/* Background Media Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {hub.backgroundType === 'image' && hub.backgroundUrl && (
          <>
            {hub.backgroundFit === 'ambient' ? (
              <>
                {/* Soft full-bleed ambient blur on wide screens */}
                <img
                  src={hub.backgroundUrl}
                  alt=""
                  aria-hidden="true"
                  className="hidden sm:block absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
                />
                {/* Crisp portrait stage centered on desktop, edge-to-edge on mobile */}
                <div className="relative w-full sm:max-w-[560px] h-full mx-auto shadow-[0_0_90px_rgba(0,0,0,0.75)]">
                  <img
                    src={hub.backgroundUrl}
                    alt=""
                    aria-hidden="true"
                    className="w-full h-full object-cover"
                  />
                </div>
              </>
            ) : (
              <img
                src={hub.backgroundUrl}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            )}
          </>
        )}

        {hub.backgroundType === 'video' && hub.backgroundUrl && (
          <video
            key={hub.backgroundUrl}
            src={hub.backgroundUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        )}

        {hub.backgroundType === 'gradient' && (
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, rgba(236,0,140,0.32), transparent 60%), radial-gradient(ellipse at 75% 85%, ${
                hub.buttonColor || '#213967'
              }, transparent 65%), ${hub.backgroundColor || '#0B1020'}`
            }}
          />
        )}

        {/* Configurable Dark Tint + Subtle Vignette for Text Legibility */}
        <div
          className="absolute inset-0 bg-black transition-opacity duration-300"
          style={{ opacity: (hub.overlayOpacity ?? 25) / 100 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/65" />
      </div>

      {/* Top Floating Bar */}
      <header className="relative z-20 w-full max-w-[560px] mx-auto px-4 pt-5 sm:pt-7 flex items-center justify-between">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSite('home', '/');
          }}
          title="Visit RAK 4 CREATIVE Main Website"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase text-white/95 transition-all"
        >
          <img src="/RAK4CREATIVE-LOGO-WHITE.png" alt="RAK 4 CREATIVE" className="h-3.5 w-auto" />
          <span className="hidden xs:inline">rak4creative.com</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-white/80" />
        </a>

        <button
          type="button"
          onClick={() => setShareOpen(true)}
          aria-label="Share showcase"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase text-white/95 transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </header>

      {/* Main Centered Hub Stack */}
      <main className="relative z-10 w-full max-w-[540px] mx-auto px-4 py-8 sm:py-10 flex-1 flex flex-col items-center">
        {!unlocked && hub.pinCode ? (
          /* PIN Gate Card */
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="my-auto w-full rounded-3xl bg-black/65 border border-white/20 p-7 sm:p-9 text-center space-y-5 backdrop-blur-2xl shadow-2xl"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-xl font-bold font-heading">{hub.title}</h1>
              <p className="text-xs text-slate-300">
                Enter the access code provided by RAK 4 CREATIVE to view this private showcase.
              </p>
            </div>
            <form onSubmit={handlePinSubmit} className="space-y-3">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Access code"
                autoFocus
                className="w-full h-11 px-4 rounded-xl bg-white/10 border border-white/25 text-center text-sm tracking-widest text-white placeholder:text-white/45 focus:outline-none focus:border-rak-magenta"
              />
              {pinError && (
                <p className="text-xs text-rose-400 font-medium">
                  Incorrect access code. Please try again.
                </p>
              )}
              <button
                type="submit"
                className="w-full h-11 rounded-full bg-rak-magenta hover:bg-rak-magenta-dark text-xs font-bold uppercase tracking-widest text-white transition-colors cursor-pointer"
              >
                Unlock Showcase
              </button>
            </form>
          </motion.div>
        ) : (
          <>
            {/* Profile Avatar & Title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex flex-col items-center text-center space-y-3.5 mb-8 w-full"
            >
              {hub.avatarUrl && (
                <div className="relative">
                  <img
                    src={hub.avatarUrl}
                    alt={hub.title}
                    className="w-24 h-24 sm:w-[104px] sm:h-[104px] rounded-full object-cover border-2 border-white/35 shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
                  />
                </div>
              )}

              <div className="space-y-1.5 px-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-wide text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] break-words">
                  {hub.title}
                </h1>
                {hub.subtitle && (
                  <p className="text-xs sm:text-[13px] text-white/85 max-w-md mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.75)]">
                    {hub.subtitle}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Buttons & Sections Stack */}
            <div className="w-full space-y-3.5">
              {visibleItems.map((item, idx) => {
                if (item.type === 'header') {
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.06 * idx }}
                      className="pt-4 pb-1 text-center"
                    >
                      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/80 drop-shadow">
                        {item.title}
                      </span>
                    </motion.div>
                  );
                }

                const RightIcon =
                  item.type === 'pdf'
                    ? FileText
                    : item.type === 'gallery'
                    ? Images
                    : ExternalLink;

                return (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.38, delay: 0.05 * idx }}
                    whileHover={{ scale: 1.018, y: -1 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={() => handleItemAction(item)}
                    style={btnAppearance.style}
                    className={`group relative w-full min-h-[58px] px-5 py-3.5 flex items-center justify-between gap-3 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${btnAppearance.className}`}
                  >
                    {/* Left Thumbnail / Spacer for Balanced Centered Title */}
                    <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-white/25"
                        />
                      ) : null}
                    </div>

                    {/* Centered Button Copy */}
                    <div className="flex-1 text-center min-w-0">
                      <div className="inline-flex items-center justify-center gap-2 max-w-full">
                        <span className="text-[13.5px] sm:text-[14.5px] font-bold tracking-[0.04em] leading-snug break-words">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <div className="text-[11px] opacity-80 mt-0.5 truncate">
                          {item.subtitle}
                        </div>
                      )}
                    </div>

                    {/* Right Action Indicator */}
                    <div className="w-9 h-9 shrink-0 flex items-center justify-center opacity-75 group-hover:opacity-100 transition-opacity">
                      <RightIcon className="w-4 h-4" />
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Bottom Contact & Executive Proposal Actions */}
            {(hub.showFooterCta || whatsappDigits || contactEmail) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-9 w-full flex flex-col items-center gap-3.5"
              >
                {hub.showFooterCta && hub.footerCtaLabel && (
                  <button
                    type="button"
                    onClick={() => {
                      trackShowcaseEvent('showcase_cta_click', {
                        showcase_slug: hub.id,
                        cta_label: hub.footerCtaLabel
                      });
                      onOpenPlanner();
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black/55 hover:bg-rak-magenta border border-white/25 hover:border-rak-magenta backdrop-blur-xl text-xs font-bold uppercase tracking-[0.15em] text-white shadow-xl transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-rak-magenta-light" />
                    <span>{hub.footerCtaLabel}</span>
                  </button>
                )}

                {(whatsappDigits || contactEmail) && (
                  <div className="flex items-center justify-center gap-2.5">
                    {whatsappDigits && (
                      <a
                        href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
                          `Hello RAK 4 CREATIVE, I just viewed ${hub.title} and would love to discuss a project.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat on WhatsApp"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/45 hover:bg-black/65 border border-white/20 backdrop-blur-md text-[11px] font-semibold text-white/90 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>WhatsApp</span>
                      </a>
                    )}
                    {contactEmail && (
                      <a
                        href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                          `Inquiry via ${hub.title}`
                        )}`}
                        aria-label="Send Email"
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/45 hover:bg-black/65 border border-white/20 backdrop-blur-md text-[11px] font-semibold text-white/90 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-rak-magenta-light" />
                        <span>Email Us</span>
                      </a>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}
      </main>

      {/* Subtle Branded Footer */}
      <footer className="relative z-10 w-full max-w-[540px] mx-auto px-4 pb-6 pt-2 text-center">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigateSite('home', '/');
          }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 backdrop-blur-md text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80 hover:text-white transition-colors"
        >
          <span>Curated by RAK 4 CREATIVE</span>
        </a>
      </footer>

      {/* Share Sheet Modal */}
      <AnimatePresence>
        {shareOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShareOpen(false)}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-[#0F1422] border border-white/15 p-6 space-y-5 shadow-2xl text-white"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold font-heading">Share Showcase</h2>
                <button
                  type="button"
                  onClick={() => setShareOpen(false)}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-300 truncate">{shareUrl}</span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rak-magenta hover:bg-rak-magenta-dark text-[11px] font-bold text-white shrink-0 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`${hub.title} — ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 rounded-xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(
                    `${hub.title} | RAK 4 CREATIVE`
                  )}&body=${encodeURIComponent(`Explore our showcase: ${shareUrl}`)}`}
                  className="h-10 rounded-xl bg-white/[0.07] hover:bg-white/[0.14] border border-white/10 flex items-center justify-center gap-2 text-xs font-semibold transition-colors"
                >
                  <Mail className="w-4 h-4 text-rak-magenta-light" />
                  <span>Email</span>
                </a>
              </div>

              {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="w-full h-10 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold cursor-pointer transition-colors"
                >
                  More Share Options…
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline PDF / Document Viewer Modal */}
      <AnimatePresence>
        {activePdfItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePdfItem(null)}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-3 sm:p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl mx-auto flex-1 flex flex-col rounded-2xl sm:rounded-3xl bg-[#0D111C] border border-white/15 overflow-hidden shadow-2xl"
            >
              <div className="px-4 sm:px-6 py-3.5 border-b border-white/10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-rak-magenta-light shrink-0" />
                  <span className="text-xs sm:text-sm font-bold truncate">
                    {activePdfItem.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={activePdfItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold transition-colors"
                  >
                    <span>Open Original</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => setActivePdfItem(null)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <iframe
                src={toEmbedDocumentUrl(activePdfItem.url)}
                title={activePdfItem.title}
                className="w-full flex-1 bg-slate-950 border-0"
                allow="autoplay"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline Renders & Video Lightbox Modal */}
      <AnimatePresence>
        {activeGallery && activeGallery.item.mediaItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveGallery(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-6"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl mx-auto flex items-center justify-between gap-4"
            >
              <div>
                <h2 className="text-sm sm:text-base font-bold">{activeGallery.item.title}</h2>
                <p className="text-[11px] text-slate-400">
                  {activeGallery.index + 1} of {activeGallery.item.mediaItems.length}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveGallery(null)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl mx-auto flex-1 my-4 flex items-center justify-center min-h-0"
            >
              {(() => {
                const currentMedia = activeGallery.item.mediaItems[activeGallery.index];
                if (!currentMedia) return null;
                return currentMedia.mediaType === 'video' ? (
                  <video
                    key={currentMedia.url}
                    src={currentMedia.url}
                    controls
                    autoPlay
                    playsInline
                    className="max-h-[72vh] max-w-full rounded-2xl shadow-2xl bg-black"
                  />
                ) : (
                  <img
                    key={currentMedia.url}
                    src={currentMedia.url}
                    alt={currentMedia.title || activeGallery.item.title}
                    className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl"
                  />
                );
              })()}

              {activeGallery.item.mediaItems.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveGallery((p) => ({
                        ...p,
                        index:
                          (p.index - 1 + p.item.mediaItems.length) % p.item.mediaItems.length
                      }))
                    }
                    className="absolute left-2 sm:left-4 p-2.5 rounded-full bg-black/65 hover:bg-rak-magenta border border-white/20 text-white cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveGallery((p) => ({
                        ...p,
                        index: (p.index + 1) % p.item.mediaItems.length
                      }))
                    }
                    className="absolute right-2 sm:right-4 p-2.5 rounded-full bg-black/65 hover:bg-rak-magenta border border-white/20 text-white cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {activeGallery.item.mediaItems[activeGallery.index]?.title && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="text-center text-xs sm:text-sm text-slate-200 pb-2"
              >
                {activeGallery.item.mediaItems[activeGallery.index].title}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowcasePage;

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
  Layers,
  FolderKanban,
  Play,
  Download,
  ZoomIn,
  ZoomOut
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

  // Modals: Share, Case Study Vault, Gallery Vault, PDF Viewer, Gallery Lightbox
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeCaseStudy, setActiveCaseStudy] = useState(null);
  const [csProjectIdx, setCsProjectIdx] = useState(0);
  const [csSectionId, setCsSectionId] = useState('all');
  const [activeGalleryVault, setActiveGalleryVault] = useState(null);
  const [galleryVaultFilter, setGalleryVaultFilter] = useState('all');
  const [activePdfItem, setActivePdfItem] = useState(null);
  const [activeGallery, setActiveGallery] = useState(null); // { item, index }
  const [galleryZoomed, setGalleryZoomed] = useState(false);

  const openModalWithHistory = (setter, value) => {
    try {
      if (typeof window !== 'undefined' && window.history?.pushState) {
        window.history.pushState({ showcaseOverlay: true }, '');
      }
    } catch {
      // Ignore history API restrictions
    }
    setter(value);
  };

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

  // Browser / Mobile Back button support so users can always return to the landing page
  useEffect(() => {
    const onPopState = () => {
      if (activePdfItem) {
        setActivePdfItem(null);
      } else if (activeGallery) {
        setActiveGallery(null);
        setGalleryZoomed(false);
      } else if (activeGalleryVault) {
        setActiveGalleryVault(null);
      } else if (activeCaseStudy) {
        setActiveCaseStudy(null);
      } else if (shareOpen) {
        setShareOpen(false);
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [activePdfItem, activeGallery, activeGalleryVault, activeCaseStudy, shareOpen]);

  // Lock background page scroll when an overlay modal is open
  useEffect(() => {
    const anyModal = Boolean(
      activeCaseStudy || activeGalleryVault || activePdfItem || activeGallery || shareOpen
    );
    if (!anyModal) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [activeCaseStudy, activeGalleryVault, activePdfItem, activeGallery, shareOpen]);

  // Layered keyboard navigation for modals
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (activePdfItem) {
          setActivePdfItem(null);
        } else if (activeGallery) {
          setActiveGallery(null);
          setGalleryZoomed(false);
        } else if (activeGalleryVault) {
          setActiveGalleryVault(null);
        } else if (activeCaseStudy) {
          setActiveCaseStudy(null);
        } else if (shareOpen) {
          setShareOpen(false);
        }
      } else if (activeGallery && activeGallery.item.mediaItems.length > 1) {
        if (e.key === 'ArrowRight') {
          setGalleryZoomed(false);
          setActiveGallery((prev) =>
            prev
              ? { ...prev, index: (prev.index + 1) % prev.item.mediaItems.length }
              : null
          );
        } else if (e.key === 'ArrowLeft') {
          setGalleryZoomed(false);
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
  }, [activeGallery, activeGalleryVault, activePdfItem, activeCaseStudy, shareOpen]);

  // 1. Directory View (/showcase)
  if (!slug) {
    const directoryHubs = activeShowcases.filter((s) => s.listedInDirectory !== false);
    return (
      <div className="min-h-screen bg-[#07080B] text-white flex flex-col justify-between px-4 py-10 sm:py-16 relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 20% 15%, rgba(236,0,140,0.28), transparent 50%), radial-gradient(circle at 80% 80%, rgba(33,57,103,0.45), transparent 55%)'
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
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-white transition-colors"
            >
              <img src="/RAK4CREATIVE-LOGO-WHITE.png" alt="RAK 4 CREATIVE" className="h-7 w-auto" />
            </a>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                onNavigateSite('home', '/');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-semibold text-white transition-colors"
            >
              <span>Main Website</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="space-y-3 text-center pt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rak-magenta/20 border border-rak-magenta/40 text-[11px] font-bold uppercase tracking-widest text-rak-magenta-light">
              <Layers className="w-3.5 h-3.5" />
              Industry & Client Showcases
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-heading tracking-tight">
              RAK4Creative Showcase Hubs
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
    const url = String(item.url || '').trim();
    trackShowcaseEvent('showcase_item_click', {
      showcase_slug: hub.id,
      item_title: item.title,
      item_type: item.type,
      destination_url: url
    });

    if (
      (item.type === 'pdf' && url) ||
      /\.pdf(\?|#|$)/i.test(url) ||
      /drive\.google\.com\/file\/d\//i.test(url)
    ) {
      openModalWithHistory(setActivePdfItem, item);
      return;
    }

    if (item.type === 'case-study') {
      if (Array.isArray(item.projects) && item.projects.length > 0) {
        setCsProjectIdx(0);
        setCsSectionId('all');
        openModalWithHistory(setActiveCaseStudy, item);
        return;
      }
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (item.type === 'gallery' || (Array.isArray(item.mediaItems) && item.mediaItems.length > 0)) {
      if (item.mediaItems && item.mediaItems.length > 0) {
        setGalleryVaultFilter('all');
        openModalWithHistory(setActiveGalleryVault, item);
        return;
      }
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
      return;
    }

    if (!url) return;

    if (/\.(mp4|webm|mov|webp|jpg|jpeg|png)(\?|#|$)/i.test(url)) {
      setGalleryZoomed(false);
      openModalWithHistory(setActiveGallery, {
        item: {
          title: item.title,
          mediaItems: [
            {
              id: item.id,
              mediaType: /\.(mp4|webm|mov)(\?|#|$)/i.test(url) ? 'video' : 'image',
              url,
              title: item.title,
              subtitle: item.subtitle || ''
            }
          ]
        },
        index: 0
      });
      return;
    }

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
      className: `${radiusClass} border border-white/15 hover:brightness-110 shadow-[0_12px_28px_rgba(0,0,0,0.42)]`,
      style: {
        backgroundColor: hub.buttonColor || '#2D3139',
        color: hub.buttonTextColor || '#FFFFFF'
      }
    };
  };

  const btnAppearance = getButtonAppearance();

  // Case study derived view data
  const csProjects = activeCaseStudy?.projects || [];
  const activeCsProject = csProjects[Math.min(csProjectIdx, Math.max(0, csProjects.length - 1))] || null;
  const activeCsSections = activeCsProject?.sections || [];
  const displayedCsSections =
    csSectionId === 'all'
      ? activeCsSections
      : activeCsSections.filter((sec) => sec.id === csSectionId);

  const openCsMediaInLightbox = (sectionTitle, sectionItems, clickedItem) => {
    const mediaOnly = sectionItems.filter((it) => it.mediaType !== 'pdf');
    const foundIdx = mediaOnly.findIndex((it) => it.id === clickedItem.id);
    if (foundIdx === -1) return;
    setGalleryZoomed(false);
    openModalWithHistory(setActiveGallery, {
      item: {
        title: `${activeCsProject?.name || 'Case Study'} — ${sectionTitle}`,
        mediaItems: mediaOnly
      },
      index: foundIdx
    });
  };

  return (
    <div
      className="relative min-h-[100dvh] w-full text-white flex flex-col justify-between overflow-x-hidden selection:bg-rak-magenta selection:text-white"
      style={{ backgroundColor: hub.backgroundColor || '#101829' }}
    >
      {/* Background Media Layer — Full-Screen Responsive on Desktop & Mobile */}
      <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
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
                className="w-full h-full object-cover object-center"
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
            className="w-full h-full object-cover object-center"
          />
        )}

        {hub.backgroundType === 'gradient' && (
          <div
            className="w-full h-full"
            style={{
              background: `radial-gradient(ellipse at 30% 20%, rgba(236,0,140,0.32), transparent 60%), radial-gradient(ellipse at 75% 85%, ${
                hub.buttonColor || '#2D3139'
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
      <header className="relative z-20 w-full max-w-[560px] mx-auto px-4 pt-5 sm:pt-7 flex items-center justify-end">
        <button
          type="button"
          onClick={() => openModalWithHistory(setShareOpen, true)}
          aria-label="Share showcase"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md text-[11px] font-semibold tracking-wider uppercase text-white/95 transition-all cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </header>

      {/* Main Centered Hub Stack */}
      <main className="relative z-10 w-full max-w-[540px] mx-auto px-4 py-8 sm:py-10 flex-1 flex flex-col items-center justify-center">
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
            {/* Profile Avatar & Optional Header Text */}
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
                    alt={hub.title || 'RAK 4 CREATIVE'}
                    className="w-24 h-24 sm:w-[108px] sm:h-[108px] rounded-full object-cover border-2 border-white/35 shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
                  />
                </div>
              )}

              {hub.showHeaderText ? (
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
              ) : (
                <h1 className="sr-only">{hub.title}</h1>
              )}
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
                    : item.type === 'case-study'
                    ? FolderKanban
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

            {/* Bottom Contact & WhatsApp Link */}
            {(hub.showFooterCta || whatsappDigits || contactEmail) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-8 w-full flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
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
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-black/55 hover:bg-rak-magenta border border-white/25 hover:border-rak-magenta backdrop-blur-xl text-xs font-bold uppercase tracking-[0.14em] text-white shadow-xl transition-all cursor-pointer"
                  >
                    <span>{hub.footerCtaLabel}</span>
                  </button>
                )}

                {whatsappDigits && (
                  <a
                    href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
                      `Hello RAK 4 CREATIVE, I just viewed your ${hub.title} and would like to connect.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackShowcaseEvent('showcase_whatsapp_click', {
                        showcase_slug: hub.id,
                        whatsapp: whatsappDigits
                      })
                    }
                    aria-label="Chat on WhatsApp"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#2D3139]/90 hover:bg-[#25D366] border border-white/20 hover:border-[#25D366] backdrop-blur-xl text-xs sm:text-[13px] font-bold tracking-wide text-white shadow-[0_10px_28px_rgba(0,0,0,0.45)] transition-all"
                  >
                    <MessageCircle className="w-4 h-4 text-[#25D366] group-hover:text-white shrink-0" />
                    <span>Chat on WhatsApp</span>
                  </a>
                )}

                {contactEmail && (
                  <a
                    href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                      `Inquiry via ${hub.title}`
                    )}`}
                    aria-label="Send Email"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-black/45 hover:bg-black/65 border border-white/20 backdrop-blur-md text-xs font-semibold text-white/90 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-rak-magenta-light" />
                    <span>Email Us</span>
                  </a>
                )}
              </motion.div>
            )}
          </>
        )}
      </main>

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

      {/* Interactive Case Study Vault Modal (z-50) */}
      <AnimatePresence>
        {activeCaseStudy && activeCsProject && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#070A12]/96 backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            {/* Top Sticky Header */}
            <div className="border-b border-white/10 bg-[#0B101D]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setActiveCaseStudy(null)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/18 border border-white/15 text-xs font-semibold text-white cursor-pointer transition-colors shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold tracking-wide uppercase text-white truncate">
                    {activeCaseStudy.title}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {hub.title} • {csProjects.length} Flagship Branding Projects
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveCaseStudy(null)}
                aria-label="Close Case Studies"
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Case Study Explorer Body */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8">
              <div className="max-w-6xl mx-auto space-y-7 pb-10">
                {/* Project Switcher Cards */}
                {csProjects.length > 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {csProjects.map((proj, pIdx) => {
                      const isSelected = pIdx === csProjectIdx;
                      const totalDeliverables = (proj.sections || []).reduce(
                        (acc, s) => acc + (s.items?.length || 0),
                        0
                      );
                      return (
                        <button
                          key={proj.id || pIdx}
                          type="button"
                          onClick={() => {
                            setCsProjectIdx(pIdx);
                            setCsSectionId('all');
                          }}
                          className={`group relative rounded-2xl overflow-hidden text-left p-5 transition-all cursor-pointer border ${
                            isSelected
                              ? 'border-rak-magenta bg-gradient-to-br from-[#1C2C50] to-[#0E1526] shadow-[0_14px_40px_rgba(236,0,140,0.22)] ring-1 ring-rak-magenta/60'
                              : 'border-white/12 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/25'
                          }`}
                        >
                          {proj.coverUrl && (
                            <img
                              src={proj.coverUrl}
                              alt=""
                              aria-hidden="true"
                              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                                isSelected ? 'opacity-22' : 'opacity-12 group-hover:opacity-20'
                              }`}
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-r from-[#090D18]/90 via-[#090D18]/75 to-[#090D18]/55" />

                          <div className="relative z-10 flex items-start justify-between gap-4">
                            <div className="space-y-1.5 min-w-0">
                              <div className="inline-flex items-center gap-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                                    isSelected
                                      ? 'bg-rak-magenta text-white'
                                      : 'bg-white/10 text-slate-300'
                                  }`}
                                >
                                  Case Study 0{pIdx + 1}
                                </span>
                                {proj.client && (
                                  <span className="text-[11px] font-semibold text-slate-300">
                                    {proj.client}
                                  </span>
                                )}
                              </div>
                              <h2 className="text-lg sm:text-xl font-extrabold font-heading text-white">
                                {proj.name}
                              </h2>
                              {proj.tagline && (
                                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                                  {proj.tagline}
                                </p>
                              )}
                              <div className="pt-1 text-[11px] font-semibold text-rak-magenta-light">
                                {proj.sections?.length || 0} Chapters • {totalDeliverables} Deliverables
                              </div>
                            </div>

                            {proj.logoUrl && (
                              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white/95 p-2 flex items-center justify-center shrink-0 shadow-lg">
                                <img
                                  src={proj.logoUrl}
                                  alt={proj.name}
                                  className="max-w-full max-h-full object-contain"
                                />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Chapter / Category Filter Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setCsSectionId('all')}
                    className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                      csSectionId === 'all'
                        ? 'bg-white text-slate-950 border-white'
                        : 'bg-white/[0.05] text-slate-300 border-white/12 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    All Chapters (
                    {activeCsSections.reduce((acc, s) => acc + (s.items?.length || 0), 0)})
                  </button>
                  {activeCsSections.map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setCsSectionId(sec.id)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                        csSectionId === sec.id
                          ? 'bg-rak-magenta text-white border-rak-magenta'
                          : 'bg-white/[0.05] text-slate-300 border-white/12 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {sec.title} ({sec.items?.length || 0})
                    </button>
                  ))}
                </div>

                {/* Deliverables Sections */}
                <div className="space-y-10">
                  {displayedCsSections.map((sec) => {
                    const secItems = sec.items || [];
                    if (secItems.length === 0) return null;
                    return (
                      <section key={sec.id} className="space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                          <h3 className="text-sm sm:text-base font-extrabold tracking-wide uppercase text-white">
                            {sec.title}
                          </h3>
                          <span className="text-xs text-slate-400 font-medium">
                            {secItems.length} {secItems.length === 1 ? 'item' : 'items'}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {secItems.map((asset) => {
                            if (asset.mediaType === 'pdf') {
                              return (
                                <div
                                  key={asset.id}
                                  onClick={() => {
                                    trackShowcaseEvent('showcase_item_click', {
                                      showcase_slug: hub.id,
                                      item_title: `${activeCsProject.name} - ${asset.title}`,
                                      item_type: 'case-study-pdf',
                                      destination_url: asset.url
                                    });
                                    setActivePdfItem(asset);
                                  }}
                                  className="group rounded-2xl border border-white/12 bg-gradient-to-b from-white/[0.07] to-white/[0.03] hover:border-rak-magenta/60 p-4 flex flex-col justify-between gap-4 cursor-pointer transition-all hover:-translate-y-0.5"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-[#213967]/80 border border-white/15 flex items-center justify-center shrink-0">
                                      <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="px-2 py-0.5 rounded-md bg-rak-magenta/25 border border-rak-magenta/40 text-[10px] font-extrabold uppercase tracking-wider text-rak-magenta-light">
                                      PDF Deck
                                    </span>
                                  </div>

                                  <div className="space-y-1">
                                    <div className="text-xs sm:text-[13px] font-bold text-white group-hover:text-rak-magenta-light transition-colors line-clamp-2">
                                      {asset.title}
                                    </div>
                                    {asset.subtitle && (
                                      <div className="text-[11px] text-slate-400">
                                        {asset.subtitle}
                                      </div>
                                    )}
                                  </div>

                                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-slate-300 group-hover:text-white">
                                    <span>Open Presentation</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              );
                            }

                            if (asset.mediaType === 'video') {
                              return (
                                <button
                                  key={asset.id}
                                  type="button"
                                  onClick={() => {
                                    trackShowcaseEvent('showcase_item_click', {
                                      showcase_slug: hub.id,
                                      item_title: `${activeCsProject.name} - ${asset.title}`,
                                      item_type: 'case-study-video',
                                      destination_url: asset.url
                                    });
                                    openCsMediaInLightbox(sec.title, secItems, asset);
                                  }}
                                  className="group rounded-2xl border border-white/12 bg-white/[0.03] hover:border-rak-magenta/60 overflow-hidden text-left flex flex-col cursor-pointer transition-all hover:-translate-y-0.5"
                                >
                                  <div className="relative aspect-[4/3] w-full bg-black overflow-hidden">
                                    <video
                                      src={`${asset.url}#t=0.6`}
                                      muted
                                      playsInline
                                      preload="metadata"
                                      className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <span className="w-11 h-11 rounded-full bg-rak-magenta/90 group-hover:bg-rak-magenta text-white flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
                                        <Play className="w-4 h-4 fill-current ml-0.5" />
                                      </span>
                                    </div>
                                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white">
                                      Video
                                    </span>
                                  </div>
                                  <div className="p-3.5 space-y-0.5">
                                    <div className="text-xs sm:text-[13px] font-bold text-white truncate">
                                      {asset.title}
                                    </div>
                                    {asset.subtitle && (
                                      <div className="text-[11px] text-slate-400 truncate">
                                        {asset.subtitle}
                                      </div>
                                    )}
                                  </div>
                                </button>
                              );
                            }

                            // Image / Render / Logo / Carousel / Landing Page
                            const isLogoCard = /logo/i.test(asset.title);
                            return (
                              <button
                                key={asset.id}
                                type="button"
                                onClick={() => {
                                  trackShowcaseEvent('showcase_item_click', {
                                    showcase_slug: hub.id,
                                    item_title: `${activeCsProject.name} - ${asset.title}`,
                                    item_type: 'case-study-image',
                                    destination_url: asset.url
                                  });
                                  openCsMediaInLightbox(sec.title, secItems, asset);
                                }}
                                className="group rounded-2xl border border-white/12 bg-white/[0.03] hover:border-rak-magenta/60 overflow-hidden text-left flex flex-col cursor-pointer transition-all hover:-translate-y-0.5"
                              >
                                <div
                                  className={`relative aspect-[4/3] w-full overflow-hidden flex items-center justify-center ${
                                    isLogoCard ? 'bg-white p-6' : 'bg-slate-950'
                                  }`}
                                >
                                  <img
                                    src={asset.url}
                                    alt={asset.title}
                                    loading="lazy"
                                    className={`w-full h-full transition-transform duration-300 group-hover:scale-105 ${
                                      isLogoCard ? 'object-contain' : 'object-cover object-top'
                                    }`}
                                  />
                                </div>
                                <div className="p-3.5 space-y-0.5">
                                  <div className="text-xs sm:text-[13px] font-bold text-white truncate">
                                    {asset.title}
                                  </div>
                                  {asset.subtitle && (
                                    <div className="text-[11px] text-slate-400 truncate">
                                      {asset.subtitle}
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </section>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Renders & Videos Gallery Vault Modal (z-50) */}
      <AnimatePresence>
        {activeGalleryVault && Array.isArray(activeGalleryVault.mediaItems) && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 18 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-[#070A12]/96 backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            {(() => {
              const allItems = activeGalleryVault.mediaItems || [];
              const imageItems = allItems.filter((m) => m.mediaType !== 'video');
              const videoItems = allItems.filter((m) => m.mediaType === 'video');
              const filteredItems =
                galleryVaultFilter === 'renders'
                  ? imageItems
                  : galleryVaultFilter === 'videos'
                  ? videoItems
                  : allItems;

              return (
                <>
                  {/* Top Sticky Header with Back Button */}
                  <div className="border-b border-white/10 bg-[#0B101D]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => setActiveGalleryVault(null)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white cursor-pointer transition-colors shrink-0"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-extrabold tracking-wide uppercase text-white truncate">
                          {activeGalleryVault.title}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {imageItems.length} 3D Renders • {videoItems.length} Videos &amp; Walkthroughs
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActiveGalleryVault(null)}
                      aria-label="Close Gallery"
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Scrollable Gallery Grid */}
                  <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8">
                    <div className="max-w-6xl mx-auto space-y-6 pb-10">
                      {/* Filter Bar */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        <button
                          type="button"
                          onClick={() => setGalleryVaultFilter('all')}
                          className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                            galleryVaultFilter === 'all'
                              ? 'bg-white text-slate-950 border-white'
                              : 'bg-white/[0.05] text-slate-300 border-white/12 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          All ({allItems.length})
                        </button>
                        {imageItems.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setGalleryVaultFilter('renders')}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                              galleryVaultFilter === 'renders'
                                ? 'bg-rak-magenta text-white border-rak-magenta'
                                : 'bg-white/[0.05] text-slate-300 border-white/12 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            3D Renders ({imageItems.length})
                          </button>
                        )}
                        {videoItems.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setGalleryVaultFilter('videos')}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer border ${
                              galleryVaultFilter === 'videos'
                                ? 'bg-rak-magenta text-white border-rak-magenta'
                                : 'bg-white/[0.05] text-slate-300 border-white/12 hover:bg-white/10 hover:text-white'
                            }`}
                          >
                            Videos &amp; Walkthroughs ({videoItems.length})
                          </button>
                        )}
                      </div>

                      {/* Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                        {filteredItems.map((asset, idx) => {
                          const masterIndex = allItems.findIndex((m) => m.id === asset.id);
                          const openIndex = masterIndex >= 0 ? masterIndex : idx;

                          if (asset.mediaType === 'video') {
                            return (
                              <button
                                key={asset.id || idx}
                                type="button"
                                onClick={() => {
                                  setGalleryZoomed(false);
                                  openModalWithHistory(setActiveGallery, {
                                    item: activeGalleryVault,
                                    index: openIndex
                                  });
                                }}
                                className="group rounded-2xl border border-white/12 bg-white/[0.03] hover:border-rak-magenta/60 overflow-hidden text-left flex flex-col cursor-pointer transition-all hover:-translate-y-0.5"
                              >
                                <div className="relative aspect-[16/10] w-full bg-black overflow-hidden">
                                  <video
                                    src={`${asset.url}#t=0.6`}
                                    muted
                                    playsInline
                                    preload="metadata"
                                    className="w-full h-full object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="w-11 h-11 rounded-full bg-rak-magenta/90 group-hover:bg-rak-magenta text-white flex items-center justify-center shadow-xl transition-transform group-hover:scale-110">
                                      <Play className="w-4 h-4 fill-current ml-0.5" />
                                    </span>
                                  </div>
                                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white">
                                    Video
                                  </span>
                                </div>
                                <div className="p-3.5 space-y-0.5">
                                  <div className="text-xs sm:text-[13px] font-bold text-white truncate">
                                    {asset.title || `Video ${idx + 1}`}
                                  </div>
                                  {asset.subtitle && (
                                    <div className="text-[11px] text-slate-400 truncate">
                                      {asset.subtitle}
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          }

                          return (
                            <button
                              key={asset.id || idx}
                              type="button"
                              onClick={() => {
                                setGalleryZoomed(false);
                                openModalWithHistory(setActiveGallery, {
                                  item: activeGalleryVault,
                                  index: openIndex
                                });
                              }}
                              className="group rounded-2xl border border-white/12 bg-white/[0.03] hover:border-rak-magenta/60 overflow-hidden text-left flex flex-col cursor-pointer transition-all hover:-translate-y-0.5"
                            >
                              <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden">
                                <img
                                  src={asset.url}
                                  alt={asset.title || `Render ${idx + 1}`}
                                  loading="lazy"
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white">
                                  3D Render
                                </span>
                              </div>
                              <div className="p-3.5 space-y-0.5">
                                <div className="text-xs sm:text-[13px] font-bold text-white truncate">
                                  {asset.title || `Render ${idx + 1}`}
                                </div>
                                {asset.subtitle && (
                                  <div className="text-[11px] text-slate-400 truncate">
                                    {asset.subtitle}
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen PDF / Document Viewer Modal (z-[60], layers above Case Study Vault) */}
      <AnimatePresence>
        {activePdfItem && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-[60] bg-[#070A12]/96 backdrop-blur-2xl flex flex-col overflow-hidden"
          >
            <div className="border-b border-white/10 bg-[#0B101D]/95 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setActivePdfItem(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white cursor-pointer transition-colors shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{activeCaseStudy ? 'Back to Case Study' : 'Back'}</span>
                </button>
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-rak-magenta-light shrink-0 hidden xs:inline" />
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {activePdfItem.title}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activePdfItem.url}
                  download
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] font-semibold text-white transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download PDF</span>
                </a>
                <a
                  href={activePdfItem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rak-magenta hover:bg-rak-magenta-dark text-[11px] font-bold text-white transition-colors"
                >
                  <span>Full Tab</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => setActivePdfItem(null)}
                  aria-label="Close PDF reader"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inline Renders & Video Lightbox Modal (z-[60], layers above Case Study & Gallery Vaults) */}
      <AnimatePresence>
        {activeGallery && activeGallery.item.mediaItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setActiveGallery(null);
              setGalleryZoomed(false);
            }}
            className="fixed inset-0 z-[60] bg-black/94 backdrop-blur-lg flex flex-col justify-between p-3 sm:p-6"
          >
            {(() => {
              const currentMedia = activeGallery.item.mediaItems[activeGallery.index];
              const isImage = currentMedia && currentMedia.mediaType !== 'video';

              return (
                <>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-6xl mx-auto flex items-center justify-between gap-3 shrink-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveGallery(null);
                          setGalleryZoomed(false);
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white cursor-pointer transition-colors shrink-0"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back</span>
                      </button>
                      <div className="min-w-0">
                        <h2 className="text-xs sm:text-base font-bold truncate">
                          {currentMedia?.title || activeGallery.item.title}
                        </h2>
                        <p className="text-[11px] text-slate-400 truncate">
                          {activeGallery.index + 1} of {activeGallery.item.mediaItems.length}
                          {currentMedia?.subtitle ? ` • ${currentMedia.subtitle}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {isImage && (
                        <button
                          type="button"
                          onClick={() => setGalleryZoomed((z) => !z)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white cursor-pointer"
                        >
                          {galleryZoomed ? (
                            <>
                              <ZoomOut className="w-3.5 h-3.5" />
                              <span className="hidden xs:inline">Fit Screen</span>
                            </>
                          ) : (
                            <>
                              <ZoomIn className="w-3.5 h-3.5" />
                              <span className="hidden xs:inline">Full Width</span>
                            </>
                          )}
                        </button>
                      )}
                      {currentMedia?.url && (
                        <a
                          href={currentMedia.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                          title="Open original file"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setActiveGallery(null);
                          setGalleryZoomed(false);
                        }}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className={`relative w-full max-w-5xl mx-auto flex-1 my-3 flex min-h-0 ${
                      galleryZoomed && isImage
                        ? 'overflow-y-auto items-start justify-center rounded-2xl bg-slate-950/80 p-2'
                        : 'items-center justify-center'
                    }`}
                  >
                    {currentMedia ? (
                      currentMedia.mediaType === 'video' ? (
                        <video
                          key={currentMedia.url}
                          src={currentMedia.url}
                          controls
                          autoPlay
                          playsInline
                          className="max-h-[76vh] max-w-full rounded-2xl shadow-2xl bg-black"
                        />
                      ) : (
                        <img
                          key={currentMedia.url}
                          src={currentMedia.url}
                          alt={currentMedia.title || activeGallery.item.title}
                          onDoubleClick={() => setGalleryZoomed((z) => !z)}
                          className={
                            galleryZoomed
                              ? 'w-full max-w-4xl h-auto rounded-xl shadow-2xl'
                              : `max-h-[76vh] max-w-full object-contain rounded-2xl shadow-2xl ${
                                  /logo/i.test(currentMedia.title || '') ? 'bg-white p-6' : ''
                                }`
                          }
                        />
                      )
                    ) : null}

                    {activeGallery.item.mediaItems.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            setGalleryZoomed(false);
                            setActiveGallery((p) => ({
                              ...p,
                              index:
                                (p.index - 1 + p.item.mediaItems.length) %
                                p.item.mediaItems.length
                            }));
                          }}
                          className="fixed sm:absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-rak-magenta border border-white/20 text-white cursor-pointer transition-colors z-10"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGalleryZoomed(false);
                            setActiveGallery((p) => ({
                              ...p,
                              index: (p.index + 1) % p.item.mediaItems.length
                            }));
                          }}
                          className="fixed sm:absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/70 hover:bg-rak-magenta border border-white/20 text-white cursor-pointer transition-colors z-10"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="text-center text-xs text-slate-300 pb-1 shrink-0"
                  >
                    {activeGallery.item.title}
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowcasePage;

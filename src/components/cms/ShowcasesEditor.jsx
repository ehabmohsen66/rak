import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Copy,
  Check,
  ExternalLink,
  Link2,
  FileText,
  Images,
  Type,
  Lock,
  Smartphone,
  Upload,
  FolderOpen,
  Loader2,
  Eye,
  EyeOff,
  Files,
  Sparkles,
  Share2,
  ArrowUpRight
} from 'lucide-react';
import {
  DEFAULT_SHOWCASES,
  normalizeShowcase,
  normalizeShowcases,
  slugifyShowcaseId
} from '../../lib/showcases';
import {
  CMS_BTN_PRIMARY,
  CMS_BTN_SECONDARY,
  CMS_BTN_DANGER,
  CMS_BTN_GHOST,
  CMS_ICON_BTN,
  CMS_CARD,
  CMS_SUBTLE_PANEL,
  CMS_INPUT_CLASS,
  CmsSectionHeader,
  CmsField,
  CmsToggle,
  CmsStatusBadge,
  MediaUploadField,
  MediaLibraryDialog,
  ConfirmDialog
} from './cmsTheme';

const COLOR_PRESETS = [
  { hex: '#213967', label: 'Executive Navy' },
  { hex: '#D1007C', label: 'RAK Magenta' },
  { hex: '#0F172A', label: 'Obsidian' },
  { hex: '#9A6F18', label: 'Champagne Gold' },
  { hex: '#14532D', label: 'Architectural Pine' },
  { hex: '#FFFFFF', label: 'Crisp White' }
];

const ITEM_TYPE_META = {
  link: { label: 'External Link', icon: Link2, badgeTone: 'neutral' },
  pdf: { label: 'Inline PDF / Deck', icon: FileText, badgeTone: 'brand' },
  gallery: { label: 'Renders & Video Gallery', icon: Images, badgeTone: 'success' },
  header: { label: 'Section Header', icon: Type, badgeTone: 'warning' }
};

export default function ShowcasesEditor({ draft, updateDraft, onUploadFile }) {
  const showcases = normalizeShowcases(draft?.showcases);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [copiedId, setCopiedId] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [expandedThumbItems, setExpandedThumbItems] = useState({});

  // Multi-upload state for gallery items
  const [galleryUploadingItemIdx, setGalleryUploadingItemIdx] = useState(null);
  const [galleryUploadStatus, setGalleryUploadStatus] = useState('');
  const [galleryLibraryItemIdx, setGalleryLibraryItemIdx] = useState(null);
  const multiFileInputRef = useRef(null);
  const multiUploadTargetIdxRef = useRef(null);

  const safeIdx = Math.min(selectedIdx, Math.max(0, showcases.length - 1));
  const activeHub = showcases[safeIdx] || null;

  const commitShowcases = (updater) => {
    updateDraft((prev) => {
      const current = normalizeShowcases(prev?.showcases);
      const nextList = typeof updater === 'function' ? updater(current) : updater;
      return {
        ...prev,
        showcases: nextList
      };
    });
  };

  const updateActiveHub = (patchOrFn) => {
    commitShowcases((list) =>
      list.map((hub, idx) => {
        if (idx !== safeIdx) return hub;
        const patch = typeof patchOrFn === 'function' ? patchOrFn(hub) : patchOrFn;
        return { ...hub, ...patch };
      })
    );
  };

  const updateHubItem = (itemIdx, patchOrFn) => {
    updateActiveHub((hub) => {
      const items = [...(hub.items || [])];
      if (!items[itemIdx]) return {};
      const patch = typeof patchOrFn === 'function' ? patchOrFn(items[itemIdx]) : patchOrFn;
      items[itemIdx] = { ...items[itemIdx], ...patch };
      return { items };
    });
  };

  const moveHubItem = (itemIdx, dir) => {
    updateActiveHub((hub) => {
      const items = [...(hub.items || [])];
      const target = itemIdx + dir;
      if (target < 0 || target >= items.length) return {};
      const tmp = items[itemIdx];
      items[itemIdx] = items[target];
      items[target] = tmp;
      return { items };
    });
  };

  const removeHubItem = (itemIdx) => {
    updateActiveHub((hub) => ({
      items: (hub.items || []).filter((_, i) => i !== itemIdx)
    }));
  };

  const addHubItem = (type = 'link') => {
    const defaultsByType = {
      link: { title: 'NEW SHOWCASE LINK', url: 'https://' },
      pdf: { title: 'PORTFOLIO DECK (PDF)', badge: 'PDF', url: '' },
      gallery: { title: 'RENDERS & VIDEOS', badge: 'GALLERY', url: '' },
      header: { title: 'FEATURED WORK', url: '' }
    };
    const meta = defaultsByType[type] || defaultsByType.link;
    updateActiveHub((hub) => ({
      items: [
        ...(hub.items || []),
        {
          id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          type,
          active: true,
          title: meta.title,
          subtitle: '',
          badge: meta.badge || '',
          thumbnail: '',
          url: meta.url || '',
          mediaItems: []
        }
      ]
    }));
  };

  const handleAddShowcase = () => {
    const baseNum = showcases.length + 1;
    let candidateSlug = `showcase-${baseNum}`;
    const existingIds = new Set(showcases.map((s) => s.id));
    while (existingIds.has(candidateSlug)) {
      candidateSlug = `showcase-${baseNum}-${Math.floor(Math.random() * 90 + 10)}`;
    }
    const newHub = normalizeShowcase({
      ...DEFAULT_SHOWCASES[0],
      id: candidateSlug,
      title: `@RAKSHOWCASE_${candidateSlug.toUpperCase().replace(/-/g, '_')}`,
      subtitle: 'Curated Portfolio, Case Studies & Creative Production',
      pinCode: '',
      footerCtaLabel: 'Request Proposal',
      items: [
        {
          id: `item-${Date.now()}-1`,
          type: 'link',
          active: true,
          title: 'PORTFOLIO',
          url: ''
        }
      ]
    });
    commitShowcases((list) => [...list, newHub]);
    setSelectedIdx(showcases.length);
  };

  const handleDuplicateShowcase = () => {
    if (!activeHub) return;
    const existingIds = new Set(showcases.map((s) => s.id));
    let copySlug = `${activeHub.id}-copy`;
    let n = 2;
    while (existingIds.has(copySlug)) {
      copySlug = `${activeHub.id}-copy-${n}`;
      n += 1;
    }
    const duplicated = normalizeShowcase({
      ...JSON.parse(JSON.stringify(activeHub)),
      id: copySlug,
      title: `${activeHub.title} (Copy)`
    });
    commitShowcases((list) => [...list, duplicated]);
    setSelectedIdx(showcases.length);
  };

  const handleConfirmDeleteShowcase = () => {
    setConfirmDeleteOpen(false);
    if (showcases.length <= 1) return;
    commitShowcases((list) => list.filter((_, idx) => idx !== safeIdx));
    setSelectedIdx(Math.max(0, safeIdx - 1));
  };

  const handleCopyUrl = (hubId) => {
    const origin =
      typeof window !== 'undefined' ? window.location.origin : 'https://rak4creative.com';
    const fullUrl = `${origin}/showcase/${hubId}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(fullUrl).then(() => {
        setCopiedId(hubId);
        setTimeout(() => setCopiedId(''), 2200);
      });
    }
  };

  const handleMultiGalleryFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    const itemIdx = multiUploadTargetIdxRef.current;
    if (!files.length || itemIdx === null || !onUploadFile) return;

    setGalleryUploadingItemIdx(itemIdx);
    const uploadedMedia = [];
    try {
      for (let i = 0; i < files.length; i += 1) {
        const file = files[i];
        setGalleryUploadStatus(`Uploading ${i + 1} of ${files.length}: ${file.name}`);
        const res = await onUploadFile(file, () => {});
        if (res && res.ok && res.url) {
          const isVideo =
            file.type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(res.url);
          uploadedMedia.push({
            id: `media-${Date.now()}-${i}`,
            mediaType: isVideo ? 'video' : 'image',
            url: res.url,
            title: file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ')
          });
        }
      }
      if (uploadedMedia.length > 0) {
        updateHubItem(itemIdx, (it) => ({
          mediaItems: [...(it.mediaItems || []), ...uploadedMedia]
        }));
      }
    } finally {
      setGalleryUploadingItemIdx(null);
      setGalleryUploadStatus('');
      multiUploadTargetIdxRef.current = null;
      if (multiFileInputRef.current) multiFileInputRef.current.value = '';
    }
  };

  const duplicateSlugExists =
    activeHub &&
    showcases.some(
      (s, idx) => idx !== safeIdx && s.id.toLowerCase() === activeHub.id.toLowerCase()
    );

  const originDisplay =
    typeof window !== 'undefined' ? window.location.origin : 'https://rak4creative.com';

  return (
    <div className="space-y-6">
      {/* Hidden multi-file input for batch gallery uploads */}
      <input
        ref={multiFileInputRef}
        type="file"
        multiple
        accept="image/*,video/mp4,video/webm,video/quicktime"
        onChange={handleMultiGalleryFiles}
        className="hidden"
      />

      {/* Top Hub Switcher Bar */}
      <div className={`${CMS_CARD} p-4 sm:p-5 space-y-4`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
              Your Showcase Hubs ({showcases.length})
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Create standalone Linktree-style microsites for industries (Real Estate, F&amp;B, Luxury) or private client pitches at <code className="font-mono">/showcase/:slug</code>.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/showcase"
              target="_blank"
              rel="noopener noreferrer"
              className={CMS_BTN_GHOST}
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              <span>Directory (/showcase)</span>
            </a>
            <button type="button" onClick={handleAddShowcase} className={CMS_BTN_PRIMARY}>
              <Plus className="w-4 h-4" aria-hidden="true" />
              <span>New Showcase</span>
            </button>
          </div>
        </div>

        {/* Hub selector pills */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {showcases.map((hub, idx) => {
            const isSelected = idx === safeIdx;
            return (
              <button
                key={`${hub.id}-${idx}`}
                type="button"
                onClick={() => setSelectedIdx(idx)}
                className={`inline-flex items-center gap-2 min-h-[40px] px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#D1007C] bg-pink-50/80 dark:bg-[#D1007C]/15 text-[#B0006A] dark:text-pink-200'
                    : 'border-black/[0.08] dark:border-white/[0.08] bg-slate-50/70 dark:bg-white/[0.03] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.07]'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    hub.active !== false ? 'bg-emerald-500' : 'bg-slate-400'
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate max-w-[200px]">{hub.title || hub.id}</span>
                {hub.pinCode && <Lock className="w-3.5 h-3.5 opacity-75" aria-hidden="true" />}
                <span className="text-[11px] font-mono opacity-65">/{hub.id}</span>
              </button>
            );
          })}
        </div>

        {/* Quick actions for active hub */}
        {activeHub && (
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300 min-w-0">
              <span className="font-medium text-slate-500 dark:text-slate-400">Live URL:</span>
              <code className="px-2 py-1 rounded bg-slate-100 dark:bg-white/[0.06] font-mono text-slate-800 dark:text-slate-100 truncate">
                {originDisplay}/showcase/{activeHub.id}
              </code>
              {activeHub.noindex && (
                <CmsStatusBadge tone="neutral">Private (noindex)</CmsStatusBadge>
              )}
              {activeHub.pinCode && (
                <CmsStatusBadge tone="warning">PIN Protected</CmsStatusBadge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyUrl(activeHub.id)}
                className={CMS_BTN_SECONDARY}
              >
                {copiedId === activeHub.id ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span>Copied URL</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" aria-hidden="true" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>
              <a
                href={`/showcase/${activeHub.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className={CMS_BTN_SECONDARY}
              >
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
                <span>Open Live</span>
              </a>
              <button
                type="button"
                onClick={handleDuplicateShowcase}
                className={CMS_BTN_GHOST}
              >
                <Files className="w-4 h-4" aria-hidden="true" />
                <span>Duplicate</span>
              </button>
              {showcases.length > 1 && (
                <button
                  type="button"
                  onClick={() => setConfirmDeleteOpen(true)}
                  className={CMS_BTN_DANGER}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {activeHub && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Editor Cards */}
          <div className="xl:col-span-7 space-y-6">
            {/* 1. Identity & Privacy */}
            <div className={`${CMS_CARD} p-5 sm:p-6 space-y-5`}>
              <CmsSectionHeader
                title="1. Hub Identity & Privacy"
                description="Profile handle, URL slug, avatar emblem, social share preview, and optional PIN lock."
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsField
                  label="URL Slug"
                  htmlFor="sc-slug"
                  required
                  hint={`Appears at /showcase/${activeHub.id || 'slug'}`}
                >
                  <input
                    id="sc-slug"
                    type="text"
                    value={activeHub.id}
                    onChange={(e) =>
                      updateActiveHub({
                        id: e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9-]+/g, '-')
                          .replace(/^-+/, '')
                      })
                    }
                    onBlur={(e) =>
                      updateActiveHub({ id: slugifyShowcaseId(e.target.value || 'showcase') })
                    }
                    placeholder="real-estate"
                    className={CMS_INPUT_CLASS}
                  />
                  {duplicateSlugExists && (
                    <p className="text-xs font-medium text-rose-600 dark:text-rose-400">
                      Another showcase already uses this slug. Choose a unique URL slug.
                    </p>
                  )}
                </CmsField>

                <CmsField
                  label="Optional PIN Lock"
                  htmlFor="sc-pin"
                  hint="Leave blank for instant public access, or set a code for private pitches."
                >
                  <input
                    id="sc-pin"
                    type="text"
                    maxLength={12}
                    value={activeHub.pinCode || ''}
                    onChange={(e) => updateActiveHub({ pinCode: e.target.value.trim() })}
                    placeholder="No PIN (Public)"
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsField label="Display Title / Handle" htmlFor="sc-title" required>
                  <input
                    id="sc-title"
                    type="text"
                    value={activeHub.title}
                    onChange={(e) => updateActiveHub({ title: e.target.value })}
                    placeholder="@RAKSHOWCASE_REALESTATE"
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <CmsField
                  label="Subtitle / Bio Line"
                  htmlFor="sc-subtitle"
                  hint="Shown beneath the title and in WhatsApp / LinkedIn link previews."
                >
                  <input
                    id="sc-subtitle"
                    type="text"
                    value={activeHub.subtitle}
                    onChange={(e) => updateActiveHub({ subtitle: e.target.value })}
                    placeholder="Real Estate Branding, 3D Visualization & Campaigns"
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <MediaUploadField
                  id="sc-avatar"
                  label="Profile Avatar / Emblem"
                  kind="image"
                  accept="image/*"
                  value={activeHub.avatarUrl}
                  onUploadFile={onUploadFile}
                  onChange={(url) => updateActiveHub({ avatarUrl: url })}
                  hint="Square 1:1 logo or emblem (e.g. 400×400 WebP/PNG)."
                />

                <MediaUploadField
                  id="sc-og-image"
                  label="WhatsApp / Social Preview Image"
                  kind="image"
                  accept="image/*"
                  value={activeHub.ogImageUrl}
                  onUploadFile={onUploadFile}
                  onChange={(url) => updateActiveHub({ ogImageUrl: url })}
                  hint="Open Graph thumbnail shown when sharing the URL."
                />
              </div>

              <div className={`${CMS_SUBTLE_PANEL} px-4 py-2 divide-y divide-black/[0.06] dark:divide-white/[0.06]`}>
                <CmsToggle
                  id="sc-active"
                  label="Showcase Active (Live)"
                  description="Turn off to temporarily take this showcase offline."
                  checked={activeHub.active !== false}
                  onChange={(val) => updateActiveHub({ active: val })}
                />
                <CmsToggle
                  id="sc-noindex"
                  label="Keep Private from Google Search (noindex)"
                  description="Recommended ON for sales decks and client-specific links. Turn OFF if you want Google to index this hub."
                  checked={activeHub.noindex !== false}
                  onChange={(val) => updateActiveHub({ noindex: val })}
                />
                <CmsToggle
                  id="sc-directory"
                  label="List on /showcase Directory Page"
                  description="Turn off to make this an unlisted direct-link-only microsite."
                  checked={activeHub.listedInDirectory !== false}
                  onChange={(val) => updateActiveHub({ listedInDirectory: val })}
                />
              </div>
            </div>

            {/* 2. Background & Button Theme */}
            <div className={`${CMS_CARD} p-5 sm:p-6 space-y-5`}>
              <CmsSectionHeader
                title="2. Visual Theme, Background & Buttons"
                description="Customize full-bleed architectural renders, looping reel backgrounds, dark readability tint, and pill button colors."
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CmsField label="Background Type" htmlFor="sc-bg-type">
                  <select
                    id="sc-bg-type"
                    value={activeHub.backgroundType}
                    onChange={(e) => updateActiveHub({ backgroundType: e.target.value })}
                    className={CMS_INPUT_CLASS}
                  >
                    <option value="image">Image / 3D Render</option>
                    <option value="video">Looping Video (.mp4)</option>
                    <option value="gradient">Solid / Ambient Glow</option>
                  </select>
                </CmsField>

                <CmsField label="Desktop Framing" htmlFor="sc-bg-fit">
                  <select
                    id="sc-bg-fit"
                    value={activeHub.backgroundFit}
                    onChange={(e) => updateActiveHub({ backgroundFit: e.target.value })}
                    className={CMS_INPUT_CLASS}
                  >
                    <option value="ambient">Portrait Stage + Ambient Blur (9:16 art)</option>
                    <option value="cover">Full-Bleed Cover (16:9 art)</option>
                  </select>
                </CmsField>

                <CmsField label="Base Backdrop Color" htmlFor="sc-bg-color">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label="Backdrop color picker"
                      value={activeHub.backgroundColor || '#101829'}
                      onChange={(e) => updateActiveHub({ backgroundColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-black/10 dark:border-white/15 bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      id="sc-bg-color"
                      type="text"
                      value={activeHub.backgroundColor || '#101829'}
                      onChange={(e) => updateActiveHub({ backgroundColor: e.target.value })}
                      className={CMS_INPUT_CLASS}
                    />
                  </div>
                </CmsField>
              </div>

              {activeHub.backgroundType !== 'gradient' && (
                <MediaUploadField
                  id="sc-bg-url"
                  label={
                    activeHub.backgroundType === 'video'
                      ? 'Background Video (.mp4 / .webm)'
                      : 'Background Artwork / Render'
                  }
                  kind={activeHub.backgroundType === 'video' ? 'video' : 'image'}
                  accept={
                    activeHub.backgroundType === 'video'
                      ? 'video/mp4,video/webm,video/quicktime'
                      : 'image/*'
                  }
                  value={activeHub.backgroundUrl}
                  onUploadFile={onUploadFile}
                  onChange={(url) => updateActiveHub({ backgroundUrl: url })}
                  hint={
                    activeHub.backgroundFit === 'ambient'
                      ? 'Vertical 9:16 renders stay uncropped on both mobile and desktop.'
                      : 'Landscape 16:9 image or video fills the entire desktop viewport.'
                  }
                />
              )}

              <CmsField
                label={`Dark Readability Overlay: ${activeHub.overlayOpacity}%`}
                htmlFor="sc-overlay"
                hint="Dims bright renders slightly so white titles and buttons stay crisp."
              >
                <input
                  id="sc-overlay"
                  type="range"
                  min={0}
                  max={85}
                  step={5}
                  value={activeHub.overlayOpacity}
                  onChange={(e) => updateActiveHub({ overlayOpacity: Number(e.target.value) })}
                  className="w-full accent-[#D1007C] cursor-pointer"
                />
              </CmsField>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-black/[0.06] dark:border-white/[0.06]">
                <CmsField label="Button Style" htmlFor="sc-btn-style">
                  <select
                    id="sc-btn-style"
                    value={activeHub.buttonStyle}
                    onChange={(e) => updateActiveHub({ buttonStyle: e.target.value })}
                    className={CMS_INPUT_CLASS}
                  >
                    <option value="solid">Solid Brand Fill</option>
                    <option value="glass">Frosted Glassmorphism</option>
                    <option value="outline">Crisp Outline</option>
                  </select>
                </CmsField>

                <CmsField label="Button Shape" htmlFor="sc-btn-radius">
                  <select
                    id="sc-btn-radius"
                    value={activeHub.buttonRadius}
                    onChange={(e) => updateActiveHub({ buttonRadius: e.target.value })}
                    className={CMS_INPUT_CLASS}
                  >
                    <option value="pill">Full Pill (Linktree Classic)</option>
                    <option value="rounded">Architectural Rounded (16px)</option>
                  </select>
                </CmsField>

                <CmsField label="Button Fill Color" htmlFor="sc-btn-color">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        aria-label="Button fill color picker"
                        value={activeHub.buttonColor || '#213967'}
                        onChange={(e) => updateActiveHub({ buttonColor: e.target.value })}
                        className="w-10 h-10 rounded-lg border border-black/10 dark:border-white/15 bg-transparent cursor-pointer shrink-0"
                      />
                      <input
                        id="sc-btn-color"
                        type="text"
                        value={activeHub.buttonColor || '#213967'}
                        onChange={(e) => updateActiveHub({ buttonColor: e.target.value })}
                        className={CMS_INPUT_CLASS}
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {COLOR_PRESETS.map((preset) => (
                        <button
                          key={preset.hex}
                          type="button"
                          title={preset.label}
                          onClick={() =>
                            updateActiveHub({
                              buttonColor: preset.hex,
                              buttonTextColor: preset.hex === '#FFFFFF' ? '#0F172A' : '#FFFFFF'
                            })
                          }
                          className="w-6 h-6 rounded-full border border-black/20 dark:border-white/25 transition-transform hover:scale-110 cursor-pointer"
                          style={{ backgroundColor: preset.hex }}
                        />
                      ))}
                    </div>
                  </div>
                </CmsField>

                <CmsField label="Button Text Color" htmlFor="sc-btn-text-color">
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      aria-label="Button text color picker"
                      value={activeHub.buttonTextColor || '#FFFFFF'}
                      onChange={(e) => updateActiveHub({ buttonTextColor: e.target.value })}
                      className="w-10 h-10 rounded-lg border border-black/10 dark:border-white/15 bg-transparent cursor-pointer shrink-0"
                    />
                    <input
                      id="sc-btn-text-color"
                      type="text"
                      value={activeHub.buttonTextColor || '#FFFFFF'}
                      onChange={(e) => updateActiveHub({ buttonTextColor: e.target.value })}
                      className={CMS_INPUT_CLASS}
                    />
                  </div>
                </CmsField>
              </div>
            </div>

            {/* 3. Links, PDFs & Gallery Items */}
            <div className={`${CMS_CARD} p-5 sm:p-6 space-y-5`}>
              <CmsSectionHeader
                title={`3. Links, Decks & Galleries (${activeHub.items?.length || 0})`}
                description="Add external URLs, inline PDF portfolio readers, or multi-slide 3D render & video galleries."
              />

              {/* Quick-add buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => addHubItem('link')}
                  className={CMS_BTN_SECONDARY}
                >
                  <Link2 className="w-4 h-4" aria-hidden="true" />
                  <span>+ External Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => addHubItem('pdf')}
                  className={CMS_BTN_SECONDARY}
                >
                  <FileText className="w-4 h-4" aria-hidden="true" />
                  <span>+ Inline PDF / Deck</span>
                </button>
                <button
                  type="button"
                  onClick={() => addHubItem('gallery')}
                  className={CMS_BTN_SECONDARY}
                >
                  <Images className="w-4 h-4" aria-hidden="true" />
                  <span>+ Renders &amp; Video Gallery</span>
                </button>
                <button
                  type="button"
                  onClick={() => addHubItem('header')}
                  className={CMS_BTN_GHOST}
                >
                  <Type className="w-4 h-4" aria-hidden="true" />
                  <span>+ Section Header</span>
                </button>
              </div>

              {(activeHub.items || []).length === 0 ? (
                <div className={`${CMS_SUBTLE_PANEL} p-8 text-center space-y-2`}>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                    No buttons or blocks yet
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Use the buttons above to add your first Portfolio PDF, External Link, or Renders &amp; Video Gallery.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(activeHub.items || []).map((item, itemIdx) => {
                    const meta = ITEM_TYPE_META[item.type] || ITEM_TYPE_META.link;
                    const TypeIcon = meta.icon;
                    const showThumbField =
                      Boolean(item.thumbnail) || Boolean(expandedThumbItems[item.id]);

                    return (
                      <div
                        key={item.id || itemIdx}
                        className={`${CMS_SUBTLE_PANEL} p-4 space-y-3.5 transition-opacity ${
                          item.active === false ? 'opacity-60' : ''
                        }`}
                      >
                        {/* Item Header Row */}
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                              #{itemIdx + 1}
                            </span>
                            <CmsStatusBadge tone={meta.badgeTone}>
                              <TypeIcon className="w-3.5 h-3.5" aria-hidden="true" />
                              <span>{meta.label}</span>
                            </CmsStatusBadge>
                            <select
                              aria-label={`Block ${itemIdx + 1} type`}
                              value={item.type}
                              onChange={(e) => updateHubItem(itemIdx, { type: e.target.value })}
                              className="h-7 px-2 rounded-md text-xs font-medium border border-black/[0.1] dark:border-white/[0.12] bg-white dark:bg-[#141418] text-slate-700 dark:text-slate-200 cursor-pointer"
                            >
                              <option value="link">Switch to: External Link</option>
                              <option value="pdf">Switch to: Inline PDF / Deck</option>
                              <option value="gallery">Switch to: Renders &amp; Video Gallery</option>
                              <option value="header">Switch to: Section Header</option>
                            </select>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => updateHubItem(itemIdx, { active: item.active === false })}
                              title={item.active === false ? 'Show item' : 'Hide item'}
                              aria-label={item.active === false ? 'Show item' : 'Hide item'}
                              className={CMS_ICON_BTN}
                            >
                              {item.active === false ? (
                                <EyeOff className="w-4 h-4" aria-hidden="true" />
                              ) : (
                                <Eye className="w-4 h-4" aria-hidden="true" />
                              )}
                            </button>
                            <button
                              type="button"
                              disabled={itemIdx === 0}
                              onClick={() => moveHubItem(itemIdx, -1)}
                              aria-label="Move item up"
                              className={CMS_ICON_BTN}
                            >
                              <ArrowUp className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              disabled={itemIdx === (activeHub.items?.length || 1) - 1}
                              onClick={() => moveHubItem(itemIdx, 1)}
                              aria-label="Move item down"
                              className={CMS_ICON_BTN}
                            >
                              <ArrowDown className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeHubItem(itemIdx)}
                              aria-label="Delete item"
                              className={`${CMS_ICON_BTN} text-rose-600 dark:text-rose-400 hover:text-rose-700`}
                            >
                              <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        {/* Title / Subtitle / Badge */}
                        {item.type === 'header' ? (
                          <CmsField label="Section Divider Label" htmlFor={`item-title-${itemIdx}`}>
                            <input
                              id={`item-title-${itemIdx}`}
                              type="text"
                              value={item.title}
                              onChange={(e) => updateHubItem(itemIdx, { title: e.target.value })}
                              placeholder="ARCHITECTURAL VISUALIZATION"
                              className={CMS_INPUT_CLASS}
                            />
                          </CmsField>
                        ) : (
                          <>
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                              <div className="sm:col-span-6">
                                <CmsField label="Button Label" htmlFor={`item-title-${itemIdx}`}>
                                  <input
                                    id={`item-title-${itemIdx}`}
                                    type="text"
                                    value={item.title}
                                    onChange={(e) =>
                                      updateHubItem(itemIdx, { title: e.target.value })
                                    }
                                    placeholder="PORTFOLIO"
                                    className={CMS_INPUT_CLASS}
                                  />
                                </CmsField>
                              </div>
                              <div className="sm:col-span-4">
                                <CmsField
                                  label="Optional Sub-label"
                                  htmlFor={`item-sub-${itemIdx}`}
                                >
                                  <input
                                    id={`item-sub-${itemIdx}`}
                                    type="text"
                                    value={item.subtitle}
                                    onChange={(e) =>
                                      updateHubItem(itemIdx, { subtitle: e.target.value })
                                    }
                                    placeholder="2026 Credentials Deck"
                                    className={CMS_INPUT_CLASS}
                                  />
                                </CmsField>
                              </div>
                              <div className="sm:col-span-2">
                                <CmsField label="Badge" htmlFor={`item-badge-${itemIdx}`}>
                                  <input
                                    id={`item-badge-${itemIdx}`}
                                    type="text"
                                    value={item.badge}
                                    onChange={(e) =>
                                      updateHubItem(itemIdx, { badge: e.target.value })
                                    }
                                    placeholder="PDF"
                                    className={CMS_INPUT_CLASS}
                                  />
                                </CmsField>
                              </div>
                            </div>

                            {/* URL / PDF Upload for 'link' and 'pdf' */}
                            {(item.type === 'link' || item.type === 'pdf') && (
                              <MediaUploadField
                                id={`item-url-${itemIdx}`}
                                label={
                                  item.type === 'pdf'
                                    ? 'PDF File or Google Drive File URL'
                                    : 'Destination URL (or Upload File)'
                                }
                                kind={item.type === 'pdf' ? 'file' : 'all'}
                                accept="application/pdf,image/*,video/mp4,video/webm,video/quicktime"
                                placeholder={
                                  item.type === 'pdf'
                                    ? '/uploads/media/portfolio.pdf or https://drive.google.com/file/d/…/view'
                                    : 'https://…'
                                }
                                hint={
                                  item.type === 'pdf'
                                    ? 'Opens inside an on-page PDF reader modal. Supports uploaded PDFs (up to 64 MB) and Google Drive /file/d/… links.'
                                    : 'Opens in a new tab when tapped.'
                                }
                                value={item.url}
                                onUploadFile={onUploadFile}
                                onChange={(url) => updateHubItem(itemIdx, { url })}
                              />
                            )}

                            {/* Gallery Media Manager for 'gallery' */}
                            {item.type === 'gallery' && (
                              <div className="space-y-3 pt-1">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                    Gallery Slides ({item.mediaItems?.length || 0} renders / videos)
                                  </span>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <button
                                      type="button"
                                      disabled={galleryUploadingItemIdx === itemIdx}
                                      onClick={() => {
                                        multiUploadTargetIdxRef.current = itemIdx;
                                        multiFileInputRef.current?.click();
                                      }}
                                      className={CMS_BTN_PRIMARY}
                                    >
                                      {galleryUploadingItemIdx === itemIdx ? (
                                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                                      ) : (
                                        <Upload className="w-4 h-4" aria-hidden="true" />
                                      )}
                                      <span>
                                        {galleryUploadingItemIdx === itemIdx
                                          ? 'Uploading…'
                                          : 'Upload Renders / Videos'}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setGalleryLibraryItemIdx(itemIdx)}
                                      className={CMS_BTN_SECONDARY}
                                    >
                                      <FolderOpen className="w-4 h-4" aria-hidden="true" />
                                      <span>Add from Library</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateHubItem(itemIdx, (it) => ({
                                          mediaItems: [
                                            ...(it.mediaItems || []),
                                            {
                                              id: `media-${Date.now()}`,
                                              mediaType: 'image',
                                              url: '',
                                              title: ''
                                            }
                                          ]
                                        }))
                                      }
                                      className={CMS_BTN_GHOST}
                                    >
                                      <Plus className="w-4 h-4" aria-hidden="true" />
                                      <span>Paste URL</span>
                                    </button>
                                  </div>
                                </div>

                                {galleryUploadingItemIdx === itemIdx && galleryUploadStatus && (
                                  <p className="text-xs font-medium text-[#D1007C] dark:text-pink-300">
                                    {galleryUploadStatus}
                                  </p>
                                )}

                                {(item.mediaItems || []).length === 0 ? (
                                  <div className="rounded-lg border border-dashed border-black/15 dark:border-white/15 p-4 text-center text-xs text-slate-500 dark:text-slate-400">
                                    Upload multiple 3D renders (JPG/PNG/WebP) or walkthrough videos (MP4/WebM) to launch an interactive lightbox gallery when visitors tap this button.
                                    <div className="mt-2">
                                      <input
                                        type="text"
                                        value={item.url || ''}
                                        onChange={(e) =>
                                          updateHubItem(itemIdx, { url: e.target.value })
                                        }
                                        placeholder="Optional fallback external URL if gallery is empty (https://…)"
                                        className={CMS_INPUT_CLASS}
                                      />
                                    </div>
                                  </div>
                                ) : (
                                  <div className="space-y-2">
                                    {(item.mediaItems || []).map((m, mIdx) => (
                                      <div
                                        key={m.id || mIdx}
                                        className="flex flex-col sm:flex-row sm:items-center gap-2.5 p-2.5 rounded-lg border border-black/[0.07] dark:border-white/[0.08] bg-white dark:bg-[#141418]"
                                      >
                                        <div className="w-16 h-12 rounded overflow-hidden bg-slate-100 dark:bg-black/50 shrink-0 flex items-center justify-center">
                                          {m.url ? (
                                            m.mediaType === 'video' ||
                                            /\.(mp4|webm|mov)(\?|$)/i.test(m.url) ? (
                                              <video
                                                src={`${m.url}#t=0.5`}
                                                muted
                                                playsInline
                                                preload="metadata"
                                                className="w-full h-full object-cover"
                                              />
                                            ) : (
                                              <img
                                                src={m.url}
                                                alt=""
                                                className="w-full h-full object-cover"
                                              />
                                            )
                                          ) : (
                                            <Images className="w-4 h-4 text-slate-400" />
                                          )}
                                        </div>

                                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-12 gap-2 min-w-0">
                                          <select
                                            aria-label="Slide media type"
                                            value={m.mediaType || 'image'}
                                            onChange={(e) => {
                                              const nextMedia = [...item.mediaItems];
                                              nextMedia[mIdx] = {
                                                ...nextMedia[mIdx],
                                                mediaType: e.target.value
                                              };
                                              updateHubItem(itemIdx, { mediaItems: nextMedia });
                                            }}
                                            className={`${CMS_INPUT_CLASS} sm:col-span-3`}
                                          >
                                            <option value="image">Image</option>
                                            <option value="video">Video</option>
                                          </select>
                                          <input
                                            type="text"
                                            value={m.url || ''}
                                            onChange={(e) => {
                                              const nextMedia = [...item.mediaItems];
                                              nextMedia[mIdx] = {
                                                ...nextMedia[mIdx],
                                                url: e.target.value
                                              };
                                              updateHubItem(itemIdx, { mediaItems: nextMedia });
                                            }}
                                            placeholder="/uploads/media/render.webp or https://…"
                                            className={`${CMS_INPUT_CLASS} sm:col-span-5`}
                                          />
                                          <input
                                            type="text"
                                            value={m.title || ''}
                                            onChange={(e) => {
                                              const nextMedia = [...item.mediaItems];
                                              nextMedia[mIdx] = {
                                                ...nextMedia[mIdx],
                                                title: e.target.value
                                              };
                                              updateHubItem(itemIdx, { mediaItems: nextMedia });
                                            }}
                                            placeholder="Caption (optional)"
                                            className={`${CMS_INPUT_CLASS} sm:col-span-4`}
                                          />
                                        </div>

                                        <div className="flex items-center justify-end gap-1 shrink-0">
                                          <button
                                            type="button"
                                            disabled={mIdx === 0}
                                            onClick={() => {
                                              const nextMedia = [...item.mediaItems];
                                              const tmp = nextMedia[mIdx];
                                              nextMedia[mIdx] = nextMedia[mIdx - 1];
                                              nextMedia[mIdx - 1] = tmp;
                                              updateHubItem(itemIdx, { mediaItems: nextMedia });
                                            }}
                                            className={CMS_ICON_BTN}
                                            aria-label="Move slide up"
                                          >
                                            <ArrowUp className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            disabled={mIdx === item.mediaItems.length - 1}
                                            onClick={() => {
                                              const nextMedia = [...item.mediaItems];
                                              const tmp = nextMedia[mIdx];
                                              nextMedia[mIdx] = nextMedia[mIdx + 1];
                                              nextMedia[mIdx + 1] = tmp;
                                              updateHubItem(itemIdx, { mediaItems: nextMedia });
                                            }}
                                            className={CMS_ICON_BTN}
                                            aria-label="Move slide down"
                                          >
                                            <ArrowDown className="w-3.5 h-3.5" />
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const nextMedia = item.mediaItems.filter(
                                                (_, i) => i !== mIdx
                                              );
                                              updateHubItem(itemIdx, { mediaItems: nextMedia });
                                            }}
                                            className={`${CMS_ICON_BTN} text-rose-600 dark:text-rose-400`}
                                            aria-label="Remove slide"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Optional Button Left Thumbnail */}
                            {showThumbField ? (
                              <MediaUploadField
                                id={`item-thumb-${itemIdx}`}
                                label="Optional Button Icon / Thumbnail"
                                kind="image"
                                accept="image/*"
                                value={item.thumbnail}
                                onUploadFile={onUploadFile}
                                onChange={(url) => updateHubItem(itemIdx, { thumbnail: url })}
                              />
                            ) : (
                              <div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedThumbItems((p) => ({ ...p, [item.id]: true }))
                                  }
                                  className="text-xs font-medium text-slate-500 hover:text-[#D1007C] dark:text-slate-400 dark:hover:text-pink-300 cursor-pointer"
                                >
                                  + Add optional button thumbnail image
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 4. Bottom Conversion CTA & Direct Contact */}
            <div className={`${CMS_CARD} p-5 sm:p-6 space-y-5`}>
              <CmsSectionHeader
                title="4. Lead Capture CTA & Direct Contact"
                description="Turn showcase visitors into warm leads with an interactive Proposal Estimator button, WhatsApp shortcut, and email."
              />

              <CmsToggle
                id="sc-show-cta"
                label="Show Bottom Proposal CTA Button"
                description="Opens the interactive RAK4Creative Project Planner modal right over the showcase."
                checked={activeHub.showFooterCta !== false}
                onChange={(val) => updateActiveHub({ showFooterCta: val })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <CmsField label="Proposal Button Label" htmlFor="sc-cta-label">
                  <input
                    id="sc-cta-label"
                    type="text"
                    value={activeHub.footerCtaLabel}
                    onChange={(e) => updateActiveHub({ footerCtaLabel: e.target.value })}
                    placeholder="Request Real Estate Proposal"
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <CmsField
                  label="WhatsApp Number (Optional)"
                  htmlFor="sc-whatsapp"
                  hint="Defaults to Brand WhatsApp if blank."
                >
                  <input
                    id="sc-whatsapp"
                    type="text"
                    value={activeHub.whatsapp}
                    onChange={(e) => updateActiveHub({ whatsapp: e.target.value })}
                    placeholder="+961 ..."
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <CmsField
                  label="Contact Email (Optional)"
                  htmlFor="sc-email"
                  hint="Defaults to Brand Email if blank."
                >
                  <input
                    id="sc-email"
                    type="email"
                    value={activeHub.contactEmail}
                    onChange={(e) => updateActiveHub({ contactEmail: e.target.value })}
                    placeholder="hello@rak4creative.com"
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Live Mobile Phone Mockup */}
          <div className="xl:col-span-5 xl:sticky xl:top-6 space-y-3">
            <div className={`${CMS_CARD} p-4 sm:p-5 space-y-4`}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-[#D1007C]" aria-hidden="true" />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    Live Mobile Preview
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  /showcase/{activeHub.id}
                </span>
              </div>

              {/* Phone Bezel */}
              <div className="mx-auto w-full max-w-[348px] rounded-[40px] p-2.5 bg-slate-950 shadow-2xl ring-1 ring-white/15">
                <div
                  className="relative w-full h-[640px] rounded-[31px] overflow-hidden flex flex-col justify-between text-white select-none"
                  style={{ backgroundColor: activeHub.backgroundColor || '#101829' }}
                >
                  {/* Dynamic Island notch */}
                  <div className="pointer-events-none absolute top-2.5 left-1/2 -translate-x-1/2 z-30 w-24 h-5 rounded-full bg-black/85 ring-1 ring-white/10" />

                  {/* Background Layer */}
                  {activeHub.backgroundType === 'video' && activeHub.backgroundUrl ? (
                    <video
                      key={activeHub.backgroundUrl}
                      src={activeHub.backgroundUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : activeHub.backgroundType === 'image' && activeHub.backgroundUrl ? (
                    <img
                      key={activeHub.backgroundUrl}
                      src={activeHub.backgroundUrl}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at 50% 0%, rgba(236,0,140,0.32), transparent 60%), ${
                          activeHub.backgroundColor || '#101829'
                        }`
                      }}
                    />
                  )}

                  {/* Readability Overlay */}
                  <div
                    className="absolute inset-0 pointer-events-none transition-opacity"
                    style={{
                      backgroundColor: '#050811',
                      opacity: Math.max(0, Math.min(0.9, (activeHub.overlayOpacity ?? 25) / 100))
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(5,8,17,0.3) 0%, rgba(5,8,17,0.08) 40%, rgba(5,8,17,0.6) 100%)'
                    }}
                  />

                  {/* Scrollable Phone Content */}
                  <div className="relative z-10 flex-1 overflow-y-auto px-4 pt-10 pb-5 flex flex-col justify-between">
                    <div>
                      {/* Top Share Pill */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-2.5 py-1 rounded-full bg-black/35 backdrop-blur-md border border-white/15 text-[9px] font-bold tracking-wider uppercase text-white/90">
                          RAK4Creative
                        </span>
                        <span className="w-7 h-7 rounded-full bg-black/35 backdrop-blur-md border border-white/15 flex items-center justify-center">
                          <Share2 className="w-3.5 h-3.5 text-white/90" />
                        </span>
                      </div>

                      {/* Avatar + Title */}
                      <div className="text-center mb-5">
                        {activeHub.avatarUrl && (
                          <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden ring-2 ring-white/30 shadow-xl bg-black/30">
                            <img
                              src={activeHub.avatarUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <h4
                          className="text-sm font-extrabold tracking-tight text-white break-words px-1"
                          style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}
                        >
                          {activeHub.title || '@RAKSHOWCASE'}
                        </h4>
                        {activeHub.subtitle && (
                          <p
                            className="mt-1 text-[11px] text-white/85 leading-snug px-2"
                            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.55)' }}
                          >
                            {activeHub.subtitle}
                          </p>
                        )}
                      </div>

                      {/* Buttons */}
                      <div className="space-y-2.5">
                        {(activeHub.items || [])
                          .filter((it) => it.active !== false)
                          .map((it, i) => {
                            if (it.type === 'header') {
                              return (
                                <div key={it.id || i} className="pt-2 pb-0.5 text-center">
                                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/80">
                                    {it.title}
                                  </span>
                                </div>
                              );
                            }

                            const radiusCls =
                              activeHub.buttonRadius === 'rounded' ? 'rounded-xl' : 'rounded-full';
                            const btnStyle =
                              activeHub.buttonStyle === 'glass'
                                ? {
                                    backgroundColor: 'rgba(15, 23, 42, 0.52)',
                                    backdropFilter: 'blur(14px)',
                                    color: activeHub.buttonTextColor || '#FFFFFF',
                                    border: '1px solid rgba(255,255,255,0.24)'
                                  }
                                : activeHub.buttonStyle === 'outline'
                                ? {
                                    backgroundColor: 'rgba(5, 8, 17, 0.3)',
                                    backdropFilter: 'blur(8px)',
                                    color: activeHub.buttonTextColor || '#FFFFFF',
                                    border: `1.5px solid ${activeHub.buttonColor || '#FFFFFF'}`
                                  }
                                : {
                                    backgroundColor: activeHub.buttonColor || '#213967',
                                    color: activeHub.buttonTextColor || '#FFFFFF',
                                    border: '1px solid rgba(255,255,255,0.12)'
                                  };

                            return (
                              <div
                                key={it.id || i}
                                style={btnStyle}
                                className={`w-full min-h-[46px] px-4 py-2.5 ${radiusCls} flex items-center justify-between gap-2 shadow-md`}
                              >
                                {it.thumbnail ? (
                                  <img
                                    src={it.thumbnail}
                                    alt=""
                                    className="w-7 h-7 rounded-full object-cover shrink-0"
                                  />
                                ) : (
                                  <span className="w-4 shrink-0" />
                                )}
                                <div className="flex-1 min-w-0 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <span className="text-[11px] font-bold tracking-wide truncate">
                                      {it.title || 'UNTITLED'}
                                    </span>
                                    {it.badge && (
                                      <span className="px-1.5 py-0.5 rounded-full text-[8px] font-extrabold uppercase bg-white/20">
                                        {it.badge}
                                      </span>
                                    )}
                                  </div>
                                  {it.subtitle && (
                                    <p className="text-[9px] opacity-80 truncate">{it.subtitle}</p>
                                  )}
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-80 shrink-0" />
                              </div>
                            );
                          })}
                      </div>
                    </div>

                    {/* Footer CTA Preview */}
                    <div className="mt-6 pt-3 flex flex-col items-center gap-2">
                      {activeHub.showFooterCta !== false && (
                        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-[10px] font-bold text-white">
                          <Sparkles className="w-3 h-3 text-[#FF4FB0]" />
                          <span>{activeHub.footerCtaLabel || 'Request Proposal'}</span>
                        </div>
                      )}
                      <span className="text-[9px] text-white/60 tracking-wider uppercase">
                        rak4creative.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Library Picker for Gallery Items */}
      <MediaLibraryDialog
        open={galleryLibraryItemIdx !== null}
        onClose={() => setGalleryLibraryItemIdx(null)}
        kind="all"
        onSelect={(url, libItem) => {
          if (galleryLibraryItemIdx === null) return;
          const isVideo =
            libItem?.type === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(String(url));
          updateHubItem(galleryLibraryItemIdx, (it) => ({
            mediaItems: [
              ...(it.mediaItems || []),
              {
                id: `media-${Date.now()}`,
                mediaType: isVideo ? 'video' : 'image',
                url,
                title: (libItem?.name || '').replace(/\.[^.]+$/, '')
              }
            ]
          }));
        }}
      />

      {/* Delete Showcase Confirmation */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        title={`Delete “${activeHub?.title || activeHub?.id}”?`}
        description={`Removes /showcase/${activeHub?.id} from your Showcase Hubs once you publish changes. Uploaded media files in your library will not be deleted.`}
        confirmLabel="Delete showcase"
        tone="danger"
        onConfirm={handleConfirmDeleteShowcase}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  );
}

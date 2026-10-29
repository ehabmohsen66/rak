import React, { useState } from 'react';
import { ExternalLink, Plus, Trash2, RotateCcw, Film, Image as ImageIcon, Sparkles } from 'lucide-react';
import {
  CMS_CARD,
  CMS_INPUT_CLASS,
  CMS_BTN_SECONDARY,
  CMS_BTN_GHOST,
  CMS_ICON_BTN,
  CMS_SUBTLE_PANEL,
  CmsField,
  CmsSectionHeader,
  MediaUploadField,
  ConfirmDialog
} from './cmsTheme';
import { BANNER_PAGES, DEFAULT_BANNERS, applyBannerTokens, normalizeBanner } from '../../lib/banners';
import { RichTitle, BannerMedia } from '../BannerKit';

// What each button does when its link field is left empty.
const DEFAULT_ACTIONS = {
  home: { primary: 'Scrolls to the capabilities section' },
  about: { primary: 'Opens the project planner' },
  services: { primary: 'Opens the project planner', secondary: 'Jumps to the first service pillar' },
  caseStudies: { primary: 'Opens the project planner', secondary: 'Scrolls to the case study list' },
  careers: { primary: 'Scrolls to the open roles' },
  blog: { primary: 'Scrolls to the article list', secondary: 'Scrolls to the article list' },
  contact: { primary: 'Scrolls to the contact form', secondary: 'Opens the project planner' }
};

const CENTERED_PAGES = ['services', 'work', 'caseStudies'];
const UPPERCASE_PAGES = ['services', 'work', 'blog', 'contact'];
const MAX_STATS = 4;

function mediaSummary(banner, page) {
  if (banner.mediaType === 'video' && banner.videoUrl) return { icon: Film, label: 'Video' };
  if (banner.mediaType === 'image' && banner.imageUrl) return { icon: ImageIcon, label: 'Image' };
  if (page.defaultVisual) return { icon: Sparkles, label: 'Built-in' };
  return { icon: ImageIcon, label: 'No media' };
}

function BannerPreview({ banner, page, tokens }) {
  const centered = CENTERED_PAGES.includes(page.id);
  const uppercase = UPPERCASE_PAGES.includes(page.id);
  const title = applyBannerTokens(banner.title, tokens);
  const eyebrow = applyBannerTokens(banner.eyebrow, tokens);
  const subtitle = applyBannerTokens(banner.subtitle, tokens);
  const firstWord = page.fields.includes('rotatingWords')
    ? banner.rotatingWords.find((w) => w.trim())
    : '';
  const usesBuiltIn =
    !(banner.mediaType === 'video' && banner.videoUrl) && !(banner.mediaType === 'image' && banner.imageUrl);

  return (
    <div className="relative aspect-[16/10] sm:aspect-[16/8] w-full rounded-lg overflow-hidden bg-[#07080B] text-white">
      <div className="absolute inset-0">
        <BannerMedia
          banner={banner}
          fallback={
            <div
              className="h-full w-full"
              style={{
                background:
                  'radial-gradient(ellipse at 30% 40%, rgba(236,0,140,0.45), transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(200,0,116,0.25), transparent 55%), #07080B'
              }}
            />
          }
        />
      </div>
      <div
        className={`absolute inset-0 ${
          centered
            ? 'bg-gradient-to-b from-black/50 via-black/10 to-black/70'
            : 'bg-gradient-to-r from-black/70 via-black/30 to-transparent'
        }`}
      />
      {banner.overlay > 0 && <div className="absolute inset-0 bg-black" style={{ opacity: banner.overlay / 100 }} />}

      {usesBuiltIn && page.defaultVisual && (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 h-6 px-2 rounded-md bg-black/60 text-[11px] font-medium text-white/90">
          <Sparkles className="w-3 h-3" aria-hidden="true" />
          {page.defaultVisual}
        </span>
      )}

      <div
        className={`relative h-full flex flex-col justify-end gap-2 p-4 sm:p-6 ${
          centered ? 'items-center text-center justify-center' : 'items-start text-left'
        }`}
      >
        {eyebrow && (
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#FF4FB0]">
            {eyebrow}
          </span>
        )}
        {(title || firstWord) && (
          <p
            className={`cms-preview-heading text-lg sm:text-2xl lg:text-[28px] leading-[1.15] max-w-[85%] ${
              uppercase ? 'uppercase' : ''
            }`}
          >
            <RichTitle text={title} accentClassName="text-[#FF3DA8]" />
            {firstWord && (
              <>
                {title ? ' ' : ''}
                <span className="text-[#FFB347]">{firstWord}</span>
              </>
            )}
          </p>
        )}
        {subtitle && (
          <p className="text-[11px] sm:text-xs text-white/80 max-w-[70%] line-clamp-2 leading-relaxed">{subtitle}</p>
        )}
        {(banner.primaryCtaLabel || banner.secondaryCtaLabel) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {banner.primaryCtaLabel && (
              <span className="inline-flex items-center h-7 px-3 rounded-full bg-[#EC008C] text-[10px] font-bold uppercase tracking-wider">
                {banner.primaryCtaLabel}
              </span>
            )}
            {banner.secondaryCtaLabel && (
              <span className="inline-flex items-center h-7 px-3 rounded-full border border-white/30 bg-black/40 text-[10px] font-bold uppercase tracking-wider">
                {banner.secondaryCtaLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function BannersEditor({ draft, updateDraft, onUploadFile }) {
  const [activeId, setActiveId] = useState('home');
  const [confirmReset, setConfirmReset] = useState(false);

  const page = BANNER_PAGES.find((p) => p.id === activeId) || BANNER_PAGES[0];
  const banner = normalizeBanner(page.id, draft.banners?.[page.id]);
  const tokens = { count: (draft.pillars || []).length };
  const has = (field) => page.fields.includes(field);
  const actions = DEFAULT_ACTIONS[page.id] || {};

  const setField = (key, value) =>
    updateDraft((prev) => {
      const current = normalizeBanner(page.id, prev.banners?.[page.id]);
      return {
        ...prev,
        banners: { ...(prev.banners || {}), [page.id]: { ...current, [key]: value } }
      };
    });

  const setStat = (idx, key, value) => {
    const stats = banner.stats.map((s, i) => (i === idx ? { ...s, [key]: value } : s));
    setField('stats', stats);
  };

  const mediaOptions = [
    ...(page.defaultVisual ? [{ id: 'default', label: 'Built-in', icon: Sparkles }] : []),
    { id: 'video', label: 'Video', icon: Film },
    { id: 'image', label: 'Image', icon: ImageIcon }
  ];
  const activeMedia = mediaOptions.some((o) => o.id === banner.mediaType) ? banner.mediaType : mediaOptions[0].id;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-6">
      {/* Page picker */}
      <nav aria-label="Choose a page banner" className="lg:sticky lg:top-24 lg:self-start">
        <p className="hidden lg:block px-2 pb-2 text-xs font-medium text-slate-500 dark:text-slate-400">Pages</p>
        <ul className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0 -mx-1 px-1">
          {BANNER_PAGES.map((p) => {
            const b = normalizeBanner(p.id, draft.banners?.[p.id]);
            const summary = mediaSummary(b, p);
            const SummaryIcon = summary.icon;
            const selected = p.id === page.id;
            return (
              <li key={p.id} className="shrink-0">
                <button
                  type="button"
                  aria-current={selected ? 'page' : undefined}
                  onClick={() => setActiveId(p.id)}
                  className={`w-full min-h-[44px] flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors cursor-pointer ${
                    selected
                      ? 'bg-white dark:bg-white/[0.08] text-slate-900 dark:text-white font-semibold shadow-sm ring-1 ring-black/[0.06] dark:ring-white/[0.08]'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="whitespace-nowrap">{p.label}</span>
                  <span
                    className="hidden lg:inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400"
                    title={summary.label}
                  >
                    <SummaryIcon className="w-3.5 h-3.5" aria-hidden="true" />
                    {summary.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-6 min-w-0">
        {/* Preview */}
        <section className={`${CMS_CARD} p-4 sm:p-5 space-y-4`}>
          <CmsSectionHeader
            title={`${page.label} banner`}
            description={`Shown at the top of ${page.path === '/' ? 'the home page' : page.path}.`}
            actions={
              <>
                <a
                  href={page.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CMS_BTN_GHOST}
                >
                  <ExternalLink className="w-4 h-4" aria-hidden="true" />
                  <span>View live page</span>
                </a>
                <button type="button" onClick={() => setConfirmReset(true)} className={CMS_BTN_GHOST}>
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              </>
            }
          />
          <BannerPreview banner={banner} page={page} tokens={tokens} />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Approximate preview. Publish, then open the live page to check spacing on desktop and mobile.
          </p>
        </section>

        {/* Copy */}
        <section className={`${CMS_CARD} p-4 sm:p-6 space-y-5`}>
          <CmsSectionHeader title="Text" description="Clear any field to hide it on the site." />

          {has('eyebrow') && (
            <CmsField label="Small label above the headline" htmlFor="banner-eyebrow">
              <input
                id="banner-eyebrow"
                type="text"
                value={banner.eyebrow}
                onChange={(e) => setField('eyebrow', e.target.value)}
                placeholder="Optional"
                className={CMS_INPUT_CLASS}
              />
            </CmsField>
          )}

          <CmsField
            label="Headline"
            htmlFor="banner-title"
            hint={
              <>
                Wrap words in <code className="px-1 rounded bg-slate-100 dark:bg-white/[0.08]">*asterisks*</code> to
                color them magenta. Press Enter for a new line.
                {page.tokens?.includes('{count}') && (
                  <>
                    {' '}
                    <code className="px-1 rounded bg-slate-100 dark:bg-white/[0.08]">{'{count}'}</code> becomes the number
                    of service pillars ({tokens.count}).
                  </>
                )}
              </>
            }
          >
            <textarea
              id="banner-title"
              rows={Math.max(2, banner.title.split('\n').length)}
              value={banner.title}
              onChange={(e) => setField('title', e.target.value)}
              placeholder={page.id === 'about' ? 'Optional: the About video plays without text when empty' : 'Headline'}
              className={`${CMS_INPUT_CLASS} resize-y`}
            />
          </CmsField>

          {has('rotatingWords') && (
            <CmsField
              label="Rotating ending (one per line)"
              htmlFor="banner-rotating"
              hint="These phrases cycle after the headline every few seconds."
            >
              <textarea
                id="banner-rotating"
                rows={4}
                value={banner.rotatingWords.join('\n')}
                onChange={(e) => setField('rotatingWords', e.target.value.split('\n'))}
                className={`${CMS_INPUT_CLASS} resize-y`}
              />
            </CmsField>
          )}

          <CmsField
            label="Supporting text"
            htmlFor="banner-subtitle"
            hint={page.id === 'home' ? 'Leave empty to use the agency description from Brand & story.' : undefined}
          >
            <textarea
              id="banner-subtitle"
              rows={3}
              value={banner.subtitle}
              onChange={(e) => setField('subtitle', e.target.value)}
              placeholder={page.id === 'home' ? (draft.brandInfo?.description || '').slice(0, 120) + '…' : 'Optional'}
              className={`${CMS_INPUT_CLASS} resize-y`}
            />
          </CmsField>
        </section>

        {/* Buttons */}
        {(has('primaryCta') || has('secondaryCta')) && (
          <section className={`${CMS_CARD} p-4 sm:p-6 space-y-5`}>
            <CmsSectionHeader
              title="Buttons"
              description="Leave a label empty to hide that button. Links accept a page path (/contact), a section (#capabilities), or a full URL."
            />
            {[
              has('primaryCta') && { key: 'primary', name: 'Main button' },
              has('secondaryCta') && { key: 'secondary', name: 'Second button' }
            ]
              .filter(Boolean)
              .map((btn) => (
                <div key={btn.key} className={`${CMS_SUBTLE_PANEL} p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3`}>
                  <CmsField label={`${btn.name} label`} htmlFor={`banner-${btn.key}-label`}>
                    <input
                      id={`banner-${btn.key}-label`}
                      type="text"
                      value={banner[`${btn.key}CtaLabel`]}
                      onChange={(e) => setField(`${btn.key}CtaLabel`, e.target.value)}
                      placeholder="Hidden when empty"
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField
                    label={`${btn.name} link`}
                    htmlFor={`banner-${btn.key}-href`}
                    hint={actions[btn.key] ? `Empty: ${actions[btn.key].toLowerCase()}.` : undefined}
                  >
                    <input
                      id={`banner-${btn.key}-href`}
                      type="text"
                      value={banner[`${btn.key}CtaHref`]}
                      onChange={(e) => setField(`${btn.key}CtaHref`, e.target.value)}
                      placeholder="Default action"
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                </div>
              ))}
          </section>
        )}

        {/* Background */}
        <section className={`${CMS_CARD} p-4 sm:p-6 space-y-5`}>
          <CmsSectionHeader
            title="Background"
            description="Videos up to 64MB (MP4 or WebM), images up to 12MB. Short, muted, looping clips work best."
          />

          <div role="radiogroup" aria-label="Background type" className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-white/[0.05]">
            {mediaOptions.map((opt) => {
              const Icon = opt.icon;
              const selected = activeMedia === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setField('mediaType', opt.id)}
                  className={`inline-flex items-center gap-1.5 min-h-[40px] sm:min-h-[32px] px-3 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                    selected
                      ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {opt.label}
                </button>
              );
            })}
          </div>

          {activeMedia === 'default' && (
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Uses the page’s built-in visual: <strong className="font-semibold text-slate-800 dark:text-slate-200">{page.defaultVisual}</strong>.
              Switch to Video or Image to replace it.
            </p>
          )}

          {activeMedia === 'video' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              <MediaUploadField
                id="banner-video"
                label="Video file"
                kind="video"
                accept="video/mp4,video/webm"
                value={banner.videoUrl}
                onUploadFile={onUploadFile}
                onChange={(url) => setField('videoUrl', url)}
                placeholder="/videos/clip.mp4"
              />
              <MediaUploadField
                id="banner-poster"
                label="Poster image (optional)"
                kind="image"
                accept="image/*"
                hint="Shown while the video loads and on slow connections."
                value={banner.imageUrl}
                onUploadFile={onUploadFile}
                onChange={(url) => setField('imageUrl', url)}
                placeholder="/uploads/media/poster.jpg"
              />
            </div>
          )}

          {activeMedia === 'image' && (
            <MediaUploadField
              id="banner-image"
              label="Background image"
              kind="image"
              accept="image/*"
              hint="Use a wide image, at least 1920px across."
              value={banner.imageUrl}
              onUploadFile={onUploadFile}
              onChange={(url) => setField('imageUrl', url)}
              placeholder="/uploads/media/banner.jpg"
            />
          )}

          <CmsField
            label={`Darken background: ${banner.overlay}%`}
            htmlFor="banner-overlay"
            hint="Raise this if the headline is hard to read over a bright video or photo."
          >
            <input
              id="banner-overlay"
              type="range"
              min={0}
              max={90}
              step={5}
              value={banner.overlay}
              onChange={(e) => setField('overlay', Number(e.target.value))}
              className="w-full max-w-sm accent-[#D1007C] cursor-pointer"
            />
          </CmsField>
        </section>

        {/* Stats */}
        {has('stats') && (
          <section className={`${CMS_CARD} p-4 sm:p-6 space-y-4`}>
            <CmsSectionHeader
              title="Highlight figures"
              description="Only publish figures you can back up. Remove all rows to hide this strip."
              actions={
                <button
                  type="button"
                  disabled={banner.stats.length >= MAX_STATS}
                  onClick={() => setField('stats', [...banner.stats, { value: '', label: '', tag: '' }])}
                  className={CMS_BTN_SECONDARY}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add figure</span>
                </button>
              }
            />
            {banner.stats.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 py-2">
                No figures. The strip is hidden on the page.
              </p>
            ) : (
              <ul className="space-y-2">
                {banner.stats.map((stat, idx) => (
                  <li key={idx} className={`${CMS_SUBTLE_PANEL} p-3 flex flex-col sm:flex-row sm:items-end gap-3`}>
                    <CmsField label="Figure" htmlFor={`banner-stat-${idx}-value`} className="sm:w-36">
                      <input
                        id={`banner-stat-${idx}-value`}
                        type="text"
                        value={stat.value}
                        onChange={(e) => setStat(idx, 'value', e.target.value)}
                        className={CMS_INPUT_CLASS}
                      />
                    </CmsField>
                    <CmsField label="Description" htmlFor={`banner-stat-${idx}-label`} className="flex-1">
                      <input
                        id={`banner-stat-${idx}-label`}
                        type="text"
                        value={stat.label}
                        onChange={(e) => setStat(idx, 'label', e.target.value)}
                        className={CMS_INPUT_CLASS}
                      />
                    </CmsField>
                    {page.id === 'caseStudies' && (
                      <CmsField label="Small tag" htmlFor={`banner-stat-${idx}-tag`} className="sm:w-44">
                        <input
                          id={`banner-stat-${idx}-tag`}
                          type="text"
                          value={stat.tag}
                          onChange={(e) => setStat(idx, 'tag', e.target.value)}
                          className={CMS_INPUT_CLASS}
                        />
                      </CmsField>
                    )}
                    <button
                      type="button"
                      aria-label={`Remove figure ${idx + 1}`}
                      onClick={() => setField('stats', banner.stats.filter((_, i) => i !== idx))}
                      className={`${CMS_ICON_BTN} self-end hover:text-rose-600 dark:hover:text-rose-400`}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>

      <ConfirmDialog
        open={confirmReset}
        title={`Reset the ${page.label} banner?`}
        description="Restores the original headline, text, buttons and background for this page in your draft. Nothing goes live until you publish."
        confirmLabel="Reset banner"
        tone="primary"
        onCancel={() => setConfirmReset(false)}
        onConfirm={() => {
          setConfirmReset(false);
          updateDraft((prev) => ({
            ...prev,
            banners: { ...(prev.banners || {}), [page.id]: normalizeBanner(page.id, DEFAULT_BANNERS[page.id]) }
          }));
        }}
      />
    </div>
  );
}

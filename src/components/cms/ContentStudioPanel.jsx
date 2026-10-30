import React, { useState, useEffect } from 'react';
import {
  Save,
  RotateCcw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  Eye,
  Edit3,
  Loader2,
  FileText,
  Layers,
  Briefcase,
  BookOpen,
  Users,
  MapPin,
  Globe,
  PanelsTopLeft,
  LayoutTemplate,
  X
} from 'lucide-react';
import BannersEditor from './BannersEditor';
import { PILLAR_ICON_OPTIONS } from '../../lib/pillarIcons';
import {
  CMS_BTN_PRIMARY,
  CMS_BTN_SECONDARY,
  CMS_BTN_DANGER,
  CMS_BTN_GHOST,
  CMS_CARD,
  CMS_SECTION_TITLE,
  CMS_SUBTLE_PANEL,
  CmsPageHeader,
  CMS_INPUT_CLASS,
  CmsField,
  CmsToggle,
  CmsStatusBadge,
  CmsBanner,
  MediaUploadField,
  ConfirmDialog
} from './cmsTheme';

export const CONTENT_SECTIONS = [
  {
    id: 'banners',
    label: 'Page Banners',
    icon: PanelsTopLeft,
    description: 'Headline, text, buttons and background video or image for the top banner of every page.'
  },
  {
    id: 'home',
    label: 'Home Sections',
    icon: LayoutTemplate,
    description: 'Homepage section headings, "The RAK Squad & Culture" video grid, and "Roots of Inspiration (Beirut)" tribute.'
  },
  {
    id: 'brand',
    label: 'Brand & About Us',
    icon: FileText,
    description: 'About Us page sections ("What Makes Us Different", "What Makes Us… Us.", team video), agency profile, socials, form brackets, stats and client logos.'
  },
  {
    id: 'pillars',
    label: 'Service Pillars',
    icon: Layers,
    description: 'Capability pillars shown on the Home and Services pages.'
  },
  {
    id: 'projects',
    label: 'Portfolio',
    icon: Briefcase,
    description: 'Projects listed on Work and Case Studies, including featured picks for Home.'
  },
  {
    id: 'blog',
    label: 'Blog',
    icon: BookOpen,
    description: 'Articles, covers and reading metadata for the editorial blog.'
  },
  {
    id: 'careers',
    label: 'Careers',
    icon: Users,
    description: 'Careers page copy and open roles that accept applications.'
  },
  {
    id: 'offices',
    label: 'Offices & Testimonials',
    icon: MapPin,
    description: 'Office locations for Contact and client testimonials for Home.'
  },
  {
    id: 'seo',
    label: 'SEO & Metadata',
    icon: Globe,
    description: 'Search titles, descriptions and social sharing image per page.'
  }
];

function slugifyText(value = '') {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || `item-${Date.now()}`;
}

export default function ContentStudioPanel({
  content,
  section = 'banners',
  onSaveContent,
  onResetDefaultContent,
  onUploadFile,
  onDirtyChange = () => {}
}) {
  const [draft, setDraft] = useState(() => JSON.parse(JSON.stringify(content)));
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [confirmResetOpen, setConfirmResetOpen] = useState(false);

  const [selectedPillarIdx, setSelectedPillarIdx] = useState(0);
  const [selectedProjectIdx, setSelectedProjectIdx] = useState(0);
  const [selectedBlogIdx, setSelectedBlogIdx] = useState(0);
  const [blogPreviewMode, setBlogPreviewMode] = useState(false);

  useEffect(() => {
    if (!isDirty) {
      setDraft(JSON.parse(JSON.stringify(content)));
    }
  }, [content, isDirty]);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  // Warn before leaving the browser tab with unpublished edits.
  useEffect(() => {
    if (!isDirty) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // Success notices clear themselves; errors stay until dismissed.
  useEffect(() => {
    if (!notice || notice.tone === 'error') return undefined;
    const timer = setTimeout(() => setNotice(null), 5000);
    return () => clearTimeout(timer);
  }, [notice]);

  const updateDraft = (updater) => {
    setDraft((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
    setIsDirty(true);
  };

  const handlePublish = async () => {
    setSaving(true);
    setNotice(null);
    try {
      const res = await onSaveContent(draft);
      if (res && res.ok) {
        setIsDirty(false);
        setNotice({
          tone: 'success',
          title: 'Website content published',
          message: 'All updated sections are now live across the website.'
        });
      } else {
        setNotice({
          tone: 'error',
          title: 'Failed to publish content',
          message: res?.error || 'Check your admin session or storage folder permissions.'
        });
      }
    } catch {
      setNotice({
        tone: 'error',
        title: 'Network error',
        message: 'Could not reach /api/index.php?route=content.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    setDraft(JSON.parse(JSON.stringify(content)));
    setIsDirty(false);
    setNotice({
      tone: 'info',
      title: 'Unsaved edits discarded',
      message: 'Restored editor fields to the last published version.'
    });
  };

  const handleConfirmReset = async () => {
    setConfirmResetOpen(false);
    setSaving(true);
    setNotice(null);
    try {
      const res = await onResetDefaultContent();
      if (res && res.ok) {
        setIsDirty(false);
        setNotice({
          tone: 'success',
          title: 'Default content restored',
          message: 'Factory content schema has been restored and published.'
        });
      } else {
        setNotice({
          tone: 'error',
          title: 'Restore failed',
          message: res?.error || 'Could not restore default content.'
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rak4creative-cms-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const moveItem = (listKey, index, direction) => {
    const target = index + direction;
    updateDraft((prev) => {
      const arr = [...(prev[listKey] || [])];
      if (target < 0 || target >= arr.length) return prev;
      const temp = arr[index];
      arr[index] = arr[target];
      arr[target] = temp;
      return { ...prev, [listKey]: arr };
    });
  };

  const activePillar = draft.pillars?.[selectedPillarIdx] || draft.pillars?.[0] || null;
  const activeProject = draft.projects?.[selectedProjectIdx] || draft.projects?.[0] || null;
  const activeBlog = draft.blogPosts?.[selectedBlogIdx] || draft.blogPosts?.[0] || null;
  const activeSection = CONTENT_SECTIONS.find((s) => s.id === section) || CONTENT_SECTIONS[0];

  return (
    <div className="space-y-6 pb-4">
      <CmsPageHeader
        eyebrow="Website content"
        title={activeSection.label}
        description={activeSection.description}
        badge={
          isDirty ? (
            <CmsStatusBadge tone="warning">Unpublished changes</CmsStatusBadge>
          ) : (
            <CmsStatusBadge tone="success">Live</CmsStatusBadge>
          )
        }
        actions={
          <>
            <button type="button" onClick={handleExportJson} className={CMS_BTN_GHOST}>
              <Download className="w-4 h-4" aria-hidden="true" />
              <span>Backup</span>
            </button>
            <button type="button" onClick={() => setConfirmResetOpen(true)} className={CMS_BTN_GHOST}>
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Restore defaults</span>
            </button>
            {isDirty && (
              <button
                type="button"
                disabled={saving}
                onClick={handlePublish}
                className={CMS_BTN_PRIMARY}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Save className="w-4 h-4" aria-hidden="true" />
                )}
                <span>{saving ? 'Publishing…' : 'Publish'}</span>
              </button>
            )}
          </>
        }
      />

      {/* 0. PAGE BANNERS */}
      {section === 'banners' && (
        <BannersEditor draft={draft} updateDraft={updateDraft} onUploadFile={onUploadFile} />
      )}

      {/* 0B. HOME SECTIONS */}
      {section === 'home' && (
        <div className="space-y-6">
          {/* Card 1: Homepage Section Headings */}
          <div className={`${CMS_CARD} p-5 sm:p-6 space-y-5`}>
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                Homepage Section Headings
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Eyebrows and section titles for the Client Marquee, Capabilities, Featured Work, Testimonials, and Latest Editorial blocks on `/`.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CmsField label="Client Marquee Heading" htmlFor="hs-marquee-title">
                <input
                  id="hs-marquee-title"
                  type="text"
                  value={draft.homeSections?.marqueeTitle ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), marqueeTitle: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="Client Marquee Subtitle" htmlFor="hs-marquee-sub">
                <input
                  id="hs-marquee-sub"
                  type="text"
                  value={draft.homeSections?.marqueeSubtitle ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), marqueeSubtitle: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>

              <CmsField label="Capabilities Eyebrow" htmlFor="hs-cap-eyebrow">
                <input
                  id="hs-cap-eyebrow"
                  type="text"
                  value={draft.homeSections?.capabilitiesEyebrow ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), capabilitiesEyebrow: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="Capabilities Heading" htmlFor="hs-cap-heading">
                <input
                  id="hs-cap-heading"
                  type="text"
                  value={draft.homeSections?.capabilitiesHeading ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), capabilitiesHeading: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>

              <CmsField label="Featured Work Eyebrow" htmlFor="hs-work-eyebrow">
                <input
                  id="hs-work-eyebrow"
                  type="text"
                  value={draft.homeSections?.workEyebrow ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), workEyebrow: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="Featured Work Heading" htmlFor="hs-work-heading">
                <input
                  id="hs-work-heading"
                  type="text"
                  value={draft.homeSections?.workHeading ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), workHeading: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>

              <CmsField label="Testimonials Eyebrow" htmlFor="hs-test-eyebrow">
                <input
                  id="hs-test-eyebrow"
                  type="text"
                  value={draft.homeSections?.testimonialsEyebrow ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), testimonialsEyebrow: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="Testimonials Heading" htmlFor="hs-test-heading">
                <input
                  id="hs-test-heading"
                  type="text"
                  value={draft.homeSections?.testimonialsHeading ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), testimonialsHeading: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>

              <CmsField label="Blog Insights Eyebrow" htmlFor="hs-blog-eyebrow">
                <input
                  id="hs-blog-eyebrow"
                  type="text"
                  value={draft.homeSections?.blogEyebrow ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), blogEyebrow: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="Blog Insights Heading" htmlFor="hs-blog-heading">
                <input
                  id="hs-blog-heading"
                  type="text"
                  value={draft.homeSections?.blogHeading ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), blogHeading: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
            </div>
          </div>

          {/* Card 2: The RAK Squad & Culture Video Grid */}
          <div className={`${CMS_CARD} p-5 sm:p-6 space-y-5`}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                  “The RAK Squad & Culture” Video Grid ({draft.homeSections?.squadVideos?.length || 0})
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Masonry video showcase on the homepage. Upload MP4/WebM/MOV clips or toggle the entire section on or off.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateDraft((p) => ({
                    ...p,
                    homeSections: {
                      ...(p.homeSections || {}),
                      squadVideos: [
                        ...(p.homeSections?.squadVideos || []),
                        {
                          id: `vid-${Date.now()}`,
                          src: '',
                          title: 'New Studio Reel',
                          category: 'Creative Studio',
                          vibe: 'Bold Energy',
                          caption: 'Behind-the-scenes look at our latest creative production.',
                          aspect: 'aspect-[9/14]'
                        }
                      ]
                    }
                  }))
                }
                className={CMS_BTN_PRIMARY}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Video</span>
              </button>
            </div>

            <CmsToggle
              id="hs-squad-enabled"
              label="Display Squad & Culture Video Grid on Homepage"
              description="Turn off to hide this section from the homepage without deleting your videos."
              checked={draft.homeSections?.squadEnabled !== false}
              onChange={(val) =>
                updateDraft((p) => ({
                  ...p,
                  homeSections: { ...(p.homeSections || {}), squadEnabled: val }
                }))
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CmsField label="Eyebrow Badge" htmlFor="hs-squad-eyebrow">
                <input
                  id="hs-squad-eyebrow"
                  type="text"
                  value={draft.homeSections?.squadEyebrow ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), squadEyebrow: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="Main Heading" htmlFor="hs-squad-heading">
                <input
                  id="hs-squad-heading"
                  type="text"
                  value={draft.homeSections?.squadHeading ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), squadHeading: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="Gradient Highlight Phrase" htmlFor="hs-squad-highlight">
                <input
                  id="hs-squad-highlight"
                  type="text"
                  value={draft.homeSections?.squadHighlight ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), squadHighlight: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
            </div>

            <CmsField label="Section Description" htmlFor="hs-squad-desc">
              <textarea
                id="hs-squad-desc"
                rows={2}
                value={draft.homeSections?.squadDescription ?? ''}
                onChange={(e) =>
                  updateDraft((p) => ({
                    ...p,
                    homeSections: { ...(p.homeSections || {}), squadDescription: e.target.value }
                  }))
                }
                className={CMS_INPUT_CLASS}
              />
            </CmsField>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CmsField label="Culture Pill 1" htmlFor="hs-squad-badge1">
                <input
                  id="hs-squad-badge1"
                  type="text"
                  value={draft.homeSections?.squadBadge1 ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), squadBadge1: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="Culture Pill 2" htmlFor="hs-squad-badge2">
                <input
                  id="hs-squad-badge2"
                  type="text"
                  value={draft.homeSections?.squadBadge2 ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), squadBadge2: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {(draft.homeSections?.squadVideos || []).map((vid, idx) => (
                <div
                  key={vid.id || idx}
                  className="p-4 rounded-xl border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-mono font-bold text-[#C4007A] dark:text-[#FF55B8]">
                      Video #{idx + 1}: {vid.title || 'Untitled'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        aria-label={`Move video ${idx + 1} up`}
                        onClick={() =>
                          updateDraft((p) => {
                            const arr = [...(p.homeSections?.squadVideos || [])];
                            if (idx <= 0) return p;
                            const tmp = arr[idx];
                            arr[idx] = arr[idx - 1];
                            arr[idx - 1] = tmp;
                            return { ...p, homeSections: { ...(p.homeSections || {}), squadVideos: arr } };
                          })
                        }
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === (draft.homeSections?.squadVideos?.length || 1) - 1}
                        aria-label={`Move video ${idx + 1} down`}
                        onClick={() =>
                          updateDraft((p) => {
                            const arr = [...(p.homeSections?.squadVideos || [])];
                            if (idx >= arr.length - 1) return p;
                            const tmp = arr[idx];
                            arr[idx] = arr[idx + 1];
                            arr[idx + 1] = tmp;
                            return { ...p, homeSections: { ...(p.homeSections || {}), squadVideos: arr } };
                          })
                        }
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete video ${vid.title || idx + 1}`}
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            homeSections: {
                              ...(p.homeSections || {}),
                              squadVideos: (p.homeSections?.squadVideos || []).filter((_, i) => i !== idx)
                            }
                          }))
                        }
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <MediaUploadField
                    id={`squad-vid-src-${idx}`}
                    label="Video File (.mp4 / .webm / .mov)"
                    kind="video"
                    accept="video/mp4,video/webm,video/quicktime"
                    uploadLabel="Upload Video"
                    value={vid.src || ''}
                    onUploadFile={onUploadFile}
                    onChange={(url) =>
                      updateDraft((p) => {
                        const squadVideos = [...(p.homeSections?.squadVideos || [])];
                        squadVideos[idx] = { ...squadVideos[idx], src: url };
                        return { ...p, homeSections: { ...(p.homeSections || {}), squadVideos } };
                      })
                    }
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      aria-label={`Video ${idx + 1} title`}
                      value={vid.title || ''}
                      placeholder="Card title"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const squadVideos = [...(p.homeSections?.squadVideos || [])];
                          squadVideos[idx] = { ...squadVideos[idx], title: e.target.value };
                          return { ...p, homeSections: { ...(p.homeSections || {}), squadVideos } };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                    <input
                      type="text"
                      aria-label={`Video ${idx + 1} category`}
                      value={vid.category || ''}
                      placeholder="Top category pill"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const squadVideos = [...(p.homeSections?.squadVideos || [])];
                          squadVideos[idx] = { ...squadVideos[idx], category: e.target.value };
                          return { ...p, homeSections: { ...(p.homeSections || {}), squadVideos } };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                    <input
                      type="text"
                      aria-label={`Video ${idx + 1} vibe tag`}
                      value={vid.vibe || ''}
                      placeholder="Vibe tag (e.g. 4K Storytelling)"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const squadVideos = [...(p.homeSections?.squadVideos || [])];
                          squadVideos[idx] = { ...squadVideos[idx], vibe: e.target.value };
                          return { ...p, homeSections: { ...(p.homeSections || {}), squadVideos } };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                    <select
                      aria-label={`Video ${idx + 1} aspect ratio`}
                      value={vid.aspect || 'aspect-[9/14]'}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const squadVideos = [...(p.homeSections?.squadVideos || [])];
                          squadVideos[idx] = { ...squadVideos[idx], aspect: e.target.value };
                          return { ...p, homeSections: { ...(p.homeSections || {}), squadVideos } };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    >
                      <option value="aspect-[9/14]">Portrait Tall (9:14)</option>
                      <option value="aspect-[9/15]">Vertical Reel (9:15)</option>
                      <option value="aspect-[4/5]">Social Portrait (4:5)</option>
                      <option value="aspect-[1/1]">Square (1:1)</option>
                      <option value="aspect-[16/10]">Widescreen (16:10)</option>
                    </select>
                  </div>

                  <textarea
                    rows={2}
                    aria-label={`Video ${idx + 1} caption`}
                    value={vid.caption || ''}
                    placeholder="Short caption shown on the card and lightbox..."
                    onChange={(e) =>
                      updateDraft((p) => {
                        const squadVideos = [...(p.homeSections?.squadVideos || [])];
                        squadVideos[idx] = { ...squadVideos[idx], caption: e.target.value };
                        return { ...p, homeSections: { ...(p.homeSections || {}), squadVideos } };
                      })
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Roots of Inspiration (Beirut, Lebanon) Tribute */}
          <div className={`${CMS_CARD} p-5 sm:p-6 space-y-5`}>
            <div>
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                “Roots of Inspiration” Tribute Section (Beirut, Lebanon)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Origin story and interactive globe tribute block at the bottom of the homepage.
              </p>
            </div>

            <CmsToggle
              id="hs-tribute-enabled"
              label="Display Roots of Inspiration Tribute on Homepage"
              description="Turn off to hide the Beirut tribute card from the homepage."
              checked={draft.homeSections?.tributeEnabled !== false}
              onChange={(val) =>
                updateDraft((p) => ({
                  ...p,
                  homeSections: { ...(p.homeSections || {}), tributeEnabled: val }
                }))
              }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CmsField label="Eyebrow Label" htmlFor="hs-trib-eyebrow">
                <input
                  id="hs-trib-eyebrow"
                  type="text"
                  value={draft.homeSections?.tributeEyebrow ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), tributeEyebrow: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="Origin Location Label" htmlFor="hs-trib-loc">
                <input
                  id="hs-trib-loc"
                  type="text"
                  value={draft.homeSections?.tributeLocation ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), tributeLocation: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="Headline Line 1" htmlFor="hs-trib-h1">
                <input
                  id="hs-trib-h1"
                  type="text"
                  value={draft.homeSections?.tributeHeadingLine1 ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), tributeHeadingLine1: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="Headline Line 2 (Gradient)" htmlFor="hs-trib-h2">
                <input
                  id="hs-trib-h2"
                  type="text"
                  value={draft.homeSections?.tributeHeadingLine2 ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), tributeHeadingLine2: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
            </div>

            <CmsField label="Editorial Paragraph" htmlFor="hs-trib-body">
              <textarea
                id="hs-trib-body"
                rows={3}
                value={draft.homeSections?.tributeBody ?? ''}
                onChange={(e) =>
                  updateDraft((p) => ({
                    ...p,
                    homeSections: { ...(p.homeSections || {}), tributeBody: e.target.value }
                  }))
                }
                className={CMS_INPUT_CLASS}
              />
            </CmsField>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <CmsField label="Arabic Callout Quote" htmlFor="hs-trib-ar">
                <input
                  id="hs-trib-ar"
                  type="text"
                  dir="rtl"
                  value={draft.homeSections?.tributeArabicQuote ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), tributeArabicQuote: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="Quote Translation / Subtext" htmlFor="hs-trib-sub">
                <input
                  id="hs-trib-sub"
                  type="text"
                  value={draft.homeSections?.tributeQuoteSubtext ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), tributeQuoteSubtext: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
              <CmsField label="CTA Button Label" htmlFor="hs-trib-cta">
                <input
                  id="hs-trib-cta"
                  type="text"
                  value={draft.homeSections?.tributeCtaLabel ?? ''}
                  onChange={(e) =>
                    updateDraft((p) => ({
                      ...p,
                      homeSections: { ...(p.homeSections || {}), tributeCtaLabel: e.target.value }
                    }))
                  }
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>
            </div>
          </div>
        </div>
      )}

      {/* 1. BRAND & ABOUT US */}
      {section === 'brand' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: ABOUT US STORY, WHAT MAKES US DIFFERENT, WHAT WE DO */}
            <div className="lg:col-span-7 space-y-6">
              <div className={`${CMS_CARD} p-5 sm:p-6 space-y-5`}>
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                    About Us: “What Makes Us Different” & “What We Do”
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Top quote card, differentiation block, and capability checklist on the `/about` page.
                  </p>
                </div>

                <CmsField
                  label="Collaboration Quote (Top of About Page)"
                  htmlFor="brand-quote"
                >
                  <input
                    id="brand-quote"
                    type="text"
                    value={draft.brandInfo?.quote || ''}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brandInfo: { ...p.brandInfo, quote: e.target.value }
                      }))
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CmsField label="Section Eyebrow" htmlFor="brand-diff-eyebrow">
                    <input
                      id="brand-diff-eyebrow"
                      type="text"
                      value={draft.brandInfo?.diffEyebrow ?? 'What Makes Us Different'}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          brandInfo: { ...p.brandInfo, diffEyebrow: e.target.value }
                        }))
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="Section Heading" htmlFor="brand-diff-heading">
                    <input
                      id="brand-diff-heading"
                      type="text"
                      value={draft.brandInfo?.diffHeading ?? 'Bold Creativity Meets Tech Magic.'}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          brandInfo: { ...p.brandInfo, diffHeading: e.target.value }
                        }))
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                </div>

                <CmsField label="What Makes Us Different Paragraph" htmlFor="brand-diff">
                  <textarea
                    id="brand-diff"
                    rows={3}
                    value={draft.brandInfo?.differentiation || ''}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brandInfo: { ...p.brandInfo, differentiation: e.target.value }
                      }))
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <CmsField label="What We Do Heading" htmlFor="brand-whatwedo-heading">
                  <input
                    id="brand-whatwedo-heading"
                    type="text"
                    value={draft.brandInfo?.whatWeDoHeading ?? 'What We Do'}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brandInfo: { ...p.brandInfo, whatWeDoHeading: e.target.value }
                      }))
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <CmsField label="What We Do Overview" htmlFor="brand-whatwedo">
                  <textarea
                    id="brand-whatwedo"
                    rows={3}
                    value={draft.brandInfo?.whatWeDo || ''}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brandInfo: { ...p.brandInfo, whatWeDo: e.target.value }
                      }))
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <CmsField
                  label="What We Do Checklist (One Line per Item)"
                  htmlFor="brand-spans"
                >
                  <textarea
                    id="brand-spans"
                    rows={5}
                    value={(draft.brandInfo?.whatWeDoSpans || []).join('\n')}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brandInfo: {
                          ...p.brandInfo,
                          whatWeDoSpans: e.target.value
                            .split('\n')
                            .map((s) => s.trim())
                            .filter(Boolean)
                        }
                      }))
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
              </div>

              {/* ABOUT US: TEAM VIDEO & BOTTOM CTA */}
              <div className={`${CMS_CARD} p-5 sm:p-6 space-y-5`}>
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                    About Us: Team Showcase Video & Bottom CTA
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    The “Behind RAK 4 Creative” video section and bottom call-to-action card on `/about`.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CmsField label="Team Section Eyebrow" htmlFor="brand-team-eyebrow">
                    <input
                      id="brand-team-eyebrow"
                      type="text"
                      value={draft.brandInfo?.teamEyebrow ?? 'Behind RAK 4 Creative'}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          brandInfo: { ...p.brandInfo, teamEyebrow: e.target.value }
                        }))
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="Team Section Heading" htmlFor="brand-team-heading">
                    <input
                      id="brand-team-heading"
                      type="text"
                      value={draft.brandInfo?.teamHeading ?? 'Meet Our Creative & Tech Minds'}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          brandInfo: { ...p.brandInfo, teamHeading: e.target.value }
                        }))
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                </div>

                <CmsField label="Team Section Description" htmlFor="brand-team-desc">
                  <textarea
                    id="brand-team-desc"
                    rows={2}
                    value={
                      draft.brandInfo?.teamDescription ??
                      'Our interdisciplinary team connects strategy, video production, 3D art, and high-speed web tech to elevate your brand.'
                    }
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brandInfo: { ...p.brandInfo, teamDescription: e.target.value }
                      }))
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <MediaUploadField
                  id="brand-team-video"
                  label="Team Showcase Video (.mp4 / .webm)"
                  value={draft.brandInfo?.teamVideo ?? '/videos/RAK4-WebsiteBanner2-211026.mp4'}
                  accept="video/mp4,video/webm,video/quicktime"
                  uploadLabel="Upload Video"
                  onUploadFile={onUploadFile}
                  onChange={(url) =>
                    updateDraft((p) => ({
                      ...p,
                      brandInfo: { ...p.brandInfo, teamVideo: url }
                    }))
                  }
                />

                <MediaUploadField
                  id="brand-team-poster"
                  label="Team Video Poster Image"
                  value={draft.brandInfo?.teamVideoPoster ?? '/videos/banner2-poster.jpg'}
                  onUploadFile={onUploadFile}
                  onChange={(url) =>
                    updateDraft((p) => ({
                      ...p,
                      brandInfo: { ...p.brandInfo, teamVideoPoster: url }
                    }))
                  }
                />

                <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <CmsField label="Bottom CTA Heading" htmlFor="brand-about-cta-heading">
                      <input
                        id="brand-about-cta-heading"
                        type="text"
                        value={
                          draft.brandInfo?.aboutCtaHeading ??
                          'Ready to create something unforgettable together?'
                        }
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            brandInfo: { ...p.brandInfo, aboutCtaHeading: e.target.value }
                          }))
                        }
                        className={CMS_INPUT_CLASS}
                      />
                    </CmsField>
                    <CmsField label="Bottom CTA Button Label" htmlFor="brand-about-cta-btn">
                      <input
                        id="brand-about-cta-btn"
                        type="text"
                        value={draft.brandInfo?.aboutCtaButton ?? 'Start a Project'}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            brandInfo: { ...p.brandInfo, aboutCtaButton: e.target.value }
                          }))
                        }
                        className={CMS_INPUT_CLASS}
                      />
                    </CmsField>
                  </div>

                  <CmsField label="Bottom CTA Supporting Copy" htmlFor="brand-about-cta-body">
                    <textarea
                      id="brand-about-cta-body"
                      rows={2}
                      value={
                        draft.brandInfo?.aboutCtaBody ??
                        "From ground zero to new heights, let's build the online and offline presence that makes a real impact in today's market."
                      }
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          brandInfo: { ...p.brandInfo, aboutCtaBody: e.target.value }
                        }))
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                </div>
              </div>

              {/* GLOBAL AGENCY IDENTITY */}
              <div className={`${CMS_CARD} p-5 sm:p-6 space-y-5`}>
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                    Global Agency Profile
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Agency name, tagline, contact email, and general description used across Home and Footer.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CmsField label="Agency Name" htmlFor="brand-name">
                    <input
                      id="brand-name"
                      type="text"
                      value={draft.brandInfo?.name || ''}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          brandInfo: { ...p.brandInfo, name: e.target.value }
                        }))
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="Tagline" htmlFor="brand-tagline">
                    <input
                      id="brand-tagline"
                      type="text"
                      value={draft.brandInfo?.tagline || ''}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          brandInfo: { ...p.brandInfo, tagline: e.target.value }
                        }))
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                </div>

                <CmsField label="Primary Contact Email" htmlFor="brand-email">
                  <input
                    id="brand-email"
                    type="email"
                    value={draft.brandInfo?.contactEmail || ''}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brandInfo: { ...p.brandInfo, contactEmail: e.target.value }
                      }))
                    }
                    placeholder="hello@yourdomain.com"
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <CmsField
                  label="Footer & Agency Summary Description"
                  htmlFor="brand-description"
                  hint="Displayed in the website footer summary. Edit the Homepage Hero text under Page Banners -> Home."
                >
                  <textarea
                    id="brand-description"
                    rows={3}
                    value={draft.brandInfo?.description || ''}
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brandInfo: { ...p.brandInfo, description: e.target.value }
                      }))
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
              </div>

              {/* SOCIAL MEDIA PROFILES & WHATSAPP */}
              <div className={`${CMS_CARD} p-5 sm:p-6 space-y-5`}>
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                    Social Media Profiles & Direct WhatsApp
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Displayed in the Footer and Contact page. Any field left blank stays hidden on the public website.
                  </p>
                </div>

                <CmsField
                  label="WhatsApp Number or wa.me Link"
                  htmlFor="brand-whatsapp"
                  hint="Enter an international number (e.g. +961 1 380 400) or full https://wa.me/... URL."
                >
                  <input
                    id="brand-whatsapp"
                    type="text"
                    value={draft.brandInfo?.whatsapp || ''}
                    placeholder="+961 1 380 400"
                    onChange={(e) =>
                      updateDraft((p) => ({
                        ...p,
                        brandInfo: { ...p.brandInfo, whatsapp: e.target.value }
                      }))
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'instagram', label: 'Instagram URL', placeholder: 'https://instagram.com/rak4creative' },
                    { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/company/rak4creative' },
                    { key: 'tiktok', label: 'TikTok URL', placeholder: 'https://tiktok.com/@rak4creative' },
                    { key: 'facebook', label: 'Facebook URL', placeholder: 'https://facebook.com/rak4creative' },
                    { key: 'youtube', label: 'YouTube URL', placeholder: 'https://youtube.com/@rak4creative' },
                    { key: 'x', label: 'X (Twitter) URL', placeholder: 'https://x.com/rak4creative' },
                    { key: 'behance', label: 'Behance URL', placeholder: 'https://behance.net/rak4creative' }
                  ].map(({ key, label, placeholder }) => (
                    <CmsField key={key} label={label} htmlFor={`brand-social-${key}`}>
                      <input
                        id={`brand-social-${key}`}
                        type="url"
                        value={draft.brandInfo?.socials?.[key] || ''}
                        placeholder={placeholder}
                        onChange={(e) =>
                          updateDraft((p) => ({
                            ...p,
                            brandInfo: {
                              ...p.brandInfo,
                              socials: {
                                ...(p.brandInfo?.socials || {}),
                                [key]: e.target.value
                              }
                            }
                          }))
                        }
                        className={CMS_INPUT_CLASS}
                      />
                    </CmsField>
                  ))}
                </div>
              </div>

              {/* LEAD FORM BUDGET BRACKETS & TIMELINES */}
              <div className={`${CMS_CARD} p-5 sm:p-6 space-y-5`}>
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                    Lead Form Budget Brackets & Timelines
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                    Options shown on the Contact inquiry form and Interactive Project Planner modal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Budget Brackets ({draft.brandInfo?.budgetOptions?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            brandInfo: {
                              ...p.brandInfo,
                              budgetOptions: [...(p.brandInfo?.budgetOptions || []), 'Custom Scope']
                            }
                          }))
                        }
                        className={CMS_BTN_SECONDARY}
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Add</span>
                      </button>
                    </div>
                    {(draft.brandInfo?.budgetOptions || []).map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          aria-label={`Budget option ${idx + 1}`}
                          value={opt}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const budgetOptions = [...(p.brandInfo?.budgetOptions || [])];
                              budgetOptions[idx] = e.target.value;
                              return { ...p, brandInfo: { ...p.brandInfo, budgetOptions } };
                            })
                          }
                          className={`${CMS_INPUT_CLASS} flex-1`}
                        />
                        <button
                          type="button"
                          disabled={(draft.brandInfo?.budgetOptions || []).length <= 1}
                          aria-label={`Remove budget option ${idx + 1}`}
                          onClick={() =>
                            updateDraft((p) => ({
                              ...p,
                              brandInfo: {
                                ...p.brandInfo,
                                budgetOptions: (p.brandInfo?.budgetOptions || []).filter((_, i) => i !== idx)
                              }
                            }))
                          }
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        Project Timelines ({draft.brandInfo?.timelineOptions?.length || 0})
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            brandInfo: {
                              ...p.brandInfo,
                              timelineOptions: [...(p.brandInfo?.timelineOptions || []), 'Ongoing Retainer']
                            }
                          }))
                        }
                        className={CMS_BTN_SECONDARY}
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Add</span>
                      </button>
                    </div>
                    {(draft.brandInfo?.timelineOptions || []).map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          aria-label={`Timeline option ${idx + 1}`}
                          value={opt}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const timelineOptions = [...(p.brandInfo?.timelineOptions || [])];
                              timelineOptions[idx] = e.target.value;
                              return { ...p, brandInfo: { ...p.brandInfo, timelineOptions } };
                            })
                          }
                          className={`${CMS_INPUT_CLASS} flex-1`}
                        />
                        <button
                          type="button"
                          disabled={(draft.brandInfo?.timelineOptions || []).length <= 1}
                          aria-label={`Remove timeline option ${idx + 1}`}
                          onClick={() =>
                            updateDraft((p) => ({
                              ...p,
                              brandInfo: {
                                ...p.brandInfo,
                                timelineOptions: (p.brandInfo?.timelineOptions || []).filter((_, i) => i !== idx)
                              }
                            }))
                          }
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: WHAT MAKES US... US. + STATS + CLIENT LOGOS */}
            <div className="lg:col-span-5 space-y-6">
              {/* ABOUT US: WHAT MAKES US... US. (CULTURE & VALUES) */}
              <div className={`${CMS_CARD} p-5 sm:p-6 space-y-4`}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                      About Us: “What Makes Us… Us.” ({draft.values?.length || 0})
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      Culture and ethos cards displayed in the “What Makes Us… Us.” grid on `/about`.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateDraft((p) => ({
                        ...p,
                        values: [
                          ...(p.values || []),
                          {
                            name: 'New Principle',
                            description: 'How this principle guides our work.'
                          }
                        ]
                      }))
                    }
                    className={CMS_BTN_SECONDARY}
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    <span>Add Card</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CmsField label="Section Eyebrow" htmlFor="brand-values-eyebrow">
                    <input
                      id="brand-values-eyebrow"
                      type="text"
                      value={draft.brandInfo?.valuesEyebrow ?? 'Our Culture & Ethos'}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          brandInfo: { ...p.brandInfo, valuesEyebrow: e.target.value }
                        }))
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="Section Heading" htmlFor="brand-values-heading">
                    <input
                      id="brand-values-heading"
                      type="text"
                      value={draft.brandInfo?.valuesHeading ?? 'What Makes Us… Us.'}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          brandInfo: { ...p.brandInfo, valuesHeading: e.target.value }
                        }))
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                </div>

                <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
                  {(draft.values || []).map((val, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02] space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-[#C4007A] dark:text-[#FF55B8] w-6 shrink-0">
                          {String(idx + 1).padStart(2, '0')}.
                        </span>
                        <input
                          type="text"
                          aria-label={`What Makes Us card ${idx + 1} title`}
                          value={val.name || ''}
                          placeholder="Card title"
                          onChange={(e) =>
                            updateDraft((p) => {
                              const values = [...(p.values || [])];
                              values[idx] = { ...values[idx], name: e.target.value };
                              return { ...p, values };
                            })
                          }
                          className={`${CMS_INPUT_CLASS} font-semibold flex-1`}
                        />
                        <button
                          type="button"
                          aria-label={`Remove value ${val.name || idx + 1}`}
                          onClick={() =>
                            updateDraft((p) => ({
                              ...p,
                              values: (p.values || []).filter((_, i) => i !== idx)
                            }))
                          }
                          className="min-w-[38px] min-h-[38px] rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        aria-label={`What Makes Us card ${idx + 1} description`}
                        value={val.description || ''}
                        placeholder="Card description"
                        onChange={(e) =>
                          updateDraft((p) => {
                            const values = [...(p.values || [])];
                            values[idx] = { ...values[idx], description: e.target.value };
                            return { ...p, values };
                          })
                        }
                        className={CMS_INPUT_CLASS}
                      />
                    </div>
                  ))}
                </div>
              </div>

            {/* Key Agency Metrics */}
            <div className={`${CMS_CARD} p-5 sm:p-6 space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                  Key Agency Stats ({draft.brandInfo?.stats?.length || 0})
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    updateDraft((p) => ({
                      ...p,
                      brandInfo: {
                        ...p.brandInfo,
                        stats: [
                          ...(p.brandInfo?.stats || []),
                          { value: '100%', label: 'Metric Title', change: 'Supporting Detail' }
                        ]
                      }
                    }))
                  }
                  className={CMS_BTN_SECONDARY}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add Stat</span>
                </button>
              </div>

              <div className="space-y-3">
                {(draft.brandInfo?.stats || []).map((stat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02] space-y-2.5"
                  >
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        aria-label={`Stat ${idx + 1} value`}
                        value={stat.value || ''}
                        placeholder="Value"
                        onChange={(e) =>
                          updateDraft((p) => {
                            const stats = [...(p.brandInfo?.stats || [])];
                            stats[idx] = { ...stats[idx], value: e.target.value };
                            return { ...p, brandInfo: { ...p.brandInfo, stats } };
                          })
                        }
                        className={CMS_INPUT_CLASS}
                      />
                      <input
                        type="text"
                        aria-label={`Stat ${idx + 1} label`}
                        value={stat.label || ''}
                        placeholder="Label"
                        onChange={(e) =>
                          updateDraft((p) => {
                            const stats = [...(p.brandInfo?.stats || [])];
                            stats[idx] = { ...stats[idx], label: e.target.value };
                            return { ...p, brandInfo: { ...p.brandInfo, stats } };
                          })
                        }
                        className={`${CMS_INPUT_CLASS} col-span-2`}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        aria-label={`Stat ${idx + 1} subtitle`}
                        value={stat.change || ''}
                        placeholder="Subtitle"
                        onChange={(e) =>
                          updateDraft((p) => {
                            const stats = [...(p.brandInfo?.stats || [])];
                            stats[idx] = { ...stats[idx], change: e.target.value };
                            return { ...p, brandInfo: { ...p.brandInfo, stats } };
                          })
                        }
                        className={`${CMS_INPUT_CLASS} flex-1`}
                      />
                      <button
                        type="button"
                        aria-label={`Remove stat ${stat.label || idx + 1}`}
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            brandInfo: {
                              ...p.brandInfo,
                              stats: (p.brandInfo?.stats || []).filter((_, i) => i !== idx)
                            }
                          }))
                        }
                        className="min-w-[44px] min-h-[44px] sm:min-w-[38px] sm:min-h-[38px] rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Client Partner Logos */}
            <div className={`${CMS_CARD} p-5 sm:p-6 space-y-4`}>
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                    Client Marquee Logos ({draft.brandInfo?.clients?.length || 0})
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Manage partner logos shown in the homepage marquee scroller.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateDraft((p) => ({
                      ...p,
                      brandInfo: {
                        ...p.brandInfo,
                        clients: [
                          {
                            name: 'New Partner Brand',
                            logo: 'PARTNER',
                            image: '/client-logos/logo_2.webp'
                          },
                          ...(p.brandInfo?.clients || [])
                        ]
                      }
                    }))
                  }
                  className={CMS_BTN_SECONDARY}
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                  <span>Add Logo</span>
                </button>
              </div>

              <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1">
                {(draft.brandInfo?.clients || []).map((client, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02] space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        aria-label={`Client ${idx + 1} name`}
                        value={client.name || ''}
                        placeholder="Partner company name"
                        onChange={(e) =>
                          updateDraft((p) => {
                            const clients = [...(p.brandInfo?.clients || [])];
                            clients[idx] = {
                              ...clients[idx],
                              name: e.target.value,
                              logo: e.target.value.toUpperCase().slice(0, 14)
                            };
                            return { ...p, brandInfo: { ...p.brandInfo, clients } };
                          })
                        }
                        className={`${CMS_INPUT_CLASS} flex-1`}
                      />
                      <button
                        type="button"
                        aria-label={`Delete client logo ${client.name || idx + 1}`}
                        onClick={() =>
                          updateDraft((p) => ({
                            ...p,
                            brandInfo: {
                              ...p.brandInfo,
                              clients: (p.brandInfo?.clients || []).filter((_, i) => i !== idx)
                            }
                          }))
                        }
                        className="min-w-[44px] min-h-[44px] sm:min-w-[38px] sm:min-h-[38px] rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                    <MediaUploadField
                      id={`client-logo-${idx}`}
                      label="Logo Image Path or URL"
                      value={client.image || ''}
                      onUploadFile={onUploadFile}
                      onChange={(url) =>
                        updateDraft((p) => {
                          const clients = [...(p.brandInfo?.clients || [])];
                          clients[idx] = { ...clients[idx], image: url };
                          return { ...p, brandInfo: { ...p.brandInfo, clients } };
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* 2. CORE PILLARS (SERVICES) */}
      {section === 'pillars' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${CMS_CARD} lg:col-span-4 p-4 sm:p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                Agency Pillars ({draft.pillars?.length || 0})
              </h3>
              <button
                type="button"
                onClick={() => {
                  const newPillar = {
                    id: `pillar-${Date.now()}`,
                    title: 'New Capability Pillar',
                    subtitle: 'Short capability summary for navigation and cards',
                    category: 'Strategy',
                    icon: 'Layers',
                    tag: 'Core Service',
                    description: 'Detailed capability overview and client deliverables.',
                    items: ['Strategy Assessment', 'Implementation Roadmap'],
                    featuredImage:
                      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=600&fm=webp&auto=format&fit=crop'
                  };
                  const nextLen = (draft.pillars || []).length;
                  updateDraft((p) => ({ ...p, pillars: [...(p.pillars || []), newPillar] }));
                  setSelectedPillarIdx(nextLen);
                }}
                className={CMS_BTN_PRIMARY}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Pillar</span>
              </button>
            </div>

            {(draft.pillars || []).length === 0 ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 py-6 text-center">
                No service pillars defined yet. Add a pillar to populate the Services menu.
              </p>
            ) : (
              <div className="space-y-2">
                {draft.pillars.map((pillar, idx) => {
                  const selected = idx === selectedPillarIdx;
                  return (
                    <div
                      key={pillar.id || idx}
                      className={`flex items-center justify-between gap-2 p-3 rounded-lg border transition-colors ${
                        selected
                          ? 'border-[#D1007C]/50 dark:border-pink-400/40 bg-pink-50/60 dark:bg-pink-500/[0.08]'
                          : 'border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedPillarIdx(idx)}
                        className="flex-1 text-left min-h-[44px] flex flex-col justify-center cursor-pointer"
                      >
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {pillar.title || 'Untitled Pillar'}
                        </span>
                        <span className="text-xs text-slate-600 dark:text-slate-400">
                          {pillar.category} · {pillar.items?.length || 0} deliverables
                        </span>
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          aria-label={`Move ${pillar.title} up`}
                          disabled={idx === 0}
                          onClick={() => {
                            moveItem('pillars', idx, -1);
                            setSelectedPillarIdx(Math.max(0, idx - 1));
                          }}
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] cursor-pointer"
                        >
                          <ArrowUp className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label={`Move ${pillar.title} down`}
                          disabled={idx === draft.pillars.length - 1}
                          onClick={() => {
                            moveItem('pillars', idx, 1);
                            setSelectedPillarIdx(Math.min(draft.pillars.length - 1, idx + 1));
                          }}
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] cursor-pointer"
                        >
                          <ArrowDown className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className={`${CMS_CARD} lg:col-span-8 p-5 sm:p-6 space-y-5`}>
            {!activePillar ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 py-8 text-center">
                Select or create a service pillar to edit its details.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                    Editing: {activePillar.title}
                  </h3>
                  <button
                    type="button"
                    disabled={draft.pillars.length <= 1}
                    onClick={() => {
                      updateDraft((p) => ({
                        ...p,
                        pillars: p.pillars.filter((_, i) => i !== selectedPillarIdx)
                      }));
                      setSelectedPillarIdx(0);
                    }}
                    className={CMS_BTN_DANGER}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    <span>Delete Pillar</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CmsField label="Pillar Title" htmlFor="pillar-title">
                    <input
                      id="pillar-title"
                      type="text"
                      value={activePillar.title || ''}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const pillars = [...p.pillars];
                          pillars[selectedPillarIdx] = {
                            ...pillars[selectedPillarIdx],
                            title: e.target.value,
                            id: pillars[selectedPillarIdx].id || slugifyText(e.target.value)
                          };
                          return { ...p, pillars };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="URL Anchor / ID" htmlFor="pillar-id">
                    <input
                      id="pillar-id"
                      type="text"
                      value={activePillar.id || ''}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const pillars = [...p.pillars];
                          pillars[selectedPillarIdx] = {
                            ...pillars[selectedPillarIdx],
                            id: slugifyText(e.target.value)
                          };
                          return { ...p, pillars };
                        })
                      }
                      className={`${CMS_INPUT_CLASS} font-mono`}
                    />
                  </CmsField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CmsField label="Category" htmlFor="pillar-category">
                    <input
                      id="pillar-category"
                      type="text"
                      value={activePillar.category || ''}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const pillars = [...p.pillars];
                          pillars[selectedPillarIdx] = {
                            ...pillars[selectedPillarIdx],
                            category: e.target.value
                          };
                          return { ...p, pillars };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="Badge Tag" htmlFor="pillar-tag">
                    <input
                      id="pillar-tag"
                      type="text"
                      value={activePillar.tag || ''}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const pillars = [...p.pillars];
                          pillars[selectedPillarIdx] = {
                            ...pillars[selectedPillarIdx],
                            tag: e.target.value
                          };
                          return { ...p, pillars };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="Icon Name" htmlFor="pillar-icon">
                    <select
                      id="pillar-icon"
                      value={activePillar.icon || 'Layers'}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const pillars = [...p.pillars];
                          pillars[selectedPillarIdx] = {
                            ...pillars[selectedPillarIdx],
                            icon: e.target.value
                          };
                          return { ...p, pillars };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    >
                      {PILLAR_ICON_OPTIONS.map((ic) => (
                        <option key={ic} value={ic}>
                          {ic}
                        </option>
                      ))}
                    </select>
                  </CmsField>
                </div>

                <CmsField label="Short Subtitle (Mega-Menu & Card Summary)" htmlFor="pillar-sub">
                  <input
                    id="pillar-sub"
                    type="text"
                    value={activePillar.subtitle || ''}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const pillars = [...p.pillars];
                        pillars[selectedPillarIdx] = {
                          ...pillars[selectedPillarIdx],
                          subtitle: e.target.value
                        };
                        return { ...p, pillars };
                      })
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <CmsField label="Detailed Description" htmlFor="pillar-desc">
                  <textarea
                    id="pillar-desc"
                    rows={3}
                    value={activePillar.description || ''}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const pillars = [...p.pillars];
                        pillars[selectedPillarIdx] = {
                          ...pillars[selectedPillarIdx],
                          description: e.target.value
                        };
                        return { ...p, pillars };
                      })
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <MediaUploadField
                  id="pillar-image"
                  label="Featured Image"
                  value={activePillar.featuredImage || ''}
                  onUploadFile={onUploadFile}
                  onChange={(url) =>
                    updateDraft((p) => {
                      const pillars = [...p.pillars];
                      pillars[selectedPillarIdx] = {
                        ...pillars[selectedPillarIdx],
                        featuredImage: url
                      };
                      return { ...p, pillars };
                    })
                  }
                />

                <CmsField
                  label="Deliverables & Capabilities (One per Line)"
                  htmlFor="pillar-items"
                >
                  <textarea
                    id="pillar-items"
                    rows={6}
                    value={(activePillar.items || []).join('\n')}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const pillars = [...p.pillars];
                        pillars[selectedPillarIdx] = {
                          ...pillars[selectedPillarIdx],
                          items: e.target.value
                            .split('\n')
                            .map((s) => s.trim())
                            .filter(Boolean)
                        };
                        return { ...p, pillars };
                      })
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3. PORTFOLIO & CASE STUDIES */}
      {section === 'projects' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${CMS_CARD} lg:col-span-4 p-4 sm:p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                Case Studies ({draft.projects?.length || 0})
              </h3>
              <button
                type="button"
                onClick={() => {
                  const newProj = {
                    id: `project-${Date.now()}`,
                    title: 'New Client Engagement',
                    client: 'Client Organization',
                    industry: 'Enterprise Sector',
                    category: 'Branding & Web',
                    year: String(new Date().getFullYear()),
                    summary: 'Executive overview of the project scope and business impact.',
                    challenge: 'Core market or technical problem addressed by RAK4Creative.',
                    solution: 'Strategic architecture, creative execution, and deployment approach.',
                    results: [
                      { metric: '+150%', label: 'Qualified Leads' },
                      { metric: '2.4x', label: 'Conversion Lift' },
                      { metric: '99.9%', label: 'Platform Uptime' }
                    ],
                    image:
                      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&fm=webp&auto=format&fit=crop',
                    tags: ['Brand Strategy', 'Web Architecture'],
                    featured: true
                  };
                  const nextIdx = (draft.projects || []).length;
                  updateDraft((p) => ({ ...p, projects: [...(p.projects || []), newProj] }));
                  setSelectedProjectIdx(nextIdx);
                }}
                className={CMS_BTN_PRIMARY}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-2">
              {(draft.projects || []).map((proj, idx) => {
                const selected = idx === selectedProjectIdx;
                return (
                  <div
                    key={proj.id || idx}
                    className={`flex items-center justify-between gap-2 p-3 rounded-lg border transition-colors ${
                      selected
                        ? 'border-[#D1007C]/50 dark:border-pink-400/40 bg-pink-50/60 dark:bg-pink-500/[0.08]'
                        : 'border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedProjectIdx(idx)}
                      className="flex-1 text-left min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {proj.title}
                        </span>
                        {proj.featured && <CmsStatusBadge tone="brand">Featured</CmsStatusBadge>}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 truncate">
                        {proj.client} · {proj.category} ({proj.year})
                      </p>
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        aria-label={`Move ${proj.title} up`}
                        disabled={idx === 0}
                        onClick={() => {
                          moveItem('projects', idx, -1);
                          setSelectedProjectIdx(Math.max(0, idx - 1));
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Move ${proj.title} down`}
                        disabled={idx === (draft.projects?.length || 1) - 1}
                        onClick={() => {
                          moveItem('projects', idx, 1);
                          setSelectedProjectIdx(Math.min((draft.projects?.length || 1) - 1, idx + 1));
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${CMS_CARD} lg:col-span-8 p-5 sm:p-6 space-y-5`}>
            {!activeProject ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 py-8 text-center">
                Select or add a project to edit its case study.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                    Editing: {activeProject.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      updateDraft((p) => ({
                        ...p,
                        projects: p.projects.filter((_, i) => i !== selectedProjectIdx)
                      }));
                      setSelectedProjectIdx(0);
                    }}
                    className={CMS_BTN_DANGER}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    <span>Delete Project</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CmsField label="Project Title" htmlFor="proj-title">
                    <input
                      id="proj-title"
                      type="text"
                      value={activeProject.title || ''}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const projects = [...p.projects];
                          projects[selectedProjectIdx] = {
                            ...projects[selectedProjectIdx],
                            title: e.target.value
                          };
                          return { ...p, projects };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="Client Name" htmlFor="proj-client">
                    <input
                      id="proj-client"
                      type="text"
                      value={activeProject.client || ''}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const projects = [...p.projects];
                          projects[selectedProjectIdx] = {
                            ...projects[selectedProjectIdx],
                            client: e.target.value
                          };
                          return { ...p, projects };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CmsField label="Industry" htmlFor="proj-industry">
                    <input
                      id="proj-industry"
                      type="text"
                      value={activeProject.industry || ''}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const projects = [...p.projects];
                          projects[selectedProjectIdx] = {
                            ...projects[selectedProjectIdx],
                            industry: e.target.value
                          };
                          return { ...p, projects };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="Filter Category" htmlFor="proj-category">
                    <input
                      id="proj-category"
                      type="text"
                      value={activeProject.category || ''}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const projects = [...p.projects];
                          projects[selectedProjectIdx] = {
                            ...projects[selectedProjectIdx],
                            category: e.target.value
                          };
                          return { ...p, projects };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="Year" htmlFor="proj-year">
                    <input
                      id="proj-year"
                      type="text"
                      value={activeProject.year || ''}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const projects = [...p.projects];
                          projects[selectedProjectIdx] = {
                            ...projects[selectedProjectIdx],
                            year: e.target.value
                          };
                          return { ...p, projects };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                </div>

                <CmsToggle
                  id="proj-featured"
                  label="Feature on Homepage Portfolio Grid"
                  description="Featured projects appear on the homepage creations showcase as well as the Work & Case Studies pages."
                  checked={Boolean(activeProject.featured)}
                  onChange={(val) =>
                    updateDraft((p) => {
                      const projects = [...p.projects];
                      projects[selectedProjectIdx] = {
                        ...projects[selectedProjectIdx],
                        featured: val
                      };
                      return { ...p, projects };
                    })
                  }
                />

                <MediaUploadField
                  id="proj-image"
                  label="Cover Visual"
                  value={activeProject.image || ''}
                  onUploadFile={onUploadFile}
                  onChange={(url) =>
                    updateDraft((p) => {
                      const projects = [...p.projects];
                      projects[selectedProjectIdx] = {
                        ...projects[selectedProjectIdx],
                        image: url
                      };
                      return { ...p, projects };
                    })
                  }
                />

                <CmsField label="Executive Summary" htmlFor="proj-summary">
                  <textarea
                    id="proj-summary"
                    rows={2}
                    value={activeProject.summary || ''}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const projects = [...p.projects];
                        projects[selectedProjectIdx] = {
                          ...projects[selectedProjectIdx],
                          summary: e.target.value
                        };
                        return { ...p, projects };
                      })
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CmsField label="The Challenge" htmlFor="proj-challenge">
                    <textarea
                      id="proj-challenge"
                      rows={3}
                      value={activeProject.challenge || ''}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const projects = [...p.projects];
                          projects[selectedProjectIdx] = {
                            ...projects[selectedProjectIdx],
                            challenge: e.target.value
                          };
                          return { ...p, projects };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="The Solution" htmlFor="proj-solution">
                    <textarea
                      id="proj-solution"
                      rows={3}
                      value={activeProject.solution || ''}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const projects = [...p.projects];
                          projects[selectedProjectIdx] = {
                            ...projects[selectedProjectIdx],
                            solution: e.target.value
                          };
                          return { ...p, projects };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      Measured Results (Metric & Outcome Pairs)
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateDraft((p) => {
                          const projects = [...p.projects];
                          const results = [
                            ...(projects[selectedProjectIdx].results || []),
                            { metric: '+100%', label: 'Key Business Impact' }
                          ];
                          projects[selectedProjectIdx] = {
                            ...projects[selectedProjectIdx],
                            results
                          };
                          return { ...p, projects };
                        })
                      }
                      className={CMS_BTN_SECONDARY}
                    >
                      <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Add Metric</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(activeProject.results || []).map((resItem, rIdx) => (
                      <div
                        key={rIdx}
                        className="p-3 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02] space-y-2"
                      >
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            aria-label={`Result ${rIdx + 1} metric`}
                            value={resItem.metric || ''}
                            placeholder="+200%"
                            onChange={(e) =>
                              updateDraft((p) => {
                                const projects = [...p.projects];
                                const results = [...(projects[selectedProjectIdx].results || [])];
                                results[rIdx] = { ...results[rIdx], metric: e.target.value };
                                projects[selectedProjectIdx] = {
                                  ...projects[selectedProjectIdx],
                                  results
                                };
                                return { ...p, projects };
                              })
                            }
                            className={`${CMS_INPUT_CLASS} flex-1`}
                          />
                          <button
                            type="button"
                            aria-label={`Remove metric ${rIdx + 1}`}
                            onClick={() =>
                              updateDraft((p) => {
                                const projects = [...p.projects];
                                const results = (projects[selectedProjectIdx].results || []).filter(
                                  (_, i) => i !== rIdx
                                );
                                projects[selectedProjectIdx] = {
                                  ...projects[selectedProjectIdx],
                                  results
                                };
                                return { ...p, projects };
                              })
                            }
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-rose-600 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </button>
                        </div>
                        <input
                          type="text"
                          aria-label={`Result ${rIdx + 1} label`}
                          value={resItem.label || ''}
                          placeholder="Outcome label"
                          onChange={(e) =>
                            updateDraft((p) => {
                              const projects = [...p.projects];
                              const results = [...(projects[selectedProjectIdx].results || [])];
                              results[rIdx] = { ...results[rIdx], label: e.target.value };
                              projects[selectedProjectIdx] = {
                                ...projects[selectedProjectIdx],
                                results
                              };
                              return { ...p, projects };
                            })
                          }
                          className={CMS_INPUT_CLASS}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <CmsField label="Capability Tags (Comma Separated)" htmlFor="proj-tags">
                  <input
                    id="proj-tags"
                    type="text"
                    value={(activeProject.tags || []).join(', ')}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const projects = [...p.projects];
                        projects[selectedProjectIdx] = {
                          ...projects[selectedProjectIdx],
                          tags: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean)
                        };
                        return { ...p, projects };
                      })
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
              </>
            )}
          </div>
        </div>
      )}

      {/* 4. EDITORIAL BLOG */}
      {section === 'blog' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${CMS_CARD} lg:col-span-4 p-4 sm:p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                Articles ({draft.blogPosts?.length || 0})
              </h3>
              <button
                type="button"
                onClick={() => {
                  const newPost = {
                    id: `editorial-${Date.now()}`,
                    title: 'New Editorial Article',
                    subtitle: 'Key strategic takeaway for agency and brand leaders.',
                    category: 'Digital Strategy',
                    date: new Date().toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    }),
                    readTime: '4 min read',
                    author: 'RAK4Creative Strategy Team',
                    image:
                      'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&fm=webp&auto=format&fit=crop',
                    featured: false,
                    excerpt: 'Concise summary displayed on blog cards and article previews.',
                    content:
                      'Write your editorial insight here.\n\n### Section Heading\n- **Key Point**: Concrete analysis and practical takeaway.'
                  };
                  updateDraft((p) => ({
                    ...p,
                    blogPosts: [newPost, ...(p.blogPosts || [])]
                  }));
                  setSelectedBlogIdx(0);
                }}
                className={CMS_BTN_PRIMARY}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>New Article</span>
              </button>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
              {(draft.blogPosts || []).map((post, idx) => {
                const selected = idx === selectedBlogIdx;
                return (
                  <div
                    key={post.id || idx}
                    className={`flex items-center justify-between gap-2 p-3 rounded-lg border transition-colors ${
                      selected
                        ? 'border-[#D1007C]/50 dark:border-pink-400/40 bg-pink-50/60 dark:bg-pink-500/[0.08]'
                        : 'border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02]'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedBlogIdx(idx)}
                      className="flex-1 text-left min-w-0 cursor-pointer"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {post.title}
                        </span>
                        {post.featured && <CmsStatusBadge tone="brand">Lead</CmsStatusBadge>}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">
                        {post.category} · {post.date}
                      </p>
                    </button>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        aria-label={`Move ${post.title} up`}
                        disabled={idx === 0}
                        onClick={() => {
                          moveItem('blogPosts', idx, -1);
                          setSelectedBlogIdx(Math.max(0, idx - 1));
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Move ${post.title} down`}
                        disabled={idx === (draft.blogPosts?.length || 1) - 1}
                        onClick={() => {
                          moveItem('blogPosts', idx, 1);
                          setSelectedBlogIdx(Math.min((draft.blogPosts?.length || 1) - 1, idx + 1));
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`${CMS_CARD} lg:col-span-8 p-5 sm:p-6 space-y-5`}>
            {!activeBlog ? (
              <p className="text-sm text-slate-600 dark:text-slate-400 py-8 text-center">
                Select or create an editorial article to edit.
              </p>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                    Editing Article
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBlogPreviewMode(!blogPreviewMode)}
                      className={CMS_BTN_SECONDARY}
                    >
                      {blogPreviewMode ? (
                        <Edit3 className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                      <span>{blogPreviewMode ? 'Back to Editor' : 'Preview Article'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        updateDraft((p) => ({
                          ...p,
                          blogPosts: p.blogPosts.filter((_, i) => i !== selectedBlogIdx)
                        }));
                        setSelectedBlogIdx(0);
                      }}
                      className={CMS_BTN_DANGER}
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {blogPreviewMode ? (
                  <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-[#0E0E11] space-y-4">
                    <CmsStatusBadge tone="brand">{activeBlog.category}</CmsStatusBadge>
                    <h4 className="text-xl font-semibold text-slate-900 dark:text-white">
                      {activeBlog.title}
                    </h4>
                    {activeBlog.subtitle && (
                      <p className="text-base text-slate-600 dark:text-slate-300">
                        {activeBlog.subtitle}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      By {activeBlog.author} · {activeBlog.date} · {activeBlog.readTime} · URL:{' '}
                      <code className="font-mono">/blog/{activeBlog.id}</code>
                    </p>
                    <div className="border-t border-slate-200 dark:border-white/[0.07] pt-4 space-y-3 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                      {activeBlog.content}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CmsField label="Article Headline" htmlFor="blog-title">
                        <input
                          id="blog-title"
                          type="text"
                          value={activeBlog.title || ''}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const blogPosts = [...p.blogPosts];
                              blogPosts[selectedBlogIdx] = {
                                ...blogPosts[selectedBlogIdx],
                                title: e.target.value
                              };
                              return { ...p, blogPosts };
                            })
                          }
                          className={CMS_INPUT_CLASS}
                        />
                      </CmsField>
                      <CmsField label="URL Slug (/blog/<slug>)" htmlFor="blog-slug">
                        <input
                          id="blog-slug"
                          type="text"
                          value={activeBlog.id || ''}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const blogPosts = [...p.blogPosts];
                              blogPosts[selectedBlogIdx] = {
                                ...blogPosts[selectedBlogIdx],
                                id: slugifyText(e.target.value)
                              };
                              return { ...p, blogPosts };
                            })
                          }
                          className={`${CMS_INPUT_CLASS} font-mono`}
                        />
                      </CmsField>
                    </div>

                    <CmsField label="Subtitle" htmlFor="blog-subtitle">
                      <input
                        id="blog-subtitle"
                        type="text"
                        value={activeBlog.subtitle || ''}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const blogPosts = [...p.blogPosts];
                            blogPosts[selectedBlogIdx] = {
                              ...blogPosts[selectedBlogIdx],
                              subtitle: e.target.value
                            };
                            return { ...p, blogPosts };
                          })
                        }
                        className={CMS_INPUT_CLASS}
                      />
                    </CmsField>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                      <CmsField label="Category" htmlFor="blog-cat">
                        <input
                          id="blog-cat"
                          type="text"
                          value={activeBlog.category || ''}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const blogPosts = [...p.blogPosts];
                              blogPosts[selectedBlogIdx] = {
                                ...blogPosts[selectedBlogIdx],
                                category: e.target.value
                              };
                              return { ...p, blogPosts };
                            })
                          }
                          className={CMS_INPUT_CLASS}
                        />
                      </CmsField>
                      <CmsField label="Publish Date" htmlFor="blog-date">
                        <input
                          id="blog-date"
                          type="text"
                          value={activeBlog.date || ''}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const blogPosts = [...p.blogPosts];
                              blogPosts[selectedBlogIdx] = {
                                ...blogPosts[selectedBlogIdx],
                                date: e.target.value
                              };
                              return { ...p, blogPosts };
                            })
                          }
                          className={CMS_INPUT_CLASS}
                        />
                      </CmsField>
                      <CmsField label="Read Time" htmlFor="blog-read">
                        <input
                          id="blog-read"
                          type="text"
                          value={activeBlog.readTime || ''}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const blogPosts = [...p.blogPosts];
                              blogPosts[selectedBlogIdx] = {
                                ...blogPosts[selectedBlogIdx],
                                readTime: e.target.value
                              };
                              return { ...p, blogPosts };
                            })
                          }
                          className={CMS_INPUT_CLASS}
                        />
                      </CmsField>
                      <CmsField label="Author" htmlFor="blog-author">
                        <input
                          id="blog-author"
                          type="text"
                          value={activeBlog.author || ''}
                          onChange={(e) =>
                            updateDraft((p) => {
                              const blogPosts = [...p.blogPosts];
                              blogPosts[selectedBlogIdx] = {
                                ...blogPosts[selectedBlogIdx],
                                author: e.target.value
                              };
                              return { ...p, blogPosts };
                            })
                          }
                          className={CMS_INPUT_CLASS}
                        />
                      </CmsField>
                    </div>

                    <CmsToggle
                      id="blog-featured"
                      label="Feature as Lead Editorial Story"
                      description="Highlights this article at the top of the Blog index."
                      checked={Boolean(activeBlog.featured)}
                      onChange={(val) =>
                        updateDraft((p) => {
                          const blogPosts = [...p.blogPosts];
                          blogPosts[selectedBlogIdx] = {
                            ...blogPosts[selectedBlogIdx],
                            featured: val
                          };
                          return { ...p, blogPosts };
                        })
                      }
                    />

                    <MediaUploadField
                      id="blog-image"
                      label="Cover Image"
                      value={activeBlog.image || ''}
                      onUploadFile={onUploadFile}
                      onChange={(url) =>
                        updateDraft((p) => {
                          const blogPosts = [...p.blogPosts];
                          blogPosts[selectedBlogIdx] = {
                            ...blogPosts[selectedBlogIdx],
                            image: url
                          };
                          return { ...p, blogPosts };
                        })
                      }
                    />

                    <CmsField label="Card Excerpt" htmlFor="blog-excerpt">
                      <textarea
                        id="blog-excerpt"
                        rows={2}
                        value={activeBlog.excerpt || ''}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const blogPosts = [...p.blogPosts];
                            blogPosts[selectedBlogIdx] = {
                              ...blogPosts[selectedBlogIdx],
                              excerpt: e.target.value
                            };
                            return { ...p, blogPosts };
                          })
                        }
                        className={CMS_INPUT_CLASS}
                      />
                    </CmsField>

                    <CmsField
                      label="Article Body (Supports ### Headings, - Bullet Lists, and **Bold** Text)"
                      htmlFor="blog-body"
                    >
                      <textarea
                        id="blog-body"
                        rows={14}
                        value={activeBlog.content || ''}
                        onChange={(e) =>
                          updateDraft((p) => {
                            const blogPosts = [...p.blogPosts];
                            blogPosts[selectedBlogIdx] = {
                              ...blogPosts[selectedBlogIdx],
                              content: e.target.value
                            };
                            return { ...p, blogPosts };
                          })
                        }
                        className={`${CMS_INPUT_CLASS} font-mono leading-relaxed`}
                      />
                    </CmsField>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* 5. CAREERS & OPEN ROLES */}
      {section === 'careers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${CMS_CARD} lg:col-span-5 p-5 sm:p-6 space-y-4`}>
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
              Careers Page Narrative
            </h3>
            <CmsField label="Page Headline" htmlFor="careers-title">
              <input
                id="careers-title"
                type="text"
                value={draft.careersCopy?.title || ''}
                onChange={(e) =>
                  updateDraft((p) => ({
                    ...p,
                    careersCopy: { ...p.careersCopy, title: e.target.value }
                  }))
                }
                className={CMS_INPUT_CLASS}
              />
            </CmsField>
            <CmsField label="Subheadline" htmlFor="careers-sub">
              <input
                id="careers-sub"
                type="text"
                value={draft.careersCopy?.subtitle || ''}
                onChange={(e) =>
                  updateDraft((p) => ({
                    ...p,
                    careersCopy: { ...p.careersCopy, subtitle: e.target.value }
                  }))
                }
                className={CMS_INPUT_CLASS}
              />
            </CmsField>
            <CmsField label="Culture Overview" htmlFor="careers-body">
              <textarea
                id="careers-body"
                rows={5}
                value={draft.careersCopy?.body || ''}
                onChange={(e) =>
                  updateDraft((p) => ({
                    ...p,
                    careersCopy: { ...p.careersCopy, body: e.target.value }
                  }))
                }
                className={CMS_INPUT_CLASS}
              />
            </CmsField>
            <CmsField label="CTA Section Heading" htmlFor="careers-cta">
              <input
                id="careers-cta"
                type="text"
                value={draft.careersCopy?.cta || ''}
                onChange={(e) =>
                  updateDraft((p) => ({
                    ...p,
                    careersCopy: { ...p.careersCopy, cta: e.target.value }
                  }))
                }
                className={CMS_INPUT_CLASS}
              />
            </CmsField>
          </div>

          <div className={`${CMS_CARD} lg:col-span-7 p-5 sm:p-6 space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                  Open Job Postings ({draft.openRoles?.length || 0})
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Toggle roles active/inactive or add new positions connected directly to the Career Application intake modal.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateDraft((p) => ({
                    ...p,
                    openRoles: [
                      {
                        id: `role-${Date.now()}`,
                        title: 'New Open Role',
                        department: 'Creative & Strategy',
                        location: 'Beirut / Remote',
                        type: 'Full-Time',
                        salary: 'Competitive + Performance Bonus',
                        description: 'Role responsibilities and candidate expectations.',
                        active: true
                      },
                      ...(p.openRoles || [])
                    ]
                  }))
                }
                className={CMS_BTN_PRIMARY}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Job Role</span>
              </button>
            </div>

            {(draft.openRoles || []).length === 0 ? (
              <div className="p-8 rounded-lg border border-dashed border-slate-300 dark:border-white/[0.12] text-center text-sm text-slate-600 dark:text-slate-400">
                No job postings listed. Visitors can still submit an Open Talent Application on the Careers page.
              </div>
            ) : (
              <div className="space-y-4">
                {draft.openRoles.map((role, idx) => (
                  <div
                    key={role.id || idx}
                    className="p-4 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02] space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {role.active !== false ? (
                          <CmsStatusBadge tone="success">Published</CmsStatusBadge>
                        ) : (
                          <CmsStatusBadge tone="neutral">Paused</CmsStatusBadge>
                        )}
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          {role.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateDraft((p) => {
                              const openRoles = [...p.openRoles];
                              openRoles[idx] = {
                                ...openRoles[idx],
                                active: openRoles[idx].active === false
                              };
                              return { ...p, openRoles };
                            })
                          }
                          className={CMS_BTN_SECONDARY}
                        >
                          {role.active !== false ? 'Pause Role' : 'Activate Role'}
                        </button>
                        <button
                          type="button"
                          aria-label={`Delete role ${role.title}`}
                          onClick={() =>
                            updateDraft((p) => ({
                              ...p,
                              openRoles: p.openRoles.filter((_, i) => i !== idx)
                            }))
                          }
                          className={CMS_BTN_DANGER}
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        aria-label={`Role ${idx + 1} title`}
                        value={role.title || ''}
                        placeholder="Role title"
                        onChange={(e) =>
                          updateDraft((p) => {
                            const openRoles = [...p.openRoles];
                            openRoles[idx] = { ...openRoles[idx], title: e.target.value };
                            return { ...p, openRoles };
                          })
                        }
                        className={CMS_INPUT_CLASS}
                      />
                      <input
                        type="text"
                        aria-label={`Role ${idx + 1} department`}
                        value={role.department || ''}
                        placeholder="Department"
                        onChange={(e) =>
                          updateDraft((p) => {
                            const openRoles = [...p.openRoles];
                            openRoles[idx] = { ...openRoles[idx], department: e.target.value };
                            return { ...p, openRoles };
                          })
                        }
                        className={CMS_INPUT_CLASS}
                      />
                      <input
                        type="text"
                        aria-label={`Role ${idx + 1} location`}
                        value={role.location || ''}
                        placeholder="Location"
                        onChange={(e) =>
                          updateDraft((p) => {
                            const openRoles = [...p.openRoles];
                            openRoles[idx] = { ...openRoles[idx], location: e.target.value };
                            return { ...p, openRoles };
                          })
                        }
                        className={CMS_INPUT_CLASS}
                      />
                      <input
                        type="text"
                        aria-label={`Role ${idx + 1} employment type`}
                        value={role.type || ''}
                        placeholder="Employment type"
                        onChange={(e) =>
                          updateDraft((p) => {
                            const openRoles = [...p.openRoles];
                            openRoles[idx] = { ...openRoles[idx], type: e.target.value };
                            return { ...p, openRoles };
                          })
                        }
                        className={CMS_INPUT_CLASS}
                      />
                    </div>

                    <input
                      type="text"
                      aria-label={`Role ${idx + 1} salary or compensation`}
                      value={role.salary || ''}
                      placeholder="Compensation (e.g. Competitive + Performance Bonus)"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const openRoles = [...p.openRoles];
                          openRoles[idx] = { ...openRoles[idx], salary: e.target.value };
                          return { ...p, openRoles };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />

                    <textarea
                      rows={2}
                      aria-label={`Role ${idx + 1} description`}
                      value={role.description || ''}
                      placeholder="Role summary"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const openRoles = [...p.openRoles];
                          openRoles[idx] = { ...openRoles[idx], description: e.target.value };
                          return { ...p, openRoles };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. OFFICES, TESTIMONIALS & VALUES */}
      {section === 'offices' && (
        <div className="space-y-6">
          {/* Global Offices */}
          <div className={`${CMS_CARD} p-5 sm:p-6 space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                  Global Offices ({draft.offices?.length || 0})
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Displayed on the Contact page, About page, and website footer.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateDraft((p) => ({
                    ...p,
                    offices: [
                      ...(p.offices || []),
                      {
                        city: 'New City',
                        country: 'Country',
                        address: 'Street Address & Suite',
                        email: 'office@rak4creative.com',
                        phone: '+1 000 000 0000',
                        status: 'Regional Office',
                        timezone: 'GMT'
                      }
                    ]
                  }))
                }
                className={CMS_BTN_SECONDARY}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Office</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(draft.offices || []).map((office, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {office.city}, {office.country}
                    </span>
                    <button
                      type="button"
                      aria-label={`Delete office ${office.city}`}
                      onClick={() =>
                        updateDraft((p) => ({
                          ...p,
                          offices: p.offices.filter((_, i) => i !== idx)
                        }))
                      }
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#BE123C] dark:text-[#FDA4AF] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <input
                      type="text"
                      aria-label="Office city"
                      value={office.city || ''}
                      placeholder="City"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const offices = [...p.offices];
                          offices[idx] = { ...offices[idx], city: e.target.value };
                          return { ...p, offices };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                    <input
                      type="text"
                      aria-label="Office country"
                      value={office.country || ''}
                      placeholder="Country"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const offices = [...p.offices];
                          offices[idx] = { ...offices[idx], country: e.target.value };
                          return { ...p, offices };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                    <input
                      type="text"
                      aria-label="Office status"
                      value={office.status || ''}
                      placeholder="Office designation"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const offices = [...p.offices];
                          offices[idx] = { ...offices[idx], status: e.target.value };
                          return { ...p, offices };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                    <input
                      type="text"
                      aria-label="Office timezone"
                      value={office.timezone || ''}
                      placeholder="Timezone"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const offices = [...p.offices];
                          offices[idx] = { ...offices[idx], timezone: e.target.value };
                          return { ...p, offices };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                    <input
                      type="email"
                      aria-label="Office email"
                      value={office.email || ''}
                      placeholder="Email"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const offices = [...p.offices];
                          offices[idx] = { ...offices[idx], email: e.target.value };
                          return { ...p, offices };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                    <input
                      type="text"
                      aria-label="Office phone"
                      value={office.phone || ''}
                      placeholder="Phone"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const offices = [...p.offices];
                          offices[idx] = { ...offices[idx], phone: e.target.value };
                          return { ...p, offices };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </div>
                  <input
                    type="text"
                    aria-label="Office street address"
                    value={office.address || ''}
                    placeholder="Full street address"
                    onChange={(e) =>
                      updateDraft((p) => {
                        const offices = [...p.offices];
                        offices[idx] = { ...offices[idx], address: e.target.value };
                        return { ...p, offices };
                      })
                    }
                    className={CMS_INPUT_CLASS}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Client Testimonials */}
          <div className={`${CMS_CARD} p-5 sm:p-6 space-y-4`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
                Client Testimonials ({draft.testimonials?.length || 0})
              </h3>
              <button
                type="button"
                onClick={() =>
                  updateDraft((p) => ({
                    ...p,
                    testimonials: [
                      {
                        id: Date.now(),
                        quote: 'Enter verified client testimonial feedback.',
                        author: 'Client Executive Name',
                        role: 'Executive Title',
                        company: 'Client Organization',
                        rating: 5,
                        avatar: ''
                      },
                      ...(p.testimonials || [])
                    ]
                  }))
                }
                className={CMS_BTN_SECONDARY}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(draft.testimonials || []).map((t, idx) => (
                <div
                  key={t.id || idx}
                  className="p-4 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02] space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {t.author} ({t.company})
                    </span>
                    <button
                      type="button"
                      aria-label={`Delete testimonial from ${t.author}`}
                      onClick={() =>
                        updateDraft((p) => ({
                          ...p,
                          testimonials: p.testimonials.filter((_, i) => i !== idx)
                        }))
                      }
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#BE123C] dark:text-[#FDA4AF] cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    aria-label="Testimonial quote"
                    value={t.quote || ''}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const testimonials = [...p.testimonials];
                        testimonials[idx] = { ...testimonials[idx], quote: e.target.value };
                        return { ...p, testimonials };
                      })
                    }
                    className={CMS_INPUT_CLASS}
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      aria-label="Testimonial author"
                      value={t.author || ''}
                      placeholder="Author"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const testimonials = [...p.testimonials];
                          testimonials[idx] = { ...testimonials[idx], author: e.target.value };
                          return { ...p, testimonials };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                    <input
                      type="text"
                      aria-label="Testimonial role"
                      value={t.role || ''}
                      placeholder="Title"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const testimonials = [...p.testimonials];
                          testimonials[idx] = { ...testimonials[idx], role: e.target.value };
                          return { ...p, testimonials };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                    <input
                      type="text"
                      aria-label="Testimonial company"
                      value={t.company || ''}
                      placeholder="Company"
                      onChange={(e) =>
                        updateDraft((p) => {
                          const testimonials = [...p.testimonials];
                          testimonials[idx] = { ...testimonials[idx], company: e.target.value };
                          return { ...p, testimonials };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    />
                    <select
                      aria-label="Testimonial star rating"
                      value={Number(t.rating) || 5}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const testimonials = [...p.testimonials];
                          testimonials[idx] = {
                            ...testimonials[idx],
                            rating: Number(e.target.value)
                          };
                          return { ...p, testimonials };
                        })
                      }
                      className={CMS_INPUT_CLASS}
                    >
                      {[5, 4, 3, 2, 1].map((stars) => (
                        <option key={stars} value={stars}>
                          {stars} {stars === 1 ? 'Star' : 'Stars'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <MediaUploadField
                    id={`testimonial-avatar-${idx}`}
                    label="Author Photo (Optional, leave blank for initials badge)"
                    value={t.avatar || ''}
                    onUploadFile={onUploadFile}
                    onChange={(url) =>
                      updateDraft((p) => {
                        const testimonials = [...p.testimonials];
                        testimonials[idx] = { ...testimonials[idx], avatar: url };
                        return { ...p, testimonials };
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. SEO & METADATA */}
      {section === 'seo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${CMS_CARD} lg:col-span-6 p-5 sm:p-6 space-y-4`}>
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
              Global Search & Social Metadata
            </h3>
            <CmsField label="Default Site Title" htmlFor="seo-title">
              <input
                id="seo-title"
                type="text"
                value={draft.seo?.siteTitle || ''}
                onChange={(e) =>
                  updateDraft((p) => ({
                    ...p,
                    seo: { ...p.seo, siteTitle: e.target.value }
                  }))
                }
                className={CMS_INPUT_CLASS}
              />
            </CmsField>
            <CmsField
              label="Meta Description"
              htmlFor="seo-desc"
              hint="Recommended length: 140 to 160 characters for search result snippets."
            >
              <textarea
                id="seo-desc"
                rows={3}
                value={draft.seo?.metaDescription || ''}
                onChange={(e) =>
                  updateDraft((p) => ({
                    ...p,
                    seo: { ...p.seo, metaDescription: e.target.value }
                  }))
                }
                className={CMS_INPUT_CLASS}
              />
            </CmsField>
            <CmsField label="Meta Keywords (Comma Separated)" htmlFor="seo-keywords">
              <textarea
                id="seo-keywords"
                rows={2}
                value={draft.seo?.metaKeywords || ''}
                onChange={(e) =>
                  updateDraft((p) => ({
                    ...p,
                    seo: { ...p.seo, metaKeywords: e.target.value }
                  }))
                }
                className={CMS_INPUT_CLASS}
              />
            </CmsField>
            <CmsField label="Canonical Domain URL" htmlFor="seo-canonical">
              <input
                id="seo-canonical"
                type="url"
                value={draft.seo?.canonicalUrl || ''}
                placeholder="https://rak4creative.com"
                onChange={(e) =>
                  updateDraft((p) => ({
                    ...p,
                    seo: { ...p.seo, canonicalUrl: e.target.value }
                  }))
                }
                className={CMS_INPUT_CLASS}
              />
            </CmsField>
            <MediaUploadField
              id="seo-og"
              label="Open Graph / Social Share Image (1200x630)"
              value={draft.seo?.ogImage || ''}
              onUploadFile={onUploadFile}
              onChange={(url) =>
                updateDraft((p) => ({
                  ...p,
                  seo: { ...p.seo, ogImage: url }
                }))
              }
            />
          </div>

          <div className={`${CMS_CARD} lg:col-span-6 p-5 sm:p-6 space-y-4`}>
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
              Route-Specific Titles & Meta Descriptions
            </h3>
            <div className="space-y-4">
              {Object.entries(draft.seo?.pageTitles || {}).map(([routeKey, routeTitle]) => (
                <div key={routeKey} className="p-3.5 rounded-lg border border-slate-200 dark:border-white/[0.07] bg-slate-50/70 dark:bg-white/[0.02] space-y-2.5">
                  <CmsField
                    label={`/${routeKey === 'home' ? '' : routeKey}: Page Title`}
                    htmlFor={`seo-route-${routeKey}`}
                  >
                    <input
                      id={`seo-route-${routeKey}`}
                      type="text"
                      value={routeTitle || ''}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          seo: {
                            ...p.seo,
                            pageTitles: {
                              ...(p.seo?.pageTitles || {}),
                              [routeKey]: e.target.value
                            }
                          }
                        }))
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField
                    label={`/${routeKey === 'home' ? '' : routeKey}: Meta Description`}
                    htmlFor={`seo-desc-${routeKey}`}
                  >
                    <textarea
                      id={`seo-desc-${routeKey}`}
                      rows={2}
                      value={draft.seo?.pageDescriptions?.[routeKey] || ''}
                      onChange={(e) =>
                        updateDraft((p) => ({
                          ...p,
                          seo: {
                            ...p.seo,
                            pageDescriptions: {
                              ...(p.seo?.pageDescriptions || {}),
                              [routeKey]: e.target.value
                            }
                          }
                        }))
                      }
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sticky publish bar: appears while edits are unpublished, then carries the result notice */}
      {(isDirty || notice) && (
        <div className="sticky bottom-4 z-30 flex justify-center pointer-events-none">
          {isDirty ? (
            <div
              role="region"
              aria-label="Unpublished changes"
              className="pointer-events-auto w-full max-w-xl flex flex-wrap items-center justify-between gap-3 pl-4 pr-2 py-2 rounded-lg bg-slate-900 dark:bg-[#22222A] text-white shadow-2xl ring-1 ring-white/10"
            >
              <span className="text-sm font-medium">You have unpublished changes</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDiscard}
                  className="inline-flex items-center justify-center min-h-[40px] sm:min-h-[36px] px-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Discard
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={handlePublish}
                  className={CMS_BTN_PRIMARY}
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Save className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>{saving ? 'Publishing…' : 'Publish changes'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="pointer-events-auto w-full max-w-xl shadow-2xl rounded-lg bg-white dark:bg-[#17171C]">
              <CmsBanner
                tone={notice.tone}
                title={notice.title}
                message={notice.message}
                onDismiss={() => setNotice(null)}
              />
            </div>
          )}
        </div>
      )}

      <ConfirmDialog
        open={confirmResetOpen}
        title="Restore original content?"
        description="Replaces all website copy (including page banners) with the original RAK4Creative content and publishes it immediately. Leads, pixels and email settings are not affected. Download a backup first if you may need your current copy."
        confirmLabel="Restore and publish"
        tone="danger"
        onConfirm={handleConfirmReset}
        onCancel={() => setConfirmResetOpen(false)}
      />
    </div>
  );
}

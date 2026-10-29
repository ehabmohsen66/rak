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
  Globe
} from 'lucide-react';
import {
  CMS_BTN_PRIMARY,
  CMS_BTN_SECONDARY,
  CMS_BTN_DANGER,
  CMS_CARD,
  CMS_INPUT_CLASS,
  CmsField,
  CmsToggle,
  CmsStatusBadge,
  CmsBanner,
  MediaUploadField,
  ConfirmDialog
} from './cmsTheme';

const CONTENT_SECTIONS = [
  { id: 'brand', label: 'Brand & Hero', icon: FileText },
  { id: 'pillars', label: 'Core Pillars', icon: Layers },
  { id: 'projects', label: 'Portfolio & Case Studies', icon: Briefcase },
  { id: 'blog', label: 'Editorial Blog', icon: BookOpen },
  { id: 'careers', label: 'Careers & Open Roles', icon: Users },
  { id: 'offices', label: 'Offices & Testimonials', icon: MapPin },
  { id: 'seo', label: 'SEO & Metadata', icon: Globe }
];

const ICON_OPTIONS = [
  'Compass',
  'BarChart3',
  'Share2',
  'Video',
  'Search',
  'Megaphone',
  'Code2',
  'Palette',
  'Layers',
  'Globe',
  'Cpu',
  'TrendingUp'
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
  onSaveContent,
  onResetDefaultContent,
  onUploadFile
}) {
  const [section, setSection] = useState('brand');
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

  return (
    <div className="space-y-6">
      {/* Operational Save Bar */}
      <div className={`${CMS_CARD} p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4`}>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white">
              Content Studio
            </h2>
            {isDirty ? (
              <CmsStatusBadge tone="warning">Unsaved edits</CmsStatusBadge>
            ) : (
              <CmsStatusBadge tone="success">Published & Synced</CmsStatusBadge>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Edit agency copy, capabilities, portfolio case studies, editorial posts, open roles, offices, and SEO metadata.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button type="button" onClick={handleExportJson} className={CMS_BTN_SECONDARY}>
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Backup JSON</span>
          </button>
          <button
            type="button"
            onClick={() => setConfirmResetOpen(true)}
            className={CMS_BTN_SECONDARY}
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>Reset Defaults</span>
          </button>
          {isDirty && (
            <button type="button" onClick={handleDiscard} className={CMS_BTN_SECONDARY}>
              Discard
            </button>
          )}
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
            <span>{saving ? 'Publishing...' : 'Publish Changes'}</span>
          </button>
        </div>
      </div>

      {notice && (
        <CmsBanner
          tone={notice.tone}
          title={notice.title}
          message={notice.message}
          onDismiss={() => setNotice(null)}
        />
      )}

      {/* Section Navigation */}
      <div
        role="tablist"
        aria-label="Content Studio Sections"
        className="flex items-center gap-2 overflow-x-auto pb-1"
      >
        {CONTENT_SECTIONS.map((tab) => {
          const Icon = tab.icon;
          const active = section === tab.id;
          let countLabel = null;
          if (tab.id === 'pillars') countLabel = draft.pillars?.length || 0;
          if (tab.id === 'projects') countLabel = draft.projects?.length || 0;
          if (tab.id === 'blog') countLabel = draft.blogPosts?.length || 0;
          if (tab.id === 'careers') countLabel = draft.openRoles?.length || 0;
          if (tab.id === 'offices') countLabel = draft.offices?.length || 0;

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSection(tab.id)}
              className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border transition-colors cursor-pointer ${
                active
                  ? 'bg-[#D1007C] text-white border-[#D1007C]'
                  : 'bg-white dark:bg-[#0F172A] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#D1007C]'
              }`}
            >
              <Icon className="w-4 h-4" aria-hidden="true" />
              <span>{tab.label}</span>
              {countLabel !== null && (
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    active
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {countLabel}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 1. BRAND & HERO */}
      {section === 'brand' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${CMS_CARD} lg:col-span-7 p-5 sm:p-6 space-y-5`}>
            <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
              Core Brand Narrative & Hero Copy
            </h3>
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

            <CmsField label="Primary Headline" htmlFor="brand-headline">
              <input
                id="brand-headline"
                type="text"
                value={draft.brandInfo?.headline || ''}
                onChange={(e) =>
                  updateDraft((p) => ({
                    ...p,
                    brandInfo: { ...p.brandInfo, headline: e.target.value }
                  }))
                }
                className={CMS_INPUT_CLASS}
              />
            </CmsField>

            <CmsField
              label="Homepage Hero & Agency Description"
              htmlFor="brand-description"
              hint="Displayed in the homepage hero overlay, footer summary, and About introduction."
            >
              <textarea
                id="brand-description"
                rows={4}
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

            <CmsField label="Differentiation Statement" htmlFor="brand-diff">
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

            <CmsField label="Collaboration Quote" htmlFor="brand-quote">
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

            <CmsField
              label="Capability Highlights (One Line per Item)"
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

          <div className="lg:col-span-5 space-y-6">
            {/* Key Agency Metrics */}
            <div className={`${CMS_CARD} p-5 sm:p-6 space-y-4`}>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
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
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2.5"
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
                        className="min-w-[44px] min-h-[44px] rounded-xl border border-rose-200 dark:border-rose-900 flex items-center justify-center text-[#BE123C] dark:text-[#FDA4AF] hover:bg-rose-50 dark:hover:bg-rose-950/50 cursor-pointer"
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
                  <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
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
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2.5"
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
                        className="min-w-[44px] min-h-[44px] rounded-xl border border-rose-200 dark:border-rose-900 flex items-center justify-center text-[#BE123C] dark:text-[#FDA4AF] cursor-pointer"
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
      )}

      {/* 2. CORE PILLARS (SERVICES) */}
      {section === 'pillars' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${CMS_CARD} lg:col-span-4 p-4 sm:p-5 space-y-3`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
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
                      className={`flex items-center justify-between gap-2 p-3 rounded-xl border transition-colors ${
                        selected
                          ? 'border-[#D1007C] bg-pink-50/70 dark:bg-pink-950/30'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
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
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-200/70 dark:hover:bg-slate-800 cursor-pointer"
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
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-200/70 dark:hover:bg-slate-800 cursor-pointer"
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
                  <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
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
                      {ICON_OPTIONS.map((ic) => (
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
              <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
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
                  <button
                    key={proj.id || idx}
                    type="button"
                    onClick={() => setSelectedProjectIdx(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                      selected
                        ? 'border-[#D1007C] bg-pink-50/70 dark:bg-pink-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {proj.title}
                      </span>
                      {proj.featured && <CmsStatusBadge tone="brand">Featured</CmsStatusBadge>}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                      {proj.client} · {proj.category} ({proj.year})
                    </p>
                  </button>
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
                  <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                    Editing: {activeProject.title}
                  </h3>
                  <button
                    type="button"
                    disabled={draft.projects.length <= 1}
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

                <CmsField label="Measured Results (Metric & Outcome Pairs)">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {(activeProject.results || []).map((resItem, rIdx) => (
                      <div
                        key={rIdx}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2"
                      >
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
                          className={CMS_INPUT_CLASS}
                        />
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
                </CmsField>

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
              <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
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
                  <button
                    key={post.id || idx}
                    type="button"
                    onClick={() => setSelectedBlogIdx(idx)}
                    className={`w-full text-left p-3 rounded-xl border transition-colors cursor-pointer ${
                      selected
                        ? 'border-[#D1007C] bg-pink-50/70 dark:bg-pink-950/30'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                        {post.title}
                      </span>
                      {post.featured && <CmsStatusBadge tone="brand">Lead</CmsStatusBadge>}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {post.category} · {post.date}
                    </p>
                  </button>
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
                  <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
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
                      disabled={draft.blogPosts.length <= 1}
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
                  <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#07080B] space-y-4">
                    <CmsStatusBadge tone="brand">{activeBlog.category}</CmsStatusBadge>
                    <h4 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
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
                    <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-3 text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
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
            <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
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
                <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
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
              <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                No job postings listed. Visitors can still submit an Open Talent Application on the Careers page.
              </div>
            ) : (
              <div className="space-y-4">
                {draft.openRoles.map((role, idx) => (
                  <div
                    key={role.id || idx}
                    className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3"
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
                <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
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
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {office.city}, {office.country}
                    </span>
                    <button
                      type="button"
                      disabled={draft.offices.length <= 1}
                      aria-label={`Delete office ${office.city}`}
                      onClick={() =>
                        updateDraft((p) => ({
                          ...p,
                          offices: p.offices.filter((_, i) => i !== idx)
                        }))
                      }
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#BE123C] dark:text-[#FDA4AF] disabled:opacity-30 cursor-pointer"
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
              <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
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
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {t.author} ({t.company})
                    </span>
                    <button
                      type="button"
                      disabled={draft.testimonials.length <= 1}
                      aria-label={`Delete testimonial from ${t.author}`}
                      onClick={() =>
                        updateDraft((p) => ({
                          ...p,
                          testimonials: p.testimonials.filter((_, i) => i !== idx)
                        }))
                      }
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#BE123C] dark:text-[#FDA4AF] disabled:opacity-30 cursor-pointer"
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
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agency Values */}
          <div className={`${CMS_CARD} p-5 sm:p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                Agency Core Values ({draft.values?.length || 0})
              </h3>
              <button
                type="button"
                onClick={() =>
                  updateDraft((p) => ({
                    ...p,
                    values: [
                      ...(p.values || []),
                      { name: 'New Principle', description: 'How this principle guides our work.' }
                    ]
                  }))
                }
                className={CMS_BTN_SECONDARY}
              >
                <Plus className="w-4 h-4" aria-hidden="true" />
                <span>Add Value</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {(draft.values || []).map((val, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      aria-label={`Value ${idx + 1} title`}
                      value={val.name || ''}
                      onChange={(e) =>
                        updateDraft((p) => {
                          const values = [...p.values];
                          values[idx] = { ...values[idx], name: e.target.value };
                          return { ...p, values };
                        })
                      }
                      className={`${CMS_INPUT_CLASS} font-bold`}
                    />
                    <button
                      type="button"
                      disabled={draft.values.length <= 1}
                      aria-label={`Remove value ${val.name}`}
                      onClick={() =>
                        updateDraft((p) => ({
                          ...p,
                          values: p.values.filter((_, i) => i !== idx)
                        }))
                      }
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-[#BE123C] dark:text-[#FDA4AF] disabled:opacity-30 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    aria-label={`Value ${idx + 1} description`}
                    value={val.description || ''}
                    onChange={(e) =>
                      updateDraft((p) => {
                        const values = [...p.values];
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
        </div>
      )}

      {/* 7. SEO & METADATA */}
      {section === 'seo' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`${CMS_CARD} lg:col-span-6 p-5 sm:p-6 space-y-4`}>
            <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
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
            <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
              Route-Specific Browser Tab Titles
            </h3>
            <div className="space-y-3">
              {Object.entries(draft.seo?.pageTitles || {}).map(([routeKey, routeTitle]) => (
                <CmsField
                  key={routeKey}
                  label={`/${routeKey === 'home' ? '' : routeKey}`}
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
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmResetOpen}
        title="Restore Factory Content?"
        description="This replaces current draft and published website copy with the initial RAK4Creative factory content dataset. Leads, pixels, and email settings are not affected."
        confirmLabel="Restore Factory Content"
        tone="danger"
        onConfirm={handleConfirmReset}
        onCancel={() => setConfirmResetOpen(false)}
      />
    </div>
  );
}

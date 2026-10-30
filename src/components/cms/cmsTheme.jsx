import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Upload,
  Check,
  AlertCircle,
  Info,
  Loader2,
  X,
  Image as ImageIcon,
  Film,
  FolderOpen,
  FileText,
  RefreshCw,
  Search,
  Trash2
} from 'lucide-react';
import { useCms } from '../../lib/cmsContext';

/*
 * CMS design tokens.
 * Direction (DESIGN.md, CMS dial ENERGY 2 / RHYTHM 2 / MOTION 1):
 * - Neutral canvas so content and media carry the color; magenta #D1007C is the single accent,
 *   reserved for the primary action, active navigation, and focus.
 * - Gilroy for all UI text for dense legibility; Eurostile only on the page title as the brand moment.
 * - Radius scale: 12px surfaces, 8px controls, 6px badges. Shadows only on floating layers (dialogs, publish bar).
 */

const CONTROL_BASE =
  'inline-flex items-center justify-center gap-2 min-h-[44px] sm:min-h-[38px] rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap select-none';

export const CMS_BTN_PRIMARY = `${CONTROL_BASE} px-4 font-semibold bg-[#D1007C] hover:bg-[#B8006D] active:bg-[#A10060] text-white`;

export const CMS_BTN_SECONDARY = `${CONTROL_BASE} px-3.5 font-medium border border-black/[0.1] dark:border-white/[0.1] bg-white dark:bg-white/[0.04] text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/[0.08]`;

export const CMS_BTN_GHOST = `${CONTROL_BASE} px-3 font-medium text-slate-700 dark:text-slate-300 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-slate-900 dark:hover:text-white`;

export const CMS_BTN_DANGER = `${CONTROL_BASE} px-3.5 font-medium border border-rose-200 dark:border-rose-500/30 bg-white dark:bg-transparent text-rose-700 dark:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-500/10`;

export const CMS_ICON_BTN =
  'inline-flex items-center justify-center w-11 h-11 sm:w-9 sm:h-9 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer';

export const CMS_CARD =
  'rounded-xl border border-black/[0.07] dark:border-white/[0.07] bg-white dark:bg-[#141418]';

export const CMS_SUBTLE_PANEL =
  'rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02]';

export const CMS_INPUT_CLASS =
  'w-full min-h-[44px] sm:min-h-[38px] px-3 py-2 rounded-lg border border-black/[0.12] dark:border-white/[0.1] bg-white dark:bg-[#0E0E11] text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-500 text-sm transition-[border-color,box-shadow] hover:border-black/[0.2] dark:hover:border-white/[0.18] focus:outline-none focus:border-[#D1007C] focus:ring-4 focus:ring-[#D1007C]/15 dark:focus:border-[#FF4FB0] dark:focus:ring-[#FF4FB0]/15';

export const CMS_SECTION_TITLE = 'text-[15px] font-semibold text-slate-900 dark:text-white';

export function CmsPageHeader({ eyebrow, title, description, badge, actions }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-6 mb-6 border-b border-black/[0.07] dark:border-white/[0.07]">
      <div className="min-w-0 space-y-1.5">
        {eyebrow && (
          <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">{eyebrow}</p>
        )}
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="cms-page-title text-2xl sm:text-[28px] leading-tight text-slate-900 dark:text-white">
            {title}
          </h1>
          {badge}
        </div>
        {description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2 shrink-0">{actions}</div>}
    </div>
  );
}

export function CmsSectionHeader({ title, description, actions, className = '' }) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-3 ${className}`}>
      <div className="min-w-0 space-y-0.5">
        <h3 className={CMS_SECTION_TITLE}>{title}</h3>
        {description && (
          <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CmsField({ label, htmlFor, hint, required = false, children, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-[13px] font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-rose-600 dark:text-rose-400 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{hint}</p>}
    </div>
  );
}

export function CmsToggle({ checked, onChange, label, description, id }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="space-y-0.5">
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-900 dark:text-slate-100 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={Boolean(checked)}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 min-w-[44px] shrink-0 items-center rounded-full transition-colors cursor-pointer ${
          checked ? 'bg-[#D1007C]' : 'bg-slate-300 dark:bg-white/[0.15]'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

export function CmsStatusBadge({ tone = 'neutral', children }) {
  const tones = {
    success: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 ring-emerald-600/15 dark:ring-emerald-400/20',
    warning: 'bg-amber-50 dark:bg-amber-500/10 text-amber-800 dark:text-amber-300 ring-amber-600/20 dark:ring-amber-400/20',
    danger: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 ring-rose-600/15 dark:ring-rose-400/20',
    brand: 'bg-pink-50 dark:bg-pink-500/10 text-[#B0006A] dark:text-pink-300 ring-pink-600/15 dark:ring-pink-400/20',
    neutral: 'bg-slate-100 dark:bg-white/[0.06] text-slate-700 dark:text-slate-300 ring-black/[0.06] dark:ring-white/[0.08]'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 h-6 px-2 rounded-md text-xs font-medium ring-1 ring-inset whitespace-nowrap ${
        tones[tone] || tones.neutral
      }`}
    >
      {children}
    </span>
  );
}

export function CmsBanner({ tone = 'info', title, message, onDismiss, className = '' }) {
  const styles = {
    success: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/25 text-emerald-800 dark:text-emerald-200',
    error: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/25 text-rose-800 dark:text-rose-200',
    warning: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/25 text-amber-900 dark:text-amber-200',
    info: 'bg-slate-50 dark:bg-white/[0.04] border-black/[0.08] dark:border-white/[0.08] text-slate-800 dark:text-slate-200'
  };
  const Icon = tone === 'success' ? Check : tone === 'info' ? Info : AlertCircle;

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start justify-between gap-3 px-4 py-3 rounded-lg border ${styles[tone] || styles.info} ${className}`}
    >
      <div className="flex items-start gap-2.5 text-sm min-w-0">
        <Icon className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          {title && <p className="font-semibold">{title}</p>}
          {message && <p className={title ? 'mt-0.5 opacity-90' : ''}>{message}</p>}
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="w-8 h-8 min-w-[32px] -my-1 -mr-1.5 rounded-md flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function CmsDialog({ open, onClose, labelledBy, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', handleKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;
  const widths = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-3xl', xl: 'max-w-5xl' };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
      className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <button
        type="button"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/50 dark:bg-black/70 cursor-default"
      />
      <div
        className={`relative w-full ${widths[size] || widths.md} max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-white dark:bg-[#17171C] shadow-2xl`}
      >
        {children}
      </div>
    </div>
  );
}

function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1048576) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1048576).toFixed(1)} MB`;
}

function detectMediaKind(url = '') {
  const clean = String(url).split('?')[0].toLowerCase();
  if (/\.(mp4|webm|mov)$/.test(clean)) return 'video';
  if (/\.(pdf|docx?)$/.test(clean)) return 'file';
  return clean.trim() ? 'image' : 'none';
}

export function MediaLibraryDialog({ open, onClose, onSelect, kind = 'all' }) {
  const { fetchMediaLibrary, deleteMediaFile } = useCms();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState('');
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(kind === 'all' ? 'all' : kind);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetchMediaLibrary();
      if (res?.ok) {
        setItems(Array.isArray(res.items) ? res.items : []);
      } else {
        setError(res?.error || 'Could not load the media library.');
      }
    } catch {
      setError('Network error while loading the media library.');
    } finally {
      setLoading(false);
    }
  }, [fetchMediaLibrary]);

  useEffect(() => {
    if (open) {
      setFilter(kind === 'all' ? 'all' : kind);
      load();
    }
  }, [open, kind, load]);

  const handleDelete = async (e, item) => {
    e.stopPropagation();
    if (!item?.deletable || deletingUrl) return;
    setDeletingUrl(item.url);
    setError('');
    try {
      const res = await deleteMediaFile(item.url);
      if (res?.ok) {
        setItems((prev) => prev.filter((x) => x.url !== item.url));
      } else {
        setError(res?.error || 'Could not delete media file.');
      }
    } catch {
      setError('Network error while deleting media file.');
    } finally {
      setDeletingUrl('');
    }
  };

  const visible = items.filter((item) => {
    if (filter !== 'all' && item.type !== filter) return false;
    if (query && !item.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'image', label: 'Images' },
    { id: 'video', label: 'Videos' }
  ];

  return (
    <CmsDialog open={open} onClose={onClose} labelledBy="cms-media-library-title" size="xl">
      <div className="sticky top-0 z-10 bg-white dark:bg-[#17171C] border-b border-black/[0.07] dark:border-white/[0.07] px-5 py-4 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 id="cms-media-library-title" className="text-base font-semibold text-slate-900 dark:text-white">
              Media library
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Files you uploaded plus the videos that ship with the site.
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={load} aria-label="Refresh media library" className={CMS_ICON_BTN}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
            </button>
            <button type="button" onClick={onClose} aria-label="Close media library" className={CMS_ICON_BTN}>
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by file name"
              aria-label="Search media by file name"
              className={`${CMS_INPUT_CLASS} pl-9`}
            />
          </div>
          <div role="tablist" aria-label="Filter media type" className="inline-flex p-1 rounded-lg bg-slate-100 dark:bg-white/[0.05] self-start">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                onClick={() => setFilter(f.id)}
                className={`min-h-[36px] sm:min-h-[30px] px-3 rounded-md text-[13px] font-medium transition-colors cursor-pointer ${
                  filter === f.id
                    ? 'bg-white dark:bg-white/[0.12] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-5">
        {error ? (
          <CmsBanner tone="error" title="Media library unavailable" message={error} />
        ) : loading && items.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
            Loading uploaded files…
          </div>
        ) : visible.length === 0 ? (
          <div className="py-16 text-center space-y-1">
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {items.length === 0 ? 'No files uploaded yet' : 'No files match this filter'}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {items.length === 0
                ? 'Close this window and use “Upload” to add your first image or video.'
                : 'Try a different name or switch the type filter.'}
            </p>
          </div>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {visible.map((item) => (
              <li key={item.url} className="relative group">
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item.url, item);
                    onClose();
                  }}
                  className="w-full text-left rounded-lg border border-black/[0.08] dark:border-white/[0.08] overflow-hidden hover:border-[#D1007C] dark:hover:border-[#FF4FB0] transition-colors cursor-pointer"
                >
                  <div className="relative aspect-video bg-slate-100 dark:bg-black/40 flex items-center justify-center overflow-hidden">
                    {item.type === 'image' && (
                      <img src={item.url} alt="" loading="lazy" className="w-full h-full object-cover" />
                    )}
                    {item.type === 'video' && (
                      <video
                        src={`${item.url}#t=0.5`}
                        muted
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {item.type === 'file' && <FileText className="w-6 h-6 text-slate-400" aria-hidden="true" />}
                    {item.type === 'video' && (
                      <span className="absolute left-2 bottom-2 inline-flex items-center gap-1 px-1.5 h-5 rounded bg-black/70 text-[11px] font-medium text-white">
                        <Film className="w-3 h-3" aria-hidden="true" />
                        Video
                      </span>
                    )}
                  </div>
                  <div className="px-2.5 py-2">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{item.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {formatBytes(item.size)} · {item.source === 'site' ? 'Built-in' : 'Uploaded'}
                    </p>
                  </div>
                </button>
                {item.deletable && (
                  <button
                    type="button"
                    disabled={deletingUrl === item.url}
                    onClick={(e) => handleDelete(e, item)}
                    aria-label={`Delete uploaded file ${item.name}`}
                    title="Delete uploaded file"
                    className="absolute top-2 right-2 w-8 h-8 rounded-md bg-black/75 hover:bg-rose-600 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer"
                  >
                    {deletingUrl === item.url ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                    )}
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </CmsDialog>
  );
}

export function MediaUploadField({
  label,
  value,
  onChange,
  onUploadFile,
  placeholder = '/uploads/media/file.jpg or https://…',
  accept = 'image/*,video/mp4,video/webm,video/quicktime,application/pdf',
  hint,
  kind = 'all',
  id
}) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [libraryOpen, setLibraryOpen] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadFile) return;
    setUploading(true);
    setProgress(0);
    setUploadError('');
    try {
      const res = await onUploadFile(file, setProgress);
      if (res && res.ok && res.url) {
        onChange(res.url);
      } else {
        setUploadError(res?.error || 'Upload failed. Check file type and size.');
      }
    } catch {
      setUploadError('Network error while uploading file.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const mediaKind = detectMediaKind(value);

  return (
    <CmsField label={label} htmlFor={id} hint={hint}>
      <div className="flex gap-3">
        <div className="w-16 h-16 sm:w-[72px] sm:h-[72px] shrink-0 rounded-lg overflow-hidden border border-black/[0.08] dark:border-white/[0.08] bg-slate-100 dark:bg-black/40 flex items-center justify-center">
          {mediaKind === 'image' && (
            <img
              key={value}
              src={value}
              alt=""
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
          {mediaKind === 'video' && (
            <video key={value} src={`${value}#t=0.5`} muted playsInline preload="metadata" className="w-full h-full object-cover" />
          )}
          {mediaKind === 'file' && <FileText className="w-5 h-5 text-slate-400" aria-hidden="true" />}
          {mediaKind === 'none' && <ImageIcon className="w-5 h-5 text-slate-400" aria-hidden="true" />}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="relative">
            <input
              id={id}
              type="text"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`${CMS_INPUT_CLASS} ${value ? 'pr-10' : ''}`}
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                aria-label={`Clear ${label || 'media'}`}
                className="absolute right-1 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <input ref={fileRef} type="file" accept={accept} onChange={handleFileChange} className="hidden" />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              className={CMS_BTN_SECONDARY}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              ) : (
                <Upload className="w-4 h-4" aria-hidden="true" />
              )}
              <span>{uploading ? `Uploading ${progress}%` : 'Upload'}</span>
            </button>
            <button type="button" onClick={() => setLibraryOpen(true)} className={CMS_BTN_GHOST}>
              <FolderOpen className="w-4 h-4" aria-hidden="true" />
              <span>Library</span>
            </button>
          </div>
          {uploading && (
            <div
              className="h-1 w-full rounded-full bg-slate-200 dark:bg-white/[0.08] overflow-hidden"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Upload progress"
            >
              <div className="h-full bg-[#D1007C] transition-[width]" style={{ width: `${progress}%` }} />
            </div>
          )}
          {uploadError && (
            <p className="text-xs font-medium text-rose-700 dark:text-rose-300">{uploadError}</p>
          )}
        </div>
      </div>
      <MediaLibraryDialog
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        onSelect={(url) => onChange(url)}
        kind={kind}
      />
    </CmsField>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  tone = 'danger',
  onConfirm,
  onCancel
}) {
  return (
    <CmsDialog open={open} onClose={onCancel} labelledBy="cms-confirm-dialog-title" size="sm">
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <h3 id="cms-confirm-dialog-title" className="text-base font-semibold text-slate-900 dark:text-white">
            {title}
          </h3>
          <button type="button" onClick={onCancel} aria-label="Close confirmation dialog" className={`${CMS_ICON_BTN} -mt-1.5 -mr-1.5`}>
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
        <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className={CMS_BTN_SECONDARY}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={tone === 'danger' ? `${CONTROL_BASE} px-4 font-semibold bg-rose-600 hover:bg-rose-700 text-white` : CMS_BTN_PRIMARY}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </CmsDialog>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { Upload, Check, AlertCircle, Loader2, X, Image as ImageIcon } from 'lucide-react';

export const CMS_BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 py-2.5 rounded-xl font-bold text-sm bg-[#D1007C] hover:bg-[#B8006D] text-white shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

export const CMS_BTN_SECONDARY =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-sm border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:border-[#D1007C] dark:hover:border-[#FF66C4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

export const CMS_BTN_DANGER =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-sm border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/50 text-[#BE123C] dark:text-[#FDA4AF] hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors disabled:opacity-50 cursor-pointer';

export const CMS_CARD =
  'rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0F172A] shadow-sm';

export const CMS_INPUT_CLASS =
  'w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#07080B] text-slate-900 dark:text-slate-100 placeholder:text-slate-500 dark:placeholder:text-slate-400 text-sm transition-colors focus:border-[#D1007C] dark:focus:border-[#FF66C4]';

export function CmsField({ label, htmlFor, hint, required = false, children, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && <span className="text-[#BE123C] dark:text-[#FDA4AF] ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{hint}</p>}
    </div>
  );
}

export function CmsToggle({ checked, onChange, label, description, id }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <div className="space-y-0.5">
        <label
          htmlFor={id}
          className="text-sm font-bold text-slate-900 dark:text-slate-100 cursor-pointer"
        >
          {label}
        </label>
        {description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{description}</p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={Boolean(checked)}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-7 w-12 min-w-[48px] shrink-0 items-center rounded-full border transition-colors cursor-pointer ${
          checked
            ? 'bg-[#D1007C] border-[#D1007C]'
            : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
}

export function CmsStatusBadge({ tone = 'neutral', children }) {
  const tones = {
    success:
      'bg-[#ECFDF5] dark:bg-emerald-950/60 text-[#047857] dark:text-[#34D399] border-emerald-300 dark:border-emerald-800',
    warning:
      'bg-[#FFFBEB] dark:bg-amber-950/60 text-[#B45309] dark:text-[#FBBF24] border-amber-300 dark:border-amber-800',
    danger:
      'bg-[#FFF1F2] dark:bg-rose-950/60 text-[#BE123C] dark:text-[#FDA4AF] border-rose-300 dark:border-rose-800',
    brand:
      'bg-pink-50 dark:bg-pink-950/50 text-[#B8006D] dark:text-[#FF66C4] border-pink-300 dark:border-pink-800',
    neutral:
      'bg-slate-100 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
        tones[tone] || tones.neutral
      }`}
    >
      {children}
    </span>
  );
}

export function CmsBanner({ tone = 'info', title, message, onDismiss }) {
  const styles = {
    success:
      'bg-[#ECFDF5] dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-[#047857] dark:text-[#34D399]',
    error:
      'bg-[#FFF1F2] dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-[#BE123C] dark:text-[#FDA4AF]',
    warning:
      'bg-[#FFFBEB] dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-[#B45309] dark:text-[#FBBF24]',
    info:
      'bg-slate-100 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
  };

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start justify-between gap-3 p-4 rounded-xl border ${styles[tone] || styles.info}`}
    >
      <div className="flex items-start gap-2.5 text-sm">
        {tone === 'success' ? (
          <Check className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
        ) : (
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden="true" />
        )}
        <div>
          {title && <p className="font-bold">{title}</p>}
          {message && <p className={title ? 'mt-0.5 opacity-95' : 'font-medium'}>{message}</p>}
        </div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="w-8 h-8 min-w-[32px] rounded-lg flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/10 cursor-pointer"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function MediaUploadField({
  label,
  value,
  onChange,
  onUploadFile,
  placeholder = 'https://yourdomain.com/uploads/media/asset.jpg or /images/...',
  accept = 'image/*,video/mp4,application/pdf',
  id
}) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !onUploadFile) return;
    setUploading(true);
    setUploadError('');
    try {
      const res = await onUploadFile(file);
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

  const isPreviewableImage =
    typeof value === 'string' &&
    value.trim() !== '' &&
    !/\.(mp4|pdf)$/i.test(value.trim());

  return (
    <CmsField label={label} htmlFor={id}>
      <div className="flex flex-col sm:flex-row gap-2.5">
        <input
          id={id}
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${CMS_INPUT_CLASS} flex-1`}
        />
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => fileRef.current?.click()}
          className={`${CMS_BTN_SECONDARY} shrink-0`}
        >
          {uploading ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Upload className="w-4 h-4" aria-hidden="true" />
          )}
          <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
        </button>
      </div>
      {uploadError && (
        <p className="text-xs font-semibold text-[#BE123C] dark:text-[#FDA4AF]">{uploadError}</p>
      )}
      {isPreviewableImage && (
        <div className="mt-2 flex items-center gap-3 p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center">
            <img
              src={value}
              alt="Selected media preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            <ImageIcon className="w-4 h-4 text-slate-400" aria-hidden="true" />
          </div>
          <span className="text-xs text-slate-600 dark:text-slate-400 truncate font-mono">
            {value}
          </span>
        </div>
      )}
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
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cms-confirm-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
    >
      <div className={`${CMS_CARD} w-full max-w-md p-6 space-y-4`}>
        <div className="flex items-start justify-between gap-3">
          <h3
            id="cms-confirm-dialog-title"
            className="text-lg font-heading font-bold text-slate-900 dark:text-white"
          >
            {title}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close confirmation dialog"
            className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onCancel} className={CMS_BTN_SECONDARY}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={tone === 'danger' ? CMS_BTN_DANGER : CMS_BTN_PRIMARY}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

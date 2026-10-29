import React, { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  Play,
  Trash2,
  Code2,
  Activity,
  Radio
} from 'lucide-react';
import {
  CMS_BTN_PRIMARY,
  CMS_BTN_SECONDARY,
  CMS_CARD,
  CMS_INPUT_CLASS,
  CmsField,
  CmsToggle,
  CmsStatusBadge,
  CmsBanner
} from './cmsTheme';
import {
  getPixelEventLog,
  clearPixelEventLog,
  trackLeadConversion
} from '../../lib/pixelEngine';

const PIXEL_PROVIDERS = [
  {
    key: 'meta',
    name: 'Meta (Facebook & Instagram) Pixel',
    enabledField: 'metaPixelEnabled',
    idField: 'metaPixelId',
    placeholder: '15-digit Pixel ID (e.g. 104829301928374)',
    eventsSummary: 'Fires PageView on route navigation and Lead on inquiry submission.'
  },
  {
    key: 'gtm',
    name: 'Google Tag Manager (GTM)',
    enabledField: 'gtmEnabled',
    idField: 'gtmId',
    placeholder: 'Container ID (e.g. GTM-ABC1234)',
    eventsSummary: 'Injects head + noscript container and pushes rak_page_view & rak_lead_conversion to dataLayer.'
  },
  {
    key: 'ga4',
    name: 'Google Analytics 4 (GA4)',
    enabledField: 'ga4Enabled',
    idField: 'ga4Id',
    placeholder: 'Measurement ID (e.g. G-9X8Y7Z6W5V)',
    eventsSummary: 'Loads gtag.js and dispatches page_view and generate_lead events.'
  },
  {
    key: 'tiktok',
    name: 'TikTok Ads Pixel',
    enabledField: 'tiktokPixelEnabled',
    idField: 'tiktokPixelId',
    placeholder: 'TikTok Pixel Code (e.g. C9ABCDEF123456)',
    eventsSummary: 'Initializes ttq queue and triggers page() and SubmitForm conversions.'
  },
  {
    key: 'linkedin',
    name: 'LinkedIn Insight Tag',
    enabledField: 'linkedinEnabled',
    idField: 'linkedinPartnerId',
    placeholder: 'LinkedIn Partner ID (e.g. 4829104)',
    eventsSummary: 'Registers _linkedin_data_partner_ids and loads LinkedIn B2B attribution tag.'
  },
  {
    key: 'snap',
    name: 'Snapchat Ads Pixel',
    enabledField: 'snapPixelEnabled',
    idField: 'snapPixelId',
    placeholder: 'Snap Pixel UUID',
    eventsSummary: 'Initializes snaptr queue and records PAGE_VIEW and SIGN_UP events.'
  },
  {
    key: 'twitter',
    name: 'X (Twitter) Ads Pixel',
    enabledField: 'twitterPixelEnabled',
    idField: 'twitterPixelId',
    placeholder: 'X Pixel ID (e.g. o8abc)',
    eventsSummary: 'Initializes twq config and conversion event tracking.'
  }
];

export default function PixelsPanel({ pixels, onSavePixels }) {
  const [draft, setDraft] = useState(() => ({ ...pixels }));
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [eventLog, setEventLog] = useState(() => getPixelEventLog());

  useEffect(() => {
    if (!isDirty) {
      setDraft({ ...pixels });
    }
  }, [pixels, isDirty]);

  useEffect(() => {
    const syncLog = () => setEventLog(getPixelEventLog());
    window.addEventListener('rak-pixel-log-updated', syncLog);
    return () => window.removeEventListener('rak-pixel-log-updated', syncLog);
  }, []);

  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const activeProvidersCount = PIXEL_PROVIDERS.filter(
    (p) => Boolean(draft[p.enabledField]) && String(draft[p.idField] || '').trim() !== ''
  ).length;

  const handleSave = async () => {
    setSaving(true);
    setNotice(null);
    try {
      const res = await onSavePixels(draft);
      if (res && res.ok) {
        setIsDirty(false);
        setNotice({
          tone: 'success',
          title: 'Pixels & tracking scripts saved',
          message: 'Active pixels have been injected into the live document head and body.'
        });
      } else {
        setNotice({
          tone: 'error',
          title: 'Failed to save pixel settings',
          message: res?.error || 'Verify your admin session and storage permissions.'
        });
      }
    } catch {
      setNotice({
        tone: 'error',
        title: 'Network error',
        message: 'Could not reach /api/index.php?route=pixels.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleFireTestConversion = () => {
    trackLeadConversion(draft, {
      source: 'diagnostic_test',
      service: 'CMS Pixel Verification',
      budget: '$25k - $50k'
    });
    setEventLog(getPixelEventLog());
    setNotice({
      tone: 'info',
      title: 'Diagnostic conversion fired',
      message: 'Check the Live Event Inspector below to review dispatched conversion calls.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className={`${CMS_CARD} p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4`}>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white">
              Pixels & Conversion Scripts
            </h2>
            <CmsStatusBadge tone={activeProvidersCount > 0 ? 'brand' : 'neutral'}>
              {activeProvidersCount} active {activeProvidersCount === 1 ? 'pixel' : 'pixels'}
            </CmsStatusBadge>
            {isDirty && <CmsStatusBadge tone="warning">Unsaved changes</CmsStatusBadge>}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Configure ad platform pixels, GTM/GA4 tags, custom HTML/JS snippets, and conversion triggers across Contact, Project Planner, and Career forms.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleFireTestConversion}
            className={CMS_BTN_SECONDARY}
          >
            <Play className="w-4 h-4" aria-hidden="true" />
            <span>Fire Test Conversion</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className={CMS_BTN_PRIMARY}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{saving ? 'Saving...' : 'Save Pixel Config'}</span>
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

      {/* Global Event Switches */}
      <div className={`${CMS_CARD} p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6`}>
        <CmsToggle
          id="px-track-pageviews"
          label="Automatic SPA PageView Tracking"
          description="Fires PageView events automatically whenever a visitor navigates between routes."
          checked={draft.trackPageViews !== false}
          onChange={(val) => updateField('trackPageViews', val)}
        />
        <CmsToggle
          id="px-track-leads"
          label="Automatic Form Lead Conversions"
          description="Fires Lead / generate_lead / SubmitForm conversion events when any public form succeeds."
          checked={draft.trackLeadEvents !== false}
          onChange={(val) => updateField('trackLeadEvents', val)}
        />
      </div>

      {/* Platform Pixel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {PIXEL_PROVIDERS.map((provider) => {
          const isEnabled = Boolean(draft[provider.enabledField]);
          const idVal = draft[provider.idField] || '';
          const ready = isEnabled && String(idVal).trim() !== '';

          return (
            <div key={provider.key} className={`${CMS_CARD} p-5 space-y-4`}>
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Radio
                      className={`w-4 h-4 ${
                        ready
                          ? 'text-[#047857] dark:text-[#34D399]'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                      aria-hidden="true"
                    />
                    <h3 className="text-sm sm:text-base font-heading font-bold text-slate-900 dark:text-white">
                      {provider.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {provider.eventsSummary}
                  </p>
                </div>
                {ready ? (
                  <CmsStatusBadge tone="success">Active</CmsStatusBadge>
                ) : isEnabled ? (
                  <CmsStatusBadge tone="warning">Missing ID</CmsStatusBadge>
                ) : (
                  <CmsStatusBadge tone="neutral">Off</CmsStatusBadge>
                )}
              </div>

              <CmsToggle
                id={`toggle-${provider.key}`}
                label={`Enable ${provider.name.split(' ')[0]} Tracking`}
                checked={isEnabled}
                onChange={(val) => updateField(provider.enabledField, val)}
              />

              <CmsField label="Tag / Pixel Identifier" htmlFor={`input-${provider.key}`}>
                <input
                  id={`input-${provider.key}`}
                  type="text"
                  value={idVal}
                  placeholder={provider.placeholder}
                  onChange={(e) => updateField(provider.idField, e.target.value)}
                  className={`${CMS_INPUT_CLASS} font-mono`}
                />
              </CmsField>
            </div>
          );
        })}
      </div>

      {/* Custom Scripts & Live Event Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${CMS_CARD} lg:col-span-7 p-5 sm:p-6 space-y-5`}>
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-[#B8006D] dark:text-[#FF66C4]" aria-hidden="true" />
            <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
              Custom Code Injection (Head, Body & Conversion Callback)
            </h3>
          </div>

          <CmsField
            label="Custom <head> HTML / Scripts"
            htmlFor="custom-head-scripts"
            hint="Injected inside <head>. Suitable for Hotjar, Clarity, domain verification meta tags, or custom analytics."
          >
            <textarea
              id="custom-head-scripts"
              rows={4}
              value={draft.customHeadScripts || ''}
              placeholder="<!-- Paste <script> or <meta> tags for <head> -->"
              onChange={(e) => updateField('customHeadScripts', e.target.value)}
              className={`${CMS_INPUT_CLASS} font-mono text-xs`}
            />
          </CmsField>

          <CmsField
            label="Custom <body> Start HTML (Opening Body)"
            htmlFor="custom-body-start"
            hint="Prepended right after opening <body> (e.g. GTM noscript fallback iframes)."
          >
            <textarea
              id="custom-body-start"
              rows={3}
              value={draft.customBodyStartScripts || ''}
              placeholder="<!-- Paste HTML/noscript snippet for top of <body> -->"
              onChange={(e) => updateField('customBodyStartScripts', e.target.value)}
              className={`${CMS_INPUT_CLASS} font-mono text-xs`}
            />
          </CmsField>

          <CmsField
            label="Custom <body> End Scripts (Before </body>)"
            htmlFor="custom-body-end"
            hint="Appended at the end of <body> (e.g. chat widgets or deferred remarketing tags)."
          >
            <textarea
              id="custom-body-end"
              rows={3}
              value={draft.customBodyEndScripts || ''}
              placeholder="<!-- Paste <script> tags for end of <body> -->"
              onChange={(e) => updateField('customBodyEndScripts', e.target.value)}
              className={`${CMS_INPUT_CLASS} font-mono text-xs`}
            />
          </CmsField>

          <CmsField
            label="Custom JavaScript Lead Conversion Hook (Receives `lead` Object)"
            htmlFor="custom-conversion-js"
            hint="Executed automatically when a visitor submits a lead. Example: console.info('Lead captured:', lead.source);"
          >
            <textarea
              id="custom-conversion-js"
              rows={4}
              value={draft.customConversionScript || ''}
              placeholder="// JavaScript executed on lead submission; `lead` parameter is available"
              onChange={(e) => updateField('customConversionScript', e.target.value)}
              className={`${CMS_INPUT_CLASS} font-mono text-xs`}
            />
          </CmsField>
        </div>

        {/* Live Pixel Event Inspector */}
        <div className={`${CMS_CARD} lg:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-4`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#B8006D] dark:text-[#FF66C4]" aria-hidden="true" />
                <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                  Live Pixel Event Inspector ({eventLog.length})
                </h3>
              </div>
              {eventLog.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    clearPixelEventLog();
                    setEventLog([]);
                  }}
                  className={CMS_BTN_SECONDARY}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Displays browser-side pixel initialization, PageView, and Lead conversion events dispatched during this session.
            </p>

            {eventLog.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  No pixel events recorded in this session
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Enable a pixel above or click &ldquo;Fire Test Conversion&rdquo; to inspect event dispatch in real time.
                </p>
              </div>
            ) : (
              <div className="max-h-[460px] overflow-y-auto space-y-2.5 pr-1">
                {eventLog.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#B8006D] dark:text-[#FF66C4]">
                        {entry.provider}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {entry.event}
                    </p>
                    {entry.targetId && (
                      <p className="text-xs font-mono text-slate-600 dark:text-slate-400 truncate">
                        Target: {entry.targetId}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

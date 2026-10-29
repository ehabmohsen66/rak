import React, { useState, useEffect } from 'react';
import {
  Save,
  Send,
  Loader2,
  Eye,
  EyeOff,
  Mail,
  Server,
  RefreshCw
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
import { DEFAULT_EMAIL_SETTINGS } from '../../data/contentData';

const TEMPLATE_VARIABLES = [
  '{{name}}',
  '{{company}}',
  '{{service}}',
  '{{role}}',
  '{{budget}}'
];

export default function EmailSettingsPanel({
  onFetchEmailSettings,
  onSaveEmailSettings,
  onSendTestEmail
}) {
  const [draft, setDraft] = useState(() => ({ ...DEFAULT_EMAIL_SETTINGS }));
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [notice, setNotice] = useState(null);

  const [testRecipient, setTestRecipient] = useState('');
  const [sendingTest, setSendingTest] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const res = await onFetchEmailSettings();
      if (res && res.ok && res.emailSettings) {
        setDraft(res.emailSettings);
        setIsDirty(false);
        if (!testRecipient && (res.emailSettings.notifyEmails || res.emailSettings.fromEmail)) {
          setTestRecipient(res.emailSettings.notifyEmails || res.emailSettings.fromEmail);
        }
      } else {
        setLoadError(res?.error || 'Could not load email settings from server.');
      }
    } catch {
      setLoadError('Network error while reading /api/index.php?route=email-settings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateField = (key, value) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setNotice(null);
    try {
      const res = await onSaveEmailSettings(draft);
      if (res && res.ok) {
        setIsDirty(false);
        if (res.emailSettings) {
          setDraft((prev) => ({ ...prev, ...res.emailSettings }));
        }
        setNotice({
          tone: 'success',
          title: 'Email & SMTP configuration saved',
          message: 'All incoming leads will use these routing and auto-responder settings.'
        });
      } else {
        setNotice({
          tone: 'error',
          title: 'Failed to save email settings',
          message: res?.error || 'Verify your session and storage writability.'
        });
      }
    } catch {
      setNotice({
        tone: 'error',
        title: 'Network error',
        message: 'Could not reach /api/index.php?route=email-settings.'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTest = async (e) => {
    e.preventDefault();
    if (!testRecipient.trim()) return;
    setSendingTest(true);
    setNotice(null);
    try {
      const res = await onSendTestEmail(testRecipient.trim(), draft);
      if (res?.deliveryLogs) {
        setDraft((prev) => ({ ...prev, deliveryLogs: res.deliveryLogs }));
      }
      if (res && res.ok) {
        setNotice({
          tone: 'success',
          title: 'Diagnostic email dispatched',
          message:
            res.result?.message ||
            `Test email handed off to ${draft.driver.toUpperCase()} transport for ${testRecipient.trim()}.`
        });
      } else {
        setNotice({
          tone: 'warning',
          title: 'Test email reported a transport warning',
          message:
            res?.result?.message ||
            res?.error ||
            'Check your cPanel mail domain or SMTP credentials.'
        });
      }
    } catch {
      setNotice({
        tone: 'error',
        title: 'Test request failed',
        message: 'Could not connect to /api/index.php?route=test-email.'
      });
    } finally {
      setSendingTest(false);
    }
  };

  const insertVariable = (token) => {
    updateField('autoResponderBody', `${draft.autoResponderBody || ''}${token}`);
  };

  const logs = Array.isArray(draft.deliveryLogs) ? draft.deliveryLogs : [];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className={`${CMS_CARD} p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4`}>
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-lg sm:text-xl font-heading font-bold text-slate-900 dark:text-white">
              Email Routing & cPanel SMTP
            </h2>
            <CmsStatusBadge tone="brand">
              Driver: {(draft.driver || 'mail').toUpperCase()}
            </CmsStatusBadge>
            {isDirty && <CmsStatusBadge tone="warning">Unsaved changes</CmsStatusBadge>}
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Configure cPanel local PHP mail or authenticated SSL/TLS SMTP, internal team notification recipients, and lead confirmation auto-responders.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={loadSettings}
            disabled={loading}
            className={CMS_BTN_SECONDARY}
          >
            <RefreshCw
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>Reload</span>
          </button>
          <button
            type="button"
            disabled={saving || loading}
            onClick={handleSave}
            className={CMS_BTN_PRIMARY}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Save className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{saving ? 'Saving...' : 'Save Email Config'}</span>
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

      {loadError && (
        <CmsBanner
          tone="error"
          title="Failed to load email configuration"
          message={loadError}
        />
      )}

      {loading ? (
        <div className={`${CMS_CARD} p-12 flex flex-col items-center justify-center gap-3`}>
          <Loader2 className="w-7 h-7 animate-spin text-[#D1007C]" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Loading email settings...
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Transport & Sender Configuration */}
            <div className={`${CMS_CARD} lg:col-span-7 p-5 sm:p-6 space-y-5`}>
              <div className="flex items-center gap-2">
                <Server className="w-5 h-5 text-[#B8006D] dark:text-[#FF66C4]" aria-hidden="true" />
                <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                  Mail Transport Driver
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => updateField('driver', 'mail')}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    draft.driver !== 'smtp'
                      ? 'border-[#D1007C] bg-pink-50/70 dark:bg-pink-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
                  }`}
                >
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    cPanel Local PHP mail()
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Uses cPanel local Exim MTA with zero external credentials. Ensure From Email matches your cPanel domain.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => updateField('driver', 'smtp')}
                  className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${
                    draft.driver === 'smtp'
                      ? 'border-[#D1007C] bg-pink-50/70 dark:bg-pink-950/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40'
                  }`}
                >
                  <p className="text-sm font-bold text-slate-900 dark:text-white">
                    Authenticated SMTP Socket
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                    Connects via SSL (465) or STARTTLS (587) to cPanel Email Accounts, Google Workspace, Microsoft 365, or SendGrid.
                  </p>
                </button>
              </div>

              {draft.driver === 'smtp' && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <CmsField label="SMTP Host" htmlFor="smtp-host" className="sm:col-span-2">
                      <input
                        id="smtp-host"
                        type="text"
                        value={draft.smtpHost || ''}
                        placeholder="mail.yourdomain.com"
                        onChange={(e) => updateField('smtpHost', e.target.value)}
                        className={`${CMS_INPUT_CLASS} font-mono`}
                      />
                    </CmsField>
                    <CmsField label="Port" htmlFor="smtp-port">
                      <input
                        id="smtp-port"
                        type="number"
                        value={draft.smtpPort || 465}
                        onChange={(e) => updateField('smtpPort', Number(e.target.value) || 465)}
                        className={`${CMS_INPUT_CLASS} font-mono`}
                      />
                    </CmsField>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <CmsField label="Encryption" htmlFor="smtp-enc">
                      <select
                        id="smtp-enc"
                        value={draft.smtpEncryption || 'ssl'}
                        onChange={(e) => {
                          const enc = e.target.value;
                          updateField('smtpEncryption', enc);
                          if (enc === 'ssl' && Number(draft.smtpPort) === 587) {
                            updateField('smtpPort', 465);
                          } else if (enc === 'tls' && Number(draft.smtpPort) === 465) {
                            updateField('smtpPort', 587);
                          }
                        }}
                        className={CMS_INPUT_CLASS}
                      >
                        <option value="ssl">SSL / Implicit TLS (Port 465)</option>
                        <option value="tls">STARTTLS (Port 587)</option>
                        <option value="none">None / Local Relay (Port 25)</option>
                      </select>
                    </CmsField>

                    <CmsField label="SMTP Username" htmlFor="smtp-user">
                      <input
                        id="smtp-user"
                        type="text"
                        value={draft.smtpUser || ''}
                        placeholder="hello@yourdomain.com"
                        onChange={(e) => updateField('smtpUser', e.target.value)}
                        className={CMS_INPUT_CLASS}
                      />
                    </CmsField>

                    <CmsField label="SMTP Password" htmlFor="smtp-pass">
                      <div className="relative">
                        <input
                          id="smtp-pass"
                          type={showSmtpPass ? 'text' : 'password'}
                          value={draft.smtpPass || ''}
                          placeholder="Mailbox or API password"
                          onChange={(e) => updateField('smtpPass', e.target.value)}
                          className={`${CMS_INPUT_CLASS} pr-11`}
                        />
                        <button
                          type="button"
                          aria-label={showSmtpPass ? 'Hide SMTP password' : 'Show SMTP password'}
                          onClick={() => setShowSmtpPass(!showSmtpPass)}
                          className="absolute right-1.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200/70 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          {showSmtpPass ? (
                            <EyeOff className="w-4 h-4" aria-hidden="true" />
                          ) : (
                            <Eye className="w-4 h-4" aria-hidden="true" />
                          )}
                        </button>
                      </div>
                    </CmsField>
                  </div>
                </div>
              )}

              <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-[#B8006D] dark:text-[#FF66C4]" aria-hidden="true" />
                  <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                    Sender Identity & Team Notification Routing
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <CmsField label="Sender Display Name" htmlFor="em-from-name">
                    <input
                      id="em-from-name"
                      type="text"
                      value={draft.fromName || ''}
                      onChange={(e) => updateField('fromName', e.target.value)}
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="From Email Address" htmlFor="em-from-addr">
                    <input
                      id="em-from-addr"
                      type="email"
                      value={draft.fromEmail || ''}
                      placeholder="hello@yourdomain.com"
                      onChange={(e) => updateField('fromEmail', e.target.value)}
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="Reply-To Email" htmlFor="em-replyto">
                    <input
                      id="em-replyto"
                      type="email"
                      value={draft.replyToEmail || ''}
                      placeholder="hello@yourdomain.com"
                      onChange={(e) => updateField('replyToEmail', e.target.value)}
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                </div>

                <CmsToggle
                  id="em-admin-notify"
                  label="Send Instant Lead Alert Emails to Agency Team"
                  description="Dispatches a formatted lead dossier whenever any public intake form is submitted."
                  checked={draft.enableAdminNotification !== false}
                  onChange={(val) => updateField('enableAdminNotification', val)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CmsField
                    label="Primary Notification Recipients (Comma Separated)"
                    htmlFor="em-notify"
                  >
                    <input
                      id="em-notify"
                      type="text"
                      value={draft.notifyEmails || ''}
                      placeholder="hello@yourdomain.com, leads@yourdomain.com"
                      onChange={(e) => updateField('notifyEmails', e.target.value)}
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <CmsField label="CC Recipients (Optional)" htmlFor="em-cc">
                    <input
                      id="em-cc"
                      type="text"
                      value={draft.ccEmails || ''}
                      placeholder="director@yourdomain.com"
                      onChange={(e) => updateField('ccEmails', e.target.value)}
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                </div>

                <CmsField label="Admin Alert Subject Prefix" htmlFor="em-prefix">
                  <input
                    id="em-prefix"
                    type="text"
                    value={draft.subjectPrefix || ''}
                    placeholder="[RAK4Creative Lead]"
                    onChange={(e) => updateField('subjectPrefix', e.target.value)}
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
              </div>
            </div>

            {/* Auto-Responder & Live Diagnostic Sender */}
            <div className="lg:col-span-5 space-y-6">
              <div className={`${CMS_CARD} p-5 sm:p-6 space-y-4`}>
                <CmsToggle
                  id="em-autoresponder"
                  label="Automated Lead Confirmation Auto-Responder"
                  description="Sends an immediate confirmation email to the visitor or job applicant after submission."
                  checked={draft.enableAutoResponder !== false}
                  onChange={(val) => updateField('enableAutoResponder', val)}
                />

                <CmsField label="Auto-Responder Subject" htmlFor="em-auto-subj">
                  <input
                    id="em-auto-subj"
                    type="text"
                    value={draft.autoResponderSubject || ''}
                    onChange={(e) => updateField('autoResponderSubject', e.target.value)}
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <div className="space-y-2">
                  <CmsField
                    label="Auto-Responder Message Template"
                    htmlFor="em-auto-body"
                    hint="Click any merge tag below to insert dynamic lead fields."
                  >
                    <textarea
                      id="em-auto-body"
                      rows={7}
                      value={draft.autoResponderBody || ''}
                      onChange={(e) => updateField('autoResponderBody', e.target.value)}
                      className={CMS_INPUT_CLASS}
                    />
                  </CmsField>
                  <div className="flex flex-wrap gap-1.5">
                    {TEMPLATE_VARIABLES.map((token) => (
                      <button
                        key={token}
                        type="button"
                        onClick={() => insertVariable(token)}
                        className="min-h-[36px] px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold text-slate-800 dark:text-slate-200 hover:border-[#D1007C] cursor-pointer"
                      >
                        + {token}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Diagnostic Test Email Card */}
              <div className={`${CMS_CARD} p-5 sm:p-6 space-y-4`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                    Send Diagnostic Test Email
                  </h3>
                  {draft.notifyEmails && testRecipient !== draft.notifyEmails && (
                    <button
                      type="button"
                      onClick={() => setTestRecipient(draft.notifyEmails)}
                      className="text-xs font-bold text-[#B8006D] dark:text-[#FF66C4] hover:underline cursor-pointer"
                    >
                      Use Active Lead Recipients
                    </button>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Supports single or comma-separated recipients (including Name &lt;email@domain.com&gt;) to verify delivery to all lead inboxes at once.
                </p>
                <form onSubmit={handleSendTest} className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    required
                    aria-label="Test email recipient addresses"
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    placeholder="recipient@yourdomain.com, second@yourdomain.com"
                    className={`${CMS_INPUT_CLASS} flex-1`}
                  />
                  <button
                    type="submit"
                    disabled={sendingTest || !testRecipient.trim()}
                    className={`${CMS_BTN_PRIMARY} shrink-0`}
                  >
                    {sendingTest ? (
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Send className="w-4 h-4" aria-hidden="true" />
                    )}
                    <span>{sendingTest ? 'Sending...' : 'Send Test'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Email Delivery Logs */}
          <div className={`${CMS_CARD} p-5 sm:p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-heading font-bold text-slate-900 dark:text-white">
                Recent Email Delivery Log ({logs.length})
              </h3>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                Retains the 50 most recent dispatches
              </span>
            </div>

            {logs.length === 0 ? (
              <div className="p-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 text-center text-sm text-slate-600 dark:text-slate-400">
                No email dispatches logged yet. Send a diagnostic test email above or submit a form to populate delivery telemetry.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-xs uppercase text-slate-600 dark:text-slate-400">
                      <th className="py-3 pr-4 font-bold">Time</th>
                      <th className="py-3 pr-4 font-bold">Type</th>
                      <th className="py-3 pr-4 font-bold">Recipient</th>
                      <th className="py-3 pr-4 font-bold">Driver</th>
                      <th className="py-3 pr-4 font-bold">Status</th>
                      <th className="py-3 font-bold">Server Detail</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {logs.map((entry) => (
                      <tr key={entry.id}>
                        <td className="py-3 pr-4 font-mono text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {entry.timestamp
                            ? new Date(entry.timestamp).toLocaleString()
                            : ''}
                        </td>
                        <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                          {entry.type}
                        </td>
                        <td className="py-3 pr-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {entry.recipient}
                        </td>
                        <td className="py-3 pr-4 font-mono text-xs uppercase text-slate-700 dark:text-slate-300">
                          {entry.driver}
                        </td>
                        <td className="py-3 pr-4 whitespace-nowrap">
                          {entry.ok ? (
                            <CmsStatusBadge tone="success">Dispatched</CmsStatusBadge>
                          ) : (
                            <CmsStatusBadge tone="warning">Warning / Queued</CmsStatusBadge>
                          )}
                        </td>
                        <td className="py-3 text-xs text-slate-600 dark:text-slate-400">
                          {entry.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

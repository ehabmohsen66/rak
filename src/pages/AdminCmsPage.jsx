import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText,
  Radio,
  Inbox,
  Mail,
  ShieldCheck,
  Sun,
  Moon,
  ExternalLink,
  KeyRound,
  LogOut,
  Eye,
  EyeOff,
  Loader2,
  X,
  ArrowLeft
} from 'lucide-react';
import { useCms } from '../lib/cmsContext';
import {
  CMS_BTN_PRIMARY,
  CMS_BTN_SECONDARY,
  CMS_CARD,
  CMS_INPUT_CLASS,
  CmsField,
  CmsStatusBadge,
  CmsBanner
} from '../components/cms/cmsTheme';
import ContentStudioPanel from '../components/cms/ContentStudioPanel';
import PixelsPanel from '../components/cms/PixelsPanel';
import LeadsCrmPanel from '../components/cms/LeadsCrmPanel';
import EmailSettingsPanel from '../components/cms/EmailSettingsPanel';
import SystemAuditPanel from '../components/cms/SystemAuditPanel';

const PRIMARY_MODULES = [
  { id: 'content', label: 'Content Studio', icon: FileText },
  { id: 'pixels', label: 'Pixels & Scripts', icon: Radio },
  { id: 'leads', label: 'Leads CRM', icon: Inbox },
  { id: 'email', label: 'Email & SMTP', icon: Mail },
  { id: 'audit', label: 'Pre-Launch Audit', icon: ShieldCheck }
];

export default function AdminCmsPage({
  darkMode = false,
  setDarkMode = () => {},
  onNavigateSite = () => {}
}) {
  const {
    content,
    pixels,
    adminUser,
    isAuthenticated,
    serverInfo,
    refreshBootstrap,
    login,
    logout,
    changePassword,
    saveContent,
    resetToDefaultContent,
    savePixels,
    submitLead,
    fetchLeads,
    updateLead,
    deleteLead,
    fetchEmailSettings,
    saveEmailSettings,
    sendTestEmail,
    uploadMediaFile,
    runServerAudit
  } = useCms();

  const [activeModule, setActiveModule] = useState('content');

  // Sign-In state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Leads state lifted so header tab can show live new-lead count
  const [leads, setLeads] = useState([]);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [leadsError, setLeadsError] = useState('');

  // Account Security modal state
  const [securityOpen, setSecurityOpen] = useState(false);
  const [secCurrentPassword, setSecCurrentPassword] = useState('');
  const [secNewUsername, setSecNewUsername] = useState('');
  const [secNewPassword, setSecNewPassword] = useState('');
  const [secSaving, setSecSaving] = useState(false);
  const [secNotice, setSecNotice] = useState(null);

  const loadLeadsList = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingLeads(true);
    setLeadsError('');
    try {
      const res = await fetchLeads();
      if (res && res.ok) {
        setLeads(Array.isArray(res.leads) ? res.leads : []);
      } else {
        setLeadsError(res?.error || 'Could not load leads.');
      }
    } catch {
      setLeadsError('Network error while fetching leads.');
    } finally {
      setLoadingLeads(false);
    }
  }, [isAuthenticated, fetchLeads]);

  useEffect(() => {
    if (isAuthenticated) {
      loadLeadsList();
    } else {
      setLeads([]);
    }
  }, [isAuthenticated, loadLeadsList]);

  useEffect(() => {
    if (!securityOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setSecurityOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [securityOpen]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const rawUser = loginUsername.trim() || formEl?.elements?.username?.value?.trim() || '';
    const rawPass = loginPassword || formEl?.elements?.password?.value || '';
    if (!rawUser || !rawPass) {
      setLoginError('Enter both username and password.');
      return;
    }
    setLoggingIn(true);
    setLoginError('');
    try {
      const res = await login(rawUser, rawPass);
      if (res && res.ok) {
        setLoginPassword('');
      } else {
        setLoginError(res?.error || 'Invalid administrator credentials.');
      }
    } catch {
      setLoginError('Unable to reach /api/index.php?route=login. Verify PHP server connection.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecSaving(true);
    setSecNotice(null);
    try {
      const res = await changePassword(
        secCurrentPassword,
        secNewUsername.trim(),
        secNewPassword
      );
      if (res && res.ok) {
        setSecCurrentPassword('');
        setSecNewPassword('');
        setSecNotice({
          tone: 'success',
          message: 'Administrator credentials updated and new session token issued.'
        });
      } else {
        setSecNotice({
          tone: 'error',
          message: res?.error || 'Could not update credentials.'
        });
      }
    } catch {
      setSecNotice({
        tone: 'error',
        message: 'Network error while updating credentials.'
      });
    } finally {
      setSecSaving(false);
    }
  };

  const newLeadsCount = leads.filter((l) => (l.status || 'new') === 'new').length;

  // UNAUTHENTICATED GATE
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#07080B] text-slate-900 dark:text-slate-100 flex flex-col justify-between p-4 sm:p-8">
        <header className="max-w-6xl w-full mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onNavigateSite('home', '/')}
            className={CMS_BTN_SECONDARY}
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Website</span>
          </button>

          <button
            type="button"
            aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            onClick={() => setDarkMode(!darkMode)}
            className={CMS_BTN_SECONDARY}
          >
            {darkMode ? (
              <Sun className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Moon className="w-4 h-4" aria-hidden="true" />
            )}
            <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
          </button>
        </header>

        <main className="my-auto py-10 flex items-center justify-center">
          <div className={`${CMS_CARD} w-full max-w-md p-6 sm:p-8 space-y-6`}>
            <div className="space-y-2">
              <CmsStatusBadge tone="brand">RAK 4 CREATIVE · CMS Operations</CmsStatusBadge>
              <h1 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">
                Administrator Sign In
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sign in to manage website content, marketing pixels, incoming leads, email routing, and pre-launch audits.
              </p>
            </div>

            {loginError && (
              <CmsBanner
                tone="error"
                title="Authentication failed"
                message={loginError}
                onDismiss={() => setLoginError('')}
              />
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <CmsField label="Username or Admin Email" htmlFor="cms-login-user" required>
                <input
                  id="cms-login-user"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>

              <CmsField label="Password" htmlFor="cms-login-pass" required>
                <div className="relative">
                  <input
                    id="cms-login-pass"
                    name="password"
                    type={showLoginPass ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className={`${CMS_INPUT_CLASS} pr-12`}
                  />
                  <button
                    type="button"
                    aria-label={showLoginPass ? 'Hide password' : 'Show password'}
                    onClick={() => setShowLoginPass(!showLoginPass)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    {showLoginPass ? (
                      <EyeOff className="w-4 h-4" aria-hidden="true" />
                    ) : (
                      <Eye className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </CmsField>

              <button
                type="submit"
                disabled={loggingIn}
                className={`${CMS_BTN_PRIMARY} w-full`}
              >
                {loggingIn && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                <span>{loggingIn ? 'Signing In...' : 'Access CMS Workspace'}</span>
              </button>
            </form>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>
                API Status:{' '}
                <strong className="text-slate-900 dark:text-slate-200">
                  {serverInfo.connected ? 'Online' : 'Standby'}
                </strong>
              </span>
              {serverInfo.phpVersion && (
                <span className="font-mono">Runtime: {serverInfo.phpVersion}</span>
              )}
            </div>
          </div>
        </main>

        <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-600 dark:text-slate-400">
          RAK 4 CREATIVE CMS · Hosted on cPanel PHP Architecture
        </footer>
      </div>
    );
  }

  // AUTHENTICATED CMS WORKSPACE
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#07080B] text-slate-900 dark:text-slate-100 flex flex-col">
      {/* Sticky Top Command Bar */}
      <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D1007C] text-white font-heading font-bold flex items-center justify-center text-sm shadow-sm">
              R4
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-heading font-bold text-slate-900 dark:text-white">
                  RAK 4 CREATIVE CMS
                </h1>
                <CmsStatusBadge tone={serverInfo.connected ? 'success' : 'warning'}>
                  {serverInfo.connected ? 'API Connected' : 'Local Cache'}
                </CmsStatusBadge>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Signed in as <strong>{adminUser?.username || 'admin'}</strong>
                {serverInfo.phpVersion ? ` · Runtime ${serverInfo.phpVersion}` : ''}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigateSite('home', '/')}
              className={CMS_BTN_SECONDARY}
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              <span>Live Site</span>
            </button>

            <button
              type="button"
              aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
              onClick={() => setDarkMode(!darkMode)}
              className={CMS_BTN_SECONDARY}
            >
              {darkMode ? (
                <Sun className="w-4 h-4" aria-hidden="true" />
              ) : (
                <Moon className="w-4 h-4" aria-hidden="true" />
              )}
              <span className="hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSecNewUsername(adminUser?.username || 'admin');
                setSecNotice(null);
                setSecurityOpen(true);
              }}
              className={CMS_BTN_SECONDARY}
            >
              <KeyRound className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Account Security</span>
            </button>

            <button type="button" onClick={logout} className={CMS_BTN_SECONDARY}>
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Module Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
          <nav
            role="tablist"
            aria-label="CMS Primary Modules"
            className="flex items-center gap-2 overflow-x-auto"
          >
            {PRIMARY_MODULES.map((mod) => {
              const Icon = mod.icon;
              const active = activeModule === mod.id;
              return (
                <button
                  key={mod.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveModule(mod.id)}
                  className={`inline-flex items-center gap-2 min-h-[44px] px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap border transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#D1007C] text-white border-[#D1007C]'
                      : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-[#D1007C]'
                  }`}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{mod.label}</span>
                  {mod.id === 'leads' && newLeadsCount > 0 && (
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full font-bold ${
                        active
                          ? 'bg-white text-[#B8006D]'
                          : 'bg-[#D1007C] text-white'
                      }`}
                    >
                      {newLeadsCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Module Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeModule === 'content' && (
          <ContentStudioPanel
            content={content}
            onSaveContent={saveContent}
            onResetDefaultContent={resetToDefaultContent}
            onUploadFile={uploadMediaFile}
          />
        )}

        {activeModule === 'pixels' && (
          <PixelsPanel pixels={pixels} onSavePixels={savePixels} />
        )}

        {activeModule === 'leads' && (
          <LeadsCrmPanel
            leads={leads}
            loadingLeads={loadingLeads}
            leadsError={leadsError}
            onRefreshLeads={loadLeadsList}
            onUpdateLead={updateLead}
            onDeleteLead={deleteLead}
            onCreateManualLead={submitLead}
          />
        )}

        {activeModule === 'email' && (
          <EmailSettingsPanel
            onFetchEmailSettings={fetchEmailSettings}
            onSaveEmailSettings={saveEmailSettings}
            onSendTestEmail={sendTestEmail}
          />
        )}

        {activeModule === 'audit' && (
          <SystemAuditPanel
            onRunServerAudit={runServerAudit}
            onRefreshBootstrap={refreshBootstrap}
            onSubmitLead={submitLead}
            onFetchLeads={async () => {
              const res = await fetchLeads();
              if (res?.ok && Array.isArray(res.leads)) {
                setLeads(res.leads);
              }
              return res;
            }}
            onUpdateLead={updateLead}
            onDeleteLead={async (id) => {
              const res = await deleteLead(id);
              if (res?.ok && Array.isArray(res.leads)) {
                setLeads(res.leads);
              }
              return res;
            }}
          />
        )}
      </main>

      {/* Account Security Modal */}
      {securityOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="account-security-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div className={`${CMS_CARD} w-full max-w-md p-6 space-y-4`}>
            <div className="flex items-center justify-between">
              <h2
                id="account-security-modal-title"
                className="text-lg font-heading font-bold text-slate-900 dark:text-white"
              >
                Rotate Administrator Credentials
              </h2>
              <button
                type="button"
                aria-label="Close Account Security modal"
                onClick={() => setSecurityOpen(false)}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            {secNotice && (
              <CmsBanner
                tone={secNotice.tone}
                message={secNotice.message}
                onDismiss={() => setSecNotice(null)}
              />
            )}

            <form onSubmit={handleSecuritySubmit} className="space-y-4">
              <CmsField label="New Username" htmlFor="sec-new-user" required>
                <input
                  id="sec-new-user"
                  type="text"
                  required
                  value={secNewUsername}
                  onChange={(e) => setSecNewUsername(e.target.value)}
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>

              <CmsField label="Current Password" htmlFor="sec-cur-pass" required>
                <input
                  id="sec-cur-pass"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={secCurrentPassword}
                  onChange={(e) => setSecCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>

              <CmsField
                label="New Password (Minimum 8 Characters)"
                htmlFor="sec-new-pass"
                required
              >
                <input
                  id="sec-new-pass"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={secNewPassword}
                  onChange={(e) => setSecNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSecurityOpen(false)}
                  className={CMS_BTN_SECONDARY}
                >
                  Close
                </button>
                <button type="submit" disabled={secSaving} className={CMS_BTN_PRIMARY}>
                  {secSaving ? 'Updating...' : 'Update Credentials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

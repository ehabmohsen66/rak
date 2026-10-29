import React, { useState, useEffect, useCallback } from 'react';
import {
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
  ArrowLeft,
  Menu
} from 'lucide-react';
import { useCms } from '../lib/cmsContext';
import {
  CMS_BTN_PRIMARY,
  CMS_BTN_SECONDARY,
  CMS_BTN_GHOST,
  CMS_ICON_BTN,
  CMS_INPUT_CLASS,
  CmsField,
  CmsBanner,
  CmsDialog
} from '../components/cms/cmsTheme';
import ContentStudioPanel, { CONTENT_SECTIONS } from '../components/cms/ContentStudioPanel';
import PixelsPanel from '../components/cms/PixelsPanel';
import LeadsCrmPanel from '../components/cms/LeadsCrmPanel';
import EmailSettingsPanel from '../components/cms/EmailSettingsPanel';
import SystemAuditPanel from '../components/cms/SystemAuditPanel';

const NAV_GROUPS = [
  {
    label: 'Website content',
    items: CONTENT_SECTIONS.map((s) => ({
      key: `content:${s.id}`,
      module: 'content',
      section: s.id,
      label: s.label,
      icon: s.icon
    }))
  },
  {
    label: 'Inbox & tracking',
    items: [
      { key: 'leads', module: 'leads', label: 'Leads', icon: Inbox },
      { key: 'pixels', module: 'pixels', label: 'Pixels & Tracking', icon: Radio }
    ]
  },
  {
    label: 'Settings',
    items: [
      { key: 'email', module: 'email', label: 'Email & SMTP', icon: Mail },
      { key: 'audit', module: 'audit', label: 'Pre-Launch Audit', icon: ShieldCheck }
    ]
  }
];

function Logo({ className = 'h-7' }) {
  return (
    <>
      <img src="/RAK4CREATIVE-LOGO.png" alt="RAK 4 CREATIVE" className={`${className} w-auto dark:hidden`} />
      <img src="/RAK4CREATIVE-LOGO-WHITE.png" alt="RAK 4 CREATIVE" className={`${className} w-auto hidden dark:block`} />
    </>
  );
}

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
  const [contentSection, setContentSection] = useState('banners');
  const [contentDirty, setContentDirty] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  // Sign-In state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Leads state lifted so the sidebar can show the live new-lead count
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
    if (!navOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [navOpen]);

  const handleDirtyChange = useCallback((dirty) => setContentDirty(dirty), []);

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
      setLoginError('Unable to reach the CMS API. Check that PHP is running on the server.');
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
          message: 'Credentials updated. You stay signed in with a fresh session.'
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

  const handleSignOut = () => {
    if (contentDirty && !window.confirm('You have unpublished content changes. Sign out and lose them?')) {
      return;
    }
    logout();
  };

  const newLeadsCount = leads.filter((l) => (l.status || 'new') === 'new').length;
  const username = adminUser?.username || 'admin';

  const themeToggle = (
    <button
      type="button"
      aria-label={darkMode ? 'Switch to light theme' : 'Switch to dark theme'}
      title={darkMode ? 'Light theme' : 'Dark theme'}
      onClick={() => setDarkMode(!darkMode)}
      className={CMS_ICON_BTN}
    >
      {darkMode ? <Sun className="w-4 h-4" aria-hidden="true" /> : <Moon className="w-4 h-4" aria-hidden="true" />}
    </button>
  );

  // UNAUTHENTICATED GATE
  if (!isAuthenticated) {
    return (
      <div className="cms-shell min-h-screen bg-[#F4F4F6] dark:bg-[#0B0B0E] text-slate-900 dark:text-slate-100 flex flex-col">
        <header className="w-full max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 sm:px-8 py-4">
          <button type="button" onClick={() => onNavigateSite('home', '/')} className={CMS_BTN_GHOST}>
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to website</span>
          </button>
          {themeToggle}
        </header>

        <main className="flex-1 flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-[400px] space-y-8">
            <div className="space-y-5 text-center">
              <div className="flex justify-center">
                <Logo className="h-10" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl font-semibold text-slate-900 dark:text-white">Sign in to the CMS</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Manage page banners, content, leads and tracking.
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-black/[0.07] dark:border-white/[0.07] bg-white dark:bg-[#141418] p-6 sm:p-7 space-y-5 shadow-sm">
              {loginError && (
                <CmsBanner
                  tone="error"
                  title="Sign-in failed"
                  message={loginError}
                  onDismiss={() => setLoginError('')}
                />
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <CmsField label="Username or email" htmlFor="cms-login-user">
                  <input
                    id="cms-login-user"
                    name="username"
                    type="text"
                    required
                    autoComplete="username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Username"
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>

                <CmsField label="Password" htmlFor="cms-login-pass">
                  <div className="relative">
                    <input
                      id="cms-login-pass"
                      name="password"
                      type={showLoginPass ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={`${CMS_INPUT_CLASS} pr-11`}
                    />
                    <button
                      type="button"
                      aria-label={showLoginPass ? 'Hide password' : 'Show password'}
                      onClick={() => setShowLoginPass(!showLoginPass)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-8 sm:h-8 rounded-md flex items-center justify-center text-slate-500 hover:bg-black/[0.05] dark:hover:bg-white/[0.08] cursor-pointer"
                    >
                      {showLoginPass ? (
                        <EyeOff className="w-4 h-4" aria-hidden="true" />
                      ) : (
                        <Eye className="w-4 h-4" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </CmsField>

                <button type="submit" disabled={loggingIn} className={`${CMS_BTN_PRIMARY} w-full`}>
                  {loggingIn && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                  <span>{loggingIn ? 'Signing in…' : 'Sign in'}</span>
                </button>
              </form>
            </div>

            <p className="flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span
                aria-hidden="true"
                className={`w-1.5 h-1.5 rounded-full ${serverInfo.connected ? 'bg-emerald-500' : 'bg-amber-500'}`}
              />
              {serverInfo.connected ? 'API online' : 'Connecting to API…'}
              {serverInfo.phpVersion && <span>· PHP {serverInfo.phpVersion}</span>}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const sidebar = (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between gap-2 px-5 h-16 shrink-0">
        <Logo className="h-7" />
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
          className={`${CMS_ICON_BTN} lg:hidden`}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>

      <nav aria-label="CMS sections" className="flex-1 overflow-y-auto px-3 pb-4 space-y-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <p className="px-2.5 pb-1.5 text-xs font-medium text-slate-500 dark:text-slate-500">{group.label}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active =
                  activeModule === item.module && (item.module !== 'content' || contentSection === item.section);
                return (
                  <li key={item.key}>
                    <button
                      type="button"
                      aria-current={active ? 'page' : undefined}
                      onClick={() => {
                        setActiveModule(item.module);
                        if (item.section) setContentSection(item.section);
                        setNavOpen(false);
                        window.scrollTo({ top: 0 });
                      }}
                      className={`group w-full flex items-center gap-2.5 min-h-[44px] lg:min-h-[36px] px-2.5 rounded-lg text-sm transition-colors cursor-pointer ${
                        active
                          ? 'bg-pink-50 dark:bg-pink-500/[0.1] text-[#B0006A] dark:text-pink-200 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          active ? 'text-[#D1007C] dark:text-pink-300' : 'text-slate-500 dark:text-slate-400'
                        }`}
                        aria-hidden="true"
                      />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.module === 'leads' && newLeadsCount > 0 && (
                        <span
                          className="min-w-[20px] h-5 px-1.5 rounded-md bg-[#D1007C] text-white text-[11px] font-semibold inline-flex items-center justify-center"
                          aria-label={`${newLeadsCount} new leads`}
                        >
                          {newLeadsCount}
                        </span>
                      )}
                      {item.module === 'content' && active && contentDirty && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" aria-label="Unpublished changes" />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-black/[0.06] dark:border-white/[0.06] p-3 space-y-1">
        <button
          type="button"
          onClick={() => onNavigateSite('home', '/')}
          className={`${CMS_BTN_GHOST} w-full justify-start`}
        >
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
          <span>View website</span>
        </button>
        <div className="flex items-center gap-2.5 px-2.5 py-2">
          <div
            aria-hidden="true"
            className="w-8 h-8 shrink-0 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center justify-center uppercase"
          >
            {username.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{username}</p>
            <p className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span
                aria-hidden="true"
                className={`w-1.5 h-1.5 rounded-full ${serverInfo.connected ? 'bg-emerald-500' : 'bg-amber-500'}`}
              />
              {serverInfo.connected ? 'API connected' : 'Offline cache'}
            </p>
          </div>
          {themeToggle}
        </div>
        <div className="grid grid-cols-2 gap-1">
          <button
            type="button"
            onClick={() => {
              setSecNewUsername(username);
              setSecNotice(null);
              setSecurityOpen(true);
              setNavOpen(false);
            }}
            className={`${CMS_BTN_GHOST} justify-start`}
          >
            <KeyRound className="w-4 h-4" aria-hidden="true" />
            <span>Security</span>
          </button>
          <button type="button" onClick={handleSignOut} className={`${CMS_BTN_GHOST} justify-start`}>
            <LogOut className="w-4 h-4" aria-hidden="true" />
            <span>Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );

  const activeLabel =
    activeModule === 'content'
      ? CONTENT_SECTIONS.find((s) => s.id === contentSection)?.label
      : NAV_GROUPS.flatMap((g) => g.items).find((i) => i.module === activeModule)?.label;

  // AUTHENTICATED CMS WORKSPACE
  return (
    <div className="cms-shell min-h-screen bg-[#F4F4F6] dark:bg-[#0B0B0E] text-slate-900 dark:text-slate-100">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30 w-64 border-r border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#111114]">
        {sidebar}
      </aside>

      {/* Mobile top bar + drawer */}
      <header className="lg:hidden sticky top-0 z-30 flex items-center gap-2 h-14 px-2 border-b border-black/[0.06] dark:border-white/[0.06] bg-white dark:bg-[#111114]">
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(true)}
          className={CMS_ICON_BTN}
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>
        <span className="flex-1 text-sm font-semibold truncate">{activeLabel}</span>
        {contentDirty && (
          <span className="mr-2 inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 dark:text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-500" aria-hidden="true" />
            Unpublished
          </span>
        )}
      </header>
      {navOpen && (
        <div className="lg:hidden fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            aria-label="Close navigation"
            tabIndex={-1}
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 bg-slate-950/50 cursor-default"
          />
          <aside className="absolute inset-y-0 left-0 w-[min(18rem,85vw)] bg-white dark:bg-[#111114] shadow-2xl">
            {sidebar}
          </aside>
        </div>
      )}

      {/* Main Module Viewport */}
      <div className="lg:pl-64">
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
          {/* Content Studio stays mounted so unpublished drafts survive module switches */}
          <div className={activeModule === 'content' ? '' : 'hidden'}>
            <ContentStudioPanel
              content={content}
              section={contentSection}
              onSaveContent={saveContent}
              onResetDefaultContent={resetToDefaultContent}
              onUploadFile={uploadMediaFile}
              onDirtyChange={handleDirtyChange}
            />
          </div>

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
      </div>

      {/* Account Security Modal */}
      <CmsDialog open={securityOpen} onClose={() => setSecurityOpen(false)} labelledBy="account-security-modal-title" size="sm">
        <div className="p-6 space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h2 id="account-security-modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
                Account security
              </h2>
              <p className="text-[13px] text-slate-500 dark:text-slate-400">Change the admin username or password.</p>
            </div>
            <button
              type="button"
              aria-label="Close account security"
              onClick={() => setSecurityOpen(false)}
              className={`${CMS_ICON_BTN} -mt-1.5 -mr-1.5`}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>

          {secNotice && (
            <CmsBanner tone={secNotice.tone} message={secNotice.message} onDismiss={() => setSecNotice(null)} />
          )}

          <form onSubmit={handleSecuritySubmit} className="space-y-4">
            <CmsField label="Username" htmlFor="sec-new-user" required>
              <input
                id="sec-new-user"
                type="text"
                required
                value={secNewUsername}
                onChange={(e) => setSecNewUsername(e.target.value)}
                className={CMS_INPUT_CLASS}
              />
            </CmsField>

            <CmsField label="Current password" htmlFor="sec-cur-pass" required>
              <input
                id="sec-cur-pass"
                type="password"
                required
                autoComplete="current-password"
                value={secCurrentPassword}
                onChange={(e) => setSecCurrentPassword(e.target.value)}
                className={CMS_INPUT_CLASS}
              />
            </CmsField>

            <CmsField label="New password" htmlFor="sec-new-pass" hint="At least 8 characters." required>
              <input
                id="sec-new-pass"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={secNewPassword}
                onChange={(e) => setSecNewPassword(e.target.value)}
                className={CMS_INPUT_CLASS}
              />
            </CmsField>

            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setSecurityOpen(false)} className={CMS_BTN_SECONDARY}>
                Cancel
              </button>
              <button type="submit" disabled={secSaving} className={CMS_BTN_PRIMARY}>
                {secSaving && <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />}
                <span>{secSaving ? 'Updating…' : 'Update credentials'}</span>
              </button>
            </div>
          </form>
        </div>
      </CmsDialog>
    </div>
  );
}

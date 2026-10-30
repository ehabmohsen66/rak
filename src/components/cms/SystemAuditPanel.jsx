import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  RefreshCw,
  Play,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Server
} from 'lucide-react';
import {
  CMS_BTN_PRIMARY,
  CMS_BTN_SECONDARY,
  CMS_CARD,
  CmsStatusBadge,
  CmsBanner
} from './cmsTheme';

export default function SystemAuditPanel({
  onRunServerAudit,
  onRefreshBootstrap,
  onSubmitLead,
  onFetchLeads,
  onUpdateLead,
  onDeleteLead
}) {
  const [auditReport, setAuditReport] = useState(null);
  const [loadingAudit, setLoadingAudit] = useState(true);
  const [auditError, setAuditError] = useState('');

  const [runningSelfTest, setRunningSelfTest] = useState(false);
  const [selfTestSteps, setSelfTestSteps] = useState([]);

  const executeAudit = async () => {
    setLoadingAudit(true);
    setAuditError('');
    try {
      const res = await onRunServerAudit();
      if (res && res.ok) {
        setAuditReport(res);
      } else {
        setAuditError(res?.error || 'Server audit endpoint returned an error.');
      }
    } catch {
      setAuditError('Network error while connecting to /api/index.php?route=audit.');
    } finally {
      setLoadingAudit(false);
    }
  };

  useEffect(() => {
    executeAudit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRunEndToEndTest = async () => {
    setRunningSelfTest(true);
    const steps = [];
    const pushStep = (step) => {
      steps.push(step);
      setSelfTestSteps([...steps]);
    };

    let createdLeadId = null;

    try {
      // Step 1: Bootstrap
      const t1 = performance.now();
      await onRefreshBootstrap();
      pushStep({
        id: 'bootstrap',
        label: '1. Public Content & Pixels Bootstrap (GET /api/index.php?route=bootstrap)',
        ok: true,
        ms: Math.round(performance.now() - t1),
        detail: 'Hydrated CMS content schema and pixel configuration.'
      });

      // Step 2: Create Diagnostic Lead (outbound emails & ad pixel conversions suppressed)
      const t2 = performance.now();
      const createRes = await onSubmitLead({
        source: 'planner',
        isDiagnostic: true,
        name: 'CMS Pre-Launch Self-Test',
        email: 'diagnostic-audit@rak4creative.com',
        company: 'RAK4Creative Internal Audit',
        service: 'Digital Consultancy',
        selectedServices: ['Digital Consultancy', 'Web & App Development'],
        budget: '$25,000 - $50,000',
        timeline: '1 - 3 Months',
        message: 'Automated pre-launch pipeline verification test.'
      });
      const step2Ok = Boolean(createRes?.ok && createRes?.lead?.id);
      createdLeadId = createRes?.lead?.id || null;
      pushStep({
        id: 'lead-create',
        label: '2. Public Intake Lead Submission (POST /api/index.php?route=leads)',
        ok: step2Ok,
        ms: Math.round(performance.now() - t2),
        detail: step2Ok
          ? `Created diagnostic lead ${createdLeadId} (live emails & ad pixels suppressed).`
          : createRes?.error || 'Lead creation failed.'
      });

      // Step 3: Read Leads CRM
      if (createdLeadId) {
        const t3 = performance.now();
        const listRes = await onFetchLeads();
        const found = (listRes?.leads || []).some((l) => l.id === createdLeadId);
        pushStep({
          id: 'lead-read',
          label: '3. Admin CRM Storage Verification (GET /api/index.php?route=leads)',
          ok: Boolean(listRes?.ok && found),
          ms: Math.round(performance.now() - t3),
          detail: found
            ? `Confirmed ${createdLeadId} persisted in leads.json.`
            : 'Created lead was not found in storage.'
        });

        // Step 4: Patch Lead Status & Notes
        const t4 = performance.now();
        const patchRes = await onUpdateLead(createdLeadId, {
          status: 'qualified',
          priority: 'high',
          notes: 'Verified by automated pre-launch audit.'
        });
        const patchOk = Boolean(
          patchRes?.ok && patchRes?.lead?.status === 'qualified'
        );
        pushStep({
          id: 'lead-patch',
          label: '4. Admin CRM Status & Notes Mutation (PATCH /api/index.php?route=leads)',
          ok: patchOk,
          ms: Math.round(performance.now() - t4),
          detail: patchOk
            ? 'Updated pipeline stage to Qualified and persisted internal note.'
            : patchRes?.error || 'Lead update failed.'
        });

        // Step 5: Delete Diagnostic Lead Cleanup
        const t5 = performance.now();
        const delRes = await onDeleteLead(createdLeadId);
        const stillExists = (delRes?.leads || []).some((l) => l.id === createdLeadId);
        pushStep({
          id: 'lead-cleanup',
          label: '5. Diagnostic Record Cleanup (DELETE /api/index.php?route=leads)',
          ok: Boolean(delRes?.ok && !stillExists),
          ms: Math.round(performance.now() - t5),
          detail: !stillExists
            ? 'Diagnostic lead removed cleanly so production CRM remains uncluttered.'
            : 'Cleanup warning: diagnostic record remained in list.'
        });
      }

      await executeAudit();
    } catch (err) {
      pushStep({
        id: 'exception',
        label: 'Pipeline Self-Test Interrupted',
        ok: false,
        ms: 0,
        detail: err?.message || 'Unexpected network exception.'
      });
    } finally {
      setRunningSelfTest(false);
    }
  };

  const checks = auditReport?.checks || [];
  const summary = auditReport?.summary || { total: 0, pass: 0, warn: 0, fail: 0 };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-6 border-b border-black/[0.07] dark:border-white/[0.07]">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="cms-page-title text-2xl sm:text-[28px] leading-tight text-slate-900 dark:text-white">
              Pre-Launch Audit
            </h1>
            {auditReport && (
              <CmsStatusBadge
                tone={summary.fail > 0 ? 'danger' : summary.warn > 0 ? 'warning' : 'success'}
              >
                {summary.pass}/{summary.total} checks passed
              </CmsStatusBadge>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Audits PHP runtime compatibility, Apache .htaccess security rules, JSON storage writability, content integrity, pixels, CRM intake, and mail configuration.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={loadingAudit}
            onClick={executeAudit}
            className={CMS_BTN_SECONDARY}
          >
            <RefreshCw
              className={`w-4 h-4 ${loadingAudit ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>Re-Run Audit</span>
          </button>
          <button
            type="button"
            disabled={runningSelfTest}
            onClick={handleRunEndToEndTest}
            className={CMS_BTN_PRIMARY}
          >
            {runningSelfTest ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Play className="w-4 h-4" aria-hidden="true" />
            )}
            <span>
              {runningSelfTest ? 'Running Pipeline Test...' : 'Run End-to-End Pipeline Test'}
            </span>
          </button>
        </div>
      </div>

      {auditError && (
        <CmsBanner
          tone="error"
          title="Audit inspection error"
          message={auditError}
        />
      )}

      {/* End-to-End Self-Test Results */}
      {selfTestSteps.length > 0 && (
        <div className={`${CMS_CARD} p-5 sm:p-6 space-y-4`}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
              Live End-to-End Pipeline Self-Test Results
            </h3>
            <CmsStatusBadge
              tone={selfTestSteps.every((s) => s.ok) ? 'success' : 'danger'}
            >
              {selfTestSteps.filter((s) => s.ok).length}/{selfTestSteps.length} steps verified
            </CmsStatusBadge>
          </div>
          <div className="space-y-2.5">
            {selfTestSteps.map((step) => (
              <div
                key={step.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3.5 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02]"
              >
                <div className="flex items-start gap-2.5">
                  {step.ok ? (
                    <CheckCircle2
                      className="w-4 h-4 mt-0.5 text-[#047857] dark:text-[#34D399] shrink-0"
                      aria-hidden="true"
                    />
                  ) : (
                    <XCircle
                      className="w-4 h-4 mt-0.5 text-[#BE123C] dark:text-[#FDA4AF] shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {step.detail}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 shrink-0">
                  {step.ms} ms
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Server & Module Readiness Checks */}
      {loadingAudit && !auditReport ? (
        <div className={`${CMS_CARD} p-12 flex flex-col items-center justify-center gap-3`}>
          <Loader2 className="w-7 h-7 animate-spin text-[#D1007C]" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Auditing server runtime and storage permissions...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checks.map((item) => {
            const isPass = item.status === 'pass';
            const isWarn = item.status === 'warn';

            return (
              <div key={item.id} className={`${CMS_CARD} p-5 space-y-3`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {item.category}
                    </span>
                    <h3 className="text-sm sm:text-[15px] font-semibold text-slate-900 dark:text-white mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                  {isPass ? (
                    <CmsStatusBadge tone="success">
                      <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>PASS</span>
                    </CmsStatusBadge>
                  ) : isWarn ? (
                    <CmsStatusBadge tone="warning">
                      <AlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>WARN</span>
                    </CmsStatusBadge>
                  ) : (
                    <CmsStatusBadge tone="danger">
                      <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>FAIL</span>
                    </CmsStatusBadge>
                  )}
                </div>

                <p className="text-xs font-mono p-2.5 rounded-lg bg-slate-100 dark:bg-[#0E0E11] text-slate-700 dark:text-slate-300 break-words">
                  {item.detail}
                </p>

                {item.recommendation && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.recommendation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* cPanel Go-Live Deployment Reference */}
      <div className={`${CMS_CARD} p-5 sm:p-6 space-y-4`}>
        <div className="flex items-center gap-2">
          <Server className="w-5 h-5 text-[#B8006D] dark:text-[#FF66C4]" aria-hidden="true" />
          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
            cPanel PHP Go-Live Checklist
          </h3>
        </div>
        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <li>
            Build the production bundle with <code className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06]">npm run build</code> and upload the contents of <code className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06]">dist/</code> (including hidden <code className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06]">.htaccess</code> files) to <code className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06]">public_html/</code>, or deploy via cPanel Git Version Control (<code className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06]">.cpanel.yml</code> preserves live JSON data and uploads automatically).
          </li>
          <li>
            Verify in cPanel MultiPHP Manager that your domain runs <strong>PHP 7.4, 8.1, 8.2, or 8.3</strong>, and confirm <code className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06]">public_html/api/storage/</code> and <code className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06]">public_html/uploads/</code> have writable directory permissions (<code className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06]">0755</code>).
          </li>
          <li>
            Open <code className="font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/[0.06]">/admin</code> on your live domain and use <strong>Account Security</strong> in the top header to rotate the initial administrator password immediately.
          </li>
          <li>
            In <strong>Email &amp; SMTP</strong>, set From Email to a mailbox hosted on your cPanel domain (or enter authenticated SMTP credentials on port 465 SSL) and send a diagnostic test email to confirm SPF/DKIM delivery.
          </li>
          <li>
            In <strong>Pixels &amp; Scripts</strong>, enable your production Meta, GTM, GA4, TikTok, or LinkedIn IDs, then run the <strong>End-to-End Pipeline Test</strong> above once on production to confirm live readiness.
          </li>
        </ol>
      </div>
    </div>
  );
}

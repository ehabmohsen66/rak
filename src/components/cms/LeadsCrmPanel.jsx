import React, { useState, useMemo, useEffect } from 'react';
import {
  RefreshCw,
  Download,
  Search,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  FileDown,
  Trash2,
  Save,
  Plus,
  Loader2,
  X,
  Copy,
  Check
} from 'lucide-react';
import {
  CMS_BTN_PRIMARY,
  CMS_BTN_SECONDARY,
  CMS_BTN_DANGER,
  CMS_CARD,
  CMS_INPUT_CLASS,
  CmsField,
  CmsStatusBadge,
  CmsBanner,
  ConfirmDialog
} from './cmsTheme';

const STATUS_OPTIONS = [
  { id: 'new', label: 'New', tone: 'brand' },
  { id: 'contacted', label: 'Contacted', tone: 'warning' },
  { id: 'qualified', label: 'Qualified', tone: 'success' },
  { id: 'proposal_sent', label: 'Proposal Sent', tone: 'brand' },
  { id: 'won', label: 'Won / Hired', tone: 'success' },
  { id: 'archived', label: 'Archived', tone: 'neutral' }
];

const PRIORITY_OPTIONS = [
  { id: 'low', label: 'Low' },
  { id: 'normal', label: 'Normal' },
  { id: 'high', label: 'High' },
  { id: 'urgent', label: 'Urgent' }
];

const SOURCE_LABELS = {
  contact: 'Contact Form',
  planner: 'Project Planner',
  career: 'Career Application'
};

function escapeCsvCell(val) {
  const str = String(val ?? '');
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default function LeadsCrmPanel({
  leads = [],
  loadingLeads = false,
  leadsError = '',
  onRefreshLeads,
  onUpdateLead,
  onDeleteLead,
  onCreateManualLead
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [savingLead, setSavingLead] = useState(false);
  const [notice, setNotice] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualForm, setManualForm] = useState({
    source: 'contact',
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    message: ''
  });
  const [creatingManual, setCreatingManual] = useState(false);

  useEffect(() => {
    if (!manualModalOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setManualModalOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [manualModalOpen]);

  const statusCounts = useMemo(() => {
    const counts = { all: leads.length };
    STATUS_OPTIONS.forEach((s) => {
      counts[s.id] = 0;
    });
    leads.forEach((lead) => {
      const st = lead.status || 'new';
      counts[st] = (counts[st] || 0) + 1;
    });
    return counts;
  }, [leads]);

  const filteredLeads = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return leads.filter((lead) => {
      if (statusFilter !== 'all' && (lead.status || 'new') !== statusFilter) {
        return false;
      }
      if (sourceFilter !== 'all' && (lead.source || 'contact') !== sourceFilter) {
        return false;
      }
      if (!q) return true;
      const haystack = [
        lead.name,
        lead.email,
        lead.phone,
        lead.company,
        lead.service,
        ...(lead.selectedServices || []),
        lead.roleTitle,
        lead.message,
        lead.notes
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [leads, statusFilter, sourceFilter, searchQuery]);

  const activeLead = useMemo(() => {
    if (!filteredLeads.length) return null;
    return filteredLeads.find((l) => l.id === selectedLeadId) || filteredLeads[0];
  }, [filteredLeads, selectedLeadId]);

  useEffect(() => {
    setNotesDraft(activeLead?.notes || '');
  }, [activeLead?.id, activeLead?.notes]);

  const handlePatchField = async (leadId, patch, successMessage) => {
    setSavingLead(true);
    setNotice(null);
    try {
      const res = await onUpdateLead(leadId, patch);
      if (res && res.ok) {
        await onRefreshLeads();
        if (successMessage) {
          setNotice({ tone: 'success', message: successMessage });
        }
      } else {
        setNotice({
          tone: 'error',
          title: 'Failed to update lead',
          message: res?.error || 'Could not update lead record.'
        });
      }
    } finally {
      setSavingLead(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    setSavingLead(true);
    try {
      const res = await onDeleteLead(id);
      if (res && res.ok) {
        if (selectedLeadId === id) setSelectedLeadId(null);
        await onRefreshLeads();
        setNotice({ tone: 'info', message: 'Lead record deleted.' });
      } else {
        setNotice({
          tone: 'error',
          title: 'Delete failed',
          message: res?.error || 'Could not delete lead.'
        });
      }
    } finally {
      setSavingLead(false);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'ID',
      'Created At',
      'Source',
      'Status',
      'Priority',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Service / Role',
      'Selected Services',
      'Budget',
      'Timeline',
      'LinkedIn',
      'Portfolio',
      'Resume URL',
      'Message',
      'Internal Notes'
    ];
    const rows = filteredLeads.map((l) => [
      l.id,
      l.createdAt,
      l.source,
      l.status,
      l.priority,
      l.name,
      l.email,
      l.phone,
      l.company,
      l.service || l.roleTitle,
      (l.selectedServices || []).join('; '),
      l.budget,
      l.timeline,
      l.linkedin,
      l.portfolio,
      l.resumeUrl,
      l.message,
      l.notes
    ]);
    const csvContent = [
      headers.map(escapeCsvCell).join(','),
      ...rows.map((r) => r.map(escapeCsvCell).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rak4creative-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const handleCreateManualSubmit = async (e) => {
    e.preventDefault();
    if (!manualForm.name.trim() || !manualForm.email.trim()) return;
    setCreatingManual(true);
    try {
      const res = await onCreateManualLead(manualForm);
      if (res && res.ok) {
        setManualModalOpen(false);
        setManualForm({
          source: 'contact',
          name: '',
          email: '',
          phone: '',
          company: '',
          service: '',
          budget: '',
          message: ''
        });
        await onRefreshLeads();
        setNotice({
          tone: 'success',
          title: 'Lead logged',
          message: 'Manual inquiry has been added to the CRM pipeline.'
        });
      } else {
        setNotice({
          tone: 'error',
          title: 'Could not create lead',
          message: res?.error || 'Check required name and email fields.'
        });
      }
    } finally {
      setCreatingManual(false);
    }
  };

  const statusMeta = (statusId) =>
    STATUS_OPTIONS.find((s) => s.id === statusId) || STATUS_OPTIONS[0];

  return (
    <div className="space-y-6">
      {/* Header & Primary Actions */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between pb-6 border-b border-black/[0.07] dark:border-white/[0.07]">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="cms-page-title text-2xl sm:text-[28px] leading-tight text-slate-900 dark:text-white">
              Leads
            </h1>
            <CmsStatusBadge tone="brand">{leads.length} total records</CmsStatusBadge>
            {statusCounts.new > 0 && (
              <CmsStatusBadge tone="warning">{statusCounts.new} new</CmsStatusBadge>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Unified inbox for Contact inquiries, 3-step Project Planner briefs, and Career job applications with attached resumes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onRefreshLeads}
            disabled={loadingLeads}
            className={CMS_BTN_SECONDARY}
          >
            <RefreshCw
              className={`w-4 h-4 ${loadingLeads ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            disabled={filteredLeads.length === 0}
            onClick={handleExportCsv}
            className={CMS_BTN_SECONDARY}
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Export CSV ({filteredLeads.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setManualModalOpen(true)}
            className={CMS_BTN_PRIMARY}
          >
            <Plus className="w-4 h-4" aria-hidden="true" />
            <span>Log Lead</span>
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

      {leadsError && (
        <CmsBanner
          tone="error"
          title="Could not load leads"
          message={leadsError}
        />
      )}

      {/* Status Filter Pills + Search & Source Filter */}
      <div className={`${CMS_CARD} p-4 space-y-4`}>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`min-h-[44px] sm:min-h-[34px] px-3 rounded-md text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'text-slate-600 dark:text-slate-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({statusCounts.all || 0})
          </button>
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st.id}
              type="button"
              onClick={() => setStatusFilter(st.id)}
              className={`min-h-[44px] sm:min-h-[34px] px-3 rounded-md text-[13px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-black/[0.05] dark:hover:bg-white/[0.07] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {st.label} ({statusCounts[st.id] || 0})
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-8 relative">
            <Search
              className="w-4 h-4 text-slate-500 dark:text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Search leads"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by contact name, email, company, service, or role..."
              className={`${CMS_INPUT_CLASS} pl-10`}
            />
          </div>
          <div className="md:col-span-4">
            <select
              aria-label="Filter leads by intake source"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className={CMS_INPUT_CLASS}
            >
              <option value="all">All Intake Channels</option>
              <option value="contact">Contact Page Form</option>
              <option value="planner">3-Step Project Planner</option>
              <option value="career">Career Job Applications</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading / Empty / Split Master-Detail View */}
      {loadingLeads && leads.length === 0 ? (
        <div className={`${CMS_CARD} p-12 flex flex-col items-center justify-center gap-3`}>
          <Loader2 className="w-7 h-7 animate-spin text-[#D1007C]" aria-hidden="true" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Loading leads from storage...
          </p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className={`${CMS_CARD} p-10 text-center space-y-3`}>
          <h3 className="text-[15px] font-semibold text-slate-900 dark:text-white">
            {leads.length === 0
              ? 'No leads captured yet'
              : 'No leads match your active filters'}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            {leads.length === 0
              ? 'Submissions from the Contact form, Interactive Project Planner, and Career Application modal appear here automatically.'
              : 'Try clearing the search query or switching the status and channel filters back to All.'}
          </p>
          {leads.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setStatusFilter('all');
                setSourceFilter('all');
                setSearchQuery('');
              }}
              className={CMS_BTN_SECONDARY}
            >
              Clear Active Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Leads List */}
          <div className={`${CMS_CARD} lg:col-span-5 p-3 sm:p-4 space-y-2.5 max-h-[720px] overflow-y-auto`}>
            {filteredLeads.map((lead) => {
              const selected = activeLead?.id === lead.id;
              const st = statusMeta(lead.status || 'new');
              const subtitle =
                lead.service ||
                lead.roleTitle ||
                (lead.selectedServices || []).slice(0, 2).join(', ') ||
                'General Inquiry';

              return (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => setSelectedLeadId(lead.id)}
                  className={`w-full text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                    selected
                      ? 'border-[#D1007C]/50 dark:border-pink-400/40 bg-pink-50/60 dark:bg-pink-500/[0.08]'
                      : 'border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-white/[0.02] hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {lead.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        {lead.company ? `${lead.company} · ` : ''}
                        {lead.email}
                      </p>
                    </div>
                    <CmsStatusBadge tone={st.tone}>{st.label}</CmsStatusBadge>
                  </div>

                  <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-[#B8006D] dark:text-[#FF66C4] truncate max-w-[220px]">
                      {SOURCE_LABELS[lead.source] || 'Contact'}: {subtitle}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {lead.createdAt
                        ? new Date(lead.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })
                        : ''}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Lead Detail Workspace */}
          {activeLead && (
            <div className={`${CMS_CARD} lg:col-span-7 p-5 sm:p-6 space-y-6`}>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-200 dark:border-white/[0.07] pb-5">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <CmsStatusBadge tone="brand">
                      {SOURCE_LABELS[activeLead.source] || 'Contact Form'}
                    </CmsStatusBadge>
                    {activeLead.budget && (
                      <CmsStatusBadge tone="success">Budget: {activeLead.budget}</CmsStatusBadge>
                    )}
                    {activeLead.priority === 'urgent' && (
                      <CmsStatusBadge tone="danger">Urgent</CmsStatusBadge>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {activeLead.name}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-mono">
                    ID: {activeLead.id} · Received:{' '}
                    {activeLead.createdAt
                      ? new Date(activeLead.createdAt).toLocaleString()
                      : 'Unknown'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setDeleteTarget(activeLead)}
                  className={CMS_BTN_DANGER}
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span>Delete</span>
                </button>
              </div>

              {/* Quick Contact Actions */}
              <div className="flex flex-wrap items-center gap-2.5">
                <a
                  href={`mailto:${activeLead.email}`}
                  className={CMS_BTN_PRIMARY}
                >
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>Email {activeLead.email}</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(activeLead.email);
                    setCopiedEmail(true);
                    setTimeout(() => setCopiedEmail(false), 1800);
                  }}
                  className={CMS_BTN_SECONDARY}
                >
                  {copiedEmail ? (
                    <Check className="w-4 h-4 text-[#047857] dark:text-[#34D399]" aria-hidden="true" />
                  ) : (
                    <Copy className="w-4 h-4" aria-hidden="true" />
                  )}
                  <span>{copiedEmail ? 'Copied' : 'Copy Email'}</span>
                </button>
                {activeLead.phone && (
                  <a href={`tel:${activeLead.phone}`} className={CMS_BTN_SECONDARY}>
                    <Phone className="w-4 h-4" aria-hidden="true" />
                    <span>{activeLead.phone}</span>
                  </a>
                )}
              </div>

              {/* Pipeline Status & Priority Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CmsField label="Pipeline Stage" htmlFor="lead-stage-select">
                  <select
                    id="lead-stage-select"
                    disabled={savingLead}
                    value={activeLead.status || 'new'}
                    onChange={(e) =>
                      handlePatchField(
                        activeLead.id,
                        { status: e.target.value },
                        'Lead pipeline stage updated.'
                      )
                    }
                    className={CMS_INPUT_CLASS}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </CmsField>

                <CmsField label="Priority Level" htmlFor="lead-priority-select">
                  <select
                    id="lead-priority-select"
                    disabled={savingLead}
                    value={activeLead.priority || 'normal'}
                    onChange={(e) =>
                      handlePatchField(
                        activeLead.id,
                        { priority: e.target.value },
                        'Lead priority updated.'
                      )
                    }
                    className={CMS_INPUT_CLASS}
                  >
                    {PRIORITY_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </CmsField>
              </div>

              {/* Submission Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border border-black/[0.06] dark:border-white/[0.06] bg-slate-50/80 dark:bg-white/[0.02] text-sm">
                {activeLead.company && (
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                      Company / Organization
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white inline-flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-4 h-4 text-slate-400" aria-hidden="true" />
                      {activeLead.company}
                    </span>
                  </div>
                )}
                {(activeLead.service || activeLead.roleTitle) && (
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                      {activeLead.roleTitle ? 'Position Applied' : 'Requested Capability'}
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white block mt-0.5">
                      {activeLead.roleTitle || activeLead.service}
                    </span>
                  </div>
                )}
                {activeLead.selectedServices?.length > 0 && (
                  <div className="sm:col-span-2">
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                      Selected Project Planner Scope
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                      {activeLead.selectedServices.map((srv, idx) => (
                        <CmsStatusBadge key={idx} tone="neutral">
                          {srv}
                        </CmsStatusBadge>
                      ))}
                    </div>
                  </div>
                )}
                {activeLead.timeline && (
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                      Target Timeline
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white block mt-0.5">
                      {activeLead.timeline}
                    </span>
                  </div>
                )}
                {activeLead.linkedin && (
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                      LinkedIn Profile
                    </span>
                    <a
                      href={activeLead.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#B8006D] dark:text-[#FF66C4] hover:underline inline-flex items-center gap-1 mt-0.5 break-all"
                    >
                      <span>Open LinkedIn</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                )}
                {activeLead.portfolio && (
                  <div>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">
                      Portfolio / Website
                    </span>
                    <a
                      href={activeLead.portfolio}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-[#B8006D] dark:text-[#FF66C4] hover:underline inline-flex items-center gap-1 mt-0.5 break-all"
                    >
                      <span>Open Portfolio</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  </div>
                )}
                {activeLead.resumeUrl && (
                  <div className="sm:col-span-2 pt-1">
                    <a
                      href={activeLead.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className={CMS_BTN_SECONDARY}
                    >
                      <FileDown className="w-4 h-4" aria-hidden="true" />
                      <span>
                        Download Attached CV ({activeLead.resumeName || 'Resume File'})
                      </span>
                    </a>
                  </div>
                )}
              </div>

              {/* Project Brief / Cover Message */}
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                  Submitted Brief / Message
                </span>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-white/[0.07] bg-slate-50 dark:bg-[#0E0E11] text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
                  {activeLead.message || 'No written message included with this submission.'}
                </div>
              </div>

              {/* Internal Operator Notes */}
              <div className="space-y-2.5">
                <CmsField
                  label="Internal Team Notes (Private to CMS Admins)"
                  htmlFor="lead-internal-notes"
                >
                  <textarea
                    id="lead-internal-notes"
                    rows={3}
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    placeholder="Record call outcomes, next follow-up date, or proposal link..."
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={savingLead || notesDraft === (activeLead.notes || '')}
                    onClick={() =>
                      handlePatchField(
                        activeLead.id,
                        { notes: notesDraft },
                        'Internal lead notes saved.'
                      )
                    }
                    className={CMS_BTN_PRIMARY}
                  >
                    <Save className="w-4 h-4" aria-hidden="true" />
                    <span>Save Notes</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual Lead Modal */}
      {manualModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="manual-lead-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        >
          <div className={`${CMS_CARD} w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto`}>
            <div className="flex items-center justify-between">
              <h3
                id="manual-lead-modal-title"
                className="text-base font-semibold text-slate-900 dark:text-white"
              >
                Log Manual Inquiry
              </h3>
              <button
                type="button"
                aria-label="Close modal"
                onClick={() => setManualModalOpen(false)}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-white/[0.07] cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleCreateManualSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <CmsField label="Contact Full Name" htmlFor="man-name" required>
                  <input
                    id="man-name"
                    type="text"
                    required
                    value={manualForm.name}
                    placeholder="Client full name"
                    onChange={(e) => setManualForm((p) => ({ ...p, name: e.target.value }))}
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
                <CmsField label="Email Address" htmlFor="man-email" required>
                  <input
                    id="man-email"
                    type="email"
                    required
                    value={manualForm.email}
                    placeholder="client@company.com"
                    onChange={(e) => setManualForm((p) => ({ ...p, email: e.target.value }))}
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
                <CmsField label="Phone Number" htmlFor="man-phone">
                  <input
                    id="man-phone"
                    type="tel"
                    value={manualForm.phone}
                    placeholder="+961 or +1 phone number"
                    onChange={(e) => setManualForm((p) => ({ ...p, phone: e.target.value }))}
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
                <CmsField label="Company Name" htmlFor="man-company">
                  <input
                    id="man-company"
                    type="text"
                    value={manualForm.company}
                    placeholder="Organization name"
                    onChange={(e) => setManualForm((p) => ({ ...p, company: e.target.value }))}
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
                <CmsField label="Channel" htmlFor="man-source">
                  <select
                    id="man-source"
                    value={manualForm.source}
                    onChange={(e) => setManualForm((p) => ({ ...p, source: e.target.value }))}
                    className={CMS_INPUT_CLASS}
                  >
                    <option value="contact">Contact Inquiry</option>
                    <option value="planner">Project Planner Brief</option>
                    <option value="career">Career Applicant</option>
                  </select>
                </CmsField>
                <CmsField label="Service or Role" htmlFor="man-service">
                  <input
                    id="man-service"
                    type="text"
                    value={manualForm.service}
                    placeholder="Requested service or job title"
                    onChange={(e) => setManualForm((p) => ({ ...p, service: e.target.value }))}
                    className={CMS_INPUT_CLASS}
                  />
                </CmsField>
              </div>

              <CmsField label="Brief / Notes" htmlFor="man-message">
                <textarea
                  id="man-message"
                  rows={3}
                  value={manualForm.message}
                  placeholder="Summary of client inquiry or phone conversation..."
                  onChange={(e) => setManualForm((p) => ({ ...p, message: e.target.value }))}
                  className={CMS_INPUT_CLASS}
                />
              </CmsField>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className={CMS_BTN_SECONDARY}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingManual}
                  className={CMS_BTN_PRIMARY}
                >
                  {creatingManual ? 'Saving...' : 'Save Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Lead Record?"
        description={`This permanently removes ${deleteTarget?.name || 'this submission'} (${
          deleteTarget?.email || ''
        }) from leads.json.`}
        confirmLabel="Delete Lead"
        tone="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}

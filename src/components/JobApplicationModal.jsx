import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, Send, Briefcase, AlertCircle, Loader2 } from 'lucide-react';
import { useCms } from '../lib/cmsContext';

export const JobApplicationModal = ({ job, onClose }) => {
  const { submitLead } = useCms();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    coverNote: '',
    resumeName: '',
    resumeDataUrl: '',
    website_url_hp: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  if (!job) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Resume file must be under 10MB.');
      return;
    }
    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        resumeName: file.name,
        resumeDataUrl: typeof reader.result === 'string' ? reader.result : ''
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const res = await submitLead({
      source: 'career',
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      roleId: job.id,
      roleTitle: job.title,
      service: `Career Application: ${job.title}`,
      linkedin: formData.linkedin,
      portfolio: formData.portfolio,
      message: formData.coverNote,
      resumeName: formData.resumeName,
      resumeDataUrl: formData.resumeDataUrl,
      website_url_hp: formData.website_url_hp
    });

    setSubmitting(false);

    if (!res || !res.ok) {
      setErrorMsg(res?.error || 'Could not submit your application. Please check your entries and try again.');
      return;
    }

    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="job-modal-title"
      className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 sm:py-10 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl bg-white dark:bg-rak-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-rak-slate-100 max-h-[88vh] flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-rak-slate-950/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rak-magenta/10 text-rak-magenta rounded-xl border border-rak-magenta/20">
              <Briefcase className="w-4 h-4 text-rak-magenta" />
            </div>
            <span id="job-modal-title" className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Apply: {job.title}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-200/80 dark:bg-rak-slate-800 hover:bg-rak-magenta text-slate-700 dark:text-rak-slate-300 hover:text-white transition-all cursor-pointer shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Application Received</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you for applying for the <span className="text-rak-magenta font-bold">{job.title}</span> position. Your application and portfolio have been saved for talent review.
              </p>
              <div className="pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div role="alert" className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="p-4 bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-2xl space-y-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{job.title}</div>
                <div className="text-[11px] text-slate-600 dark:text-rak-slate-400">{job.location} • {job.type} • {job.salary}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="job-fullname" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Full Name *</label>
                  <input
                    id="job-fullname"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta"
                  />
                </div>
                <div>
                  <label htmlFor="job-email" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Email Address *</label>
                  <input
                    id="job-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="job-linkedin" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">LinkedIn Profile</label>
                  <input
                    id="job-linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/your-profile"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta"
                  />
                </div>
                <div>
                  <label htmlFor="job-portfolio" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Portfolio / Work URL *</label>
                  <input
                    id="job-portfolio"
                    type="url"
                    required
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="https://yourportfolio.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="job-resume" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Attach Resume / CV (PDF, DOCX)</label>
                <div className="relative border-2 border-dashed border-slate-300 dark:border-rak-slate-700 hover:border-rak-magenta rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-rak-slate-950/50">
                  <input
                    id="job-resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-slate-400 dark:text-rak-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-600 dark:text-rak-slate-300">
                    {formData.resumeName ? (
                      <span className="text-rak-magenta font-bold">{formData.resumeName}</span>
                    ) : (
                      "Click to upload or drag & drop (PDF, DOCX up to 10MB)"
                    )}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="job-covernote" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Short Cover Note</label>
                <textarea
                  id="job-covernote"
                  rows="3"
                  value={formData.coverNote}
                  onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                  placeholder="Share relevant experience, projects, or availability..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta"
                />
              </div>

              <div className="sr-only" aria-hidden="true">
                <label htmlFor="job-website-hp">Personal Website</label>
                <input
                  id="job-website-hp"
                  type="text"
                  name="website_url_hp"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.website_url_hp}
                  onChange={(e) => setFormData({ ...formData, website_url_hp: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-rak-magenta hover:bg-rak-magenta-dark disabled:opacity-60 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Application</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};

export default JobApplicationModal;

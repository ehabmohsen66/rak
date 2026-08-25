import React, { useState, useEffect } from 'react';
import { X, Upload, CheckCircle2, Send, Briefcase } from 'lucide-react';

export const JobApplicationModal = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    coverNote: '',
    resumeName: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!job) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 4000);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData({ ...formData, resumeName: e.target.files[0].name });
    }
  };

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 sm:py-10 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-rak-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-rak-slate-100 max-h-[88vh] flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-rak-slate-950/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rak-magenta/10 text-rak-magenta rounded-xl border border-rak-magenta/20">
              <Briefcase className="w-4 h-4 text-rak-magenta" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Apply: {job.title}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-200/80 dark:bg-rak-slate-800 hover:bg-rak-magenta text-slate-700 dark:text-rak-slate-300 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105 shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Application Received!</h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you for applying for the <span className="text-rak-magenta font-bold">{job.title}</span> position. Our executive talent director will review your portfolio within 48 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-2xl space-y-1">
                <div className="text-xs font-bold text-slate-900 dark:text-white">{job.title}</div>
                <div className="text-[11px] text-slate-500 dark:text-rak-slate-400">{job.location} • {job.type} • {job.salary}</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-1 focus:ring-rak-magenta"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-1 focus:ring-rak-magenta"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">LinkedIn Profile</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-1 focus:ring-rak-magenta"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Portfolio / Github URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.portfolio}
                    onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                    placeholder="https://janedoe.design"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-1 focus:ring-rak-magenta"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Attach Resume / CV (PDF) *</label>
                <div className="relative border-2 border-dashed border-slate-200 dark:border-rak-slate-800 hover:border-rak-magenta rounded-2xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-rak-slate-950/50">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <Upload className="w-6 h-6 text-slate-400 dark:text-rak-slate-500 mx-auto mb-1" />
                  <span className="text-xs text-slate-500 dark:text-rak-slate-400">
                    {formData.resumeName ? (
                      <span className="text-rak-magenta font-bold">{formData.resumeName}</span>
                    ) : (
                      "Click to upload or drag & drop (PDF, DOCX up to 10MB)"
                    )}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Short Cover Note</label>
                <textarea
                  rows="3"
                  value={formData.coverNote}
                  onChange={(e) => setFormData({ ...formData, coverNote: e.target.value })}
                  placeholder="Tell us why you are excited to join RAK 4 CREATIVE..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-1 focus:ring-rak-magenta"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-transform hover:scale-[1.01]"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Application</span>
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

import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Send, AlertCircle, Loader2 } from 'lucide-react';
import { useCms } from '../lib/cmsContext';

export const ProjectEstimatorModal = ({ onClose }) => {
  const { content, submitLead } = useCms();
  const services = content.pillars || [];
  const budgetOptions =
    Array.isArray(content.brandInfo?.budgetOptions) && content.brandInfo.budgetOptions.length > 0
      ? content.brandInfo.budgetOptions
      : ['$25,000 - $50,000', '$50,000 - $100,000', '$100,000 - $250,000', '$250,000+'];
  const timelineOptions =
    Array.isArray(content.brandInfo?.timelineOptions) && content.brandInfo.timelineOptions.length > 0
      ? content.brandInfo.timelineOptions
      : ['Urgent (< 4 Wks)', '4 - 8 Weeks', '8 - 12 Weeks', 'Flexible Scope'];

  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [budget, setBudget] = useState(() => budgetOptions[1] || budgetOptions[0] || '$50,000 - $100,000');
  const [timeline, setTimeline] = useState(() => timelineOptions[1] || timelineOptions[0] || '4 - 8 Weeks');
  const [contact, setContact] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    brief: '',
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

  const toggleService = (title) => {
    if (selectedServices.includes(title)) {
      setSelectedServices(selectedServices.filter(item => item !== title));
    } else {
      setSelectedServices([...selectedServices, title]);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    const res = await submitLead({
      source: 'planner',
      name: contact.name,
      company: contact.company,
      email: contact.email,
      phone: contact.phone,
      service: selectedServices.join(', '),
      selectedServices,
      budget,
      timeline,
      message: contact.brief,
      website_url_hp: contact.website_url_hp
    });

    setSubmitting(false);

    if (!res || !res.ok) {
      setErrorMsg(res?.error || 'Could not submit your project brief. Please verify your details and try again.');
      return;
    }

    setSubmitted(true);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="planner-modal-title"
      className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 sm:py-10 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-3xl bg-white dark:bg-rak-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-rak-slate-100 max-h-[88vh] flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-rak-slate-950/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="p-2 bg-rak-magenta/10 text-rak-magenta rounded-xl border border-rak-magenta/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 id="planner-modal-title" className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Interactive Project Brief</h2>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-rak-slate-400">Step {step} of 3 • Customized Scope Builder</p>
            </div>
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

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-rak-slate-950 h-1.5">
          <div 
            className="bg-rak-magenta h-1.5 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Modal Scroll Content */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Proposal Request Logged</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-rak-magenta font-bold">{contact.name}</span>. Your scope parameters have been saved to our leads pipeline and routed to our strategy directors.
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
            <div>
              {errorMsg && (
                <div role="alert" className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* STEP 1: Select Services */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Select Required Capabilities</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300">Choose all agency pillars applicable to your project.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {services.map((s) => {
                      const isSelected = selectedServices.includes(s.title);
                      return (
                        <button
                          type="button"
                          key={s.id}
                          onClick={() => toggleService(s.title)}
                          className={`text-left p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start space-x-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta ${
                            isSelected
                              ? 'bg-rak-magenta/10 border-rak-magenta text-slate-900 dark:text-white shadow-sm ring-1 ring-rak-magenta'
                              : 'bg-slate-50 dark:bg-rak-slate-950/60 border-slate-200 dark:border-rak-slate-800 text-slate-700 dark:text-rak-slate-300 hover:border-rak-magenta/40 hover:bg-slate-100 dark:hover:bg-rak-slate-900'
                          }`}
                        >
                          <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-rak-magenta border-rak-magenta text-white' : 'border-slate-300 dark:border-rak-slate-600 bg-white dark:bg-rak-slate-900'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">{s.title}</div>
                            <div className="text-[11px] text-slate-600 dark:text-rak-slate-400 mt-0.5">{s.subtitle}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Timeline & Budget */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Investment Bracket & Timeline</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300">Specify expected budget parameters and target launch window.</p>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700 dark:text-rak-slate-300 uppercase tracking-wider">
                      Target Budget Allocation
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {budgetOptions.map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setBudget(b)}
                          className={`p-3 text-xs font-bold rounded-xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta ${
                            budget === b 
                              ? 'bg-rak-magenta border-rak-magenta text-white shadow-md' 
                              : 'bg-slate-50 dark:bg-rak-slate-950 border-slate-200 dark:border-rak-slate-800 text-slate-700 dark:text-rak-slate-300 hover:border-rak-magenta/40 hover:bg-slate-100 dark:hover:bg-rak-slate-900'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-rak-slate-300 uppercase tracking-wider">
                      Desired Timeline
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {timelineOptions.map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setTimeline(t)}
                          className={`p-3 text-xs font-bold rounded-xl border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta ${
                            timeline === t 
                              ? 'bg-rak-magenta border-rak-magenta text-white shadow-md' 
                              : 'bg-slate-50 dark:bg-rak-slate-950 border-slate-200 dark:border-rak-slate-800 text-slate-700 dark:text-rak-slate-300 hover:border-rak-magenta/40 hover:bg-slate-100 dark:hover:bg-rak-slate-900'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Executive Contact */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Executive Contact Information</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300">Where should we send your customized scope analysis?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="planner-name" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Your Name *</label>
                      <input
                        id="planner-name"
                        type="text"
                        required
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                        placeholder="Your full name"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta"
                      />
                    </div>

                    <div>
                      <label htmlFor="planner-company" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Company / Enterprise *</label>
                      <input
                        id="planner-company"
                        type="text"
                        required
                        value={contact.company}
                        onChange={(e) => setContact({ ...contact, company: e.target.value })}
                        placeholder="Your company or brand name"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="planner-email" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Corporate Email *</label>
                      <input
                        id="planner-email"
                        type="email"
                        required
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        placeholder="name@company.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta"
                      />
                    </div>

                    <div>
                      <label htmlFor="planner-phone" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Phone Number</label>
                      <input
                        id="planner-phone"
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        placeholder="Direct phone number (optional)"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="planner-brief" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Project Brief Overview</label>
                    <textarea
                      id="planner-brief"
                      rows="3"
                      value={contact.brief}
                      onChange={(e) => setContact({ ...contact, brief: e.target.value })}
                      placeholder="Briefly describe your objectives, key challenges, or target deliverables..."
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta"
                    />
                  </div>

                  <div className="sr-only" aria-hidden="true">
                    <label htmlFor="planner-website-hp">Company Website</label>
                    <input
                      id="planner-website-hp"
                      type="text"
                      name="website_url_hp"
                      tabIndex={-1}
                      autoComplete="off"
                      value={contact.website_url_hp}
                      onChange={(e) => setContact({ ...contact, website_url_hp: e.target.value })}
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-600 dark:text-rak-slate-400">Selected Pillars: <strong className="text-rak-magenta">{selectedServices.length} Selected</strong></span>
                    <span className="text-slate-600 dark:text-rak-slate-400">Budget: <strong className="text-slate-900 dark:text-white">{budget}</strong></span>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-rak-magenta hover:bg-rak-magenta-dark disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Project Brief...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit & Request Proposal</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Modal Controls Bar */}
        {!submitted && (
          <div className="px-6 py-4 bg-slate-50/90 dark:bg-rak-slate-950 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={handlePrev}
              disabled={step === 1}
              className={`px-4 py-2.5 text-xs font-bold rounded-xl flex items-center space-x-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta ${
                step === 1 ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-rak-slate-600' : 'text-slate-700 dark:text-rak-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 dark:bg-rak-slate-800 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {step < 3 && (
              <button
                type="button"
                onClick={handleNext}
                disabled={step === 1 && selectedServices.length === 0}
                className={`px-6 py-2.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md flex items-center space-x-1.5 cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  step === 1 && selectedServices.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectEstimatorModal;

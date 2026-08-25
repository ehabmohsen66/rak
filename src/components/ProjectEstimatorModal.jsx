import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, ArrowRight, ArrowLeft, Sparkles, Send, DollarSign, Calendar, ShieldCheck } from 'lucide-react';
import { SERVICES } from '../data/contentData';

export const ProjectEstimatorModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState([]);
  const [budget, setBudget] = useState('$50,000 - $100,000');
  const [timeline, setTimeline] = useState('4 - 8 Weeks');
  const [contact, setContact] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    brief: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const toggleService = (id) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(item => item !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 sm:py-10 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-rak-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-rak-slate-100 max-h-[88vh] flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-rak-slate-950/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="p-2 bg-rak-magenta/10 text-rak-magenta rounded-xl border border-rak-magenta/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Interactive Project Brief</h2>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-rak-slate-400">Step {step} of 3 • Customized Proposal Generator</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-200/80 dark:bg-rak-slate-800 hover:bg-rak-magenta text-slate-700 dark:text-rak-slate-300 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105 shrink-0"
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
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">Proposal Request Received!</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-400 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="text-rak-magenta font-bold">{contact.name}</span>. Our executive strategy team is processing your requirements. You will receive a detailed proposal & scope document within 24 hours.
              </p>
            </div>
          ) : (
            <div>
              {/* STEP 1: Select Services */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Select Required Capabilities</h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-rak-slate-400">Choose all services applicable to your business objective.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SERVICES.map((s) => {
                      const isSelected = selectedServices.includes(s.id);
                      return (
                        <div
                          key={s.id}
                          onClick={() => toggleService(s.id)}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-start space-x-3 ${
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
                            <div className="text-[11px] text-slate-500 dark:text-rak-slate-400 mt-0.5">{s.subtitle}</div>
                          </div>
                        </div>
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
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-rak-slate-400">Specify expected budget parameters and desired launch deadline.</p>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700 dark:text-rak-slate-300 uppercase tracking-wider">
                      Target Budget Allocation
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['$25,000 - $50,000', '$50,000 - $100,000', '$100,000 - $250,000', '$250,000+'].map((b) => (
                        <button
                          type="button"
                          key={b}
                          onClick={() => setBudget(b)}
                          className={`p-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
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
                      {['Urgent (< 4 Wks)', '4 - 8 Weeks', '8 - 12 Weeks', 'Flexible Scope'].map((t) => (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setTimeline(t)}
                          className={`p-3 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
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
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-rak-slate-400">Where should we transmit your customized scope analysis?</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={contact.name}
                        onChange={(e) => setContact({ ...contact, name: e.target.value })}
                        placeholder="Alexander Wright"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-1 focus:ring-rak-magenta"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Company / Enterprise *</label>
                      <input
                        type="text"
                        required
                        value={contact.company}
                        onChange={(e) => setContact({ ...contact, company: e.target.value })}
                        placeholder="Vanguard Holdings Inc."
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-1 focus:ring-rak-magenta"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Corporate Email *</label>
                      <input
                        type="email"
                        required
                        value={contact.email}
                        onChange={(e) => setContact({ ...contact, email: e.target.value })}
                        placeholder="a.wright@vanguard.com"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-1 focus:ring-rak-magenta"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Phone Number</label>
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                        placeholder="+1 (555) 019-2831"
                        className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-1 focus:ring-rak-magenta"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1">Project Brief Overview</label>
                    <textarea
                      rows="3"
                      value={contact.brief}
                      onChange={(e) => setContact({ ...contact, brief: e.target.value })}
                      placeholder="Briefly describe your objectives, key challenges, or existing benchmarks..."
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-1 focus:ring-rak-magenta"
                    />
                  </div>

                  <div className="p-3.5 bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-rak-slate-400">Selected Services: <strong className="text-rak-magenta">{selectedServices.length} Selected</strong></span>
                    <span className="text-slate-500 dark:text-rak-slate-400">Budget: <strong className="text-slate-900 dark:text-white">{budget}</strong></span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md flex items-center justify-center space-x-2 cursor-pointer transition-transform hover:scale-[1.01]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit & Request Proposal</span>
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
              onClick={handlePrev}
              disabled={step === 1}
              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-1 transition-colors ${
                step === 1 ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-rak-slate-600' : 'text-slate-700 dark:text-rak-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-200/80 dark:bg-rak-slate-800 cursor-pointer'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {step < 3 && (
              <button
                onClick={handleNext}
                disabled={step === 1 && selectedServices.length === 0}
                className={`px-6 py-2.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-md flex items-center space-x-1.5 cursor-pointer transition-transform hover:scale-105 ${
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

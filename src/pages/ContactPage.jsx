import React, { useState, useRef } from 'react';
import { Sparkles, MapPin, Mail, Phone, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { PrismaHero } from '../components/PrismaHero';
import { useCms } from '../lib/cmsContext';
import { formatWhatsAppHref, getActiveSocialLinks, WhatsAppIcon } from '../lib/socialLinks';

export const ContactPage = ({ onOpenPlanner }) => {
  const { content, submitLead } = useCms();
  const offices = content.offices || [];
  const pillars = content.pillars || [];
  const brandInfo = content.brandInfo || {};
  const budgetOptions =
    Array.isArray(brandInfo.budgetOptions) && brandInfo.budgetOptions.length > 0
      ? brandInfo.budgetOptions
      : ['$25,000 - $50,000', '$50,000 - $100,000', '$100,000 - $250,000', '$250,000+'];
  const defaultBudget = budgetOptions[1] || budgetOptions[0] || '$50,000 - $100,000';
  const whatsappHref = formatWhatsAppHref(brandInfo.whatsapp);
  const socialLinks = getActiveSocialLinks(brandInfo);

  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: pillars[0]?.title || 'Digital Consultancy',
    budget: defaultBudget,
    message: '',
    website_url_hp: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    const res = await submitLead({
      source: 'contact',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      company: formData.company,
      service: formData.service,
      budget: formData.budget,
      message: formData.message,
      website_url_hp: formData.website_url_hp
    });

    setSubmitting(false);

    if (!res || !res.ok) {
      setSubmitError(res?.error || 'Could not transmit your inquiry. Please verify your fields and try again.');
      return;
    }

    setSubmittedLead(res.lead || { name: formData.name, email: formData.email });
  };

  const resetForm = () => {
    setSubmittedLead(null);
    setSubmitError('');
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: pillars[0]?.title || 'Digital Consultancy',
      budget: defaultBudget,
      message: '',
      website_url_hp: ''
    });
  };

  return (
    <div className="pb-16 space-y-16 sm:space-y-24 bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      <PrismaHero
        onScrollToForm={() => formRef.current?.scrollIntoView({ behavior: 'smooth' })}
        onOpenPlanner={onOpenPlanner}
      />

      <section ref={formRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-10 bg-white dark:bg-rak-slate-900/80 border border-slate-200 dark:border-rak-slate-800 rounded-3xl space-y-6 shadow-xl backdrop-blur-xl">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">Direct Executive Briefing</h2>
              <p className="text-xs text-slate-600 dark:text-rak-slate-300">Complete the brief below to route your inquiry directly to our strategy team.</p>
            </div>

            {submittedLead ? (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-heading">Executive Brief Recorded</h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-rak-magenta font-semibold">{submittedLead.name}</span>. Your briefing has been logged in our leads pipeline and dispatched to our executive team.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-5 py-2.5 bg-slate-100 dark:bg-rak-slate-800 hover:bg-rak-magenta hover:text-white text-slate-800 dark:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {submitError && (
                  <div role="alert" className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/40 text-rose-600 dark:text-rose-300 text-xs flex items-center space-x-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1 font-mono">Your Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1 font-mono">Corporate Email *</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@company.com"
                      className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-company" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1 font-mono">Company / Organization *</label>
                    <input
                      id="contact-company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Your company or brand name"
                      className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta transition-colors"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1 font-mono">Phone / WhatsApp</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Direct phone number (optional)"
                      className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="contact-service" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1 font-mono">Primary Capability Needed</label>
                    <select
                      id="contact-service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta transition-colors cursor-pointer"
                    >
                      {pillars.map((p) => (
                        <option key={p.id} value={p.title}>{p.title}</option>
                      ))}
                      <option value="Full 360° Agency Retainer">Full 360° Agency Retainer</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-budget" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1 font-mono">Estimated Budget Allocation</label>
                    <select
                      id="contact-budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta transition-colors cursor-pointer"
                    >
                      {budgetOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sr-only" aria-hidden="true">
                  <label htmlFor="contact-website-hp">Company Website</label>
                  <input
                    id="contact-website-hp"
                    type="text"
                    name="website_url_hp"
                    tabIndex={-1}
                    autoComplete="off"
                    value={formData.website_url_hp}
                    onChange={(e) => setFormData({ ...formData, website_url_hp: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-[11px] font-bold text-slate-700 dark:text-rak-slate-300 uppercase mb-1 font-mono">Project Details & Objectives *</label>
                  <textarea
                    id="contact-message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your brand goals, target launch timeline, or technical requirements..."
                    className="w-full px-4 py-3 text-xs bg-slate-50 dark:bg-rak-slate-950 border border-slate-300 dark:border-rak-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-2 focus:ring-rak-magenta transition-colors"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-rak-magenta hover:bg-rak-magenta-dark disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-magenta-glow flex items-center justify-center space-x-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Transmitting Briefing...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Transmit Executive Briefing</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Global Offices & Interactive Brief Generator Launcher */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="p-8 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-rak-slate-900 dark:to-rak-slate-950 border border-rak-magenta/30 dark:border-rak-magenta/40 rounded-3xl space-y-4 shadow-xl relative overflow-hidden backdrop-blur-xl">
              <span className="px-3 py-1 bg-rak-magenta/10 dark:bg-rak-magenta/20 text-rak-magenta text-[10px] font-bold uppercase tracking-wider rounded-full border border-rak-magenta/30 font-mono">
                Interactive Scope Builder
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-heading">Prefer an Interactive Project Planner?</h3>
              <p className="text-xs text-slate-600 dark:text-rak-slate-300 leading-relaxed">
                Select multiple capability pillars, set your target investment bracket, and submit a structured scope brief in three steps.
              </p>
              <button
                type="button"
                onClick={onOpenPlanner}
                className="w-full py-3.5 bg-slate-900 dark:bg-rak-slate-800 hover:bg-slate-800 dark:hover:bg-rak-slate-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-700 dark:border-rak-slate-600 transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
              >
                <Sparkles className="w-4 h-4 text-rak-magenta" />
                <span>Launch Interactive Planner</span>
              </button>
            </div>

            {(whatsappHref || socialLinks.length > 0) && (
              <div className="p-6 bg-white dark:bg-rak-slate-900/70 border border-slate-200 dark:border-rak-slate-800 rounded-2xl space-y-4 shadow-sm">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest font-mono">
                  Direct Channels & Socials
                </h3>
                {whatsappHref && (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-sm"
                  >
                    <WhatsAppIcon className="w-4 h-4" />
                    <span>Message Us on WhatsApp</span>
                  </a>
                )}
                {socialLinks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    {socialLinks.map(({ id, label, href, Icon }) => (
                      <a
                        key={id}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={label}
                        title={label}
                        className="inline-flex items-center space-x-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 hover:border-rak-magenta text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-rak-magenta transition-colors"
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{label}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest pl-2 font-mono">Global Headquarters</h3>
              {offices.map((office) => (
                <div key={office.city} className="p-5 bg-white dark:bg-rak-slate-900/70 border border-slate-200 dark:border-rak-slate-800 rounded-2xl space-y-2 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white font-heading">{office.city}, {office.country}</span>
                    <span className="text-[10px] font-mono text-rak-magenta font-semibold">{office.status || office.timezone}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-rak-slate-300 flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-rak-magenta shrink-0" />
                    <span>{office.address}</span>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-rak-slate-300 flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-rak-magenta shrink-0" />
                    <a href={`mailto:${office.email}`} className="hover:text-rak-magenta transition-colors">{office.email}</a>
                  </div>
                  {office.phone && (
                    <div className="text-xs text-slate-600 dark:text-rak-slate-300 flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-rak-magenta shrink-0" />
                      <a href={`tel:${office.phone}`} className="hover:text-rak-magenta transition-colors">{office.phone}</a>
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
};

export default ContactPage;

import React, { useState, useRef } from 'react';
import { Sparkles, MapPin, Phone, Mail, Clock, Send, CheckCircle2, Calendar, ShieldCheck, Globe } from 'lucide-react';
import { OFFICES } from '../data/contentData';
import { PrismaHero } from '../components/PrismaHero';

export const ContactPage = ({ onOpenPlanner }) => {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    service: 'Brand Strategy & Identity',
    budget: '$50,000 - $100,000',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        company: '',
        service: 'Brand Strategy & Identity',
        budget: '$50,000 - $100,000',
        message: ''
      });
    }, 5000);
  };

  return (
    <div className="pb-16 space-y-16 sm:space-y-24">
      
      {/* FULLSCREEN CINEMATIC VIDEO & WORDS PULL UP HERO */}
      <PrismaHero />

      {/* CONTACT FORM & DIRECT INFO */}
      <section ref={formRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 p-8 sm:p-10 bg-rak-slate-900/80 border border-rak-slate-800 rounded-3xl space-y-6 shadow-2xl">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold text-white">Direct Executive Briefing</h2>
              <p className="text-xs text-rak-slate-400">Fill out the parameters below to receive a response within 12 business hours.</p>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Transmitted!</h3>
                <p className="text-xs text-rak-slate-400 max-w-md mx-auto">
                  Thank you, <span className="text-rak-magenta font-semibold">{formData.name}</span>. Our executive strategy team is reviewing your message and will get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-rak-slate-300 uppercase mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Victoria Sterling"
                      className="w-full px-4 py-3 text-xs bg-rak-slate-950 border border-rak-slate-800 rounded-xl text-white focus:outline-none focus:border-rak-magenta"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-rak-slate-300 uppercase mb-1">Corporate Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="victoria@enterprise.com"
                      className="w-full px-4 py-3 text-xs bg-rak-slate-950 border border-rak-slate-800 rounded-xl text-white focus:outline-none focus:border-rak-magenta"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-rak-slate-300 uppercase mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Apex Global Partners"
                      className="w-full px-4 py-3 text-xs bg-rak-slate-950 border border-rak-slate-800 rounded-xl text-white focus:outline-none focus:border-rak-magenta"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-rak-slate-300 uppercase mb-1">Primary Capability Needed</label>
                    <select
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      className="w-full px-4 py-3 text-xs bg-rak-slate-950 border border-rak-slate-800 rounded-xl text-white focus:outline-none focus:border-rak-magenta"
                    >
                      <option>Brand Strategy & Identity</option>
                      <option>Digital Product UI/UX</option>
                      <option>Enterprise Web Architecture</option>
                      <option>CRO & Growth Acceleration</option>
                      <option>3D Motion & Media</option>
                      <option>AI Transformation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-rak-slate-300 uppercase mb-1">Estimated Budget Allocation</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-3 text-xs bg-rak-slate-950 border border-rak-slate-800 rounded-xl text-white focus:outline-none focus:border-rak-magenta"
                  >
                    <option>$25,000 - $50,000</option>
                    <option>$50,000 - $100,000</option>
                    <option>$100,000 - $250,000</option>
                    <option>$250,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-rak-slate-300 uppercase mb-1">Project Details & Objectives *</label>
                  <textarea
                    rows="4"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your brand vision, target timeline, or current technical infrastructure..."
                    className="w-full px-4 py-3 text-xs bg-rak-slate-950 border border-rak-slate-800 rounded-xl text-white focus:outline-none focus:border-rak-magenta"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-magenta-glow flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Transmit Executive Briefing</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Global Offices & Interactive Brief Generator Launcher */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Interactive Planner Card */}
            <div className="p-8 bg-gradient-to-br from-rak-slate-900 to-rak-slate-950 border border-rak-magenta/40 rounded-3xl space-y-4 shadow-magenta-sm relative overflow-hidden">
              <span className="px-3 py-1 bg-rak-magenta/20 text-rak-magenta text-[10px] font-bold uppercase tracking-wider rounded-full border border-rak-magenta/30">
                Alternative Fast-Track
              </span>
              <h3 className="text-xl font-bold text-white">Prefer an Interactive Project Planner?</h3>
              <p className="text-xs text-rak-slate-300 leading-relaxed">
                Use our 3-step interactive scope generator to calculate budget brackets and receive an instant customized PDF proposal outline.
              </p>
              <button
                onClick={onOpenPlanner}
                className="w-full py-3 bg-rak-slate-800 hover:bg-rak-slate-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl border border-rak-slate-600 transition-colors flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4 text-rak-magenta" />
                <span>Launch Interactive Planner</span>
              </button>
            </div>

            {/* Offices List */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-widest pl-2">Global Headquarters</h3>
              {OFFICES.map((office) => (
                <div key={office.city} className="p-5 bg-rak-slate-900/70 border border-rak-slate-800 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{office.city}, {office.country}</span>
                    <span className="text-[10px] font-mono text-rak-magenta">{office.timezone}</span>
                  </div>
                  <div className="text-xs text-rak-slate-400 flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-rak-magenta shrink-0" />
                    <span>{office.address}</span>
                  </div>
                  <div className="text-xs text-rak-slate-400 flex items-center space-x-2">
                    <Mail className="w-3.5 h-3.5 text-rak-magenta shrink-0" />
                    <span>{office.email}</span>
                  </div>
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

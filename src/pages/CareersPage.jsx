import React, { useState, useRef } from 'react';
import { Sparkles, MapPin, Briefcase, ArrowUpRight, CheckCircle2, Users, Heart, Zap, Globe } from 'lucide-react';
import { CAREERS_COPY } from '../data/contentData';
import { CareersHero } from '../components/CareersHero';

export const CareersPage = ({ onApplyJob }) => {
  const rolesRef = useRef(null);

  const handleScrollToRoles = () => {
    rolesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const openRoles = [
    {
      id: "sr-brand-strategist",
      title: "Senior Brand Strategist",
      department: "Brand Strategy",
      location: "Dubai / Remote",
      type: "Full-Time",
      salary: "Competitive + Performance Bonus",
      description: "Lead comprehensive market research, brand positioning, and messaging strategy for enterprise clients."
    },
    {
      id: "lead-ui-ux-designer",
      title: "Lead UI/UX & Design Systems Architect",
      department: "Product Design",
      location: "Riyadh / Remote",
      type: "Full-Time",
      salary: "Competitive + Performance Bonus",
      description: "Craft bespoke design systems, Figma token architectures, and frictionless user experiences."
    },
    {
      id: "full-stack-webgl-engineer",
      title: "Full-Stack Web & Creative Developer",
      department: "Engineering",
      location: "London / Remote",
      type: "Full-Time",
      salary: "Competitive + Performance Bonus",
      description: "Build ultra-fast Next.js/Vite frontend web platforms and custom interactive visual graphics."
    },
    {
      id: "media-buying-director",
      title: "Media Buying & Performance Ad Ops Lead",
      department: "Paid Media",
      location: "Dubai / Remote",
      type: "Full-Time",
      salary: "Competitive + Performance Bonus",
      description: "Manage omnichannel paid media campaigns across Meta, Google, TikTok, and LinkedIn."
    }
  ];

  return (
    <div className="pb-16 space-y-20 sm:space-y-28">
      
      {/* CINEMATIC CAREERS HERO */}
      <CareersHero onScrollToRoles={handleScrollToRoles} />

      {/* JOIN THE TEAM DETAILS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center max-w-4xl pt-6">
        <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-rak-slate-900 border border-rak-magenta/30 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Careers at RAK4Creative</span>
        </span>
        
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {CAREERS_COPY.title}
        </h2>
        
        <p className="text-lg sm:text-xl font-semibold text-rak-magenta">
          {CAREERS_COPY.subtitle}
        </p>

        <p className="text-base sm:text-lg text-rak-slate-300 leading-relaxed max-w-3xl mx-auto">
          {CAREERS_COPY.body}
        </p>
      </section>

      {/* OPEN POSITIONS */}
      <section ref={rolesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">Open Opportunities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">{CAREERS_COPY.cta}</h2>
        </div>

        <div className="space-y-4">
          {openRoles.map((job) => (
            <div 
              key={job.id}
              className="p-6 sm:p-8 bg-rak-slate-900/80 border border-rak-slate-800 rounded-3xl hover:border-rak-magenta/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group backdrop-blur-xl"
            >
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="px-2.5 py-0.5 bg-rak-magenta/20 text-rak-magenta border border-rak-magenta/40 text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {job.department}
                  </span>
                  <span className="text-xs text-rak-slate-400 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{job.location}</span>
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-rak-magenta transition-colors">{job.title}</h3>
                <p className="text-xs text-rak-slate-300 max-w-2xl">{job.description}</p>
                <div className="text-xs font-mono text-rak-magenta">{job.salary}</div>
              </div>

              <button
                onClick={() => onApplyJob(job)}
                className="px-6 py-3 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-sm flex items-center space-x-2 shrink-0"
              >
                <span>Apply Now</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default CareersPage;

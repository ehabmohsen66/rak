import React, { useRef } from 'react';
import { Sparkles, MapPin, ArrowUpRight } from 'lucide-react';
import { useCms } from '../lib/cmsContext';
import { CareersHero } from '../components/CareersHero';

export const CareersPage = ({ onApplyJob }) => {
  const { content } = useCms();
  const careersCopy = content.careersCopy || {};
  const openRoles = (content.openRoles || []).filter((r) => r.active !== false);
  const rolesRef = useRef(null);

  const handleScrollToRoles = () => {
    rolesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pb-16 space-y-20 sm:space-y-28 bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      <CareersHero onScrollToRoles={handleScrollToRoles} />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center max-w-4xl pt-6">
        <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-rak-magenta/10 dark:bg-rak-magenta/20 border border-rak-magenta/30 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Careers at RAK4Creative</span>
        </span>
        
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
          {careersCopy.title}
        </h2>
        
        <p className="text-lg sm:text-xl font-semibold text-rak-magenta">
          {careersCopy.subtitle}
        </p>

        <p className="text-base sm:text-lg text-slate-600 dark:text-rak-slate-300 leading-relaxed max-w-3xl mx-auto">
          {careersCopy.body}
        </p>
      </section>

      <section ref={rolesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest font-mono">Open Opportunities</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">{careersCopy.cta}</h2>
        </div>

        {openRoles.length === 0 ? (
          <div className="p-10 text-center rounded-3xl bg-white dark:bg-rak-slate-900/80 border border-slate-200 dark:border-rak-slate-800 space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">No open positions listed right now</h3>
            <p className="text-xs text-slate-600 dark:text-rak-slate-300">
              Check back soon or send a spontaneous portfolio introduction to hello@rak4creative.com.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {openRoles.map((job) => (
              <div 
                key={job.id}
                className="p-6 sm:p-8 bg-white dark:bg-rak-slate-900/80 border border-slate-200 dark:border-rak-slate-800 rounded-3xl hover:border-rak-magenta/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group backdrop-blur-xl shadow-sm hover:shadow-md"
              >
                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-3">
                    <span className="px-2.5 py-0.5 bg-rak-magenta/10 dark:bg-rak-magenta/20 text-rak-magenta border border-rak-magenta/30 text-[10px] font-bold uppercase tracking-wider rounded-full font-mono">
                      {job.department}
                    </span>
                    <span className="text-xs text-slate-600 dark:text-rak-slate-300 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{job.location}</span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-rak-magenta transition-colors font-heading">{job.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-rak-slate-300 max-w-2xl">{job.description}</p>
                  <div className="text-xs font-mono text-rak-magenta font-semibold">{job.salary}</div>
                </div>

                <button
                  type="button"
                  onClick={() => onApplyJob(job)}
                  className="px-6 py-3 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-sm flex items-center space-x-2 shrink-0 hover:scale-105 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
                >
                  <span>Apply for Role</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default CareersPage;

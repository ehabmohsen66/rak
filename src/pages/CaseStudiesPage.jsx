import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useCms } from '../lib/cmsContext';
import { WovenLightHero } from '../components/WovenLightHero';

export const CaseStudiesPage = ({ onSelectProject, onOpenPlanner }) => {
  const { content } = useCms();
  const projects = content.projects || [];

  return (
    <div className="pb-16 space-y-20 bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      <WovenLightHero onOpenPlanner={onOpenPlanner} />

      <section id="case-studies-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 scroll-mt-28">
        {projects.map((project, idx) => (
          <div 
            key={project.id}
            className="p-8 sm:p-12 bg-white dark:bg-rak-slate-900/90 border border-slate-200 dark:border-rak-slate-800 rounded-3xl space-y-8 relative overflow-hidden shadow-sm hover:shadow-md transition-all backdrop-blur-xl"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-slate-200 dark:border-rak-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest font-mono">Case Study {String(idx + 1).padStart(2, '0')} • {project.industry}</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">{project.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => onSelectProject(project)}
                className="px-5 py-2.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-sm inline-flex items-center space-x-2 shrink-0 hover:scale-105 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
              >
                <span>Read Full Blueprint</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(project.results || []).map((r, i) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-rak-slate-950/80 border border-slate-200 dark:border-rak-slate-800 rounded-2xl text-center space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-rak-magenta font-mono">{r.metric}</div>
                  <div className="text-xs text-slate-600 dark:text-rak-slate-300 font-medium">{r.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 p-6 bg-slate-50/80 dark:bg-rak-slate-950/50 border border-slate-200 dark:border-rak-slate-800/80 rounded-2xl">
                <div className="text-xs font-bold text-rak-magenta uppercase tracking-wider font-mono">The Business Challenge</div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              <div className="space-y-3 p-6 bg-slate-50/80 dark:bg-rak-slate-950/50 border border-slate-200 dark:border-rak-slate-800/80 rounded-2xl">
                <div className="text-xs font-bold text-rak-magenta uppercase tracking-wider font-mono">Strategic Execution</div>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
                  {project.solution}
                </p>
              </div>
            </div>

          </div>
        ))}
      </section>

    </div>
  );
};

export default CaseStudiesPage;

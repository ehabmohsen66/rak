import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS } from '../data/contentData';
import { WovenLightHero } from '../components/WovenLightHero';

export const CaseStudiesPage = ({ onSelectProject, onOpenPlanner }) => {
  return (
    <div className="pt-16 pb-16 space-y-20">
      
      {/* WOVEN LIGHT 3D HERO FOR CASE STUDIES */}
      <WovenLightHero onOpenPlanner={onOpenPlanner} />

      {/* CASE STUDIES LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {PROJECTS.map((project, idx) => (
          <div 
            key={project.id}
            className="p-8 sm:p-12 bg-rak-slate-900/90 border border-rak-slate-800 rounded-3xl space-y-8 relative overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-6 border-b border-rak-slate-800">
              <div className="space-y-1">
                <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">Case Study 0{idx + 1} • {project.industry}</span>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white">{project.title}</h2>
              </div>
              <button
                onClick={() => onSelectProject(project)}
                className="px-5 py-2.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-sm inline-flex items-center space-x-2 shrink-0"
              >
                <span>Read Full Blueprint</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Overview Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.results.map((r, i) => (
                <div key={i} className="p-4 bg-rak-slate-950/80 border border-rak-slate-800 rounded-2xl text-center space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-rak-magenta">{r.metric}</div>
                  <div className="text-xs text-rak-slate-400 font-medium">{r.label}</div>
                </div>
              ))}
            </div>

            {/* Challenge & Strategy Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3 p-6 bg-rak-slate-950/50 border border-rak-slate-800/80 rounded-2xl">
                <div className="text-xs font-bold text-rak-magenta uppercase tracking-wider">The Business Challenge</div>
                <p className="text-xs sm:text-sm text-rak-slate-300 leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              <div className="space-y-3 p-6 bg-rak-slate-950/50 border border-rak-slate-800/80 rounded-2xl">
                <div className="text-xs font-bold text-rak-magenta uppercase tracking-wider">Strategic Execution</div>
                <p className="text-xs sm:text-sm text-rak-slate-300 leading-relaxed">
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

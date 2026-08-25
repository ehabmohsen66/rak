import React, { useEffect } from 'react';
import { X, CheckCircle2, ArrowUpRight, Award, ChevronRight } from 'lucide-react';

export const ProjectModal = ({ project, onClose, onOpenPlanner }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 sm:py-10 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-rak-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-rak-slate-100 max-h-[88vh] flex flex-col my-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-rak-slate-950/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-rak-magenta/10 border border-rak-magenta/30 text-rak-magenta text-[10px] font-bold uppercase tracking-widest rounded-full">
              {project.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-rak-slate-400 font-mono">{project.year}</span>
          </div>
          
          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-200/80 dark:bg-rak-slate-800 hover:bg-rak-magenta text-slate-700 dark:text-rak-slate-300 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105 shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Hero Banner */}
          <div className="relative h-64 sm:h-96 rounded-2xl overflow-hidden group">
            <img 
              src={project.image} 
              alt={project.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">{project.client}</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{project.title}</h1>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.results.map((res, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-rak-slate-950/80 border border-slate-200 dark:border-rak-slate-800 rounded-2xl text-center space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-rak-magenta">{res.metric}</div>
                <div className="text-xs text-slate-500 dark:text-rak-slate-400 font-medium">{res.label}</div>
              </div>
            ))}
          </div>

          {/* Challenge & Solution Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 dark:bg-rak-slate-950/50 border border-slate-200 dark:border-rak-slate-800/80 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rak-magenta flex items-center space-x-2">
                <span>01. The Challenge</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-rak-slate-950/50 border border-slate-200 dark:border-rak-slate-800/80 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rak-magenta flex items-center space-x-2">
                <span>02. The Strategy & Solution</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 dark:text-rak-slate-400 uppercase tracking-wider">Deliverables & Stack</div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-rak-slate-800 border border-slate-200 dark:border-rak-slate-700 text-slate-700 dark:text-rak-slate-200 text-xs rounded-lg font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="p-6 bg-gradient-to-r from-rak-magenta/10 via-slate-50 to-slate-50 dark:from-rak-magenta/20 dark:via-rak-slate-900 dark:to-rak-slate-900 border border-rak-magenta/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Inspired by this project outcome?</h4>
              <p className="text-xs text-slate-500 dark:text-rak-slate-400">Let's discuss how RAK 4 CREATIVE can deliver similar results for your business.</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenPlanner();
              }}
              className="px-6 py-3 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-full shadow-md flex items-center space-x-2 shrink-0 cursor-pointer transition-transform hover:scale-105"
            >
              <span>Build Similar Brief</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

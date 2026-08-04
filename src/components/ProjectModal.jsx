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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-rak-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-rak-slate-900 border border-rak-slate-800 rounded-3xl overflow-hidden shadow-2xl text-rak-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rak-slate-800 bg-rak-slate-950/60 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 bg-rak-magenta/20 border border-rak-magenta/40 text-rak-magenta text-[10px] font-bold uppercase tracking-widest rounded-full">
              {project.category}
            </span>
            <span className="text-xs text-rak-slate-400 font-mono">{project.year}</span>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-rak-slate-800 hover:bg-rak-magenta text-rak-slate-300 hover:text-white transition-colors"
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
            <div className="absolute inset-0 bg-gradient-to-t from-rak-slate-950 via-rak-slate-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 space-y-2">
              <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">{project.client}</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white">{project.title}</h1>
            </div>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.results.map((res, i) => (
              <div key={i} className="p-4 bg-rak-slate-950/80 border border-rak-slate-800 rounded-2xl text-center space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-rak-magenta">{res.metric}</div>
                <div className="text-xs text-rak-slate-400 font-medium">{res.label}</div>
              </div>
            ))}
          </div>

          {/* Challenge & Solution Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-rak-slate-950/50 border border-rak-slate-800/80 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-rak-magenta flex items-center space-x-2">
                <span>01. The Challenge</span>
              </h3>
              <p className="text-xs sm:text-sm text-rak-slate-300 leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-6 bg-rak-slate-950/50 border border-rak-slate-800/80 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-rak-magenta flex items-center space-x-2">
                <span>02. The Strategy & Solution</span>
              </h3>
              <p className="text-xs sm:text-sm text-rak-slate-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-rak-slate-400 uppercase tracking-wider">Deliverables & Stack</div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-rak-slate-800 border border-rak-slate-700 text-rak-slate-200 text-xs rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="p-6 bg-gradient-to-r from-rak-magenta/20 via-rak-slate-900 to-rak-slate-900 border border-rak-magenta/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-lg font-bold text-white">Inspired by this project outcome?</h4>
              <p className="text-xs text-rak-slate-400">Let's discuss how RAK 4 CREATIVE can deliver similar results for your business.</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenPlanner();
              }}
              className="px-5 py-2.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-sm flex items-center space-x-2 shrink-0"
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

import React, { useState, useMemo } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { useCms } from '../lib/cmsContext';
import { WebGLShader } from '../components/WebGLShader';
import { MarqueeLogoScroller } from '../components/MarqueeLogoScroller';

export const WorkPage = ({ onSelectProject }) => {
  const { content } = useCms();
  const projects = content.projects || [];
  const [filter, setFilter] = useState('All');

  const categories = useMemo(() => {
    const unique = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));
    return ['All', ...unique];
  }, [projects]);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <div className="pb-16 space-y-16 sm:space-y-24 bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      <section className="relative w-full min-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden border-b border-slate-200 dark:border-rak-slate-800/80 pt-28">
        <WebGLShader className="opacity-95" />
        
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/65 via-transparent to-slate-950 pointer-events-none z-10" />

        <div className="relative z-20 space-y-6 sm:space-y-8 text-center max-w-5xl mx-auto px-4 sm:px-6 my-auto py-12 md:py-20">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-900/90 border border-rak-magenta/40 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-magenta-sm">
            <Sparkles className="w-4 h-4 text-rak-magenta" />
            <span>Interactive Portfolio Archive</span>
          </div>
          
          <h1 
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white uppercase leading-[1.08] font-heading px-2"
            style={{ 
              textShadow: '0 0 40px rgba(236, 0, 140, 0.35)' 
            }}
          >
            THE <span className="text-gradient-magenta">RAK4</span> CREATIONS
          </h1>
          
          <p className="text-sm sm:text-lg md:text-xl text-slate-200 leading-relaxed font-normal max-w-3xl mx-auto drop-shadow-md px-2">
            From ground zero to new heights. Browse how we shape brand identity, custom software, and performance media campaigns.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-4">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 sm:px-6 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 backdrop-blur-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta ${
                  filter === cat 
                    ? 'bg-rak-magenta text-white shadow-magenta-glow scale-105' 
                    : 'bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:border-rak-magenta/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="relative z-20 bg-white dark:bg-rak-slate-900 border-t border-slate-200 dark:border-rak-slate-800 text-slate-900 dark:text-white rounded-t-[2.5rem] md:rounded-t-[3.5rem] px-6 py-10 md:px-10 md:py-14 shadow-2xl mt-auto w-full">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            <div className="bg-slate-50 dark:bg-rak-slate-950/80 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center relative border border-slate-200 dark:border-rak-slate-800 hover:border-rak-magenta/50 transition-all shadow-sm">
              <h3 className="text-lg md:text-xl uppercase leading-tight mb-2 font-bold text-slate-900 dark:text-white font-heading">
                SELECTED<br/>CREATIONS
              </h3>
              <p className="text-[11px] md:text-xs text-slate-600 dark:text-rak-slate-400 font-medium mb-4">
                Curated portfolio showcase of global enterprise digital transformations
              </p>
              <div className="mt-auto px-4 py-1.5 bg-rak-magenta/10 dark:bg-rak-magenta/20 border border-rak-magenta/40 text-rak-magenta rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                {projects.length} Published Cases
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-rak-slate-950/80 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center relative border border-slate-200 dark:border-rak-slate-800 hover:border-rak-magenta/50 transition-all shadow-sm">
              <h3 className="text-lg md:text-xl uppercase leading-tight mb-2 font-bold text-slate-900 dark:text-white font-heading">
                360° DIGITAL<br/>EXECUTION
              </h3>
              <p className="text-[11px] md:text-xs text-slate-600 dark:text-rak-slate-400 font-medium mb-4">
                Integrating brand identity, web software, media production, and growth ads
              </p>
              <div className="mt-auto px-4 py-1.5 bg-rak-magenta text-white rounded-full text-[10px] font-bold uppercase tracking-wider font-mono shadow-sm">
                End-To-End Delivery
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-rak-slate-950/80 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center relative border border-slate-200 dark:border-rak-slate-800 hover:border-rak-magenta/50 transition-all shadow-sm">
              <h3 className="text-lg md:text-xl uppercase leading-tight mb-2 font-bold text-slate-900 dark:text-white font-heading">
                MEASURABLE<br/>OUTCOMES
              </h3>
              <p className="text-[11px] md:text-xs text-slate-600 dark:text-rak-slate-400 font-medium mb-4">
                Delivering conversion lift, brand clarity, and accountable campaign performance
              </p>
              <div className="mt-auto px-4 py-1.5 bg-rak-magenta/10 dark:bg-rak-magenta/20 border border-rak-magenta/40 text-rak-magenta rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                Documented Case Studies
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarqueeLogoScroller 
          title="Global Client Reach & Partner Ecosystem"
          description="Delivering end-to-end full-service agency execution across international markets."
          speed="normal"
        />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredProjects.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-rak-slate-800 space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">No projects found in "{filter}"</h2>
            <p className="text-xs text-slate-600 dark:text-rak-slate-300">Reset the category filter to browse all portfolio creations.</p>
            <button
              type="button"
              onClick={() => setFilter('All')}
              className="px-5 py-2.5 bg-rak-magenta text-white text-xs font-bold uppercase tracking-wider rounded-full cursor-pointer"
            >
              Show All Creations
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="group cursor-pointer space-y-4 bg-white dark:bg-rak-slate-900/60 p-5 border border-slate-200 dark:border-rak-slate-800 rounded-3xl hover:border-rak-magenta/50 transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-xl"
              >
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-rak-slate-950">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  
                  {project.results?.[0] && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-full text-xs font-mono text-rak-magenta">
                      {project.results[0].metric} {project.results[0].label}
                    </div>
                  )}

                  <div className="absolute top-4 right-4 p-2.5 rounded-full bg-rak-magenta text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-2 px-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rak-magenta uppercase tracking-wider font-mono">{project.client}</span>
                    <span className="text-xs font-mono text-slate-500 dark:text-rak-slate-400">{project.year}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-rak-magenta transition-colors font-heading">{project.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-rak-slate-300 leading-relaxed line-clamp-2">{project.summary}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {(project.tags || []).map((t, i) => (
                      <span key={i} className="px-2.5 py-0.5 bg-slate-100 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 text-[10px] text-slate-600 dark:text-rak-slate-300 rounded-md font-mono">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
};

export default WorkPage;

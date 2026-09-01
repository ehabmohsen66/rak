import React, { useState } from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { RAK4_CREATIONS } from '../data/contentData';
import { WebGLShader } from '../components/WebGLShader';
import { MarqueeLogoScroller } from '../components/MarqueeLogoScroller';

export const WorkPage = ({ onSelectProject }) => {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Branding & Web', 'Paid Media & 3D', 'Digital Consultancy'];

  const filteredProjects = filter === 'All' 
    ? RAK4_CREATIONS 
    : RAK4_CREATIONS.filter(p => p.category === filter);

  return (
    <div className="pt-16 pb-16 space-y-16 sm:space-y-24 bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* 3D GLSL WEBGL HERO */}
      <section className="relative w-full min-h-screen bg-slate-950 flex flex-col justify-between overflow-hidden border-b border-slate-200 dark:border-rak-slate-800/80 -mt-16 pt-28">
        <WebGLShader className="opacity-90" />
        
        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950 pointer-events-none z-10" />

        {/* Hero Main Content */}
        <div className="relative z-20 space-y-8 text-center max-w-5xl mx-auto px-4 sm:px-6 my-auto py-16 md:py-24">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-900/90 border border-rak-magenta/40 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-magenta-sm">
            <Sparkles className="w-4 h-4 text-rak-magenta animate-spin-slow" />
            <span>Interactive WebGL Portfolio Archive</span>
          </div>
          
          <h1 
            className="text-[clamp(2.5rem,10vw,140px)] font-black text-white tracking-tight uppercase leading-[0.9] font-heading"
            style={{ 
              textShadow: '0 0 50px rgba(236, 0, 140, 0.4)' 
            }}
          >
            THE <span className="text-gradient-magenta">RAK4</span> CREATIONS
          </h1>
          
          <p className="text-base sm:text-xl text-slate-200 leading-relaxed font-normal max-w-3xl mx-auto drop-shadow-md">
            From ground zero to new heights. Explore how we create big ideas and execute online and offline presence that makes a real impact.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 backdrop-blur-md cursor-pointer ${
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

        {/* Bottom Features Showcase Bar */}
        <div className="relative z-20 bg-white dark:bg-rak-slate-900 border-t border-slate-200 dark:border-rak-slate-800 text-slate-900 dark:text-white rounded-t-[2.5rem] md:rounded-t-[3.5rem] px-6 py-10 md:px-10 md:py-14 shadow-2xl mt-auto w-full">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            
            {/* Card 1 */}
            <div className="bg-slate-50 dark:bg-rak-slate-950/80 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center relative border border-slate-200 dark:border-rak-slate-800 hover:border-rak-magenta/50 transition-all shadow-sm">
              <h3 className="text-lg md:text-xl uppercase leading-tight mb-2 font-black text-slate-900 dark:text-white font-heading">
                SELECTED<br/>CREATIONS
              </h3>
              <p className="text-[10px] md:text-xs text-slate-600 dark:text-rak-slate-400 font-medium mb-4">
                Curated portfolio showcase of global enterprise digital transformations
              </p>
              <div className="mt-auto px-4 py-1.5 bg-rak-magenta/10 dark:bg-rak-magenta/20 border border-rak-magenta/40 text-rak-magenta rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                100% Verified Impact
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 dark:bg-rak-slate-950/80 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center relative border border-slate-200 dark:border-rak-slate-800 hover:border-rak-magenta/50 transition-all shadow-sm">
              <h3 className="text-lg md:text-xl uppercase leading-tight mb-2 font-black text-slate-900 dark:text-white font-heading">
                360° DIGITAL<br/>EXECUTION
              </h3>
              <p className="text-[10px] md:text-xs text-slate-600 dark:text-rak-slate-400 font-medium mb-4">
                Integrating brand identity, web software, media production, and growth ads
              </p>
              <div className="mt-auto px-4 py-1.5 bg-rak-cyan/10 dark:bg-rak-cyan/20 border border-rak-cyan/40 text-rak-cyan rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                End-To-End Delivery
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 dark:bg-rak-slate-950/80 rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center relative border border-slate-200 dark:border-rak-slate-800 hover:border-rak-magenta/50 transition-all shadow-sm">
              <h3 className="text-lg md:text-xl uppercase leading-tight mb-2 font-black text-slate-900 dark:text-white font-heading">
                PROVEN<br/>ENTERPRISE ROI
              </h3>
              <p className="text-[10px] md:text-xs text-slate-600 dark:text-rak-slate-400 font-medium mb-4">
                Delivering high conversion, brand dominance, and measurable revenue scaling
              </p>
              <div className="mt-auto px-4 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                Global Recognition
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CLIENT IMPACT MAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarqueeLogoScroller 
          title="Global Client Reach & Partner Ecosystem"
          description="Delivering end-to-end full-service agency execution across international markets."
          speed="normal"
        />
      </section>

      {/* GALLERY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                
                <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-full text-xs font-mono text-rak-magenta">
                  {project.results[0].metric} {project.results[0].label}
                </div>

                <div className="absolute top-4 right-4 p-2.5 rounded-full bg-rak-magenta text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2 px-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rak-magenta uppercase tracking-wider font-mono">{project.client}</span>
                  <span className="text-xs font-mono text-slate-500 dark:text-rak-slate-500">{project.year}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-rak-magenta transition-colors font-heading">{project.title}</h3>
                <p className="text-xs text-slate-600 dark:text-rak-slate-400 leading-relaxed line-clamp-2">{project.summary}</p>
                
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((t, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-slate-100 dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 text-[10px] text-slate-600 dark:text-rak-slate-400 rounded-md font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default WorkPage;

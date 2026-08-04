import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Globe, Layers, MapPin } from 'lucide-react';
import { RAK4_CREATIONS, BRAND_INFO } from '../data/contentData';
import { WebGLShader } from '../components/WebGLShader';
import { MarqueeLogoScroller } from '../components/MarqueeLogoScroller';

export const WorkPage = ({ onSelectProject }) => {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Branding & Web', 'Paid Media & 3D', 'Digital Consultancy'];

  const filteredProjects = filter === 'All' 
    ? RAK4_CREATIONS 
    : RAK4_CREATIONS.filter(p => p.category === filter);

  return (
    <div className="pt-20 pb-16 space-y-16">
      
      {/* 3D GLSL WEBGL HERO - FULL BLEED HERO SECTION */}
      <section className="relative w-full min-h-[70vh] sm:min-h-[80vh] flex flex-col justify-center items-center overflow-hidden bg-rak-slate-950 px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-b border-rak-slate-800/80 -mt-20 pt-32">
        <WebGLShader className="opacity-90" />
        
        {/* Ambient Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-rak-slate-950 via-rak-slate-950/50 to-rak-slate-950/30 pointer-events-none z-10" />

        <div className="relative z-20 space-y-6 text-center max-w-5xl mx-auto">
          <span className="inline-flex items-center space-x-2 px-4 py-2 bg-rak-slate-900/90 border border-rak-magenta/40 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-magenta-sm">
            <Sparkles className="w-4 h-4 text-rak-magenta" />
            <span>Interactive WebGL Portfolio Archive</span>
          </span>
          
          <h1 className="text-4xl sm:text-7xl lg:text-8xl font-extrabold text-white tracking-tight uppercase" style={{ textShadow: '0 0 40px rgba(230, 0, 126, 0.4)' }}>
            The <span className="text-gradient-magenta">RAK4 Creations.</span>
          </h1>
          
          <p className="text-base sm:text-xl text-rak-slate-200 leading-relaxed font-normal max-w-3xl mx-auto drop-shadow-md">
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
                    : 'bg-rak-slate-900/90 border border-rak-slate-700/80 text-rak-slate-300 hover:border-rak-magenta/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
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
              className="group cursor-pointer space-y-4 bg-rak-slate-900/60 p-5 border border-rak-slate-800 rounded-3xl hover:border-rak-magenta/50 transition-all duration-300"
            >
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-rak-slate-950">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rak-slate-950 via-transparent to-transparent opacity-80" />
                
                <div className="absolute top-4 left-4 px-3 py-1 bg-rak-slate-950/80 backdrop-blur-md border border-rak-slate-800 rounded-full text-xs font-mono text-rak-magenta">
                  {project.results[0].metric} {project.results[0].label}
                </div>

                <div className="absolute top-4 right-4 p-2.5 rounded-full bg-rak-magenta text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

              <div className="space-y-2 px-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rak-magenta uppercase tracking-wider">{project.client}</span>
                  <span className="text-xs font-mono text-rak-slate-500">{project.year}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-rak-magenta transition-colors">{project.title}</h3>
                <p className="text-xs text-rak-slate-400 leading-relaxed line-clamp-2">{project.summary}</p>
                
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((t, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-rak-slate-950 border border-rak-slate-800 text-[10px] text-rak-slate-400 rounded-md">
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

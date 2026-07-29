import React, { useState } from 'react';
import { Sparkles, ArrowUpRight, Globe, Layers, MapPin } from 'lucide-react';
import { RAK4_CREATIONS, BRAND_INFO } from '../data/contentData';
import { InfiniteSlider } from '../components/ui/infinite-slider';

export const WorkPage = ({ onSelectProject }) => {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Branding & Web', 'Paid Media & 3D', 'Digital Consultancy'];

  const filteredProjects = filter === 'All' 
    ? RAK4_CREATIONS 
    : RAK4_CREATIONS.filter(p => p.category === filter);

  return (
    <div className="pt-24 pb-16 space-y-16">
      
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-center max-w-4xl">
        <span className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-rak-slate-900 border border-rak-magenta/30 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Portfolio Archive</span>
        </span>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
          The <span className="text-gradient-magenta">RAK4 Creations.</span>
        </h1>
        
        <p className="text-base sm:text-lg text-rak-slate-300 leading-relaxed font-normal">
          From ground zero to new heights. Explore how we create big ideas and execute online and offline presence that makes a real impact.
        </p>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${
                filter === cat 
                  ? 'bg-rak-magenta text-white shadow-magenta-sm' 
                  : 'bg-rak-slate-900 border border-rak-slate-800 text-rak-slate-300 hover:border-rak-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* CLIENT IMPACT MAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-rak-slate-900/80 border border-rak-slate-800 rounded-3xl backdrop-blur-xl space-y-6 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest flex items-center space-x-2">
              <Globe className="w-4 h-4" />
              <span>Global Client Reach & Partner Map</span>
            </span>
            <span className="text-xs font-mono text-rak-slate-400">One-Stop Agency Execution</span>
          </div>

          <InfiniteSlider gap={28} duration={90} durationOnHover={180} className="py-4">
            {BRAND_INFO.clients.map((client, i) => (
              <div 
                key={i} 
                className="px-6 py-4 bg-white rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer shrink-0 flex items-center justify-center h-20 w-44 overflow-hidden border border-white/20"
              >
                {client.image && (
                  <img 
                    src={client.image} 
                    alt={client.name} 
                    className="max-h-14 max-w-[140px] object-contain transition-all filter drop-shadow-sm"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const sibling = e.currentTarget.nextElementSibling;
                      if (sibling) sibling.style.display = 'inline-block';
                    }}
                  />
                )}
                <span 
                  className="text-xs font-bold font-mono text-rak-slate-900 tracking-wider"
                  style={{ display: client.image ? 'none' : 'inline-block' }}
                >
                  {client.logo}
                </span>
              </div>
            ))}

          </InfiniteSlider>
        </div>
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

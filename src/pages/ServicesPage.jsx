import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ArrowUpRight, Compass, BarChart3, Share2, Code, Search, Target, Video } from 'lucide-react';
import { GLSLHills } from '../components/GLSLHills';
import { PILLARS } from '../data/contentData';

export const ServicesPage = ({ onOpenPlanner }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Consultancy', 'Intelligence', 'Engagement', 'Development', 'SEO & SEM', 'Performance', 'Production', 'Identity'];

  const filteredPillars = activeCategory === 'All' 
    ? PILLARS 
    : PILLARS.filter(p => p.category === activeCategory);

  const getPillarIcon = (iconName) => {
    switch(iconName) {
      case 'Compass': return Compass;
      case 'BarChart3': return BarChart3;
      case 'Share2': return Share2;
      case 'Code': return Code;
      case 'Search': return Search;
      case 'Target': return Target;
      case 'Video': return Video;
      default: return Sparkles;
    }
  };

  return (
    <div className="pt-16 pb-16 space-y-16 sm:space-y-24 bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* 3D GLSL HILLS HERO SECTION FOR PILLARS */}
      <section className="relative w-full min-h-[75vh] md:min-h-[85vh] bg-slate-950 flex flex-col items-center justify-center overflow-hidden border-b border-slate-200 dark:border-rak-slate-800/80">
        
        {/* Realtime 3D GLSL Hills Canvas Background */}
        <div className="absolute inset-0 z-0">
          <GLSLHills width="100%" height="100%" speed={0.4} colorRgb={[0.9, 0.0, 0.49]} />
        </div>

        {/* Gradient Fade Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-transparent to-slate-950 z-1 pointer-events-none" />

        {/* Main Content Area */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 py-16">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-slate-900/90 border border-rak-magenta/40 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-magenta-sm">
            <Sparkles className="w-4 h-4" />
            <span>8 Pillars of Capability</span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white uppercase tracking-tight leading-none font-heading">
            <span className="text-rak-magenta">8 CORE</span> PILLARS
          </h1>

          <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal">
            One stop for every stage of the work. From ideation and strategy to execution, performance monitoring, and enterprise evaluation.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenPlanner}
              className="px-8 py-4 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-glow transition-all flex items-center space-x-2 hover:scale-105 cursor-pointer"
            >
              <span>Initiate Project Brief</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>

            <a
              href="#digital-consultancy"
              className="px-8 py-4 bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-xs font-bold uppercase tracking-wider rounded-full backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
            >
              <span>Explore Capability Units</span>
            </a>
          </div>

          {/* Domain Category Filter Pills */}
          <div className="pt-8 border-t border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4 font-mono">Filter Capabilities by Domain</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-rak-magenta text-white shadow-magenta-sm scale-105'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-300 hover:border-rak-magenta/40 hover:text-white backdrop-blur-md'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* PILLARS LIST SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {filteredPillars.map((pillar, index) => {
          const IconComp = getPillarIcon(pillar.icon);
          return (
            <div 
              key={pillar.id}
              id={pillar.id}
              className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-rak-slate-900/80 border border-slate-200 dark:border-rak-slate-800 space-y-8 hover:border-rak-magenta/40 transition-all group backdrop-blur-xl shadow-sm hover:shadow-md scroll-mt-28"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Image & Icon Column */}
                <div className={`lg:col-span-5 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-rak-slate-950">
                    <img 
                      src={pillar.featuredImage} 
                      alt={pillar.title} 
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    
                    <div className="absolute top-4 left-4 flex items-center space-x-2">
                      <span className="px-3 py-1 bg-rak-magenta text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-magenta-sm">
                        {pillar.tag}
                      </span>
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 flex items-center space-x-3 p-4 rounded-xl bg-slate-900/90 dark:bg-rak-slate-950/90 border border-white/10 backdrop-blur-xl shadow-2xl">
                      <div className="p-2.5 rounded-xl bg-rak-magenta text-white shrink-0 shadow-magenta-sm">
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white tracking-wide font-heading">{pillar.title}</div>
                        <div className="text-[11px] text-slate-300 font-medium mt-0.5 leading-snug">{pillar.subtitle}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text & Deliverables Column */}
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest font-mono">{pillar.category}</span>
                    <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">{pillar.title}</h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">{pillar.description}</p>
                  </div>

                  {/* Complete Services List from Document */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                      <Sparkles className="w-3.5 h-3.5 text-rak-magenta" />
                      <span>Capabilities & Services Breakdown</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {pillar.items.map((item, i) => (
                        <div key={i} className="p-3 bg-slate-50 dark:bg-rak-slate-950/80 border border-slate-200 dark:border-rak-slate-800/90 rounded-xl text-xs font-medium text-slate-700 dark:text-rak-slate-200 flex items-start space-x-2.5">
                          <CheckCircle2 className="w-4 h-4 text-rak-magenta shrink-0 mt-0.5" />
                          <span className="leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onOpenPlanner}
                      className="inline-flex items-center space-x-2 px-6 py-3 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-sm transition-all hover:scale-105 cursor-pointer"
                    >
                      <span>Inquire About This Pillar</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </section>

      {/* FOOTER CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-gradient-to-r from-rak-magenta/10 via-white to-slate-50 dark:from-rak-magenta/20 dark:via-rak-slate-900 dark:to-rak-slate-900 border border-rak-magenta/30 rounded-3xl text-center space-y-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">Need an end-to-end strategy built for your brand?</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 max-w-xl mx-auto">
            From ground zero to new heights, RAK4Creative brings brand strategy, creative production, and digital performance marketing under one roof.
          </p>
          <button
            onClick={onOpenPlanner}
            className="px-8 py-3.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-glow inline-flex items-center space-x-2 hover:scale-105 transition-all cursor-pointer"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};

export default ServicesPage;

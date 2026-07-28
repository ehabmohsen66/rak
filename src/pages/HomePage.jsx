import React from 'react';
import { 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Award, 
  CheckCircle2, 
  Zap, 
  Layers, 
  Code, 
  Layout, 
  Video, 
  Cpu,
  ChevronRight,
  Star
} from 'lucide-react';
import { BRAND_INFO, SERVICES, PROJECTS, TESTIMONIALS, PILLARS } from '../data/contentData';
import { AgencyOrchestrationMatrix } from '../components/AgencyOrchestrationMatrix';
import { HeroAgencyOrchestrationCard } from '../components/HeroAgencyOrchestrationCard';
import { InfiniteSlider } from '../components/ui/infinite-slider';

export const HomePage = ({ setActiveTab, onSelectProject, onOpenPlanner }) => {
  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
        
        {/* Background Ambient FX */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-rak-magenta/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-rak-slate-700/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-rak-slate-900/90 border border-rak-magenta/30 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-magenta-sm">
                <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Your One-Stop Agency</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08]">
                We Create Big Ideas From Ground Zero & Take Them to <span className="text-gradient-magenta">New Heights.</span>
              </h1>

              {/* Supporting Value Proposition */}
              <p className="text-base sm:text-lg text-rak-slate-300 max-w-2xl leading-relaxed font-normal">
                {BRAND_INFO.description}
              </p>

              {/* Primary & Secondary Action CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <button
                  onClick={onOpenPlanner}
                  className="relative inline-flex items-center justify-center px-8 py-4 text-xs font-bold uppercase tracking-wider text-white bg-rak-magenta rounded-full shadow-magenta-glow hover:bg-rak-magenta-dark transition-all duration-300 group overflow-hidden"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Start a Project</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </button>

                <button
                  onClick={() => { setActiveTab('work'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="inline-flex items-center justify-center px-8 py-4 text-xs font-bold uppercase tracking-wider text-rak-slate-200 hover:text-white bg-rak-slate-900/80 hover:bg-rak-slate-800 border border-rak-slate-700/80 rounded-full backdrop-blur-md transition-all"
                >
                  <span>Explore RAK4 Creations</span>
                </button>
              </div>

              {/* Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-rak-slate-800/80">
                {BRAND_INFO.stats.map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
                    <div className="text-[11px] font-semibold text-rak-slate-400 leading-tight">{stat.label}</div>
                    <div className="text-[10px] text-rak-magenta font-mono">{stat.change}</div>
                  </div>
                ))}
              </div>

            </div>

            {/* Right Interactive Hero Agency Orchestration Visual */}
            <div className="lg:col-span-5 relative">
              <HeroAgencyOrchestrationCard onOpenPlanner={onOpenPlanner} />
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRUST BAR / CLIENT BRANDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-rak-slate-900/60 border border-rak-slate-800 rounded-3xl backdrop-blur-md space-y-6 overflow-hidden">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-rak-slate-400">
            Trusted by Ambitious Enterprises & Global Innovators
          </p>

          <InfiniteSlider gap={28} duration={35} durationOnHover={70} className="py-4">
            {BRAND_INFO.clients.map((client, i) => (
              <div 
                key={i} 
                className="px-6 py-4 bg-white rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer shrink-0 flex items-center justify-center h-20 w-44 overflow-hidden border border-white/20"
              >
                {client.image ? (
                  <img 
                    src={client.image} 
                    alt={client.name} 
                    className="max-h-14 max-w-[140px] object-contain transition-all"
                  />
                ) : (
                  <span className="text-xs font-bold font-mono text-rak-slate-900 tracking-wider">{client.logo}</span>
                )}
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </section>

      {/* 2.5 INTER-UNIT AGENCY ORCHESTRATION FRAMEWORK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AgencyOrchestrationMatrix onOpenPlanner={onOpenPlanner} />
      </section>

      {/* 3. PILLARS OF CAPABILITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">Our Pillars</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              One Stop For Every Stage of The Work.
            </h2>
          </div>
          <button
            onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-rak-magenta hover:text-white transition-colors"
          >
            <span>View All 8 Pillars</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {PILLARS.slice(0, 6).map((s, index) => {
            const isLarge = index === 0 || index === 2;
            return (
              <div 
                key={s.id}
                onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`group relative p-8 rounded-3xl bg-rak-slate-900/80 border border-rak-slate-800/80 hover:border-rak-magenta/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between ${
                  isLarge ? 'md:col-span-8' : 'md:col-span-4'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 bg-rak-slate-800 border border-rak-slate-700 text-rak-magenta text-[10px] font-bold uppercase tracking-wider rounded-full">
                      {s.tag}
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-rak-slate-500 group-hover:text-rak-magenta group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold text-white group-hover:text-rak-magenta transition-colors">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-rak-slate-400 leading-relaxed max-w-xl">
                    {s.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-rak-slate-800/60 flex flex-wrap gap-2">
                  {s.items.slice(0, 3).map((b, i) => (
                    <span key={i} className="text-[11px] text-rak-slate-300 font-medium flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-rak-magenta" />
                      <span>{b}</span>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. RAK4 CREATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">Portfolio</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The RAK4 Creations.
            </h2>
          </div>
          <button
            onClick={() => { setActiveTab('work'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-rak-magenta hover:text-white transition-colors"
          >
            <span>Explore Work Archive</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Featured Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.filter(p => p.featured).slice(0, 4).map((p) => (
            <div 
              key={p.id}
              onClick={() => onSelectProject(p)}
              className="group cursor-pointer space-y-4"
            >
              <div className="relative h-80 sm:h-96 rounded-3xl overflow-hidden bg-rak-slate-900 border border-rak-slate-800">
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rak-slate-950 via-transparent to-transparent opacity-80" />
                
                {/* Result Pill */}
                <div className="absolute top-6 left-6 px-3 py-1.5 bg-rak-slate-950/80 backdrop-blur-md border border-rak-slate-800 rounded-full text-xs font-mono text-rak-magenta">
                  {p.results[0].metric} {p.results[0].label}
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rak-magenta">{p.client}</span>
                    <h3 className="text-xl font-bold">{p.title}</h3>
                  </div>
                  <div className="p-3 rounded-full bg-rak-magenta/90 text-white shadow-magenta-sm group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* 5. TESTIMONIALS & SOCIAL PROOF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-rak-slate-900/90 border border-rak-slate-800 rounded-3xl p-8 sm:p-12 space-y-10 relative overflow-hidden">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">Client Testimonials</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">What Executive Leaders Say About RAK.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="p-6 bg-rak-slate-950/80 border border-rak-slate-800/80 rounded-2xl space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-400 space-x-1">
                    {[...Array(t.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-rak-slate-300 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-rak-slate-800/60 flex items-center space-x-3">
                  <img src={t.avatar} alt={t.author} className="w-10 h-10 rounded-full object-cover border border-rak-magenta" />
                  <div>
                    <div className="text-xs font-bold text-white">{t.author}</div>
                    <div className="text-[10px] text-rak-slate-400">{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

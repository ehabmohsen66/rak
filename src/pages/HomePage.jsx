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
  Star,
  Compass,
  BarChart3,
  Share2,
  Search,
  Target,
  Radio
} from 'lucide-react';
import { motion } from 'framer-motion';
import { BRAND_INFO, SERVICES, PROJECTS, TESTIMONIALS, PILLARS } from '../data/contentData';
import { AgencyOrchestrationMatrix } from '../components/AgencyOrchestrationMatrix';
import { HeroAgencyOrchestrationCard } from '../components/HeroAgencyOrchestrationCard';
import { InfiniteSlider } from '../components/ui/infinite-slider';

const getPillarIcon = (iconName) => {
  switch (iconName) {
    case 'Compass': return Compass;
    case 'BarChart3': return BarChart3;
    case 'Share2': return Share2;
    case 'Code': return Code;
    case 'Search': return Search;
    case 'Target': return Target;
    case 'Video': return Video;
    case 'Radio': return Radio;
    default: return Sparkles;
  }
};

export const HomePage = ({ setActiveTab, onSelectProject, onOpenPlanner }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 28, filter: 'blur(6px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const headlineWords = ["We", "Create", "Big", "Ideas", "From", "Ground", "Zero", "&", "Take", "Them", "to"];

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      
      {/* 1. CINEMATIC STAGGER REVEAL HERO SECTION */}
      <section className="relative min-h-[82vh] flex items-center pt-28 pb-16 overflow-hidden">
        
        {/* Background Ambient FX */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-rak-magenta/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-12 right-16 w-80 h-80 bg-rak-slate-700/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-rak-magenta/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full text-center">
          <div className="space-y-8 max-w-5xl mx-auto">
            
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-rak-slate-900/90 border border-rak-magenta/30 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-magenta-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-rak-magenta" />
              <span>Your One-Stop Agency</span>
            </motion.div>

            {/* Main Staggered Headline */}
            <motion.h1 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-white leading-[1.06] text-center"
            >
              {headlineWords.map((word, i) => (
                <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.24em]">
                  {word}
                </motion.span>
              ))}
              <motion.span variants={wordVariants} className="inline-block text-gradient-magenta">
                New Heights.
              </motion.span>
            </motion.h1>

            {/* Concise Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="text-base sm:text-xl text-rak-slate-300 max-w-2xl mx-auto leading-relaxed font-normal pt-2"
            >
              Brand strategy, creative production, and digital performance marketing together under one roof.
            </motion.p>

            {/* Primary & Secondary Action CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <button
                onClick={onOpenPlanner}
                className="relative inline-flex items-center justify-center px-9 py-4 text-xs font-bold uppercase tracking-wider text-white bg-rak-magenta rounded-full shadow-magenta-glow hover:bg-rak-magenta-dark hover:scale-105 transition-all duration-300 group overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span>Start a Project</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => { setActiveTab('work'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="inline-flex items-center justify-center px-8 py-4 text-xs font-bold uppercase tracking-wider text-rak-slate-200 hover:text-white bg-rak-slate-900/80 hover:bg-rak-slate-800 border border-rak-slate-700/80 rounded-full backdrop-blur-md transition-all hover:scale-105"
              >
                <span>Explore RAK4 Creations</span>
              </button>
            </motion.div>

            {/* Metrics Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.95 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-rak-slate-800/80 max-w-4xl mx-auto"
            >
              {BRAND_INFO.stats.map((stat, i) => (
                <div key={i} className="space-y-1 p-4 rounded-2xl bg-rak-slate-900/40 border border-rak-slate-800/60 backdrop-blur-sm hover:border-rak-magenta/30 transition-all text-center">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{stat.value}</div>
                  <div className="text-[11px] font-semibold text-rak-slate-400 leading-tight">{stat.label}</div>
                  <div className="text-[10px] text-rak-magenta font-mono">{stat.change}</div>
                </div>
              ))}
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. TRUST BAR / CLIENT BRANDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-rak-slate-900/60 border border-rak-slate-800 rounded-3xl backdrop-blur-md space-y-6 overflow-hidden">
          <p className="text-center text-xs font-bold uppercase tracking-widest text-rak-slate-400">
            Trusted by Ambitious Enterprises & Global Innovators
          </p>

          <InfiniteSlider gap={28} duration={90} durationOnHover={180} className="py-4">
            {BRAND_INFO.clients.map((client, i) => (
              <div 
                key={i} 
                className="px-6 py-4 bg-white rounded-2xl shadow-xl hover:scale-105 transition-all cursor-pointer shrink-0 flex items-center justify-center h-20 w-44 overflow-hidden border border-white/20"
              >
                {client.image ? (
                  <img 
                    src={client.image} 
                    alt={client.name} 
                    className="max-h-14 max-w-[140px] object-contain transition-all filter drop-shadow-sm"
                    style={{ imageRendering: '-webkit-optimize-contrast' }}
                  />
                ) : (
                  <span className="text-xs font-bold font-mono text-rak-slate-900 tracking-wider">{client.logo}</span>
                )}
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </section>

      {/* 2.5 RAK 360° CREATIVE ENGINE WORKFLOW */}
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

        {/* Bento Grid Layout with Rich Icon Visuals & Watermarks */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {PILLARS.slice(0, 6).map((s, index) => {
            const isLarge = index === 0 || index === 2;
            const IconComp = getPillarIcon(s.icon);
            return (
              <div 
                key={s.id}
                onClick={() => { setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className={`group relative p-8 sm:p-9 rounded-3xl bg-rak-slate-900/80 border border-rak-slate-800/80 hover:border-rak-magenta/60 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between backdrop-blur-xl hover:shadow-magenta-glow ${
                  isLarge ? 'md:col-span-8' : 'md:col-span-4'
                }`}
              >
                {/* Background Translucent Vector Icon Watermark */}
                <IconComp className="w-44 h-44 absolute -right-6 -bottom-6 text-white/[0.03] group-hover:text-rak-magenta/[0.08] transition-all duration-500 pointer-events-none transform group-hover:scale-110 group-hover:rotate-6" />

                <div className="space-y-5 relative z-10">
                  {/* Top Bar: Icon Badge + Tag Pill + Arrow */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-2xl bg-rak-slate-800/90 border border-rak-magenta/30 text-rak-magenta group-hover:bg-rak-magenta group-hover:text-white group-hover:border-rak-magenta transition-all duration-300 shadow-magenta-sm">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 bg-rak-slate-800/90 border border-rak-slate-700/80 text-rak-magenta text-[10px] font-bold uppercase tracking-wider rounded-full backdrop-blur-md">
                        {s.tag}
                      </span>
                    </div>

                    <ArrowUpRight className="w-5 h-5 text-rak-slate-500 group-hover:text-rak-magenta group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  
                  {/* Card Title & Description */}
                  <div className="space-y-2 pt-1">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-rak-magenta transition-colors tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-rak-slate-300 leading-relaxed max-w-xl font-normal">
                      {s.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Items Tags */}
                <div className="pt-6 mt-6 border-t border-rak-slate-800/80 flex flex-wrap gap-2.5 relative z-10">
                  {s.items.slice(0, 3).map((b, i) => (
                    <span key={i} className="text-[11px] text-rak-slate-200 font-semibold px-3 py-1.5 rounded-xl bg-rak-slate-950/60 border border-rak-slate-800/90 flex items-center space-x-1.5 group-hover:border-rak-magenta/20 transition-all">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rak-magenta" />
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
        <div className="bg-rak-slate-900/90 border border-rak-slate-800 rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden backdrop-blur-xl">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">Client Testimonials</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">What Executive Leaders Say About RAK.</h2>
            <p className="text-xs text-rak-slate-400">Hover to pause & read leader reviews</p>
          </div>

          <InfiniteSlider gap={24} duration={65} durationOnHover={180} className="py-4">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id} 
                className="w-80 sm:w-96 shrink-0 p-6 sm:p-7 bg-rak-slate-950/90 border border-rak-slate-800/90 hover:border-rak-magenta/40 rounded-2xl space-y-5 flex flex-col justify-between backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-[1.02]"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-400 space-x-1">
                    {[...Array(t.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-rak-slate-200 leading-relaxed font-normal italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-rak-slate-800/70 flex items-center space-x-3">
                  <img src={t.avatar} alt={t.author} className="w-11 h-11 rounded-full object-cover border-2 border-rak-magenta shrink-0 shadow-magenta-sm" />
                  <div>
                    <div className="text-xs font-bold text-white tracking-wide">{t.author}</div>
                    <div className="text-[10px] text-rak-slate-400 font-medium">{t.role}</div>
                    <div className="text-[10px] text-rak-magenta font-semibold">{t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </section>

    </div>
  );
};

export default HomePage;

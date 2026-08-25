import React, { useState, useEffect } from 'react';
import { 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  BarChart3,
  Share2,
  Code,
  Search,
  Target,
  Video,
  Radio,
  Star,
  Calendar,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_INFO, PROJECTS, TESTIMONIALS, PILLARS, BLOG_POSTS } from '../data/contentData';
import { HeroAgencyOrchestrationCard } from '../components/HeroAgencyOrchestrationCard';
import { MarqueeLogoScroller } from '../components/MarqueeLogoScroller';
import { SpotlightCard } from '../components/SpotlightCard';
import { InfiniteSlider } from '../components/ui/infinite-slider';
import { GradientShimmer } from '../components/ui/GradientShimmer';

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

const HERO_PHRASES = [
  "New Heights.",
  "Next Level.",
  "Global Scale.",
  "Peak Impact.",
  "Market Lead."
];

export const HomePage = ({ 
  setActiveTab = () => {}, 
  onSelectProject = () => {}, 
  onSelectArticle = () => {},
  onOpenPlanner = () => {} 
}) => {

  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % HERO_PHRASES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  const headlineWords = ["We", "Create", "Big", "Ideas", "From", "Ground", "Zero", "&", "Take", "Them", "to"];

  return (
    <div className="space-y-24 sm:space-y-32 pb-16 relative bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* 1. CINEMATIC HERO SECTION (BRIGHT CLEAN CANVAS WITH FUCHSIA ACCENT) */}
      <section className="relative min-h-[85vh] flex items-center pt-24 pb-12 sm:pt-32 sm:pb-16 overflow-hidden bg-white dark:bg-rak-slate-950 border-b border-slate-200 dark:border-white/10">
        
        {/* Subtle Light Ambient Mesh Orbs */}
        <div className="hidden md:block absolute top-1/4 left-1/3 -translate-x-1/2 w-[700px] h-[450px] bg-rak-magenta/8 dark:bg-rak-magenta/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="hidden md:block absolute top-12 right-10 w-[550px] h-[400px] bg-rak-violet/8 dark:bg-rak-violet/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Main Crisp Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] text-left font-heading">
                {headlineWords.map((word, i) => (
                  <span key={i} className="inline-block mr-[0.24em]">
                    {word}
                  </span>
                ))}
                
                <span className="inline-block text-left relative">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={HERO_PHRASES[phraseIndex]}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.35 }}
                      className="inline-block font-black"
                    >
                      <GradientShimmer gradient="sunrise" duration={2.5}>
                        {HERO_PHRASES[phraseIndex]}
                      </GradientShimmer>
                    </motion.span>
                  </AnimatePresence>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 dark:text-rak-slate-300 max-w-xl leading-relaxed font-normal text-left">
                Brand architecture, high-impact media production, enterprise software, and performance marketing seamlessly integrated under one global powerhouse.
              </p>

              {/* Single Primary Action Button */}
              <div className="pt-2">
                <button
                  onClick={onOpenPlanner}
                  className="relative inline-flex items-center justify-center px-8 py-4 text-xs font-extrabold uppercase tracking-widest text-white bg-rak-magenta rounded-full shadow-md hover:bg-rak-magenta-dark hover:scale-105 transition-all duration-300 group overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Start a Project</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </button>
              </div>

            </div>

            {/* Right Column: Hero Agency Card (Bright & Clean) */}
            <div className="lg:col-span-5">
              <HeroAgencyOrchestrationCard onOpenPlanner={onOpenPlanner} />
            </div>

          </div>
        </div>
      </section>

      {/* 2. CLIENT BRANDS MARQUEE SCROLLER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarqueeLogoScroller 
          title="Trusted by Ambitious Enterprises & Global Innovators"
          description="Partnering with industry leaders to deliver end-to-end digital excellence."
          speed="normal"
        />
      </section>

      {/* 3. PILLARS OF CAPABILITY (BRIGHT BENTO GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest px-3 py-1 bg-rak-magenta/10 border border-rak-magenta/30 rounded-full">
              Our Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              One Stop For Every Stage of The Work.
            </h2>
          </div>
          <a
            href="/services"
            onClick={(e) => { e.preventDefault(); setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-rak-magenta hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span>View All 8 Pillars</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.slice(0, 6).map((s) => {
            const IconComp = getPillarIcon(s.icon);
            return (
              <SpotlightCard
                key={s.id}
                spotlightColor="rgba(236, 0, 140, 0.1)"
                borderColor="rgba(226, 232, 240, 0.8)"
                onClick={(e) => { e.preventDefault(); setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="group relative p-7 sm:p-8 rounded-3xl bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-white/10 cursor-pointer overflow-hidden flex flex-col justify-between shadow-sm hover:shadow-md hover:border-rak-magenta/40 transition-all duration-300"
              >
                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-rak-magenta group-hover:bg-rak-magenta group-hover:text-white transition-all duration-300">
                      <IconComp className="w-5.5 h-5.5" />
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-rak-magenta group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  
                  <div className="space-y-2 pt-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-rak-magenta transition-colors tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed font-normal">
                      {s.description}
                    </p>
                  </div>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 dark:border-white/10 flex flex-wrap gap-2 relative z-10">
                  {s.items.slice(0, 3).map((b, i) => (
                    <span key={i} className="text-[10px] sm:text-[11px] text-slate-700 dark:text-rak-slate-300 font-medium px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3 h-3 text-rak-magenta shrink-0" />
                      <span>{b}</span>
                    </span>
                  ))}
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      </section>

      {/* 4. SELECTED CREATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest px-3 py-1 bg-rak-magenta/10 border border-rak-magenta/30 rounded-full">
              Featured Work
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Selected Creations.
            </h2>
          </div>
          <a
            href="/work"
            onClick={(e) => { e.preventDefault(); setActiveTab('work'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-rak-magenta hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span>Explore Full Archive</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.filter(p => p.featured).slice(0, 4).map((p) => (
            <SpotlightCard 
              key={p.id}
              spotlightColor="rgba(236, 0, 140, 0.1)"
              borderColor="rgba(226, 232, 240, 0.8)"
              onClick={() => onSelectProject(p)}
              className="group cursor-pointer p-0 rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-sm"
            >
              <div className="relative h-80 sm:h-96 w-full bg-slate-100 dark:bg-rak-slate-900">
                <img 
                  src={p.image} 
                  alt={p.title} 
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-85" />
                
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-white">
                  <div className="space-y-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-rak-magenta block">{p.client}</span>
                    <h3 className="text-xl sm:text-2xl font-bold">{p.title}</h3>
                  </div>
                  <div className="p-3.5 rounded-full bg-rak-magenta text-white shadow-md group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* 5. EXECUTIVE TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SpotlightCard 
          spotlightColor="rgba(236, 0, 140, 0.1)"
          borderColor="rgba(226, 232, 240, 0.8)"
          className="bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden backdrop-blur-xl shadow-sm"
        >
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest px-3 py-1 bg-rak-magenta/10 border border-rak-magenta/30 rounded-full">
              Client Feedback
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">What Partners Say About RAK.</h2>
          </div>

          <InfiniteSlider gap={24} duration={65} durationOnHover={180} className="py-4">
            {TESTIMONIALS.map((t) => (
              <SpotlightCard 
                key={t.id} 
                spotlightColor="rgba(236, 0, 140, 0.15)"
                className="w-80 sm:w-96 shrink-0 p-6 bg-slate-50 dark:bg-rak-slate-950/90 border border-slate-200 dark:border-white/10 rounded-2xl space-y-5 flex flex-col justify-between backdrop-blur-md shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-400 space-x-1">
                    {[...Array(t.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-rak-slate-200 leading-relaxed font-normal italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 dark:border-white/10 flex items-center space-x-3">
                  <img src={t.avatar} alt={t.author} loading="lazy" decoding="async" className="w-11 h-11 rounded-full object-cover border-2 border-rak-magenta shrink-0" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white tracking-wide">{t.author}</div>
                    <div className="text-[10px] text-slate-500 dark:text-rak-slate-400 font-medium">{t.role}</div>
                    <div className="text-[10px] text-rak-magenta font-semibold">{t.company}</div>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </InfiniteSlider>
        </SpotlightCard>
      </section>

      {/* 6. STRATEGIC INSIGHTS / EDITORIAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest px-3.5 py-1.5 bg-rak-magenta/10 border border-rak-magenta/30 rounded-full">
              Strategic Insights
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Latest Editorial.
            </h2>
          </div>
          <a
            href="/blog"
            onClick={(e) => { e.preventDefault(); setActiveTab('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-rak-magenta hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <span>Read All Articles</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BLOG_POSTS.slice(0, 4).map((post) => (
            <SpotlightCard
              key={post.id}
              spotlightColor="rgba(236, 0, 140, 0.1)"
              borderColor="rgba(226, 232, 240, 0.8)"
              onClick={() => onSelectArticle(post)}
              className="group cursor-pointer p-0 bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:border-rak-magenta/40 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-rak-slate-950">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-75" />
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 bg-white/90 dark:bg-rak-slate-950/85 border border-slate-200 dark:border-white/10 rounded-full text-[10px] font-bold text-rak-magenta uppercase tracking-wider shadow-sm">
                    {post.category}
                  </div>
                </div>

                <div className="px-5 space-y-3">
                  <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-500 dark:text-rak-slate-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-rak-magenta" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-rak-magenta" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rak-magenta transition-colors line-clamp-2 leading-snug tracking-tight">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-rak-slate-300 line-clamp-2 leading-relaxed font-normal">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-slate-500 dark:text-rak-slate-400 font-mono truncate max-w-[140px]">
                  {post.author}
                </span>
                <span className="inline-flex items-center space-x-1 text-[11px] font-bold text-rak-magenta group-hover:translate-x-0.5 transition-transform">
                  <span>Read</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

    </div>
  );
};

export default HomePage;

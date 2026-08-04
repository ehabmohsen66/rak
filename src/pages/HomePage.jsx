import React, { useState, useEffect } from 'react';
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
  Radio,
  Calendar,
  Clock,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BRAND_INFO, SERVICES, PROJECTS, TESTIMONIALS, PILLARS, BLOG_POSTS } from '../data/contentData';
import { AgencyOrchestrationMatrix } from '../components/AgencyOrchestrationMatrix';
import { HeroAgencyOrchestrationCard } from '../components/HeroAgencyOrchestrationCard';
import { SmallHeroOrchestration } from '../components/SmallHeroOrchestration';
import { InfiniteSlider } from '../components/ui/infinite-slider';
import { AnimatedBanner } from '../components/AnimatedBanner';
import { SpotlightCard } from '../components/SpotlightCard';
import { MarqueeLogoScroller } from '../components/MarqueeLogoScroller';
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
    <div className="space-y-24 sm:space-y-32 pb-16 relative">
      
      {/* 1. CINEMATIC SPLIT HERO SECTION WITH VIBRANT MESH LIGHTS */}
      <section className="relative min-h-[85vh] flex items-center pt-28 pb-16 overflow-hidden">
        
        {/* Dynamic Multi-Color Ambient Mesh Orbs */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[900px] h-[550px] bg-rak-magenta/25 rounded-full blur-[160px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-12 right-10 w-[600px] h-[450px] bg-rak-cyan/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[500px] h-[400px] bg-rak-violet/20 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-8 text-left">
              
              {/* Glowing Badge */}
              <motion.div 
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-rak-magenta/20 via-rak-cyan/20 to-rak-violet/20 border border-rak-magenta/40 text-rak-magenta rounded-full text-xs font-extrabold uppercase tracking-widest backdrop-blur-xl shadow-magenta-sm"
              >
                <Sparkles className="w-4 h-4 text-rak-magenta animate-spin-slow" />
                <span className="text-gradient-vibrant font-black">Your One-Stop Creative & Digital Engine</span>
              </motion.div>

              {/* Main Staggered Kinetic Headline */}
              <motion.h1 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white dark:text-white light:text-slate-900 leading-[1.08] text-left"
              >
                {headlineWords.map((word, i) => (
                  <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.24em]">
                    {word}
                  </motion.span>
                ))}
                
                <span className="inline-block text-left relative">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={HERO_PHRASES[phraseIndex]}
                      initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
                      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: -16, filter: 'blur(6px)' }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="inline-block font-black drop-shadow-sm"
                    >
                      <GradientShimmer gradient="sunrise" duration={2.5}>
                        {HERO_PHRASES[phraseIndex]}
                      </GradientShimmer>
                    </motion.span>
                  </AnimatePresence>
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.65 }}
                className="text-base sm:text-lg text-rak-slate-300 dark:text-rak-slate-300 light:text-slate-700 max-w-xl leading-relaxed font-normal text-left"
              >
                Brand architecture, high-impact media production, enterprise software, and performance marketing seamlessly integrated under one global powerhouse.
              </motion.p>

              {/* Primary & Secondary Action CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 pt-2"
              >
                <button
                  onClick={onOpenPlanner}
                  className="btn-neon-magenta relative inline-flex items-center justify-center px-8 py-4 text-xs font-extrabold uppercase tracking-wider text-white rounded-full hover:scale-105 transition-all duration-300 group overflow-hidden cursor-pointer"
                >
                  <span className="relative z-10 flex items-center space-x-2">
                    <span>Start a Project</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </button>

                <a
                  href="/work"
                  onClick={(e) => { e.preventDefault(); setActiveTab('work'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="inline-flex items-center justify-center px-8 py-4 text-xs font-bold uppercase tracking-wider text-rak-slate-100 dark:text-rak-slate-100 light:text-slate-800 bg-rak-slate-900/90 hover:bg-rak-slate-800 border border-rak-cyan/40 hover:border-rak-cyan rounded-full backdrop-blur-md transition-all hover:scale-105 shadow-cyan-glow"
                >
                  <span>Explore RAK4 Creations</span>
                </a>
              </motion.div>

              {/* Interactive Metrics Spotlight Cards */}
              <motion.div 
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.95 }}
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-rak-slate-800/80"
              >
                {BRAND_INFO.stats.map((stat, i) => (
                  <SpotlightCard 
                    key={i} 
                    spotlightColor="rgba(6, 182, 212, 0.25)"
                    borderColor="rgba(6, 182, 212, 0.4)"
                    className="p-3.5 space-y-1 text-left bg-rak-slate-900/60 dark:bg-rak-slate-900/60 light:bg-white/90 border border-rak-slate-800/80"
                  >
                    <div className="text-xl sm:text-2xl font-extrabold text-gradient-vibrant tracking-tight">{stat.value}</div>
                    <div className="text-[10px] font-semibold text-rak-slate-300 dark:text-rak-slate-300 light:text-slate-600 leading-tight">{stat.label}</div>
                    <div className="text-[9px] text-rak-cyan font-mono font-bold">{stat.change}</div>
                  </SpotlightCard>
                ))}
              </motion.div>

            </div>

            {/* Right Column: Hero Agency Orchestration Card */}
            <motion.div 
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="lg:col-span-5"
            >
              <HeroAgencyOrchestrationCard onOpenPlanner={onOpenPlanner} />
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. TRUST BAR / CLIENT BRANDS WITH SEAMLESS GRADIENT MARQUEE SCROLLER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MarqueeLogoScroller 
          title="Trusted by Ambitious Enterprises & Global Innovators"
          description="Partnering with industry leaders, high-growth brands, and global institutions to deliver end-to-end digital excellence."
          speed="normal"
        />
      </section>

      {/* 2.5 RAK 360° CREATIVE ENGINE WORKFLOW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AgencyOrchestrationMatrix onOpenPlanner={onOpenPlanner} />
      </section>

      {/* 3. PILLARS OF CAPABILITY (BENTO GRID WITH SPOTLIGHT & VIBRANT GLOW) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-rak-magenta uppercase tracking-widest px-3 py-1 bg-rak-magenta/10 border border-rak-magenta/30 rounded-full">
              Our Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              One Stop For Every Stage of The Work.
            </h2>
          </div>
          <a
            href="/services"
            onClick={(e) => { e.preventDefault(); setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-rak-magenta hover:text-white transition-colors"
          >
            <span>View All 8 Pillars</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* 3x2 Grid Layout for 6 Pillars - 100% Full Space with Zero Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PILLARS.slice(0, 6).map((s, index) => {
            const IconComp = getPillarIcon(s.icon);
            return (
              <SpotlightCard
                key={s.id}
                spotlightColor={index % 2 === 0 ? "rgba(236, 0, 140, 0.25)" : "rgba(6, 182, 212, 0.25)"}
                borderColor={index % 2 === 0 ? "rgba(236, 0, 140, 0.5)" : "rgba(6, 182, 212, 0.5)"}
                onClick={(e) => { e.preventDefault(); setActiveTab('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="group relative p-7 sm:p-8 rounded-3xl bg-rak-slate-900/80 dark:bg-rak-slate-900/80 light:bg-white/90 border border-rak-slate-800/80 cursor-pointer overflow-hidden flex flex-col justify-between backdrop-blur-xl hover:shadow-magenta-glow transition-all duration-300"
              >
                {/* Background Translucent Vector Icon Watermark */}
                <IconComp className="w-44 h-44 absolute -right-6 -bottom-6 text-white/[0.04] dark:text-white/[0.04] light:text-slate-900/[0.05] group-hover:text-rak-magenta/[0.12] transition-all duration-500 pointer-events-none transform group-hover:scale-110 group-hover:rotate-6" />

                <div className="space-y-5 relative z-10">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-2xl bg-rak-slate-800/90 dark:bg-rak-slate-800/90 light:bg-slate-100 border border-rak-magenta/40 text-rak-magenta group-hover:bg-rak-magenta group-hover:text-white group-hover:border-rak-magenta transition-all duration-300 shadow-magenta-sm">
                        <IconComp className="w-5.5 h-5.5" />
                      </div>
                      <span className="px-3 py-1 bg-rak-magenta/10 border border-rak-magenta/30 text-rak-magenta text-[10px] font-extrabold uppercase tracking-wider rounded-full backdrop-blur-md">
                        {s.tag}
                      </span>
                    </div>

                    <ArrowUpRight className="w-5 h-5 text-rak-slate-400 group-hover:text-rak-magenta group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </div>
                  
                  {/* Card Title & Description */}
                  <div className="space-y-2 pt-1">
                    <h3 className="text-2xl font-extrabold text-white dark:text-white light:text-slate-900 group-hover:text-rak-magenta transition-colors tracking-tight">
                      {s.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-rak-slate-300 dark:text-rak-slate-300 light:text-slate-600 leading-relaxed font-normal">
                      {s.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Items Tags */}
                <div className="pt-5 mt-5 border-t border-rak-slate-800/80 light:border-slate-200 flex flex-wrap gap-2 relative z-10">
                  {s.items.slice(0, 3).map((b, i) => (
                    <span key={i} className="text-[10px] sm:text-[11px] text-rak-slate-200 dark:text-rak-slate-200 light:text-slate-700 font-semibold px-2.5 py-1 rounded-xl bg-rak-slate-950/60 dark:bg-rak-slate-950/60 light:bg-slate-100 border border-rak-slate-800/90 light:border-slate-300 flex items-center space-x-1.5 group-hover:border-rak-magenta/30 transition-all">
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

      {/* 4. RAK4 CREATIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold text-rak-cyan uppercase tracking-widest px-3 py-1 bg-rak-cyan/10 border border-rak-cyan/30 rounded-full">
              Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              Selected Work Archive.
            </h2>
          </div>
          <a
            href="/work"
            onClick={(e) => { e.preventDefault(); setActiveTab('work'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-rak-cyan hover:text-white transition-colors"
          >
            <span>Explore Full Showcase</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Featured Project Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.filter(p => p.featured).slice(0, 4).map((p) => (
            <SpotlightCard 
              key={p.id}
              spotlightColor="rgba(6, 182, 212, 0.3)"
              borderColor="rgba(6, 182, 212, 0.5)"
              onClick={() => onSelectProject(p)}
              className="group cursor-pointer p-0"
            >
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-rak-slate-900 border border-rak-slate-800">
                <img 
                  src={p.image} 
                  alt={p.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rak-slate-950 via-rak-slate-950/40 to-transparent opacity-90" />
                
                {/* Result Pill */}
                <div className="absolute top-6 left-6 px-3 py-1.5 bg-rak-slate-950/80 backdrop-blur-md border border-rak-cyan/40 rounded-full text-xs font-mono text-rak-cyan font-bold shadow-cyan-glow">
                  {p.results[0].metric} {p.results[0].label}
                </div>

                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-rak-magenta">{p.client}</span>
                    <h3 className="text-xl sm:text-2xl font-bold">{p.title}</h3>
                  </div>
                  <div className="p-3.5 rounded-full bg-rak-magenta text-white shadow-magenta-glow group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* 5. TESTIMONIALS & EXECUTIVE REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SpotlightCard 
          spotlightColor="rgba(139, 92, 246, 0.2)"
          borderColor="rgba(139, 92, 246, 0.4)"
          className="bg-rak-slate-900/90 dark:bg-rak-slate-900/90 light:bg-white/90 border border-rak-violet/30 rounded-3xl p-8 sm:p-12 space-y-8 relative overflow-hidden backdrop-blur-xl"
        >
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="text-xs font-extrabold text-rak-violet uppercase tracking-widest px-3 py-1 bg-rak-violet/10 border border-rak-violet/30 rounded-full">
              Executive Proof
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">What Industry Leaders Say About RAK.</h2>
            <p className="text-xs text-rak-slate-400">Hover over any card to pause & inspect</p>
          </div>

          <InfiniteSlider gap={24} duration={65} durationOnHover={180} className="py-4">
            {TESTIMONIALS.map((t) => (
              <SpotlightCard 
                key={t.id} 
                spotlightColor="rgba(236, 0, 140, 0.25)"
                className="w-80 sm:w-96 shrink-0 p-6 sm:p-7 bg-rak-slate-950/90 dark:bg-rak-slate-950/90 light:bg-white border border-rak-slate-800/90 light:border-slate-200 rounded-2xl space-y-5 flex flex-col justify-between backdrop-blur-md shadow-xl"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-400 space-x-1">
                    {[...Array(t.rating)].map((_, r) => (
                      <Star key={r} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-rak-slate-200 dark:text-rak-slate-200 light:text-slate-700 leading-relaxed font-normal italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-rak-slate-800/70 light:border-slate-200 flex items-center space-x-3">
                  <img src={t.avatar} alt={t.author} className="w-11 h-11 rounded-full object-cover border-2 border-rak-magenta shrink-0 shadow-magenta-sm" />
                  <div>
                    <div className="text-xs font-bold text-white dark:text-white light:text-slate-900 tracking-wide">{t.author}</div>
                    <div className="text-[10px] text-rak-slate-400 font-medium">{t.role}</div>
                    <div className="text-[10px] text-rak-magenta font-semibold">{t.company}</div>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </InfiniteSlider>
        </SpotlightCard>
      </section>

      {/* 6. EXECUTIVE EDITORIAL & BLOG INSIGHTS (4 POSTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-rak-magenta uppercase tracking-widest px-3.5 py-1.5 bg-rak-magenta/10 border border-rak-magenta/30 rounded-full">
              Executive Editorial
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white dark:text-white light:text-slate-900 tracking-tight">
              Latest Strategic Insights.
            </h2>
          </div>
          <a
            href="/blog"
            onClick={(e) => { e.preventDefault(); setActiveTab('blog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center space-x-2 text-xs font-extrabold uppercase tracking-wider text-rak-magenta hover:text-white transition-colors"
          >
            <span>Explore All Insights</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* 4 Featured Blog Post Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {BLOG_POSTS.slice(0, 4).map((post) => (
            <SpotlightCard
              key={post.id}
              spotlightColor="rgba(236, 0, 140, 0.2)"
              borderColor="rgba(236, 0, 140, 0.4)"
              onClick={() => onSelectArticle(post)}
              className="group cursor-pointer p-0 bg-rak-slate-900/80 border border-rak-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between backdrop-blur-xl hover:shadow-magenta-glow transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Article Cover Image */}
                <div className="relative h-48 w-full overflow-hidden bg-rak-slate-950">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-rak-slate-950 via-transparent to-transparent opacity-80" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3.5 left-3.5 px-3 py-1 bg-rak-slate-950/85 backdrop-blur-md border border-rak-magenta/30 rounded-full text-[10px] font-bold text-rak-magenta uppercase tracking-wider shadow-magenta-sm">
                    {post.category}
                  </div>
                </div>

                {/* Content Details */}
                <div className="px-5 space-y-3">
                  {/* Date & Read Time Metadata */}
                  <div className="flex items-center space-x-4 text-[10px] font-mono text-rak-slate-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-rak-magenta" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-rak-magenta" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-white group-hover:text-rak-magenta transition-colors line-clamp-2 leading-snug tracking-tight">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-rak-slate-300 line-clamp-2 leading-relaxed font-normal">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Card Footer: Read Article CTA */}
              <div className="p-5 pt-3 border-t border-rak-slate-800/80 flex items-center justify-between mt-4">
                <span className="text-[10px] font-bold text-rak-slate-400 font-mono truncate max-w-[140px]">
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

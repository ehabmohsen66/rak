import React from 'react';
import { ShieldCheck, Target, Eye, Award, Sparkles, CheckCircle2, ArrowUpRight, Quote, HeartHandshake, Users } from 'lucide-react';
import { BRAND_INFO, VALUES } from '../data/contentData';
import { AboutHero } from '../components/AboutHero';
import { TeamMarqueeSection } from '../components/TeamMarqueeSection';
import { SpotlightCard } from '../components/SpotlightCard';

export const AboutPage = ({ onOpenPlanner }) => {
  return (
    <div className="pb-16 space-y-20 sm:space-y-28">
      
      {/* 1. HERO ABOUT HERO COMPONENT */}
      <AboutHero onOpenPlanner={onOpenPlanner} />

      {/* 2. CREATIVE QUOTE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-rak-magenta/20 via-rak-slate-900 to-rak-slate-900 border border-rak-magenta/40 text-center space-y-4 shadow-2xl overflow-hidden">
          <Quote className="w-12 h-12 text-rak-magenta/40 mx-auto" />
          <blockquote className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight max-w-3xl mx-auto leading-tight italic">
            “Your vision + our expertise = something amazing. Let's create something unforgettable together.”
          </blockquote>
          <div className="text-xs font-mono text-rak-magenta uppercase tracking-widest font-bold pt-2">
            — The RAK4Creative Promise
          </div>
        </div>
      </section>

      {/* 2.5 OFFICIAL RAK TEAM PHOTO SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SpotlightCard
          spotlightColor="rgba(236, 0, 140, 0.2)"
          borderColor="rgba(236, 0, 140, 0.4)"
          className="p-0 bg-rak-slate-900/80 border border-rak-slate-800 rounded-3xl overflow-hidden backdrop-blur-xl shadow-2xl"
        >
          <div className="p-8 sm:p-10 border-b border-rak-slate-800/80 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-rak-magenta/10 border border-rak-magenta/30 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest">
                <Users className="w-3.5 h-3.5" />
                <span>The RAK 4 Creative Collective</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Our Team in Action.
              </h2>
            </div>
            <p className="text-xs text-rak-slate-400 max-w-md font-medium">
              A united squad of strategists, 3D artists, media producers, and full-stack developers driven by bold creativity.
            </p>
          </div>

          <div className="relative w-full h-[380px] sm:h-[500px] lg:h-[620px] overflow-hidden bg-rak-slate-950 group">
            <img
              src="/rak-team.jpg"
              alt="RAK 4 Creative Team"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-1000 ease-out filter drop-shadow-2xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rak-slate-950 via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-rak-slate-950/80 backdrop-blur-md border border-rak-magenta/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono text-rak-magenta uppercase tracking-widest font-extrabold">RAK4 CREATIVE HEADQUARTERS</span>
                <h3 className="text-lg font-bold text-white">One-Stop Agency Powerhouse</h3>
              </div>
              <span className="text-xs font-semibold text-rak-slate-300 px-4 py-2 bg-rak-slate-900/90 border border-rak-slate-700/80 rounded-xl shrink-0">
                Cairo • Dubai • Riyadh • Global
              </span>
            </div>
          </div>
        </SpotlightCard>
      </section>

      {/* 3. WHAT MAKES US DIFFERENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-rak-slate-900/80 border border-rak-slate-800 rounded-3xl p-8 sm:p-12 backdrop-blur-xl">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-rak-magenta uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>What Makes Us Different</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Bold Creativity Meets Tech Magic.
            </h2>
            
            <p className="text-sm sm:text-base text-rak-slate-300 leading-relaxed">
              {BRAND_INFO.differentiation}
            </p>
          </div>

          <div className="lg:col-span-6 space-y-4 bg-rak-slate-950/80 p-6 sm:p-8 rounded-2xl border border-rak-slate-800">
            <div className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-rak-magenta pl-3">
              What We Do
            </div>
            
            <p className="text-xs text-rak-slate-300 leading-relaxed">
              {BRAND_INFO.whatWeDo}
            </p>

            <ul className="space-y-2.5 pt-2">
              {BRAND_INFO.whatWeDoSpans.map((item, idx) => (
                <li key={idx} className="text-xs text-rak-slate-200 font-medium flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-rak-magenta flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* 4. WHAT MAKES US... US (OUR VALUES) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">Our Culture & Ethos</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">What Makes Us… Us.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((v, i) => (
            <div key={i} className="p-6 bg-rak-slate-900/60 border border-rak-slate-800 rounded-2xl space-y-3 hover:border-rak-magenta/50 transition-all duration-300">
              <div className="text-xs font-bold text-rak-magenta font-mono">0{i + 1}.</div>
              <h3 className="text-xl font-extrabold text-white">{v.name}</h3>
              <p className="text-xs text-rak-slate-300 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4.5 CREATIVE TEAM MEMBERS MARQUEE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TeamMarqueeSection />
      </section>

      {/* 5. CTA SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-gradient-to-r from-rak-magenta/20 via-rak-slate-900 to-rak-slate-900 border border-rak-magenta/30 rounded-3xl text-center space-y-6">
          <h2 className="text-3xl font-extrabold text-white">Ready to create something unforgettable together?</h2>
          <p className="text-xs sm:text-sm text-rak-slate-300 max-w-xl mx-auto">
            From ground zero to new heights, let's build the online and offline presence that makes a real impact in today's market.
          </p>
          <button
            onClick={onOpenPlanner}
            className="px-8 py-3.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-glow inline-flex items-center space-x-2"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;

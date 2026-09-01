import React from 'react';
import { Award, Sparkles, CheckCircle2, ArrowUpRight, Quote } from 'lucide-react';
import { BRAND_INFO, VALUES } from '../data/contentData';
import { AboutHero } from '../components/AboutHero';
import { TeamMarqueeSection } from '../components/TeamMarqueeSection';

export const AboutPage = ({ onOpenPlanner }) => {
  return (
    <div className="pb-16 space-y-20 sm:space-y-28 bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* 1. HERO ABOUT HERO COMPONENT */}
      <AboutHero onOpenPlanner={onOpenPlanner} />

      {/* 2. CREATIVE QUOTE BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-rak-magenta/10 via-white to-slate-50 dark:from-rak-magenta/20 dark:via-rak-slate-900 dark:to-rak-slate-900 border border-rak-magenta/30 dark:border-rak-magenta/40 text-center space-y-4 shadow-xl overflow-hidden backdrop-blur-xl">
          <Quote className="w-12 h-12 text-rak-magenta/40 mx-auto" />
          <blockquote className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight max-w-3xl mx-auto leading-tight italic font-heading">
            “Your vision + our expertise = something amazing. Let's create something unforgettable together.”
          </blockquote>
          <div className="text-xs font-mono text-rak-magenta uppercase tracking-widest font-bold pt-2">
            — The RAK4Creative Promise
          </div>
        </div>
      </section>

      {/* 3. WHAT MAKES US DIFFERENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white dark:bg-rak-slate-900/80 border border-slate-200 dark:border-rak-slate-800 rounded-3xl p-8 sm:p-12 shadow-sm backdrop-blur-xl">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-rak-magenta uppercase tracking-widest">
              <Award className="w-4 h-4" />
              <span>What Makes Us Different</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
              Bold Creativity Meets Tech Magic.
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 dark:text-rak-slate-300 leading-relaxed">
              {BRAND_INFO.differentiation}
            </p>
          </div>

          <div className="lg:col-span-6 space-y-4 bg-slate-50 dark:bg-rak-slate-950/80 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-rak-slate-800">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest border-l-2 border-rak-magenta pl-3">
              What We Do
            </div>
            
            <p className="text-xs text-slate-600 dark:text-rak-slate-300 leading-relaxed">
              {BRAND_INFO.whatWeDo}
            </p>

            <ul className="space-y-2.5 pt-2">
              {BRAND_INFO.whatWeDoSpans.map((item, idx) => (
                <li key={idx} className="text-xs text-slate-700 dark:text-rak-slate-200 font-medium flex items-center space-x-2">
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
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">What Makes Us… Us.</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {VALUES.map((v, i) => (
            <div key={i} className="p-6 bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-rak-slate-800 rounded-2xl space-y-3 hover:border-rak-magenta/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="text-xs font-bold text-rak-magenta font-mono">0{i + 1}.</div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white font-heading">{v.name}</h3>
              <p className="text-xs text-slate-600 dark:text-rak-slate-300 leading-relaxed">{v.description}</p>
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
        <div className="p-8 sm:p-12 bg-gradient-to-r from-rak-magenta/10 via-white to-slate-50 dark:from-rak-magenta/20 dark:via-rak-slate-900 dark:to-rak-slate-900 border border-rak-magenta/30 rounded-3xl text-center space-y-6 shadow-xl backdrop-blur-xl">
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white font-heading">Ready to create something unforgettable together?</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 max-w-xl mx-auto">
            From ground zero to new heights, let's build the online and offline presence that makes a real impact in today's market.
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

export default AboutPage;

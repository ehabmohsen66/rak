import React from 'react';
import { BrandLogo } from './BrandLogo';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { OFFICES } from '../data/contentData';
import { GenerativeMountainScene } from './GenerativeMountainScene';

export const Footer = ({ 
  setActiveTab = () => {}, 
  onOpenProjectPlanner = () => {}, 
  onOpenPlanner = onOpenProjectPlanner 
}) => {

  return (
    <footer className="bg-slate-900 dark:bg-rak-slate-950 border-t border-slate-800 text-slate-400 relative overflow-hidden transition-colors duration-300">
      
      {/* Dynamic Interactive Generative Mountain WebGL Scene */}
      <GenerativeMountainScene />

      {/* Ambient Gradient Overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-950/90 dark:from-rak-slate-950/50 dark:to-rak-slate-950/95 z-[1]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10 space-y-16">
        
        {/* Upper Clean Conversion Banner */}
        <div className="bg-slate-800/80 dark:bg-rak-slate-900/90 border border-slate-700/60 dark:border-white/10 rounded-3xl p-8 lg:p-12 shadow-xl backdrop-blur-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Ready to engineer your brand's next breakthrough?
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm">
                We partner with ambitious enterprises and high-growth brands to build market dominance.
              </p>
            </div>

            <button
              onClick={onOpenProjectPlanner}
              className="inline-flex items-center justify-center px-7 py-3.5 text-xs font-extrabold uppercase tracking-widest text-white bg-rak-magenta rounded-full shadow-md hover:bg-rak-magenta-dark transition-all duration-300 group shrink-0 cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* Simplified 3-Column Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-6 lg:col-span-5 space-y-4">
            <a 
              href="/"
              onClick={(e) => { e.preventDefault(); setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-block"
            >
              <BrandLogo className="h-10 w-auto" variant="default" />
            </a>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              RAK 4 CREATIVE is a premier global brand identity and digital product engineering agency.
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono text-rak-magenta pt-1">
              <Mail className="w-4 h-4" />
              <span>hello@rak4creative.com</span>
            </div>
          </div>

          {/* Column 2: Navigation */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              {['home', 'about', 'services', 'work', 'case-studies', 'careers', 'blog', 'contact'].map((tab) => (
                <li key={tab}>
                  <a
                    href={tab === 'home' ? '/' : `/${tab}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-rak-magenta transition-colors capitalize text-slate-400 inline-block"
                  >
                    {tab.replace('-', ' ')}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Global Offices */}
          <div className="md:col-span-3 lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Global Offices
            </h3>
            <div className="space-y-3 text-xs">
              {OFFICES.map((office) => (
                <div key={office.city} className="space-y-1">
                  <div className="flex items-center space-x-2 font-bold text-white">
                    <MapPin className="w-3.5 h-3.5 text-rak-magenta shrink-0" />
                    <span>{office.city}, {office.country}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-5 leading-tight">{office.address}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} RAK 4 CREATIVE. All Rights Reserved.
          </div>

          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Terms of Engagement</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

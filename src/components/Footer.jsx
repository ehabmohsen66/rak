import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { 
  ArrowUpRight, 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Award, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';
import { OFFICES } from '../data/contentData';
import { RuixenGradientFooter } from './RuixenGradientFooter';

export const Footer = ({ 
  setActiveTab = () => {}, 
  onOpenProjectPlanner = () => {}, 
  onOpenPlanner = onOpenProjectPlanner 
}) => {

  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 5000);
      setEmail('');
    }
  };

  return (
    <RuixenGradientFooter
      gradientHeight="60vh"
      minReveal={0.05}
      bars={9}
      blur={18}
      peak={0.98}
      valley={0.55}
      className="border-t border-rak-slate-800/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        
        {/* Upper Banner / Conversion Hook */}
        <div className="bg-gradient-to-r from-rak-slate-900/95 via-rak-slate-900/90 to-rak-slate-900/95 border border-rak-slate-800/90 rounded-3xl p-8 lg:p-12 mb-16 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-3">
              <span className="inline-flex items-center space-x-2 px-3 py-1 bg-rak-magenta/10 border border-rak-magenta/30 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest">
                <Award className="w-3.5 h-3.5" />
                <span>Enterprise Acceleration</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Ready to engineer your brand's next breakthrough?
              </h2>
              <p className="text-rak-slate-300 text-sm sm:text-base max-w-2xl font-normal">
                We partner with high-growth companies to design digital products, brand identities, and high-conversion web platforms.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                onClick={onOpenProjectPlanner}
                className="inline-flex items-center justify-center px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white bg-rak-magenta rounded-full shadow-magenta-sm hover:bg-rak-magenta-dark hover:shadow-magenta-glow transition-all duration-300 group cursor-pointer"
              >
                <span>Initiate Project Brief</span>
                <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
              
              <a
                href="/work"
                onClick={(e) => { e.preventDefault(); setActiveTab('work'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="inline-flex items-center justify-center px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-rak-slate-300 hover:text-white bg-rak-slate-800/80 hover:bg-rak-slate-800 border border-rak-slate-700/80 rounded-full transition-all"
              >
                <span>Explore Client Portfolio</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-rak-slate-800/80">
          
          {/* Brand Identity Column */}
          <div className="lg:col-span-4 space-y-6">
            <a 
              href="/"
              onClick={(e) => { e.preventDefault(); setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-block"
            >
              <BrandLogo className="h-11 sm:h-12 w-auto" variant="default" />
            </a>
            <p className="text-xs text-rak-slate-300 leading-relaxed max-w-sm">
              RAK 4 CREATIVE is a premier global brand identity and digital product engineering agency. We turn enterprise vision into award-winning market dominance.
            </p>
            
            <div className="space-y-2">
              <div className="text-xs font-bold text-white uppercase tracking-wider">Industry Accreditations</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-rak-slate-900/90 border border-rak-slate-800 rounded-md text-[10px] font-mono text-rak-slate-300">Awwwards SOTD</span>
                <span className="px-2.5 py-1 bg-rak-slate-900/90 border border-rak-slate-800 rounded-md text-[10px] font-mono text-rak-slate-300">FWA Winner</span>
                <span className="px-2.5 py-1 bg-rak-slate-900/90 border border-rak-slate-800 rounded-md text-[10px] font-mono text-rak-slate-300">Red Dot 2025</span>
                <span className="px-2.5 py-1 bg-rak-slate-900/90 border border-rak-slate-800 rounded-md text-[10px] font-mono text-rak-slate-300">Clutch 99.4%</span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-rak-magenta pl-3">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-xs">
              {['home', 'about', 'services', 'work', 'case-studies', 'careers', 'blog', 'contact'].map((tab) => (
                <li key={tab}>
                  <a
                    href={tab === 'home' ? '/' : `/${tab}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-rak-magenta transition-colors capitalize text-rak-slate-300 hover:translate-x-1 inline-block duration-200"
                  >
                    {tab.replace('-', ' ')}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Global Headquarters */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-rak-magenta pl-3">
              Global Offices
            </h3>
            <div className="space-y-3 text-xs">
              {OFFICES.map((office) => (
                <div key={office.city} className="p-3 bg-rak-slate-900/80 border border-rak-slate-800/80 rounded-xl space-y-1 backdrop-blur-md">
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{office.city}, {office.country}</span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                      {office.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-rak-slate-300">{office.address}</p>
                  <p className="text-[10px] font-mono text-rak-magenta font-semibold">{office.email}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest border-l-2 border-rak-magenta pl-3">
              Executive Insights
            </h3>
            <p className="text-xs text-rak-slate-300">
              Subscribe to our monthly brief on enterprise design architecture, CRO breakthroughs, and digital strategy.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter executive email..."
                  required
                  className="w-full px-4 py-3 text-xs bg-rak-slate-900/90 border border-rak-slate-800 rounded-xl text-white placeholder-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-1 focus:ring-rak-magenta transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-rak-magenta hover:bg-rak-magenta-dark text-white rounded-lg transition-colors flex items-center justify-center cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {subscribed && (
                <div className="flex items-center space-x-2 text-emerald-400 text-xs py-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Subscribed! Check your inbox for the latest brief.</span>
                </div>
              )}
            </form>

            <div className="pt-2 flex items-center space-x-3 text-[11px] text-rak-slate-300">
              <ShieldCheck className="w-4 h-4 text-rak-magenta" />
              <span>Strict Privacy Policy • No Spam Guarantee</span>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-rak-slate-400">
          <div>
            © {new Date().getFullYear()} RAK 4 CREATIVE. All Rights Reserved.
          </div>

          <div className="flex items-center space-x-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Engagement</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security & Compliance</span>
            <span className="hover:text-white cursor-pointer transition-colors">Sitemap</span>
          </div>
        </div>

      </div>
    </RuixenGradientFooter>
  );
};

export default Footer;

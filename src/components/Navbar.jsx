import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { 
  Menu, 
  X, 
  Globe, 
  ArrowUpRight, 
  Sparkles, 
  ChevronDown,
  Layers,
  Compass,
  Briefcase,
  BookOpen,
  Users,
  MessageSquare
} from 'lucide-react';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  onOpenProjectPlanner 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [showArNotice, setShowArNotice] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Compass },
    { id: 'about', label: 'About', icon: Users },
    { id: 'services', label: 'Pillars', icon: Layers, hasDropdown: true },
    { id: 'work', label: 'RAK4 Creations', icon: Briefcase },
    { id: 'case-studies', label: 'Case Studies', icon: Sparkles },
    { id: 'careers', label: 'Careers', icon: Users, badge: 'We\'re Hiring' },
    { id: 'blog', label: 'Blog', icon: BookOpen },
    { id: 'contact', label: 'Contact', icon: MessageSquare }
  ];

  const pillarsList = [
    { name: 'Digital Consultancy', id: 'digital-consultancy' },
    { name: 'Data & Analytics', id: 'data-analytics' },
    { name: 'Social Media Marketing', id: 'social-media-marketing' },
    { name: 'Web & E-Commerce', id: 'web-development' },
    { name: 'Search Marketing', id: 'search-marketing' },
    { name: 'Paid Media', id: 'paid-media' },
    { name: 'Content Creation & Media Production', id: 'content-creation' },
    { name: 'Branding & OOH', id: 'branding' }
  ];

  const handlePillarSelect = (pillarId) => {
    setActiveTab('services');
    setServicesDropdown(false);
    setTimeout(() => {
      const el = document.getElementById(pillarId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 120);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-rak-slate-950/85 dark:bg-rak-slate-950/90 light:bg-white/90 backdrop-blur-xl border-b border-rak-slate-800/60 light:border-rak-slate-200 shadow-xl' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <button 
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center space-x-3 focus:outline-none"
            aria-label="RAK4Creative Home"
          >
            <BrandLogo className="h-10 sm:h-12 w-auto" variant="default" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-rak-slate-900/60 light:bg-rak-slate-100/80 p-1.5 rounded-full border border-rak-slate-800/80 light:border-rak-slate-200 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <div 
                  key={item.id} 
                  className="relative group"
                  onMouseEnter={() => item.hasDropdown && setServicesDropdown(true)}
                  onMouseLeave={() => item.hasDropdown && setServicesDropdown(false)}
                >
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`relative px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-full transition-all duration-200 flex items-center space-x-1.5 ${
                      isActive 
                        ? 'bg-rak-magenta text-white shadow-magenta-sm' 
                        : 'text-rak-slate-300 light:text-rak-slate-700 hover:text-white light:hover:text-rak-slate-950 hover:bg-rak-slate-800/50 light:hover:bg-rak-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 px-1.5 py-0.5 text-[9px] font-bold bg-rak-magenta/20 text-rak-magenta border border-rak-magenta/30 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:rotate-180 transition-transform" />}
                  </button>

                  {/* Pillars Mega Dropdown Preview */}
                  {item.hasDropdown && servicesDropdown && (
                    <div className="absolute top-full left-0 pt-2 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="bg-rak-slate-900/95 light:bg-white backdrop-blur-xl border border-rak-slate-800 light:border-rak-slate-200 rounded-2xl p-3 shadow-2xl">
                        <div className="text-[10px] font-bold uppercase tracking-widest text-rak-magenta px-3 py-1.5 mb-1 flex items-center justify-between border-b border-rak-slate-800/60 pb-2">
                          <span>Pillars of Capability</span>
                          <span className="text-[9px] text-rak-slate-400 font-normal">8 Core Units</span>
                        </div>
                        <div className="space-y-0.5 pt-1">
                          {pillarsList.map((p) => (
                            <button 
                              key={p.id}
                              onClick={() => handlePillarSelect(p.id)}
                              className="w-full text-left px-3 py-2 text-xs font-medium text-rak-slate-200 light:text-rak-slate-800 hover:bg-rak-magenta/15 hover:text-rak-magenta rounded-xl transition-all flex items-center justify-between group/sub cursor-pointer"
                            >
                              <span>{p.name}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-rak-magenta opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* AR Language Switcher Button (Coming Soon) */}
            <div className="relative">
              <button
                onClick={() => setShowArNotice(!showArNotice)}
                className="flex items-center space-x-2 px-3.5 py-2 rounded-full bg-rak-slate-900 border border-rak-slate-800 hover:border-rak-magenta/50 text-rak-slate-200 hover:text-white transition-all duration-300 group cursor-pointer shadow-sm"
                aria-label="Switch to Arabic Language"
                title="اللغة العربية (قريباً)"
              >
                <Globe className="w-4 h-4 text-rak-magenta group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-xs font-bold tracking-wider uppercase">AR</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-rak-magenta/20 text-rak-magenta border border-rak-magenta/30 rounded-full">
                  قريباً
                </span>
              </button>

              {/* Coming Soon Popover */}
              {showArNotice && (
                <div className="absolute right-0 mt-3 w-72 p-4 rounded-2xl bg-rak-slate-950/95 backdrop-blur-xl border border-rak-magenta/40 shadow-2xl shadow-rak-magenta/20 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 rounded-xl bg-rak-magenta/20 border border-rak-magenta/40 text-rak-magenta shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white uppercase tracking-wider">Arabic Version</span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-rak-magenta text-white rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-xs font-medium text-rak-slate-200 leading-relaxed text-right font-sans pt-1" dir="rtl">
                        النسخة العربية الكاملة قيد التطوير وستتوفر قريباً!
                      </p>
                      <p className="text-[11px] text-rak-slate-400">
                        Full Arabic language translation & localization is currently under development.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowArNotice(false)}
                    className="mt-3 w-full py-1.5 text-[11px] font-bold text-rak-slate-300 hover:text-white bg-rak-slate-900 hover:bg-rak-slate-800 border border-rak-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Dismiss / إغلاق
                  </button>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onOpenProjectPlanner}
              className="relative inline-flex items-center justify-center px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white bg-rak-magenta rounded-full shadow-magenta-sm hover:bg-rak-magenta-dark hover:shadow-magenta-glow transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10 flex items-center space-x-2">
                <span>Start a Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

          {/* Mobile Menu & Language Controls */}
          <div className="flex lg:hidden items-center space-x-2">
            <div className="relative">
              <button
                onClick={() => setShowArNotice(!showArNotice)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-full bg-rak-slate-900 border border-rak-slate-800 text-rak-slate-200"
                aria-label="Toggle language menu"
              >
                <Globe className="w-4 h-4 text-rak-magenta" />
                <span className="text-xs font-bold">AR</span>
              </button>

              {/* Mobile Coming Soon Popover */}
              {showArNotice && (
                <div className="absolute right-0 mt-3 w-64 p-3.5 rounded-2xl bg-rak-slate-950/98 backdrop-blur-xl border border-rak-magenta/40 shadow-2xl z-50 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-white uppercase">Arabic / العربية</span>
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-rak-magenta text-white rounded-full">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-rak-slate-200 text-right mb-2" dir="rtl">
                    النسخة العربية قيد التطوير وستتوفر قريباً!
                  </p>
                  <button 
                    onClick={() => setShowArNotice(false)}
                    className="w-full py-1 text-[10px] font-bold text-rak-slate-300 bg-rak-slate-900 border border-rak-slate-800 rounded-lg"
                  >
                    OK / حسناً
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-rak-slate-900 light:bg-rak-slate-100 border border-rak-slate-800 light:border-rak-slate-200 text-rak-slate-200 light:text-rak-slate-900"
              aria-label="Open Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[72px] bg-rak-slate-950/98 light:bg-white/98 backdrop-blur-2xl border-b border-rak-slate-800 p-6 shadow-2xl z-50 animate-in slide-in-from-top duration-300">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive 
                      ? 'bg-rak-magenta text-white' 
                      : 'text-rak-slate-300 light:text-rak-slate-800 hover:bg-rak-slate-900 light:hover:bg-rak-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] bg-rak-magenta/20 text-rak-magenta rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-4 border-t border-rak-slate-800 light:border-rak-slate-200">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProjectPlanner();
                }}
                className="w-full py-3 text-center text-sm font-bold uppercase tracking-wider text-white bg-rak-magenta rounded-xl shadow-magenta-sm"
              >
                Start a Project
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

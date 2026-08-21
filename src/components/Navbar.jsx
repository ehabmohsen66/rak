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
  MessageSquare,
  Sun,
  Moon
} from 'lucide-react';

export const Navbar = ({ 
  activeTab, 
  setActiveTab, 
  darkMode = true,
  setDarkMode = () => {},
  onOpenProjectPlanner,
  onOpenPlanner = onOpenProjectPlanner
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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

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

  const handlePillarSelect = (pillarId, e) => {
    if (e && e.preventDefault) e.preventDefault();
    setActiveTab('services');
    setServicesDropdown(false);
    setMobileMenuOpen(false);
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
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'py-3 bg-rak-slate-950/85 dark:bg-rak-slate-950/90 light:bg-white/90 backdrop-blur-xl border-b border-rak-slate-800/60 light:border-rak-slate-200 shadow-xl' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 xl:gap-8">
          
          {/* Brand Logo */}
          <a 
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('home');
              setMobileMenuOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center space-x-3 focus:outline-none shrink-0"
            aria-label="RAK4Creative Home"
          >
            <BrandLogo className="h-9 sm:h-11 w-auto" variant="default" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 bg-rak-slate-900/60 light:bg-rak-slate-100/80 p-1.5 rounded-full border border-rak-slate-800/80 light:border-rak-slate-200 backdrop-blur-md shrink-0">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const path = item.id === 'home' ? '/' : `/${item.id}`;
              return (
                <div 
                  key={item.id} 
                  className="relative group"
                  onMouseEnter={() => item.hasDropdown && setServicesDropdown(true)}
                  onMouseLeave={() => item.hasDropdown && setServicesDropdown(false)}
                >
                  <a
                    href={path}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`relative px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-200 flex items-center space-x-1 ${
                      isActive 
                        ? 'bg-rak-magenta text-white shadow-magenta-sm' 
                        : 'text-rak-slate-300 light:text-rak-slate-700 hover:text-white light:hover:text-rak-slate-950 hover:bg-rak-slate-800/50 light:hover:bg-rak-slate-200'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 px-1.5 py-0.2 text-[8px] font-bold bg-rak-magenta/20 text-rak-magenta border border-rak-magenta/30 rounded-full animate-pulse">
                        {item.badge}
                      </span>
                    )}
                    {item.hasDropdown && <ChevronDown className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform" />}
                  </a>

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
                            <a 
                              key={p.id}
                              href={`/services#${p.id}`}
                              onClick={(e) => handlePillarSelect(p.id, e)}
                              className="w-full text-left px-3 py-2 text-xs font-medium text-rak-slate-200 light:text-rak-slate-800 hover:bg-rak-magenta/15 hover:text-rak-magenta rounded-xl transition-all flex items-center justify-between group/sub cursor-pointer"
                            >
                              <span>{p.name}</span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-rak-magenta opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                            </a>
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
          <div className="hidden xl:flex items-center space-x-3 shrink-0 ml-2">
            {/* Theme Switcher Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rak-slate-900/90 dark:bg-rak-slate-900/90 light:bg-slate-200 border border-rak-magenta/30 hover:border-rak-magenta text-rak-slate-200 hover:text-white transition-all duration-300 shadow-sm cursor-pointer"
              aria-label="Toggle light/dark theme"
              title={darkMode ? "Switch to Vibrant Light Mode" : "Switch to Cyber Dark Mode"}
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-rak-magenta" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rak-magenta">Dark</span>
                </>
              )}
            </button>

            {/* AR Language Switcher Button (Coming Soon) */}
            <div className="relative">
              <button
                onClick={() => setShowArNotice(!showArNotice)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-rak-slate-900 border border-rak-slate-800 hover:border-rak-magenta/50 text-rak-slate-200 hover:text-white transition-all duration-300 group cursor-pointer shadow-sm"
                aria-label="Switch to Arabic Language"
                title="اللغة العربية (قريباً)"
              >
                <Globe className="w-3.5 h-3.5 text-rak-magenta group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-[11px] font-bold tracking-wider uppercase">AR</span>
                <span className="text-[8px] font-bold px-1.5 py-0.2 bg-rak-magenta/20 text-rak-magenta border border-rak-magenta/30 rounded-full">
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
              onClick={onOpenPlanner}
              className="relative inline-flex items-center justify-center px-3.5 py-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white bg-rak-magenta rounded-full shadow-magenta-sm hover:bg-rak-magenta-dark hover:shadow-magenta-glow transition-all duration-300 group overflow-hidden shrink-0 cursor-pointer"
            >
              <span className="relative z-10 flex items-center space-x-1.5">
                <span>Start a Project</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          </div>

          {/* Mobile & Tablet Menu Controls */}
          <div className="flex xl:hidden items-center space-x-2 shrink-0">
            {/* Mobile Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-rak-slate-900 border border-rak-magenta/30 text-rak-slate-200"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-rak-magenta" />}
            </button>
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

      {/* Mobile Drawer Backdrop Mask */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="xl:hidden fixed inset-0 top-[72px] bg-black/60 backdrop-blur-sm z-[99] animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[72px] max-h-[calc(100vh-72px)] overflow-y-auto bg-rak-slate-950/98 light:bg-white/98 backdrop-blur-2xl border-b border-rak-slate-800 p-6 shadow-2xl z-[100] animate-in slide-in-from-top duration-300">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const path = item.id === 'home' ? '/' : `/${item.id}`;

              if (item.hasDropdown) {
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <a
                        href={path}
                        onClick={(e) => {
                          e.preventDefault();
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`flex-1 flex items-center justify-between p-3.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive 
                            ? 'bg-rak-magenta text-white' 
                            : 'text-rak-slate-300 light:text-rak-slate-800 hover:bg-rak-slate-900 light:hover:bg-rak-slate-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                      </a>
                      <button
                        onClick={() => setServicesDropdown(!servicesDropdown)}
                        className="p-3 text-rak-slate-400 hover:text-white"
                        aria-label="Toggle Pillars list"
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${servicesDropdown ? 'rotate-180 text-rak-magenta' : ''}`} />
                      </button>
                    </div>

                    {/* Mobile Expandable Pillars Submenu */}
                    {servicesDropdown && (
                      <div className="pl-6 pr-2 py-2 space-y-1 border-l-2 border-rak-magenta/40 ml-4 bg-rak-slate-900/40 rounded-r-xl">
                        <div className="text-[10px] font-bold uppercase tracking-wider text-rak-magenta pb-1">8 Capability Units</div>
                        {pillarsList.map((p) => (
                          <a
                            key={p.id}
                            href={`/services#${p.id}`}
                            onClick={(e) => handlePillarSelect(p.id, e)}
                            className="block py-1.5 px-3 text-xs font-medium text-rak-slate-300 hover:text-white hover:bg-rak-magenta/15 rounded-lg transition-colors flex items-center justify-between"
                          >
                            <span>{p.name}</span>
                            <ArrowUpRight className="w-3 h-3 text-rak-magenta" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={item.id}
                  href={path}
                  onClick={(e) => {
                    e.preventDefault();
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
                </a>
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


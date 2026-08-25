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
  darkMode = false,
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
    { id: 'careers', label: 'Careers', icon: Users, badge: "WE'RE HIRING" },
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
          ? darkMode 
            ? 'py-3 bg-rak-slate-950/90 backdrop-blur-xl border-b border-rak-slate-800/60 shadow-xl'
            : 'py-3 bg-white/90 backdrop-blur-xl border-b border-slate-200 shadow-sm'
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

          {/* Desktop Navigation Links Container */}
          <nav className={`hidden xl:flex items-center space-x-1 p-1.5 rounded-full border backdrop-blur-md shrink-0 transition-colors ${
            darkMode 
              ? 'bg-rak-slate-900/60 border-rak-slate-800/80' 
              : 'bg-slate-100/90 border-slate-200/80'
          }`}>
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
                    className={`relative px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-200 flex items-center space-x-1 ${
                      isActive 
                        ? 'bg-rak-magenta text-white shadow-sm' 
                        : darkMode
                          ? 'text-rak-slate-300 hover:text-white hover:bg-rak-slate-800/50'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="ml-1 px-1.5 py-0.5 text-[8px] font-bold bg-rak-magenta/20 text-rak-magenta border border-rak-magenta/40 rounded-full animate-pulse whitespace-nowrap">
                        {item.badge}
                      </span>
                    )}
                    {item.hasDropdown && <ChevronDown className="w-3 h-3 opacity-70 group-hover:rotate-180 transition-transform" />}
                  </a>

                  {/* Pillars Mega Dropdown Preview */}
                  {item.hasDropdown && servicesDropdown && (
                    <div className="absolute top-full left-0 pt-2 w-80 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className={`backdrop-blur-xl border rounded-2xl p-3 shadow-2xl ${
                        darkMode 
                          ? 'bg-rak-slate-900/95 border-rak-slate-800' 
                          : 'bg-white/95 border-slate-200'
                      }`}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-rak-magenta px-3 py-1.5 mb-1 flex items-center justify-between border-b border-slate-200 dark:border-rak-slate-800/60 pb-2">
                          <span>Pillars of Capability</span>
                          <span className="text-[9px] text-slate-400 font-normal">8 Core Units</span>
                        </div>
                        <div className="space-y-0.5 pt-1">
                          {pillarsList.map((p) => (
                            <a 
                              key={p.id}
                              href={`/services#${p.id}`}
                              onClick={(e) => handlePillarSelect(p.id, e)}
                              className={`w-full text-left px-3 py-2 text-xs font-medium rounded-xl transition-all flex items-center justify-between group/sub cursor-pointer ${
                                darkMode 
                                  ? 'text-rak-slate-200 hover:bg-rak-magenta/15 hover:text-rak-magenta' 
                                  : 'text-slate-800 hover:bg-rak-magenta/10 hover:text-rak-magenta'
                              }`}
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
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 shadow-sm cursor-pointer ${
                darkMode 
                  ? 'bg-rak-slate-900 border-rak-slate-800 text-rak-slate-200 hover:text-white' 
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950'
              }`}
              aria-label="Toggle light/dark theme"
              title={darkMode ? "Switch to Vibrant Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
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
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border transition-all duration-300 group cursor-pointer shadow-sm ${
                  darkMode 
                    ? 'bg-rak-slate-900 border-rak-slate-800 text-rak-slate-200 hover:text-white' 
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-950'
                }`}
                aria-label="Switch to Arabic Language"
                title="اللغة العربية (قريباً)"
              >
                <Globe className="w-3.5 h-3.5 text-rak-magenta group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-[11px] font-bold tracking-wider uppercase">AR</span>
              </button>

              {/* Coming Soon Popover */}
              {showArNotice && (
                <div className={`absolute right-0 mt-3 w-72 p-4 rounded-2xl backdrop-blur-xl border shadow-2xl z-50 animate-in fade-in duration-200 ${
                  darkMode 
                    ? 'bg-rak-slate-950/95 border-rak-magenta/40' 
                    : 'bg-white/98 border-slate-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 rounded-xl bg-rak-magenta/20 border border-rak-magenta/40 text-rak-magenta shrink-0">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Arabic Version</span>
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-rak-magenta text-white rounded-full">
                          Coming Soon
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-700 dark:text-rak-slate-200 leading-relaxed text-right font-sans pt-1" dir="rtl">
                        النسخة العربية الكاملة قيد التطوير وستتوفر قريباً!
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-rak-slate-400">
                        Full Arabic language translation & localization is currently under development.
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowArNotice(false)}
                    className="mt-3 w-full py-1.5 text-[11px] font-bold text-slate-600 dark:text-rak-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-rak-slate-900 border border-slate-200 dark:border-rak-slate-800 rounded-xl transition-colors cursor-pointer"
                  >
                    Dismiss / إغلاق
                  </button>
                </div>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={onOpenPlanner}
              className="relative inline-flex items-center justify-center px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white bg-rak-magenta rounded-full shadow-md hover:bg-rak-magenta-dark transition-all duration-300 group overflow-hidden shrink-0 cursor-pointer"
            >
              <span className="relative z-10 flex items-center space-x-1.5">
                <span>Start a Project</span>
                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </button>
          </div>

          {/* Mobile & Tablet Menu Controls */}
          <div className="flex xl:hidden items-center space-x-2 shrink-0">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-slate-100 dark:bg-rak-slate-900 border border-slate-200 dark:border-rak-slate-800 text-slate-700 dark:text-rak-slate-200"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-rak-magenta" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-rak-slate-900 border border-slate-200 dark:border-rak-slate-800 text-slate-900 dark:text-rak-slate-200"
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
          className="xl:hidden fixed inset-0 top-[72px] bg-black/50 backdrop-blur-sm z-[99] animate-in fade-in duration-200"
          aria-hidden="true"
        />
      )}

      {/* Mobile & Tablet Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-x-0 top-[72px] max-h-[calc(100vh-72px)] overflow-y-auto bg-white/98 dark:bg-rak-slate-950/98 backdrop-blur-2xl border-b border-slate-200 dark:border-rak-slate-800 p-6 shadow-2xl z-[100] animate-in slide-in-from-top duration-300">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const path = item.id === 'home' ? '/' : `/${item.id}`;

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
                      : 'text-slate-800 dark:text-rak-slate-200 hover:bg-slate-100 dark:hover:bg-rak-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </a>
              );
            })}

            <div className="pt-4 border-t border-slate-200 dark:border-rak-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenProjectPlanner();
                }}
                className="w-full py-3 text-center text-sm font-bold uppercase tracking-wider text-white bg-rak-magenta rounded-xl shadow-md"
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

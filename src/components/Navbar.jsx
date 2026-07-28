import React, { useState, useEffect } from 'react';
import { BrandLogo } from './BrandLogo';
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
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
  darkMode, 
  setDarkMode, 
  onOpenProjectPlanner 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);

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
          
          {/* Logo */}
          <button 
            onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center space-x-3 focus:outline-none"
            aria-label="RAK4Creative Home"
          >
            <BrandLogo className="h-10 sm:h-12 w-auto" variant={darkMode ? 'default' : 'dark'} />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 bg-rak-slate-900/60 light:bg-rak-slate-100/80 p-1.5 rounded-full border border-rak-slate-800/80 light:border-rak-slate-200 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onMouseEnter={() => item.hasDropdown && setServicesDropdown(true)}
                    onMouseLeave={() => item.hasDropdown && setServicesDropdown(false)}
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
                    <div 
                      onMouseEnter={() => setServicesDropdown(true)}
                      onMouseLeave={() => setServicesDropdown(false)}
                      className="absolute top-full left-0 mt-2 w-80 bg-rak-slate-900/95 light:bg-white backdrop-blur-xl border border-rak-slate-800 light:border-rak-slate-200 rounded-2xl p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      <div className="text-[10px] font-bold uppercase tracking-widest text-rak-magenta px-3 py-1 mb-1">
                        Pillars of Capability
                      </div>
                      <div className="space-y-1">
                        {[
                          'Digital Consultancy',
                          'Data & Analytics',
                          'Social Media Marketing',
                          'Web & E-Commerce',
                          'Search Marketing',
                          'Paid Media',
                          'Content Creation & Media Production',
                          'Branding & OOH'
                        ].map((pillarName) => (
                          <button 
                            key={pillarName}
                            onClick={() => { setActiveTab('services'); setServicesDropdown(false); }}
                            className="w-full text-left px-3 py-1.5 text-xs font-medium text-rak-slate-200 light:text-rak-slate-800 hover:bg-rak-magenta/10 hover:text-rak-magenta rounded-lg transition-colors flex items-center justify-between group/sub"
                          >
                            <span>{pillarName}</span>
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/sub:opacity-100 transition-opacity" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Cluster */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Dark/Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-full bg-rak-slate-900 light:bg-rak-slate-100 border border-rak-slate-800 light:border-rak-slate-200 text-rak-slate-300 light:text-rak-slate-700 hover:text-rak-magenta transition-colors"
              aria-label="Toggle theme mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-rak-slate-700" />}
            </button>

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

          {/* Mobile Menu & Theme Controls */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-rak-slate-900 light:bg-rak-slate-100 border border-rak-slate-800 text-rak-slate-300"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-rak-slate-700" />}
            </button>

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

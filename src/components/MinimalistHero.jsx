import React from 'react';
import { motion } from 'framer-motion';
import { Globe, Instagram, Linkedin, Twitter, ArrowUpRight } from 'lucide-react';
import { cn } from '../lib/utils';

// Helper component for navigation links
const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-xs font-bold uppercase tracking-widest text-rak-slate-400 transition-colors hover:text-rak-magenta"
  >
    {children}
  </a>
);

// Helper component for social media icons
const SocialIcon = ({ href, icon: Icon }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="p-2 rounded-full bg-rak-slate-900 border border-rak-slate-800 text-rak-slate-400 transition-all hover:text-white hover:border-rak-magenta hover:bg-rak-magenta/20 shadow-sm"
  >
    <Icon className="h-4 w-4" />
  </a>
);

// The main reusable Minimalist Hero Section component configured with RAK 4 Creative colors
export const MinimalistHero = ({
  logoText = "RAK 4 CREATIVE",
  navLinks = [
    { label: 'PILLARS', href: '/services' },
    { label: 'WORK', href: '/work' },
    { label: 'CONTACT', href: '/contact' }
  ],
  mainText = "We turn enterprise vision into market dominance. Bold creativity meets high-performance tech magic across 8 core capability pillars.",
  readMoreLink = "/services",
  imageSrc = "/RAK4CREATIVE-LOGO.png",
  imageAlt = "RAK 4 Creative",
  overlayText = {
    part1: "RAK 4",
    part2: "CREATIVE"
  },
  socialLinks = [
    { icon: Twitter, href: "https://twitter.com" },
    { icon: Linkedin, href: "https://linkedin.com" },
    { icon: Instagram, href: "https://instagram.com" },
    { icon: Globe, href: "https://rak4creative.com" }
  ],
  locationText = "Global Brand Architecture • Dubai | Riyadh | Cairo",
  className,
  onOpenPlanner
}) => {
  return (
    <div
      className={cn(
        'relative flex min-h-[90vh] md:min-h-screen w-full flex-col items-center justify-between overflow-hidden bg-rak-slate-950 p-6 md:p-12 font-sans selection:bg-rak-magenta selection:text-white border-b border-rak-slate-800/80',
        className
      )}
    >
      {/* Background Ambient Glow & Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0"></div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-rak-magenta/10 rounded-full blur-[140px] pointer-events-none z-0"></div>

      {/* Top Header */}
      <header className="z-30 flex w-full max-w-7xl items-center justify-between pt-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-lg font-black tracking-wider text-white uppercase flex items-center space-x-2"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-rak-magenta shadow-magenta-sm animate-pulse"></span>
          <span>{logoText}</span>
        </motion.div>

        <div className="hidden items-center space-x-8 md:flex">
          {navLinks.map((link) => (
            <NavLink key={link.label} href={link.href}>
              {link.label}
            </NavLink>
          ))}
          {onOpenPlanner && (
            <button
              onClick={onOpenPlanner}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-rak-magenta rounded-full shadow-magenta-sm hover:bg-rak-magenta-dark transition-all flex items-center space-x-1.5"
            >
              <span>Start Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mobile menu action */}
        {onOpenPlanner && (
          <button
            onClick={onOpenPlanner}
            className="flex items-center space-x-1 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white bg-rak-magenta rounded-full shadow-magenta-sm md:hidden"
          >
            <span>Start</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        )}
      </header>

      {/* Main Content Area */}
      <div className="relative grid w-full max-w-7xl flex-grow grid-cols-1 items-center gap-8 py-8 md:py-0 md:grid-cols-3 z-10">
        {/* Left Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="z-20 order-2 text-center md:order-1 md:text-left space-y-4"
        >
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-rak-magenta/10 border border-rak-magenta/30 text-rak-magenta rounded-full text-[10px] font-bold uppercase tracking-widest">
            <span>Brand Architecture & Tech</span>
          </div>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-rak-slate-300 md:mx-0 font-normal">
            {mainText}
          </p>
          <a
            href={readMoreLink}
            className="inline-flex items-center space-x-1.5 text-xs font-extrabold text-rak-magenta uppercase tracking-wider hover:text-white transition-colors group"
          >
            <span>Read More</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Center Image with Brand Circle */}
        <div className="relative order-1 flex justify-center items-center h-full min-h-[300px] md:min-h-[420px] md:order-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="absolute z-0 h-[260px] w-[260px] rounded-full bg-rak-magenta/80 shadow-magenta-glow md:h-[360px] md:w-[360px] lg:h-[440px] lg:w-[440px] border border-rak-magenta/40"
          ></motion.div>
          
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="relative z-10 h-auto w-48 object-contain md:w-60 lg:w-72 filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            onError={(e) => {
              const target = e.target;
              target.onerror = null;
              target.src = `https://placehold.co/400x600/E6007E/ffffff?text=RAK+4+CREATIVE`;
            }}
          />
        </div>

        {/* Right Typography Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="z-20 order-3 flex items-center justify-center text-center md:justify-start"
        >
          <h1 className="text-5xl font-black text-white tracking-tighter md:text-7xl lg:text-8xl uppercase leading-none" style={{ fontFamily: '"Arial Black", Impact, sans-serif' }}>
            <span className="text-rak-magenta drop-shadow-lg">{overlayText.part1}</span>
            <br />
            <span className="text-white drop-shadow-lg">{overlayText.part2}</span>
          </h1>
        </motion.div>
      </div>

      {/* Footer Elements */}
      <footer className="z-30 flex w-full max-w-7xl items-center justify-between pt-4 border-t border-rak-slate-800/60">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="flex items-center space-x-3"
        >
          {socialLinks.map((link, index) => (
            <SocialIcon key={index} href={link.href} icon={link.icon} />
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="text-xs font-semibold text-rak-slate-400"
        >
          {locationText}
        </motion.div>
      </footer>
    </div>
  );
};

export default MinimalistHero;

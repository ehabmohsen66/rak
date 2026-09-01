import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max(window.scrollY / totalHeight, 0), 1);
        setScrollProgress(progress);
      }
      setIsVisible(window.scrollY > 350);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-6 right-6 z-50 group pointer-events-auto"
        >
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="relative flex items-center justify-center w-12 h-12 rounded-full bg-slate-900/90 dark:bg-rak-slate-950/90 hover:bg-rak-magenta dark:hover:bg-rak-magenta text-white shadow-xl hover:shadow-2xl border border-slate-700/60 dark:border-white/15 hover:border-rak-magenta backdrop-blur-xl transition-all duration-300 hover:scale-110 cursor-pointer focus:outline-none focus:ring-2 focus:ring-rak-magenta focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            {/* Circular Scroll Progress Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="24"
                cy="24"
                r="21"
                className="stroke-slate-700/40 dark:stroke-white/10"
                strokeWidth="2"
                fill="none"
              />
              <circle
                cx="24"
                cy="24"
                r="21"
                className="stroke-rak-magenta transition-all duration-150 ease-out"
                strokeWidth="2.5"
                fill="none"
                strokeDasharray="131.95"
                strokeDashoffset={131.95 * (1 - scrollProgress)}
                strokeLinecap="round"
              />
            </svg>

            {/* Upward Arrow Icon with hover animation */}
            <ArrowUp className="w-5 h-5 text-white transition-transform duration-300 group-hover:-translate-y-0.5" />

            {/* Hover Tooltip */}
            <span className="absolute -top-9 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-900 dark:bg-black text-white border border-slate-700 dark:border-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg whitespace-nowrap">
              Top
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;

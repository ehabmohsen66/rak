import React, { useEffect, useState, useCallback } from 'react';
import { X, ArrowUpRight, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { getProjectImages } from '../lib/utils';

export const ProjectModal = ({ project, onClose, onOpenPlanner }) => {
  const images = getProjectImages(project);
  const hasCarousel = images.length > 1;
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const safeSlide = images.length > 0 ? Math.min(activeSlide, images.length - 1) : 0;

  const goPrev = useCallback(() => {
    if (images.length <= 1) return;
    setActiveSlide((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    if (images.length <= 1) return;
    setActiveSlide((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    setActiveSlide(0);
  }, [project?.id]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      } else if (e.key === 'ArrowLeft') {
        goPrev();
      } else if (e.key === 'ArrowRight') {
        goNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, goPrev, goNext]);

  if (!project) return null;

  const handleTouchStart = (e) => {
    if (!hasCarousel) return;
    setTouchStartX(e.touches?.[0]?.clientX ?? null);
  };

  const handleTouchEnd = (e) => {
    if (!hasCarousel || touchStartX === null) return;
    const endX = e.changedTouches?.[0]?.clientX ?? touchStartX;
    const deltaX = endX - touchStartX;
    if (deltaX > 40) {
      goPrev();
    } else if (deltaX < -40) {
      goNext();
    }
    setTouchStartX(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
      className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 sm:py-10 animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-white dark:bg-rak-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-rak-slate-100 max-h-[88vh] flex flex-col my-auto"
      >
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-rak-slate-950/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-rak-magenta/10 border border-rak-magenta/30 text-rak-magenta text-[10px] font-bold uppercase tracking-widest rounded-full">
              {project.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-rak-slate-400 font-mono">{project.year}</span>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-slate-200/80 dark:bg-rak-slate-800 hover:bg-rak-magenta text-slate-700 dark:text-rak-slate-300 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {/* Hero Banner / Carousel */}
          <div className="space-y-3">
            <div
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative h-64 sm:h-96 rounded-2xl overflow-hidden group bg-slate-950 select-none"
            >
              {images.map((imgUrl, idx) => (
                <img
                  key={`${imgUrl}-${idx}`}
                  src={imgUrl}
                  alt={
                    hasCarousel
                      ? `${project.title} — slide ${idx + 1} of ${images.length}`
                      : project.title
                  }
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
                    idx === safeSlide
                      ? 'opacity-100 scale-100 z-0'
                      : 'opacity-0 scale-105 pointer-events-none'
                  }`}
                />
              ))}

              <div
                className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none transition-opacity duration-300 ${
                  hasCarousel && safeSlide > 0 ? 'opacity-35' : 'opacity-100'
                }`}
              />

              <div
                className={`absolute bottom-6 left-6 right-6 z-10 space-y-2 pointer-events-none transition-opacity duration-300 ${
                  hasCarousel && safeSlide > 0 ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">
                  {project.client}
                </span>
                <h1 id="project-modal-title" className="text-2xl sm:text-4xl font-extrabold text-white">
                  {project.title}
                </h1>
              </div>

              {hasCarousel && (
                <>
                  <div className="absolute top-4 right-4 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/75 border border-white/15 backdrop-blur-md text-[11px] font-mono font-bold text-white shadow-sm">
                    <Images className="w-3.5 h-3.5 text-rak-magenta" aria-hidden="true" />
                    <span>
                      {safeSlide + 1} / {images.length}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous slide"
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/65 hover:bg-rak-magenta text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
                  >
                    <ChevronLeft className="w-5 h-5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={goNext}
                    aria-label="Next slide"
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-950/65 hover:bg-rak-magenta text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
                  >
                    <ChevronRight className="w-5 h-5" aria-hidden="true" />
                  </button>
                </>
              )}
            </div>

            {hasCarousel && (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`View image ${idx + 1} of ${images.length}`}
                      aria-current={idx === safeSlide ? 'true' : undefined}
                      className={`relative w-16 h-11 sm:w-20 sm:h-12 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta ${
                        idx === safeSlide
                          ? 'border-rak-magenta ring-2 ring-rak-magenta/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                <div className="hidden sm:flex items-center gap-1.5 shrink-0">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        idx === safeSlide
                          ? 'w-6 bg-rak-magenta'
                          : 'w-2 bg-slate-300 dark:bg-rak-slate-700 hover:bg-rak-magenta/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {project.results.map((res, i) => (
              <div key={i} className="p-4 bg-slate-50 dark:bg-rak-slate-950/80 border border-slate-200 dark:border-rak-slate-800 rounded-2xl text-center space-y-1">
                <div className="text-2xl sm:text-3xl font-extrabold text-rak-magenta">{res.metric}</div>
                <div className="text-xs text-slate-500 dark:text-rak-slate-400 font-medium">{res.label}</div>
              </div>
            ))}
          </div>

          {/* Challenge & Solution Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 dark:bg-rak-slate-950/50 border border-slate-200 dark:border-rak-slate-800/80 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rak-magenta flex items-center space-x-2">
                <span>01. The Challenge</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
                {project.challenge}
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-rak-slate-950/50 border border-slate-200 dark:border-rak-slate-800/80 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rak-magenta flex items-center space-x-2">
                <span>02. The Strategy & Solution</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 dark:text-rak-slate-400 uppercase tracking-wider">Deliverables & Stack</div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, i) => (
                <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-rak-slate-800 border border-slate-200 dark:border-rak-slate-700 text-slate-700 dark:text-rak-slate-200 text-xs rounded-lg font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="p-6 bg-gradient-to-r from-rak-magenta/10 via-slate-50 to-slate-50 dark:from-rak-magenta/20 dark:via-rak-slate-900 dark:to-rak-slate-900 border border-rak-magenta/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Inspired by this project outcome?</h4>
              <p className="text-xs text-slate-500 dark:text-rak-slate-400">Let's discuss how RAK 4 CREATIVE can deliver similar results for your business.</p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenPlanner();
              }}
              className="px-6 py-3 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-extrabold uppercase tracking-wider rounded-full shadow-md flex items-center space-x-2 shrink-0 cursor-pointer transition-transform hover:scale-105"
            >
              <span>Build Similar Brief</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProjectModal;

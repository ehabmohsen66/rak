import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  X, 
  Sparkles, 
  Heart,
  Flame,
  Zap,
  Film
} from 'lucide-react';
import { MasonryGrid } from './ui/MasonryGrid';
import { GradientShimmer } from './ui/GradientShimmer';
import { useCms } from '../lib/cmsContext';

const DEFAULT_ASPECTS = [
  'aspect-[9/14]',
  'aspect-[16/10]',
  'aspect-[9/15]',
  'aspect-[4/5]',
  'aspect-[1/1]',
  'aspect-[9/14]'
];

const DEFAULT_TAG_COLORS = [
  'from-pink-500 to-rose-500',
  'from-rak-magenta to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-amber-500 to-orange-600',
  'from-emerald-400 to-teal-600',
  'from-violet-500 to-rak-magenta'
];

const VideoCard = ({ item, onOpenModal }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '500px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div 
      ref={cardRef}
      className="group relative rounded-3xl overflow-hidden bg-white dark:bg-rak-slate-900 border border-slate-200/90 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onOpenModal(item)}
    >
      {/* Video Container */}
      <div className={`relative w-full ${item.aspect} bg-slate-950 overflow-hidden`}>
        <video
          ref={videoRef}
          src={isInView ? item.src : undefined}
          preload={isInView ? 'metadata' : 'none'}
          autoPlay
          muted={isMuted}
          loop
          playsInline
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {/* Ambient Gradient Scrims */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 pointer-events-none" />

        {/* Top Control & Badges Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-20">
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-white shadow-sm flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rak-magenta animate-pulse" />
            <span>{item.category}</span>
          </span>

          <div className="flex items-center space-x-1.5">
            {/* Audio Toggle Button */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute' : 'Mute'}
              className="p-2 rounded-full bg-black/60 hover:bg-rak-magenta backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-rak-cyan" />}
            </button>

            {/* Expand Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenModal(item);
              }}
              title="Expand Video"
              className="p-2 rounded-full bg-black/60 hover:bg-rak-magenta backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-110 cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Center Play/Pause Indicator (shown on hover or when paused) */}
        <div 
          onClick={togglePlay}
          className={`absolute inset-0 flex items-center justify-center z-10 transition-opacity duration-300 ${
            !isPlaying || isHovered ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="p-3.5 rounded-full bg-black/70 border border-white/25 text-white backdrop-blur-md hover:scale-110 hover:bg-rak-magenta transition-all duration-300 shadow-xl cursor-pointer">
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current translate-x-0.5" />
            )}
          </div>
        </div>

        {/* Bottom Content Info */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-20 space-y-2 pointer-events-none">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-rak-magenta/80 text-white">
              {item.vibe}
            </span>
          </div>

          <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight tracking-tight drop-shadow-md">
            {item.title}
          </h3>

          <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-normal opacity-90 group-hover:opacity-100 transition-opacity">
            {item.caption}
          </p>
        </div>
      </div>
    </div>
  );
};

export const TeamVideoShowcase = () => {
  const { content } = useCms();
  const hs = content.homeSections || {};
  const [selectedVideo, setSelectedVideo] = useState(null);
  const modalVideoRef = useRef(null);

  const videos = (hs.squadVideos || [])
    .filter((v) => v && v.src)
    .map((v, idx) => ({
      ...v,
      id: v.id || `vid-${idx + 1}`,
      aspect: v.aspect || DEFAULT_ASPECTS[idx % DEFAULT_ASPECTS.length],
      tagColor: v.tagColor || DEFAULT_TAG_COLORS[idx % DEFAULT_TAG_COLORS.length]
    }));

  if (videos.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-3xl">
          {hs.squadEyebrow !== '' && (
            <div className="inline-flex items-center space-x-2 text-xs font-bold text-rak-magenta uppercase tracking-widest px-3.5 py-1.5 bg-rak-magenta/10 border border-rak-magenta/30 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-rak-magenta" />
              <span>{hs.squadEyebrow || 'The RAK Squad & Culture'}</span>
            </div>
          )}
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
            {hs.squadHeading || "We're Not Just a Business."}{' '}
            {(hs.squadHighlight ?? "We're a Super Cool Team.") && (
              <span className="inline-block">
                <GradientShimmer gradient="sunrise" duration={5}>
                  {hs.squadHighlight ?? "We're a Super Cool Team."}
                </GradientShimmer>
              </span>
            )}
          </h2>

          {(hs.squadDescription ?? "Step behind the scenes. From crazy 3D experiments and cinematic shoots to pure studio laughter, meet the passionate creators turning bold ideas into iconic work.") && (
            <p className="text-sm sm:text-base text-slate-600 dark:text-rak-slate-300 leading-relaxed font-normal pt-1">
              {hs.squadDescription ?? "Step behind the scenes. From crazy 3D experiments and cinematic shoots to pure studio laughter, meet the passionate creators turning bold ideas into iconic work."}
            </p>
          )}
        </div>

        {/* Culture Badges */}
        {((hs.squadBadge1 ?? '100% In-House Energy') || (hs.squadBadge2 ?? 'Fearless Experimentation')) && (
          <div className="flex flex-wrap md:flex-col gap-2.5 shrink-0">
            {(hs.squadBadge1 ?? '100% In-House Energy') && (
              <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-rak-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                <Flame className="w-4 h-4 text-rak-magenta shrink-0" />
                <span>{hs.squadBadge1 ?? '100% In-House Energy'}</span>
              </div>
            )}
            {(hs.squadBadge2 ?? 'Fearless Experimentation') && (
              <div className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-white dark:bg-rak-slate-900 border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm">
                <Zap className="w-4 h-4 text-rak-cyan shrink-0" />
                <span>{hs.squadBadge2 ?? 'Fearless Experimentation'}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Masonry Video Grid */}
      <MasonryGrid gap={5} className="w-full">
        {videos.map((item) => (
          <VideoCard 
            key={item.id} 
            item={item} 
            onOpenModal={(video) => setSelectedVideo(video)} 
          />
        ))}
      </MasonryGrid>

      {/* Lightbox / Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-slate-950 border border-white/20 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Top Bar */}
              <div className="p-4 sm:p-5 flex items-center justify-between border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-rak-magenta text-white">
                    {selectedVideo.vibe}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {selectedVideo.title}
                  </h3>
                </div>

                <button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Video Player */}
              <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[480px]">
                <video
                  ref={modalVideoRef}
                  src={selectedVideo.src}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[70vh] w-auto max-w-full object-contain mx-auto"
                />
              </div>

              {/* Modal Footer Caption */}
              <div className="p-4 sm:p-6 bg-slate-900 border-t border-white/10 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {selectedVideo.caption}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default TeamVideoShowcase;

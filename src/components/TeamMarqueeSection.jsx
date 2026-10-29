import React, { useState, useRef } from 'react';
import { UserCheck, Play, Maximize2 } from 'lucide-react';
import { SpotlightCard } from './SpotlightCard';
import { useCms } from '../lib/cmsContext';

export const TeamMarqueeSection = () => {
  const { content } = useCms();
  const brandInfo = content?.brandInfo || {};
  const videoSrc = brandInfo.teamVideo || '/videos/RAK4-WebsiteBanner2-211026.mp4';
  const posterSrc = brandInfo.teamVideoPoster || '/videos/banner2-poster.jpg';

  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = (e) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleFullscreen = (e) => {
    e?.stopPropagation();
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-rak-slate-800 rounded-3xl py-10 md:py-16 backdrop-blur-xl shadow-xl transition-colors duration-300">
      {/* Background Decorative SVG Curve */}
      <div className="pointer-events-none absolute right-0 bottom-0 text-slate-200 dark:text-rak-slate-800/30">
        <svg
          className="w-[460px] h-[154px]"
          fill="none"
          viewBox="0 0 460 154"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0_494_1104)">
            <path
              d="M-87.463 458.432C-102.118 348.092 -77.3418 238.841 -15.0744 188.274C57.4129 129.408 180.708 150.071 351.748 341.128C278.246 -374.233 633.954 380.602 548.123 42.7707"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="40"
            />
          </g>
          <defs>
            <clipPath id="clip0_494_1104">
              <rect fill="white" height="154" width="460" />
            </clipPath>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Title */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rak-magenta text-white shadow-magenta-glow">
            <UserCheck className="w-6 h-6" />
          </div>

          <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest font-mono">
            {brandInfo.teamEyebrow || 'Behind RAK 4 Creative'}
          </span>

          <h2 className="relative font-extrabold text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight font-heading">
            {brandInfo.teamHeading || 'Meet Our Creative & Tech Minds'}
          </h2>
          <p className="max-w-2xl text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
            {brandInfo.teamDescription ||
              'Our interdisciplinary team connects strategy, video production, 3D art, and high-speed web tech to elevate your brand.'}
          </p>
        </div>

        {/* Featured Video Showcase */}
        <div className="relative w-full max-w-5xl mx-auto">
          <SpotlightCard
            spotlightColor="rgba(236, 0, 140, 0.2)"
            borderColor="rgba(236, 0, 140, 0.3)"
            className="p-2 sm:p-3 bg-slate-50 dark:bg-rak-slate-950/90 border border-slate-200 dark:border-rak-slate-800 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl group"
          >
            <div 
              className="relative w-full aspect-video max-h-[80vh] overflow-hidden rounded-2xl bg-slate-950 flex flex-col items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              <video
                key={videoSrc}
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={posterSrc}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                className="w-full h-full object-cover rounded-2xl transition-transform duration-700 ease-out filter drop-shadow-2xl"
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Center Play Button Overlay when paused */}
              {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rak-magenta/90 text-white flex items-center justify-center shadow-magenta-glow backdrop-blur-md transition-transform scale-100 hover:scale-110">
                    <Play className="w-8 h-8 fill-white translate-x-0.5" />
                  </div>
                </div>
              )}

              {/* Subtle Corner Fullscreen Button (visible on hover) */}
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
                <button
                  onClick={toggleFullscreen}
                  aria-label="View Fullscreen"
                  className="p-2.5 rounded-full bg-black/60 hover:bg-rak-magenta backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:scale-110 cursor-pointer shadow-lg"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </SpotlightCard>
        </div>
      </div>
    </section>
  );
};

export default TeamMarqueeSection;

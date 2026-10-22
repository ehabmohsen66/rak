import React from 'react';

export const AboutHero = () => {
  return (
    <div className="w-full bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white flex flex-col font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Full Video Banner Showcase */}
      <section className="relative w-full aspect-[16/9] sm:aspect-[21/9] min-h-[50vh] sm:min-h-[65vh] max-h-[85vh] overflow-hidden bg-slate-950 flex items-center justify-center shadow-2xl">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        >
          <source src="/videos/about-banner.mp4" type="video/mp4" />
          <source src="/videos/RAK4-WebsiteAbout Page banner-021026.mp4" type="video/mp4" />
        </video>
        {/* Subtle cinematic gradient framing */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40 pointer-events-none" />
      </section>

    </div>
  );
};

export default AboutHero;

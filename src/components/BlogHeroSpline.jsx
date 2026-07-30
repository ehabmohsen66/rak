import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

class SplineErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error) {
    console.warn("Spline scene load notice:", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function HeroSplineBackground() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      pointerEvents: 'auto',
      overflow: 'hidden',
    }}>
      <SplineErrorBoundary fallback={
        <div className="absolute inset-0 bg-gradient-to-br from-rak-slate-950 via-rak-slate-900 to-rak-slate-950" />
      }>
        <Suspense fallback={<div className="w-full h-full bg-rak-slate-950" />}>
          <Spline
            style={{
              width: '100%',
              height: '100vh',
              pointerEvents: 'auto',
            }}
            scene="https://prod.spline.design/us3ALejTXl6usHZ7/scene.splinecode"
          />
        </Suspense>
      </SplineErrorBoundary>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh',
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.85), transparent 30%, transparent 70%, rgba(0, 0, 0, 0.85)),
            linear-gradient(to bottom, transparent 40%, rgba(3, 7, 18, 0.95))
          `,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}

function ScreenshotSection({ screenshotRef }) {
  return (
    <section className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 mt-11 md:mt-12">
      <div ref={screenshotRef} className="bg-rak-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-rak-slate-700/50 w-full md:w-[85%] lg:w-[75%] mx-auto transition-transform duration-75">
        <div>
          <img
            src="https://cdn.sanity.io/images/s6lu43cv/production-v4/13b6177b537aee0fc311a867ea938f16416e8670-3840x2160.jpg?w=3840&h=2160&q=10&auto=format&fm=jpg"
            alt="App Screenshot"
            className="w-full h-auto block rounded-xl mx-auto"
          />
        </div>
      </div>
    </section>
  );
}

function HeroContent({ onExploreClick }) {
  return (
    <div className="text-left text-white pt-24 sm:pt-32 md:pt-36 px-4 md:px-8 max-w-4xl">
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight uppercase">
        Elevate your <br className="hidden sm:inline" />creative workflow<br className="hidden sm:inline" /> to an art form.
      </h1>
      <p className="text-base sm:text-lg md:text-xl mb-8 opacity-90 max-w-2xl leading-relaxed text-rak-slate-300 font-normal">
        Manage all of your media and assets — video, photos, design files, docs, PDFs, and more — on a single secure surface to create and deliver high-quality content faster.
      </p>
      <div className="flex pointer-events-auto flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
        <button 
          onClick={onExploreClick}
          className="bg-rak-magenta hover:bg-rak-magenta-dark text-white font-bold py-3 px-8 rounded-full transition-all duration-300 w-full sm:w-auto shadow-magenta-sm cursor-pointer"
        >
          Explore Executive Articles
        </button>
        <button 
          onClick={onExploreClick}
          className="pointer-events-auto bg-black/60 border border-rak-slate-700 hover:border-rak-magenta text-gray-200 hover:text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 flex items-center justify-center w-full sm:w-auto backdrop-blur-md cursor-pointer"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-rak-magenta" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Watch Editorial Video
        </button>
      </div>
    </div>
  );
}

export function BlogHeroSpline({ onExploreClick }) {
  const screenshotRef = useRef(null);
  const heroContentRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (screenshotRef.current && heroContentRef.current) {
        requestAnimationFrame(() => {
          const scrollPosition = window.pageYOffset;
          if (screenshotRef.current) {
            screenshotRef.current.style.transform = `translateY(-${scrollPosition * 0.3}px)`;
          }

          const maxScroll = 500;
          const opacity = 1 - Math.min(scrollPosition / maxScroll, 1);
          if (heroContentRef.current) {
            heroContentRef.current.style.opacity = opacity.toString();
          }
        });
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div className="relative min-h-[90vh] sm:min-h-screen">
        <div className="absolute inset-0 z-0 pointer-events-auto">
          <HeroSplineBackground />
        </div>

        <div 
          ref={heroContentRef} 
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            display: 'flex', justifyContent: 'flex-start', alignItems: 'center', zIndex: 10, pointerEvents: 'none'
          }}
        >
          <div className="container mx-auto">
            <HeroContent onExploreClick={onExploreClick} />
          </div>
        </div>
      </div>

      <div className="bg-rak-slate-950 relative z-10 -mt-16 sm:-mt-24 pb-12">
        <ScreenshotSection screenshotRef={screenshotRef} />
      </div>
    </div>
  );
}

export default BlogHeroSpline;

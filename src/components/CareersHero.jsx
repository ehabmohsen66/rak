import React from 'react';
import { ArrowRight } from 'lucide-react';

export function CareersHero({ onScrollToRoles }) {
  return (
    <section className="relative min-h-[85vh] sm:min-h-screen w-full overflow-hidden bg-rak-slate-950 flex flex-col justify-end pb-16 sm:pb-24 pt-28">
      
      {/* Background image */}
      <div
        className="absolute inset-0 bg-center bg-cover opacity-75"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-rak-slate-950/70 via-rak-slate-950/40 to-rak-slate-950" />
      </div>

      {/* Hero Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end justify-between">
          
          <div className="w-full space-y-5 sm:w-7/12">
            <h1 className="font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight">
              We <span className="text-rak-magenta">think</span>, you{" "}
              <span className="text-rak-magenta">grow</span>
              <br />
              <span className="text-white">— that's the deal</span>
            </h1>
          </div>

          <div className="w-full sm:w-5/12 space-y-6">
            <p className="text-base sm:text-lg text-rak-slate-200 italic leading-relaxed">
              “We take your big ideas and turn them into clear, winning
              strategies. From setting up your company to scaling it worldwide,
              we're here every step of the way.”
            </p>

            <button
              onClick={onScrollToRoles}
              className="inline-flex items-center gap-3 rounded-full bg-rak-magenta hover:bg-rak-magenta-dark text-white px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-magenta-glow group"
            >
              <span>Explore Open Roles</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black transition-transform group-hover:translate-x-0.5">
                <ArrowRight className="h-4 w-4 text-white" />
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CareersHero;

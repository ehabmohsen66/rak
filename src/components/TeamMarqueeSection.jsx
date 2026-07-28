import React from 'react';
import { UserCheck, Sparkles, Quote, Star } from 'lucide-react';
import { InfiniteSlider } from './ui/infinite-slider';

const teamMembers = [
  {
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    name: "Ehab Mohsen",
    role: "Founder & Creative Director",
  },
  {
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop",
    name: "Alena Rosser",
    role: "Head of Brand Strategy",
  },
  {
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop",
    name: "Fletch Skinner",
    role: "Lead 3D & Motion Director",
  },
  {
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
    name: "Marc Spector",
    role: "Director of Media Buying",
  },
  {
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=600&auto=format&fit=crop",
    name: "David Kim",
    role: "Head of Web & WebGL Tech",
  },
  {
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&auto=format&fit=crop",
    name: "Natalia Skinner",
    role: "Senior Growth & CRO Lead",
  },
];

export const TeamMarqueeSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-rak-slate-900/60 border border-rak-slate-800 rounded-3xl py-12 md:py-20 backdrop-blur-xl shadow-2xl">
      {/* Background Decorative SVG Curve */}
      <div className="pointer-events-none absolute right-0 bottom-0 text-rak-slate-800/40">
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Title */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rak-magenta text-white shadow-magenta-glow">
            <UserCheck className="w-6 h-6" />
          </div>

          <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">
            Behind RAK 4 Creative
          </span>

          <h2 className="relative font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Meet Our Creative & Tech Minds
          </h2>
          <p className="max-w-2xl text-xs sm:text-sm text-rak-slate-300 leading-relaxed">
            Our interdisciplinary team connects strategy, video production, 3D art, and high-speed web tech to elevate your brand.
          </p>
        </div>

        {/* Marquee Container with Left & Right Gradient Fade Masks */}
        <div className="relative w-full">
          <div className="pointer-events-none absolute top-0 left-0 z-20 h-full w-24 bg-gradient-to-r from-rak-slate-900 to-transparent" />
          <div className="pointer-events-none absolute top-0 right-0 z-20 h-full w-24 bg-gradient-to-l from-rak-slate-900 to-transparent" />

          <InfiniteSlider gap={24} duration={55} durationOnHover={180} className="py-2">
            {teamMembers.map((member, i) => (
              <div
                className="group flex w-64 shrink-0 flex-col cursor-pointer"
                key={i}
              >
                <div className="relative h-88 w-full overflow-hidden rounded-2xl bg-rak-slate-950 border border-rak-slate-800 group-hover:border-rak-magenta/60 transition-all duration-300">
                  <img
                    alt={member.name}
                    className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-105"
                    src={member.image}
                  />
                  <div className="absolute bottom-0 w-full p-3 bg-gradient-to-t from-rak-slate-950 via-rak-slate-950/90 to-transparent border-t border-rak-slate-800/80">
                    <h3 className="font-bold text-sm text-white group-hover:text-rak-magenta transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-rak-slate-400 text-xs font-medium">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </InfiniteSlider>
        </div>

        {/* Executive Team Quote Banner */}
        <div className="mx-auto max-w-3xl px-6 text-center space-y-6 pt-4 border-t border-rak-slate-800/80">
          <p className="font-medium text-sm sm:text-base text-rak-slate-200 leading-relaxed italic">
            “At RAK 4 Creative, we believe every brand has a breakthrough story. Our team works side-by-side with client leaders to turn bold ideas into high-converting digital realities.”
          </p>
          <div className="flex flex-col items-center gap-2">
            <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-rak-magenta shadow-magenta-sm">
              <img
                alt="Natalia Kara"
                className="h-full w-full object-cover"
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
              />
            </div>
            <div className="text-center">
              <p className="font-bold text-xs text-white">
                Natalia Kara
              </p>
              <p className="text-rak-magenta text-[11px] font-mono">
                Executive Vice President · RAK 4 Creative
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamMarqueeSection;

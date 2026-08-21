import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { useIsMobile } from "../lib/useMobileDetect";

function getTimeParts(target) {
  const diff = Math.max(0, target - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function pad(value) {
  return value.toString().padStart(2, "0");
}

function Countdown({ target }) {
  const [parts, setParts] = useState(() => getTimeParts(target));

  useEffect(() => {
    setParts(getTimeParts(target));
    const timer = window.setInterval(() => {
      setParts(getTimeParts(target));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [target]);

  const segments = [parts.days, parts.hours, parts.minutes, parts.seconds];

  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center gap-1 font-mono text-sm font-medium tabular-nums text-white/90"
    >
      {segments.map((segment, index) => (
        <span className="flex items-center gap-1" key={index}>
          <span className="rounded-md bg-white/10 px-1.5 py-1 backdrop-blur-md border border-white/10 font-bold shadow-lg">
            {pad(segment)}
          </span>
          {index < segments.length - 1 ? (
            <span className="text-white/40 font-bold">:</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

export function AnimatedBanner({
  title = "World Cup 2026",
  subtitle = "Live odds for the winner, golden boot, groups, and every match.",
  ctaLabel = "Explore odds",
  href = "/work",
  onClick,
  videoSrc = "https://assets.mixkit.co/videos/preview/mixkit-stadium-lights-and-fans-cheering-41551-large.mp4",
  posterSrc = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&fm=webp&fit=crop",
  deadline,
  className,
}) {
  const isMobile = useIsMobile();
  const target =
    deadline === undefined ? undefined : new Date(deadline).getTime();

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <a
      className={cn(
        "group relative block aspect-[21/9] sm:aspect-[5/2] w-full overflow-hidden rounded-2xl border border-rak-slate-800 shadow-2xl bg-rak-slate-950 transition-all duration-300 hover:border-rak-magenta/60 hover:shadow-magenta-glow",
        className
      )}
      href={href}
      onClick={handleClick}
    >
      {/* Base Stadium Image Layer */}
      <img
        src={posterSrc}
        alt={title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000 z-0"
        onError={(e) => {
          e.currentTarget.src = "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=600&fm=webp&fit=crop";
        }}
      />

      {/* Video Loop Layer (Only on Desktop) */}
      {!isMobile && videoSrc && (
        <video
          aria-hidden="true"
          autoPlay
          className="absolute inset-0 h-full w-full object-cover z-0 opacity-90"
          loop
          muted
          playsInline
          poster={posterSrc}
          src={videoSrc}
        />
      )}

      {/* Gradient overlay: solid dark on text side, perfectly transparent on image/video right side */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-rak-slate-950 via-rak-slate-950/80 via-45% to-transparent z-10 pointer-events-none"
      />

      {/* Interaction depth glow on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-rak-magenta/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10 pointer-events-none"
      />

      {/* Content layer */}
      <div className="relative z-20 flex h-full items-end justify-between gap-4 p-6 sm:p-8 text-white">
        <div className="min-w-0 max-w-sm space-y-1.5">
          <h3 className="text-balance text-xl sm:text-2xl font-extrabold leading-tight tracking-tight text-white drop-shadow-md">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-pretty text-xs sm:text-sm leading-relaxed text-rak-slate-200 font-normal drop-shadow-sm">
              {subtitle}
            </p>
          ) : null}
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-white transition-transform duration-200 group-hover:translate-x-1">
              <span>{ctaLabel}</span>
              <svg
                aria-hidden="true"
                className="size-4 text-rak-magenta"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
        </div>

        {target !== undefined ? <Countdown target={target} /> : null}
      </div>
    </a>
  );
}

export default AnimatedBanner;

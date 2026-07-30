import { useEffect, useState } from "react";
import { cn } from "../lib/utils";

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
  const labels = ["D", "H", "M", "S"];

  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center gap-1.5 font-mono text-xs font-bold tabular-nums text-white/90 bg-rak-slate-950/70 p-2 rounded-xl border border-rak-magenta/30 backdrop-blur-md shadow-lg"
    >
      {segments.map((segment, index) => (
        <span className="flex items-center gap-1" key={index}>
          <span className="flex flex-col items-center">
            <span className="rounded-lg bg-rak-magenta/20 text-rak-magenta border border-rak-magenta/40 px-2 py-1 text-sm font-extrabold">
              {pad(segment)}
            </span>
            <span className="text-[8px] font-sans uppercase tracking-widest text-rak-slate-400 mt-0.5">
              {labels[index]}
            </span>
          </span>
          {index < segments.length - 1 ? (
            <span className="text-rak-magenta font-bold mb-2.5">:</span>
          ) : null}
        </span>
      ))}
    </div>
  );
}

export function AnimatedBanner({
  title = "Q3 Enterprise Digital Acceleration Sprint",
  subtitle = "Partner with RAK 4 Creative to engineer high-conversion web platforms & brand identities. Reserve your enterprise slot.",
  ctaLabel = "Initiate Brief",
  href = "/contact",
  onClick,
  videoSrc = "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-9003-large.mp4",
  posterSrc = "/RAK4CREATIVE-LOGO.png",
  deadline,
  overlayColor = "#090d16",
  className,
}) {
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
        "group relative block aspect-[21/9] sm:aspect-[5/2] w-full overflow-hidden rounded-3xl border border-rak-slate-800 shadow-2xl transition-all duration-300 hover:border-rak-magenta/50 hover:shadow-magenta-glow [--banner-overlay:var(--overlay)]",
        className
      )}
      href={href}
      onClick={handleClick}
      style={{ ["--overlay"]: overlayColor }}
    >
      <video
        aria-hidden="true"
        autoPlay
        className="absolute inset-0 h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-1000"
        loop
        muted
        playsInline
        poster={posterSrc}
        src={videoSrc}
      />

      {/* Gradient overlay: solid on the text side, transparent over the video */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[var(--banner-overlay)] via-[var(--banner-overlay)]/85 to-transparent"
      />

      {/* Interaction depth: strengthen the text side on hover/focus */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-rak-magenta/30 via-[var(--banner-overlay)]/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
      />

      {/* Content layer */}
      <div className="relative z-10 flex h-full items-center justify-between gap-6 p-6 sm:p-10 text-white">
        <div className="min-w-0 max-w-lg space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-rak-magenta/20 border border-rak-magenta/40 text-rak-magenta rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
            <span>Enterprise Briefing</span>
          </div>

          <h3 className="text-balance text-xl sm:text-3xl font-extrabold leading-tight text-white tracking-tight">
            {title}
          </h3>
          
          {subtitle ? (
            <p className="text-pretty text-xs sm:text-sm leading-relaxed text-rak-slate-300 font-normal max-w-md">
              {subtitle}
            </p>
          ) : null}

          <div className="pt-2">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rak-magenta bg-rak-slate-950/80 px-4 py-2 rounded-full border border-rak-magenta/40 transition-all duration-300 group-hover:bg-rak-magenta group-hover:text-white shadow-magenta-sm">
              <span>{ctaLabel}</span>
              <svg
                aria-hidden="true"
                className="size-4 transition-transform duration-200 group-hover:translate-x-1"
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

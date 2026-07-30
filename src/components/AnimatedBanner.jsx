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

  return (
    <div
      aria-hidden="true"
      className="flex shrink-0 items-center gap-1 font-mono text-sm font-medium tabular-nums text-white/90"
    >
      {segments.map((segment, index) => (
        <span className="flex items-center gap-1" key={index}>
          <span className="rounded-md bg-white/10 px-2 py-1 backdrop-blur-md border border-white/10 text-white font-mono font-bold">
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
  posterSrc = "/client-logos/logo_1.jpg",
  deadline,
  overlayColor = "oklch(0.15 0 0)",
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
        "group relative block aspect-[5/2] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl transition-all duration-300 hover:border-rak-magenta/50 hover:shadow-magenta-glow [--banner-overlay:var(--overlay)]",
        className
      )}
      href={href}
      onClick={handleClick}
      style={{ ["--overlay"]: overlayColor }}
    >
      <video
        aria-hidden="true"
        autoPlay
        className="absolute inset-0 h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
        loop
        muted
        playsInline
        poster={posterSrc}
        src={videoSrc}
      />

      {/* gradient overlay: solid on the text side, transparent over the image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[var(--banner-overlay)] via-[var(--banner-overlay)]/80 to-transparent"
      />

      {/* interaction depth: strengthen the text side on hover/focus */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[var(--banner-overlay)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-40 group-focus-visible:opacity-40"
      />

      {/* content layer */}
      <div className="relative z-10 flex h-full items-end justify-between gap-4 p-6 sm:p-8 text-white">
        <div className="min-w-0 max-w-sm space-y-1">
          <h3 className="text-balance text-xl sm:text-2xl font-bold leading-tight tracking-tight text-white">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-pretty text-xs sm:text-sm leading-snug text-white/80 font-normal">
              {subtitle}
            </p>
          ) : null}
          <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-white transition-transform duration-200 group-hover:gap-2 text-rak-magenta hover:text-white">
            <span>{ctaLabel}</span>
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
        {target !== undefined ? <Countdown target={target} /> : null}
      </div>
    </a>
  );
}

export default AnimatedBanner;

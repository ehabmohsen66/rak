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
          <span className="rounded-md bg-white/10 px-1.5 py-1 backdrop-blur-sm">
            {pad(segment)}
          </span>
          {index < segments.length - 1 ? (
            <span className="text-white/40">:</span>
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
  videoSrc = "https://cdn.pixabay.com/video/2021/04/12/70860-536965152_large.mp4",
  posterSrc = "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop",
  deadline,
  overlayColor = "#0f172a",
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
        "group relative block aspect-[5/2] w-full overflow-hidden rounded-2xl [--banner-overlay:var(--overlay)]",
        className
      )}
      href={href}
      onClick={handleClick}
      style={{ ["--overlay"]: overlayColor }}
    >
      {/* Poster Image Layer (Guarantees visual display even if video is buffering/blocked) */}
      {posterSrc && (
        <img
          src={posterSrc}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {/* Video Layer */}
      {videoSrc && (
        <video
          aria-hidden="true"
          autoPlay
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          poster={posterSrc}
          src={videoSrc}
        />
      )}

      {/* Gradient overlay: solid on the text side, transparent over the image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[var(--banner-overlay)] via-[var(--banner-overlay)]/70 to-transparent"
      />

      {/* Interaction depth: strengthen the text side on hover/focus */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[var(--banner-overlay)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-40 group-focus-visible:opacity-40"
      />

      {/* Content layer */}
      <div className="relative z-10 flex h-full items-end justify-between gap-4 p-5 text-white">
        <div className="min-w-0 max-w-xs">
          <h3 className="text-balance text-lg font-semibold leading-tight">
            {title}
          </h3>
          {subtitle ? (
            <p className="mt-1 text-pretty text-sm leading-snug text-white/80">
              {subtitle}
            </p>
          ) : null}
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white transition-transform duration-200 group-hover:gap-1.5">
            <span>{ctaLabel}</span>
            <svg
              aria-hidden="true"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
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

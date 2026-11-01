import React from 'react';
import { useCms } from '../lib/cmsContext';

const DEFAULT_CEO_BIO = `Under General Manager Farah Younes’ leadership, RAK4Creative combines strategic thinking, creative execution, and a deep understanding of what makes brands stand out.

Since starting small in 2018, we’ve worked with big names across industries from day one, building our reputation through strong creative work, meaningful partnerships, and strategies rooted in real business objectives.

We evolve with marketing trends, changing consumer behavior, and emerging technologies while staying true to its foundations: insight, creativity, strategic thinking, and meaningful communication.

As part of RAK Group, we go beyond marketing and advertising, combining creative and strategic expertise with the latest technologies in analytics, digital transformation, IT, and AI to connect ideas with intelligence and creativity with technology, delivering measurable business outcomes.`;

// Exact rounded-corner trapezoid path matching the brand artboard frame (viewBox 0 0 392 600)
const TRAPEZOID_PATH =
  'M 2 30.6 A 34 34 0 0 1 30.18 6.9 L 350.18 62.57 A 34 34 0 0 1 390 109.92 L 390 519.23 A 34 34 0 0 1 352.44 560.97 L 32.44 594.78 A 34 34 0 0 1 2 567.39 Z';

export const CeoSection = () => {
  const { content } = useCms();
  const brandInfo = content?.brandInfo || {};

  const eyebrow = brandInfo.ceoEyebrow || 'BEHIND RAK4CREATIVE';
  const heading = brandInfo.ceoHeading || 'Meet Our CEO';
  const name = brandInfo.ceoName || 'FARAH YOUNES';
  const imageSrc = brandInfo.ceoImage || '/ceo-farah-younes.webp';
  const bioRaw = brandInfo.ceoBio || DEFAULT_CEO_BIO;

  const paragraphs = String(bioRaw)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <section className="relative w-full bg-[#E31C93] py-16 sm:py-20 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col lg:block">
          {/* Portrait Frame (overlaps top on mobile, overlaps left & top of card on desktop) */}
          <div className="relative z-20 mx-auto w-[260px] sm:w-[310px] -mb-16 sm:-mb-20 lg:mb-0 lg:mx-0 lg:w-[375px] xl:w-[392px] lg:absolute lg:left-0 lg:-top-9 pointer-events-none select-none drop-shadow-[0_20px_35px_rgba(15,23,42,0.18)]">
            <svg
              viewBox="0 0 392 600"
              className="w-full h-auto block overflow-visible"
              role="img"
              aria-label={`${name} - ${heading}`}
            >
              <defs>
                <clipPath id="rakCeoTrapezoidClip">
                  <path d={TRAPEZOID_PATH} />
                </clipPath>
              </defs>

              <g clipPath="url(#rakCeoTrapezoidClip)">
                <rect width="392" height="600" fill="#DDE0E3" />
                <image
                  href={imageSrc}
                  x="0"
                  y="0"
                  width="392"
                  height="600"
                  preserveAspectRatio="xMidYMid slice"
                />
              </g>

              <path
                d={TRAPEZOID_PATH}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="3.5"
              />
            </svg>
          </div>

          {/* Main Content Card */}
          <div className="relative z-10 lg:ml-[150px] xl:ml-[160px] lg:min-h-[600px] xl:min-h-[612px] lg:flex lg:items-center rounded-[24px] bg-[#F8F9FB] dark:bg-rak-slate-900 shadow-2xl overflow-hidden transition-colors duration-300">
            {/* Top-Right Decorative Blush Pink Quarter-Ring */}
            <svg
              viewBox="0 0 220 180"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute top-0 right-0 w-[160px] sm:w-[210px] h-auto text-[#F6D8E6] dark:text-rak-magenta/20"
            >
              <circle
                cx="195"
                cy="-10"
                r="142"
                stroke="currentColor"
                strokeWidth="36"
              />
            </svg>

            {/* Bottom-Left Decorative Soft Slate Wave */}
            <svg
              viewBox="0 0 360 150"
              fill="none"
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 w-[240px] sm:w-[320px] h-auto text-[#E5ECF3] dark:text-rak-slate-800/60"
            >
              <path
                d="M -20 92 C 55 125, 145 55, 215 72 C 268 85, 292 128, 305 165"
                stroke="currentColor"
                strokeWidth="34"
                strokeLinecap="round"
              />
            </svg>

            {/* Editorial Copy */}
            <div className="relative z-10 pt-24 pb-10 px-6 sm:pt-28 sm:pb-12 sm:px-10 lg:py-14 lg:pl-[285px] xl:pl-[305px] lg:pr-14 xl:pr-16">
              <div className="space-y-1.5">
                <p className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em] text-[#E31C93] dark:text-rak-magenta-light font-gilroy">
                  {eyebrow}
                </p>
                <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-normal text-slate-950 dark:text-white leading-[1.12] tracking-tight font-eurostile">
                  {heading}
                </h2>
                <p className="text-xl sm:text-2xl lg:text-[26px] uppercase tracking-[0.03em] text-[#E31C93] dark:text-rak-magenta-light leading-tight pt-0.5 font-impact">
                  {name}
                </p>
              </div>

              <div className="mt-6 space-y-4 max-w-2xl text-[13.5px] sm:text-[14.5px] text-slate-700 dark:text-rak-slate-300 leading-[1.65] font-gilroy">
                {paragraphs.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CeoSection;

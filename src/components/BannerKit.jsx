import React from 'react';
import { useCms } from '../lib/cmsContext';
import {
  normalizeBanner,
  applyBannerTokens,
  LEGACY_VIDEO_FALLBACKS
} from '../lib/banners';

export function useBanner(pageId, tokens = {}) {
  const { content } = useCms();
  const banner = normalizeBanner(pageId, content?.banners?.[pageId]);
  return {
    ...banner,
    eyebrow: applyBannerTokens(banner.eyebrow, tokens),
    title: applyBannerTokens(banner.title, tokens),
    subtitle: applyBannerTokens(banner.subtitle, tokens)
  };
}

// Renders "*accent*" segments with accentClassName and line breaks for "\n".
export function RichTitle({ text = '', accentClassName = 'text-rak-magenta', lineBreakClassName }) {
  const lines = String(text).split('\n');
  return lines.map((line, lineIdx) => (
    <React.Fragment key={lineIdx}>
      {lineIdx > 0 && (
        <>
          {/* Space keeps words apart when the break is hidden on small screens */}
          {' '}
          <br className={lineBreakClassName} />
        </>
      )}
      {line.split(/(\*[^*]+\*)/g).map((part, partIdx) =>
        part.startsWith('*') && part.endsWith('*') && part.length > 2 ? (
          <span key={partIdx} className={accentClassName}>
            {part.slice(1, -1)}
          </span>
        ) : (
          <React.Fragment key={partIdx}>{part}</React.Fragment>
        )
      )}
    </React.Fragment>
  ));
}

// True when the banner replaces the page's built-in visual with uploaded media.
export function hasCustomMedia(banner) {
  if (banner.mediaType === 'video') return Boolean(banner.videoUrl);
  if (banner.mediaType === 'image') return Boolean(banner.imageUrl);
  return false;
}

export function BannerMedia({ banner, videoRef, videoClassName = '', imageClassName = '', fallback = null }) {
  if (banner.mediaType === 'video' && banner.videoUrl) {
    const legacy = LEGACY_VIDEO_FALLBACKS[banner.videoUrl];
    return (
      <video
        key={banner.videoUrl}
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster={banner.imageUrl || undefined}
        className={`h-full w-full object-cover ${videoClassName}`}
      >
        <source src={banner.videoUrl} type="video/mp4" />
        {legacy && <source src={legacy} type="video/mp4" />}
      </video>
    );
  }
  if (banner.mediaType === 'image' && banner.imageUrl) {
    return (
      <img
        src={banner.imageUrl}
        alt=""
        aria-hidden="true"
        className={`h-full w-full object-cover ${imageClassName}`}
      />
    );
  }
  return fallback;
}

// Extra darkening layer controlled from the CMS for text legibility over bright media.
export function BannerOverlay({ banner, className = '' }) {
  if (!banner.overlay) return null;
  return (
    <div
      aria-hidden="true"
      className={`absolute inset-0 bg-black pointer-events-none ${className}`}
      style={{ opacity: banner.overlay / 100 }}
    />
  );
}

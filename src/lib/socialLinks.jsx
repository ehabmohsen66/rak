import React from 'react';

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TikTokIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const FacebookIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YouTubeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="5" width="20" height="14" rx="4" />
    <polygon points="10 9 15 12 10 15 10 9" fill="currentColor" stroke="none" />
  </svg>
);

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const BehanceIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 7h4.5a2.5 2.5 0 0 1 0 5H3V7z" />
    <path d="M3 12h5a2.75 2.75 0 0 1 0 5.5H3V12z" />
    <path d="M14 13.5h7a3.5 3.5 0 1 0-1.1 2.6" />
    <line x1="15" y1="7.5" x2="20" y2="7.5" />
  </svg>
);

export const WhatsAppIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const SOCIAL_PLATFORMS = [
  { id: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { id: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
  { id: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
  { id: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { id: 'youtube', label: 'YouTube', Icon: YouTubeIcon },
  { id: 'x', label: 'X', Icon: XIcon },
  { id: 'behance', label: 'Behance', Icon: BehanceIcon }
];

function normalizeExternalHref(raw) {
  const trimmed = String(raw || '').trim();
  if (!trimmed || trimmed === '#') return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, '')}`;
}

export function formatWhatsAppHref(raw) {
  const trimmed = String(raw || '').trim();
  if (!trimmed || trimmed === '#') return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^(wa\.me|api\.whatsapp\.com)\//i.test(trimmed)) return `https://${trimmed}`;
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 6) return '';
  return `https://wa.me/${digits}`;
}

export function getActiveSocialLinks(brandInfo = {}) {
  const socials = brandInfo?.socials || {};
  return SOCIAL_PLATFORMS.map((platform) => ({
    ...platform,
    href: normalizeExternalHref(socials[platform.id])
  })).filter((item) => Boolean(item.href));
}

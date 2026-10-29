// Page hero banners: defaults, page metadata, and merge helpers.
// Every public page reads its hero copy and background media from content.banners[pageId].

export const BANNER_PAGES = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    defaultVisual: null,
    fields: ['title', 'rotatingWords', 'subtitle', 'primaryCta']
  },
  {
    id: 'about',
    label: 'About',
    path: '/about',
    defaultVisual: null,
    fields: ['eyebrow', 'title', 'subtitle', 'primaryCta']
  },
  {
    id: 'services',
    label: 'Services',
    path: '/services',
    defaultVisual: 'Animated magenta hills',
    fields: ['eyebrow', 'title', 'subtitle', 'primaryCta', 'secondaryCta'],
    tokens: ['{count}']
  },
  {
    id: 'work',
    label: 'Work',
    path: '/work',
    defaultVisual: 'Interactive light shader',
    fields: ['eyebrow', 'title', 'subtitle']
  },
  {
    id: 'caseStudies',
    label: 'Case Studies',
    path: '/case-studies',
    defaultVisual: 'Soft brand glow (follows light/dark theme)',
    fields: ['eyebrow', 'title', 'subtitle', 'primaryCta', 'secondaryCta', 'stats']
  },
  {
    id: 'careers',
    label: 'Careers',
    path: '/careers',
    defaultVisual: null,
    fields: ['title', 'subtitle', 'primaryCta']
  },
  {
    id: 'blog',
    label: 'Blog',
    path: '/blog',
    defaultVisual: 'Interactive 3D scene',
    fields: ['title', 'subtitle', 'primaryCta', 'secondaryCta']
  },
  {
    id: 'contact',
    label: 'Contact',
    path: '/contact',
    defaultVisual: 'Team photo with dark wash',
    fields: ['eyebrow', 'title', 'subtitle', 'primaryCta', 'secondaryCta', 'stats']
  }
];

const BASE_BANNER = {
  eyebrow: '',
  title: '',
  subtitle: '',
  rotatingWords: [],
  primaryCtaLabel: '',
  primaryCtaHref: '',
  secondaryCtaLabel: '',
  secondaryCtaHref: '',
  mediaType: 'default',
  videoUrl: '',
  imageUrl: '',
  overlay: 0,
  stats: []
};

export const DEFAULT_BANNERS = {
  home: {
    ...BASE_BANNER,
    title: 'We Create Big Ideas From Ground Zero & Take Them to',
    rotatingWords: ['Next Level.', 'Galactic Orbit.', 'The Global Stage.', 'Peak Resonance.'],
    subtitle: '',
    primaryCtaLabel: 'Learn More',
    mediaType: 'video',
    videoUrl: '/videos/homepage-banner.mp4'
  },
  about: {
    ...BASE_BANNER,
    mediaType: 'video',
    videoUrl: '/videos/about-banner.mp4'
  },
  services: {
    ...BASE_BANNER,
    eyebrow: '{count} Pillars of Capability',
    title: '*{count} CORE* PILLARS',
    subtitle:
      'One stop for every stage of the work. From ideation and strategy to execution, performance monitoring, and enterprise evaluation.',
    primaryCtaLabel: 'Initiate Project Brief',
    secondaryCtaLabel: 'View Capability Units'
  },
  work: {
    ...BASE_BANNER,
    eyebrow: 'Interactive Portfolio Archive',
    title: 'THE *RAK4* CREATIONS',
    subtitle:
      'From ground zero to new heights. Browse how we shape brand identity, custom software, and performance media campaigns.'
  },
  caseStudies: {
    ...BASE_BANNER,
    eyebrow: 'Proven Blueprints & Enterprise ROI',
    title: 'Proven Transformations.\n*Measured at Scale.*',
    subtitle:
      'Explore end-to-end case studies, digital architectures, and quantitative business breakthroughs delivered for category-defining leaders.',
    primaryCtaLabel: 'Initiate Project Scope',
    secondaryCtaLabel: 'Explore Blueprints',
    stats: [
      { value: '+340%', label: 'Average Conversion Velocity', tag: 'GROWTH BENCHMARK' },
      { value: '$180M+', label: 'Enterprise Value Created', tag: 'COMMERCIAL ROI' },
      { value: '100%', label: 'Production-Tested Blueprints', tag: 'EXECUTION ASSURANCE' }
    ]
  },
  careers: {
    ...BASE_BANNER,
    title: "We *think*, you *grow*\nthat's the deal.",
    subtitle:
      "“We take your big ideas and turn them into clear, winning strategies. From setting up your company to scaling it worldwide, we're here every step of the way.”",
    primaryCtaLabel: 'Explore Open Roles',
    mediaType: 'video',
    videoUrl: '/videos/careers-banner.mp4'
  },
  blog: {
    ...BASE_BANNER,
    title: 'Elevate your\ncreative workflow\nto an art form.',
    subtitle:
      'Manage all of your media and assets, including video, photos, design files, docs, and PDFs, on a single secure surface to create and deliver high-quality content faster.',
    primaryCtaLabel: 'Explore Executive Articles',
    secondaryCtaLabel: 'Watch Editorial Video'
  },
  contact: {
    ...BASE_BANNER,
    eyebrow: 'Global Executive Concierge • Beirut & Toronto',
    title: "Let's Architect\n*Your Next*\nBreakthrough.",
    subtitle:
      'RAK4Creative is a worldwide full-service agency bound by passion and hunger to unlock potential through our unique perspectives, bold creativity, and tech magic.',
    primaryCtaLabel: 'Start Executive Brief',
    secondaryCtaLabel: 'Scope Planner',
    stats: [
      { value: '< 12 HOURS', label: 'Executive Response SLA', tag: '' },
      { value: '2 GLOBAL HUBS', label: 'Beirut HQ & Toronto Studio', tag: '' },
      { value: '8 PILLARS', label: 'Full-Service 360° Execution', tag: '' }
    ]
  }
};

// Built-in video files that shipped with alternate filenames; kept as <source> fallbacks.
export const LEGACY_VIDEO_FALLBACKS = {
  '/videos/homepage-banner.mp4': '/videos/RAK4-WebsiteHomepage banner-021026.mp4',
  '/videos/about-banner.mp4': '/videos/RAK4-WebsiteAbout Page banner-021026.mp4',
  '/videos/careers-banner.mp4': '/videos/RAK4-WebsiteCareer Page banner-021026.mp4'
};

const STRING_KEYS = [
  'eyebrow',
  'title',
  'subtitle',
  'primaryCtaLabel',
  'primaryCtaHref',
  'secondaryCtaLabel',
  'secondaryCtaHref',
  'videoUrl',
  'imageUrl'
];

export function normalizeBanner(pageId, raw) {
  const defaults = DEFAULT_BANNERS[pageId] || BASE_BANNER;
  if (!raw || typeof raw !== 'object') {
    return { ...defaults, rotatingWords: [...defaults.rotatingWords], stats: defaults.stats.map((s) => ({ ...s })) };
  }
  const merged = { ...defaults };
  for (const key of STRING_KEYS) {
    if (typeof raw[key] === 'string') merged[key] = raw[key];
  }
  if (['default', 'video', 'image'].includes(raw.mediaType)) {
    merged.mediaType = raw.mediaType;
  }
  const overlay = Number(raw.overlay);
  merged.overlay = Number.isFinite(overlay) ? Math.min(90, Math.max(0, Math.round(overlay))) : defaults.overlay;
  merged.rotatingWords = Array.isArray(raw.rotatingWords)
    ? raw.rotatingWords.map((w) => String(w))
    : [...defaults.rotatingWords];
  merged.stats = Array.isArray(raw.stats)
    ? raw.stats.map((s) => ({
        value: String(s?.value ?? ''),
        label: String(s?.label ?? ''),
        tag: String(s?.tag ?? '')
      }))
    : defaults.stats.map((s) => ({ ...s }));
  return merged;
}

export function normalizeBanners(raw = {}) {
  const source = raw && typeof raw === 'object' ? raw : {};
  const out = {};
  for (const page of BANNER_PAGES) {
    out[page.id] = normalizeBanner(page.id, source[page.id]);
  }
  return out;
}

export function applyBannerTokens(text, tokens = {}) {
  if (typeof text !== 'string') return '';
  return text.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(tokens, key) ? String(tokens[key]) : match
  );
}

// Resolves a CTA href: '#id' scrolls, '/path' navigates inside the SPA, anything else is an external URL.
export function followBannerLink(href) {
  const target = String(href || '').trim();
  if (!target) return false;
  if (target.startsWith('#')) {
    const el = document.getElementById(target.slice(1));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    return true;
  }
  if (target.startsWith('/') && !target.startsWith('//')) {
    window.history.pushState({}, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return true;
  }
  window.open(target, '_blank', 'noopener,noreferrer');
  return true;
}

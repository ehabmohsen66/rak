// Branded Showcase Hubs (Link-in-Bio & Industry/Client Pitch Microsites)
// Managed in /admin -> Showcase Hubs and rendered standalone at /showcase/:slug

import { REAL_ESTATE_CASE_STUDIES } from '../data/realEstateCaseStudies';

export const DEFAULT_SHOWCASES = [
  {
    id: 'real-estate',
    active: true,
    noindex: true,
    listedInDirectory: true,
    pinCode: '',
    title: '@RAKSHOWCASE_REALESTATE',
    subtitle: '',
    avatarUrl: '/showcase-media/real-estate-avatar.webp',
    ogImageUrl: '/showcase-media/real-estate-bg.webp',
    backgroundType: 'image', // 'image' | 'video' | 'gradient'
    backgroundUrl: '/showcase-media/real-estate-bg.webp',
    backgroundColor: '#101829',
    backgroundFit: 'ambient', // 'ambient' | 'cover'
    overlayOpacity: 25,
    buttonStyle: 'solid', // 'solid' | 'glass' | 'outline'
    buttonColor: '#213967',
    buttonTextColor: '#FFFFFF',
    buttonRadius: 'pill', // 'pill' | 'rounded'
    showFooterCta: true,
    footerCtaLabel: 'Request Real Estate Proposal',
    whatsapp: '',
    contactEmail: '',
    items: [
      {
        id: 're-portfolio',
        type: 'pdf', // 'link' | 'pdf' | 'case-study' | 'gallery' | 'header'
        active: true,
        title: 'PORTFOLIO',
        subtitle: '',
        badge: '',
        thumbnail: '',
        url: '/showcase-media/rak-real-estate-portfolio.pdf',
        mediaItems: [],
        projects: []
      },
      {
        id: 're-case-study',
        type: 'case-study',
        active: true,
        title: 'CASE STUDY - BRANDING CONCEPT',
        subtitle: '',
        badge: '',
        thumbnail: '',
        url: '',
        mediaItems: [],
        projects: REAL_ESTATE_CASE_STUDIES
      },
      {
        id: 're-renders-videos',
        type: 'link',
        active: true,
        title: 'RENDERS & VIDEOS',
        subtitle: '',
        badge: '',
        thumbnail: '',
        url: 'https://claude.ai/artifact/VZfJWV4DuGx1aY4MWYuAe1',
        mediaItems: [],
        projects: []
      }
    ]
  }
];

export function slugifyShowcaseId(raw = '') {
  return (
    String(raw || '')
      .toLowerCase()
      .trim()
      .replace(/^@+/, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `showcase-${Date.now()}`
  );
}

function detectAssetMediaType(rawType, rawUrl = '') {
  if (rawType === 'pdf' || /\.pdf(\?|$)/i.test(String(rawUrl))) return 'pdf';
  if (rawType === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(String(rawUrl))) return 'video';
  return 'image';
}

export function normalizeCaseStudyProject(proj = {}, pIdx = 0) {
  const sections = Array.isArray(proj?.sections)
    ? proj.sections.map((sec, sIdx) => ({
        id: String(sec?.id || `sec-${pIdx}-${sIdx}`),
        title: String(sec?.title || `Section ${sIdx + 1}`),
        items: Array.isArray(sec?.items)
          ? sec.items
              .filter((it) => it && typeof it === 'object' && it.url)
              .map((it, iIdx) => ({
                id: String(it.id || `cs-asset-${pIdx}-${sIdx}-${iIdx}`),
                mediaType: detectAssetMediaType(it.mediaType, it.url),
                title: String(it.title || ''),
                subtitle: String(it.subtitle || ''),
                url: String(it.url || '')
              }))
          : []
      }))
    : [];

  return {
    id: String(proj?.id || `project-${pIdx + 1}`),
    name: String(proj?.name || `Case Study ${pIdx + 1}`),
    client: String(proj?.client || ''),
    tagline: String(proj?.tagline || ''),
    logoUrl: String(proj?.logoUrl || ''),
    coverUrl: String(proj?.coverUrl || ''),
    sections
  };
}

export function normalizeShowcaseItem(item = {}, idx = 0) {
  const validTypes = ['link', 'pdf', 'case-study', 'gallery', 'header'];
  let rawUrl = String(item?.url ?? '');
  let type = validTypes.includes(item?.type) ? item.type : 'link';

  // Auto-upgrade legacy Google Drive links from initial seed to hosted native assets
  if (rawUrl.includes('1RFwVvQ1EFenpT_NDvAlSLNhqdVZXJ6rC')) {
    type = 'pdf';
    rawUrl = '/showcase-media/rak-real-estate-portfolio.pdf';
  } else if (rawUrl.includes('1I9h1gtfe-zEfY0Kw4ileov-kboffcskE')) {
    type = 'case-study';
    rawUrl = '';
  }

  const mediaItems = Array.isArray(item?.mediaItems)
    ? item.mediaItems
        .filter((m) => m && typeof m === 'object' && m.url)
        .map((m, mIdx) => ({
          id: String(m.id || `media-${idx}-${mIdx}`),
          mediaType:
            m.mediaType === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(String(m.url))
              ? 'video'
              : 'image',
          url: String(m.url || ''),
          title: String(m.title || ''),
          subtitle: String(m.subtitle || '')
        }))
    : [];

  let projects = [];
  if (Array.isArray(item?.projects) && item.projects.length > 0) {
    projects = item.projects.map((p, pIdx) => normalizeCaseStudyProject(p, pIdx));
  } else if (
    type === 'case-study' &&
    (item?.id === 're-case-study' || /branding concept/i.test(String(item?.title || '')))
  ) {
    projects = REAL_ESTATE_CASE_STUDIES.map((p, pIdx) => normalizeCaseStudyProject(p, pIdx));
  }

  return {
    id: String(item?.id || `item-${idx}-${Date.now()}`),
    type,
    active: item?.active !== false,
    title: String(item?.title ?? ''),
    subtitle: String(item?.subtitle ?? ''),
    badge: String(item?.badge ?? ''),
    thumbnail: String(item?.thumbnail ?? ''),
    url: rawUrl,
    mediaItems,
    projects
  };
}

export function normalizeShowcase(raw = {}, idx = 0) {
  const base = DEFAULT_SHOWCASES[0];
  const overlayNum = Number(raw?.overlayOpacity);
  return {
    id: slugifyShowcaseId(raw?.id || `showcase-${idx + 1}`),
    active: raw?.active !== false,
    noindex: raw?.noindex !== false,
    listedInDirectory: raw?.listedInDirectory !== false,
    pinCode: String(raw?.pinCode ?? '').trim(),
    title: String(raw?.title ?? base.title),
    subtitle: String(raw?.subtitle ?? ''),
    avatarUrl: String(raw?.avatarUrl ?? base.avatarUrl),
    ogImageUrl: String(raw?.ogImageUrl ?? raw?.backgroundUrl ?? base.ogImageUrl),
    backgroundType: ['image', 'video', 'gradient'].includes(raw?.backgroundType)
      ? raw.backgroundType
      : 'image',
    backgroundUrl: String(raw?.backgroundUrl ?? ''),
    backgroundColor: String(raw?.backgroundColor || '#101829'),
    backgroundFit: raw?.backgroundFit === 'cover' ? 'cover' : 'ambient',
    overlayOpacity: Number.isFinite(overlayNum)
      ? Math.max(0, Math.min(90, Math.round(overlayNum)))
      : 25,
    buttonStyle: ['solid', 'glass', 'outline'].includes(raw?.buttonStyle)
      ? raw.buttonStyle
      : 'solid',
    buttonColor: String(raw?.buttonColor || '#213967'),
    buttonTextColor: String(raw?.buttonTextColor || '#FFFFFF'),
    buttonRadius: raw?.buttonRadius === 'rounded' ? 'rounded' : 'pill',
    showFooterCta: raw?.showFooterCta !== false,
    footerCtaLabel: String(raw?.footerCtaLabel ?? 'Request Proposal'),
    whatsapp: String(raw?.whatsapp ?? ''),
    contactEmail: String(raw?.contactEmail ?? ''),
    items: Array.isArray(raw?.items)
      ? raw.items.map((it, i) => normalizeShowcaseItem(it, i))
      : []
  };
}

export function normalizeShowcases(rawList) {
  if (!Array.isArray(rawList)) {
    return DEFAULT_SHOWCASES.map((s, i) => normalizeShowcase(s, i));
  }
  return rawList.map((s, i) => normalizeShowcase(s, i));
}

// Converts Google Drive /file/d/<id>/view URLs into embeddable /preview URLs for inline PDF viewing
export function toEmbedDocumentUrl(rawUrl = '') {
  const url = String(rawUrl || '').trim();
  if (!url) return '';
  const driveFileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (driveFileMatch) {
    return `https://drive.google.com/file/d/${driveFileMatch[1]}/preview`;
  }
  return url;
}

// Branded Showcase Hubs (Link-in-Bio & Industry/Client Pitch Microsites)
// Managed in /admin -> Showcase Hubs and rendered standalone at /showcase/:slug

import { REAL_ESTATE_CASE_STUDIES } from '../data/realEstateCaseStudies';

export const REAL_ESTATE_RENDERS_MEDIA = [
  {
    id: 're-rv-maya-hero-film',
    mediaType: 'video',
    title: 'Maya Luxury Collection — Architectural Hero Film',
    subtitle: '3D Architectural Film & Walkthrough',
    url: '/showcase-media/case-studies/maya/landing-page/maya-landing-page-film.mp4'
  },
  {
    id: 're-rv-maya-ext-street',
    mediaType: 'image',
    title: 'Townhouse Exterior 3D Render — Street Perspective',
    subtitle: 'Maya Luxury Collection • 3D Visualization',
    url: '/showcase-media/case-studies/maya/exterior/st-01-m1.webp'
  },
  {
    id: 're-rv-maya-ext-front',
    mediaType: 'image',
    title: 'Townhouse Exterior 3D Render — Front Elevation',
    subtitle: 'Maya Luxury Collection • 3D Visualization',
    url: '/showcase-media/case-studies/maya/exterior/front-amends01-m1.webp'
  },
  {
    id: 're-rv-maya-ext-back',
    mediaType: 'image',
    title: 'Townhouse Exterior 3D Render — Garden & Courtyard',
    subtitle: 'Maya Luxury Collection • 3D Visualization',
    url: '/showcase-media/case-studies/maya/exterior/back-01-m1.webp'
  },
  {
    id: 're-rv-maya-brand-film',
    mediaType: 'video',
    title: 'Maya Brand Film (Full Architectural Cut)',
    subtitle: '3D Walkthrough & Motion Reel',
    url: '/showcase-media/case-studies/maya/videos/v1-d3-1.mp4'
  },
  {
    id: 're-rv-maya-reel-v2',
    mediaType: 'video',
    title: 'Architectural Walkthrough Reel V2',
    subtitle: 'Maya Luxury Collection • Motion Production',
    url: '/showcase-media/case-studies/maya/videos/v2-d1-2.mp4'
  },
  {
    id: 're-rv-maya-col-1',
    mediaType: 'video',
    title: 'Maya Collection 3D Reel 01',
    subtitle: '3D Exterior & Interior Motion',
    url: '/showcase-media/case-studies/maya/videos/maya-collection-video-1.mp4'
  },
  {
    id: 're-rv-maya-col-2',
    mediaType: 'video',
    title: 'Maya Collection 3D Reel 02',
    subtitle: '3D Exterior & Interior Motion',
    url: '/showcase-media/case-studies/maya/videos/maya-collection-video-2.mp4'
  },
  {
    id: 're-rv-bottega-cover',
    mediaType: 'image',
    title: 'Bottega Nove — Architectural Key Visual',
    subtitle: 'Bottega Nove by ACY • 3D Key Visual',
    url: '/showcase-media/case-studies/bottega/collaterals/bottega-brochure-cover.webp'
  },
  {
    id: 're-rv-bottega-1',
    mediaType: 'video',
    title: 'Bottega Nove — Architectural Motion Reel 01',
    subtitle: 'Bottega Nove by ACY • Motion Ad',
    url: '/showcase-media/case-studies/bottega/videos/bottega-nove.mp4'
  },
  {
    id: 're-rv-bottega-2',
    mediaType: 'video',
    title: 'Bottega Nove — Architectural Motion Reel 02',
    subtitle: 'Bottega Nove by ACY • Motion Ad',
    url: '/showcase-media/case-studies/bottega/videos/bottega-nove-2.mp4'
  },
  {
    id: 're-rv-bottega-res-2',
    mediaType: 'video',
    title: 'Bottega Residences — Luxury Walkthrough 01',
    subtitle: 'Bottega Nove by ACY • Residence Tour',
    url: '/showcase-media/case-studies/bottega/videos/bottega-residences-2.mp4'
  },
  {
    id: 're-rv-bottega-res-3',
    mediaType: 'video',
    title: 'Bottega Residences — Luxury Walkthrough 02',
    subtitle: 'Bottega Nove by ACY • Residence Tour',
    url: '/showcase-media/case-studies/bottega/videos/bottega-residences-3.mp4'
  },
  {
    id: 're-rv-maya-ooh-wrap',
    mediaType: 'image',
    title: 'On-Site Architectural Building Wrap Render',
    subtitle: 'Maya Luxury Collection • 3D OOH Mockup',
    url: '/showcase-media/case-studies/maya/ooh/building-wrap.webp'
  }
];

export const DEFAULT_SHOWCASES = [
  {
    id: 'real-estate',
    schemaVersion: 2,
    active: true,
    noindex: true,
    listedInDirectory: true,
    pinCode: '',
    title: 'Real Estate Showcase',
    subtitle: '',
    showHeaderText: false,
    avatarUrl: '/showcase-media/real-estate-avatar.webp',
    ogImageUrl: '/showcase-media/real-estate-bg.webp',
    backgroundType: 'image', // 'image' | 'video' | 'gradient'
    backgroundUrl: '/showcase-media/real-estate-bg.webp',
    backgroundColor: '#101829',
    backgroundFit: 'cover', // 'cover' | 'ambient'
    overlayOpacity: 25,
    buttonStyle: 'solid', // 'solid' | 'glass' | 'outline'
    buttonColor: '#2D3139',
    buttonTextColor: '#FFFFFF',
    buttonRadius: 'pill', // 'pill' | 'rounded'
    showFooterCta: false,
    footerCtaLabel: 'Request Real Estate Proposal',
    whatsapp: '+961 81 998 851',
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
        type: 'gallery',
        active: true,
        title: 'RENDERS & VIDEOS',
        subtitle: '',
        badge: '',
        thumbnail: '',
        url: 'https://claude.ai/artifact/VZfJWV4DuGx1aY4MWYuAe1',
        mediaItems: REAL_ESTATE_RENDERS_MEDIA,
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
  if (
    rawUrl.includes('1RFwVvQ1EFenpT_NDvAlSLNhqdVZXJ6rC') ||
    (item?.id === 're-portfolio' && (!rawUrl || rawUrl.includes('drive.google.com')))
  ) {
    type = 'pdf';
    rawUrl = '/showcase-media/rak-real-estate-portfolio.pdf';
  } else if (rawUrl.includes('1I9h1gtfe-zEfY0Kw4ileov-kboffcskE')) {
    type = 'case-study';
    rawUrl = '';
  }

  let mediaItems = Array.isArray(item?.mediaItems)
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

  if (
    mediaItems.length === 0 &&
    (item?.id === 're-renders-videos' || /renders\s*&\s*videos/i.test(String(item?.title || '')))
  ) {
    mediaItems = REAL_ESTATE_RENDERS_MEDIA.map((m) => ({ ...m }));
    if (type === 'link' && (!rawUrl || rawUrl.includes('claude.ai/artifact/VZfJWV4DuGx1aY4MWYuAe1'))) {
      type = 'gallery';
    }
  }

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
  const id = slugifyShowcaseId(raw?.id || `showcase-${idx + 1}`);
  const isRealEstate = id === 'real-estate';
  const isLegacySchema = !raw?.schemaVersion || Number(raw.schemaVersion) < 2;
  const overlayNum = Number(raw?.overlayOpacity);

  const rawTitle = String(raw?.title ?? base.title);
  const normalizedTitle =
    isRealEstate && rawTitle.trim().toUpperCase() === '@RAKSHOWCASE_REALESTATE'
      ? 'Real Estate Showcase'
      : rawTitle;

  const rawSubtitle = String(raw?.subtitle ?? '');
  const normalizedSubtitle =
    isRealEstate && isLegacySchema && /real estate branding/i.test(rawSubtitle)
      ? ''
      : rawSubtitle;

  const rawButtonColor = String(raw?.buttonColor || '').trim();
  const normalizedButtonColor =
    !rawButtonColor || (isLegacySchema && rawButtonColor.toUpperCase() === '#213967')
      ? '#2D3139'
      : rawButtonColor;

  const normalizedBgFit =
    isLegacySchema && isRealEstate
      ? 'cover'
      : raw?.backgroundFit === 'ambient'
      ? 'ambient'
      : 'cover';

  const normalizedWhatsapp =
    String(raw?.whatsapp || '').trim() || (isRealEstate ? '+961 81 998 851' : '');

  const normalizedShowFooterCta =
    isLegacySchema && isRealEstate ? false : Boolean(raw?.showFooterCta);

  return {
    id,
    schemaVersion: 2,
    active: raw?.active !== false,
    noindex: raw?.noindex !== false,
    listedInDirectory: raw?.listedInDirectory !== false,
    pinCode: String(raw?.pinCode ?? '').trim(),
    title: normalizedTitle,
    subtitle: normalizedSubtitle,
    showHeaderText: Boolean(raw?.showHeaderText),
    avatarUrl: String(raw?.avatarUrl ?? base.avatarUrl),
    ogImageUrl: String(raw?.ogImageUrl ?? raw?.backgroundUrl ?? base.ogImageUrl),
    backgroundType: ['image', 'video', 'gradient'].includes(raw?.backgroundType)
      ? raw.backgroundType
      : 'image',
    backgroundUrl: String(raw?.backgroundUrl ?? ''),
    backgroundColor: String(raw?.backgroundColor || '#101829'),
    backgroundFit: normalizedBgFit,
    overlayOpacity: Number.isFinite(overlayNum)
      ? Math.max(0, Math.min(90, Math.round(overlayNum)))
      : 25,
    buttonStyle: ['solid', 'glass', 'outline'].includes(raw?.buttonStyle)
      ? raw.buttonStyle
      : 'solid',
    buttonColor: normalizedButtonColor,
    buttonTextColor: String(raw?.buttonTextColor || '#FFFFFF'),
    buttonRadius: raw?.buttonRadius === 'rounded' ? 'rounded' : 'pill',
    showFooterCta: normalizedShowFooterCta,
    footerCtaLabel: String(raw?.footerCtaLabel ?? 'Request Proposal'),
    whatsapp: normalizedWhatsapp,
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

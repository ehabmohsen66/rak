// Branded Showcase Hubs (Link-in-Bio & Industry/Client Pitch Microsites)
// Managed in /admin -> Showcase Hubs and rendered standalone at /showcase/:slug

export const DEFAULT_SHOWCASES = [
  {
    id: 'real-estate',
    active: true,
    noindex: true,
    listedInDirectory: true,
    pinCode: '',
    title: '@RAKSHOWCASE_REALESTATE',
    subtitle: 'Real Estate Branding, 3D Architectural Visualization & Performance Campaigns',
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
        type: 'link', // 'link' | 'pdf' | 'gallery' | 'header'
        active: true,
        title: 'PORTFOLIO',
        subtitle: '',
        badge: '',
        thumbnail: '',
        url: 'https://drive.google.com/file/d/1RFwVvQ1EFenpT_NDvAlSLNhqdVZXJ6rC/view?usp=sharing',
        mediaItems: []
      },
      {
        id: 're-case-study',
        type: 'link',
        active: true,
        title: 'CASE STUDY - BRANDING CONCEPT',
        subtitle: '',
        badge: '',
        thumbnail: '',
        url: 'https://drive.google.com/drive/folders/1I9h1gtfe-zEfY0Kw4ileov-kboffcskE?usp=sharing',
        mediaItems: []
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
        mediaItems: []
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

export function normalizeShowcaseItem(item = {}, idx = 0) {
  const validTypes = ['link', 'pdf', 'gallery', 'header'];
  const type = validTypes.includes(item?.type) ? item.type : 'link';
  const mediaItems = Array.isArray(item?.mediaItems)
    ? item.mediaItems
        .filter((m) => m && typeof m === 'object' && m.url)
        .map((m, mIdx) => ({
          id: String(m.id || `media-${idx}-${mIdx}`),
          mediaType: m.mediaType === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(String(m.url)) ? 'video' : 'image',
          url: String(m.url || ''),
          title: String(m.title || '')
        }))
    : [];

  return {
    id: String(item?.id || `item-${idx}-${Date.now()}`),
    type,
    active: item?.active !== false,
    title: String(item?.title ?? ''),
    subtitle: String(item?.subtitle ?? ''),
    badge: String(item?.badge ?? ''),
    thumbnail: String(item?.thumbnail ?? ''),
    url: String(item?.url ?? ''),
    mediaItems
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

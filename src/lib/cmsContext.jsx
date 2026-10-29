import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_CMS_CONTENT,
  DEFAULT_PIXELS,
  DEFAULT_EMAIL_SETTINGS
} from '../data/contentData';
import {
  applyPixelsToDocument,
  trackPageView,
  trackLeadConversion
} from './pixelEngine';

const CONTENT_STORAGE_KEY = 'rak_cms_content_v1';
const PIXELS_STORAGE_KEY = 'rak_cms_pixels_v1';
const TOKEN_STORAGE_KEY = 'rak_cms_auth_token_v1';
const USER_STORAGE_KEY = 'rak_cms_auth_user_v1';

const CmsContext = createContext(null);

const LEGACY_SITE_TITLES = [
  'RAK 4 CREATIVE | Global Digital & Brand Innovation Agency'
];
const LEGACY_DESCRIPTIONS = [
  'RAK 4 CREATIVE transforms ambitious enterprises into market leaders through brand identity, digital product design, web architecture, and growth strategy.'
];
const LEGACY_KEYWORDS = [
  'RAK 4 Creative, Brand Strategy, UI/UX Design, Web Development, CRO, Digital Transformation, Enterprise Agency'
];
const LEGACY_PAGE_TITLES = {
  home: 'RAK 4 CREATIVE | Global Digital & Brand Innovation Agency',
  about: 'About Us | RAK 4 CREATIVE Brand Architecture',
  services: 'Services & Capabilities | RAK 4 CREATIVE',
  work: 'Selected Portfolio Work | RAK 4 CREATIVE',
  'case-studies': 'Enterprise Case Studies & ROI | RAK 4 CREATIVE',
  careers: 'Careers & Open Roles | RAK 4 CREATIVE',
  blog: 'Executive Editorial & Insights | RAK 4 CREATIVE',
  'blog-post': 'Editorial Insight | RAK 4 CREATIVE',
  contact: 'Contact & Executive Inquiry | RAK 4 CREATIVE'
};

function normalizeSeo(rawSeo = {}) {
  const defaultSeo = INITIAL_CMS_CONTENT.seo;
  const siteTitle =
    rawSeo.siteTitle && !LEGACY_SITE_TITLES.includes(rawSeo.siteTitle)
      ? rawSeo.siteTitle
      : defaultSeo.siteTitle;
  const metaDescription =
    rawSeo.metaDescription && !LEGACY_DESCRIPTIONS.includes(rawSeo.metaDescription)
      ? rawSeo.metaDescription
      : defaultSeo.metaDescription;
  const metaKeywords =
    rawSeo.metaKeywords && !LEGACY_KEYWORDS.includes(rawSeo.metaKeywords)
      ? rawSeo.metaKeywords
      : defaultSeo.metaKeywords;
  const ogImage =
    rawSeo.ogImage && !String(rawSeo.ogImage).includes('photo-1618005182384-a83a8bd57fbe')
      ? rawSeo.ogImage
      : defaultSeo.ogImage;

  const pageTitles = { ...defaultSeo.pageTitles };
  if (rawSeo.pageTitles && typeof rawSeo.pageTitles === 'object') {
    for (const [k, v] of Object.entries(rawSeo.pageTitles)) {
      if (v && LEGACY_PAGE_TITLES[k] !== v) {
        pageTitles[k] = v;
      }
    }
  }

  const pageDescriptions = {
    ...(defaultSeo.pageDescriptions || {}),
    ...(rawSeo.pageDescriptions || {})
  };

  return {
    ...defaultSeo,
    ...rawSeo,
    siteTitle,
    metaDescription,
    metaKeywords,
    ogImage,
    pageTitles,
    pageDescriptions
  };
}

function normalizeContent(raw = {}) {
  return {
    brandInfo: {
      ...INITIAL_CMS_CONTENT.brandInfo,
      ...(raw.brandInfo || {}),
      whatWeDoSpans: Array.isArray(raw.brandInfo?.whatWeDoSpans)
        ? raw.brandInfo.whatWeDoSpans
        : INITIAL_CMS_CONTENT.brandInfo.whatWeDoSpans,
      stats: Array.isArray(raw.brandInfo?.stats)
        ? raw.brandInfo.stats
        : INITIAL_CMS_CONTENT.brandInfo.stats,
      clients: Array.isArray(raw.brandInfo?.clients)
        ? raw.brandInfo.clients
        : INITIAL_CMS_CONTENT.brandInfo.clients
    },
    pillars: Array.isArray(raw.pillars) && raw.pillars.length > 0 ? raw.pillars : INITIAL_CMS_CONTENT.pillars,
    values: Array.isArray(raw.values) && raw.values.length > 0 ? raw.values : INITIAL_CMS_CONTENT.values,
    careersCopy: {
      ...INITIAL_CMS_CONTENT.careersCopy,
      ...(raw.careersCopy || {})
    },
    openRoles: Array.isArray(raw.openRoles) ? raw.openRoles : INITIAL_CMS_CONTENT.openRoles,
    projects: Array.isArray(raw.projects) && raw.projects.length > 0 ? raw.projects : INITIAL_CMS_CONTENT.projects,
    blogPosts: Array.isArray(raw.blogPosts) && raw.blogPosts.length > 0 ? raw.blogPosts : INITIAL_CMS_CONTENT.blogPosts,
    offices: Array.isArray(raw.offices) && raw.offices.length > 0 ? raw.offices : INITIAL_CMS_CONTENT.offices,
    testimonials: Array.isArray(raw.testimonials) && raw.testimonials.length > 0 ? raw.testimonials : INITIAL_CMS_CONTENT.testimonials,
    seo: normalizeSeo(raw.seo || {})
  };
}

function normalizePixels(raw = {}) {
  return {
    ...DEFAULT_PIXELS,
    ...(raw || {})
  };
}

export function CmsProvider({ children }) {
  const [content, setContent] = useState(() => {
    try {
      const cached = localStorage.getItem(CONTENT_STORAGE_KEY);
      if (cached) return normalizeContent(JSON.parse(cached));
    } catch {
      // ignore storage read error
    }
    return INITIAL_CMS_CONTENT;
  });

  const [pixels, setPixels] = useState(() => {
    try {
      const cached = localStorage.getItem(PIXELS_STORAGE_KEY);
      if (cached) return normalizePixels(JSON.parse(cached));
    } catch {
      // ignore
    }
    return DEFAULT_PIXELS;
  });

  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(TOKEN_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  const [adminUser, setAdminUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [serverInfo, setServerInfo] = useState({
    environment: 'connecting',
    phpVersion: '',
    connected: false,
    lastSyncedAt: null
  });

  const [loadingBootstrap, setLoadingBootstrap] = useState(true);

  const apiCall = useCallback(async (route, options = {}) => {
    const headers = {
      ...(options.headers || {})
    };
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    const activeToken = options.tokenOverride !== undefined ? options.tokenOverride : token;
    if (activeToken) {
      headers['X-CMS-Token'] = activeToken;
      headers['Authorization'] = `Bearer ${activeToken}`;
    }

    const query = options.query ? `&${new URLSearchParams(options.query).toString()}` : '';
    const url = `/api/index.php?route=${encodeURIComponent(route)}${query}`;

    const res = await fetch(url, {
      method: options.method || 'GET',
      headers,
      body: options.body
    });

    const data = await res.json().catch(() => ({ ok: false, error: `Invalid JSON response (HTTP ${res.status})` }));
    if (res.status === 401 && route !== 'login') {
      setToken('');
      setAdminUser(null);
      try {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    return { status: res.status, ...data };
  }, [token]);

  const refreshBootstrap = useCallback(async () => {
    setLoadingBootstrap(true);
    try {
      const data = await apiCall('bootstrap');
      if (data && data.ok) {
        const nextContent = normalizeContent(data.content || {});
        const nextPixels = normalizePixels(data.pixels || {});
        setContent(nextContent);
        setPixels(nextPixels);
        setServerInfo({
          environment: data.environment || 'cpanel-php',
          phpVersion: data.phpVersion || '',
          connected: true,
          lastSyncedAt: new Date().toISOString()
        });
        try {
          localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(nextContent));
          localStorage.setItem(PIXELS_STORAGE_KEY, JSON.stringify(nextPixels));
        } catch {
          // ignore quota errors
        }
        applyPixelsToDocument(nextPixels);
      }
    } catch {
      setServerInfo((prev) => ({ ...prev, connected: false }));
    } finally {
      setLoadingBootstrap(false);
    }
  }, [apiCall]);

  useEffect(() => {
    refreshBootstrap();
  }, [refreshBootstrap]);

  useEffect(() => {
    applyPixelsToDocument(pixels);
  }, [pixels]);

  const login = async (username, password) => {
    const res = await apiCall('login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (res.ok && res.token) {
      setToken(res.token);
      setAdminUser(res.user || { username });
      try {
        localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user || { username }));
      } catch {
        // ignore
      }
    }
    return res;
  };

  const logout = () => {
    setToken('');
    setAdminUser(null);
    try {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const changePassword = async (currentPassword, newUsername, newPassword) => {
    const res = await apiCall('change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newUsername, newPassword })
    });
    if (res.ok && res.token) {
      setToken(res.token);
      if (res.user) setAdminUser(res.user);
      try {
        localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
        if (res.user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
      } catch {
        // ignore
      }
    }
    return res;
  };

  const saveContent = async (updatedContent) => {
    const normalized = normalizeContent(updatedContent);
    const res = await apiCall('content', {
      method: 'PUT',
      body: JSON.stringify({ content: normalized })
    });
    if (res.ok) {
      setContent(normalized);
      try {
        localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(normalized));
      } catch {
        // ignore
      }
    }
    return res;
  };

  const resetToDefaultContent = async () => {
    return saveContent(INITIAL_CMS_CONTENT);
  };

  const savePixels = async (updatedPixels) => {
    const normalized = normalizePixels(updatedPixels);
    const res = await apiCall('pixels', {
      method: 'PUT',
      body: JSON.stringify({ pixels: normalized })
    });
    if (res.ok) {
      setPixels(normalized);
      applyPixelsToDocument(normalized);
      try {
        localStorage.setItem(PIXELS_STORAGE_KEY, JSON.stringify(normalized));
      } catch {
        // ignore
      }
    }
    return res;
  };

  const submitLead = async (leadPayload) => {
    const enriched = {
      ...leadPayload,
      pageUrl: typeof window !== 'undefined' ? window.location.href : ''
    };
    const res = await apiCall('leads', {
      method: 'POST',
      body: JSON.stringify(enriched)
    });
    if (res.ok) {
      trackLeadConversion(pixels, enriched);
    }
    return res;
  };

  const fetchLeads = useCallback(async () => {
    return apiCall('leads', { method: 'GET' });
  }, [apiCall]);

  const updateLead = async (id, patch) => {
    return apiCall('leads', {
      method: 'PATCH',
      body: JSON.stringify({ id, ...patch })
    });
  };

  const deleteLead = async (id) => {
    return apiCall('leads', {
      method: 'DELETE',
      query: { id },
      body: JSON.stringify({ id })
    });
  };

  const fetchEmailSettings = useCallback(async () => {
    const res = await apiCall('email-settings', { method: 'GET' });
    if (res.ok) {
      return {
        ok: true,
        emailSettings: {
          ...DEFAULT_EMAIL_SETTINGS,
          ...(res.emailSettings || {})
        }
      };
    }
    return res;
  }, [apiCall]);

  const saveEmailSettings = async (settings) => {
    return apiCall('email-settings', {
      method: 'PUT',
      body: JSON.stringify({ emailSettings: settings })
    });
  };

  const sendTestEmail = async (recipient, emailSettings) => {
    return apiCall('test-email', {
      method: 'POST',
      body: JSON.stringify({ recipient, emailSettings })
    });
  };

  const uploadMediaFile = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const res = await apiCall('upload', {
          method: 'POST',
          body: JSON.stringify({
            fileName: file.name,
            dataUrl: reader.result
          })
        });
        resolve(res);
      };
      reader.onerror = () => resolve({ ok: false, error: 'Failed to read selected file.' });
      reader.readAsDataURL(file);
    });
  };

  const runServerAudit = useCallback(async () => {
    return apiCall('audit', { method: 'GET' });
  }, [apiCall]);

  const recordPageView = useCallback((path, title) => {
    trackPageView(pixels, path, title);
  }, [pixels]);

  const value = {
    content,
    pixels,
    token,
    adminUser,
    isAuthenticated: Boolean(token),
    serverInfo,
    loadingBootstrap,
    refreshBootstrap,
    login,
    logout,
    changePassword,
    saveContent,
    resetToDefaultContent,
    savePixels,
    submitLead,
    fetchLeads,
    updateLead,
    deleteLead,
    fetchEmailSettings,
    saveEmailSettings,
    sendTestEmail,
    uploadMediaFile,
    runServerAudit,
    recordPageView
  };

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) {
    throw new Error('useCms must be used within a CmsProvider');
  }
  return ctx;
}

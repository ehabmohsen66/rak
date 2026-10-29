// Marketing Pixels & Conversion Event Engine for RAK 4 CREATIVE CMS

const PIXEL_LOG_KEY = 'rak_cms_pixel_events_v1';

export function getPixelEventLog() {
  try {
    const raw = sessionStorage.getItem(PIXEL_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function appendPixelEventLog(entry) {
  try {
    const current = getPixelEventLog();
    const next = [
      {
        id: `px-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
        ...entry
      },
      ...current
    ].slice(0, 40);
    sessionStorage.setItem(PIXEL_LOG_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent('rak-pixel-log-updated', { detail: next }));
    return next;
  } catch {
    return [];
  }
}

export function clearPixelEventLog() {
  try {
    sessionStorage.removeItem(PIXEL_LOG_KEY);
    window.dispatchEvent(new CustomEvent('rak-pixel-log-updated', { detail: [] }));
  } catch {
    // ignore storage errors
  }
}

function mountCustomHtmlSnippet(containerId, targetParent, htmlString, prepend = false) {
  if (typeof document === 'undefined' || !targetParent) return;
  let existing = document.getElementById(containerId);
  if (existing) {
    existing.remove();
  }
  if (!htmlString || !String(htmlString).trim()) return;

  const wrapper = document.createElement('div');
  wrapper.id = containerId;
  wrapper.setAttribute('data-rak-cms-injected', 'true');
  wrapper.style.display = 'none';

  const template = document.createElement('template');
  template.innerHTML = String(htmlString).trim();

  const nodes = Array.from(template.content.childNodes);
  nodes.forEach((node) => {
    if (node.nodeName === 'SCRIPT') {
      const script = document.createElement('script');
      Array.from(node.attributes || []).forEach((attr) => {
        script.setAttribute(attr.name, attr.value);
      });
      if (node.textContent) {
        script.textContent = node.textContent;
      }
      wrapper.appendChild(script);
    } else {
      wrapper.appendChild(node.cloneNode(true));
    }
  });

  if (prepend && targetParent.firstChild) {
    targetParent.insertBefore(wrapper, targetParent.firstChild);
  } else {
    targetParent.appendChild(wrapper);
  }
}

export function applyPixelsToDocument(pixels = {}) {
  if (typeof window === 'undefined' || typeof document === 'undefined' || !pixels) return;

  // 1. Google Tag Manager
  if (pixels.gtmEnabled && pixels.gtmId && String(pixels.gtmId).trim()) {
    const gtmId = String(pixels.gtmId).trim();
    window.dataLayer = window.dataLayer || [];
    if (!window.__RAK_GTM_LOADED__ || window.__RAK_GTM_ID__ !== gtmId) {
      window.__RAK_GTM_LOADED__ = true;
      window.__RAK_GTM_ID__ = gtmId;
      window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
      s.setAttribute('data-rak-pixel', 'gtm');
      document.head.appendChild(s);

      mountCustomHtmlSnippet(
        'rak-cms-gtm-noscript',
        document.body,
        `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`,
        true
      );
      appendPixelEventLog({ provider: 'Google Tag Manager', event: 'Container Initialized', targetId: gtmId });
    }
  }

  // 2. Google Analytics 4 (GA4)
  if (pixels.ga4Enabled && pixels.ga4Id && String(pixels.ga4Id).trim()) {
    const ga4Id = String(pixels.ga4Id).trim();
    if (!window.__RAK_GA4_LOADED__ || window.__RAK_GA4_ID__ !== ga4Id) {
      window.__RAK_GA4_LOADED__ = true;
      window.__RAK_GA4_ID__ = ga4Id;
      window.dataLayer = window.dataLayer || [];
      window.gtag = window.gtag || function gtag() { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', ga4Id, { send_page_view: pixels.trackPageViews !== false });

      const s = document.createElement('script');
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
      s.setAttribute('data-rak-pixel', 'ga4');
      document.head.appendChild(s);
      appendPixelEventLog({ provider: 'Google Analytics 4', event: 'Config Initialized', targetId: ga4Id });
    }
  }

  // 3. Meta / Facebook Pixel
  if (pixels.metaPixelEnabled && pixels.metaPixelId && String(pixels.metaPixelId).trim()) {
    const metaId = String(pixels.metaPixelId).trim();
    if (!window.__RAK_META_LOADED__ || window.__RAK_META_ID__ !== metaId) {
      window.__RAK_META_LOADED__ = true;
      window.__RAK_META_ID__ = metaId;
      if (!window.fbq) {
        const n = (window.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
        });
        if (!window._fbq) window._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
        const s = document.createElement('script');
        s.async = true;
        s.src = 'https://connect.facebook.net/en_US/fbevents.js';
        s.setAttribute('data-rak-pixel', 'meta');
        document.head.appendChild(s);
      }
      window.fbq('init', metaId);
      if (pixels.trackPageViews !== false) {
        window.fbq('track', 'PageView');
      }
      appendPixelEventLog({ provider: 'Meta Pixel', event: 'Init & PageView', targetId: metaId });
    }
  }

  // 4. TikTok Pixel
  if (pixels.tiktokPixelEnabled && pixels.tiktokPixelId && String(pixels.tiktokPixelId).trim()) {
    const ttId = String(pixels.tiktokPixelId).trim();
    if (!window.__RAK_TIKTOK_LOADED__ || window.__RAK_TIKTOK_ID__ !== ttId) {
      window.__RAK_TIKTOK_LOADED__ = true;
      window.__RAK_TIKTOK_ID__ = ttId;
      window.TiktokAnalyticsObject = 'ttq';
      const ttq = (window.ttq = window.ttq || []);
      ttq.methods = ['page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready', 'alias', 'group', 'enableCookie', 'disableCookie'];
      ttq.setAndDefer = function (t, e) {
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      };
      for (let i = 0; i < ttq.methods.length; i++) {
        ttq.setAndDefer(ttq, ttq.methods[i]);
      }
      if (pixels.trackPageViews !== false && typeof ttq.page === 'function') {
        ttq.page();
      }
      appendPixelEventLog({ provider: 'TikTok Pixel', event: 'Initialized', targetId: ttId });
    }
  }

  // 5. LinkedIn Insight Tag
  if (pixels.linkedinEnabled && pixels.linkedinPartnerId && String(pixels.linkedinPartnerId).trim()) {
    const liId = String(pixels.linkedinPartnerId).trim();
    if (!window.__RAK_LINKEDIN_LOADED__ || window.__RAK_LINKEDIN_ID__ !== liId) {
      window.__RAK_LINKEDIN_LOADED__ = true;
      window.__RAK_LINKEDIN_ID__ = liId;
      window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || [];
      if (!window._linkedin_data_partner_ids.includes(liId)) {
        window._linkedin_data_partner_ids.push(liId);
      }
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://snap.licdn.com/li.lms-analytics/insight.min.js';
      s.setAttribute('data-rak-pixel', 'linkedin');
      document.head.appendChild(s);
      appendPixelEventLog({ provider: 'LinkedIn Insight', event: 'Partner Tag Loaded', targetId: liId });
    }
  }

  // 6. Snap Pixel
  if (pixels.snapPixelEnabled && pixels.snapPixelId && String(pixels.snapPixelId).trim()) {
    const snapId = String(pixels.snapPixelId).trim();
    if (!window.__RAK_SNAP_LOADED__ || window.__RAK_SNAP_ID__ !== snapId) {
      window.__RAK_SNAP_LOADED__ = true;
      window.__RAK_SNAP_ID__ = snapId;
      window.snaptr = window.snaptr || function () {
        (window.snaptr.handleRequest ? window.snaptr.handleRequest.apply(window.snaptr, arguments) : window.snaptr.queue.push(arguments));
      };
      window.snaptr.queue = window.snaptr.queue || [];
      window.snaptr('init', snapId);
      if (pixels.trackPageViews !== false) {
        window.snaptr('track', 'PAGE_VIEW');
      }
      appendPixelEventLog({ provider: 'Snap Pixel', event: 'Init & PAGE_VIEW', targetId: snapId });
    }
  }

  // 7. X / Twitter Pixel
  if (pixels.twitterPixelEnabled && pixels.twitterPixelId && String(pixels.twitterPixelId).trim()) {
    const twId = String(pixels.twitterPixelId).trim();
    if (!window.__RAK_TWITTER_LOADED__ || window.__RAK_TWITTER_ID__ !== twId) {
      window.__RAK_TWITTER_LOADED__ = true;
      window.__RAK_TWITTER_ID__ = twId;
      window.twq = window.twq || function () {
        window.twq.exe ? window.twq.exe.apply(window.twq, arguments) : window.twq.queue.push(arguments);
      };
      window.twq.version = '1.1';
      window.twq.queue = window.twq.queue || [];
      window.twq('config', twId);
      appendPixelEventLog({ provider: 'X (Twitter) Pixel', event: 'Config Initialized', targetId: twId });
    }
  }

  // 8. Custom Head / Body Scripts
  mountCustomHtmlSnippet('rak-cms-custom-head', document.head, pixels.customHeadScripts || '');
  mountCustomHtmlSnippet('rak-cms-custom-body-start', document.body, pixels.customBodyStartScripts || '', true);
  mountCustomHtmlSnippet('rak-cms-custom-body-end', document.body, pixels.customBodyEndScripts || '', false);
}

export function trackPageView(pixels = {}, path = '/', title = '') {
  if (typeof window === 'undefined' || !pixels || pixels.trackPageViews === false) return;

  const fired = [];

  if (pixels.metaPixelEnabled && pixels.metaPixelId && typeof window.fbq === 'function') {
    window.fbq('track', 'PageView');
    fired.push('Meta');
  }
  if (pixels.gtmEnabled && pixels.gtmId) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'rak_page_view',
      page_path: path,
      page_title: title || document.title
    });
    fired.push('GTM');
  }
  if (pixels.ga4Enabled && pixels.ga4Id && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: title || document.title
    });
    fired.push('GA4');
  }
  if (pixels.tiktokPixelEnabled && pixels.tiktokPixelId && window.ttq && typeof window.ttq.page === 'function') {
    window.ttq.page();
    fired.push('TikTok');
  }
  if (pixels.snapPixelEnabled && pixels.snapPixelId && typeof window.snaptr === 'function') {
    window.snaptr('track', 'PAGE_VIEW');
    fired.push('Snap');
  }

  if (fired.length > 0) {
    appendPixelEventLog({
      provider: fired.join(', '),
      event: 'PageView',
      targetId: path
    });
  }
}

export function trackLeadConversion(pixels = {}, lead = {}) {
  if (typeof window === 'undefined' || !pixels || pixels.trackLeadEvents === false) return [];

  const fired = [];
  const source = lead.source || 'contact';
  const category = lead.service || lead.roleTitle || 'General Inquiry';

  if (pixels.metaPixelEnabled && pixels.metaPixelId && typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', {
      content_name: source,
      content_category: category,
      value: 1,
      currency: 'USD'
    });
    fired.push(`Meta (${pixels.metaPixelId})`);
  }

  if (pixels.gtmEnabled && pixels.gtmId) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: 'rak_lead_conversion',
      lead_source: source,
      lead_category: category,
      lead_budget: lead.budget || ''
    });
    fired.push(`GTM (${pixels.gtmId})`);
  }

  if (pixels.ga4Enabled && pixels.ga4Id && typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      event_category: source,
      event_label: category
    });
    fired.push(`GA4 (${pixels.ga4Id})`);
  }

  if (pixels.tiktokPixelEnabled && pixels.tiktokPixelId && window.ttq && typeof window.ttq.track === 'function') {
    window.ttq.track('SubmitForm', {
      content_name: source,
      content_category: category
    });
    fired.push(`TikTok (${pixels.tiktokPixelId})`);
  }

  if (pixels.snapPixelEnabled && pixels.snapPixelId && typeof window.snaptr === 'function') {
    window.snaptr('track', 'SIGN_UP', { sign_up_method: source });
    fired.push(`Snap (${pixels.snapPixelId})`);
  }

  if (pixels.twitterPixelEnabled && pixels.twitterPixelId && typeof window.twq === 'function') {
    window.twq('event', pixels.twitterPixelId, { status: 'lead', content_name: source });
    fired.push(`X (${pixels.twitterPixelId})`);
  }

  if (pixels.customConversionScript && String(pixels.customConversionScript).trim()) {
    try {
      window.__RAK_LAST_LEAD__ = lead;
      const fn = new Function('lead', String(pixels.customConversionScript));
      fn(lead);
      fired.push('Custom Conversion Script');
    } catch (err) {
      appendPixelEventLog({
        provider: 'Custom Conversion Script',
        event: 'Error: ' + (err?.message || 'Script error'),
        targetId: source
      });
    }
  }

  appendPixelEventLog({
    provider: fired.length > 0 ? fired.join(', ') : 'Internal CMS Tracker',
    event: `Lead Conversion (${source.toUpperCase()})`,
    targetId: category
  });

  return fired;
}

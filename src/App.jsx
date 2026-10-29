import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProjectModal from './components/ProjectModal';
import JobApplicationModal from './components/JobApplicationModal';
import ProjectEstimatorModal from './components/ProjectEstimatorModal';
import { useCms } from './lib/cmsContext';

import HomePage from './pages/HomePage';

function lazyWithRetry(importer, chunkKey) {
  return React.lazy(async () => {
    const storageKey = `rak_chunk_retry_${chunkKey}`;
    try {
      const mod = await importer();
      try {
        window.sessionStorage.removeItem(storageKey);
      } catch {
        // Ignore sessionStorage restrictions
      }
      return mod;
    } catch (err) {
      const msg = String(err?.message || err || '');
      const isChunkLoadFailure =
        msg.includes('Failed to fetch dynamically imported module') ||
        msg.includes('Importing a module script failed') ||
        msg.includes('error loading dynamically imported module') ||
        err?.name === 'ChunkLoadError';

      if (isChunkLoadFailure && typeof window !== 'undefined') {
        try {
          const hasRetried = window.sessionStorage.getItem(storageKey);
          if (!hasRetried) {
            window.sessionStorage.setItem(storageKey, '1');
            window.location.reload();
            return new Promise(() => {});
          }
          window.sessionStorage.removeItem(storageKey);
        } catch {
          // Fall through to ErrorBoundary if sessionStorage is unavailable
        }
      }
      throw err;
    }
  });
}

const AboutPage = lazyWithRetry(() => import('./pages/AboutPage'), 'about');
const ServicesPage = lazyWithRetry(() => import('./pages/ServicesPage'), 'services');
const WorkPage = lazyWithRetry(() => import('./pages/WorkPage'), 'work');
const CaseStudiesPage = lazyWithRetry(() => import('./pages/CaseStudiesPage'), 'case-studies');
const CareersPage = lazyWithRetry(() => import('./pages/CareersPage'), 'careers');
const BlogPage = lazyWithRetry(() => import('./pages/BlogPage'), 'blog');
const BlogPostPage = lazyWithRetry(() => import('./pages/BlogPostPage'), 'blog-post');
const ContactPage = lazyWithRetry(() => import('./pages/ContactPage'), 'contact');
const AdminCmsPage = lazyWithRetry(() => import('./pages/AdminCmsPage'), 'admin');

const TAB_TO_PATH = {
  home: '/',
  about: '/about',
  services: '/services',
  work: '/work',
  'case-studies': '/case-studies',
  careers: '/careers',
  blog: '/blog',
  contact: '/contact',
  admin: '/admin'
};

const PATH_TO_TAB = {
  '/': 'home',
  '/home': 'home',
  '/about': 'about',
  '/services': 'services',
  '/work': 'work',
  '/case-studies': 'case-studies',
  '/careers': 'careers',
  '/blog': 'blog',
  '/contact': 'contact',
  '/admin': 'admin',
  '/cms': 'admin'
};

const getTabFromLocation = () => {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  const cleanPath = pathname.toLowerCase();

  if (cleanPath.startsWith('/blog/') && cleanPath.length > 6) {
    return 'blog-post';
  }

  return PATH_TO_TAB[cleanPath] || 'home';
};

const getBlogPostSlugFromLocation = () => {
  const pathname = window.location.pathname.replace(/\/$/, '') || '';
  const match = pathname.match(/^\/blog\/(.+)$/i);
  return match ? match[1] : null;
};

function setMetaContent(selector, value) {
  if (!value) return;
  const el = document.querySelector(selector);
  if (el) {
    el.setAttribute('content', value);
  }
}

function setCanonicalHref(url) {
  if (!url) return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

export function App() {
  const { content, recordPageView } = useCms();
  const [activeTab, setActiveTabState] = useState(() => getTabFromLocation());
  const [blogSlug, setBlogSlug] = useState(() => getBlogPostSlugFromLocation());
  const [darkMode, setDarkMode] = useState(false);

  const setActiveTab = (tabId, pathOverride = null, replace = false) => {
    const targetPath = pathOverride || TAB_TO_PATH[tabId] || '/';
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';

    if (tabId === 'blog-post' && pathOverride) {
      const slugMatch = pathOverride.match(/^\/blog\/(.+)$/i);
      setBlogSlug(slugMatch ? slugMatch[1] : null);
    }

    if (currentPath !== targetPath) {
      if (replace) {
        window.history.replaceState({ tab: tabId, path: targetPath }, '', targetPath);
      } else {
        window.history.pushState({ tab: tabId, path: targetPath }, '', targetPath);
      }
    }

    setActiveTabState(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromLocation();
      setActiveTabState(tab);
      if (tab === 'blog-post') {
        setBlogSlug(getBlogPostSlugFromLocation());
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync initial URL if needed
  useEffect(() => {
    const initialTab = getTabFromLocation();
    if (initialTab === 'blog-post') {
      setBlogSlug(getBlogPostSlugFromLocation());
    } else {
      const targetPath = TAB_TO_PATH[initialTab] || '/';
      if (
        window.location.pathname !== targetPath &&
        window.location.pathname !== '/home' &&
        window.location.pathname !== '/cms'
      ) {
        window.history.replaceState({ tab: initialTab }, '', targetPath);
      }
    }
  }, []);

  // Modals state
  const [selectedProject, setSelectedProject] = useState(null);
  const [appliedJob, setAppliedJob] = useState(null);
  const [plannerOpen, setPlannerOpen] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [darkMode]);

  // Animated Dynamic Favicon with Smooth Morphing Geometric Shapes
  useEffect(() => {
    let animId;
    let angle = 0;
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');

    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    let lastUpdate = 0;
    const render = (time) => {
      if (time - lastUpdate > 50) {
        lastUpdate = time;
        angle = (angle + 0.08) % (Math.PI * 2);

        if (ctx) {
          ctx.clearRect(0, 0, 32, 32);

          ctx.beginPath();
          ctx.roundRect(1, 1, 30, 30, 8);
          ctx.fillStyle = '#0B0E14';
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.stroke();

          ctx.save();
          ctx.translate(16, 16);
          ctx.rotate(angle);

          const grad = ctx.createLinearGradient(-12, -12, 12, 12);
          grad.addColorStop(0, '#EC008C');
          grad.addColorStop(0.5, '#00F0FF');
          grad.addColorStop(1, '#8B5CF6');

          ctx.beginPath();
          ctx.arc(0, 0, 11, 0, Math.PI * 2);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 3]);
          ctx.stroke();

          ctx.beginPath();
          ctx.arc(11, 0, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#00F0FF';
          ctx.fill();
          ctx.restore();

          ctx.save();
          ctx.translate(16, 16);
          ctx.rotate(-angle * 1.5);

          ctx.beginPath();
          ctx.roundRect(-5.5, -5.5, 11, 11, 2.5);
          ctx.fillStyle = 'rgba(236, 0, 140, 0.35)';
          ctx.fill();
          ctx.strokeStyle = '#EC008C';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([]);
          ctx.stroke();
          ctx.restore();

          ctx.save();
          ctx.translate(16, 16);
          const pulse = 1.8 + Math.sin(angle * 3) * 0.6;
          ctx.beginPath();
          ctx.arc(0, 0, pulse, 0, Math.PI * 2);
          ctx.fillStyle = '#FFFFFF';
          ctx.shadowColor = '#EC008C';
          ctx.shadowBlur = 4;
          ctx.fill();
          ctx.restore();

          link.href = canvas.toDataURL('image/png');
        }
      }
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  // Sync CMS SEO Document Title, Per-Route Meta Descriptions, Canonical URL & Robots Tags
  useEffect(() => {
    const seo = content?.seo || {};
    const pageTitles = seo.pageTitles || {};
    const pageDescriptions = seo.pageDescriptions || {};
    const baseCanonical = (seo.canonicalUrl || 'https://rak4creative.com').replace(/\/$/, '');

    let nextTitle =
      pageTitles[activeTab] ||
      seo.siteTitle ||
      'Digital Marketing Agency in Lebanon | RAK 4 CREATIVE';

    let nextDescription =
      pageDescriptions[activeTab] ||
      seo.metaDescription ||
      'Full-service digital marketing agency in Beirut, Lebanon serving MENA, GCC & global brands. Social media marketing, Meta & Google paid ads, SEO, branding & web.';

    let nextOgImage = seo.ogImage || 'https://rak4creative.com/og-logo.png';
    let nextOgType = 'website';
    let routePath = TAB_TO_PATH[activeTab] || '/';

    if (activeTab === 'blog-post' && blogSlug) {
      routePath = `/blog/${blogSlug}`;
      nextOgType = 'article';
      const matchedPost = (content?.blogPosts || []).find((p) => p.id === blogSlug);
      if (matchedPost) {
        if (matchedPost.title) {
          nextTitle = `${matchedPost.title} | RAK 4 CREATIVE`;
        }
        if (matchedPost.excerpt || matchedPost.subtitle) {
          nextDescription = matchedPost.excerpt || matchedPost.subtitle;
        }
        if (matchedPost.image) {
          nextOgImage = matchedPost.image.startsWith('http')
            ? matchedPost.image
            : `${baseCanonical}${matchedPost.image.startsWith('/') ? '' : '/'}${matchedPost.image}`;
        }
      }
    }

    const fullCanonicalUrl = routePath === '/' ? `${baseCanonical}/` : `${baseCanonical}${routePath}`;
    const robotsDirective =
      activeTab === 'admin'
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

    document.title = nextTitle;
    setCanonicalHref(fullCanonicalUrl);
    setMetaContent('meta[name="robots"]', robotsDirective);
    setMetaContent('meta[name="title"]', nextTitle);
    setMetaContent('meta[property="og:type"]', nextOgType);
    setMetaContent('meta[property="og:url"]', fullCanonicalUrl);
    setMetaContent('meta[property="twitter:url"]', fullCanonicalUrl);
    setMetaContent('meta[property="og:title"]', nextTitle);
    setMetaContent('meta[property="twitter:title"]', nextTitle);
    setMetaContent('meta[name="description"]', nextDescription);
    setMetaContent('meta[property="og:description"]', nextDescription);
    setMetaContent('meta[property="twitter:description"]', nextDescription);
    setMetaContent('meta[name="keywords"]', seo.metaKeywords);
    setMetaContent('meta[property="og:image"]', nextOgImage);
    setMetaContent('meta[property="twitter:image"]', nextOgImage);
  }, [activeTab, blogSlug, content?.seo, content?.blogPosts]);

  // Dispatch SPA PageView pixel events on public route transitions
  useEffect(() => {
    if (activeTab !== 'admin') {
      recordPageView(window.location.pathname, document.title);
    }
  }, [activeTab, blogSlug, recordPageView]);

  if (activeTab === 'admin') {
    return (
      <React.Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#07080B]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#D1007C]/25 border-t-[#D1007C] rounded-full animate-spin" />
              <span className="text-xs font-bold text-[#B8006D] dark:text-[#FF66C4] uppercase tracking-widest">
                Loading CMS Portal
              </span>
            </div>
          </div>
        }
      >
        <AdminCmsPage
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onNavigateSite={(tab, path) => setActiveTab(tab, path)}
        />
      </React.Suspense>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-rak-magenta selection:text-white transition-colors duration-300 bg-mesh-vibrant">
      {/* Sticky Navigation Bar */}
      <Navbar
        activeTab={activeTab === 'blog-post' ? 'blog' : activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenProjectPlanner={() => setPlannerOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-grow">
        <React.Suspense
          fallback={
            <div className="min-h-[60vh] flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-3 border-rak-magenta/20 border-t-rak-magenta rounded-full animate-spin" />
                <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">
                  Loading
                </span>
              </div>
            </div>
          }
        >
          {activeTab === 'home' && (
            <HomePage
              setActiveTab={setActiveTab}
              onSelectProject={(project) => setSelectedProject(project)}
              onSelectArticle={(article) => setActiveTab('blog-post', `/blog/${article.id}`)}
              onOpenPlanner={() => setPlannerOpen(true)}
            />
          )}

          {activeTab === 'about' && (
            <AboutPage onOpenPlanner={() => setPlannerOpen(true)} />
          )}

          {activeTab === 'services' && (
            <ServicesPage onOpenPlanner={() => setPlannerOpen(true)} />
          )}

          {activeTab === 'work' && (
            <WorkPage onSelectProject={(project) => setSelectedProject(project)} />
          )}

          {activeTab === 'case-studies' && (
            <CaseStudiesPage
              onSelectProject={(project) => setSelectedProject(project)}
              onOpenPlanner={() => setPlannerOpen(true)}
            />
          )}

          {activeTab === 'careers' && (
            <CareersPage onApplyJob={(job) => setAppliedJob(job)} />
          )}

          {activeTab === 'blog' && (
            <BlogPage
              onSelectArticle={(article) => setActiveTab('blog-post', `/blog/${article.id}`)}
            />
          )}

          {activeTab === 'blog-post' && (
            <BlogPostPage
              slug={blogSlug}
              onNavigate={(tab, path) => setActiveTab(tab, path)}
              onOpenPlanner={() => setPlannerOpen(true)}
            />
          )}

          {activeTab === 'contact' && (
            <ContactPage onOpenPlanner={() => setPlannerOpen(true)} />
          )}
        </React.Suspense>
      </main>

      {/* Footer */}
      <Footer
        setActiveTab={setActiveTab}
        onOpenProjectPlanner={() => setPlannerOpen(true)}
      />

      {/* Floating Scroll To Top Button */}
      <ScrollToTop />

      {/* Modals & Readers */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          onOpenPlanner={() => setPlannerOpen(true)}
        />
      )}

      {appliedJob && (
        <JobApplicationModal
          job={appliedJob}
          onClose={() => setAppliedJob(null)}
        />
      )}

      {plannerOpen && (
        <ProjectEstimatorModal onClose={() => setPlannerOpen(false)} />
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ProjectModal from './components/ProjectModal';
import JobApplicationModal from './components/JobApplicationModal';
import ProjectEstimatorModal from './components/ProjectEstimatorModal';

import HomePage from './pages/HomePage';
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const ServicesPage = React.lazy(() => import('./pages/ServicesPage'));
const WorkPage = React.lazy(() => import('./pages/WorkPage'));
const CaseStudiesPage = React.lazy(() => import('./pages/CaseStudiesPage'));
const CareersPage = React.lazy(() => import('./pages/CareersPage'));
const BlogPage = React.lazy(() => import('./pages/BlogPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const ContactPage = React.lazy(() => import('./pages/ContactPage'));

const TAB_TO_PATH = {
  home: '/',
  about: '/about',
  services: '/services',
  work: '/work',
  'case-studies': '/case-studies',
  careers: '/careers',
  blog: '/blog',
  contact: '/contact'
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
  '/contact': 'contact'
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

export function App() {
  const [activeTab, setActiveTabState] = useState(() => getTabFromLocation());
  const [blogSlug, setBlogSlug] = useState(() => getBlogPostSlugFromLocation());
  const [darkMode, setDarkMode] = useState(false);

  const setActiveTab = (tabId, pathOverride = null, replace = false) => {
    let targetPath = pathOverride || TAB_TO_PATH[tabId] || '/';
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
      if (window.location.pathname !== targetPath && window.location.pathname !== '/home') {
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

    // Find or create favicon link tag
    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }

    let lastUpdate = 0;
    const render = (time) => {
      // Throttle to ~20 FPS for crisp browser tab responsiveness without CPU load
      if (time - lastUpdate > 50) {
        lastUpdate = time;
        angle = (angle + 0.08) % (Math.PI * 2);

        if (ctx) {
          ctx.clearRect(0, 0, 32, 32);

          // 1. Dark Rounded Badge Background
          ctx.beginPath();
          ctx.roundRect(1, 1, 30, 30, 8);
          ctx.fillStyle = '#0B0E14';
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          ctx.stroke();

          // 2. Rotating Outer Dashed Orbital Ring
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

          // Satellite dot
          ctx.beginPath();
          ctx.arc(11, 0, 1.8, 0, Math.PI * 2);
          ctx.fillStyle = '#00F0FF';
          ctx.fill();
          ctx.restore();

          // 3. Reverse Spinning Geometric Diamond/Prism
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

          // 4. Pulsing Core Center Dot
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

  // Update SEO Document Title based on current active tab
  useEffect(() => {
    const titles = {
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
    document.title = titles[activeTab] || 'RAK 4 CREATIVE';
  }, [activeTab]);

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
        <React.Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-3 border-rak-magenta/20 border-t-rak-magenta rounded-full animate-spin" />
              <span className="text-xs font-bold text-rak-magenta uppercase tracking-widest">Loading</span>
            </div>
          </div>
        }>
        {activeTab === 'home' && (
          <HomePage 
            setActiveTab={setActiveTab}
            onSelectProject={(project) => setSelectedProject(project)}
            onSelectArticle={(article) => setActiveTab('blog-post', `/blog/${article.id}`)}
            onOpenPlanner={() => setPlannerOpen(true)}
          />
        )}

        {activeTab === 'about' && (
          <AboutPage 
            onOpenPlanner={() => setPlannerOpen(true)}
          />
        )}

        {activeTab === 'services' && (
          <ServicesPage 
            onOpenPlanner={() => setPlannerOpen(true)}
          />
        )}

        {activeTab === 'work' && (
          <WorkPage 
            onSelectProject={(project) => setSelectedProject(project)}
          />
        )}

        {activeTab === 'case-studies' && (
          <CaseStudiesPage 
            onSelectProject={(project) => setSelectedProject(project)}
            onOpenPlanner={() => setPlannerOpen(true)}
          />
        )}

        {activeTab === 'careers' && (
          <CareersPage 
            onApplyJob={(job) => setAppliedJob(job)}
          />
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
          <ContactPage 
            onOpenPlanner={() => setPlannerOpen(true)}
          />
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
        <ProjectEstimatorModal 
          onClose={() => setPlannerOpen(false)}
        />
      )}

    </div>
  );
}

export default App;

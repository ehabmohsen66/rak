import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProjectModal from './components/ProjectModal';
import ArticleModal from './components/ArticleModal';
import JobApplicationModal from './components/JobApplicationModal';
import ProjectEstimatorModal from './components/ProjectEstimatorModal';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import WorkPage from './pages/WorkPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';

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
  return PATH_TO_TAB[cleanPath] || 'home';
};

export function App() {
  const [activeTab, setActiveTabState] = useState(() => getTabFromLocation());
  const [darkMode, setDarkMode] = useState(true);

  const setActiveTab = (tabId, replace = false) => {
    const targetPath = TAB_TO_PATH[tabId] || '/';
    const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
    
    if (currentPath !== targetPath) {
      if (replace) {
        window.history.replaceState({ tab: tabId }, '', targetPath);
      } else {
        window.history.pushState({ tab: tabId }, '', targetPath);
      }
    }
    
    setActiveTabState(tabId);
  };

  useEffect(() => {
    const handlePopState = () => {
      const tab = getTabFromLocation();
      setActiveTabState(tab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Sync initial URL if needed (e.g., normalize /home or invalid path)
  useEffect(() => {
    const initialTab = getTabFromLocation();
    const targetPath = TAB_TO_PATH[initialTab] || '/';
    if (window.location.pathname !== targetPath && window.location.pathname !== '/home') {
      window.history.replaceState({ tab: initialTab }, '', targetPath);
    }
  }, []);

  // Modals state
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
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
      contact: 'Contact & Executive Inquiry | RAK 4 CREATIVE'
    };
    document.title = titles[activeTab] || 'RAK 4 CREATIVE';
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-rak-magenta selection:text-white transition-colors duration-300 bg-mesh-vibrant">
      
      {/* Sticky Navigation Bar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenProjectPlanner={() => setPlannerOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <HomePage 
            setActiveTab={setActiveTab}
            onSelectProject={(project) => setSelectedProject(project)}
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
            onSelectArticle={(article) => setSelectedArticle(article)}
          />
        )}

        {activeTab === 'contact' && (
          <ContactPage 
            onOpenPlanner={() => setPlannerOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer 
        setActiveTab={setActiveTab}
        onOpenProjectPlanner={() => setPlannerOpen(true)}
      />

      {/* Modals & Readers */}
      {selectedProject && (
        <ProjectModal 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)}
          onOpenPlanner={() => setPlannerOpen(true)}
        />
      )}

      {selectedArticle && (
        <ArticleModal 
          article={selectedArticle} 
          onClose={() => setSelectedArticle(null)}
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

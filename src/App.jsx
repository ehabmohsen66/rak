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

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(true);

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
    <div className="min-h-screen flex flex-col justify-between selection:bg-rak-magenta selection:text-white transition-colors duration-300">
      
      {/* Sticky Navigation Bar */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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

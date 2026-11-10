import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowUpRight,
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  MapPin,
  Phone,
  Sparkles,
  Calendar,
  Clock
} from 'lucide-react';
import { GLSLHills } from '../components/GLSLHills';
import { SpotlightCard } from '../components/SpotlightCard';
import { useCms } from '../lib/cmsContext';
import { getPillarIcon } from '../lib/pillarIcons';
import { getProjectImages } from '../lib/utils';
import {
  LEBANON_SERVICE_PAGES,
  getLebanonServiceBySlug
} from '../data/lebanonServicePages';

export const ServiceDetailPage = ({
  slug,
  setActiveTab = () => {},
  onSelectProject = () => {},
  onOpenPlanner = () => {}
}) => {
  const { content } = useCms();
  const service = useMemo(() => getLebanonServiceBySlug(slug), [slug]);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  useEffect(() => {
    setOpenFaqIndex(0);
  }, [slug]);

  const offices = content?.offices || [];
  const beirutOffice =
    offices.find((o) => String(o?.city || '').toLowerCase().includes('beirut')) || {
      city: 'Beirut',
      country: 'Lebanon',
      address: 'Badaro Executive Tower, Level 6',
      phone: '+961 1 380 400'
    };

  const matchedProjects = useMemo(() => {
    if (!service) return [];
    const allProjects = Array.isArray(content?.projects) ? content.projects : [];
    const tagSet = new Set((service.projectMatchTags || []).map((t) => t.toLowerCase()));
    const scored = allProjects.map((proj) => {
      const pTags = Array.isArray(proj.tags) ? proj.tags : [];
      const cat = String(proj.category || '').toLowerCase();
      let score = 0;
      pTags.forEach((t) => {
        if (tagSet.has(String(t).toLowerCase())) score += 2;
      });
      service.projectMatchTags?.forEach((mt) => {
        if (cat.includes(mt.toLowerCase())) score += 1;
      });
      return { proj, score };
    });
    return scored
      .sort((a, b) => b.score - a.score)
      .map((x) => x.proj)
      .slice(0, 3);
  }, [service, content?.projects]);

  const relatedPosts = useMemo(() => {
    if (!service) return [];
    const allPosts = Array.isArray(content?.blogPosts) ? content.blogPosts : [];
    const wanted = service.relatedBlogIds || [];
    const picked = [];
    wanted.forEach((id) => {
      const found = allPosts.find((p) => p.id === id);
      if (found) picked.push(found);
    });
    if (picked.length < 3) {
      allPosts.forEach((p) => {
        if (picked.length < 3 && !picked.some((x) => x.id === p.id)) {
          picked.push(p);
        }
      });
    }
    return picked.slice(0, 3);
  }, [service, content?.blogPosts]);

  if (!service) {
    return (
      <div className="min-h-[75vh] pt-32 pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white">
        <div className="max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-white dark:bg-rak-slate-900/80 border border-slate-200 dark:border-rak-slate-800 text-center space-y-5 shadow-sm">
          <span className="inline-flex px-3 py-1 rounded-full bg-rak-magenta/10 border border-rak-magenta/30 text-xs font-bold uppercase tracking-widest text-rak-magenta">
            Service Not Found
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading">
            We couldn&apos;t find that service page.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
            Explore all 8 agency pillars or return to our Beirut homepage to build a custom scope brief.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="/services"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('services', '/services');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>View All Services</span>
            </a>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('home', '/');
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-white/[0.06] hover:border-rak-magenta/40 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all"
            >
              <span>Back to Homepage</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  const ServiceIcon = getPillarIcon(service.icon);
  const siblingServices = LEBANON_SERVICE_PAGES.filter((s) => s.slug !== service.slug);

  const renderParagraphWithHomeLink = (text, idx) => {
    const phrase = 'digital marketing agency in Lebanon';
    const lowerText = text.toLowerCase();
    const matchIndex = lowerText.indexOf(phrase.toLowerCase());
    if (matchIndex === -1 || idx !== 1) {
      return text;
    }
    const before = text.slice(0, matchIndex);
    const matched = text.slice(matchIndex, matchIndex + phrase.length);
    const after = text.slice(matchIndex + phrase.length);
    return (
      <>
        {before}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('home', '/');
          }}
          className="font-semibold text-rak-magenta hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta rounded"
        >
          {matched}
        </a>
        {after}
      </>
    );
  };

  return (
    <div className="pb-20 space-y-16 sm:space-y-24 bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      {/* 1. Hero Section */}
      <section className="relative w-full pt-28 sm:pt-32 pb-16 sm:pb-20 bg-slate-950 overflow-hidden border-b border-slate-200 dark:border-rak-slate-800/80">
        <div className="absolute inset-0 z-0">
          {service.heroImage && (
            <img
              src={service.heroImage}
              alt={service.h1}
              className="w-full h-full object-cover opacity-25"
            />
          )}
          <div className="absolute inset-0 opacity-45">
            <GLSLHills width="100%" height="100%" speed={0.35} colorRgb={[0.93, 0.0, 0.55]} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-slate-950/80 to-slate-950" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-slate-300"
          >
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('home', '/');
              }}
              className="hover:text-rak-magenta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta rounded px-1"
            >
              Home
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <a
              href="/services"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('services', '/services');
              }}
              className="hover:text-rak-magenta transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta rounded px-1"
            >
              Services
            </a>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" aria-hidden="true" />
            <span className="text-white font-semibold px-1">{service.shortLabel}</span>
          </nav>

          <div className="max-w-4xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-rak-magenta/40 text-rak-magenta-light text-xs font-bold uppercase tracking-widest backdrop-blur-md">
              <ServiceIcon className="w-4 h-4 text-rak-magenta" aria-hidden="true" />
              <span>{service.eyebrow}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] font-heading">
              {service.h1}
            </h1>

            <p className="text-sm sm:text-lg text-slate-200 max-w-3xl leading-relaxed">
              {service.heroLead}
            </p>

            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={onOpenPlanner}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-glow transition-all hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <span>Scope Your Project</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <a
                href="/contact"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('contact', '/contact');
                }}
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-white/15 hover:border-rak-magenta/50 text-xs font-bold uppercase tracking-wider rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
              >
                <span>Speak With Beirut Team</span>
              </a>
            </div>
          </div>

          {/* Local Beirut HQ + Regional Footprint Strip */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rak-magenta shrink-0" aria-hidden="true" />
              <span>
                <strong className="text-white">Beirut HQ:</strong> {beirutOffice.address}, {beirutOffice.city}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-rak-magenta shrink-0" aria-hidden="true" />
              <a
                href={`tel:${String(beirutOffice.phone || '+9611380400').replace(/\s+/g, '')}`}
                className="hover:text-white transition-colors font-mono"
              >
                {beirutOffice.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-rak-magenta shrink-0" aria-hidden="true" />
              <span>Serving Lebanon, UAE, Saudi Arabia, Qatar, Europe &amp; North America</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Strategic Overview & Local Context */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-5">
            <span className="inline-flex px-3.5 py-1 rounded-full bg-rak-magenta/10 border border-rak-magenta/30 text-xs font-bold uppercase tracking-widest text-rak-magenta">
              Why RAK 4 CREATIVE
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading leading-tight">
              {service.overviewHeading}
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-slate-600 dark:text-rak-slate-300 leading-relaxed">
              {service.overviewParagraphs.map((para, idx) => (
                <p key={idx}>{renderParagraphWithHomeLink(para, idx)}</p>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 p-7 sm:p-8 rounded-3xl bg-white dark:bg-rak-slate-900/80 border border-slate-200 dark:border-rak-slate-800 space-y-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rak-magenta/10 border border-rak-magenta/30 text-rak-magenta">
                <ServiceIcon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-rak-magenta font-mono">
                  Integrated Execution
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Part of Our 8-Pillar Agency Engine
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
              Every engagement connects strategy, creative production, engineering, and analytics under one roof in Beirut and Toronto so campaigns move faster and attribution stays intact.
            </p>
            <ul className="space-y-2.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-rak-slate-200">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-rak-magenta shrink-0" aria-hidden="true" />
                <span>Dedicated Beirut account &amp; strategy lead</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-rak-magenta shrink-0" aria-hidden="true" />
                <span>Trilingual capability (English, Arabic &amp; French)</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-rak-magenta shrink-0" aria-hidden="true" />
                <span>Full ownership of ad accounts, code &amp; creative files</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-rak-magenta shrink-0" aria-hidden="true" />
                <span>Transparent KPI &amp; conversion reporting</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. Deliverables Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex px-3.5 py-1 rounded-full bg-rak-magenta/10 border border-rak-magenta/30 text-xs font-bold uppercase tracking-widest text-rak-magenta">
            What We Deliver
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            Core {service.shortLabel} Capabilities in Lebanon
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {service.deliverables.map((item, idx) => (
            <SpotlightCard
              key={idx}
              spotlightColor="rgba(236, 0, 140, 0.1)"
              borderColor="rgba(226, 232, 240, 0.8)"
              className="p-7 rounded-3xl bg-white dark:bg-rak-slate-900/70 border border-slate-200 dark:border-white/10 space-y-3 shadow-sm hover:border-rak-magenta/40 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rak-magenta">
                  0{idx + 1}
                </span>
                <CheckCircle2 className="w-4 h-4 text-rak-magenta" aria-hidden="true" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
                {item.detail}
              </p>
            </SpotlightCard>
          ))}
        </div>
      </section>

      {/* 4. 4-Step Execution Methodology */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex px-3.5 py-1 rounded-full bg-rak-magenta/10 border border-rak-magenta/30 text-xs font-bold uppercase tracking-widest text-rak-magenta">
            How We Work
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            From Audit to Measurable Market Impact
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {service.processSteps.map((st) => (
            <div
              key={st.step}
              className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-rak-slate-900/70 border border-slate-200 dark:border-white/10 space-y-3 shadow-sm"
            >
              <span className="inline-flex px-3 py-1 rounded-full bg-rak-magenta text-white text-xs font-mono font-bold">
                Step {st.step}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {st.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
                {st.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Matched Portfolio Proof */}
      {matchedProjects.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex px-3.5 py-1 rounded-full bg-rak-magenta/10 border border-rak-magenta/30 text-xs font-bold uppercase tracking-widest text-rak-magenta">
                Selected Work
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
                Recent Client Creations &amp; Case Outcomes
              </h2>
            </div>
            <a
              href="/case-studies"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('case-studies', '/case-studies');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-rak-magenta hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>View All Case Studies</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {matchedProjects.map((p) => (
              <SpotlightCard
                key={p.id}
                spotlightColor="rgba(236, 0, 140, 0.1)"
                borderColor="rgba(226, 232, 240, 0.8)"
                onClick={() => onSelectProject(p)}
                className="group cursor-pointer p-0 bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:border-rak-magenta/40 transition-all"
              >
                <div className="space-y-4">
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-rak-slate-950">
                    <img
                      src={getProjectImages(p)[0] || p.image}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-70" />
                    <div className="absolute top-3.5 left-3.5 px-3 py-1 bg-white/90 dark:bg-rak-slate-950/85 border border-slate-200 dark:border-white/10 rounded-full text-[10px] font-bold text-rak-magenta uppercase tracking-wider">
                      {p.client}
                    </div>
                  </div>
                  <div className="px-6 space-y-2">
                    <div className="text-[11px] font-mono font-semibold text-rak-magenta">
                      {p.category} • {p.year}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rak-magenta transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-rak-slate-300 line-clamp-2 leading-relaxed">
                      {p.summary}
                    </p>
                  </div>
                </div>
                <div className="p-6 pt-4 mt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-500 dark:text-rak-slate-400">
                    {p.industry}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rak-magenta">
                    <span>Inspect Case</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>
      )}

      {/* 6. Service-Specific FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <span className="inline-flex px-3.5 py-1 rounded-full bg-rak-magenta/10 border border-rak-magenta/30 text-xs font-bold uppercase tracking-widest text-rak-magenta font-mono">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading">
            {service.shortLabel} in Lebanon: Common Questions
          </h2>
        </div>

        <div className="space-y-3">
          {service.faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            const panelId = `srv-faq-panel-${faq.id}`;
            const buttonId = `srv-faq-btn-${faq.id}`;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-colors ${
                  isOpen
                    ? 'bg-white dark:bg-rak-slate-900 border-rak-magenta/40 shadow-sm'
                    : 'bg-white/80 dark:bg-rak-slate-900/50 border-slate-200 dark:border-white/10 hover:border-rak-magenta/30'
                }`}
              >
                <h3 className="m-0">
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta rounded-2xl"
                  >
                    <span className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {faq.question}
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'bg-rak-magenta text-white rotate-180'
                          : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-rak-slate-300'
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className={isOpen ? 'px-6 pb-5 pt-0' : 'hidden'}
                >
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed border-t border-slate-100 dark:border-white/10 pt-3.5">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 7. Related Editorial Guides */}
      {relatedPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-heading">
              Related Strategy Guides &amp; Playbooks
            </h2>
            <a
              href="/blog"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('blog', '/blog');
              }}
              className="text-xs font-bold uppercase tracking-widest text-rak-magenta hover:underline"
            >
              All Insights
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedPosts.map((post) => (
              <a
                key={post.id}
                href={`/blog/${post.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('blog-post', `/blog/${post.id}`);
                }}
                className="group p-6 rounded-2xl bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-white/10 hover:border-rak-magenta/40 transition-all flex flex-col justify-between gap-4 shadow-sm"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-slate-500 dark:text-rak-slate-400">
                    <span className="text-rak-magenta font-bold uppercase">{post.category}</span>
                    {post.readTime && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-rak-magenta" />
                        {post.readTime}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rak-magenta transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-rak-slate-300 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-rak-magenta">
                  <span>Read Guide</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 8. Sibling Service Silo Mesh */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-rak-magenta font-mono">
              360° Capabilities in Beirut
            </span>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-heading">
              Explore Other Digital Marketing Services in Lebanon
            </h2>
          </div>
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('home', '/');
            }}
            className="text-xs font-bold text-rak-magenta hover:underline"
          >
            Digital Marketing Agency in Lebanon Overview →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {siblingServices.map((sib) => {
            const SibIcon = getPillarIcon(sib.icon);
            return (
              <a
                key={sib.slug}
                href={`/services/${sib.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab('service-detail', `/services/${sib.slug}`);
                }}
                className="group p-5 rounded-2xl bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-white/10 hover:border-rak-magenta/50 transition-all flex flex-col justify-between gap-4 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-xl bg-rak-magenta/10 border border-rak-magenta/25 text-rak-magenta group-hover:bg-rak-magenta group-hover:text-white flex items-center justify-center transition-colors">
                    <SibIcon className="w-4 h-4" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rak-magenta transition-colors leading-snug">
                    {sib.shortLabel}
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rak-magenta">
                  <span>Explore</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      {/* 9. Bottom Conversion Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-gradient-to-r from-rak-magenta/10 via-white to-slate-50 dark:from-rak-magenta/20 dark:via-rak-slate-900 dark:to-rak-slate-900 border border-rak-magenta/30 rounded-3xl text-center space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-heading">
            Ready to scale your {service.shortLabel.toLowerCase()} from Beirut to the global stage?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 max-w-2xl mx-auto leading-relaxed">
            Partner with RAK 4 CREATIVE in Badaro, Beirut or Toronto for integrated strategy, creative production, web engineering, and measurable commercial performance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onOpenPlanner}
              className="px-8 py-3.5 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-glow inline-flex items-center gap-2 hover:scale-105 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
            >
              <span>Launch Project Planner</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <a
              href="/contact"
              onClick={(e) => {
                e.preventDefault();
                setActiveTab('contact', '/contact');
              }}
              className="px-8 py-3.5 bg-white dark:bg-rak-slate-950 text-slate-900 dark:text-white border border-slate-300 dark:border-white/15 hover:border-rak-magenta text-xs font-bold uppercase tracking-wider rounded-full inline-flex items-center gap-2 transition-all"
            >
              <span>Book a Consultation</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServiceDetailPage;

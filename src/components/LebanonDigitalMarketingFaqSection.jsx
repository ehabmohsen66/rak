import React, { useState } from 'react';
import { ChevronDown, ArrowUpRight, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { useCms } from '../lib/cmsContext';

export const DEFAULT_LEBANON_FAQS = [
  {
    id: 'faq-services-lebanon',
    question: 'What services does RAK 4 CREATIVE provide as a digital marketing agency in Lebanon?',
    answer:
      'From our Middle East headquarters in Badaro, Beirut (and our North America hub in Toronto), RAK 4 CREATIVE delivers end-to-end execution across 8 core pillars: Social Media Marketing and Meta/WhatsApp Campaigns, Paid Media Buying and Google Ads PPC, Technical SEO and Search Marketing (SEM), Brand Strategy and Out-of-Home (OOH) Billboards, Custom Web and E-Commerce Development, Content Creation and Video Production, Digital Consultancy, and Market Research and Data Analytics.'
  },
  {
    id: 'faq-meta-google-seo-gcc',
    question: 'Do you manage Meta Ads, Google Ads PPC, and SEO campaigns for brands in Lebanon and the GCC?',
    answer:
      'Yes. Our performance marketing and search teams in Beirut plan, launch, and optimize omnichannel campaigns across Meta (Facebook and Instagram), Google Search and Display, TikTok, LinkedIn, Snapchat, and WhatsApp. We pair paid media with technical SEO, Arabic and English keyword localization, and Google Business Profile optimization for companies scaling across Lebanon, the UAE, Saudi Arabia, Qatar, Kuwait, Europe, and North America.'
  },
  {
    id: 'faq-one-stop-beirut-agency',
    question: 'Why partner with a full-service agency in Beirut instead of separate single-channel vendors?',
    answer:
      'When brand strategy, video production, web development, and media buying are split across disconnected vendors, messaging fragments and attribution breaks. RAK 4 CREATIVE unites brand strategists, commercial directors, 3D motion artists, full-stack engineers, and performance media buyers under one roof so every campaign asset and landing page works together to drive measurable revenue.'
  },
  {
    id: 'faq-beirut-location-contact',
    question: 'Where is RAK 4 CREATIVE located in Lebanon, and how can we start a project?',
    answer:
      'Our Lebanon headquarters is located at Badaro Executive Tower, Level 6, Beirut (+961 1 380 400 | lebanon@rak4creative.com), alongside our North America office at 100 King Street West, Suite 5600, Toronto (+1 416-800-4820). You can launch a custom scope brief in minutes using our Interactive Project Planner or book a strategy consultation on our Contact page.'
  },
  {
    id: 'faq-industries-served',
    question: 'What industries does RAK 4 CREATIVE specialize in across Lebanon and MENA?',
    answer:
      'Since 2018, RAK 4 CREATIVE has partnered with ambitious enterprises and regional leaders across real estate and architectural development, luxury retail and e-commerce, hospitality and F&B, pharmaceuticals and biotech, banking and fintech, corporate events, and technology.'
  },
  {
    id: 'faq-roi-measurement',
    question: 'How do you measure digital marketing ROI and campaign performance?',
    answer:
      'Every engagement starts with a digital audit, clear commercial KPIs, and full-funnel conversion tracking (GA4, Google Tag Manager, Meta Pixel, TikTok, and LinkedIn). We evaluate success through transparent telemetry covering Return on Ad Spend (ROAS), Cost Per Qualified Lead, organic search rankings, and pipeline conversion velocity.'
  }
];

const CORE_HIGHLIGHTS = [
  'Social Media Management, Content Creation & Community Growth',
  'Meta Ads, Google Ads PPC, TikTok & LinkedIn Performance Scaling',
  'Technical SEO, Local Beirut Search & Arabic/English SEM',
  'Custom Web Architecture, UI/UX Systems & E-Commerce Platforms',
  'Brand Identity Makeovers, Corporate Guidelines & OOH Billboards',
  '4K Commercial Video Production, Photography & 3D Motion Art'
];

export const LebanonDigitalMarketingFaqSection = ({
  setActiveTab = null,
  onOpenPlanner = () => {},
  compact = false
}) => {
  const { content } = useCms();
  const faqs =
    Array.isArray(content?.faqs) && content.faqs.length > 0
      ? content.faqs
      : DEFAULT_LEBANON_FAQS;

  const [openIndex, setOpenIndex] = useState(0);

  const handleNavigate = (tabId, path, e) => {
    if (setActiveTab) {
      e.preventDefault();
      setActiveTab(tabId, path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-labelledby="lebanon-agency-seo-heading"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="rounded-3xl bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-white/10 p-7 sm:p-10 lg:p-14 shadow-sm backdrop-blur-xl space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Local & Regional Agency Authority Copy */}
          <div className="lg:col-span-5 space-y-5">
            <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-rak-magenta bg-rak-magenta/10 border border-rak-magenta/30 font-mono">
              Beirut HQ • MENA, GCC &amp; Global Reach
            </span>

            <h2
              id="lebanon-agency-seo-heading"
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-heading leading-tight"
            >
              Your Full-Service Digital Marketing Agency in Lebanon.
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
              Headquartered in <strong>Badaro, Beirut</strong> with a North American hub in <strong>Toronto</strong>,{' '}
              <strong>RAK 4 CREATIVE</strong> (part of RAK Group) is a one-stop digital marketing and creative agency in Lebanon engineered for brands that demand measurable commercial growth. Since 2018, we have united brand strategy, high-impact media production, enterprise web engineering, and performance marketing under one roof.
            </p>

            {!compact && (
              <ul className="space-y-2.5 pt-1">
                {CORE_HIGHLIGHTS.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-2.5 text-xs text-slate-700 dark:text-rak-slate-200 font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 text-rak-magenta shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-rak-slate-950/80 border border-slate-200 dark:border-white/10 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono text-[11px]">
                Lebanon Headquarters (Beirut)
              </div>
              <div className="flex items-center space-x-2 text-slate-600 dark:text-rak-slate-300">
                <MapPin className="w-3.5 h-3.5 text-rak-magenta shrink-0" />
                <span>Badaro Executive Tower, Level 6, Beirut, Lebanon</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-0.5 text-slate-600 dark:text-rak-slate-300">
                <a
                  href="tel:+9611380400"
                  className="inline-flex items-center space-x-1.5 hover:text-rak-magenta transition-colors font-medium"
                >
                  <Phone className="w-3.5 h-3.5 text-rak-magenta shrink-0" />
                  <span>+961 1 380 400</span>
                </a>
                <a
                  href="mailto:lebanon@rak4creative.com"
                  className="inline-flex items-center space-x-1.5 hover:text-rak-magenta transition-colors font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-rak-magenta shrink-0" />
                  <span>lebanon@rak4creative.com</span>
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onOpenPlanner}
                className="px-6 py-3 bg-rak-magenta hover:bg-rak-magenta-dark text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-magenta-sm inline-flex items-center space-x-2 transition-all hover:scale-105 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
              >
                <span>Start a Project Brief</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <a
                href="/contact"
                onClick={(e) => handleNavigate('contact', '/contact', e)}
                className="px-5 py-3 bg-slate-100 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10 text-xs font-bold uppercase tracking-wider rounded-full transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
              >
                Contact Beirut Office
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Accessible FAQ Accordion */}
          <div className="lg:col-span-7 space-y-3">
            <div className="pb-2">
              <h3 className="text-sm font-bold uppercase tracking-widest text-rak-magenta font-mono">
                Frequently Asked Questions
              </h3>
              <p className="text-xs text-slate-500 dark:text-rak-slate-400 mt-1">
                Everything you need to know about partnering with our digital marketing and creative agency in Lebanon.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                const panelId = `faq-panel-${faq.id || idx}`;
                const btnId = `faq-btn-${faq.id || idx}`;
                return (
                  <div
                    key={faq.id || idx}
                    className={`rounded-2xl border transition-colors ${
                      isOpen
                        ? 'bg-slate-50 dark:bg-rak-slate-950/90 border-rak-magenta/40'
                        : 'bg-slate-50/60 dark:bg-rak-slate-950/50 border-slate-200 dark:border-white/10 hover:border-rak-magenta/30'
                    }`}
                  >
                    <h4 className="m-0">
                      <button
                        id={btnId}
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                        className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-slate-900 dark:text-white cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta rounded-2xl"
                      >
                        <span className="leading-snug">{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-rak-magenta shrink-0 transition-transform duration-200 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </h4>
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      hidden={!isOpen}
                      className={isOpen ? 'px-5 pb-4 pt-0' : 'hidden'}
                    >
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LebanonDigitalMarketingFaqSection;

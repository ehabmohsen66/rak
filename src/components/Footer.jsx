import React from 'react';
import { BrandLogo } from './BrandLogo';
import { ArrowUp, Mail, MapPin, Shield } from 'lucide-react';
import { useCms } from '../lib/cmsContext';
import { formatWhatsAppHref, getActiveSocialLinks, WhatsAppIcon } from '../lib/socialLinks';

export const Footer = ({ 
  setActiveTab = () => {}, 
  onOpenProjectPlanner = () => {}, 
  onOpenPlanner = onOpenProjectPlanner 
}) => {
  const { content } = useCms();
  const offices = content.offices || [];
  const brandInfo = content.brandInfo || {};
  const whatsappHref = formatWhatsAppHref(brandInfo.whatsapp);
  const socialLinks = getActiveSocialLinks(brandInfo);

  return (
    <footer className="bg-rak-slate-950 border-t border-white/10 text-slate-300 relative overflow-hidden transition-colors duration-300">
      
      <div className="pointer-events-none absolute -top-32 left-1/4 w-[480px] h-[220px] bg-rak-magenta/10 rounded-full blur-[130px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[380px] h-[180px] bg-rak-magenta/5 rounded-full blur-[110px]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10 space-y-14">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Column 1: Brand Info */}
          <div className="md:col-span-6 lg:col-span-5 space-y-4">
            <a 
              href="/"
              onClick={(e) => { e.preventDefault(); setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta rounded-lg"
            >
              <BrandLogo className="h-10 sm:h-11 w-auto" variant="white" />
            </a>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              {brandInfo.description || 'RAK 4 CREATIVE is a full-service global brand identity and digital product engineering agency.'}
            </p>
            <div className="space-y-2 pt-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-rak-magenta">
                <Mail className="w-4 h-4 shrink-0" />
                <a href={`mailto:${brandInfo.contactEmail || 'hello@rak4creative.com'}`} className="hover:underline">
                  {brandInfo.contactEmail || 'hello@rak4creative.com'}
                </a>
              </div>
              {whatsappHref && (
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <WhatsAppIcon className="w-4 h-4 shrink-0" />
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              )}
            </div>
            {socialLinks.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {socialLinks.map(({ id, label, href, Icon }) => (
                  <a
                    key={id}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="w-9 h-9 rounded-xl bg-white/5 hover:bg-rak-magenta border border-white/10 hover:border-rak-magenta text-slate-300 hover:text-white flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Navigation */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Navigation
            </h3>
            <ul className="space-y-2 text-xs">
              {['home', 'about', 'services', 'work', 'case-studies', 'careers', 'blog', 'contact'].map((tab) => (
                <li key={tab}>
                  <a
                    href={tab === 'home' ? '/' : `/${tab}`}
                    onClick={(e) => { e.preventDefault(); setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-rak-magenta transition-colors capitalize text-slate-300 inline-block py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta rounded"
                  >
                    {tab.replace('-', ' ')}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Global Offices */}
          <div className="md:col-span-3 lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-widest">
              Global Offices
            </h3>
            <div className="space-y-3 text-xs">
              {offices.map((office) => (
                <div key={office.city} className="space-y-1">
                  <div className="flex items-center space-x-2 font-bold text-white">
                    <MapPin className="w-3.5 h-3.5 text-rak-magenta shrink-0" />
                    <span>{office.city}, {office.country}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-5 leading-tight">{office.address}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {brandInfo.name || 'RAK 4 CREATIVE'}. All Rights Reserved.
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="/admin"
              rel="nofollow"
              onClick={(e) => { e.preventDefault(); setActiveTab('admin', '/admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="inline-flex items-center space-x-1.5 text-slate-300 hover:text-rak-magenta transition-colors cursor-pointer font-mono text-[11px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta rounded px-1"
            >
              <Shield className="w-3.5 h-3.5 text-rak-magenta" />
              <span>CMS Portal</span>
            </a>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center space-x-1.5 text-slate-300 hover:text-rak-magenta font-mono uppercase tracking-wider text-[11px] font-bold transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rak-magenta rounded px-1"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

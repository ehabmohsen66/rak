import React, { useEffect } from 'react';
import { Clock, Calendar, ArrowLeft, ArrowUpRight, Share2, Sparkles, BookOpen, CheckCircle2 } from 'lucide-react';
import { BLOG_POSTS } from '../data/contentData';
import SpotlightCard from '../components/SpotlightCard';

export const BlogPostPage = ({ 
  slug, 
  onNavigate = () => {},
  onOpenPlanner = () => {}
}) => {
  const article = BLOG_POSTS.find(p => p.id === slug) || BLOG_POSTS[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!article) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 px-4 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Article Not Found</h1>
        <p className="text-slate-500 text-sm">The editorial insight you are looking for does not exist.</p>
        <button
          onClick={() => onNavigate('blog', '/blog')}
          className="px-6 py-3 rounded-full bg-rak-magenta text-white font-bold text-xs uppercase tracking-widest hover:bg-rak-magenta-dark transition-all"
        >
          Back to All Articles
        </button>
      </div>
    );
  }

  const relatedArticles = BLOG_POSTS.filter(p => p.id !== article.id).slice(0, 3);

  // Format content paragraphs
  const renderFormattedContent = (rawContent) => {
    if (!rawContent) return null;
    const lines = rawContent.split('\n\n');
    return lines.map((paragraph, index) => {
      const trimmed = paragraph.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-8 mb-4 tracking-tight">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').filter(l => l.trim().startsWith('- '));
        return (
          <ul key={index} className="space-y-2.5 my-4 pl-4 border-l-2 border-rak-magenta/40">
            {items.map((item, i) => (
              <li key={i} className="text-slate-700 dark:text-rak-slate-300 text-sm leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: item.replace(/^- \*\*(.*?)\*\*:/, '<strong class="text-slate-900 dark:text-white font-bold">$1:</strong>') }} />
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-slate-700 dark:text-rak-slate-300 text-sm sm:text-base leading-relaxed mb-4">
          <span dangerouslySetInnerHTML={{ 
            __html: trimmed
              .replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-900 dark:text-white font-bold">$1</strong>')
              .replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-rak-slate-800 text-rak-magenta font-mono text-xs">$1</code>')
          }} />
        </p>
      );
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // cancelled
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Article link copied to clipboard!');
    }
  };

  return (
    <article className="min-h-screen pt-28 sm:pt-36 pb-20 bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* Top Breadcrumb & Actions */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('blog', '/blog')}
            className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-rak-slate-400 hover:text-rak-magenta transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>All Articles</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-rak-slate-900 border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-700 dark:text-rak-slate-300 hover:text-rak-magenta hover:border-rak-magenta/40 transition-all shadow-sm cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Main Article Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3.5 py-1 bg-rak-magenta/10 border border-rak-magenta/30 text-rak-magenta text-xs font-bold uppercase tracking-widest rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-rak-slate-400 flex items-center space-x-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-rak-magenta" />
              <span>{article.readTime}</span>
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 dark:text-rak-slate-400 flex items-center space-x-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-rak-magenta" />
              <span>{article.date}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.12]">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-lg sm:text-xl text-slate-600 dark:text-rak-slate-300 leading-relaxed font-normal">
              {article.subtitle}
            </p>
          )}

          {/* Author Card */}
          <div className="flex items-center space-x-3.5 pt-4 pb-2 border-y border-slate-200/80 dark:border-white/10">
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-rak-magenta to-purple-600 text-white flex items-center justify-center font-black text-xs shadow-md">
              RAK
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">
                {typeof article.author === 'string' ? article.author : article.author?.name}
              </div>
              <div className="text-xs text-slate-500 dark:text-rak-slate-400">
                Editorial Practice • RAK 4 CREATIVE
              </div>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 h-72 sm:h-[450px] bg-slate-950">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Excerpt Callout */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rak-magenta/10 via-purple-500/5 to-transparent border-l-4 border-rak-magenta text-slate-800 dark:text-slate-100 font-medium text-base sm:text-lg leading-relaxed shadow-sm">
          {article.excerpt}
        </div>

        {/* Article Body Content */}
        <div className="prose dark:prose-invert max-w-none text-slate-800 dark:text-rak-slate-200">
          {renderFormattedContent(article.content)}
        </div>

        {/* Bottom CTA Card */}
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-rak-slate-950 to-slate-900 border border-white/10 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 my-12">
          <div className="space-y-2 max-w-md">
            <span className="text-[10px] font-mono font-bold tracking-widest text-rak-magenta uppercase">
              STRATEGIC EXECUTION
            </span>
            <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Ready to implement these insights in your business?
            </h3>
            <p className="text-xs text-rak-slate-300">
              Our strategy & digital product team builds high-growth solutions tailored to your market.
            </p>
          </div>

          <button
            onClick={onOpenPlanner}
            className="px-7 py-3.5 rounded-full bg-rak-magenta hover:bg-rak-magenta-dark text-white font-extrabold text-xs uppercase tracking-widest transition-all duration-300 shadow-md hover:scale-105 shrink-0 flex items-center space-x-2"
          >
            <span>Start a Project</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Related Articles Grid */}
        {relatedArticles.length > 0 && (
          <section className="space-y-6 pt-12 border-t border-slate-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Related Editorial
              </h2>
              <button
                onClick={() => onNavigate('blog', '/blog')}
                className="text-xs font-bold uppercase tracking-widest text-rak-magenta hover:underline"
              >
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((rel) => (
                <SpotlightCard
                  key={rel.id}
                  spotlightColor="rgba(236, 0, 140, 0.1)"
                  borderColor="rgba(226, 232, 240, 0.8)"
                  onClick={() => onNavigate('blog-post', `/blog/${rel.id}`)}
                  className="group cursor-pointer p-0 bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between shadow-sm hover:border-rak-magenta/40 transition-all duration-300"
                >
                  <div>
                    <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-rak-slate-950">
                      <img
                        src={rel.image}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <span className="text-[10px] font-bold text-rak-magenta uppercase tracking-wider block">
                        {rel.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-rak-magenta transition-colors line-clamp-2 leading-snug">
                        {rel.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between text-[11px] font-bold text-rak-magenta">
                    <span>Read Article</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </section>
        )}

      </div>

    </article>
  );
};

export default BlogPostPage;

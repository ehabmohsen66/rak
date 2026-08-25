import React, { useEffect } from 'react';
import { X, Clock, Calendar, User, Share2, ArrowLeft } from 'lucide-react';

export const ArticleModal = ({ article, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-[110] overflow-y-auto bg-slate-950/60 dark:bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 sm:py-10 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-rak-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl text-slate-900 dark:text-rak-slate-100 max-h-[88vh] flex flex-col my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-200 dark:border-white/10 bg-slate-50/90 dark:bg-rak-slate-950/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 bg-rak-magenta/10 border border-rak-magenta/30 text-rak-magenta text-[10px] font-bold uppercase tracking-widest rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-slate-500 dark:text-rak-slate-400 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-rak-magenta" />
              <span>{article.readTime}</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2.5 rounded-full bg-slate-200/80 dark:bg-rak-slate-800 hover:bg-rak-magenta text-slate-700 dark:text-rak-slate-300 hover:text-white transition-all cursor-pointer shadow-sm hover:scale-105 shrink-0"
            aria-label="Close article"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
            {article.title}
          </h1>

          <div className="flex items-center space-x-4 pb-6 border-b border-slate-200 dark:border-white/10">
            <div className="w-10 h-10 rounded-full bg-rak-magenta/10 border border-rak-magenta/30 text-rak-magenta flex items-center justify-center font-bold text-xs">
              RAK
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">{typeof article.author === 'string' ? article.author : article.author?.name}</div>
              <div className="text-[11px] text-slate-500 dark:text-rak-slate-400">{article.date}</div>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-sm">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-slate-700 dark:text-rak-slate-300 space-y-4 leading-relaxed">
            <p className="text-base text-slate-800 dark:text-rak-slate-200 font-medium italic border-l-2 border-rak-magenta pl-4 py-1">
              {article.excerpt}
            </p>
            <div dangerouslySetInnerHTML={{ __html: typeof article.content === 'string' ? article.content.replace(/\n/g, '<br/>') : '' }} />
          </div>

          <div className="pt-6 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
            <button
              onClick={onClose}
              className="inline-flex items-center space-x-2 text-xs font-bold text-slate-600 dark:text-rak-slate-400 hover:text-rak-magenta transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ArticleModal;

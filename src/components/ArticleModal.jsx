import React from 'react';
import { X, Clock, Calendar, User, Share2, ArrowLeft } from 'lucide-react';

export const ArticleModal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-rak-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-rak-slate-900 border border-rak-slate-800 rounded-3xl overflow-hidden shadow-2xl text-rak-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rak-slate-800 bg-rak-slate-950/60 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <span className="px-2.5 py-1 bg-rak-magenta/20 border border-rak-magenta/40 text-rak-magenta text-[10px] font-bold uppercase tracking-widest rounded-full">
              {article.category}
            </span>
            <span className="text-xs text-rak-slate-400 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{article.readTime}</span>
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-rak-slate-800 hover:bg-rak-magenta text-rak-slate-300 hover:text-white transition-colors"
            aria-label="Close article"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 sm:p-10 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center space-x-4 pb-6 border-b border-rak-slate-800">
            <div className="w-10 h-10 rounded-full bg-rak-magenta/20 border border-rak-magenta text-rak-magenta flex items-center justify-center font-bold text-xs">
              RAK
            </div>
            <div>
              <div className="text-xs font-bold text-white">{typeof article.author === 'string' ? article.author : article.author?.name}</div>
              <div className="text-[11px] text-rak-slate-400">{article.date}</div>
            </div>
          </div>

          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
          </div>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-rak-slate-300 space-y-4 leading-relaxed">
            <p className="text-base text-rak-slate-200 font-medium italic border-l-2 border-rak-magenta pl-4 py-1">
              {article.excerpt}
            </p>
            <div dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }} />
          </div>

          <div className="pt-6 border-t border-rak-slate-800 flex items-center justify-between">
            <button
              onClick={onClose}
              className="inline-flex items-center space-x-2 text-xs font-bold text-rak-slate-400 hover:text-rak-magenta transition-colors"
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

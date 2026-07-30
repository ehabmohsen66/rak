import React, { useState } from 'react';
import { Sparkles, Search, Clock, ArrowUpRight, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '../data/contentData';

export const BlogPage = ({ onSelectArticle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Design Architecture', 'Growth & CRO', 'Engineering'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];

  return (
    <div className="pt-24 pb-16 space-y-16">
      
      {/* BLOG HERO HEADER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-rak-slate-800 bg-rak-slate-950 p-8 sm:p-14 overflow-hidden shadow-2xl space-y-8">
          <div className="space-y-6 text-left relative z-10 max-w-3xl">
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 bg-rak-slate-900/90 border border-rak-magenta/40 text-rak-magenta rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md shadow-magenta-sm">
              <Sparkles className="w-3.5 h-3.5 text-rak-magenta" />
              <span>Executive Editorial & Insights</span>
            </span>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight uppercase leading-tight">
              Thought Leadership in <span className="text-gradient-magenta">Design & Tech.</span>
            </h1>

            <p className="text-base sm:text-lg text-rak-slate-300 leading-relaxed font-normal">
              In-depth architectural analysis, CRO conversion playbooks, and front-end performance strategies written by our senior directors.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-rak-slate-800/80 relative z-10">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-rak-slate-500 absolute left-4 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search executive articles..."
                className="w-full pl-11 pr-4 py-3 text-xs bg-rak-slate-900/90 border border-rak-slate-700/80 rounded-full text-white placeholder-rak-slate-500 focus:outline-none focus:border-rak-magenta backdrop-blur-md"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-rak-magenta text-white shadow-magenta-glow scale-105'
                      : 'bg-rak-slate-900/90 border border-rak-slate-800 text-rak-slate-300 hover:border-rak-magenta/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED POST */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            onClick={() => onSelectArticle(featuredPost)}
            className="group cursor-pointer p-8 sm:p-12 bg-rak-slate-900/80 border border-rak-slate-800 rounded-3xl hover:border-rak-magenta/50 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-6 relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-rak-slate-950">
              <img src={featuredPost.image} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-rak-magenta text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
                Featured Executive Brief
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center space-x-3 text-xs text-rak-slate-400">
                <span className="text-rak-magenta font-bold uppercase tracking-wider">{featuredPost.category}</span>
                <span>•</span>
                <span className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{featuredPost.readTime}</span></span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-white group-hover:text-rak-magenta transition-colors">
                {featuredPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-rak-slate-300 leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-rak-magenta/20 border border-rak-magenta text-rak-magenta flex items-center justify-center font-bold text-[10px]">
                  RAK
                </div>
                <span className="text-xs font-bold text-white">
                  {typeof featuredPost.author === 'string' ? featuredPost.author : featuredPost.author?.name}
                </span>
                <span className="text-xs text-rak-slate-500">• {featuredPost.date}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ARTICLE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <div 
              key={post.id}
              onClick={() => onSelectArticle(post)}
              className="group cursor-pointer p-6 bg-rak-slate-900/60 border border-rak-slate-800 rounded-3xl hover:border-rak-magenta/50 transition-all space-y-4"
            >
              <div className="relative h-48 rounded-2xl overflow-hidden bg-rak-slate-950">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-rak-slate-400">
                  <span className="text-rak-magenta font-bold uppercase tracking-wider">{post.category}</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-white group-hover:text-rak-magenta transition-colors leading-tight">
                  {post.title}
                </h3>

                <p className="text-xs text-rak-slate-400 line-clamp-2">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default BlogPage;

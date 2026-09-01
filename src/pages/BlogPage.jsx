import React, { useState, useRef } from 'react';
import { Search, Clock } from 'lucide-react';
import { BLOG_POSTS } from '../data/contentData';
import { BlogHeroSpline } from '../components/BlogHeroSpline';

export const BlogPage = ({ onSelectArticle }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const articlesRef = useRef(null);

  const categories = ['All', 'Design Architecture', 'Growth & CRO', 'Engineering'];

  const filteredPosts = BLOG_POSTS.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = BLOG_POSTS.find(p => p.featured) || BLOG_POSTS[0];

  const handleScrollToArticles = () => {
    articlesRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pb-16 space-y-16 bg-slate-50 dark:bg-rak-slate-950 text-slate-900 dark:text-white transition-colors duration-300">
      
      {/* 3D SPLINE HERO */}
      <BlogHeroSpline onExploreClick={handleScrollToArticles} />

      {/* SEARCH & CATEGORY FILTERS */}
      <section ref={articlesRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-6 bg-white dark:bg-rak-slate-950 border border-slate-200 dark:border-rak-slate-800 rounded-3xl shadow-sm backdrop-blur-xl">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 dark:text-rak-slate-500 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search executive articles..."
              className="w-full pl-11 pr-4 py-3 text-xs bg-slate-50 dark:bg-rak-slate-900/90 border border-slate-200 dark:border-rak-slate-700/80 rounded-full text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-rak-slate-500 focus:outline-none focus:border-rak-magenta focus:ring-1 focus:ring-rak-magenta transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 text-[11px] font-bold uppercase tracking-wider rounded-full transition-all duration-300 cursor-pointer font-mono ${
                  selectedCategory === cat
                    ? 'bg-rak-magenta text-white shadow-magenta-glow scale-105'
                    : 'bg-slate-100 dark:bg-rak-slate-900/90 border border-slate-200 dark:border-rak-slate-800 text-slate-700 dark:text-rak-slate-300 hover:border-rak-magenta/40 hover:text-rak-magenta'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED POST */}
      {featuredPost && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            onClick={() => onSelectArticle(featuredPost)}
            className="group cursor-pointer p-8 sm:p-12 bg-white dark:bg-rak-slate-900/80 border border-slate-200 dark:border-rak-slate-800 rounded-3xl hover:border-rak-magenta/50 transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm hover:shadow-md backdrop-blur-xl"
          >
            <div className="lg:col-span-6 relative h-72 sm:h-96 rounded-2xl overflow-hidden bg-slate-100 dark:bg-rak-slate-950">
              <img src={featuredPost.image} alt={featuredPost.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95" />
              <div className="absolute top-4 left-4 px-3 py-1 bg-rak-magenta text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-magenta-sm font-mono">
                Featured Executive Brief
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-center space-x-3 text-xs text-slate-500 dark:text-rak-slate-400">
                <span className="text-rak-magenta font-bold uppercase tracking-wider font-mono">{featuredPost.category}</span>
                <span>•</span>
                <span className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{featuredPost.readTime}</span></span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white group-hover:text-rak-magenta transition-colors font-heading">
                {featuredPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-rak-slate-300 leading-relaxed">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center space-x-3 pt-2">
                <div className="w-8 h-8 rounded-full bg-rak-magenta/10 dark:bg-rak-magenta/20 border border-rak-magenta text-rak-magenta flex items-center justify-center font-bold text-[10px]">
                  RAK
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {typeof featuredPost.author === 'string' ? featuredPost.author : featuredPost.author?.name}
                </span>
                <span className="text-xs text-slate-400 dark:text-rak-slate-500">• {featuredPost.date}</span>
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
              className="group cursor-pointer p-6 bg-white dark:bg-rak-slate-900/60 border border-slate-200 dark:border-rak-slate-800 rounded-3xl hover:border-rak-magenta/50 transition-all space-y-4 shadow-sm hover:shadow-md backdrop-blur-xl"
            >
              <div className="relative h-48 rounded-2xl overflow-hidden bg-slate-100 dark:bg-rak-slate-950">
                <img src={post.image} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-rak-slate-400">
                  <span className="text-rak-magenta font-bold uppercase tracking-wider font-mono">{post.category}</span>
                  <span className="font-mono">{post.readTime}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-rak-magenta transition-colors leading-tight font-heading">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-rak-slate-400 line-clamp-2">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default BlogPage;

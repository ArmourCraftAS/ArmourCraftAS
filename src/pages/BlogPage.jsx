import React, { useState, useEffect, useMemo } from 'react'
import { ArrowRight, ChevronRight, X, Clock, Calendar, User, BookOpen } from 'lucide-react'
import { initialBlogs, getSortedBlogs, getStoredBlogs } from '../data/blogsData'
import WhatsAppCalloutBanner from '../components/WhatsAppCalloutBanner'
import { supabase } from '../../lib/supabaseClient'
import { useCmsContent } from '../admin/cmsStore'

export default function BlogPage({ onNavigate }) {
  const latestInsightsHeading = useCmsContent('blog.latestInsightsHeading', 'LATEST INSIGHTS')
  const [blogsList, setBlogsList] = useState(() => getStoredBlogs())
  const [viewAll, setViewAll] = useState(false)
  const [activeArticle, setActiveArticle] = useState(null)

  useEffect(() => {
    // 1. Sync on custom live update event
    const handleUpdate = (e) => {
      if (Array.isArray(e.detail) && e.detail.length > 0) {
        setBlogsList(e.detail)
      }
    }
    window.addEventListener('armourcraft:blogs-updated', handleUpdate)

    // 2. Fetch from Supabase
    async function fetchFromSupabase() {
      try {
        if (supabase && typeof supabase.from === 'function') {
          const { data, error } = await supabase
            .from('blogs')
            .select('*')
            .order('created_at', { ascending: false })

          if (!error && Array.isArray(data) && data.length > 0) {
            setBlogsList(data)
          }
        }
      } catch (err) {
        console.info('BlogPage fetch notice:', err?.message || err)
      }
    }
    fetchFromSupabase()

    return () => window.removeEventListener('armourcraft:blogs-updated', handleUpdate)
  }, [])

  // Dynamically sort blogs by date / createdAt descending
  const sortedBlogs = useMemo(() => {
    return getSortedBlogs(blogsList)
  }, [blogsList])

  // Featured post is always the latest/newest post (index 0)
  const featuredBlog = sortedBlogs[0]

  // Remaining posts for LATEST INSIGHTS grid
  const remainingBlogs = useMemo(() => {
    return sortedBlogs.slice(1)
  }, [sortedBlogs])

  // Initial state: display next 3 posts. View all: display all remaining posts.
  const displayedGridBlogs = useMemo(() => {
    return viewAll ? remainingBlogs : remainingBlogs.slice(0, 3)
  }, [viewAll, remainingBlogs])

  const handleOpenBlog = (blog) => {
    if (onNavigate) {
      onNavigate(`/blog/${blog.slug || blog.id}`)
    } else {
      setActiveArticle(blog)
    }
  }

  return (
    <div className="w-full bg-[#060a12] text-white min-h-[calc(100vh-80px)] py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* ========================================================================= */}
        {/* 1. FEATURED / MOST RECENT BLOG BANNER (TOP SECTION)                       */}
        {/* ========================================================================= */}
        {featuredBlog && (
          <section
            aria-label="Featured Story"
            data-dynamic-type="blog"
            data-dynamic-id={featuredBlog.id}
            data-dynamic-title={featuredBlog.title}
            className="relative w-full rounded-2xl sm:rounded-3xl bg-[#0c1527] border border-slate-800/80 p-5 sm:p-7 lg:p-9 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300"
          >
            {/* Subtle atmospheric ambient glow */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />
            <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch">
              
              {/* Left Side: High-Resolution Featured Image */}
              <div className="lg:col-span-6 flex items-center justify-center">
                <div
                  onClick={() => handleOpenBlog(featuredBlog)}
                  className="w-full h-full min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#070b14] border border-slate-800/80 shadow-2xl group cursor-pointer relative"
                >
                  <img
                    src={featuredBlog.image}
                    alt={featuredBlog.title}
                    className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                </div>
              </div>

              {/* Right Side: Title, Excerpt, and Electric Blue Button */}
              <div className="lg:col-span-6 flex flex-col justify-center py-2 sm:py-4">
                
                {/* Category Pill / Date */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {featuredBlog.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredBlog.readTime}
                  </span>
                </div>

                {/* Main Heading */}
                <h1
                  onClick={() => handleOpenBlog(featuredBlog)}
                  className="text-2xl sm:text-3xl lg:text-[38px] font-black text-white leading-[1.18] tracking-tight mb-5 hover:text-blue-400 transition-colors cursor-pointer"
                >
                  {featuredBlog.title}
                </h1>

                {/* Excerpt */}
                <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8 font-normal max-w-xl">
                  {featuredBlog.excerpt}
                </p>

                {/* Electric Blue Action Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleOpenBlog(featuredBlog)}
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-lg bg-[#1462ea] hover:bg-[#1a6df6] active:bg-blue-700 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 cursor-pointer"
                  >
                    <span>READ FULL GUIDE</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

              </div>

            </div>
          </section>
        )}

        {/* ========================================================================= */}
        {/* 2. 'LATEST INSIGHTS' GRID SECTION                                         */}
        {/* ========================================================================= */}
        <section aria-label="Latest Insights" className="w-full">
          
          {/* Header Row: Title on Left, Horizontal Line, and VIEW ALL > on Right */}
          <div className="flex items-center justify-between mb-8 sm:mb-10">
            <h2
              data-cms-path="blog.latestInsightsHeading"
              data-cms-label="Latest Insights Heading"
              className="text-lg sm:text-xl font-black text-white uppercase tracking-wider shrink-0"
            >
              {latestInsightsHeading}
            </h2>

            {/* Subtle Divider Line */}
            <div className="hidden sm:block flex-1 mx-6 h-[1px] bg-slate-800/80" />

            {/* Clickable VIEW ALL > Link */}
            <button
              type="button"
              onClick={() => setViewAll((prev) => !prev)}
              className="text-xs sm:text-sm font-bold text-slate-400 hover:text-white uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors group"
            >
              <span>{viewAll ? 'SHOW LESS' : 'VIEW ALL'}</span>
              <ChevronRight className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform ${viewAll ? 'rotate-90' : ''}`} />
            </button>
          </div>

          {/* 3-Column Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {displayedGridBlogs.map((blog) => (
              <article
                key={blog.id}
                data-dynamic-type="blog"
                data-dynamic-id={blog.id}
                data-dynamic-title={blog.title}
                onClick={() => handleOpenBlog(blog)}
                className="bg-[#0c1527] border border-slate-800/80 hover:border-slate-700 rounded-2xl overflow-hidden shadow-xl flex flex-col group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-blue-900/10"
              >
                {/* Card Image Container */}
                <div className="w-full aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-[#070b14] relative">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#060a12]/80 backdrop-blur-md text-blue-300 border border-slate-700/60">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Card Content Container */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Card Title */}
                    <h3 className="text-base sm:text-lg font-bold text-white leading-snug mb-3 group-hover:text-blue-400 transition-colors">
                      {blog.title}
                    </h3>

                    {/* Card Excerpt */}
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal line-clamp-3 mb-4">
                      {blog.excerpt}
                    </p>
                  </div>

                  {/* Card Footer: Date & Read Time */}
                  <div className="pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                    <span>{blog.date}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {blog.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </section>

        {/* ========================================================================= */}
        {/* 3. WHATSAPP SIZING & BULK ASSISTANCE BANNER (ABOVE FOOTER)                */}
        {/* ========================================================================= */}
        <WhatsAppCalloutBanner />

      </div>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE ARTICLE READING MODAL                                      */}
      {/* ========================================================================= */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-3xl max-h-[90vh] bg-[#0c1527] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-[#080e1b]">
              <div className="flex items-center gap-2 text-xs text-blue-400 font-bold uppercase tracking-wider">
                <BookOpen className="w-4 h-4" />
                <span>{activeArticle.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="w-full aspect-[16/9] rounded-xl overflow-hidden bg-[#070b14] border border-slate-800">
                <img
                  src={activeArticle.image}
                  alt={activeArticle.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mb-3">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-400" />
                    {activeArticle.author}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    {activeArticle.date}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    {activeArticle.readTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
                  {activeArticle.title}
                </h2>

                <p className="text-base text-blue-200/90 font-medium leading-relaxed italic border-l-2 border-blue-500 pl-4 py-1 mb-6 bg-blue-950/20 rounded-r-lg">
                  {activeArticle.excerpt}
                </p>

                <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                  {activeArticle.content && activeArticle.content.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-[#080e1b] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveArticle(null)}
                className="px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

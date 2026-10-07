import React, { useEffect } from 'react'
import { ArrowLeft, Clock, Calendar, User, Tag, Share2, ArrowRight } from 'lucide-react'
import { getBlogBySlug, initialBlogs } from '../data/blogsData'

export default function BlogDetailPage({ slug, onNavigate }) {
  const blog = getBlogBySlug(slug)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  if (!blog) {
    return (
      <div className="w-full bg-[#060a12] text-white min-h-[calc(100vh-80px)] py-20 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl sm:text-4xl font-black mb-4">Article Not Found</h1>
        <p className="text-slate-400 text-base mb-8 max-w-md">
          The cricket protection insight you are looking for may have been moved or updated.
        </p>
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('/blog')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1462ea] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Insights</span>
        </button>
      </div>
    )
  }

  // Related articles (excluding current)
  const relatedBlogs = initialBlogs.filter((b) => b.id !== blog.id).slice(0, 3)

  return (
    <div className="w-full bg-[#060a12] text-white min-h-[calc(100vh-80px)] py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* ========================================================================= */}
        {/* 1. TOP NAVIGATION LINK: ← Back to Insights                                */}
        {/* ========================================================================= */}
        <div className="mb-6 sm:mb-8">
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('/blog')}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium tracking-wide">Back to Insights</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* 2. ARTICLE HEADER SECTION                                                 */}
        {/* ========================================================================= */}
        <header className="mb-8 sm:mb-10">
          
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-white leading-[1.16] tracking-tight mb-4 max-w-4xl">
            {blog.title}
          </h1>

          {/* Subtitle / Excerpt */}
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-3xl font-normal mb-6">
            {blog.subtitle || blog.excerpt}
          </p>

          {/* Metadata Strip */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-400 pt-4 border-t border-slate-800/80">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider text-[11px]">
              <Tag className="w-3 h-3" />
              {blog.category}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              {blog.author}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {blog.date}
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {blog.readTime}
            </span>
          </div>

        </header>

        {/* ========================================================================= */}
        {/* 3. FEATURED IMAGE BANNER                                                  */}
        {/* ========================================================================= */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#0c1527] border border-slate-800/80 shadow-2xl mb-12 sm:mb-16">
          <div className="aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden relative">
            <img
              src={blog.detailHeroImage || blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#060a12]/70 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. BODY CONTENT SECTION                                                   */}
        {/* ========================================================================= */}
        <article className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
          {blog.sections && blog.sections.length > 0 ? (
            blog.sections.map((sec, sIdx) => (
              <section key={sIdx} className="space-y-4">
                <h2 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-white tracking-tight leading-snug">
                  {sec.heading}
                </h2>
                <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>
              </section>
            ))
          ) : (
            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              {blog.content && blog.content.map((p, pIdx) => (
                <p key={pIdx}>{p}</p>
              ))}
            </div>
          )}
        </article>

        {/* ========================================================================= */}
        {/* 5. FOOTER NAVIGATION STRIP & MORE INSIGHTS                                */}
        {/* ========================================================================= */}
        <div className="mt-16 pt-10 border-t border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider">
              More Protection Insights
            </h3>
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('/blog')}
              className="text-xs sm:text-sm font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onNavigate && onNavigate(`/blog/${rel.slug || rel.id}`)}
                className="bg-[#0c1527] border border-slate-800/80 hover:border-slate-700 rounded-xl overflow-hidden p-4 group cursor-pointer transition-all duration-200"
              >
                <div className="w-full aspect-[16/9] rounded-lg overflow-hidden mb-3 bg-[#070b14]">
                  <img
                    src={rel.image}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-sm font-bold text-white line-clamp-2 group-hover:text-blue-400 transition-colors mb-2">
                  {rel.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {rel.excerpt}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

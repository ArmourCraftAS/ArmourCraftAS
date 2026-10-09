import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ArrowRight,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  BookOpen,
  Image as ImageIcon
} from 'lucide-react'
import { initialBlogs } from '../../data/blogsData'
import { supabase } from '../../../lib/supabaseClient'

const BLOGS_STORAGE_KEY = 'armourcraft_admin_blogs_v1'

export default function AdminBlogsPage({ onNavigate }) {
  // 1. Blogs State initialized from localStorage or initialBlogs
  const [blogs, setBlogs] = useState(() => {
    if (typeof window === 'undefined') return initialBlogs
    try {
      const saved = window.localStorage.getItem(BLOGS_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.warn('Error loading admin blogs from storage:', e)
    }
    return initialBlogs
  })

  // Persist blogs to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(BLOGS_STORAGE_KEY, JSON.stringify(blogs))
    } catch (e) {
      console.warn('Error saving admin blogs:', e)
    }
  }, [blogs])

  // 2. Modals & Actions State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [deleteConfirmBlog, setDeleteConfirmBlog] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [readingBlog, setReadingBlog] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  // 3. Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    category: 'Impact Science',
    author: 'ArmourCraft Protection Lab',
    readTime: '5 min read',
    image: '/images/blog_featured_batsman.jpg',
    content: ''
  })

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type })
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Derived: Featured Hero Blog (first item) and Latest Insights Grid (rest)
  const featuredBlog = blogs[0] || null
  const gridBlogs = blogs.slice(1)

  // Handlers for Add / Edit
  const handleOpenAddModal = () => {
    setEditingBlog(null)
    setFormData({
      title: '',
      excerpt: '',
      category: 'Impact Science',
      author: 'ArmourCraft Protection Lab',
      readTime: '5 min read',
      image: '/images/blog_featured_batsman.jpg',
      content: ''
    })
    setIsAddEditModalOpen(true)
  }

  const handleOpenEditModal = (blog) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title || '',
      excerpt: blog.excerpt || blog.subtitle || '',
      category: blog.category || 'Impact Science',
      author: blog.author || 'ArmourCraft Protection Lab',
      readTime: blog.readTime || '5 min read',
      image: blog.image || '/images/blog_featured_batsman.jpg',
      content: Array.isArray(blog.content) ? blog.content.join('\n\n') : (blog.content || '')
    })
    setIsAddEditModalOpen(true)
  }

  const handleSaveBlog = async (e) => {
    e.preventDefault()
    const trimmedTitle = formData.title.trim()
    if (!trimmedTitle) return

    const now = new Date()
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })

    const contentParagraphs = formData.content
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean)

    if (editingBlog) {
      // Update existing blog
      const updatedItem = {
        ...editingBlog,
        title: trimmedTitle,
        excerpt: formData.excerpt.trim(),
        subtitle: formData.excerpt.trim(),
        category: formData.category,
        author: formData.author,
        readTime: formData.readTime,
        image: formData.image,
        detailHeroImage: formData.image,
        content: contentParagraphs.length > 0 ? contentParagraphs : [formData.excerpt.trim()]
      }

      setBlogs((prev) => prev.map((b) => (b.id === editingBlog.id ? updatedItem : b)))

      // Sync Supabase
      try {
        if (supabase && typeof supabase.from === 'function') {
          await supabase.from('blogs').update(updatedItem).eq('id', editingBlog.id)
        }
      } catch (err) {
        console.info('Supabase blog update notice:', err?.message || err)
      }

      showToast(`Updated blog "${trimmedTitle}" successfully!`)
    } else {
      // Create new blog
      const newId = `blog-${Date.now()}`
      const slug = trimmedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      const newBlog = {
        id: newId,
        slug: slug || newId,
        title: trimmedTitle,
        subtitle: formData.excerpt.trim(),
        excerpt: formData.excerpt.trim(),
        category: formData.category,
        author: formData.author,
        readTime: formData.readTime,
        date: formattedDate,
        createdAt: now.toISOString(),
        image: formData.image || '/images/blog_featured_batsman.jpg',
        detailHeroImage: formData.image || '/images/blog_featured_batsman.jpg',
        content: contentParagraphs.length > 0 ? contentParagraphs : [formData.excerpt.trim()]
      }

      setBlogs((prev) => [newBlog, ...prev])

      // Sync Supabase
      try {
        if (supabase && typeof supabase.from === 'function') {
          await supabase.from('blogs').insert([newBlog])
        }
      } catch (err) {
        console.info('Supabase blog insert notice:', err?.message || err)
      }

      showToast(`Added "${trimmedTitle}" to blog catalog!`)
    }

    setIsAddEditModalOpen(false)
    setEditingBlog(null)
  }

  // Delete Blog
  const handleConfirmDelete = async () => {
    if (!deleteConfirmBlog) return
    setIsDeleting(true)
    const targetId = deleteConfirmBlog.id
    const targetTitle = deleteConfirmBlog.title

    setBlogs((prev) => prev.filter((b) => b.id !== targetId))

    try {
      if (supabase && typeof supabase.from === 'function') {
        await supabase.from('blogs').delete().eq('id', targetId)
      }
    } catch (err) {
      console.info('Supabase blog delete notice:', err?.message || err)
    }

    setIsDeleting(false)
    setDeleteConfirmBlog(null)
    showToast(`Deleted blog "${targetTitle}".`)
  }

  return (
    <div className="w-full min-h-screen bg-[#070b14] text-slate-100 font-sans p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* ========================================================================= */}
      {/* 1. TOP CONTROL BAR (image_5c7f69.jpg)                                      */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto flex items-center justify-end">
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1965eb] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-[0.98]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>ADD NEW BLOG</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* ========================================================================= */}
        {/* 2. FEATURED HERO BLOG CARD (image_5c7f69.jpg)                             */}
        {/* ========================================================================= */}
        {featuredBlog && (
          <div className="w-full bg-[#0c1322] border border-slate-800/80 rounded-3xl overflow-hidden shadow-2xl transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              
              {/* Left Cover Image */}
              <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto lg:min-h-[420px] overflow-hidden bg-slate-950">
                <img
                  src={featuredBlog.image}
                  alt={featuredBlog.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Right Content & Actions */}
              <div className="lg:col-span-6 p-7 sm:p-9 lg:p-11 flex flex-col justify-between relative bg-gradient-to-br from-[#0c1322] to-[#090e18]">
                
                {/* Floating Top-Right Action Circular Icons */}
                <div className="absolute top-6 right-6 flex items-center gap-2.5 z-10">
                  {/* Edit Pencil Icon (Blue) */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(featuredBlog)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1d63ed]/80 hover:bg-[#1d63ed] border border-blue-400/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm"
                    title="Edit Featured Blog"
                  >
                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                  </button>

                  {/* Delete Trash Icon (Red) */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmBlog(featuredBlog)}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#e11d48]/80 hover:bg-[#e11d48] border border-rose-400/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm"
                    title="Delete Featured Blog"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                  </button>
                </div>

                {/* Metadata & Title */}
                <div className="pr-16 space-y-4">
                  <h2 className="text-2xl sm:text-3xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    {featuredBlog.title}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-400 font-normal leading-relaxed">
                    {featuredBlog.excerpt || featuredBlog.subtitle}
                  </p>
                </div>

                {/* Bottom Action: READ FULL GUIDE -> */}
                <div className="pt-6">
                  <button
                    type="button"
                    onClick={() => setReadingBlog(featuredBlog)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1965eb] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <span>READ FULL GUIDE</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. LATEST INSIGHTS GRID SECTION (image_5c7f69.jpg)                        */}
        {/* ========================================================================= */}
        <div className="space-y-5">
          <h3 className="text-lg sm:text-xl font-black text-white tracking-wider uppercase">
            LATEST INSIGHTS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridBlogs.map((blog) => (
              <div
                key={blog.id}
                className="bg-[#0c1322] border border-slate-800/80 rounded-2xl overflow-hidden shadow-xl flex flex-col group hover:border-slate-700 transition-all duration-200"
              >
                {/* Cover Thumbnail with Top-Right Action Circular Icons */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950">
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Top-Right Floating Circular Action Buttons */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                    {/* Blue Edit Pencil */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleOpenEditModal(blog)
                      }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1d63ed]/80 hover:bg-[#1d63ed] border border-blue-400/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-sm hover:scale-105 active:scale-95"
                      title="Edit Blog"
                    >
                      <Edit2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2]" />
                    </button>

                    {/* Red Delete Trash */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setDeleteConfirmBlog(blog)
                      }}
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#e11d48]/80 hover:bg-[#e11d48] border border-rose-400/30 text-white flex items-center justify-center transition-all cursor-pointer shadow-lg backdrop-blur-sm hover:scale-105 active:scale-95"
                      title="Delete Blog"
                    >
                      <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.2]" />
                    </button>
                  </div>
                </div>

                {/* Card Body */}
                <div
                  className="p-5 sm:p-6 flex-1 flex flex-col justify-between cursor-pointer"
                  onClick={() => setReadingBlog(blog)}
                >
                  <div className="space-y-2.5">
                    <h4 className="text-base sm:text-lg font-bold text-white line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
                      {blog.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-3 leading-relaxed font-normal">
                      {blog.excerpt || blog.subtitle}
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 4. ADD / EDIT BLOG MODAL                                                  */}
      {/* ========================================================================= */}
      {isAddEditModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 md:p-8 bg-black/75 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsAddEditModalOpen(false)}
        >
          <div
            className="w-full max-w-2xl bg-[#0B0F17] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingBlog
                      ? 'Modify published article title, excerpt, and high-resolution cover.'
                      : 'Publish a new editorial insight or equipment analysis article.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveBlog} className="space-y-4">
              {/* Blog Title */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  BLOG TITLE *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Surviving 140+ KM/H Pace: EVA Foam Science"
                  className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Category & Read Time (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    CATEGORY
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Impact Science">Impact Science</option>
                    <option value="Maintenance & Care">Maintenance & Care</option>
                    <option value="Fit & Ergonomics">Fit & Ergonomics</option>
                    <option value="Custom Club Gear">Custom Club Gear</option>
                    <option value="Match Tactics">Match Tactics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    READ TIME
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Excerpt / Summary */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  EXCERPT / SHORT DESCRIPTION *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="A concise summary highlighting the article's core takeaway..."
                  className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Cover Image Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  COVER IMAGE URL
                </label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/blog_featured_batsman.jpg"
                  className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none font-mono"
                />

                {/* Quick Presets */}
                <div className="flex items-center gap-1.5 flex-wrap pt-2">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-1">
                    PRESETS:
                  </span>
                  {[
                    { label: 'Batsman Stadium', url: '/images/blog_featured_batsman.jpg' },
                    { label: 'Wash Straps', url: '/images/blog_wash_straps.jpg' },
                    { label: 'Strapping Stance', url: '/images/blog_thigh_strapping.jpg' },
                    { label: 'Custom Jersey', url: '/images/blog_custom_jersey.jpg' }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setFormData({ ...formData, image: p.url })}
                      className="px-2 py-0.5 rounded bg-[#0c1424] hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-400 hover:text-white cursor-pointer transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  ARTICLE BODY (SEPARATE PARAGRAPHS WITH DOUBLE ENTER)
                </label>
                <textarea
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the complete in-depth blog post here..."
                  className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800 mt-6">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#0c1424] hover:bg-[#131f38] border border-slate-700/60 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  {editingBlog ? 'Discard Changes' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1965eb] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 cursor-pointer transition-all active:scale-[0.98]"
                >
                  {editingBlog ? 'Save & Update Live' : 'Publish Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 5. DELETE BLOG CONFIRMATION MODAL                                         */}
      {/* ========================================================================= */}
      {deleteConfirmBlog && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setDeleteConfirmBlog(null)}
        >
          <div
            className="w-full max-w-md bg-[#0B0F17] border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-white relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3.5 mb-5">
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-500 stroke-[2.2]" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                Delete Blog Post
              </h3>
            </div>

            <p className="text-sm text-slate-300 font-normal leading-relaxed mb-5">
              Are you sure you want to delete the blog post{' '}
              <span className="font-bold text-white">“{deleteConfirmBlog.title}”</span>?
            </p>

            <div className="bg-[#221015] border border-rose-900/60 rounded-xl p-4 mb-6 flex items-start gap-3.5">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300 leading-relaxed font-normal">
                This action is permanent and cannot be undone. The post will be immediately removed from the live website and insights archive.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmBlog(null)}
                disabled={isDeleting}
                className="px-5 py-2.5 rounded-xl bg-[#131d31] hover:bg-[#1a2842] border border-slate-700/60 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f04438] hover:bg-rose-600 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 stroke-[2.2]" />
                <span>{isDeleting ? 'Deleting...' : 'Delete Blog'}</span>
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 6. READ FULL GUIDE PREVIEW MODAL                                          */}
      {/* ========================================================================= */}
      {readingBlog && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setReadingBlog(null)}
        >
          <div
            className="w-full max-w-3xl bg-[#0B0F17] border border-slate-800/80 rounded-3xl p-6 sm:p-9 shadow-2xl text-white relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
                  {readingBlog.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-3">
                  {readingBlog.title}
                </h2>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                  <span>{readingBlog.author}</span>
                  <span>•</span>
                  <span>{readingBlog.date}</span>
                  <span>•</span>
                  <span>{readingBlog.readTime}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setReadingBlog(null)}
                className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Hero Image */}
            <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden bg-slate-950 mb-6">
              <img
                src={readingBlog.image}
                alt={readingBlog.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
              {Array.isArray(readingBlog.content) ? (
                readingBlog.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))
              ) : (
                <p>{readingBlog.content || readingBlog.excerpt}</p>
              )}
            </div>

            <div className="pt-6 border-t border-slate-800 mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => setReadingBlog(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold uppercase cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 7. TOAST NOTIFICATION                                                     */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="px-4 py-3 rounded-xl bg-[#0c1424] border border-blue-500/50 shadow-2xl shadow-blue-900/40 flex items-center gap-3 backdrop-blur-md text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold">{toastMessage.message}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

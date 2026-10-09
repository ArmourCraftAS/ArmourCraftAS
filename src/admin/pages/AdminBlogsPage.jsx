import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import {
  Plus,
  Edit2,
  Trash2,
  X,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  CloudUpload,
  Check,
  Link2,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImageIcon
} from 'lucide-react'
import { initialBlogs } from '../../data/blogsData'
import { supabase } from '../../../lib/supabaseClient'

const BLOGS_STORAGE_KEY = 'armourcraft_admin_blogs_v1'

const DEFAULT_SAMPLE_CONTENT = `Cricket safety has evolved rapidly over the last decade. As fast bowlers push the limits of physical speed, armor technology has had to keep pace. For an opening batsman, facing a cherry at 140+ km/h isn't just about skill; it's about the confidence that your protection won't fail when the ball deviates unexpectedly.

The Science of Impact Absorption

At ArmourCraft, we utilize high-density EVA foam layered with composite shells. This multi-stage deceleration process ensures that the kinetic energy from a cricket ball impact is dispersed across the entire surface area of the guard, rather than focused on a single point on the bone.

Research shows that contusions occur when soft tissue is compressed against the underlying skeletal structure with forces exceeding 2500 Newtons. Our latest Pro-Guard series reduces that peak force by up to 65%...

  Anatomical shaping for zero-gap protection.
  Aero-mesh lining for maximum moisture wicking.
  Dual-strap lockdown system to prevent slippage during high-intensity running.`

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
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [deleteConfirmBlog, setDeleteConfirmBlog] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [readingBlog, setReadingBlog] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  // 3. Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    tags: []
  })
  const [tagInput, setTagInput] = useState('')

  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

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
      content: '',
      image: '',
      tags: []
    })
    setTagInput('')
    setShowConfirmModal(false)
    setIsEditorOpen(true)
  }

  const handleOpenEditModal = (blog) => {
    setEditingBlog(blog)
    const existingTags = Array.isArray(blog.tags) && blog.tags.length > 0
      ? blog.tags
      : ['THIGH GUARD', 'EVA FOAM', 'SAFETY']

    const rawContent = Array.isArray(blog.content)
      ? blog.content.join('\n\n')
      : (blog.content || DEFAULT_SAMPLE_CONTENT)

    setFormData({
      title: blog.title || '',
      excerpt: blog.excerpt || blog.subtitle || '',
      content: rawContent,
      image: blog.image || '',
      tags: existingTags
    })
    setTagInput('')
    setShowConfirmModal(false)
    setIsEditorOpen(true)
  }

  // Toolbar Formatting Helpers
  const wrapFormatting = (before, after) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const currentText = formData.content || ''
    const selectedText = currentText.substring(start, end)
    const replacement = selectedText ? `${before}${selectedText}${after}` : `${before}${after}`

    const newContent = currentText.substring(0, start) + replacement + currentText.substring(end)
    setFormData((prev) => ({ ...prev, content: newContent }))

    setTimeout(() => {
      el.focus()
      const cursorPos = selectedText ? start + replacement.length : start + before.length
      el.setSelectionRange(cursorPos, cursorPos)
    }, 10)
  }

  const insertFormatting = (insertion) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const currentText = formData.content || ''

    const newContent = currentText.substring(0, start) + insertion + currentText.substring(end)
    setFormData((prev) => ({ ...prev, content: newContent }))

    setTimeout(() => {
      el.focus()
      const cursorPos = start + insertion.length
      el.setSelectionRange(cursorPos, cursorPos)
    }, 10)
  }

  // Image Upload Handlers
  const handleImageDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer?.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Tags Handlers
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const cleanTag = tagInput.trim().toUpperCase()
      if (cleanTag && !formData.tags.includes(cleanTag)) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, cleanTag] }))
        setTagInput('')
      }
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tagToRemove)
    }))
  }

  // Primary Action Trigger -> Opens confirmation workflow
  const handlePrimaryActionClick = (e) => {
    e?.preventDefault()
    const trimmedTitle = formData.title.trim()
    if (!trimmedTitle) {
      showToast('Please enter a blog post title.', 'info')
      return
    }
    setShowConfirmModal(true)
  }

  // Execute Save after confirmation
  const handleConfirmSave = async () => {
    setIsSubmitting(true)
    const trimmedTitle = formData.title.trim()
    const now = new Date()
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })

    const excerptBio = formData.excerpt.trim()
    const contentParagraphs = formData.content
      .split('\n\n')
      .map((p) => p.trim())
      .filter(Boolean)

    if (editingBlog) {
      // 1. Edit Mode: Update existing blog
      const updatedItem = {
        ...editingBlog,
        title: trimmedTitle,
        excerpt: excerptBio,
        subtitle: excerptBio,
        tags: formData.tags,
        image: formData.image || editingBlog.image,
        detailHeroImage: formData.image || editingBlog.detailHeroImage,
        content: contentParagraphs.length > 0 ? contentParagraphs : [excerptBio]
      }

      setBlogs((prev) => prev.map((b) => (b.id === editingBlog.id ? updatedItem : b)))

      try {
        if (supabase && typeof supabase.from === 'function') {
          await supabase.from('blogs').update(updatedItem).eq('id', editingBlog.id)
        }
      } catch (err) {
        console.info('Supabase blog update notice:', err?.message || err)
      }

      showToast(`Updated blog "${trimmedTitle}" successfully!`)
    } else {
      // 2. Add Mode: Insert new blog
      const newId = `blog-${Date.now()}`
      const slug = trimmedTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      const newBlog = {
        id: newId,
        slug: slug || newId,
        title: trimmedTitle,
        subtitle: excerptBio,
        excerpt: excerptBio,
        tags: formData.tags,
        category: formData.tags[0] || 'Impact Science',
        author: 'ArmourCraft Protection Lab',
        readTime: '5 min read',
        date: formattedDate,
        createdAt: now.toISOString(),
        image: formData.image || '/images/blog_featured_batsman.jpg',
        detailHeroImage: formData.image || '/images/blog_featured_batsman.jpg',
        content: contentParagraphs.length > 0 ? contentParagraphs : [excerptBio]
      }

      setBlogs((prev) => [newBlog, ...prev])

      try {
        if (supabase && typeof supabase.from === 'function') {
          await supabase.from('blogs').insert([newBlog])
        }
      } catch (err) {
        console.info('Supabase blog insert notice:', err?.message || err)
      }

      showToast(`Published blog "${trimmedTitle}" live!`)
    }

    setIsSubmitting(false)
    setShowConfirmModal(false)
    setIsEditorOpen(false)
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
    showToast(`Blog post "${targetTitle}" deleted successfully.`)
  }

  return (
    <div className="w-full min-h-screen bg-[#070b14] text-slate-100 font-sans p-4 sm:p-6 lg:p-8 space-y-8 select-none">
      
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
                  {/* Dynamically Bound Short Excerpt / Bio Preview */}
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
                    {/* Dynamically Bound Short Excerpt / Bio Preview */}
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
      {/* 4. SLEEK FULL-SCREEN BLOG EDITOR MODAL (image_5d4dbc.png & image_5d4dfa.png) */}
      {/* ========================================================================= */}
      {isEditorOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100000] bg-[#070b14] overflow-y-auto p-4 sm:p-6 lg:p-10 custom-scrollbar animate-in fade-in duration-150"
        >
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Top Control Bar with Cancel & Conditional Publish Button */}
            <div className="flex items-center justify-end gap-3 pb-2">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-5 py-2.5 rounded-xl text-[#f87171] hover:text-white bg-[#121927] hover:bg-[#1a2438] border border-slate-700/60 font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handlePrimaryActionClick}
                className="px-6 py-2.5 rounded-xl bg-[#1965eb] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-[0.98]"
              >
                {editingBlog ? 'Publish Edit Blog Post' : 'Publish Blog Post'}
              </button>
            </div>

            {/* 2-Column Split Editor Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* LEFT COLUMN: Title, Short Excerpt / Bio, Body Content */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* 1. BLOG POST TITLE / HEADING */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    BLOG POST TITLE / HEADING
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Surviving 140+ KM/H Pace: How High-Density Foam Prevents Contusions"
                    className="w-full bg-[#0b101d] border border-slate-800 text-white rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-sm sm:text-base font-semibold focus:border-blue-500 focus:outline-none placeholder:text-slate-600 shadow-inner"
                  />
                </div>

                {/* 2. SHORT EXCERPT / SUMMARY */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    SHORT EXCERPT / SUMMARY
                  </label>
                  <textarea
                    rows={3}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Provide a quick overview of what this article covers for social snippets and search results..."
                    className="w-full bg-[#0b101d] border border-slate-800 text-white rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-600 resize-none leading-relaxed shadow-inner"
                  />
                </div>

                {/* 3. ARTICLE DESCRIPTION & BODY CONTENT (Markdown/Rich Text Editor) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    ARTICLE DESCRIPTION & BODY CONTENT
                  </label>
                  
                  <div className="w-full bg-[#0b101d] border border-slate-800 rounded-2xl overflow-hidden shadow-inner flex flex-col">
                    {/* Styling Toolbar */}
                    <div className="bg-[#0e1424] border-b border-slate-800/80 px-4 py-2.5 flex items-center gap-1.5 flex-wrap select-none">
                      {/* Headings */}
                      <button
                        type="button"
                        onClick={() => insertFormatting('# ')}
                        className="px-2.5 py-1 rounded text-xs font-bold bg-[#172338] hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
                        title="Heading 1"
                      >
                        H1
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('## ')}
                        className="px-2.5 py-1 rounded text-xs font-bold hover:bg-[#172338] text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Heading 2"
                      >
                        H2
                      </button>

                      <div className="h-4 w-px bg-slate-800 mx-1" />

                      {/* Formatting: Bold, Italic, Strikethrough */}
                      <button
                        type="button"
                        onClick={() => wrapFormatting('**', '**')}
                        className="px-2.5 py-1 rounded font-black text-xs hover:bg-[#172338] text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Bold"
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() => wrapFormatting('*', '*')}
                        className="px-2.5 py-1 rounded italic text-xs hover:bg-[#172338] text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Italic"
                      >
                        I
                      </button>
                      <button
                        type="button"
                        onClick={() => wrapFormatting('~~', '~~')}
                        className="px-2.5 py-1 rounded line-through text-xs hover:bg-[#172338] text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Strikethrough"
                      >
                        S
                      </button>

                      <div className="h-4 w-px bg-slate-800 mx-1" />

                      {/* Lists & Quote */}
                      <button
                        type="button"
                        onClick={() => insertFormatting('1. ')}
                        className="p-1.5 rounded hover:bg-[#172338] text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Numbered List"
                      >
                        <ListOrdered className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('- ')}
                        className="p-1.5 rounded hover:bg-[#172338] text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Bullet List"
                      >
                        <List className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('> ')}
                        className="p-1.5 rounded hover:bg-[#172338] text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Blockquote"
                      >
                        <Quote className="w-3.5 h-3.5" />
                      </button>

                      <div className="h-4 w-px bg-slate-800 mx-1" />

                      {/* Links, Images, Code */}
                      <button
                        type="button"
                        onClick={() => wrapFormatting('[Link Text](', ')')}
                        className="p-1.5 rounded hover:bg-[#172338] text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Insert Link"
                      >
                        <Link2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => insertFormatting('![Image](https://...)')}
                        className="p-1.5 rounded hover:bg-[#172338] text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Embed Image"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => wrapFormatting('`', '`')}
                        className="p-1.5 rounded hover:bg-[#172338] text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Inline Code"
                      >
                        <Code className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Editor Canvas Area */}
                    <textarea
                      ref={textareaRef}
                      rows={14}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Cricket safety has evolved rapidly over the last decade. As fast bowlers push the limits of physical speed, armor technology has had to keep pace..."
                      className="w-full bg-[#0b101d] text-slate-200 p-4 sm:p-5 text-sm sm:text-base leading-relaxed focus:outline-none resize-y min-h-[380px] font-sans"
                    />
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: Featured Image / Banner, Tags */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* 1. FEATURED IMAGE / BANNER CARD */}
                <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-5 space-y-4">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    FEATURED IMAGE / BANNER
                  </h4>

                  {/* Drag & Drop Zone / Preview Thumbnail */}
                  {formData.image ? (
                    <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative group">
                      <img
                        src={formData.image}
                        alt="Featured Cover Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer shadow-lg"
                        title="Remove Image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleImageDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className="border border-dashed border-slate-700/80 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-blue-500/50 bg-[#080d19]/60 transition-colors group"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                        <CloudUpload className="w-6 h-6 stroke-[2.2]" />
                      </div>
                      <p className="text-xs text-slate-400 font-medium leading-relaxed">
                        Drag & Drop cover image here,<br />or <span className="text-blue-400 font-semibold underline underline-offset-2">Browse Files</span>
                      </p>
                    </div>
                  )}

                  {/* Hidden file input for Native Browser File Picker */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {/* Paste Direct Image Link */}
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Paste Direct Image Link..."
                      className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-4 py-2.5 pr-10 text-xs focus:border-blue-500 focus:outline-none placeholder:text-slate-600 font-mono"
                    />
                    <Link2 className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Replace Image Action Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2.5 rounded-xl bg-[#111726] hover:bg-[#182238] border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Replace Image
                  </button>
                </div>

                {/* 2. TAGS CARD */}
                <div className="bg-[#0c1322] border border-slate-800 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    TAGS
                  </h4>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    ADD TAGS
                  </div>

                  <div className="bg-[#080d19] border border-slate-800 rounded-xl p-3 min-h-[90px] flex flex-wrap gap-2 items-center content-start">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161f33] border border-slate-700/70 text-white text-[11px] font-bold uppercase tracking-wide"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-slate-400 hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Type..."
                      className="bg-transparent text-xs text-white placeholder:text-slate-600 focus:outline-none px-1 py-1 min-w-[70px] flex-1"
                    />
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 5. CONDITIONAL CONFIRMATION MODALS (ADD VS UPDATE LIVE)                   */}
      {/* ========================================================================= */}
      {showConfirmModal && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150"
          onClick={() => !isSubmitting && setShowConfirmModal(false)}
        >
          {editingBlog ? (
            /* Edit Mode: Confirm Update Live */
            <div
              className="w-full max-w-[460px] bg-[#141820] border border-slate-800/90 rounded-3xl p-7 sm:p-8 shadow-2xl text-white relative animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-blue-950/60 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-5">
                <CloudUpload className="w-6 h-6 text-blue-500" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                Confirm Update Live
              </h3>

              <p className="text-sm text-slate-400 font-normal leading-relaxed mb-7">
                You have unsaved changes. Are you sure you want to save and update the live blog post? This action will reflect immediately on the storefront.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#1264e8] hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating Live...' : 'Yes, Update Live Post'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#181d27] hover:bg-[#1f2633] text-slate-300 hover:text-white font-semibold text-sm sm:text-base border border-slate-700/60 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Go Back and Review
                </button>
              </div>
            </div>
          ) : (
            /* Add Mode: Confirm Add New Blog */
            <div
              className="w-full max-w-[460px] bg-[#141820] border border-slate-800/90 rounded-3xl p-7 sm:p-8 shadow-2xl text-white relative animate-in zoom-in-95 duration-150 text-center flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0c1e3d] border border-blue-500/30 flex items-center justify-center mb-5">
                <div className="w-7 h-7 rounded-full bg-[#1665ec] flex items-center justify-center text-white">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                Confirm Add New Blog
              </h3>

              <p className="text-sm text-slate-400 font-normal leading-relaxed mb-7 max-w-sm">
                Are you sure you want to add this new blog post to the <strong className="text-white font-semibold">ArmourCraft</strong> catalog and publish it live?
              </p>

              <div className="space-y-3 w-full">
                <button
                  type="button"
                  onClick={handleConfirmSave}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#1264e8] hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Yes, Publish Blog Post'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#181d27] hover:bg-[#1f2633] text-slate-300 hover:text-white font-semibold text-sm sm:text-base border border-slate-700/60 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Go Back and Review
                </button>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 6. DELETE BLOG POST CONFIRMATION POPUP MODAL (image_5ceca0.png)           */}
      {/* ========================================================================= */}
      {deleteConfirmBlog && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => !isDeleting && setDeleteConfirmBlog(null)}
        >
          <div
            className="w-full max-w-[460px] bg-[#0c1322] border border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-2xl text-white relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Header Icon: Red warning triangle circle icon placed at top center */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full bg-[#241114] border border-red-500/20 flex items-center justify-center shadow-lg shadow-red-950/40">
                <AlertTriangle className="w-6 h-6 text-[#ef4444] stroke-[2.2] fill-[#ef4444]/20" />
              </div>
            </div>

            {/* Modal Title: Bold centered header Delete Blog Post? */}
            <h3 className="text-xl sm:text-2xl font-bold text-white text-center tracking-tight mb-3">
              Delete Blog Post?
            </h3>

            {/* Dynamic Blog Title Text */}
            <p className="text-sm text-slate-400 text-center leading-relaxed px-2 mb-6">
              Are you sure you want to delete <span className="font-bold text-white">"{deleteConfirmBlog.title}"</span>? This action cannot be undone and will permanently remove it from the live site.
            </p>

            {/* Modal Action Workflows: Cancel & Delete Post */}
            <div className="border-t border-slate-800/80 pt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmBlog(null)}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-[#111726] hover:bg-[#182238] border border-slate-700/60 text-slate-300 hover:text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-[#e6392a] hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Post'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 7. READ FULL GUIDE PREVIEW MODAL                                          */}
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
      {/* 8. TOAST NOTIFICATION                                                     */}
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

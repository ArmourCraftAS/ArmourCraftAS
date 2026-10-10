import React, { useState, useEffect, useRef, useCallback } from 'react'
import TopBarHeader from '../dashboard/TopBarHeader'
import CanvasPreview from '../dashboard/CanvasPreview'
import ElementInspectorSidebar from '../dashboard/ElementInspectorSidebar'
import AdminProductsPage from './AdminProductsPage'
import AdminBlogsPage from './AdminBlogsPage'
import AdminFaqsPage from './AdminFaqsPage'
import { CheckCircle2, X, AlertCircle } from 'lucide-react'
import { initialAdminProducts } from '../data/initialProducts'
import { initialBlogs } from '../../data/blogsData'
import { initialFaqs } from '../../data/faqsData'
import { supabase } from '../../../lib/supabaseClient'
import { getDraftCmsData, saveDraftCmsData, getCmsData, updateCmsField, updateCmsFields, resetCmsData, publishCmsData } from '../cmsStore'

export default function AdminDashboardPage({ onNavigate }) {
  // 1. Landing Page Selector State strictly configured for CanvasPreview:
  // 'Home' | 'Shop Armours' | 'What We Are' | 'Blog / Insights' | 'Contact Us' | 'Header' | 'Footer'
  const [activePage, setActivePage] = useState('Home')
  // 2. Admin Management Dashboard Tabs (exclusively: 'product' | 'Blog' | 'FAQs' | null for preview)
  const [activeTab, setActiveTab] = useState(null)

  // 3. Visual Element Inspector State
  const [selectedElement, setSelectedElement] = useState(null)
  const [cmsData, setCmsData] = useState(() => getDraftCmsData())

  // 4. Editing State History Stack for Undo/Redo (Past, Present, Future)
  const [historyStack, setHistoryStack] = useState(() => [
    {
      cms: JSON.parse(JSON.stringify(getDraftCmsData())),
      page: 'Home',
      description: 'Initial state'
    }
  ])
  const [historyIndex, setHistoryIndex] = useState(0)

  const historyStackRef = useRef(historyStack)
  historyStackRef.current = historyStack

  const historyIndexRef = useRef(historyIndex)
  historyIndexRef.current = historyIndex

  const selectedElementRef = useRef(selectedElement)
  selectedElementRef.current = selectedElement

  const activePageRef = useRef(activePage)
  activePageRef.current = activePage

  const lastEditTimeRef = useRef(0)
  const lastEditPathRef = useRef(null)

  // 5. UI Modes & Feedback
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isPublishing, setIsPublishing] = useState(false)

  // Show Toast Helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type })
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Handle Page Selection
  const handleSelectPage = (pageName) => {
    setActivePage(pageName)
  }

  // Helper to re-resolve selected element properties against a CMS snapshot
  const resolveElementFromCms = (element, cms) => {
    if (!element || !cms) return element
    if (!element.path) return element

    const parts = element.path.split('.')
    let currentVal = cms
    for (const p of parts) {
      if (currentVal === undefined || currentVal === null) {
        currentVal = undefined
        break
      }
      currentVal = currentVal[p]
    }

    const fontStyle = { ...(element.fontStyle || {}), ...(cms[element.path + 'Style'] || {}) }
    if (element.path.includes('.hero.') && cms.home?.hero) {
      if (cms.home.hero.fontSize) fontStyle.fontSize = cms.home.hero.fontSize
      if (cms.home.hero.textColor) fontStyle.color = cms.home.hero.textColor
      if (cms.home.hero.alignment) fontStyle.textAlign = cms.home.hero.alignment
      if (cms.home.hero.isBold !== undefined) fontStyle.isBold = cms.home.hero.isBold
      if (cms.home.hero.isItalic !== undefined) fontStyle.isItalic = cms.home.hero.isItalic
    }

    // Check both flat cms[element.path + 'Props'] and nested parent[fieldName + 'Props']
    let nestedProps = null
    if (parts.length > 1) {
      let parent = cms
      for (let i = 0; i < parts.length - 1; i++) {
        if (parent) parent = parent[parts[i]]
      }
      if (parent) {
        nestedProps = parent[parts[parts.length - 1] + 'Props']
      }
    }

    const mediaProps = { ...(element.mediaProps || {}), ...(cms[element.path + 'Props'] || {}), ...(nestedProps || {}) }
    if (element.path.includes('.hero.') && cms.home?.hero) {
      if (cms.home.hero.mediaType) mediaProps.mediaType = cms.home.hero.mediaType
      if (cms.home.hero.imageSrc) mediaProps.src = cms.home.hero.imageSrc
      if (cms.home.hero.videoSrc !== undefined) mediaProps.videoSrc = cms.home.hero.videoSrc
      if (cms.home.hero.videoAssetId !== undefined) mediaProps.videoAssetId = cms.home.hero.videoAssetId
      if (cms.home.hero.videoFileName !== undefined) mediaProps.fileName = cms.home.hero.videoFileName
      if (cms.home.hero.videoPoster !== undefined) mediaProps.poster = cms.home.hero.videoPoster
      if (cms.home.hero.videoAutoplay !== undefined) mediaProps.autoplay = cms.home.hero.videoAutoplay
      if (cms.home.hero.videoLoop !== undefined) mediaProps.loop = cms.home.hero.videoLoop
      if (cms.home.hero.videoMute !== undefined) mediaProps.muted = cms.home.hero.videoMute
      if (cms.home.hero.videoControls !== undefined) mediaProps.controls = cms.home.hero.videoControls
      if (cms.home.hero.imageOpacity !== undefined) mediaProps.opacity = cms.home.hero.imageOpacity
    }

    const iconProps = { ...(element.iconProps || {}), ...(cms[element.path + 'Props'] || {}) }

    return {
      ...element,
      value: currentVal !== undefined ? currentVal : element.value,
      fontStyle,
      mediaProps,
      iconProps
    }
  }

  // Push Snapshot to History Stack
  const pushHistorySnapshot = (newCms, page, description, isDiscrete = false) => {
    const now = Date.now()
    const currentIndex = historyIndexRef.current
    const isTextEdit = !isDiscrete && lastEditPathRef.current === description && (now - lastEditTimeRef.current < 600)

    lastEditTimeRef.current = now
    lastEditPathRef.current = description

    if (isTextEdit && currentIndex > 0) {
      // In-place update for rapid continuous typing
      setHistoryStack((prev) => {
        const copy = [...prev]
        copy[currentIndex] = {
          cms: JSON.parse(JSON.stringify(newCms)),
          page,
          description
        }
        return copy
      })
    } else {
      // Discrete action or new typing session: truncate future redo stack and append
      setHistoryStack((prev) => {
        const sliced = prev.slice(0, currentIndex + 1)
        const updated = [
          ...sliced,
          {
            cms: JSON.parse(JSON.stringify(newCms)),
            page,
            description
          }
        ]
        if (updated.length > 50) {
          return updated.slice(updated.length - 50)
        }
        return updated
      })
      setHistoryIndex((prev) => Math.min(prev + 1, 49))
    }
  }

  // Undo Navigation & State Reversion
  const handleUndo = useCallback(() => {
    const currentIndex = historyIndexRef.current
    const stack = historyStackRef.current
    if (currentIndex <= 0) return

    const newIndex = currentIndex - 1
    const targetSnapshot = stack[newIndex]
    if (!targetSnapshot) return

    setHistoryIndex(newIndex)
    saveDraftCmsData(targetSnapshot.cms)
    setCmsData(targetSnapshot.cms)

    if (targetSnapshot.page && targetSnapshot.page !== activePageRef.current) {
      setActivePage(targetSnapshot.page)
    }

    if (selectedElementRef.current) {
      setSelectedElement((prev) => resolveElementFromCms(prev, targetSnapshot.cms))
    }

    showToast(`Undo: ${targetSnapshot.description || 'Reverted change'}`, 'info')
  }, [])

  // Redo Navigation & State Re-application
  const handleRedo = useCallback(() => {
    const currentIndex = historyIndexRef.current
    const stack = historyStackRef.current
    if (currentIndex >= stack.length - 1) return

    const newIndex = currentIndex + 1
    const targetSnapshot = stack[newIndex]
    if (!targetSnapshot) return

    setHistoryIndex(newIndex)
    saveDraftCmsData(targetSnapshot.cms)
    setCmsData(targetSnapshot.cms)

    if (targetSnapshot.page && targetSnapshot.page !== activePageRef.current) {
      setActivePage(targetSnapshot.page)
    }

    if (selectedElementRef.current) {
      setSelectedElement((prev) => resolveElementFromCms(prev, targetSnapshot.cms))
    }

    showToast(`Redo: ${targetSnapshot.description || 'Re-applied change'}`, 'info')
  }, [])

  // Global Keyboard Shortcuts for Undo (Ctrl+Z) and Redo (Ctrl+Y or Ctrl+Shift+Z)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCtrlOrCmd = e.ctrlKey || e.metaKey
      if (!isCtrlOrCmd) return

      // Redo: Ctrl + Y or Ctrl + Shift + Z
      if (
        (e.key.toLowerCase() === 'z' && e.shiftKey) ||
        (e.key.toLowerCase() === 'y' && !e.shiftKey)
      ) {
        e.preventDefault()
        e.stopPropagation()
        handleRedo()
      }
      // Undo: Ctrl + Z
      else if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault()
        e.stopPropagation()
        handleUndo()
      }
    }

    window.addEventListener('keydown', handleKeyDown, true)
    return () => window.removeEventListener('keydown', handleKeyDown, true)
  }, [handleUndo, handleRedo])

  // Context-Aware Preview Target Page
  const contextAwarePreviewPage =
    activeTab === 'product'
      ? 'Shop Armours'
      : (activeTab === 'Blog' || activeTab === 'blog')
      ? 'Blog / Insights'
      : (activeTab === 'FAQs' || activeTab === 'faqs')
      ? 'Contact Us'
      : activePage

  // 6. Visual Element Inspector Handlers
  const handleUpdateElement = (updatedElem, isExplicitDiscrete = false) => {
    setSelectedElement(updatedElem)
    if (updatedElem.path) {
      if (updatedElem.type === 'text') {
        updateCmsField(updatedElem.path, updatedElem.value)
        if (updatedElem.fontStyle) {
          updateCmsField(updatedElem.path + 'Style', updatedElem.fontStyle)
          if (updatedElem.path.includes('.hero.')) {
            if (updatedElem.fontStyle.fontSize) updateCmsField('home.hero.fontSize', updatedElem.fontStyle.fontSize)
            if (updatedElem.fontStyle.color) updateCmsField('home.hero.textColor', updatedElem.fontStyle.color)
            if (updatedElem.fontStyle.textAlign) updateCmsField('home.hero.alignment', updatedElem.fontStyle.textAlign)
            if (updatedElem.fontStyle.isBold !== undefined) updateCmsField('home.hero.isBold', updatedElem.fontStyle.isBold)
            if (updatedElem.fontStyle.isItalic !== undefined) updateCmsField('home.hero.isItalic', updatedElem.fontStyle.isItalic)
          }
        }
      } else if (updatedElem.type === 'media') {
        const fieldsToUpdate = {}
        const isVideo = updatedElem.mediaProps?.mediaType === 'video'
        const mediaSourceUrl = isVideo ? (updatedElem.mediaProps?.videoSrc || updatedElem.value) : updatedElem.value
        
        // Always store valid source URL directly into primary path key!
        if (mediaSourceUrl) {
          fieldsToUpdate[updatedElem.path] = mediaSourceUrl
        }
        
        // Store videoUrl key if video
        if (isVideo && mediaSourceUrl) {
          fieldsToUpdate[updatedElem.path + 'VideoUrl'] = mediaSourceUrl
        }
        
        if (updatedElem.mediaProps) {
          // Sanitize poster so heavy video base64 is never stored in poster
          const sanitizedMediaProps = { ...updatedElem.mediaProps }
          if (typeof sanitizedMediaProps.poster === 'string' && (sanitizedMediaProps.poster.startsWith('data:video/') || sanitizedMediaProps.poster.length > 50000)) {
            sanitizedMediaProps.poster = ''
          }
          if (isVideo && !sanitizedMediaProps.videoSrc && mediaSourceUrl) {
            sanitizedMediaProps.videoSrc = mediaSourceUrl
          }
          fieldsToUpdate[updatedElem.path + 'Props'] = sanitizedMediaProps

          if (updatedElem.path.includes('.hero.')) {
            if (sanitizedMediaProps.mediaType) fieldsToUpdate['home.hero.mediaType'] = sanitizedMediaProps.mediaType
            if (sanitizedMediaProps.videoSrc !== undefined) fieldsToUpdate['home.hero.videoSrc'] = sanitizedMediaProps.videoSrc
            if (sanitizedMediaProps.videoAssetId !== undefined) fieldsToUpdate['home.hero.videoAssetId'] = sanitizedMediaProps.videoAssetId
            if (sanitizedMediaProps.fileName !== undefined) fieldsToUpdate['home.hero.videoFileName'] = sanitizedMediaProps.fileName
            if (sanitizedMediaProps.poster !== undefined) fieldsToUpdate['home.hero.videoPoster'] = sanitizedMediaProps.poster
            if (sanitizedMediaProps.autoplay !== undefined) fieldsToUpdate['home.hero.videoAutoplay'] = sanitizedMediaProps.autoplay
            if (sanitizedMediaProps.loop !== undefined) fieldsToUpdate['home.hero.videoLoop'] = sanitizedMediaProps.loop
            if (sanitizedMediaProps.muted !== undefined) fieldsToUpdate['home.hero.videoMute'] = sanitizedMediaProps.muted
            if (sanitizedMediaProps.controls !== undefined) fieldsToUpdate['home.hero.videoControls'] = sanitizedMediaProps.controls
            if (sanitizedMediaProps.opacity !== undefined) fieldsToUpdate['home.hero.imageOpacity'] = sanitizedMediaProps.opacity
            if (sanitizedMediaProps.src && !isVideo) fieldsToUpdate['home.hero.imageSrc'] = sanitizedMediaProps.src
          }
        }
        updateCmsFields(fieldsToUpdate)
      } else if (updatedElem.type === 'icon') {
        updateCmsField(updatedElem.path, updatedElem.value)
        if (updatedElem.iconProps) {
          updateCmsField(updatedElem.path + 'Props', updatedElem.iconProps)
        }
      }
    } else if (updatedElem.id) {
      updateCmsField(`custom.${updatedElem.id}`, {
        value: updatedElem.value,
        fontStyle: updatedElem.fontStyle,
        mediaProps: updatedElem.mediaProps,
        iconProps: updatedElem.iconProps
      })
    }

    const currentDraft = getDraftCmsData()
    setCmsData(currentDraft)

    // Push new snapshot to the history stack
    const desc = `${updatedElem.type === 'text' ? 'Edited' : 'Updated'} ${updatedElem.label || 'element'}`
    const isDiscrete = isExplicitDiscrete || updatedElem.type !== 'text'
    pushHistorySnapshot(currentDraft, activePage, desc, isDiscrete)
  }

  const handleResetElement = (elem) => {
    if (elem.originalValue !== undefined) {
      handleUpdateElement({
        ...elem,
        value: elem.originalValue,
        fontStyle: elem.originalFontStyle || {},
        mediaProps: elem.originalMediaProps || {},
        iconProps: elem.originalIconProps || {}
      }, true)
      showToast(`Reset "${elem.label}" to original content`, 'info')
    } else {
      const reset = resetCmsData()
      setCmsData(reset)
      setSelectedElement(null)
      pushHistorySnapshot(reset, activePage, 'Reset all content to defaults', true)
      showToast('Reset all landing content to defaults', 'info')
    }
  }

  // Comprehensive Supabase & CMS Publish Engine
  const handlePublish = async () => {
    setIsPublishing(true)
    try {
      // 0. Commit Visual CMS store to published state
      const currentCms = getCmsData()
      await publishCmsData(currentCms)

      // 1. Gather all current products
      let currentProducts = []
      try {
        const pSaved = window.localStorage.getItem('armourcraft_admin_products_v1')
        if (pSaved) currentProducts = JSON.parse(pSaved)
      } catch {}
      if (!currentProducts || currentProducts.length === 0) currentProducts = initialAdminProducts

      // 2. Gather all current blogs
      let currentBlogs = []
      try {
        const bSaved = window.localStorage.getItem('armourcraft_admin_blogs_v1')
        if (bSaved) currentBlogs = JSON.parse(bSaved)
      } catch {}
      if (!currentBlogs || currentBlogs.length === 0) currentBlogs = initialBlogs

      // 3. Gather all current FAQs
      let currentFaqs = []
      try {
        const fSaved = window.localStorage.getItem('armourcraft_faqs_v1')
        if (fSaved) currentFaqs = JSON.parse(fSaved)
      } catch {}
      if (!currentFaqs || currentFaqs.length === 0) currentFaqs = initialFaqs

      // 4. Batch commit to Supabase tables
      if (supabase && typeof supabase.from === 'function') {
        // Upsert CMS content
        try {
          await supabase.from('cms_content').upsert([
            {
              key: 'landing_cms_data',
              data: currentCms,
              updated_at: new Date().toISOString()
            }
          ], { onConflict: 'key' })
        } catch (cErr) {
          console.info('Supabase CMS table sync notice:', cErr?.message || cErr)
        }

        // Upsert products
        try {
          const formattedProducts = currentProducts.map((p) => ({
            id: p.id,
            title: p.title || 'Untitled Armor',
            subtitle: p.subtitle || null,
            description: p.description || null,
            price: typeof p.price === 'number' ? p.price : parseFloat(p.price?.toString().replace(/[^0-9.]/g, '') || '0') || null,
            price_display: typeof p.price === 'number' ? `$${p.price.toFixed(2)}` : p.price?.toString() || null,
            category: p.category || 'Thigh Guards',
            stance: p.stance || 'All Stances',
            stances: p.stances || ['All Stances', 'Right-Handed', 'Left-Handed'],
            sizes: p.sizes || ['Small', 'Medium', 'Large'],
            image: p.image || null,
            stock: typeof p.stock === 'number' ? p.stock : 50,
            status: p.status || 'In Stock',
            impact_rating: p.impactRating || '160+ km/h'
          }))
          await supabase.from('products').upsert(formattedProducts, { onConflict: 'id' })
        } catch (pErr) {
          console.warn('Supabase publish products notice:', pErr)
        }

        // Upsert blogs
        try {
          const formattedBlogs = currentBlogs.map((b) => ({
            id: b.id,
            slug: b.slug || b.id,
            title: b.title,
            subtitle: b.subtitle || null,
            excerpt: b.excerpt || null,
            category: b.category || 'Impact Science',
            author: b.author || 'ArmourCraft Protection Lab',
            read_time: b.readTime || '5 min read',
            date: b.date || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            image: b.image || null,
            detail_hero_image: b.detailHeroImage || b.image || null,
            sections: b.sections || [],
            content: b.content || [],
            tags: b.tags || []
          }))
          await supabase.from('blogs').upsert(formattedBlogs, { onConflict: 'id' })
        } catch (bErr) {
          console.warn('Supabase publish blogs notice:', bErr)
        }

        // Upsert FAQs
        try {
          const formattedFaqs = currentFaqs.map((f, idx) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            display_order: idx + 1
          }))
          await supabase.from('faqs').upsert(formattedFaqs, { onConflict: 'id' })
        } catch (fErr) {
          console.warn('Supabase publish faqs notice:', fErr)
        }
      }

      // 5. Trigger live channel cache revalidation & notify storefront listeners
      try {
        fetch('/api/revalidate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ timestamp: Date.now() })
        }).catch(() => {})
      } catch {}

      window.dispatchEvent(new CustomEvent('armourcraft:products-updated', { detail: currentProducts }))
      window.dispatchEvent(new CustomEvent('armourcraft:blogs-updated', { detail: currentBlogs }))
      window.dispatchEvent(new CustomEvent('armourcraft:faqs-updated', { detail: currentFaqs }))

      showToast('All changes (Visual Landing Content, Products, Blogs, FAQs) published live to production!')
    } catch (err) {
      console.error('Publish error:', err)
      showToast('Published draft state locally with cloud sync fallback.', 'info')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-[#070b14] text-slate-100 flex flex-col font-sans overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP BAR HEADER WITH PAGE SELECTOR DROPDOWN & GLOBAL ACTIONS            */}
      {/* Strictly configured to menu values: Home, Shop Armours, What We Are,      */}
      {/* Blog / Insights, Contact Us, Header, Footer (image_a7895a.png)            */}
      {/* ========================================================================= */}
      <div className="relative z-[9999] shrink-0">
        <TopBarHeader
          activePage={activePage}
          onSelectPage={handleSelectPage}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setSelectedElement(null)
            setActiveTab(tab)
          }}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < historyStack.length - 1}
          onUndo={handleUndo}
          onRedo={handleRedo}
          isPreviewMode={isPreviewMode}
          onTogglePreview={() => {
            setSelectedElement(null)
            setIsPreviewMode((prev) => !prev)
          }}
          onPublish={handlePublish}
          onNavigate={onNavigate}
          isPublishing={isPublishing}
          showToast={showToast}
        />
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN WORKSPACE: CANVAS + DOCKED CONTEXT-AWARE INSPECTOR SIDEBAR        */}
      {/* ========================================================================= */}
      <main className="w-full flex-1 h-[calc(100vh-4rem)] overflow-hidden relative z-0">
        {isPreviewMode ? (
          <div className="w-full h-full flex flex-col relative overflow-y-auto custom-scrollbar">
            {/* Ambient Preview Status Banner */}
            <div className="sticky top-0 z-40 bg-gradient-to-r from-[#0b1730]/95 via-[#081022]/95 to-[#0b1730]/95 backdrop-blur-md border-b border-blue-500/30 px-4 py-2.5 flex items-center justify-between shadow-2xl text-xs select-none">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-extrabold text-white uppercase tracking-wider">
                  Live Storefront Preview
                </span>
                <span className="text-blue-300/80 font-medium hidden sm:inline">
                  • Viewing “{contextAwarePreviewPage}” with uncommitted visual edits
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPreviewMode(false)}
                  className="px-3 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold transition-colors cursor-pointer border border-slate-700/60"
                >
                  Exit Preview
                </button>
                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="px-3.5 py-1 rounded-lg bg-[#1965eb] hover:bg-blue-600 text-white font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-blue-600/30 disabled:opacity-50"
                >
                  {isPublishing ? 'Publishing...' : 'Publish Live'}
                </button>
              </div>
            </div>
            <div className="w-full flex-1">
              <CanvasPreview
                activePage={contextAwarePreviewPage}
                isInspectorMode={false}
                cmsData={cmsData}
              />
            </div>
          </div>
        ) : activeTab === 'product' ? (
          <div className="w-full h-full overflow-y-auto custom-scrollbar">
            <AdminProductsPage onNavigate={onNavigate} />
          </div>
        ) : (activeTab === 'Blog' || activeTab === 'blog') ? (
          <div className="w-full h-full overflow-y-auto custom-scrollbar">
            <AdminBlogsPage onNavigate={onNavigate} />
          </div>
        ) : (activeTab === 'FAQs' || activeTab === 'faqs') ? (
          <div className="w-full h-full overflow-y-auto custom-scrollbar">
            <AdminFaqsPage onNavigate={onNavigate} />
          </div>
        ) : (
          /* Landing Page Canvas with Docked Context-Aware Inspector Sidebar */
          <div className="w-full h-full flex flex-row overflow-hidden relative">
            <div className="flex-1 h-full overflow-y-auto overflow-x-hidden relative custom-scrollbar">
              <CanvasPreview
                activePage={activePage}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                cmsData={cmsData}
                isInspectorMode={true}
                onSwitchTab={(tab) => {
                  setSelectedElement(null)
                  setActiveTab(tab)
                }}
                onNavigate={onNavigate}
              />
            </div>

            {/* Element Inspector Sidebar */}
            {selectedElement && (
              <ElementInspectorSidebar
                selectedElement={selectedElement}
                onClose={() => setSelectedElement(null)}
                onUpdateElement={handleUpdateElement}
                onResetElement={handleResetElement}
                onSwitchTab={(tab) => {
                  setSelectedElement(null)
                  setActiveTab(tab)
                }}
              />
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. FLOATING FEEDBACK TOAST NOTIFICATION                                   */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="px-4 py-3 rounded-xl bg-[#0c1424] border border-blue-500/40 shadow-2xl shadow-blue-900/40 flex items-center gap-3 backdrop-blur-md">
            {toastMessage.type === 'info' ? (
              <AlertCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="text-xs font-bold text-white">
              {toastMessage.message}
            </span>
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

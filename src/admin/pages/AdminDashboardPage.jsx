import React, { useState, useEffect, useCallback } from 'react'
import TopBarHeader from '../dashboard/TopBarHeader'
import CanvasPreview from '../dashboard/CanvasPreview'
import ElementPropertiesPanel from '../dashboard/ElementPropertiesPanel'
import NavigationMenuDrawer from '../dashboard/NavigationMenuDrawer'
import { CheckCircle2, Sparkles, X, AlertCircle } from 'lucide-react'
import { getCmsData, saveCmsData, publishCmsData, resetCmsData, DEFAULT_CMS_DATA } from '../cmsStore'

export default function AdminDashboardPage({ onNavigate }) {
  // 1. Landing Page Selector State (Home, Shop Armours, What We Are, Blog, Contact Us)
  const [activePage, setActivePage] = useState('Home')
  const [activeTab, setActiveTab] = useState('Home')

  // 2. Centralized CMS Data
  const [cmsData, setCmsData] = useState(() => getCmsData())

  // Current selected element object: null (off-canvas by default) | { id, type, label, ... }
  const [selectedElement, setSelectedElement] = useState(null)

  // 3. Undo / Redo History Stack
  const [history, setHistory] = useState([cmsData])
  const [historyIndex, setHistoryIndex] = useState(0)

  // 4. UI Modes & Feedback
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  // Show Toast Helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type })
    setTimeout(() => {
      setToastMessage(null)
    }, 4000)
  }

  // Universal Update Element Handler across all sections
  const handleUpdateElement = useCallback((partial) => {
    setSelectedElement((prev) => (prev ? { ...prev, ...partial } : null))

    setCmsData((prev) => {
      const updated = JSON.parse(JSON.stringify(prev))

      if (!selectedElement) return updated

      const id = selectedElement.id

      // Map updates to respective CMS store branches
      if (id.startsWith('hero_')) {
        if (!updated.home.hero) updated.home.hero = {}
        Object.assign(updated.home.hero, partial)
      } else if (id === 'essentials_header') {
        if (partial.mainHeading) updated.home.essentials.heading = partial.mainHeading
        if (partial.subHeading) updated.home.essentials.subheading = partial.subHeading
      } else if (id === 'advantage_header') {
        if (partial.mainHeading) updated.home.advantage.heading = partial.mainHeading
        if (partial.subHeading) updated.home.advantage.subheading = partial.subHeading
      } else if (id === 'custom_squad_text') {
        if (partial.mainHeading) updated.home.customSquad.heading = partial.mainHeading
        if (partial.subHeading) updated.home.customSquad.subheading = partial.subHeading
        if (partial.ctaText) updated.home.customSquad.ctaText = partial.ctaText
        if (partial.ctaLink) updated.home.customSquad.ctaLink = partial.ctaLink
      } else if (id === 'custom_squad_media') {
        if (partial.imageSrc) updated.home.customSquad.image = partial.imageSrc
        if (partial.mediaType) updated.home.customSquad.mediaType = partial.mediaType
      } else if (id === 'footer_brand') {
        if (partial.subHeading) updated.home.footer.brandDesc = partial.subHeading
      } else if (id === 'footer_newsletter') {
        if (partial.mainHeading) updated.home.footer.newsletterTitle = partial.mainHeading
        if (partial.subHeading) updated.home.footer.newsletterDesc = partial.subHeading
      } else if (id === 'footer_legal') {
        if (partial.subHeading) updated.home.footer.copyright = partial.subHeading
      } else if (id === 'shop_header') {
        if (partial.mainHeading) updated.shop.heading = partial.mainHeading
        if (partial.subHeading) updated.shop.subheading = partial.subHeading
      } else if (id === 'wwa_header') {
        if (partial.mainHeading) updated.whatWeAre.heading = partial.mainHeading
        if (partial.subHeading) updated.whatWeAre.subheading = partial.subHeading
      } else if (id === 'blog_header') {
        if (partial.mainHeading) updated.blog.heading = partial.mainHeading
        if (partial.subHeading) updated.blog.subheading = partial.subHeading
      } else if (id === 'contact_header') {
        if (partial.mainHeading) updated.contact.heading = partial.mainHeading
        if (partial.subHeading) updated.contact.subheading = partial.subHeading
      }

      // Save locally
      saveCmsData(updated)

      // Push to history
      setHistory((prevHist) => {
        const sliced = prevHist.slice(0, historyIndex + 1)
        return [...sliced, updated]
      })
      setHistoryIndex((prevIdx) => prevIdx + 1)

      return updated
    })
  }, [historyIndex, selectedElement])

  // Select Element on Canvas (opens sidebar dynamically)
  const handleSelectElement = (elementObj) => {
    setSelectedElement(elementObj)
  }

  // Undo Handler
  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1
      setHistoryIndex(nextIdx)
      setCmsData(history[nextIdx])
      saveCmsData(history[nextIdx])
      showToast('Undone previous change', 'info')
    }
  }

  // Redo Handler
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1
      setHistoryIndex(nextIdx)
      setCmsData(history[nextIdx])
      saveCmsData(history[nextIdx])
      showToast('Redone change', 'info')
    }
  }

  // Reset to Factory Default
  const handleResetDefaults = () => {
    const defaultData = resetCmsData()
    setCmsData(defaultData)
    setHistory([defaultData])
    setHistoryIndex(0)
    setSelectedElement(null)
    showToast('Reset elements to factory defaults', 'info')
  }

  // Save / Update Element Action (from sidebar bottom button)
  const handleSaveElement = () => {
    setIsSaving(true)
    setTimeout(() => {
      saveCmsData(cmsData)
      setIsSaving(false)
      showToast('Element properties updated successfully!')
    }, 400)
  }

  // Publish Directly to Live Store Database / JSON Store
  const handlePublish = () => {
    setIsPublishing(true)
    setTimeout(() => {
      publishCmsData(cmsData)
      setIsPublishing(false)
      showToast('Content published live to storefront!')
    }, 800)
  }

  return (
    <div className="h-screen w-screen bg-[#070b14] text-slate-100 flex flex-col font-sans overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP BAR HEADER WITH PAGE SELECTOR DROPDOWN & GLOBAL ACTIONS            */}
      {/* ========================================================================= */}
      <TopBarHeader
        activePage={activePage}
        onSelectPage={setActivePage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isPreviewMode={isPreviewMode}
        onTogglePreview={() => setIsPreviewMode((prev) => !prev)}
        onPublish={handlePublish}
        onNavigate={onNavigate}
        isPublishing={isPublishing}
      />

      {/* ========================================================================= */}
      {/* 2. MAIN CMS WORKSPACE WITH FULL SCROLLABLE CANVAS & OFF-CANVAS SIDEBAR     */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* A. Live Fully-Scrollable Preview Canvas (Fixed Layout, Universal Editing) */}
        <CanvasPreview
          activePage={activePage}
          cmsData={cmsData}
          selectedElement={selectedElement}
          onSelectElement={handleSelectElement}
          onUpdateElement={handleUpdateElement}
          isPreviewMode={isPreviewMode}
          onNavigate={onNavigate}
        />

        {/* B. Dynamic Context-Aware Sidebar (Off-Canvas by Default, opens on element click) */}
        {!isPreviewMode && Boolean(selectedElement) && (
          <ElementPropertiesPanel
            isOpen={Boolean(selectedElement)}
            onClose={() => setSelectedElement(null)}
            elementData={selectedElement}
            onUpdateElement={handleUpdateElement}
            onResetDefaults={handleResetDefaults}
            onSaveElement={handleSaveElement}
            isSaving={isSaving}
          />
        )}

        {/* C. Floating Navigation Menu Drawer (Far Right Panel) */}
        {!isPreviewMode && (
          <NavigationMenuDrawer
            activePage={activePage}
            onSelectPage={setActivePage}
            onNavigate={onNavigate}
          />
        )}

      </div>

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

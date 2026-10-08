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

  // Current active element: null (off-canvas by default) | 'heading' | 'subheading' | 'buttons' | 'media'
  const [activeElement, setActiveElement] = useState(null)

  // 3. Current Page Element Data Helper
  const currentHeroData = {
    ...cmsData.home.hero,
    activeElement
  }

  // 4. Undo / Redo History Stack
  const [history, setHistory] = useState([cmsData])
  const [historyIndex, setHistoryIndex] = useState(0)

  // 5. UI Modes & Feedback
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

  // Update Element Data & Push to History
  const handleUpdateElement = useCallback((partial) => {
    setCmsData((prev) => {
      const updated = {
        ...prev,
        home: {
          ...prev.home,
          hero: {
            ...prev.home.hero,
            ...partial
          }
        }
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
  }, [historyIndex])

  // Select Element on Canvas (opens sidebar dynamically)
  const handleSelectElement = (elementId) => {
    setActiveElement(elementId)
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
      {/* 2. MAIN CMS WORKSPACE                                                     */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* A. Live Fully-Scrollable Preview Canvas (Fixed Layout, Editable Content) */}
        <CanvasPreview
          activePage={activePage}
          elementData={currentHeroData}
          onSelectElement={handleSelectElement}
          onUpdateElement={handleUpdateElement}
          isPreviewMode={isPreviewMode}
          onNavigate={onNavigate}
        />

        {/* B. Dynamic Context-Aware Sidebar (Off-Canvas by Default, opens on element click) */}
        {!isPreviewMode && Boolean(activeElement) && (
          <ElementPropertiesPanel
            isOpen={Boolean(activeElement)}
            onClose={() => setActiveElement(null)}
            elementData={currentHeroData}
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

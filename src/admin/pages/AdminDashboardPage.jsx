import React, { useState, useEffect, useCallback } from 'react'
import TopBarHeader from '../dashboard/TopBarHeader'
import CanvasPreview from '../dashboard/CanvasPreview'
import ElementPropertiesPanel from '../dashboard/ElementPropertiesPanel'
import NavigationMenuDrawer from '../dashboard/NavigationMenuDrawer'
import { CheckCircle2, Sparkles, X, AlertCircle } from 'lucide-react'

const DEFAULT_ELEMENT_DATA = {
  mainHeading: 'Next-Gen Ergonomic Thigh Protection',
  subHeading:
    'Engineered for maximum mobility & impact absorption in every stroke. Trusted against 150+ km/h deliveries.',
  textColor: '#FFFFFF',
  fontSize: 48,
  ctaLink: '/shop-armours',
  isHeadingHidden: false,
  isSubHeadingHidden: false,
  isButtonsHidden: false,
  isBold: true,
  isItalic: false,
  alignment: 'left',
  activeElement: 'heading'
}

export default function AdminDashboardPage({ onNavigate }) {
  // 1. Element State & Local Storage Persistence
  const [elementData, setElementData] = useState(() => {
    try {
      const saved = localStorage.getItem('armourcraft_admin_dashboard_element')
      if (saved) return JSON.parse(saved)
    } catch (e) {}
    return DEFAULT_ELEMENT_DATA
  })

  // 2. Undo / Redo History Stack
  const [history, setHistory] = useState([DEFAULT_ELEMENT_DATA])
  const [historyIndex, setHistoryIndex] = useState(0)

  // 3. UI Modes & Feedback
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [activeTab, setActiveTab] = useState('Home')
  const [activeDrawerPage, setActiveDrawerPage] = useState('Home')
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
    setElementData((prev) => {
      const updated = { ...prev, ...partial }
      // Update history
      setHistory((prevHist) => {
        const sliced = prevHist.slice(0, historyIndex + 1)
        return [...sliced, updated]
      })
      setHistoryIndex((prevIdx) => prevIdx + 1)
      try {
        localStorage.setItem(
          'armourcraft_admin_dashboard_element',
          JSON.stringify(updated)
        )
      } catch (e) {}
      return updated
    })
  }, [historyIndex])

  // Undo Handler
  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1
      setHistoryIndex(nextIdx)
      setElementData(history[nextIdx])
      showToast('Undone previous change', 'info')
    }
  }

  // Redo Handler
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1
      setHistoryIndex(nextIdx)
      setElementData(history[nextIdx])
      showToast('Redone change', 'info')
    }
  }

  // Reset to Default
  const handleResetDefaults = () => {
    setElementData(DEFAULT_ELEMENT_DATA)
    handleUpdateElement(DEFAULT_ELEMENT_DATA)
    showToast('Reset elements to default values', 'info')
  }

  // Select Element on Canvas
  const handleSelectElement = (elementId) => {
    setElementData((prev) => ({ ...prev, activeElement: elementId }))
  }

  // Save / Update Element Action
  const handleSaveElement = () => {
    setIsSaving(true)
    setTimeout(() => {
      try {
        localStorage.setItem(
          'armourcraft_admin_dashboard_element',
          JSON.stringify(elementData)
        )
      } catch (e) {}
      setIsSaving(false)
      showToast('Element properties updated successfully!')
    }, 400)
  }

  // Publish to Storefront Action
  const handlePublish = () => {
    setIsPublishing(true)
    setTimeout(() => {
      setIsPublishing(false)
      showToast('Storefront changes published live to production!')
    }, 900)
  }

  return (
    <div className="h-screen w-screen bg-[#070b14] text-slate-100 flex flex-col font-sans overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP BAR HEADER                                                         */}
      {/* ========================================================================= */}
      <TopBarHeader
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
      {/* 2. MAIN WORKSPACE CONTAINER                                               */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* A. Live Interactive Preview Canvas (Left Area) */}
        <CanvasPreview
          elementData={elementData}
          onSelectElement={handleSelectElement}
          onUpdateElement={handleUpdateElement}
          isPreviewMode={isPreviewMode}
          onNavigate={onNavigate}
        />

        {/* B. Element Properties Panel (Right Sidebar) - Hidden in Preview Mode */}
        {!isPreviewMode && (
          <ElementPropertiesPanel
            elementData={elementData}
            onUpdateElement={handleUpdateElement}
            onResetDefaults={handleResetDefaults}
            onSaveElement={handleSaveElement}
            isSaving={isSaving}
          />
        )}

        {/* C. Floating Navigation Menu Drawer (Far Right Panel) */}
        {!isPreviewMode && (
          <NavigationMenuDrawer
            activePage={activeDrawerPage}
            onSelectPage={setActiveDrawerPage}
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

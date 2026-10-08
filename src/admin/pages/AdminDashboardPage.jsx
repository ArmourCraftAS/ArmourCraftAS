import React, { useState } from 'react'
import TopBarHeader from '../dashboard/TopBarHeader'
import CanvasPreview from '../dashboard/CanvasPreview'
import { CheckCircle2, X, AlertCircle } from 'lucide-react'

export default function AdminDashboardPage({ onNavigate }) {
  // 1. Landing Page Selector State strictly configured:
  // 'Home' | 'Shop Armours' | 'What We Are' | 'Blog / Insights' | 'Contact Us' | 'Header' | 'Footer'
  const [activePage, setActivePage] = useState('Home')
  const [activeTab, setActiveTab] = useState('Home')

  // 2. Page Navigation History Stack for Undo/Redo
  const [history, setHistory] = useState(['Home'])
  const [historyIndex, setHistoryIndex] = useState(0)

  // 3. UI Modes & Feedback
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

  // Handle Page Selection with History Tracking
  const handleSelectPage = (pageName) => {
    setActivePage(pageName)
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1)
      return [...sliced, pageName]
    })
    setHistoryIndex((prev) => prev + 1)
  }

  // Undo Navigation
  const handleUndo = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1
      setHistoryIndex(nextIdx)
      setActivePage(history[nextIdx])
      showToast(`Navigated to ${history[nextIdx]}`, 'info')
    }
  }

  // Redo Navigation
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1
      setHistoryIndex(nextIdx)
      setActivePage(history[nextIdx])
      showToast(`Navigated to ${history[nextIdx]}`, 'info')
    }
  }

  // Publish Directly to Live Storefront
  const handlePublish = () => {
    setIsPublishing(true)
    setTimeout(() => {
      setIsPublishing(false)
      showToast('Storefront changes published live to production!')
    }, 800)
  }

  return (
    <div className="h-screen w-screen bg-[#070b14] text-slate-100 flex flex-col font-sans overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP BAR HEADER WITH PAGE SELECTOR DROPDOWN & GLOBAL ACTIONS            */}
      {/* Strictly configured to menu values: Home, Shop Armours, What We Are,      */}
      {/* Blog / Insights, Contact Us, Header, Footer (image_a7895a.png)            */}
      {/* ========================================================================= */}
      <TopBarHeader
        activePage={activePage}
        onSelectPage={handleSelectPage}
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
      {/* 2. FULL SCREEN LIVE UNTOUCHED LANDING PAGE CANVAS (RIGHT SIDEBAR REMOVED)  */}
      {/* The canvas area spans 100% full screen width with top-to-bottom scrolling */}
      {/* ========================================================================= */}
      <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-hidden relative">
        <CanvasPreview
          activePage={activePage}
          onNavigate={onNavigate}
        />
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

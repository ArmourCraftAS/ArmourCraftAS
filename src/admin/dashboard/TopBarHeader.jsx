import React, { useState, useRef, useEffect } from 'react'
import {
  Bell,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  LogOut,
  ChevronDown,
  Shield,
  Sparkles
} from 'lucide-react'
import { useAdminAuth } from '../AdminAuthContext'
import LogoutConfirmModal from './LogoutConfirmModal'

export default function TopBarHeader({
  activePage = 'Home',
  onSelectPage,
  activeTab = 'Home',
  setActiveTab,
  canUndo = false,
  canRedo = false,
  onUndo,
  onRedo,
  isPreviewMode = false,
  onTogglePreview,
  onPublish,
  onNavigate,
  isPublishing = false,
  showToast
}) {
  const { logout } = useAdminAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showPageDropdown, setShowPageDropdown] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const dropdownRef = useRef(null)

  // Strictly exact menu values specified in prompt & screenshot image_a7895a.png:
  // - Home
  // - Shop Armours
  // - What We Are
  // - Blog / Insights
  // - Contact Us
  // - Header
  // - Footer
  const dropdownOptions = [
    'Home',
    'Shop Armours',
    'What We Are',
    'Blog / Insights',
    'Contact Us',
    'Header',
    'Footer'
  ]

  // Admin management tabs (exclusively for CMS dashboards, separate from landing page preview)
  const quickTabs = [
    { id: 'product', label: 'product' },
    { id: 'Blog', label: 'Blog' },
    { id: 'FAQs', label: 'FAQs' }
  ]

  const notifications = [
    {
      id: 1,
      title: 'New Cash on Delivery Order',
      time: '5 min ago',
      desc: 'Order #ORD-7821 for Advantage Thigh Guard ($145)'
    },
    {
      id: 2,
      title: 'CMS Sync Notice',
      time: '20 min ago',
      desc: 'Hero Section content modified by Admin.'
    },
    {
      id: 3,
      title: 'Low Stock Alert',
      time: '1 hour ago',
      desc: 'Advantage Carbon Guard has 4 units left in inventory.'
    }
  ]

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowPageDropdown(false)
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectPageItem = (pageName) => {
    if (setActiveTab) setActiveTab(null)
    if (onSelectPage) onSelectPage(pageName)
    setShowPageDropdown(false)
  }

  const handleTabClick = (tab) => {
    // Exclusively switches the main panel to the Admin Management Dashboard (product, Blog, FAQs)
    // Completely isolated from the dropdown landing page preview selector
    if (setActiveTab) setActiveTab(tab.id)
  }

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true)
  }

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      if (logout) {
        await logout()
      }
      if (showToast) {
        showToast('Logged out of ARMOURCRAFT CMS Admin Session successfully.')
      }
      setTimeout(() => {
        setIsLoggingOut(false)
        setIsLogoutModalOpen(false)
        if (onNavigate) {
          onNavigate('/admin/login')
        } else if (typeof window !== 'undefined') {
          window.location.href = '/admin/login'
        }
      }, 350)
    } catch (err) {
      console.error('Logout error:', err)
      setIsLoggingOut(false)
    }
  }

  return (
    <header className="h-16 w-full bg-[#090e1a] border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-[9999] select-none sticky top-0 backdrop-blur-md">
      {/* ========================================================================= */}
      {/* 1. LEFT: ARMOURCRAFT AS METALLIC 3D LOGO (MATCHING image_e863dc.png)       */}
      {/* ========================================================================= */}
      <div className="flex items-center shrink-0 bg-transparent">
        <button
          type="button"
          onClick={() => {
            if (setActiveTab) setActiveTab(null)
            if (onSelectPage) onSelectPage('Home')
          }}
          className="flex items-center group cursor-pointer text-left focus:outline-none transition-transform duration-200 hover:scale-[1.01] py-1 bg-transparent"
          title="ARMOURCRAFT AS - Admin Visual Studio"
        >
          <img
            src="/images/admin_logo.png"
            alt="ARMOURCRAFT AS"
            className="h-8 sm:h-9 md:h-10 w-auto object-contain select-none bg-transparent"
            style={{ mixBlendMode: 'screen' }}
            loading="eager"
            onError={(e) => {
              e.currentTarget.src = '/images/logo_clean.png'
            }}
          />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. CENTER: NAVIGATION DROPDOWN (STRICTLY MATCHING image_a7895a.png)       */}
      {/* ========================================================================= */}
      <nav className="flex items-center gap-2 relative z-[99999]" ref={dropdownRef}>
        {/* Dropdown Toggle Button (matching image_a785dc.jpg: Home ˇ) */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPageDropdown((prev) => !prev)}
            className="px-4 py-1.5 text-xs font-bold rounded-lg transition-all duration-150 flex items-center gap-2 cursor-pointer bg-[#121a2d] text-white border border-slate-700/80 hover:border-blue-500/60 shadow-sm"
          >
            <span>{activePage}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                showPageDropdown ? 'rotate-180 text-blue-400' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu Popup (Strictly matching image_a7895a.png & image_a8e677.png) */}
          {showPageDropdown && (
            <div className="absolute top-full left-0 mt-2 w-52 bg-[#0c1424] border border-slate-800/90 rounded-2xl shadow-2xl p-2 z-[99999] animate-in fade-in zoom-in-95 backdrop-blur-md">
              <div className="space-y-1">
                {dropdownOptions.map((option) => {
                  const isSelected = activePage === option
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => handleSelectPageItem(option)}
                      className={`w-full text-left rounded-xl text-sm transition-all duration-150 flex items-center cursor-pointer relative ${
                        isSelected
                          ? 'bg-[#131d33] text-white font-bold pl-5 pr-3 py-2.5'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800/40 px-4 py-2.5 font-medium'
                      }`}
                    >
                      {/* Active indicator: blue rounded vertical pill on the left edge (image_a7895a.png) */}
                      {isSelected && (
                        <div className="absolute left-1.5 top-2 bottom-2 w-1.5 bg-[#1d63ed] rounded-full shadow-[0_0_8px_rgba(29,99,237,0.8)]" />
                      )}
                      <span className="truncate">{option}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Quick Tabs next to dropdown (image_a785dc.jpg: product, Blog, FAQs) */}
        <div className="hidden md:flex items-center gap-1.5 pl-2 border-l border-slate-800/80">
          {quickTabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`px-3.5 py-1.5 text-xs rounded-lg transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'text-slate-950 bg-white font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent font-medium'
                }`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 3. RIGHT: NOTIFICATION, UNDO/REDO, PREVIEW, PUBLISH, LOGOUT               */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Notification Bell Badge */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((prev) => !prev)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors relative cursor-pointer"
            title="Admin Alerts"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center border-2 border-[#090e1a] shadow-sm">
              3
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#0c1322] border border-slate-800 rounded-xl shadow-2xl p-3 z-[99999] animate-in fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Admin Alerts
                </span>
                <span className="text-[10px] text-blue-400 font-semibold">3 New</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="p-2 rounded-lg bg-[#080d19] border border-slate-800/80 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200">{n.title}</span>
                      <span className="text-[9px] text-slate-500">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-snug">{n.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Undo Control */}
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            canUndo
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              : 'text-slate-600 cursor-not-allowed opacity-50'
          }`}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo Control */}
        <button
          type="button"
          onClick={onRedo}
          disabled={!canRedo}
          className={`p-2 rounded-lg transition-colors cursor-pointer ${
            canRedo
              ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              : 'text-slate-600 cursor-not-allowed opacity-50'
          }`}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Context-Aware Dynamic Preview Button */}
        <button
          type="button"
          onClick={onTogglePreview}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
            isPreviewMode
              ? 'bg-blue-600/30 border-blue-400 text-blue-200 shadow-md shadow-blue-500/20 font-bold'
              : 'border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white bg-[#0e1526]/50'
          }`}
          title={
            isPreviewMode
              ? 'Exit Preview Mode (Return to CMS Editor)'
              : activeTab === 'product'
              ? 'Preview Live Shop Page with Draft Products'
              : (activeTab === 'Blog' || activeTab === 'blog')
              ? 'Preview Live Blog Page with Draft Articles'
              : (activeTab === 'FAQs' || activeTab === 'faqs')
              ? 'Preview Live Contact & Support Page with Draft FAQs'
              : 'Preview Live Storefront Page'
          }
        >
          {isPreviewMode ? <EyeOff className="w-3.5 h-3.5 text-blue-300" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isPreviewMode ? 'Exit Preview' : 'Preview'}</span>
        </button>

        {/* Primary PUBLISH Button */}
        <button
          type="button"
          onClick={onPublish}
          disabled={isPublishing}
          className="px-4 sm:px-5 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider text-white bg-[#1d63ed] hover:bg-[#1554d1] active:scale-95 transition-all duration-150 shadow-md shadow-blue-600/30 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          title="Publish live to storefront"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-200" />
          <span>{isPublishing ? 'PUBLISHING...' : 'PUBLISH'}</span>
        </button>

        {/* Logout Icon */}
        <button
          type="button"
          onClick={handleLogoutClick}
          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer ml-1"
          title="Sign Out of Admin Console"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Logout Confirmation Popup Modal (image_13.png) */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => !isLoggingOut && setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoggingOut={isLoggingOut}
        activePageName={activePage && activePage !== 'Home' ? `${activePage} Page` : 'SmartThighs Symmetry Landing Page'}
      />
    </header>
  )
}

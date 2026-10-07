import React, { useState } from 'react'
import {
  Bell,
  Undo2,
  Redo2,
  Eye,
  EyeOff,
  LogOut,
  ChevronDown,
  Check,
  Shield,
  Layers,
  Sparkles,
  ExternalLink
} from 'lucide-react'
import { useAdminAuth } from '../AdminAuthContext'

export default function TopBarHeader({
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
  isPublishing = false
}) {
  const { logout } = useAdminAuth()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showHomeDropdown, setShowHomeDropdown] = useState(false)

  const tabs = [
    { id: 'Home', label: 'Home', hasDropdown: true },
    { id: 'product', label: 'product', path: '/admin/products' },
    { id: 'Blog', label: 'Blog', path: '/blog' },
    { id: 'FAQs', label: 'FAQs', path: '/#faq' }
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
      title: 'Low Stock Alert',
      time: '1 hour ago',
      desc: 'Advantage Carbon Guard has 4 units left in inventory.'
    }
  ]

  const handleTabClick = (tab) => {
    if (tab.id === 'Home') {
      setShowHomeDropdown((prev) => !prev)
      if (setActiveTab) setActiveTab('Home')
      return
    }
    if (tab.path && onNavigate) {
      if (tab.path.startsWith('/admin')) {
        onNavigate(tab.path)
      } else {
        window.open(tab.path, '_blank')
      }
    }
    if (setActiveTab) setActiveTab(tab.id)
    setShowHomeDropdown(false)
  }

  const handleLogout = () => {
    if (logout) logout()
    if (onNavigate) onNavigate('/admin/login')
  }

  return (
    <header className="h-16 w-full bg-[#090e1a] border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-40 select-none sticky top-0 backdrop-blur-md">
      {/* ========================================================================= */}
      {/* 1. LEFT: ARMOURCRAFT AS METALLIC 3D BRAND LOGO                           */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate && onNavigate('/admin/dashboard')}
          className="flex items-center gap-2.5 group cursor-pointer text-left"
          title="ARMOURCRAFT AS - Admin Studio"
        >
          {/* Metallic 3D emblem */}
          <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-slate-700 via-slate-900 to-blue-600 p-[1.5px] shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#080d19] rounded-[7px] flex items-center justify-center overflow-hidden">
              <img
                src="/images/logo_clean.png"
                alt="ARMOURCRAFT Emblem"
                className="w-5 h-5 object-contain drop-shadow-[0_2px_4px_rgba(37,99,235,0.6)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  if (e.currentTarget.nextSibling) {
                    e.currentTarget.nextSibling.style.display = 'block'
                  }
                }}
              />
              <Shield className="w-4 h-4 text-blue-400 hidden" />
            </div>
          </div>

          {/* Metallic typography */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-black tracking-wider uppercase bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent drop-shadow-sm font-sans">
              ARMOURCRAFT
            </span>
            <span className="text-xs font-black tracking-widest text-[#2563eb] font-sans">
              AS
            </span>
          </div>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. CENTER: NAVIGATION TABS WITH SELECTION INDICATOR                     */}
      {/* ========================================================================= */}
      <nav className="hidden md:flex items-center gap-1.5 relative">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <div key={tab.id} className="relative">
              <button
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-150 flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-[#121a2d] text-white border border-slate-700/80 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                {tab.hasDropdown && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                      showHomeDropdown ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>

              {/* Home dropdown menu for canvas sections */}
              {tab.hasDropdown && showHomeDropdown && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-[#0d1424] border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <button
                    type="button"
                    onClick={() => {
                      if (setActiveTab) setActiveTab('Home')
                      setShowHomeDropdown(false)
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-white bg-blue-600/20 text-blue-300 rounded-lg flex items-center justify-between"
                  >
                    <span>Hero Section</span>
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowHomeDropdown(false)
                      if (onNavigate) onNavigate('/shop')
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-lg flex items-center justify-between transition-colors"
                  >
                    <span>Storefront View</span>
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
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
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center border-2 border-[#090e1a] shadow-sm">
              2
            </span>
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 bg-[#0c1322] border border-slate-800 rounded-xl shadow-2xl p-3 z-50 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Admin Alerts
                </span>
                <span className="text-[10px] text-blue-400 font-semibold">2 New</span>
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

        {/* Preview Button */}
        <button
          type="button"
          onClick={onTogglePreview}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
            isPreviewMode
              ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
              : 'border-slate-700/80 hover:border-slate-600 text-slate-300 hover:text-white bg-[#0e1526]/50'
          }`}
          title="Toggle Full Preview Mode"
        >
          {isPreviewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>Preview</span>
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
          onClick={handleLogout}
          className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer ml-1"
          title="Sign Out of Admin Console"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}

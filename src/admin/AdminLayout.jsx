import React, { useState } from 'react'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  LogOut,
  ExternalLink,
  Shield,
  Menu,
  X,
  ChevronRight,
  Bell
} from 'lucide-react'
import { useAdminAuth } from './AdminAuthContext'
import LogoutConfirmModal from './dashboard/LogoutConfirmModal'

export default function AdminLayout({ children, currentPath, onNavigate }) {
  const { adminUser, logout } = useAdminAuth()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const navItems = [
    {
      name: 'Overview',
      path: '/admin/dashboard',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      name: 'Products',
      path: '/admin/products',
      icon: <Package className="w-4 h-4" />
    },
    {
      name: 'Orders',
      path: '/admin/orders',
      icon: <ShoppingCart className="w-4 h-4" />
    }
  ]

  const handleLogoutClick = () => {
    setIsLogoutModalOpen(true)
  }

  const handleConfirmLogout = async () => {
    setIsLoggingOut(true)
    try {
      if (logout) {
        await logout()
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

  const activeItem = navItems.find((item) => item.path === currentPath) || navItems[0]

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col md:flex-row font-sans selection:bg-blue-600 selection:text-white">
      
      {/* ========================================================================= */}
      {/* 1. SIDEBAR (Desktop Fixed & Mobile Drawer)                                 */}
      {/* ========================================================================= */}
      {/* Mobile Backdrop */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm md:hidden animate-in fade-in"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 z-50 h-screen w-64 bg-[#0b1222] border-r border-slate-800/90 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top: Branding Logo & Header */}
        <div>
          <div className="h-20 px-6 flex items-center justify-between border-b border-slate-800/80">
            <button
              type="button"
              onClick={() => onNavigate('/admin/dashboard')}
              className="flex items-center group cursor-pointer text-left focus:outline-none py-1 bg-transparent"
              title="ARMOURCRAFT AS - Admin Console"
            >
              <img
                src="/images/admin_logo.png"
                alt="ARMOURCRAFT AS"
                className="h-8 sm:h-9 w-auto object-contain select-none bg-transparent transition-transform duration-200 group-hover:scale-[1.02]"
                style={{ mixBlendMode: 'screen' }}
                loading="eager"
              />
            </button>

            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 px-3 py-2 block">
              MANAGEMENT
            </span>
            {navItems.map((item) => {
              const isActive = currentPath === item.path
              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => {
                    onNavigate(item.path)
                    setIsMobileSidebarOpen(false)
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#1762f0] text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 stroke-[2.5]" />}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Bottom: External link to customer storefront & system version */}
        <div className="p-4 border-t border-slate-800/80 space-y-3">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-400 hover:text-blue-300 text-xs font-semibold border border-slate-800/80 transition-colors cursor-pointer group"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Storefront</span>
            </span>
            <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-300">&rarr;</span>
          </button>

          <div className="px-3 pt-1 text-[10px] text-slate-500 flex justify-between items-center font-mono">
            <span>v2.4 Production</span>
            <span className="text-emerald-400 flex items-center gap-1 font-sans">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Secure
            </span>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA + TOP BAR                                             */}
      {/* ========================================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-20 bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Left Title & Mobile Toggle */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Admin</span>
                <span>/</span>
                <span className="text-blue-400 font-semibold">{activeItem.name}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight">
                {activeItem.name}
              </h1>
            </div>
          </div>

          {/* Right: Admin Profile Avatar & Standalone Logout Button */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Admin Profile Pill */}
            <div className="flex items-center gap-3 py-1.5 px-3 rounded-2xl bg-[#0b1222] border border-slate-800">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center overflow-hidden shrink-0">
                {adminUser?.avatar ? (
                  <img
                    src={adminUser.avatar}
                    alt={adminUser.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-black text-blue-400">
                    {adminUser?.name?.[0] || 'A'}
                  </span>
                )}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-white leading-tight">
                  {adminUser?.name || 'Administrator'}
                </span>
                <span className="block text-[10px] text-emerald-400 font-semibold tracking-wider uppercase">
                  {adminUser?.role || 'Master Admin'}
                </span>
              </div>
            </div>

            {/* Standalone Logout Button */}
            <button
              type="button"
              onClick={handleLogoutClick}
              title="Logout from Admin Portal"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 text-xs font-bold transition-all duration-200 cursor-pointer group"
            >
              <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">LOGOUT</span>
            </button>
          </div>

        </header>

        {/* Page Content View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Popup Modal (image_13.png) */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => !isLoggingOut && setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        isLoggingOut={isLoggingOut}
        activePageName={activeItem?.name ? `${activeItem.name} View` : 'SmartThighs Symmetry Landing Page'}
      />
    </div>
  )
}

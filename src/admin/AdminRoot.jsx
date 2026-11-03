import React, { useState, useEffect } from 'react'
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext'
import AdminLayout from './AdminLayout'
import DesktopEditingRestrictedOverlay from './dashboard/DesktopEditingRestrictedOverlay'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminSignupPage from './pages/AdminSignupPage'
import AdminForgotPasswordPage from './pages/AdminForgotPasswordPage'
import AdminResetPasswordPage from './pages/AdminResetPasswordPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminBlogsPage from './pages/AdminBlogsPage'
import AdminFaqsPage from './pages/AdminFaqsPage'
import AdminOrdersPage from './pages/AdminOrdersPage'
import { StorefrontAnimationContext } from '../components/StorefrontMotion'

function AdminRouter({ currentPath, onNavigate }) {
  const { isAuthenticated } = useAdminAuth()

  // Viewport width monitoring: restrict admin editing to desktop screens (width >= 800px)
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  const isDesktopScreen = viewportWidth >= 800

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Clean trailing slashes & strip query string for robust route matching
  const basePath = currentPath ? currentPath.split('?')[0] : '/admin'
  const normalizedPath = basePath.length > 1
    ? basePath.replace(/\/+$/, '')
    : basePath || '/admin'

  // Route Protection: Redirect unauthenticated requests to /admin/login
  useEffect(() => {
    if (!isAuthenticated) {
      if (
        normalizedPath !== '/admin/login' &&
        normalizedPath !== '/admin/signup' &&
        normalizedPath !== '/admin/forgot-password' &&
        normalizedPath !== '/admin/reset-password'
      ) {
        onNavigate('/admin/login')
      }
    } else {
      if (
        normalizedPath === '/admin/login' ||
        normalizedPath === '/admin/signup' ||
        normalizedPath === '/admin/forgot-password' ||
        normalizedPath === '/admin/reset-password' ||
        normalizedPath === '/admin'
      ) {
        onNavigate('/admin/dashboard')
      }
    }
  }, [isAuthenticated, normalizedPath, onNavigate])

  // Unauthenticated Routes
  if (!isAuthenticated) {
    if (normalizedPath === '/admin/signup') {
      return <AdminSignupPage onNavigate={onNavigate} />
    }
    if (normalizedPath === '/admin/forgot-password') {
      return <AdminForgotPasswordPage onNavigate={onNavigate} />
    }
    if (normalizedPath === '/admin/reset-password') {
      return <AdminResetPasswordPage onNavigate={onNavigate} />
    }
    return <AdminLoginPage onNavigate={onNavigate} />
  }

  // Authenticated Protected Routes
  return (
    <>
      {!isDesktopScreen && (
        <DesktopEditingRestrictedOverlay onNavigate={onNavigate} />
      )}
      {normalizedPath === '/admin/dashboard' || normalizedPath === '/admin' ? (
        <AdminDashboardPage onNavigate={onNavigate} />
      ) : (
        <AdminLayout currentPath={normalizedPath} onNavigate={onNavigate}>
          {normalizedPath === '/admin/products' ? (
            <AdminProductsPage onNavigate={onNavigate} />
          ) : normalizedPath === '/admin/blogs' || normalizedPath === '/admin/blog' ? (
            <AdminBlogsPage onNavigate={onNavigate} />
          ) : normalizedPath === '/admin/faqs' || normalizedPath === '/admin/faq' ? (
            <AdminFaqsPage onNavigate={onNavigate} />
          ) : normalizedPath === '/admin/orders' ? (
            <AdminOrdersPage onNavigate={onNavigate} />
          ) : (
            <AdminDashboardPage onNavigate={onNavigate} />
          )}
        </AdminLayout>
      )}
    </>
  )
}

export default function AdminRoot({ currentPath, onNavigate }) {
  // Real-time window resize listener: restrict admin portal to desktop screens (width >= 800px)
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  )
  const isDesktopScreen = viewportWidth >= 800

  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <StorefrontAnimationContext.Provider value={false}>
      <div data-admin-root="true" className="admin-workspace relative">
        {/* Desktop-Only Real-Time Blocking Overlay (< 800px) */}
        {!isDesktopScreen && (
          <DesktopEditingRestrictedOverlay onNavigate={onNavigate} />
        )}
        <AdminAuthProvider>
          <AdminRouter currentPath={currentPath} onNavigate={onNavigate} />
        </AdminAuthProvider>
      </div>
    </StorefrontAnimationContext.Provider>
  )
}

import React, { useEffect } from 'react'
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext'
import AdminLayout from './AdminLayout'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminSignupPage from './pages/AdminSignupPage'
import AdminForgotPasswordPage from './pages/AdminForgotPasswordPage'
import AdminResetPasswordPage from './pages/AdminResetPasswordPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminBlogsPage from './pages/AdminBlogsPage'
import AdminFaqsPage from './pages/AdminFaqsPage'
import AdminOrdersPage from './pages/AdminOrdersPage'

function AdminRouter({ currentPath, onNavigate }) {
  const { isAuthenticated } = useAdminAuth()

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
  if (normalizedPath === '/admin/dashboard' || normalizedPath === '/admin') {
    return <AdminDashboardPage onNavigate={onNavigate} />
  }

  return (
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
  )
}

export default function AdminRoot({ currentPath, onNavigate }) {
  return (
    <AdminAuthProvider>
      <AdminRouter currentPath={currentPath} onNavigate={onNavigate} />
    </AdminAuthProvider>
  )
}

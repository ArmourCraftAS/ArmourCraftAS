import React, { useEffect } from 'react'
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext'
import AdminLayout from './AdminLayout'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminSignupPage from './pages/AdminSignupPage'
import AdminForgotPasswordPage from './pages/AdminForgotPasswordPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminOrdersPage from './pages/AdminOrdersPage'

function AdminRouter({ currentPath, onNavigate }) {
  const { isAuthenticated } = useAdminAuth()

  // Clean trailing slashes for robust route matching (e.g. /admin/ -> /admin)
  const normalizedPath = currentPath && currentPath.length > 1
    ? currentPath.replace(/\/+$/, '')
    : currentPath || '/admin'

  // Route Protection: Redirect unauthenticated requests to /admin/login
  useEffect(() => {
    if (!isAuthenticated) {
      if (
        normalizedPath !== '/admin/login' &&
        normalizedPath !== '/admin/signup' &&
        normalizedPath !== '/admin/forgot-password'
      ) {
        onNavigate('/admin/login')
      }
    } else {
      if (
        normalizedPath === '/admin/login' ||
        normalizedPath === '/admin/signup' ||
        normalizedPath === '/admin/forgot-password' ||
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
    return <AdminLoginPage onNavigate={onNavigate} />
  }

  // Authenticated Protected Routes inside Standalone AdminLayout
  return (
    <AdminLayout currentPath={normalizedPath} onNavigate={onNavigate}>
      {normalizedPath === '/admin/products' ? (
        <AdminProductsPage onNavigate={onNavigate} />
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

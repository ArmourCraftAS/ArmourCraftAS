import React, { useEffect } from 'react'
import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext'
import AdminLayout from './AdminLayout'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminSignupPage from './pages/AdminSignupPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminProductsPage from './pages/AdminProductsPage'
import AdminOrdersPage from './pages/AdminOrdersPage'

function AdminRouter({ currentPath, onNavigate }) {
  const { isAuthenticated } = useAdminAuth()

  // Route Protection: Redirect unauthenticated requests to /admin/login
  useEffect(() => {
    if (!isAuthenticated) {
      if (currentPath !== '/admin/login' && currentPath !== '/admin/signup') {
        onNavigate('/admin/login')
      }
    } else {
      if (currentPath === '/admin/login' || currentPath === '/admin/signup' || currentPath === '/admin') {
        onNavigate('/admin/dashboard')
      }
    }
  }, [isAuthenticated, currentPath, onNavigate])

  // Unauthenticated Routes
  if (!isAuthenticated) {
    if (currentPath === '/admin/signup') {
      return <AdminSignupPage onNavigate={onNavigate} />
    }
    return <AdminLoginPage onNavigate={onNavigate} />
  }

  // Authenticated Protected Routes inside Standalone AdminLayout
  return (
    <AdminLayout currentPath={currentPath} onNavigate={onNavigate}>
      {currentPath === '/admin/products' ? (
        <AdminProductsPage onNavigate={onNavigate} />
      ) : currentPath === '/admin/orders' ? (
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

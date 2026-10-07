'use client'

import React from 'react'
import AdminLoginPage from '../../../src/admin/pages/AdminLoginPage'
import { AdminAuthProvider } from '../../../src/admin/AdminAuthContext'

export default function AdminLoginRoutePage() {
  const handleNavigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path)
      window.location.href = path
    }
  }

  return (
    <AdminAuthProvider>
      <AdminLoginPage onNavigate={handleNavigate} />
    </AdminAuthProvider>
  )
}

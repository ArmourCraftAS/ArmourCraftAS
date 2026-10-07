'use client'

import React from 'react'
import AdminResetPasswordPage from '../../../src/admin/pages/AdminResetPasswordPage'
import { AdminAuthProvider } from '../../../src/admin/AdminAuthContext'

export default function AdminResetPasswordRoutePage() {
  const handleNavigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path)
      window.location.href = path
    }
  }

  return (
    <AdminAuthProvider>
      <AdminResetPasswordPage onNavigate={handleNavigate} />
    </AdminAuthProvider>
  )
}

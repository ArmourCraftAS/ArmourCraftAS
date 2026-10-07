'use client'

import React from 'react'
import AdminForgotPasswordPage from '../../../src/admin/pages/AdminForgotPasswordPage'
import { AdminAuthProvider } from '../../../src/admin/AdminAuthContext'

export default function AdminForgotPasswordRoutePage() {
  const handleNavigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path)
      window.location.href = path
    }
  }

  return (
    <AdminAuthProvider>
      <AdminForgotPasswordPage onNavigate={handleNavigate} />
    </AdminAuthProvider>
  )
}

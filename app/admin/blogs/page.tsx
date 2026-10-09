'use client'

import React, { useState, useEffect } from 'react'
import AdminRoot from '../../../src/admin/AdminRoot'

export default function AdminBlogsRoute() {
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/admin/blogs'
  )

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleNavigate = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path)
      setCurrentPath(path)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return <AdminRoot currentPath={currentPath} onNavigate={handleNavigate} />
}

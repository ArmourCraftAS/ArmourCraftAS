import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout({ children, cartCount = 2 }) {
  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Persistent Global Header / Navbar */}
      <Navbar cartCount={cartCount} />

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Persistent Global Footer */}
      <Footer />
    </div>
  )
}

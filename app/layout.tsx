import React from 'react'
import Navbar from '../src/components/Navbar'
import Footer from '../src/components/Footer'

export const metadata = {
  title: 'ArmourCraft AS | Next-Gen Ergonomic Thigh Protection',
  description:
    'Sialkot-crafted high-performance cricket thigh guards. Built with high-density EVA foam and non-slip straps to withstand 140+ km/h leather ball impacts.'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        {/* Global Persistent Header / Navbar */}
        <Navbar cartCount={2} />

        {/* Dynamic Page Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Global Persistent Footer */}
        <Footer />
      </body>
    </html>
  )
}

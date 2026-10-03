import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProMatchEssentials from './components/ProMatchEssentials'
import ArmourAdvantage from './components/ArmourAdvantage'
import CustomGearBanner from './components/CustomGearBanner'
import ComparisonTable from './components/ComparisonTable'
import SmartCollection from './components/SmartCollection'
import Testimonials from './components/Testimonials'
import FAQ from './components/FAQ'
import Footer from './components/Footer'
import ShopPage from './pages/ShopPage'

export default function App() {
  const [cartCount, setCartCount] = useState(2)
  const [currentPath, setCurrentPath] = useState(
    typeof window !== 'undefined' ? window.location.pathname : '/'
  )

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1)
  }

  const isShopRoute = currentPath === '/shop' || currentPath === '/shop-armours'

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Header / Navbar (Persistent across all routes) */}
      <Navbar
        cartCount={cartCount}
        currentPath={currentPath}
        onNavigate={navigate}
      />

      {/* 2. Main Body: Switch between Home and Shop */}
      <main className="flex-1">
        {isShopRoute ? (
          <ShopPage onAddToCart={handleAddToCart} />
        ) : (
          <>
            {/* Hero Section */}
            <Hero onNavigate={navigate} />

            {/* PRO MATCH ESSENTIALS Section */}
            <ProMatchEssentials
              onAddToCart={handleAddToCart}
              onNavigate={navigate}
            />

            {/* THE ARMOURCRAFT ADVANTAGE Section */}
            <ArmourAdvantage />

            {/* CUSTOM TEAM GEAR & JERSEY MATCHING Banner */}
            <CustomGearBanner />

            {/* SmartThighs vs. The Others Comparison Table Section */}
            <ComparisonTable />

            {/* BROWSE THE SMART COLLECTION Section */}
            <SmartCollection onAddToCart={handleAddToCart} />

            {/* TRUSTED BY 10,000+ BATSMEN Testimonials Section */}
            <Testimonials />

            {/* Frequently Asked Questions (FAQ) Section */}
            <FAQ />
          </>
        )}
      </main>

      {/* 3. Global Persistent Footer */}
      <Footer onNavigate={navigate} />
    </div>
  )
}

import React, { useState } from 'react'
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

export default function App() {
  const [cartCount, setCartCount] = useState(2)

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans">
      {/* 1. Header / Navbar */}
      <Navbar cartCount={cartCount} />

      {/* 2. Main Body */}
      <main className="flex-1">
        {/* Hero Section */}
        <Hero />

        {/* PRO MATCH ESSENTIALS Section */}
        <ProMatchEssentials onAddToCart={handleAddToCart} />

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
      </main>

      {/* 3. Global Persistent Footer */}
      <Footer />
    </div>
  )
}

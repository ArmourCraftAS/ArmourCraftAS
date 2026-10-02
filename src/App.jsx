import React, { useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProMatchEssentials from './components/ProMatchEssentials'
import ArmourAdvantage from './components/ArmourAdvantage'
import { Shield, Wind, Crosshair, Award } from 'lucide-react'

export default function App() {
  const [cartCount, setCartCount] = useState(2)

  const specs = [
    {
      icon: <Shield className="w-6 h-6 text-blue-400" />,
      title: 'Ballistic Carbon Core',
      desc: 'Multi-layer composite foam absorbs 94% of shock wave energy from 160 km/h impacts.'
    },
    {
      icon: <Wind className="w-6 h-6 text-cyan-400" />,
      title: 'Featherlight Ergonomics',
      desc: 'Under 180 grams with micro-perforated airflow channels to keep you cool and agile.'
    },
    {
      icon: <Crosshair className="w-6 h-6 text-indigo-400" />,
      title: 'Zero-Stance Restriction',
      desc: 'Anatomically molded curve contours to forward lunges and backfoot punches without shifting.'
    },
    {
      icon: <Award className="w-6 h-6 text-blue-400" />,
      title: 'ICC Test Certified',
      desc: 'Trusted by international openers and middle-order batsmen globally.'
    }
  ]

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

        {/* THE ARMOURCRAFT ADVANTAGE Section (Appended right below products) */}
        <ArmourAdvantage />

        {/* Feature Specs Strip */}
        <section id="about" className="relative z-10 border-t border-slate-800/80 bg-[#070d18]/80 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {specs.map((spec, i) => (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-[#0b1222]/60 border border-slate-800/60 hover:border-blue-500/40 transition-all duration-300 hover:translate-y-[-2px] group"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-950/60 border border-blue-500/30 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    {spec.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{spec.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{spec.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* 3. Footer */}
      <footer className="border-t border-slate-900 bg-[#04070d] py-10 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold tracking-wider text-slate-300">
            <span>ARMOURCRAFT AS</span>
            <span className="text-blue-500">•</span>
            <span className="text-slate-500 font-normal">Next-Gen Cricket Protection</span>
          </div>
          <p>© 2026 ArmourCraft AS. All rights reserved. Precision engineered for high-velocity sports.</p>
        </div>
      </footer>
    </div>
  )
}

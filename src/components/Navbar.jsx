import React, { useState } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Home')

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Shop Armours', href: '#shop' },
    { name: 'What We Are', href: '#about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contact Us', href: '#contact' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060a12]/95 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex items-center justify-center">
            {/* Stylized Futuristic "A" Logo */}
            <svg
              viewBox="0 0 100 100"
              className="w-10 h-10 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)] transition-transform duration-300 group-hover:scale-105"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer orbital ring */}
              <ellipse
                cx="50"
                cy="50"
                rx="44"
                ry="22"
                transform="rotate(-28 50 50)"
                stroke="url(#blueGrad)"
                strokeWidth="4"
                strokeDasharray="180 50"
              />
              {/* Triangular dynamic A shield */}
              <path
                d="M50 14L22 84L38 84L50 52L62 84L78 84L50 14Z"
                fill="url(#silverGrad)"
                stroke="#60a5fa"
                strokeWidth="1.5"
              />
              <path
                d="M34 64H66L50 30L34 64Z"
                fill="#060a12"
              />
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#60a5fa" />
                  <stop offset="0.5" stopColor="#2563eb" />
                  <stop offset="1" stopColor="#1d4ed8" />
                </linearGradient>
                <linearGradient id="silverGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#f8fafc" />
                  <stop offset="0.5" stopColor="#94a3b8" />
                  <stop offset="1" stopColor="#cbd5e1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="tracking-wider flex items-center font-bold text-lg select-none">
            <span className="text-white tracking-widest font-extrabold text-xl">ARMOUR</span>
            <span className="text-blue-500 tracking-widest font-extrabold text-xl ml-0.5">CRAFT</span>
            <span className="text-slate-200 tracking-wider font-bold text-xl ml-1.5">AS</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = activeNav === link.name
            return (
              <div key={link.name} className="relative py-2">
                <button
                  onClick={() => setActiveNav(link.name)}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-white ${
                    isActive ? 'text-white font-semibold' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                </button>
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                )}
              </div>
            )
          })}
        </nav>

        {/* Right Action: Cart Button */}
        <div className="hidden md:flex items-center">
          <button className="flex items-center gap-2.5 bg-[#1762f0] hover:bg-[#1354d4] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 shadow-md shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98]">
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>CART (2)</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <button className="flex items-center gap-1.5 bg-[#1762f0] text-white px-3 py-1.5 rounded-full text-xs font-bold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>(2)</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070d18] border-b border-slate-800 px-6 py-5 space-y-4">
          {navLinks.map((link) => (
            <div key={link.name}>
              <button
                onClick={() => {
                  setActiveNav(link.name)
                  setMobileMenuOpen(false)
                }}
                className={`block w-full text-left py-2 text-base font-medium ${
                  activeNav === link.name ? 'text-blue-400 font-bold' : 'text-slate-300'
                }`}
              >
                {link.name}
              </button>
            </div>
          ))}
        </div>
      )}
    </header>
  )
}

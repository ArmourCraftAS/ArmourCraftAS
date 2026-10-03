import React, { useState } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'

export default function Navbar({ cartCount = 2, currentPath = '/', onNavigate }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isShop = currentPath === '/shop' || currentPath === '/shop-armours'
  const activeNav = isShop ? 'Shop Armours' : 'Home'

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Armours', path: '/shop' },
    { name: 'What We Are', path: '/#about', hash: '#about' },
    { name: 'Blog', path: '/#blog', hash: '#blog' },
    { name: 'Contact Us', path: '/#contact', hash: '#contact' },
  ]

  const handleNavClick = (link) => {
    if (onNavigate) {
      if (link.path === '/shop') {
        onNavigate('/shop')
      } else if (link.path === '/') {
        onNavigate('/')
      } else if (link.hash) {
        if (currentPath !== '/') {
          onNavigate('/')
          setTimeout(() => {
            const el = document.querySelector(link.hash)
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }, 100)
        } else {
          const el = document.querySelector(link.hash)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#060a12]/95 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            if (onNavigate) onNavigate('/')
          }}
          className="flex items-center group py-1 cursor-pointer"
        >
          <img
            src="/images/logo.png"
            alt="ARMOURCRAFT AS"
            className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] drop-shadow-[0_2px_14px_rgba(37,99,235,0.3)] select-none"
            loading="eager"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = activeNav === link.name
            return (
              <div key={link.name} className="relative py-2">
                <button
                  type="button"
                  onClick={() => handleNavClick(link)}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-white cursor-pointer ${
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
          <button className="flex items-center gap-2.5 bg-[#1762f0] hover:bg-[#1354d4] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 shadow-md shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer">
            <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>CART ({cartCount})</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <button className="flex items-center gap-1.5 bg-[#1762f0] text-white px-3 py-1.5 rounded-full text-xs font-bold">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>({cartCount})</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#070d18] border-b border-slate-800 px-6 py-5 space-y-4">
          {navLinks.map((link) => {
            const isActive = activeNav === link.name
            return (
              <div key={link.name}>
                <button
                  type="button"
                  onClick={() => handleNavClick(link)}
                  className={`block w-full text-left py-2 text-base font-medium cursor-pointer ${
                    isActive ? 'text-blue-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </header>
  )
}

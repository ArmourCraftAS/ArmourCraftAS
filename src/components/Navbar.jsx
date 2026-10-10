import React, { useState } from 'react'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStorefrontMotion } from './StorefrontMotion'

export default function Navbar({ cartCount = 0, currentPath = '/', onNavigate, onOpenCart }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMotionEnabled = useStorefrontMotion()

  const isShop = currentPath === '/shop' || currentPath === '/shop-armours'
  const isWhatWeAre = currentPath === '/what-we-are' || currentPath === '/about'
  const isBlog = currentPath === '/blog' || currentPath.startsWith('/blog')
  const isContact = currentPath === '/contact' || currentPath.startsWith('/contact')
  const activeNav = isShop ? 'Shop Armours' : isWhatWeAre ? 'What We Are' : isBlog ? 'Blog' : isContact ? 'Contact Us' : 'Home'

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Armours', path: '/shop' },
    { name: 'What We Are', path: '/what-we-are' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
  ]

  const handleNavClick = (link) => {
    if (onNavigate) {
      if (link.path && !link.hash) {
        onNavigate(link.path)
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

  const HeaderTag = isMotionEnabled ? motion.header : 'header'
  const headerMotionProps = isMotionEnabled
    ? {
        initial: { y: -70, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
      }
    : {}

  return (
    <HeaderTag
      {...headerMotionProps}
      className="sticky top-0 z-50 w-full bg-[#060a12]/95 backdrop-blur-md border-b border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault()
            if (onNavigate) onNavigate('/')
          }}
          className="flex items-center group py-1 cursor-pointer bg-transparent"
        >
          <img
            src="/images/logo_transparent.png"
            alt="ARMOURCRAFT AS"
            className="h-11 sm:h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105 select-none bg-transparent mix-blend-screen"
            style={{ mixBlendMode: 'screen' }}
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
                  className={`text-sm font-medium transition-all duration-200 cursor-pointer nav-link-glow ${
                    isActive ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.name}
                </button>
                {/* Active indicator bar */}
                {isActive && (
                  isMotionEnabled ? (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.9)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  ) : (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )
                )}
              </div>
            )
          })}
        </nav>

        {/* Right Action: Dynamic Cart Button with Micro-interactions */}
        <div className="hidden md:flex items-center">
          {isMotionEnabled ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97, y: 0 }}
              onClick={onOpenCart}
              aria-label={`View Cart, currently ${cartCount} items`}
              className="flex items-center gap-2.5 bg-[#1762f0] hover:bg-[#1354d4] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-colors duration-200 shadow-md shadow-blue-600/30 hover:shadow-blue-500/50 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>CART ({cartCount})</span>
            </motion.button>
          ) : (
            <button
              type="button"
              onClick={onOpenCart}
              aria-label={`View Cart, currently ${cartCount} items`}
              className="flex items-center gap-2.5 bg-[#1762f0] hover:bg-[#1354d4] text-white px-5 py-2.5 rounded-full text-xs font-bold tracking-wider transition-all duration-200 shadow-md shadow-blue-600/30 hover:shadow-blue-500/50 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>CART ({cartCount})</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-3">
          <button
            type="button"
            onClick={onOpenCart}
            aria-label={`View Cart, currently ${cartCount} items`}
            className="flex items-center gap-1.5 bg-[#1762f0] text-white px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-transform active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>({cartCount})</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none cursor-pointer transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Smooth Accordion Entrance */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-[#070d18] border-b border-slate-800 px-6 py-5 space-y-4 overflow-hidden"
          >
            {navLinks.map((link) => {
              const isActive = activeNav === link.name
              return (
                <div key={link.name}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(link)}
                    className={`block w-full text-left py-2 text-base font-medium cursor-pointer transition-colors ${
                      isActive ? 'text-blue-400 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                  >
                    {link.name}
                  </button>
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </HeaderTag>
  )
}


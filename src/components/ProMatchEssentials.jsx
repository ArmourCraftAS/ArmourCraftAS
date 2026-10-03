import React, { useState } from 'react'
import { Hammer, Zap, ShieldCheck, Lock, ShoppingCart, Check, ExternalLink } from 'lucide-react'

export default function ProMatchEssentials({ onAddToCart, onNavigate }) {
  const [addedItem, setAddedItem] = useState(null)

  const featureHighlights = [
    {
      icon: <Hammer className="w-5 h-5 text-blue-400 stroke-[2]" />,
      title: 'Sialkot Crafted',
      desc: 'Handmade with Premium Materials.'
    },
    {
      icon: <Zap className="w-5 h-5 text-blue-400 stroke-[2]" />,
      title: '140+ KM/H Ready',
      desc: 'Tested Against Hard Season Leather Balls.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-blue-400 stroke-[2]" />,
      title: '500+ Matches Trusted',
      desc: 'Used by Club & Academy Cricketers.'
    },
    {
      icon: <Lock className="w-5 h-5 text-blue-400 stroke-[2]" />,
      title: 'Zero Shift Fit',
      desc: 'Double-Strap Lock for Fast Running.'
    }
  ]

  const products = [
    {
      id: 'pro-dual-thigh',
      title: 'Pro Dual-Leg Thigh Guard Set',
      price: '$79.99',
      image: '/images/product_thigh_guard.png',
      alt: 'Pro Dual-Leg Thigh Guard Set'
    },
    {
      id: 'aero-leg-guards',
      title: 'Aero Ultra-Light Leg Guards',
      price: '$119.99',
      image: '/images/product_leg_guard.png',
      alt: 'Aero Ultra-Light Leg Guards'
    },
    {
      id: 'smart-inner-thigh',
      title: 'Smart Inner Thigh Guard',
      price: '$39.99',
      image: '/images/product_inner_guard.png',
      alt: 'Smart Inner Thigh Guard'
    }
  ]

  const handleAddToCart = (product) => {
    setAddedItem(product.id)
    if (onAddToCart) {
      onAddToCart(product)
    }
    setTimeout(() => {
      setAddedItem(null)
    }, 1800)
  }

  return (
    <section id="shop" className="relative w-full bg-[#080d19] text-white">
      
      {/* 1. Feature Highlights Bar (Top 4-Column Bar) */}
      <div className="w-full bg-[#0a152d] border-y border-blue-900/30 py-6 px-4 sm:px-6 lg:px-8 shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featureHighlights.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-3.5 group">
              {/* Rounded Square Icon Badge */}
              <div className="w-11 h-11 rounded-xl bg-[#0f2554] border border-blue-500/25 flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20 group-hover:scale-105 group-hover:border-blue-400/50 transition-all duration-200">
                {feature.icon}
              </div>
              <div>
                <h4 className="text-white font-bold text-sm tracking-wide group-hover:text-blue-300 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-slate-400 text-xs leading-relaxed mt-0.5">
                  {feature.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Main Section Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
              PRO MATCH ESSENTIALS
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              Elite-level protection for competitive cricket.
            </p>
          </div>

          <a
            href="/shop"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault()
                onNavigate('/shop')
              }
            }}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1d68ed] hover:text-blue-400 tracking-wider uppercase transition-colors group self-start sm:self-auto border-b-2 border-transparent hover:border-blue-500 pb-0.5 cursor-pointer"
          >
            <span>VIEW ALL PRODUCTS</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        {/* 3. Product Cards Grid (3 Cards in a row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => {
            const isAdded = addedItem === product.id
            return (
              <div
                key={product.id}
                className="bg-[#0b1222] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-950/40 transition-all duration-300 group"
              >
                {/* Product Image Frame */}
                <div className="relative w-full aspect-square bg-[#050811] rounded-xl border border-slate-800/60 overflow-hidden flex items-center justify-center p-4 mb-5">
                  <img
                    src={product.image}
                    alt={product.alt}
                    className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-300 ease-out select-none"
                    loading="lazy"
                  />
                  {/* Subtle top subtle highlight */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] pointer-events-none" />
                </div>

                {/* Product Title & Price Row */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <h3 className="text-white font-bold text-sm sm:text-base leading-snug group-hover:text-blue-200 transition-colors">
                    {product.title}
                  </h3>
                  <span className="text-white font-extrabold text-base sm:text-lg tracking-tight shrink-0">
                    {product.price}
                  </span>
                </div>

                {/* Add to Cart Full-Width Blue Button */}
                <button
                  onClick={() => handleAddToCart(product)}
                  className={`w-full py-3.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all duration-200 shadow-md ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-emerald-500/30 scale-[0.99]'
                      : 'bg-[#1762f0] hover:bg-[#1354d4] text-white shadow-blue-600/30 hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.98]'
                  }`}
                >
                  <span className="font-extrabold tracking-widest">
                    {isAdded ? 'ADDED TO CART' : 'ADD TO CART'}
                  </span>
                  {isAdded ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                  )}
                </button>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

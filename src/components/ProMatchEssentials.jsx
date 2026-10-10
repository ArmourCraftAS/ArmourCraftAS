import React, { useState } from 'react'
import { Hammer, Zap, ShieldCheck, Lock, ShoppingCart, ExternalLink } from 'lucide-react'
import { useCmsContent } from '../admin/cmsStore'
import { FadeIn, StaggerContainer, StaggerItem } from './StorefrontMotion'

export default function ProMatchEssentials({ onAddToCart, onNavigate }) {
  const [addedItem, setAddedItem] = useState(null)
  const heading = useCmsContent('home.essentials.heading', 'PRO MATCH ESSENTIALS')
  const subheading = useCmsContent('home.essentials.subheading', 'Elite-level protection for competitive cricket.')

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
      alt: 'ARMOURCRAFT AS Pro Dual-Leg Cricket Thigh Guard Set - 160+ km/h Impact Tested'
    },
    {
      id: 'aero-leg-guards',
      title: 'Aero Ultra-Light Leg Guards',
      price: '$119.99',
      image: '/images/product_leg_guard.png',
      alt: 'ARMOURCRAFT AS Aero Ultra-Light Cricket Batting Leg Guards'
    },
    {
      id: 'smart-inner-thigh',
      title: 'Smart Inner Thigh Guard',
      price: '$39.99',
      image: '/images/product_inner_guard.png',
      alt: 'ARMOURCRAFT AS Smart Inner Cricket Thigh Guard - High Density EVA Protection'
    }
  ]

  const handleAddToCart = (product) => {
    setAddedItem(product.id)
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  return (
    <section id="shop" className="relative w-full bg-[#080d19] text-white">
      
      {/* 1. Feature Highlights Bar (Top 4-Column Bar) */}
      <div className="w-full bg-[#0a152d] border-y border-blue-900/30 py-6 px-4 sm:px-6 lg:px-8 shadow-inner">
        <StaggerContainer
          staggerDelay={0.08}
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {featureHighlights.map((feature, idx) => (
            <StaggerItem key={idx}>
              <div className="flex items-center gap-3.5 group">
                {/* Rounded Square Icon Badge */}
                <div className="w-11 h-11 rounded-xl bg-[#0f2554] border border-blue-500/25 flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20 group-hover:scale-110 group-hover:border-blue-400/50 transition-all duration-300">
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
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>

      {/* 2. Main Section Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        
        {/* Section Header */}
        <FadeIn direction="up" distance={20}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <h2
                data-cms-path="home.essentials.heading"
                data-cms-label="Pro Match Essentials Heading"
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase"
              >
                {heading}
              </h2>
              <p
                data-cms-path="home.essentials.subheading"
                data-cms-label="Pro Match Essentials Subtitle"
                className="text-slate-400 text-sm sm:text-base mt-2"
              >
                {subheading}
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
        </FadeIn>

        {/* 3. Product Cards Grid (3 Cards in a row) */}
        <StaggerContainer staggerDelay={0.12} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <div
                data-dynamic-type="product"
                data-dynamic-id={product.id}
                data-dynamic-title={product.title}
                className="bg-[#0b1222] border border-slate-800/90 rounded-2xl p-5 flex flex-col justify-between card-elevate group h-full"
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
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  className="w-full py-3.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-all duration-200 shadow-md bg-[#1762f0] hover:bg-[#1354d4] text-white shadow-blue-600/30 hover:shadow-blue-500/50 btn-elevate cursor-pointer mt-auto"
                >
                  <span className="font-extrabold tracking-widest">
                    ADD TO CART
                  </span>
                  <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  )
}


import React, { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useCmsContent } from '../admin/cmsStore'
import { FadeIn, StaggerContainer, StaggerItem } from './StorefrontMotion'

export default function SmartCollection({ onAddToCart }) {
  const [activeTab, setActiveTab] = useState('ALL')
  const [addedItem, setAddedItem] = useState(null)
  const heading = useCmsContent('home.showcase.heading', 'BROWSE THE SMART COLLECTION')

  const defaultProducts = [
    {
      id: 'straps',
      title: 'FLEX-FIT REPLACEMENT STRAPS',
      subtitle: 'Pack of 4 • Industrial Strength',
      price: '$19.99',
      category: 'THIGH PADS',
      image: '/images/product_straps.png',
      alt: 'ARMOURCRAFT AS Flex-Fit Double-Velcro Cricket Thigh Guard Replacement Straps'
    },
    {
      id: 'spray',
      title: 'FRESHGUARD HYGIENE SPRAY',
      subtitle: 'Eliminates odors & bacteria',
      price: '$14.99',
      category: 'ALL',
      image: '/images/product_spray.png',
      alt: 'ARMOURCRAFT AS FreshGuard Anti-Bacterial Cricket Equipment Hygiene Spray'
    },
    {
      id: 'sleeves',
      title: 'PRO-COMFORT COMPRESSION SLEEVES',
      subtitle: 'Under-guard muscle support',
      price: '$29.99',
      category: 'LEG PADS',
      image: '/images/product_sleeves.png',
      alt: 'ARMOURCRAFT AS Pro-Comfort Moisture-Wicking Cricket Compression Sleeves'
    },
    {
      id: 'youth',
      title: 'YOUTH ELITE THIGH GUARD',
      subtitle: 'Ages 8-14 • High Impact EVA',
      price: '$54.99',
      category: 'THIGH PADS',
      image: '/images/product_youth_guard.png',
      alt: 'ARMOURCRAFT AS Youth Elite Junior Cricket Thigh Guard for Academy Batsmen'
    }
  ]

  const [allProducts, setAllProducts] = useState(() => {
    if (typeof window === 'undefined') return defaultProducts
    try {
      const saved = window.localStorage.getItem('armourcraft_admin_products_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch {}
    return defaultProducts
  })

  useEffect(() => {
    const handleUpdate = (e) => {
      if (Array.isArray(e.detail) && e.detail.length > 0) {
        setAllProducts(e.detail)
      }
    }
    window.addEventListener('armourcraft:products-updated', handleUpdate)
    return () => window.removeEventListener('armourcraft:products-updated', handleUpdate)
  }, [])

  const categories = ['ALL', 'THIGH PADS', 'LEG PADS', 'GLOVES', 'HELMET']

  const filteredProducts = activeTab === 'ALL' 
    ? allProducts 
    : allProducts.filter(p => {
        const cat = (p.category || '').toUpperCase()
        return cat.includes(activeTab) || activeTab.includes(cat) || p.category === 'ALL'
      })

  const handleAdd = (product) => {
    setAddedItem(product.id)
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  return (
    <section className="relative w-full bg-[#060a12] py-20 lg:py-28 px-4 sm:px-6 lg:px-8 text-white border-t border-slate-900/80 overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <FadeIn direction="up" distance={20}>
          <h2
            data-cms-path="home.showcase.heading"
            data-cms-label="Smart Collection Heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center tracking-tight uppercase mb-8"
          >
            {heading}
          </h2>
        </FadeIn>

        {/* Category Filter Tabs */}
        <FadeIn direction="up" distance={15} delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-14">
            {categories.map((tab) => {
              const isActive = activeTab === tab
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 sm:px-6 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#1762f0] text-white shadow-lg shadow-blue-600/35 scale-[1.02]'
                      : 'bg-[#0d1627] hover:bg-[#121f36] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {tab}
                </button>
              )
            })}
          </div>
        </FadeIn>

        {/* Product Grid (4 Columns) with Staggered Scroll Reveal */}
        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <StaggerItem key={product.id}>
              <div
                data-dynamic-type="product"
                data-dynamic-id={product.id}
                data-dynamic-title={product.title}
                className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-4 sm:p-5 flex flex-col justify-between card-elevate group h-full"
              >
                {/* Product Image Frame */}
                <div className="w-full aspect-square rounded-xl bg-[#060a14] border border-slate-800/60 overflow-hidden flex items-center justify-center p-3 mb-4">
                  <img
                    src={product.image}
                    alt={product.alt}
                    className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-300 ease-out select-none"
                    loading="lazy"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-bold text-xs sm:text-sm uppercase tracking-wide leading-snug group-hover:text-blue-300 transition-colors mb-1">
                      {product.title}
                    </h3>
                    <p className="text-slate-400 text-xs mb-3 leading-snug">
                      {product.subtitle}
                    </p>
                  </div>

                  <div className="text-white font-black text-base sm:text-lg mb-4">
                    {product.price}
                  </div>
                </div>

                {/* Dark ADD TO CART Button */}
                <button
                  type="button"
                  onClick={() => handleAdd(product)}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 border bg-[#090e1a] hover:bg-[#1762f0] text-slate-300 hover:text-white border-slate-800 hover:border-blue-500 btn-elevate cursor-pointer mt-auto"
                >
                  <span>ADD TO CART</span>
                  <ShoppingCart className="w-3.5 h-3.5" />
                </button>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

      </div>
    </section>
  )
}


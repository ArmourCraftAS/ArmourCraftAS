import React, { useState, useEffect, useMemo } from 'react'
import { Search, ShoppingCart } from 'lucide-react'
import CustomSquadBanner from '../components/CustomSquadBanner'
import { initialAdminProducts } from '../admin/data/initialProducts'
import { supabase } from '../../lib/supabaseClient'
import { useCmsContent } from '../admin/cmsStore'
import { FadeIn, StaggerContainer, StaggerItem, ScrollReveal } from '../components/StorefrontMotion'

export default function ShopPage({ onAddToCart }) {
  const heading = useCmsContent('shop.heading', 'ALL PROTECTION GEAR')
  const subheading = useCmsContent('shop.subheading', 'Simple, lightweight, and pro-tested cricket pads engineered for maximum comfort and elite performance.')
  const [activeCategory, setActiveCategory] = useState('All Products')
  const [activeStance, setActiveStance] = useState('All Stances')
  const [searchQuery, setSearchQuery] = useState('')
  const [addedItem, setAddedItem] = useState(null)

  // 1. Dynamic Products List initialized from localStorage / fallback
  const [productsList, setProductsList] = useState(() => {
    if (typeof window === 'undefined') return initialAdminProducts
    try {
      const saved = window.localStorage.getItem('armourcraft_admin_products_v1')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) return parsed
      }
    } catch (e) {
      console.warn('Error reading stored products in ShopPage:', e)
    }
    return initialAdminProducts
  })

  // 2. Realtime sync listener & Supabase fetch
  useEffect(() => {
    const handleUpdate = (e) => {
      if (Array.isArray(e.detail) && e.detail.length > 0) {
        setProductsList(e.detail)
      }
    }
    window.addEventListener('armourcraft:products-updated', handleUpdate)

    async function fetchFromSupabase() {
      try {
        if (supabase && typeof supabase.from === 'function') {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false })

          if (!error && Array.isArray(data) && data.length > 0) {
            setProductsList(data)
          }
        }
      } catch (err) {
        console.info('ShopPage fetch notice:', err?.message || err)
      }
    }
    fetchFromSupabase()

    return () => window.removeEventListener('armourcraft:products-updated', handleUpdate)
  }, [])

  // 3. Dynamic Categories derived from categories storage or active products
  const categories = useMemo(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = window.localStorage.getItem('armourcraft_admin_categories_list_v2')
        if (saved) {
          const parsed = JSON.parse(saved)
          if (Array.isArray(parsed) && parsed.length > 0) return parsed
        }
      }
    } catch {}
    const set = new Set(['All Products'])
    productsList.forEach((p) => {
      if (p.category) set.add(p.category)
    })
    return Array.from(set)
  }, [productsList])

  const stances = ['All Stances', 'Right-Handed', 'Left-Handed']

  // Filter products based on Category, Stance, and Search Query
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Category filter
      const matchesCategory =
        activeCategory === 'All Products' || product.category === activeCategory

      // Stance filter
      const productStances = Array.isArray(product.stances)
        ? product.stances
        : product.stance
        ? ['All Stances', product.stance]
        : ['All Stances', 'Right-Handed', 'Left-Handed']

      const matchesStance =
        activeStance === 'All Stances' || productStances.includes(activeStance)

      // Search filter
      const query = searchQuery.trim().toLowerCase()
      const matchesSearch =
        !query ||
        product.title?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)

      return matchesCategory && matchesStance && matchesSearch
    })
  }, [productsList, activeCategory, activeStance, searchQuery])

  const handleAdd = (product) => {
    setAddedItem(product.id)
    if (onAddToCart) {
      onAddToCart(product)
    }
  }

  const resetFilters = () => {
    setActiveCategory('All Products')
    setActiveStance('All Stances')
    setSearchQuery('')
  }

  return (
    <div className="w-full bg-[#060a12] text-white min-h-[calc(100vh-80px)] py-10 sm:py-16 lg:py-24 px-2.5 xs:px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Title & Subtitle */}
        <ScrollReveal y={50} amount={0.2} className="text-center mb-8 sm:mb-12">
          <h1
            data-cms-path="shop.heading"
            data-cms-label="Shop Page Heading"
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase mb-3 sm:mb-4"
          >
            {heading}
          </h1>
          <p
            data-cms-path="shop.subheading"
            data-cms-label="Shop Page Subtitle"
            className="text-slate-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
          >
            {subheading}
          </p>
        </ScrollReveal>

        {/* Category Filter Tabs */}
        <ScrollReveal y={50} amount={0.2} delay={0.08} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer min-h-[40px] ${
                  isActive
                    ? 'bg-[#1762f0] text-white shadow-lg shadow-blue-600/35 scale-[1.03]'
                    : 'bg-[#0d1627] hover:bg-[#121f36] text-slate-300 hover:text-white border border-slate-800 hover:scale-[1.02]'
                }`}
              >
                {cat}
              </button>
            )
          })}
        </ScrollReveal>

        {/* Secondary Filter & Search Bar */}
        <ScrollReveal y={50} amount={0.2} delay={0.12} className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-slate-800/80">
          
          {/* Stance Selector */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              STANCE:
            </span>
            {stances.map((stance) => {
              const isSelected = activeStance === stance
              return (
                <button
                  key={stance}
                  type="button"
                  onClick={() => setActiveStance(stance)}
                  className={`px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer min-h-[36px] ${
                    isSelected
                      ? 'bg-[#0d1a33] text-blue-400 border border-blue-500/60 shadow-sm shadow-blue-500/20'
                      : 'bg-[#091122] text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {stance}
                </button>
              )
            })}
          </div>

          {/* Search Input Bar */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-[#091122] border border-slate-800 rounded-xl px-4 py-2.5 sm:py-2 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all pr-10 min-h-[44px]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

        </ScrollReveal>

        {/* Product Grid (Single-col on mobile, 2-col on md, 3-col on lg) */}
        <ScrollReveal y={50} amount={0.2}>
          {filteredProducts.length > 0 ? (
            <StaggerContainer staggerDelay={0.08} className="grid grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-8">
              {filteredProducts.map((product) => {
                const isAdded = addedItem === product.id

                return (
                  <StaggerItem
                    key={product.id}
                    data-dynamic-type="product"
                    data-dynamic-id={product.id}
                    data-dynamic-title={product.title}
                    className="h-full"
                  >
                    <div className="bg-[#0b1222] border border-slate-800/80 rounded-xl sm:rounded-2xl p-2 sm:p-4 md:p-6 flex flex-col justify-between card-elevate group h-full">
                      {/* Product Image Frame (Compact scaled height for 320px+) */}
                      <div className="w-full aspect-square max-h-32 xs:max-h-36 sm:max-h-56 sm:aspect-[4/3] rounded-lg sm:rounded-xl bg-[#060a14] border border-slate-800/60 overflow-hidden flex items-center justify-center p-1.5 sm:p-3 mb-2 sm:mb-4">
                        <img
                          src={product.image}
                          alt={`ARMOURCRAFT AS ${product.title} - Pro Cricket Protection`}
                          className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] group-hover:scale-105 transition-transform duration-300 ease-out select-none"
                          loading="lazy"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="mb-2 sm:mb-4">
                          <h3 className="text-white font-bold text-xs sm:text-sm md:text-lg leading-tight sm:leading-snug group-hover:text-blue-300 transition-colors mb-1 sm:mb-2 line-clamp-2">
                            {product.title}
                          </h3>
                          <p className="text-slate-400 text-[10px] sm:text-xs md:text-sm leading-relaxed line-clamp-2 hidden sm:block">
                            {product.description}
                          </p>
                        </div>

                        {/* Price and QUICK ADD Button */}
                        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 sm:gap-2 pt-2 sm:pt-3 border-t border-slate-800/60 mt-auto">
                          <div className="text-blue-400 sm:text-white font-black text-xs sm:text-base md:text-2xl tracking-tight">
                            {typeof product.price === 'number'
                              ? `$${product.price.toFixed(2)}`
                              : product.price?.toString().startsWith('$')
                              ? product.price
                              : `$${product.price || '0.00'}`}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAdd(product)}
                            className="w-full xs:w-auto py-1.5 sm:py-2.5 px-1.5 sm:px-4 rounded-lg sm:rounded-xl font-bold text-[10px] sm:text-xs uppercase tracking-tight sm:tracking-wider btn-elevate flex items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-md bg-[#1762f0] hover:bg-[#1354d4] text-white shadow-blue-600/30 shrink-0"
                          >
                            <span className="truncate">{isAdded ? 'ADDED!' : 'ADD TO CART'}</span>
                            <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[2.5] hidden xs:inline-block shrink-0" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                )
              })}
            </StaggerContainer>
          ) : (
            /* Empty State */
            <div className="text-center py-20 bg-[#091122]/40 rounded-2xl border border-slate-800/60">
              <p className="text-slate-400 text-base mb-4">
                No products found matching &ldquo;{searchQuery}&rdquo; in this category.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 bg-[#1762f0] hover:bg-blue-600 text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          )}
        </ScrollReveal>

        {/* Customization Callout Banner Section */}
        <ScrollReveal y={50} amount={0.2} className="mt-14 sm:mt-18">
          <CustomSquadBanner />
        </ScrollReveal>

      </div>
    </div>
  )
}

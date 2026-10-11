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
import WhatWeArePage from './pages/WhatWeArePage'
import BlogPage from './pages/BlogPage'
import BlogDetailPage from './pages/BlogDetailPage'
import ContactPage from './pages/ContactPage'
import ProductQuickAddModal from './components/ProductQuickAddModal'
import CartDrawer from './components/CartDrawer'
import CartCheckoutModal from './components/CartCheckoutModal'
import CartToast from './components/CartToast'
import { useCart } from './context/CartContext'
import AdminRoot from './admin/AdminRoot'
import { syncPublishedCmsFromSupabase } from './admin/cmsStore'
import { AnimatePresence } from 'framer-motion'
import { PageTransition, ScrollReveal, StorefrontAnimationContext } from './components/StorefrontMotion'

export default function App() {
  const {
    cartItems,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearOrderedItems,
    isCartDrawerOpen,
    openCart,
    closeCart,
    isCheckoutOpen,
    openCheckout,
    closeCheckout,
    cartToastItem,
    setCartToastItem
  } = useCart()

  const [quickAddProduct, setQuickAddProduct] = useState(null)

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

  // Sync latest published CMS landing page content from Supabase for live customer storefront
  useEffect(() => {
    syncPublishedCmsFromSupabase()
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, '', path)
    setCurrentPath(path)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Open modal when any Add to Cart button is triggered
  const handleOpenQuickAdd = (product) => {
    if (product) {
      setQuickAddProduct(product)
    }
  }

  // Handle adding customized product into cart state via CartContext
  const handleAddToCartWithVariants = (configuredProduct) => {
    addToCart(configuredProduct)
  }

  const normalizedPath = currentPath.length > 1 ? currentPath.replace(/\/+$/, '') : currentPath
  const isAdminRoute = normalizedPath.startsWith('/admin')
  const isShopRoute = normalizedPath === '/shop' || normalizedPath === '/shop-armours'
  const isWhatWeAreRoute = normalizedPath === '/what-we-are' || normalizedPath === '/about'
  const isBlogDetailRoute = normalizedPath.startsWith('/blog/') && normalizedPath.length > 6
  const isBlogRoute = normalizedPath === '/blog'
  const isContactRoute = normalizedPath === '/contact' || normalizedPath.startsWith('/contact')

  const blogSlug = isBlogDetailRoute
    ? decodeURIComponent(normalizedPath.replace(/^\/blog\//, '').split('/')[0])
    : null

  // Enterprise Dynamic Metadata & On-Page SEO Synchronization
  useEffect(() => {
    if (isAdminRoute) {
      document.title = 'ARMOURCRAFT AS | Admin Portal'
      return
    }

    let title = 'ARMOURCRAFT AS | Next-Gen Ergonomic Cricket Protection & Thigh Guards'
    let desc =
      'Engineered for elite performance. ARMOURCRAFT AS delivers ultra-lightweight, high-impact custom cricket thigh guards and protective gear tested against 160+ km/h deliveries.'
    let canonicalUrl = 'https://armourcraftas.vercel.app'

    if (isShopRoute) {
      title = 'Shop Pro Cricket Armours & Ergonomic Thigh Guards | ARMOURCRAFT AS'
      desc =
        'Explore pro-match cricket thigh guards, ultra-light leg guards, inner pads, and custom team protection gear handcrafted for elite batsmen.'
      canonicalUrl = 'https://armourcraftas.vercel.app/shop'
    } else if (isWhatWeAreRoute) {
      title = 'What We Are | Cricket Protection Lab & Craftsmanship | ARMOURCRAFT AS'
      desc =
        'Sialkot-crafted aerodynamic cricket armours. Discover our multi-density EVA and carbon matrix engineering built to neutralize 160+ km/h deliveries.'
      canonicalUrl = 'https://armourcraftas.vercel.app/what-we-are'
    } else if (isBlogDetailRoute) {
      title = `Cricket Engineering Insights | ARMOURCRAFT AS Blog`
      desc =
        'Expert guides, ballistics testing, and cricket protection technology from the ARMOURCRAFT AS lab.'
      canonicalUrl = `https://armourcraftas.vercel.app${normalizedPath}`
    } else if (isBlogRoute) {
      title = 'Cricket Protection Lab & Engineering Blog | ARMOURCRAFT AS'
      desc =
        'Read in-depth cricket gear insights, EVA vs traditional foam comparisons, and match preparation guides from ARMOURCRAFT AS.'
      canonicalUrl = 'https://armourcraftas.vercel.app/blog'
    } else if (isContactRoute) {
      title = 'Contact & Custom Squad Orders | ARMOURCRAFT AS'
      desc =
        'Get in touch with the ARMOURCRAFT AS workshop. Request custom team thigh guard quotes, custom sponsor logos, and wholesale inquiries.'
      canonicalUrl = 'https://armourcraftas.vercel.app/contact'
    }

    // Synchronize Document Title
    document.title = title

    // Synchronize Meta Description
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', desc)

    // Synchronize Open Graph Metadata
    const ogTitle = document.querySelector('meta[property="og:title"]')
    if (ogTitle) ogTitle.setAttribute('content', title)

    const ogDesc = document.querySelector('meta[property="og:description"]')
    if (ogDesc) ogDesc.setAttribute('content', desc)

    const ogUrl = document.querySelector('meta[property="og:url"]')
    if (ogUrl) ogUrl.setAttribute('content', canonicalUrl)

    // Synchronize Canonical Link
    const canonicalLink = document.querySelector('link[rel="canonical"]')
    if (canonicalLink) canonicalLink.setAttribute('href', canonicalUrl)
  }, [normalizedPath, isAdminRoute, isShopRoute, isWhatWeAreRoute, isBlogRoute, isBlogDetailRoute, isContactRoute])

  // Isolated Admin Portal Route: Standalone Layout without customer header, footer, or cart
  if (isAdminRoute) {
    return <AdminRoot currentPath={normalizedPath} onNavigate={navigate} />
  }

  return (
    <StorefrontAnimationContext.Provider value={true}>
      <div className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        {/* 1. Header / Navbar (Linked directly to dynamic cartCount) */}
        <Navbar
        cartCount={cartCount}
        currentPath={currentPath}
        onNavigate={navigate}
        onOpenCart={openCart}
      />

      {/* 2. Main Body: Switch between Home, Shop, What We Are, Blog, and Contact */}
      <AnimatePresence mode="wait">
        <PageTransition routeKey={normalizedPath} className="flex-1 flex flex-col">
          <main className="flex-1">
            {isShopRoute ? (
              <ShopPage onAddToCart={handleOpenQuickAdd} />
            ) : isWhatWeAreRoute ? (
              <WhatWeArePage onNavigate={navigate} />
            ) : isBlogDetailRoute ? (
              <BlogDetailPage slug={blogSlug} onNavigate={navigate} />
            ) : isBlogRoute ? (
              <BlogPage onNavigate={navigate} />
            ) : isContactRoute ? (
              <ContactPage onNavigate={navigate} />
            ) : (
              <>
                {/* 1. Hero Section */}
                <ScrollReveal as="div" id="hero-section" y={50} amount={0.15}>
                  <Hero onNavigate={navigate} />
                </ScrollReveal>

                {/* 2. PRO MATCH ESSENTIALS Section (Features) */}
                <ScrollReveal as="div" id="features-section" y={50} amount={0.2}>
                  <ProMatchEssentials
                    onAddToCart={handleOpenQuickAdd}
                    onNavigate={navigate}
                  />
                </ScrollReveal>

                {/* 3. THE ARMOURCRAFT ADVANTAGE Section (Advantages) */}
                <ScrollReveal as="div" id="advantages-section" y={50} amount={0.2}>
                  <ArmourAdvantage />
                </ScrollReveal>

                {/* 4. CUSTOM TEAM GEAR & JERSEY MATCHING Banner (Banner) */}
                <ScrollReveal as="div" id="custom-team" y={50} amount={0.2}>
                  <CustomGearBanner />
                </ScrollReveal>

                {/* 5. SmartThighs vs. The Others Comparison Table Section */}
                <ScrollReveal as="div" id="comparison-section" y={50} amount={0.2}>
                  <ComparisonTable />
                </ScrollReveal>

                {/* 6. BROWSE THE SMART COLLECTION Section (Product Grid) */}
                <ScrollReveal as="div" id="products-section" y={50} amount={0.2}>
                  <SmartCollection onAddToCart={handleOpenQuickAdd} />
                </ScrollReveal>

                {/* 7. TRUSTED BY 10,000+ BATSMEN Testimonials Section (Testimonials) */}
                <ScrollReveal as="div" id="testimonials-section" y={50} amount={0.2}>
                  <Testimonials />
                </ScrollReveal>

                {/* 8. Frequently Asked Questions (FAQ) Section */}
                <ScrollReveal as="div" id="faq" y={50} amount={0.2}>
                  <FAQ />
                </ScrollReveal>
              </>
            )}
          </main>
        </PageTransition>
      </AnimatePresence>

      {/* 3. Global Persistent Footer */}
      <Footer onNavigate={navigate} currentPath={currentPath} />

      {/* 4. Product Quick Add / Customization Modal Popup */}
      <ProductQuickAddModal
        isOpen={!!quickAddProduct}
        product={quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
        onAddToCart={handleAddToCartWithVariants}
      />

      {/* 5. Slide-over Cart Drawer (Supports empty cart state & live item management) */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={closeCart}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={openCheckout}
        onNavigate={navigate}
      />

      {/* 6. Complete Your Order - Cash On Delivery Checkout Modal */}
      <CartCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
        cartItems={cartItems}
        onRemoveItem={removeFromCart}
        onClearOrderedItems={clearOrderedItems}
        onNavigate={navigate}
      />

      {/* 7. Success Cart Toast Notification */}
      <CartToast
        item={cartToastItem}
        onClose={() => setCartToastItem(null)}
        onViewCart={() => {
          setCartToastItem(null)
          openCart()
        }}
      />
      </div>
    </StorefrontAnimationContext.Provider>
  )
}

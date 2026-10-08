import React, { useState } from 'react'

// Import live portal components for full untouched landing page rendering
import Navbar from '../../components/Navbar'
import Hero from '../../components/Hero'
import ProMatchEssentials from '../../components/ProMatchEssentials'
import ArmourAdvantage from '../../components/ArmourAdvantage'
import CustomGearBanner from '../../components/CustomGearBanner'
import ComparisonTable from '../../components/ComparisonTable'
import SmartCollection from '../../components/SmartCollection'
import Testimonials from '../../components/Testimonials'
import FAQ from '../../components/FAQ'
import Footer from '../../components/Footer'
import ShopPage from '../../pages/ShopPage'
import WhatWeArePage from '../../pages/WhatWeArePage'
import BlogPage from '../../pages/BlogPage'
import ContactPage from '../../pages/ContactPage'
import ProductQuickAddModal from '../../components/ProductQuickAddModal'
import CartDrawer from '../../components/CartDrawer'
import CartCheckoutModal from '../../components/CartCheckoutModal'
import CustomQuoteModal from '../../components/CustomQuoteModal'
import Armour3DModal from '../../components/Armour3DModal'

export default function CanvasPreview({
  activePage = 'Home'
}) {
  // Modal states for full live interaction
  const [quickAddProduct, setQuickAddProduct] = useState(null)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isCustomQuoteOpen, setIsCustomQuoteOpen] = useState(false)
  const [is3DModalOpen, setIs3DModalOpen] = useState(false)

  // Internal simulated cart for live interaction preview
  const [cartItems, setCartItems] = useState([
    {
      id: 'preview-1',
      title: 'Advantage Carbon Guard Combo',
      price: 169.0,
      quantity: 1,
      image: '/images/advantage_carbon.png',
      size: 'Adult Right Hand',
      stance: 'Right-Hand Stance'
    }
  ])

  // Disable all standard link navigation and redirects inside preview canvas.
  // Exclusive page switching is strictly managed via the top admin dropdown.
  const disabledNavigate = () => {
    // Intentionally no-op to prevent redirects away from admin dashboard
  }

  // Intercept click events across the preview canvas to prevent standard link redirects
  const handleCanvasClickCapture = (e) => {
    // 1. Intercept all anchor tag clicks (<a href="...">)
    const anchor = e.target.closest('a')
    if (anchor) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    // 2. Intercept navigation buttons inside preview nav or footer
    const button = e.target.closest('button')
    if (button) {
      const isCart =
        button.getAttribute('aria-label')?.toLowerCase().includes('cart') ||
        button.textContent?.trim().startsWith('CART') ||
        button.getAttribute('data-cart')

      // Block navigation buttons inside the preview navbar (e.g., Home, Shop Armours, Contact Us)
      if (button.closest('nav') && !isCart) {
        e.preventDefault()
        e.stopPropagation()
        return
      }

      // Block CTA buttons that attempt to navigate to catalog / external routes
      const txt = button.textContent?.toLowerCase() || ''
      if (
        txt.includes('explore collection') ||
        txt.includes('shop now') ||
        txt.includes('view all')
      ) {
        e.preventDefault()
        e.stopPropagation()
        return
      }
    }
  }

  const handleAddToCart = (product) => {
    setCartItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        title: product?.title || 'Custom Cricket Guard',
        price: product?.price || 145.0,
        quantity: 1,
        image: product?.image || '/images/advantage_thigh_guard.png',
        size: 'Adult Regular'
      }
    ])
    setIsCartOpen(true)
  }

  return (
    <div
      onClickCapture={handleCanvasClickCapture}
      className="preview-canvas-scope w-full min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white"
    >
      {/* ========================================================================= */}
      {/* SCOPED CSS: DISABLE POINTER EVENTS ON PREVIEW NAVIGATION LINKS & BUTTONS   */}
      {/* ========================================================================= */}
      <style>{`
        .preview-canvas-scope a,
        .preview-canvas-scope a * {
          pointer-events: none !important;
          cursor: default !important;
        }
        .preview-canvas-scope header nav button:not([aria-label*="cart"]):not([aria-label*="Cart"]) {
          pointer-events: none !important;
          cursor: default !important;
        }
        .preview-canvas-scope footer a,
        .preview-canvas-scope footer a * {
          pointer-events: none !important;
          cursor: default !important;
        }
      `}</style>
      
      {/* ========================================================================= */}
      {/* FULL UNTOUCHED PAGE RENDERING ACCORDING TO HEADER DROPDOWN SELECTION       */}
      {/* ========================================================================= */}
      {activePage === 'Shop Armours' ? (
        /* ----------------------------------------------------------------------- */
        /* 1. SHOP ARMOURS PAGE                                                    */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen flex flex-col">
          <Navbar
            cartCount={cartItems.length}
            currentPath="/shop"
            onNavigate={disabledNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
          <main className="flex-1 w-full">
            <ShopPage onAddToCart={(prod) => setQuickAddProduct(prod)} />
          </main>
          <Footer onNavigate={disabledNavigate} />
        </div>
      ) : activePage === 'What We Are' ? (
        /* ----------------------------------------------------------------------- */
        /* 2. WHAT WE ARE PAGE                                                     */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen flex flex-col">
          <Navbar
            cartCount={cartItems.length}
            currentPath="/what-we-are"
            onNavigate={disabledNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
          <main className="flex-1 w-full">
            <WhatWeArePage onNavigate={disabledNavigate} />
          </main>
          <Footer onNavigate={disabledNavigate} />
        </div>
      ) : activePage === 'Blog / Insights' ? (
        /* ----------------------------------------------------------------------- */
        /* 3. BLOG / INSIGHTS PAGE                                                 */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen flex flex-col">
          <Navbar
            cartCount={cartItems.length}
            currentPath="/blog"
            onNavigate={disabledNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
          <main className="flex-1 w-full">
            <BlogPage onNavigate={disabledNavigate} />
          </main>
          <Footer onNavigate={disabledNavigate} />
        </div>
      ) : activePage === 'Contact Us' ? (
        /* ----------------------------------------------------------------------- */
        /* 4. CONTACT US PAGE                                                      */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen flex flex-col">
          <Navbar
            cartCount={cartItems.length}
            currentPath="/contact"
            onNavigate={disabledNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
          <main className="flex-1 w-full">
            <ContactPage onNavigate={disabledNavigate} />
          </main>
          <Footer onNavigate={disabledNavigate} />
        </div>
      ) : activePage === 'Header' ? (
        /* ----------------------------------------------------------------------- */
        /* 5. ISOLATED HEADER COMPONENT PREVIEW (image_a8845d.png)                 */
        /* Render ONLY the navigation Header component. Hide body & footer.       */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen bg-[#060a12] flex flex-col">
          <Navbar
            cartCount={cartItems.length}
            currentPath="/"
            onNavigate={disabledNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
        </div>
      ) : activePage === 'Footer' ? (
        /* ----------------------------------------------------------------------- */
        /* 6. ISOLATED FOOTER COMPONENT PREVIEW (image_a8849c.png)                 */
        /* Render ONLY the main Footer component. Hide header & body sections.    */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen bg-[#060a12] flex flex-col">
          <Footer onNavigate={disabledNavigate} />
        </div>
      ) : (
        /* ----------------------------------------------------------------------- */
        /* 7. DEFAULT: HOME PAGE (FULL PRODUCTION LANDING PAGE)                     */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen flex flex-col">
          {/* A. Live Storefront Navbar */}
          <Navbar
            cartCount={cartItems.length}
            currentPath="/"
            onNavigate={disabledNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />

          <main className="flex-1 w-full">
            {/* B. Live Hero Section */}
            <Hero
              onNavigate={disabledNavigate}
              onOpenCustomModal={() => setIsCustomQuoteOpen(true)}
            />

            {/* C. Pro Match Essentials */}
            <ProMatchEssentials
              onAddToCart={(prod) => setQuickAddProduct(prod)}
              onNavigate={disabledNavigate}
            />

            {/* D. The ArmourCraft Advantage */}
            <ArmourAdvantage />

            {/* E. Custom Team Gear Banner */}
            <CustomGearBanner />

            {/* F. Comparison Table */}
            <ComparisonTable />

            {/* G. Browse The Smart Collection */}
            <SmartCollection onAddToCart={(prod) => setQuickAddProduct(prod)} />

            {/* H. Trusted by 10,000+ Batsmen Testimonials */}
            <Testimonials />

            {/* I. Frequently Asked Questions */}
            <FAQ />
          </main>

          {/* J. Production Global Footer */}
          <Footer onNavigate={disabledNavigate} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* INTERACTIVE STOREFRONT MODALS (ACCESSIBLE DURING LIVE PREVIEW)             */}
      {/* ========================================================================= */}
      <ProductQuickAddModal
        isOpen={Boolean(quickAddProduct)}
        product={quickAddProduct}
        onClose={() => setQuickAddProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={(id, delta) => {
          setCartItems((prev) =>
            prev
              .map((it) => (it.id === id ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it))
              .filter((it) => it.quantity > 0)
          )
        }}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((it) => it.id !== id))}
        onCheckout={() => {
          setIsCartOpen(false)
          setIsCheckoutOpen(true)
        }}
        onNavigate={disabledNavigate}
      />

      <CartCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((it) => it.id !== id))}
        onClearOrderedItems={() => setCartItems([])}
        onNavigate={disabledNavigate}
      />

      <CustomQuoteModal
        isOpen={isCustomQuoteOpen}
        onClose={() => setIsCustomQuoteOpen(false)}
      />

      <Armour3DModal
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
      />
    </div>
  )
}

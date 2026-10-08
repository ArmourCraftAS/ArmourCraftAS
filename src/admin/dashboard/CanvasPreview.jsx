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
  activePage = 'Home',
  onNavigate
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
    <div className="w-full min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
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
            onNavigate={onNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
          <main className="flex-1 w-full">
            <ShopPage onAddToCart={(prod) => setQuickAddProduct(prod)} />
          </main>
          <Footer onNavigate={onNavigate} />
        </div>
      ) : activePage === 'What We Are' ? (
        /* ----------------------------------------------------------------------- */
        /* 2. WHAT WE ARE PAGE                                                     */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen flex flex-col">
          <Navbar
            cartCount={cartItems.length}
            currentPath="/what-we-are"
            onNavigate={onNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
          <main className="flex-1 w-full">
            <WhatWeArePage onNavigate={onNavigate} />
          </main>
          <Footer onNavigate={onNavigate} />
        </div>
      ) : activePage === 'Blog / Insights' ? (
        /* ----------------------------------------------------------------------- */
        /* 3. BLOG / INSIGHTS PAGE                                                 */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen flex flex-col">
          <Navbar
            cartCount={cartItems.length}
            currentPath="/blog"
            onNavigate={onNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
          <main className="flex-1 w-full">
            <BlogPage onNavigate={onNavigate} />
          </main>
          <Footer onNavigate={onNavigate} />
        </div>
      ) : activePage === 'Contact Us' ? (
        /* ----------------------------------------------------------------------- */
        /* 4. CONTACT US PAGE                                                      */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen flex flex-col">
          <Navbar
            cartCount={cartItems.length}
            currentPath="/contact"
            onNavigate={onNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
          <main className="flex-1 w-full">
            <ContactPage onNavigate={onNavigate} />
          </main>
          <Footer onNavigate={onNavigate} />
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
            onNavigate={onNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />
        </div>
      ) : activePage === 'Footer' ? (
        /* ----------------------------------------------------------------------- */
        /* 6. ISOLATED FOOTER COMPONENT PREVIEW (image_a8849c.png)                 */
        /* Render ONLY the main Footer component. Hide header & body sections.    */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen bg-[#060a12] flex flex-col">
          <Footer onNavigate={onNavigate} />
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
            onNavigate={onNavigate}
            onOpenCart={() => setIsCartOpen(true)}
          />

          <main className="flex-1 w-full">
            {/* B. Live Hero Section */}
            <Hero
              onNavigate={onNavigate}
              onOpenCustomModal={() => setIsCustomQuoteOpen(true)}
            />

            {/* C. Pro Match Essentials */}
            <ProMatchEssentials
              onAddToCart={(prod) => setQuickAddProduct(prod)}
              onNavigate={onNavigate}
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
          <Footer onNavigate={onNavigate} />
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
        onNavigate={onNavigate}
      />

      <CartCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((it) => it.id !== id))}
        onClearOrderedItems={() => setCartItems([])}
        onNavigate={onNavigate}
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

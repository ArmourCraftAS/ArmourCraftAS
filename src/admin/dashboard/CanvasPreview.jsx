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
    <div className="w-full h-full overflow-y-auto overflow-x-hidden bg-[#060a12] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white custom-scrollbar">
      
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
        /* 5. HEADER SHOWCASE PREVIEW                                              */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen flex flex-col bg-[#060a12]">
          <div className="w-full sticky top-0 z-40">
            <Navbar
              cartCount={cartItems.length}
              currentPath="/"
              onNavigate={onNavigate}
              onOpenCart={() => setIsCartOpen(true)}
            />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-16 text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              <span>LIVE HEADER COMPONENT</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-4">
              ARMOURCRAFT NAVIGATION HEADER
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed mb-8">
              Full desktop and responsive navigation bar with live shopping cart counter, direct category routing, mobile drawer integration, and branding.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="px-6 py-3 rounded-xl bg-[#1762f0] hover:bg-[#1354d4] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-blue-600/30 cursor-pointer"
              >
                Open Shopping Cart ({cartItems.length})
              </button>
            </div>
          </div>
          <Footer onNavigate={onNavigate} />
        </div>
      ) : activePage === 'Footer' ? (
        /* ----------------------------------------------------------------------- */
        /* 6. FOOTER SHOWCASE PREVIEW                                              */
        /* ----------------------------------------------------------------------- */
        <div className="w-full min-h-screen flex flex-col justify-between bg-[#060a12]">
          <div className="w-full">
            <Navbar
              cartCount={cartItems.length}
              currentPath="/"
              onNavigate={onNavigate}
              onOpenCart={() => setIsCartOpen(true)}
            />
            <div className="py-16 text-center max-w-3xl mx-auto px-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                <span>LIVE FOOTER COMPONENT</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
                PERSISTENT STOREFRONT FOOTER
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Scroll below to inspect the complete production footer, newsletter subscription module, international delivery badges, and legal compliance links.
              </p>
            </div>
          </div>
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

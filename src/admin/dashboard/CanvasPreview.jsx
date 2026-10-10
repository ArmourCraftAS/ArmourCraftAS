import React from 'react'

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

export default function CanvasPreview({
  activePage = 'Home'
}) {
  // Pure static no-op to completely neutralize all action, navigation, and modal triggers
  const noop = () => {}

  // Comprehensive capture blocker to intercept and nullify all click, mouse, pointer, touch, form, and key events
  const blockInteractionCapture = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div
      onClickCapture={blockInteractionCapture}
      onMouseDownCapture={blockInteractionCapture}
      onMouseUpCapture={blockInteractionCapture}
      onPointerDownCapture={blockInteractionCapture}
      onSubmitCapture={blockInteractionCapture}
      onChangeCapture={blockInteractionCapture}
      onFocusCapture={blockInteractionCapture}
      onKeyDownCapture={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          e.stopPropagation()
        }
      }}
      className="preview-canvas-wrapper w-full min-h-full relative select-none cursor-default"
    >
      {/* ========================================================================= */}
      {/* STRICT CANVAS INTERACTION LOCK & DISABLE ALL PREVIEW POPUPS               */}
      {/* Completely blocks ALL click events, form inputs, button handlers, and     */}
      {/* modal popups inside the preview canvas. Pure visual layout view.           */}
      {/* ========================================================================= */}
      <style>{`
        .preview-canvas-locked,
        .preview-canvas-locked * {
          pointer-events: none !important;
          cursor: default !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          -webkit-touch-callout: none !important;
        }

        .preview-canvas-locked a,
        .preview-canvas-locked button,
        .preview-canvas-locked input,
        .preview-canvas-locked select,
        .preview-canvas-locked textarea {
          pointer-events: none !important;
          cursor: default !important;
          outline: none !important;
          box-shadow: none !important;
        }

        .preview-canvas-locked img {
          pointer-events: none !important;
          -webkit-user-drag: none !important;
          user-drag: none !important;
        }
      `}</style>

      {/* Pure Visual Layout Container: Scrollable top-to-bottom visual preview */}
      <div
        className="preview-canvas-locked w-full min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans pointer-events-none select-none cursor-default"
        inert="true"
      >
        {activePage === 'Shop Armours' ? (
          /* ----------------------------------------------------------------------- */
          /* 1. SHOP ARMOURS PAGE                                                    */
          /* ----------------------------------------------------------------------- */
          <div className="w-full min-h-screen flex flex-col">
            <Navbar
              cartCount={0}
              currentPath="/shop"
              onNavigate={noop}
              onOpenCart={noop}
            />
            <main className="flex-1 w-full">
              <ShopPage onAddToCart={noop} />
            </main>
            <Footer onNavigate={noop} currentPath="/shop" />
          </div>
        ) : activePage === 'What We Are' ? (
          /* ----------------------------------------------------------------------- */
          /* 2. WHAT WE ARE PAGE                                                     */
          /* ----------------------------------------------------------------------- */
          <div className="w-full min-h-screen flex flex-col">
            <Navbar
              cartCount={0}
              currentPath="/what-we-are"
              onNavigate={noop}
              onOpenCart={noop}
            />
            <main className="flex-1 w-full">
              <WhatWeArePage onNavigate={noop} />
            </main>
            <Footer onNavigate={noop} currentPath="/what-we-are" />
          </div>
        ) : activePage === 'Blog / Insights' ? (
          /* ----------------------------------------------------------------------- */
          /* 3. BLOG / INSIGHTS PAGE                                                 */
          /* ----------------------------------------------------------------------- */
          <div className="w-full min-h-screen flex flex-col">
            <Navbar
              cartCount={0}
              currentPath="/blog"
              onNavigate={noop}
              onOpenCart={noop}
            />
            <main className="flex-1 w-full">
              <BlogPage onNavigate={noop} />
            </main>
            <Footer onNavigate={noop} currentPath="/blog" />
          </div>
        ) : activePage === 'Contact Us' ? (
          /* ----------------------------------------------------------------------- */
          /* 4. CONTACT US PAGE                                                      */
          /* ----------------------------------------------------------------------- */
          <div className="w-full min-h-screen flex flex-col">
            <Navbar
              cartCount={0}
              currentPath="/contact"
              onNavigate={noop}
              onOpenCart={noop}
            />
            <main className="flex-1 w-full">
              <ContactPage onNavigate={noop} />
            </main>
            <Footer onNavigate={noop} currentPath="/contact" />
          </div>
        ) : activePage === 'Header' ? (
          /* ----------------------------------------------------------------------- */
          /* 5. ISOLATED HEADER COMPONENT PREVIEW                                    */
          /* ----------------------------------------------------------------------- */
          <div className="w-full min-h-screen bg-[#060a12] flex flex-col">
            <Navbar
              cartCount={0}
              currentPath="/"
              onNavigate={noop}
              onOpenCart={noop}
            />
          </div>
        ) : activePage === 'Footer' ? (
          /* ----------------------------------------------------------------------- */
          /* 6. ISOLATED FOOTER COMPONENT PREVIEW                                    */
          /* ----------------------------------------------------------------------- */
          <div className="w-full min-h-screen bg-[#060a12] flex flex-col">
            <Footer onNavigate={noop} currentPath="/" />
          </div>
        ) : (
          /* ----------------------------------------------------------------------- */
          /* 7. DEFAULT: HOME PAGE (FULL PRODUCTION LANDING PAGE)                     */
          /* ----------------------------------------------------------------------- */
          <div className="w-full min-h-screen flex flex-col">
            <Navbar
              cartCount={0}
              currentPath="/"
              onNavigate={noop}
              onOpenCart={noop}
            />

            <main className="flex-1 w-full">
              <Hero
                onNavigate={noop}
                onOpenCustomModal={noop}
              />

              <ProMatchEssentials
                onAddToCart={noop}
                onNavigate={noop}
              />

              <ArmourAdvantage />

              <CustomGearBanner />

              <ComparisonTable />

              <SmartCollection onAddToCart={noop} />

              <Testimonials />

              <FAQ />
            </main>

            <Footer onNavigate={noop} currentPath="/" />
          </div>
        )}
      </div>
    </div>
  )
}

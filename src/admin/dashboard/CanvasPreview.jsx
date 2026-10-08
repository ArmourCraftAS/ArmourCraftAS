import React, { useState } from 'react'
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Trash2,
  MousePointer,
  ArrowRight,
  Sparkles,
  Maximize2,
  Play,
  ZoomIn,
  ZoomOut,
  Monitor,
  Tablet,
  Smartphone,
  ImageIcon,
  Video as VideoIcon,
  Layers
} from 'lucide-react'

// Import existing landing page components to render the real fully-scrollable structure
import Navbar from '../../components/Navbar'
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
  activePage = 'Home',
  elementData,
  onSelectElement,
  onUpdateElement,
  isPreviewMode = false,
  onNavigate
}) {
  const [zoomLevel, setZoomLevel] = useState(82)
  const [deviceMode, setDeviceMode] = useState('desktop') // 'desktop' | 'tablet' | 'mobile'

  const {
    mainHeading = 'Next-Gen Ergonomic Thigh Protection',
    subHeading = 'Engineered for maximum mobility & impact absorption in every stroke. Trusted against 150+ km/h deliveries.',
    textColor = '#FFFFFF',
    fontSize = 48,
    ctaLink = '/shop-armours',
    ctaText = 'Explore Collection',
    secondaryCtaText = 'Customize Your Gear',
    secondaryCtaLink = '/contact',
    isHeadingHidden = false,
    isSubHeadingHidden = false,
    isButtonsHidden = false,
    isBold = true,
    isItalic = false,
    alignment = 'left',
    activeElement = 'heading', // 'heading' | 'subheading' | 'buttons' | 'media' | null
    // Media attributes
    mediaType = 'image', // 'image' | 'video'
    imageSrc = '/images/nextgen_batsman_helmet.jpg',
    imageOpacity = 100,
    overlayTint = 40,
    blurAmount = 0,
    videoSrc = 'https://assets.armourcraft.io/static/batsman_hero.mp4',
    videoPoster = '/images/nextgen_batsman_helmet.jpg',
    videoAutoplay = true,
    videoLoop = true,
    videoMute = true,
    videoControls = false
  } = elementData || {}

  // Parse multi-line or two-tone heading
  const getRenderedHeading = () => {
    const raw = mainHeading || ''
    const parts = raw.split(' ')
    if (parts.length >= 3) {
      const whitePart1 = parts[0]
      const whitePart2 = parts[1]
      const bluePart = parts.slice(2).join(' ')
      return (
        <>
          <span className="block">{whitePart1}</span>
          <span className="block">{whitePart2}</span>
          <span className="block text-[#2563eb] drop-shadow-[0_4px_16px_rgba(37,99,235,0.4)]">
            {bluePart}
          </span>
        </>
      )
    }
    return <span style={{ color: textColor }}>{raw}</span>
  }

  // Inline toolbar handlers
  const handleToggleBold = (e) => {
    e.stopPropagation()
    onUpdateElement({ isBold: !isBold })
  }

  const handleToggleItalic = (e) => {
    e.stopPropagation()
    onUpdateElement({ isItalic: !isItalic })
  }

  const handleCycleAlignment = (e) => {
    e.stopPropagation()
    const nextAlign = alignment === 'left' ? 'center' : alignment === 'center' ? 'right' : 'left'
    onUpdateElement({ alignment: nextAlign })
  }

  const handleDeleteActive = (e) => {
    e.stopPropagation()
    if (activeElement === 'heading') {
      onUpdateElement({ isHeadingHidden: true })
    } else if (activeElement === 'subheading') {
      onUpdateElement({ isSubHeadingHidden: true })
    } else if (activeElement === 'buttons') {
      onUpdateElement({ isButtonsHidden: true })
    }
  }

  // Zoom handlers
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(125, prev + 10))
  }
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(50, prev - 10))
  }

  // Determine viewport width based on device mode
  const getDeviceWidthClass = () => {
    if (deviceMode === 'mobile') return 'max-w-[420px]'
    if (deviceMode === 'tablet') return 'max-w-[768px]'
    return 'max-w-[1240px]'
  }

  return (
    <div
      className="flex-1 relative overflow-hidden bg-[#070b14] flex flex-col items-center justify-start select-none"
      onClick={() => onSelectElement && onSelectElement(null)}
    >
      {/* ========================================================================= */}
      {/* 1. FULLY-SCROLLABLE LIVE CANVAS VIEWPORT                                  */}
      {/* ========================================================================= */}
      <div className="w-full flex-1 overflow-y-auto px-2 sm:px-6 py-4 flex flex-col items-center custom-scrollbar">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease, max-width 0.3s ease'
          }}
          className={`w-full ${getDeviceWidthClass()} bg-[#060a12] border border-slate-800/90 rounded-2xl shadow-2xl overflow-hidden min-h-[900px] mb-20 relative`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Storefront Mini Header / Navbar Preview */}
          <div className="pointer-events-none opacity-90 border-b border-slate-800/60 bg-[#060a12]/95 backdrop-blur-md">
            <Navbar cartCount={0} currentPath="/" />
          </div>

          {/* PAGE CONTENT RENDERING BASED ON ACTIVE PAGE SELECTOR */}
          {activePage === 'Shop Armours' ? (
            <div className="p-4 sm:p-8">
              <ShopPage onAddToCart={() => {}} />
            </div>
          ) : activePage === 'What We Are' ? (
            <div className="p-4 sm:p-8">
              <WhatWeArePage onNavigate={() => {}} />
            </div>
          ) : activePage === 'Blog' ? (
            <div className="p-4 sm:p-8">
              <BlogPage onNavigate={() => {}} />
            </div>
          ) : activePage === 'Contact Us' ? (
            <div className="p-4 sm:p-8">
              <ContactPage onNavigate={() => {}} />
            </div>
          ) : (
            /* ===================================================================== */
            /* DEFAULT: HOME PAGE FULL SCROLLABLE STRUCTURE                          */
            /* ===================================================================== */
            <>
              {/* HERO SECTION WITH INTERACTIVE MEDIA & TEXT BOUNDING BOXES */}
              <section className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[560px] flex items-center overflow-hidden border-b border-slate-800/80">
                
                {/* --------------------------------------------------------------- */}
                {/* A. HERO MEDIA LAYER (IMAGE / VIDEO BOUNDING BOX)                */}
                {/* --------------------------------------------------------------- */}
                <div
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelectElement('media')
                  }}
                  className={`absolute inset-0 z-0 transition-all cursor-pointer group ${
                    activeElement === 'media' && !isPreviewMode
                      ? 'ring-2 ring-[#1d63ed] ring-inset shadow-[0_0_25px_rgba(29,99,237,0.4)]'
                      : 'hover:ring-1 hover:ring-blue-500/40'
                  }`}
                >
                  {/* Top Bounding Box Badge */}
                  {activeElement === 'media' && !isPreviewMode && (
                    <div className="absolute top-4 left-4 z-30 bg-[#1d63ed] text-white text-[10px] font-black px-2.5 py-1 rounded shadow-lg flex items-center gap-1.5 uppercase tracking-wide">
                      {mediaType === 'video' ? (
                        <>
                          <VideoIcon className="w-3 h-3 fill-current" />
                          <span>MEDIA: VIDEO PLAYER</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3 h-3" />
                          <span>MEDIA: HERO IMAGE</span>
                        </>
                      )}
                    </div>
                  )}

                  {/* Corner Handles for Media */}
                  {activeElement === 'media' && !isPreviewMode && (
                    <>
                      <div className="absolute top-2 left-2 w-2.5 h-2.5 bg-[#1d63ed] border border-white z-30 pointer-events-none" />
                      <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#1d63ed] border border-white z-30 pointer-events-none" />
                      <div className="absolute bottom-2 left-2 w-2.5 h-2.5 bg-[#1d63ed] border border-white z-30 pointer-events-none" />
                      <div className="absolute bottom-2 right-2 w-2.5 h-2.5 bg-[#1d63ed] border border-white z-30 pointer-events-none" />
                      <div className="absolute top-1/2 left-2 -translate-y-1/2 w-2 h-2 bg-[#1d63ed] border border-white z-30 pointer-events-none" />
                      <div className="absolute top-1/2 right-2 -translate-y-1/2 w-2 h-2 bg-[#1d63ed] border border-white z-30 pointer-events-none" />
                    </>
                  )}

                  {/* Render Video or Image based on mediaType */}
                  {mediaType === 'video' ? (
                    <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                      {/* Video Poster or Playback Simulation */}
                      <img
                        src={videoPoster || '/images/nextgen_batsman_helmet.jpg'}
                        alt="Hero Video Poster"
                        className="w-full h-full object-cover object-[center_35%] brightness-75 contrast-110"
                      />
                      {/* Frosted Glass Play Button Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/15 border border-white/40 backdrop-blur-md flex items-center justify-center text-white shadow-2xl group-hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      style={{
                        opacity: `${imageOpacity}%`,
                        filter: `blur(${blurAmount}px)`
                      }}
                      className="w-full h-full transition-all duration-200"
                    >
                      <img
                        src={imageSrc || '/images/nextgen_batsman_helmet.jpg'}
                        alt="Cricket Batsman Hero"
                        className="w-full h-full object-cover object-[center_35%] brightness-75 contrast-110"
                        onError={(e) => {
                          e.currentTarget.src = '/images/batsman_hero.jpg'
                        }}
                      />
                    </div>
                  )}

                  {/* Dark Overlay Tint Layer */}
                  <div
                    style={{
                      backgroundColor: `rgba(0, 0, 0, ${(overlayTint || 40) / 100})`
                    }}
                    className="absolute inset-0 pointer-events-none transition-all duration-200"
                  />
                  {/* Contrast Gradients */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-transparent to-black/40 pointer-events-none" />
                </div>

                {/* --------------------------------------------------------------- */}
                {/* B. HERO TEXT & CONTENT LAYER (BOUNDING BOXES)                   */}
                {/* --------------------------------------------------------------- */}
                <div className="relative z-10 w-full h-full px-6 sm:px-12 lg:px-16 flex flex-col justify-center">
                  <div className="max-w-2xl">
                    
                    {/* Top Tag */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectElement('tag')
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0a1630]/90 border border-blue-500/40 text-[10px] font-extrabold uppercase tracking-widest text-blue-400 mb-4 shadow-lg backdrop-blur-md cursor-pointer hover:border-blue-400 transition-colors"
                    >
                      <Sparkles className="w-3 h-3 text-blue-400" />
                      <span>ELITE PERFORMANCE</span>
                    </div>

                    {/* MAIN HEADING WITH SELECTION BOUNDING BOX & INLINE TOOLBAR */}
                    {!isHeadingHidden && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectElement('heading')
                        }}
                        className={`relative group inline-block my-1 transition-all ${
                          activeElement === 'heading' && !isPreviewMode
                            ? 'border-2 border-[#1d63ed] shadow-[0_0_20px_rgba(29,99,237,0.35)] rounded-sm p-2 sm:p-3 bg-blue-950/20'
                            : 'border-2 border-transparent hover:border-blue-500/40 p-2 sm:p-3 rounded-sm cursor-pointer'
                        }`}
                      >
                        {/* Active Selection Tag Badge */}
                        {activeElement === 'heading' && !isPreviewMode && (
                          <div className="absolute -top-7 left-0 bg-[#1d63ed] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg flex items-center gap-1 z-30 tracking-wide select-none">
                            <MousePointer className="w-3 h-3 fill-current" />
                            <span>Active Element: Main Heading</span>
                          </div>
                        )}

                        {/* Floating Inline Formatting Toolbar */}
                        {activeElement === 'heading' && !isPreviewMode && (
                          <div
                            className="absolute -top-16 left-0 bg-[#0d1527] border border-slate-700/90 rounded-lg px-2 py-1.5 flex items-center gap-1 shadow-2xl z-30 backdrop-blur-md"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={handleToggleBold}
                              className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                                isBold
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
                              }`}
                              title="Bold"
                            >
                              B
                            </button>
                            <button
                              type="button"
                              onClick={handleToggleItalic}
                              className={`w-7 h-7 rounded flex items-center justify-center font-serif italic text-xs transition-colors cursor-pointer ${
                                isItalic
                                  ? 'bg-blue-600 text-white shadow-sm'
                                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
                              }`}
                              title="Italic"
                            >
                              I
                            </button>
                            <button
                              type="button"
                              onClick={handleCycleAlignment}
                              className="w-7 h-7 rounded flex items-center justify-center text-xs text-blue-400 bg-blue-600/20 hover:bg-blue-600/30 transition-colors cursor-pointer"
                              title={`Align (${alignment})`}
                            >
                              {alignment === 'center' ? (
                                <AlignCenter className="w-3.5 h-3.5" />
                              ) : alignment === 'right' ? (
                                <AlignRight className="w-3.5 h-3.5" />
                              ) : (
                                <AlignLeft className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <div className="w-[1px] h-4 bg-slate-700 mx-1" />
                            <button
                              type="button"
                              onClick={() => onSelectElement('ctaLink')}
                              className="w-7 h-7 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                              title="CTA Link"
                            >
                              <LinkIcon className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleDeleteActive}
                              className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                              title="Hide Element"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Corner & Edge Handles */}
                        {activeElement === 'heading' && !isPreviewMode && (
                          <>
                            <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-[#1d63ed] border border-white z-30 pointer-events-none" />
                            <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-[#1d63ed] border border-white z-30 pointer-events-none" />
                            <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-[#1d63ed] border border-white z-30 pointer-events-none" />
                            <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-[#1d63ed] border border-white z-30 pointer-events-none" />
                            <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-2 bg-[#1d63ed] border border-white z-30 pointer-events-none" />
                            <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-2 bg-[#1d63ed] border border-white z-30 pointer-events-none" />
                          </>
                        )}

                        {/* Heading Text */}
                        <h1
                          style={{
                            fontSize: `${Math.max(28, fontSize)}px`,
                            fontWeight: isBold ? 900 : 700,
                            fontStyle: isItalic ? 'italic' : 'normal',
                            textAlign: alignment,
                            lineHeight: 1.08,
                            letterSpacing: '-0.025em'
                          }}
                          className="font-black text-white select-none transition-all tracking-tight"
                        >
                          {getRenderedHeading()}
                        </h1>
                      </div>
                    )}

                    {/* SUB-HEADING TEXT */}
                    {!isSubHeadingHidden && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectElement('subheading')
                        }}
                        className={`relative inline-block mt-4 mb-6 transition-all ${
                          activeElement === 'subheading' && !isPreviewMode
                            ? 'border-2 border-[#1d63ed] shadow-[0_0_15px_rgba(29,99,237,0.3)] rounded-lg p-2.5 bg-blue-950/20'
                            : 'border-2 border-transparent hover:border-blue-500/40 p-2.5 rounded-lg cursor-pointer'
                        }`}
                      >
                        {activeElement === 'subheading' && !isPreviewMode && (
                          <div className="absolute -top-6 left-0 bg-[#1d63ed] text-white text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1 z-30">
                            <MousePointer className="w-2.5 h-2.5 fill-current" />
                            <span>Active Element: Sub-heading</span>
                          </div>
                        )}
                        <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl font-normal drop-shadow">
                          {subHeading}
                        </p>
                      </div>
                    )}

                    {/* CTA BUTTONS OVERLAY */}
                    {!isButtonsHidden && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectElement('buttons')
                        }}
                        className={`relative inline-flex flex-wrap items-center gap-3 sm:gap-4 mt-2 transition-all ${
                          activeElement === 'buttons' && !isPreviewMode
                            ? 'border-2 border-[#1d63ed] shadow-[0_0_15px_rgba(29,99,237,0.3)] rounded-2xl p-2 bg-blue-950/20'
                            : 'border-2 border-transparent hover:border-blue-500/40 p-2 rounded-2xl cursor-pointer'
                        }`}
                      >
                        {activeElement === 'buttons' && !isPreviewMode && (
                          <div className="absolute -top-6 left-0 bg-[#1d63ed] text-white text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1 z-30">
                            <MousePointer className="w-2.5 h-2.5 fill-current" />
                            <span>Active Element: Action Buttons</span>
                          </div>
                        )}

                        <button
                          type="button"
                          className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#1d63ed] hover:bg-[#1554d1] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                        >
                          <span>{ctaText}</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-white border border-white/25 hover:border-white/50 text-xs sm:text-sm font-semibold backdrop-blur-md cursor-pointer transition-all active:scale-95"
                        >
                          {secondaryCtaText}
                        </button>
                      </div>
                    )}

                  </div>
                </div>
              </section>

              {/* REST OF FIXED STOREFRONT COMPONENTS */}
              <div className="pointer-events-none select-none">
                <ProMatchEssentials onAddToCart={() => {}} onNavigate={() => {}} />
                <ArmourAdvantage />
                <CustomGearBanner />
                <ComparisonTable />
                <SmartCollection onAddToCart={() => {}} />
                <Testimonials />
                <FAQ />
                <Footer onNavigate={() => {}} />
              </div>
            </>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. BOTTOM FLOATING CANVAS TOOLBAR (ZOOM & RESPONSIVE DEVICE CONTROLS)     */}
      {/* Matching image_99e1d9.png & image_99e2d9.png                              */}
      {/* ========================================================================= */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-[#0d1424]/95 border border-slate-800 rounded-full px-4 py-1.5 shadow-2xl backdrop-blur-md flex items-center gap-3">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono font-bold w-10 text-center text-[11px] text-slate-200">
            {zoomLevel}%
          </span>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-[1px] h-4 bg-slate-700" />

        {/* Device Mode Switchers */}
        <div className="flex items-center gap-1 text-slate-400">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              deviceMode === 'desktop' ? 'bg-blue-600/30 text-blue-400 font-bold' : 'hover:text-white'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('tablet')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              deviceMode === 'tablet' ? 'bg-blue-600/30 text-blue-400 font-bold' : 'hover:text-white'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              deviceMode === 'mobile' ? 'bg-blue-600/30 text-blue-400 font-bold' : 'hover:text-white'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

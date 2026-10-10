import React, { useState, useEffect, useRef } from 'react'
import { CmsProvider, getDraftCmsData } from '../cmsStore'
import { isVideoAsset } from '../../components/CmsMedia'

// Import live portal components for full landing page rendering
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

// Helper to convert rgb(...) strings to hex for input[type="color"]
function rgbToHex(rgb) {
  if (!rgb || typeof rgb !== 'string') return '#FFFFFF'
  if (rgb.startsWith('#')) return rgb
  const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
  if (!match) return '#FFFFFF'
  const r = parseInt(match[1], 10).toString(16).padStart(2, '0')
  const g = parseInt(match[2], 10).toString(16).padStart(2, '0')
  const b = parseInt(match[3], 10).toString(16).padStart(2, '0')
  return `#${r}${g}${b}`.toUpperCase()
}

export default function CanvasPreview({
  activePage = 'Home',
  selectedElement = null,
  onSelectElement = null,
  cmsData = null,
  isInspectorMode = true,
  onSwitchTab = null,
  onNavigate = null
}) {
  const containerRef = useRef(null)
  const [hoveredInfo, setHoveredInfo] = useState(null)

  // Pure static no-op for internal links
  const noop = () => {}

  // Helper to select background media component by path and populate live draft mediaProps
  const selectBackgroundMediaByPath = (path = 'home.hero.imageSrc', labelFallback = 'Hero Background Media') => {
    const cms = typeof getDraftCmsData === 'function' ? getDraftCmsData() : {}
    let targetData = cms
    const parts = path.split('.')
    for (let i = 0; i < parts.length - 1; i++) {
      if (targetData) targetData = targetData[parts[i]]
    }
    const fieldName = parts[parts.length - 1]
    const val = targetData ? targetData[fieldName] : ''
    
    // Check if there are pathProps, e.g., targetData[fieldName + 'Props'] or cms[path + 'Props']
    const savedProps = targetData?.[fieldName + 'Props'] || cms[path + 'Props'] || {}
    const isVideo = savedProps?.mediaType === 'video' ||
                    targetData?.mediaType === 'video' ||
                    isVideoAsset(val, savedProps?.mediaType) ||
                    isVideoAsset(savedProps?.videoSrc, savedProps?.mediaType)

    const defaultVideo = '/videos/batsman_hero.mp4'
    const activeVideo = savedProps?.videoSrc || (isVideo ? (val || defaultVideo) : '')
    
    const fallbackImage = path.includes('advantage')
      ? (fieldName === 'image1' ? '/images/advantage_carbon.png' : '/images/advantage_thigh_guard.png')
      : path.includes('customSquad')
      ? '/images/custom_pads.png'
      : path.includes('whatWeAre')
      ? '/images/what_we_are_craftsmanship.jpg'
      : '/images/batsman_hero.jpg'

    const activeImage = savedProps?.src || (val && !isVideoAsset(val) ? val : fallbackImage)
    const mediaSrc = isVideo ? (activeVideo || val) : activeImage

    onSelectElement({
      id: path,
      type: 'media',
      label: isVideo ? labelFallback.replace('Image', 'Video') : labelFallback,
      path: path,
      value: mediaSrc,
      originalValue: mediaSrc,
      mediaProps: {
        mediaType: isVideo ? 'video' : 'image',
        src: activeImage,
        imageSrc: activeImage,
        videoSrc: activeVideo,
        videoAssetId: savedProps?.videoAssetId || targetData?.videoAssetId || '',
        fileName: savedProps?.fileName || targetData?.videoFileName || '',
        poster: savedProps?.poster || targetData?.videoPoster || activeImage,
        videoPoster: savedProps?.poster || targetData?.videoPoster || activeImage,
        opacity: savedProps?.opacity !== undefined ? savedProps.opacity : (targetData?.imageOpacity !== undefined ? targetData.imageOpacity : 100),
        autoplay: savedProps?.autoplay !== undefined ? savedProps.autoplay : (targetData?.videoAutoplay !== false),
        loop: savedProps?.loop !== undefined ? savedProps.loop : (targetData?.videoLoop !== false),
        muted: savedProps?.muted !== undefined ? savedProps.muted : (targetData?.videoMute !== false),
        controls: savedProps?.controls !== undefined ? savedProps.controls : (targetData?.videoControls === true)
      }
    })
  }

  // Handle double click on canvas in Inspector Mode
  // Bypasses foreground text elements and directly targets underlying background Image / Video
  const handleCanvasDoubleClick = (e) => {
    if (!isInspectorMode || !onSelectElement) return

    e.preventDefault()
    e.stopPropagation()

    const target = e.target
    if (!target || !containerRef.current || !containerRef.current.contains(target)) return

    // 1. Check if double-click occurred within a section with background media (e.g. Hero section)
    const sectionEl = target.closest('[data-hero-section]') || target.closest('[data-background-media-path]') || target.closest('section')
    let bgMediaPath = sectionEl?.getAttribute('data-background-media-path')

    if (!bgMediaPath && sectionEl) {
      const bgTarget = sectionEl.querySelector('[data-background-media-target]')
      if (bgTarget) bgMediaPath = bgTarget.getAttribute('data-background-media-target')
    }

    if (!bgMediaPath && sectionEl) {
      const mediaEl = sectionEl.querySelector('[data-cms-type="media"]') || sectionEl.querySelector('img[data-cms-path], video[data-cms-path]')
      if (mediaEl) bgMediaPath = mediaEl.getAttribute('data-cms-path')
    }

    // Default to home.hero.imageSrc on Home page or if hero section was double-clicked
    if (!bgMediaPath && (activePage === 'Home' || target.closest('section'))) {
      bgMediaPath = 'home.hero.imageSrc'
    }

    if (bgMediaPath) {
      selectBackgroundMediaByPath(bgMediaPath, 'Hero Background Media')
      return
    }

    // 2. Direct media element double-clicked
    const directMedia = target.closest('[data-cms-type="media"]') || (target.tagName.toLowerCase() === 'img' || target.tagName.toLowerCase() === 'video' ? target : null)
    if (directMedia) {
      const p = directMedia.getAttribute('data-cms-path')
      if (p) {
        selectBackgroundMediaByPath(p, directMedia.getAttribute('data-cms-label') || 'Media Component')
        return
      }
    }
  }

  // Handle click on canvas in Inspector Mode
  const handleCanvasClick = (e) => {
    if (!isInspectorMode || !onSelectElement) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    e.preventDefault()
    e.stopPropagation()

    const target = e.target
    if (!target || !containerRef.current || !containerRef.current.contains(target)) return

    // 0. Background media target click (direct click on background image/video or container)
    const bgMediaTarget = target.closest('[data-background-media-target]')
    if (bgMediaTarget && !target.closest('[data-cms-path]:not([data-cms-type="media"])')) {
      const targetPath = bgMediaTarget.getAttribute('data-background-media-target') || 'home.hero.imageSrc'
      selectBackgroundMediaByPath(targetPath, 'Hero Background Media')
      return
    }

    // 1. Check for dynamic database-driven element scoping rule
    // Products, individual blog cards, or FAQ accordion items
    const dynamicCard = target.closest('[data-dynamic-type]')
    if (dynamicCard) {
      const dynType = dynamicCard.getAttribute('data-dynamic-type') // 'product' | 'blog' | 'faq'
      const dynId = dynamicCard.getAttribute('data-dynamic-id') || 'item'
      const dynTitle = dynamicCard.getAttribute('data-dynamic-title') || 'Database Entity'

      let notice = 'This card is dynamically bound to Supabase backend tables. Layout structure and styling are isolated to preserve storefront integrity.'
      let label = 'Dynamic Component'
      let targetTab = 'product'

      if (dynType === 'product') {
        label = `Product Card: ${dynTitle}`
        notice = `Product "${dynTitle}" is dynamically managed in the Products database table. To edit pricing, stance, impact rating, stock, or product images, open the Products tab.`
        targetTab = 'product'
      } else if (dynType === 'blog') {
        label = `Blog Post: ${dynTitle}`
        notice = `Blog article "${dynTitle}" is dynamically managed in the Blog CMS table. To edit story content, authors, publication date, or article banners, open the Blog tab.`
        targetTab = 'Blog'
      } else if (dynType === 'faq') {
        label = `FAQ Item: ${dynTitle}`
        notice = `Frequently Asked Question "${dynTitle}" is dynamically managed in the FAQs table. To edit question and answer text or order, open the FAQs tab.`
        targetTab = 'FAQs'
      }

      onSelectElement({
        id: `dynamic-${dynType}-${dynId}`,
        type: 'dynamic',
        label,
        dynamicNotice: notice,
        targetTab
      })
      return
    }

    // 2. Check for explicit CMS path element
    const cmsEl = target.closest('[data-cms-path]')
    if (cmsEl) {
      const path = cmsEl.getAttribute('data-cms-path')
      const label = cmsEl.getAttribute('data-cms-label') || path
      const explicitType = cmsEl.getAttribute('data-cms-type')

      // Media element
      if (explicitType === 'media' || cmsEl.tagName.toLowerCase() === 'img' || cmsEl.tagName.toLowerCase() === 'video') {
        selectBackgroundMediaByPath(path, label || 'Media Component')
        return
      }

      // Icon element
      if (explicitType === 'icon' || cmsEl.tagName.toLowerCase() === 'svg' || cmsEl.querySelector('svg')) {
        onSelectElement({
          id: path,
          type: 'icon',
          label: label || 'Icon Component',
          path,
          value: cmsEl.getAttribute('data-cms-icon') || 'Shield',
          originalValue: cmsEl.getAttribute('data-cms-icon') || 'Shield',
          iconProps: {
            iconName: cmsEl.getAttribute('data-cms-icon') || 'Shield',
            color: '#60A5FA',
            size: 24
          }
        })
        return
      }

      // Text element with CMS path
      const textVal = cmsEl.innerText?.trim() || cmsEl.textContent?.trim() || ''
      const computed = window.getComputedStyle(cmsEl)
      const fontSize = parseInt(computed.fontSize, 10) || 16
      const color = rgbToHex(computed.color)
      const textAlign = computed.textAlign === 'center' ? 'center' : computed.textAlign === 'right' ? 'right' : 'left'
      const isBold = computed.fontWeight === 'bold' || parseInt(computed.fontWeight, 10) >= 600
      const isItalic = computed.fontStyle === 'italic'

      onSelectElement({
        id: path,
        type: 'text',
        label: label || 'Text Component',
        path,
        value: textVal,
        originalValue: textVal,
        fontStyle: {
          fontSize,
          alignment: textAlign,
          color,
          isBold,
          isItalic
        }
      })
      return
    }

    // 3. Fallback: Identify clicked DOM target (Media, Icon, or Text)
    // A. Media element
    const mediaEl = target.closest('img, video')
    if (mediaEl) {
      const isVideo = mediaEl.tagName.toLowerCase() === 'video'
      const src = mediaEl.getAttribute('src') || mediaEl.currentSrc || ''
      onSelectElement({
        id: 'media-' + Math.random().toString(36).substr(2, 6),
        type: 'media',
        label: isVideo ? 'Video Component' : 'Image Component',
        path: '',
        value: src,
        originalValue: src,
        mediaProps: {
          mediaType: isVideo ? 'video' : 'image',
          imageSrc: src,
          opacity: 100,
          videoSrc: isVideo ? src : '',
          videoPoster: mediaEl.getAttribute('poster') || '',
          videoAutoplay: true,
          videoLoop: true,
          videoMute: true,
          videoControls: false
        }
      })
      return
    }

    // B. Icon element
    const iconEl = target.closest('svg')
    if (iconEl) {
      onSelectElement({
        id: 'icon-' + Math.random().toString(36).substr(2, 6),
        type: 'icon',
        label: 'Icon Component',
        path: '',
        value: 'Shield',
        originalValue: 'Shield',
        iconProps: {
          iconName: 'Shield',
          color: '#60A5FA',
          size: 24
        }
      })
      return
    }

    // C. Text / Heading element
    const textEl = target.closest('h1, h2, h3, h4, h5, h6, p, span, a, button, label, li')
    if (textEl) {
      const textVal = textEl.innerText?.trim() || textEl.textContent?.trim() || ''
      if (textVal) {
        const computed = window.getComputedStyle(textEl)
        const fontSize = parseInt(computed.fontSize, 10) || 16
        const color = rgbToHex(computed.color)
        const textAlign = computed.textAlign === 'center' ? 'center' : computed.textAlign === 'right' ? 'right' : 'left'
        const isBold = computed.fontWeight === 'bold' || parseInt(computed.fontWeight, 10) >= 600
        const isItalic = computed.fontStyle === 'italic'

        onSelectElement({
          id: 'text-' + Math.random().toString(36).substr(2, 6),
          type: 'text',
          label: `${textEl.tagName.toUpperCase()} Text`,
          path: '',
          value: textVal,
          originalValue: textVal,
          fontStyle: {
            fontSize,
            alignment: textAlign,
            color,
            isBold,
            isItalic
          }
        })
        return
      }
    }

    // D. Background Canvas Area Click (Hero / Section Canvas background)
    const bgSection = target.closest('[data-hero-section]') || target.closest('[data-background-media-path]') || (activePage === 'Home' && target.closest('section'))
    if (bgSection) {
      const p = bgSection.getAttribute?.('data-background-media-path') || 'home.hero.imageSrc'
      selectBackgroundMediaByPath(p, 'Hero Background Media')
      return
    }
  }

  // Handle Mouse Over to provide visual inspector outlines
  const handleMouseOver = (e) => {
    if (!isInspectorMode) return
    const target = e.target
    if (!target || !containerRef.current || !containerRef.current.contains(target)) return

    // Dynamic card
    const dynamicCard = target.closest('[data-dynamic-type]')
    if (dynamicCard) {
      const dynType = dynamicCard.getAttribute('data-dynamic-type')
      const dynTitle = dynamicCard.getAttribute('data-dynamic-title') || 'Database Entity'
      setHoveredInfo({
        el: dynamicCard,
        type: 'dynamic',
        label: `${dynType.toUpperCase()} (DB Managed): ${dynTitle}`
      })
      return
    }

    // CMS path element
    const cmsEl = target.closest('[data-cms-path]')
    if (cmsEl) {
      const label = cmsEl.getAttribute('data-cms-label') || cmsEl.getAttribute('data-cms-path')
      const explicitType = cmsEl.getAttribute('data-cms-type') || (cmsEl.tagName === 'IMG' || cmsEl.tagName === 'VIDEO' ? 'media' : 'text')
      setHoveredInfo({
        el: cmsEl,
        type: explicitType,
        label
      })
      return
    }

    // Media
    const mediaEl = target.closest('img, video')
    if (mediaEl) {
      setHoveredInfo({
        el: mediaEl,
        type: 'media',
        label: mediaEl.tagName === 'VIDEO' ? 'Video Media' : 'Image Media'
      })
      return
    }

    // Icon
    const iconEl = target.closest('svg')
    if (iconEl) {
      setHoveredInfo({
        el: iconEl,
        type: 'icon',
        label: 'Icon Component'
      })
      return
    }

    // Text
    const textEl = target.closest('h1, h2, h3, h4, h5, h6, p, span, a, button, label')
    if (textEl && (textEl.innerText?.trim() || textEl.textContent?.trim())) {
      setHoveredInfo({
        el: textEl,
        type: 'text',
        label: `${textEl.tagName.toUpperCase()} Text`
      })
      return
    }

    setHoveredInfo(null)
  }

  const handleMouseLeave = () => {
    setHoveredInfo(null)
  }

  // Apply visual outline classes directly based on hovered and selected states
  useEffect(() => {
    if (!containerRef.current) return
    const root = containerRef.current

    // Clean previous highlight outlines
    root.querySelectorAll('.cms-inspector-hover').forEach((el) => {
      el.classList.remove('cms-inspector-hover', 'cms-hover-dynamic', 'cms-hover-media', 'cms-hover-icon', 'cms-hover-text')
    })
    root.querySelectorAll('.cms-inspector-selected').forEach((el) => {
      el.classList.remove('cms-inspector-selected')
    })

    // Apply hovered outline
    if (isInspectorMode && hoveredInfo?.el) {
      hoveredInfo.el.classList.add('cms-inspector-hover')
      if (hoveredInfo.type === 'dynamic') {
        hoveredInfo.el.classList.add('cms-hover-dynamic')
      } else if (hoveredInfo.type === 'media') {
        hoveredInfo.el.classList.add('cms-hover-media')
      } else if (hoveredInfo.type === 'icon') {
        hoveredInfo.el.classList.add('cms-hover-icon')
      } else {
        hoveredInfo.el.classList.add('cms-hover-text')
      }
    }

    // Apply selected outline
    if (isInspectorMode && selectedElement) {
      if (selectedElement.path) {
        const found = root.querySelector(`[data-cms-path="${selectedElement.path}"]`)
        if (found) found.classList.add('cms-inspector-selected')
      }
    }
  }, [hoveredInfo, selectedElement, isInspectorMode])

  return (
    <div
      ref={containerRef}
      onClickCapture={handleCanvasClick}
      onDoubleClickCapture={handleCanvasDoubleClick}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      className={`preview-canvas-wrapper w-full min-h-full relative ${
        isInspectorMode ? 'cursor-pointer' : 'cursor-default select-none'
      }`}
    >
      {/* ========================================================================= */}
      {/* VISUAL INSPECTOR SYSTEM STYLES                                            */}
      {/* Ensures Layout Structure & CSS design CANNOT be broken                    */}
      {/* ========================================================================= */}
      <style>{`
        /* Neutralize standard form/submit/link events inside preview */
        .preview-canvas-container a,
        .preview-canvas-container button,
        .preview-canvas-container input,
        .preview-canvas-container textarea {
          cursor: pointer !important;
        }

        /* Hover outlines for inspectable elements */
        .cms-inspector-hover {
          position: relative;
          transition: outline 0.15s ease-in-out;
        }

        .cms-hover-text {
          outline: 2px dashed #3b82f6 !important;
          outline-offset: 3px !important;
        }

        .cms-hover-media {
          outline: 2px dashed #10b981 !important;
          outline-offset: 3px !important;
        }

        .cms-hover-icon {
          outline: 2px dashed #06b6d4 !important;
          outline-offset: 3px !important;
        }

        .cms-hover-dynamic {
          outline: 2px dashed #a855f7 !important;
          outline-offset: 3px !important;
        }

        /* Active Selected Element Outline */
        .cms-inspector-selected {
          outline: 2px solid #2563eb !important;
          outline-offset: 4px !important;
          box-shadow: 0 0 25px rgba(37, 99, 235, 0.45) !important;
          position: relative;
          z-index: 20;
        }

        /* Prevent link dragging or modal popups */
        .preview-canvas-container img {
          user-drag: none;
          -webkit-user-drag: none;
        }
      `}</style>

      {/* Ambient Floating Inspector Badge (Shows hovered element type) */}
      {isInspectorMode && hoveredInfo && (
        <div className="fixed bottom-6 left-6 z-[9999] pointer-events-none animate-in fade-in duration-150">
          <div
            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-2xl border flex items-center gap-2 ${
              hoveredInfo.type === 'dynamic'
                ? 'bg-purple-950/90 text-purple-300 border-purple-500/40'
                : hoveredInfo.type === 'media'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/40'
                : hoveredInfo.type === 'icon'
                ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/40'
                : 'bg-blue-950/90 text-blue-300 border-blue-500/40'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                hoveredInfo.type === 'dynamic'
                  ? 'bg-purple-400'
                  : hoveredInfo.type === 'media'
                  ? 'bg-emerald-400'
                  : hoveredInfo.type === 'icon'
                  ? 'bg-cyan-400'
                  : 'bg-blue-400'
              }`}
            />
            <span>{hoveredInfo.label}</span>
            <span className="text-[10px] text-slate-400 lowercase">• click to edit | double-click for background media</span>
          </div>
        </div>
      )}

      {/* Main Preview Container */}
      <CmsProvider isDraft={true}>
        <div className="preview-canvas-container w-full min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans">
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
      </CmsProvider>
    </div>
  )
}

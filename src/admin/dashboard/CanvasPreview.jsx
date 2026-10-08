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
  Play,
  ZoomIn,
  ZoomOut,
  Monitor,
  Tablet,
  Smartphone,
  ImageIcon,
  Video as VideoIcon,
  Layers,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
  ChevronRight,
  Star,
  Quote
} from 'lucide-react'

// Import existing landing page components to render the real fully-scrollable structure
import Navbar from '../../components/Navbar'

export default function CanvasPreview({
  activePage = 'Home',
  cmsData,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  isPreviewMode = false,
  onNavigate
}) {
  const [zoomLevel, setZoomLevel] = useState(82)
  const [deviceMode, setDeviceMode] = useState('desktop') // 'desktop' | 'tablet' | 'mobile'

  const homeData = cmsData?.home || {}
  const heroData = homeData.hero || {}
  const essentialsData = homeData.essentials || {}
  const advantageData = homeData.advantage || {}
  const customSquadData = homeData.customSquad || {}
  const comparisonData = homeData.comparison || {}
  const showcaseData = homeData.showcase || {}
  const testimonialsData = homeData.testimonials || {}
  const faqData = homeData.faq || {}
  const footerData = homeData.footer || {}

  const activeId = selectedElement?.id

  // Helper to test if element is currently active
  const isActive = (id) => !isPreviewMode && activeId === id

  // Universal text element selector
  const handleTextClick = (e, config) => {
    e.stopPropagation()
    if (isPreviewMode) return
    onSelectElement({
      type: 'text',
      ...config
    })
  }

  // Universal media element selector
  const handleMediaClick = (e, config) => {
    e.stopPropagation()
    if (isPreviewMode) return
    onSelectElement({
      type: 'media',
      ...config
    })
  }

  // Two-tone heading helper
  const getRenderedHeading = (text, defaultText = 'Next-Gen Ergonomic Thigh Protection', color = '#FFFFFF') => {
    const raw = text || defaultText
    const parts = raw.split(' ')
    if (parts.length >= 3) {
      return (
        <>
          <span className="block">{parts[0]}</span>
          <span className="block">{parts[1]}</span>
          <span className="block text-[#2563eb] drop-shadow-[0_4px_16px_rgba(37,99,235,0.4)]">
            {parts.slice(2).join(' ')}
          </span>
        </>
      )
    }
    return <span style={{ color }}>{raw}</span>
  }

  // Device width class
  const getDeviceWidthClass = () => {
    if (deviceMode === 'mobile') return 'max-w-[420px]'
    if (deviceMode === 'tablet') return 'max-w-[768px]'
    return 'max-w-[1240px]'
  }

  return (
    <div
      className="flex-1 w-full h-full relative overflow-y-auto overflow-x-hidden bg-[#070b14] flex flex-col items-center select-none custom-scrollbar"
      onClick={() => onSelectElement && onSelectElement(null)}
    >
      {/* ========================================================================= */}
      {/* 1. SCALABLE & FULLY-SCROLLABLE LANDING PAGE CANVAS CONTAINER               */}
      {/* ========================================================================= */}
      <div
        style={{
          transform: `scale(${zoomLevel / 100})`,
          transformOrigin: 'top center',
          transition: 'transform 0.2s ease, max-width 0.3s ease'
        }}
        className={`w-full ${getDeviceWidthClass()} bg-[#060a12] border border-slate-800/90 shadow-2xl rounded-2xl overflow-visible my-4 mb-28 relative flex flex-col min-h-screen`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* STOREFRONT NAVBAR HEADER (PREVIEW & EDITABLE BRAND) */}
        <div
          onClick={(e) =>
            handleTextClick(e, {
              id: 'navbar_brand',
              label: 'Navbar Brand Text',
              mainHeading: 'ARMOURCRAFT AS',
              subHeading: 'Next-Gen Ergonomic Cricket Protection',
              textColor: '#FFFFFF',
              fontSize: 16,
              ctaLink: '/'
            })
          }
          className={`border-b border-slate-800/80 bg-[#060a12]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between sticky top-0 z-30 transition-all ${
            isActive('navbar_brand')
              ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
              : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
              <span className="text-xs font-black text-blue-400">AC</span>
            </div>
            <div>
              <span className="text-sm font-black tracking-wider text-white">ARMOURCRAFT AS</span>
              <span className="text-[10px] text-blue-400 font-bold block uppercase tracking-widest">
                CRICKET PROTECTION LAB
              </span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-6 text-xs font-medium text-slate-300">
            <span className="hover:text-blue-400">Home</span>
            <span className="hover:text-blue-400">Shop Armours</span>
            <span className="hover:text-blue-400">What We Are</span>
            <span className="hover:text-blue-400">Blog</span>
            <span className="hover:text-blue-400">Contact</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3.5 py-1.5 rounded-lg bg-[#1762f0] text-white text-xs font-bold">
              Shop Now
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. UNIVERSAL LANDING PAGE CONTENT VIEW                                    */}
        {/* ========================================================================= */}
        {activePage === 'Shop Armours' ? (
          /* ======================================================================= */
          /* A. SHOP ARMOURS LANDING PAGE                                            */
          /* ======================================================================= */
          <div className="w-full flex flex-col p-6 sm:p-12 space-y-12 animate-in fade-in">
            {/* Shop Header Banner */}
            <div
              onClick={(e) =>
                handleTextClick(e, {
                  id: 'shop_header',
                  label: 'Shop Page Header',
                  mainHeading: cmsData.shop?.heading || 'SHOP PRO CRICKET PROTECTION',
                  subHeading:
                    cmsData.shop?.subheading ||
                    'Handcrafted ergonomic cricket armours engineered for batsmen facing 150+ km/h deliveries.',
                  textColor: '#FFFFFF',
                  fontSize: 36,
                  ctaLink: '/shop'
                })
              }
              className={`p-8 rounded-2xl bg-[#091122] border border-slate-800 text-center transition-all ${
                isActive('shop_header')
                  ? 'ring-2 ring-[#1d63ed] bg-blue-950/20 shadow-xl'
                  : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
              }`}
            >
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
                {cmsData.shop?.heading || 'SHOP PRO CRICKET PROTECTION'}
              </h1>
              <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
                {cmsData.shop?.subheading ||
                  'Handcrafted ergonomic cricket armours engineered for batsmen facing 150+ km/h deliveries.'}
              </p>
            </div>

            {/* Shop Product Grid with Universal Media & Text Clickable Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { id: 'shop_p1', title: 'Advantage Carbon Guard', price: '$169.00', img: '/images/advantage_carbon.png' },
                { id: 'shop_p2', title: 'Pro Split Thigh Guard', price: '$145.00', img: '/images/advantage_thigh_guard.png' },
                { id: 'shop_p3', title: 'Aerodynamic Inner Pad', price: '$89.00', img: '/images/product_inner_guard.png' },
                { id: 'shop_p4', title: 'Youth Academy Armour', price: '$79.00', img: '/images/product_youth_guard.png' },
                { id: 'shop_p5', title: 'Anti-Slip Compression Sleeves', price: '$35.00', img: '/images/product_sleeves.png' },
                { id: 'shop_p6', title: 'Replacement Elastic Straps', price: '$22.00', img: '/images/product_straps.png' }
              ].map((prod) => (
                <div
                  key={prod.id}
                  className="bg-[#0b1325] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between group hover:border-slate-700 transition-colors"
                >
                  <div
                    onClick={(e) =>
                      handleMediaClick(e, {
                        id: `${prod.id}_media`,
                        label: `${prod.title} Image`,
                        imageSrc: prod.img,
                        mediaType: 'image'
                      })
                    }
                    className={`aspect-square w-full rounded-xl bg-[#060a14] border border-slate-800/80 mb-4 overflow-hidden flex items-center justify-center p-4 transition-all ${
                      isActive(`${prod.id}_media`)
                        ? 'ring-2 ring-[#1d63ed]'
                        : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                    }`}
                  >
                    <img src={prod.img} alt={prod.title} className="w-full h-full object-contain" />
                  </div>
                  <div
                    onClick={(e) =>
                      handleTextClick(e, {
                        id: `${prod.id}_text`,
                        label: `${prod.title} Details`,
                        mainHeading: prod.title,
                        subHeading: `High impact protection calibrated for pro cricketers. Current price: ${prod.price}`,
                        textColor: '#FFFFFF',
                        fontSize: 16,
                        ctaLink: '/shop'
                      })
                    }
                    className={`p-2 rounded-lg transition-all ${
                      isActive(`${prod.id}_text`)
                        ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                        : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                    }`}
                  >
                    <h3 className="text-sm font-bold text-white truncate">{prod.title}</h3>
                    <span className="text-xs font-mono font-bold text-blue-400 block mt-1">
                      {prod.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activePage === 'What We Are' ? (
          /* ======================================================================= */
          /* B. WHAT WE ARE LANDING PAGE                                             */
          /* ======================================================================= */
          <div className="w-full flex flex-col p-6 sm:p-12 space-y-12 animate-in fade-in">
            <div
              onClick={(e) =>
                handleTextClick(e, {
                  id: 'wwa_header',
                  label: 'What We Are Header',
                  mainHeading: cmsData.whatWeAre?.heading || 'CRICKET PROTECTION LAB',
                  subHeading:
                    cmsData.whatWeAre?.subheading ||
                    'Centuries of Sialkot craftsmanship fused with modern ballistic engineering.',
                  textColor: '#FFFFFF',
                  fontSize: 36,
                  ctaLink: '/what-we-are'
                })
              }
              className={`p-8 rounded-2xl bg-[#091122] border border-slate-800 text-center transition-all ${
                isActive('wwa_header')
                  ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                  : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
              }`}
            >
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
                {cmsData.whatWeAre?.heading || 'CRICKET PROTECTION LAB'}
              </h1>
              <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
                {cmsData.whatWeAre?.subheading ||
                  'Centuries of Sialkot craftsmanship fused with modern ballistic engineering.'}
              </p>
            </div>

            {/* Craftsmanship Narrative & Lab Testing Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                onClick={(e) =>
                  handleMediaClick(e, {
                    id: 'wwa_craft_img',
                    label: 'Craftsmanship Story Media',
                    imageSrc: '/images/what_we_are_craftsmanship.jpg',
                    mediaType: 'image'
                  })
                }
                className={`rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-800 ${
                  isActive('wwa_craft_img')
                    ? 'ring-2 ring-[#1d63ed]'
                    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                }`}
              >
                <img
                  src="/images/what_we_are_craftsmanship.jpg"
                  alt="Craftsmanship"
                  className="w-full h-full object-cover"
                />
              </div>

              <div
                onClick={(e) =>
                  handleTextClick(e, {
                    id: 'wwa_story_text',
                    label: 'Craftsmanship Story Text',
                    mainHeading: 'THE SIALKOT HERITAGE',
                    subHeading:
                      'For over a century, master craftsmen in Sialkot have perfected the art of cricket equipment. ArmourCraft elevates this tradition with aerospace-grade composite research.',
                    textColor: '#FFFFFF',
                    fontSize: 22,
                    ctaLink: '/what-we-are'
                  })
                }
                className={`p-6 rounded-2xl bg-[#0b1325] border border-slate-800 flex flex-col justify-center ${
                  isActive('wwa_story_text')
                    ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                }`}
              >
                <h2 className="text-xl font-black text-white uppercase mb-3">THE SIALKOT HERITAGE</h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  For over a century, master craftsmen in Sialkot have perfected the art of cricket equipment.
                  ArmourCraft elevates this tradition with aerospace-grade composite research.
                </p>
              </div>
            </div>
          </div>
        ) : activePage === 'Blog' ? (
          /* ======================================================================= */
          /* C. BLOG / INSIGHTS LANDING PAGE                                         */
          /* ======================================================================= */
          <div className="w-full flex flex-col p-6 sm:p-12 space-y-12 animate-in fade-in">
            <div
              onClick={(e) =>
                handleTextClick(e, {
                  id: 'blog_header',
                  label: 'Blog Page Header',
                  mainHeading: cmsData.blog?.heading || 'CRICKET ENGINEERING INSIGHTS',
                  subHeading:
                    cmsData.blog?.subheading ||
                    'Expert research, ballistics impact testing, and cricket protection lab reports.',
                  textColor: '#FFFFFF',
                  fontSize: 36,
                  ctaLink: '/blog'
                })
              }
              className={`p-8 rounded-2xl bg-[#091122] border border-slate-800 text-center transition-all ${
                isActive('blog_header')
                  ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                  : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
              }`}
            >
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
                {cmsData.blog?.heading || 'CRICKET ENGINEERING INSIGHTS'}
              </h1>
              <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
                {cmsData.blog?.subheading ||
                  'Expert research, ballistics impact testing, and cricket protection lab reports.'}
              </p>
            </div>

            {/* Featured Blog Post */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-[#0b1325] border border-slate-800 rounded-2xl overflow-hidden p-6">
              <div
                onClick={(e) =>
                  handleMediaClick(e, {
                    id: 'blog_feat_media',
                    label: 'Featured Blog Media',
                    imageSrc: '/images/blog_ballistic_test.jpg',
                    mediaType: 'image'
                  })
                }
                className={`rounded-xl overflow-hidden aspect-[16/10] bg-slate-900 ${
                  isActive('blog_feat_media')
                    ? 'ring-2 ring-[#1d63ed]'
                    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                }`}
              >
                <img
                  src="/images/blog_ballistic_test.jpg"
                  alt="Ballistic Testing"
                  className="w-full h-full object-cover"
                />
              </div>

              <div
                onClick={(e) =>
                  handleTextClick(e, {
                    id: 'blog_feat_text',
                    label: 'Featured Article Text',
                    mainHeading: 'THE PHYSICS OF 150+ KM/H DELIVERIES',
                    subHeading:
                      'How multi-density honeycomb EVA absorbs over 1,800 Newtons of kinetic energy compared to conventional soft cotton thigh pads.',
                    textColor: '#FFFFFF',
                    fontSize: 22,
                    ctaLink: '/blog'
                  })
                }
                className={`p-4 flex flex-col justify-center ${
                  isActive('blog_feat_text')
                    ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                }`}
              >
                <span className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2 block">
                  LAB TESTING REPORT
                </span>
                <h2 className="text-xl font-black text-white uppercase mb-3 leading-snug">
                  THE PHYSICS OF 150+ KM/H DELIVERIES
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed">
                  How multi-density honeycomb EVA absorbs over 1,800 Newtons of kinetic energy compared to
                  conventional soft cotton thigh pads.
                </p>
              </div>
            </div>
          </div>
        ) : activePage === 'Contact Us' ? (
          /* ======================================================================= */
          /* D. CONTACT US LANDING PAGE                                              */
          /* ======================================================================= */
          <div className="w-full flex flex-col p-6 sm:p-12 space-y-12 animate-in fade-in">
            <div
              onClick={(e) =>
                handleTextClick(e, {
                  id: 'contact_header',
                  label: 'Contact Us Header',
                  mainHeading: cmsData.contact?.heading || 'CUSTOM GEAR & SQUAD INQUIRIES',
                  subHeading:
                    cmsData.contact?.subheading ||
                    'Request bespoke team thigh guards, personalized player numbers, and academy gear.',
                  textColor: '#FFFFFF',
                  fontSize: 36,
                  ctaLink: '/contact'
                })
              }
              className={`p-8 rounded-2xl bg-[#091122] border border-slate-800 text-center transition-all ${
                isActive('contact_header')
                  ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                  : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
              }`}
            >
              <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight mb-3">
                {cmsData.contact?.heading || 'CUSTOM GEAR & SQUAD INQUIRIES'}
              </h1>
              <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
                {cmsData.contact?.subheading ||
                  'Request bespoke team thigh guards, personalized player numbers, and academy gear.'}
              </p>
            </div>

            {/* Workshop Info & Form Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div
                onClick={(e) =>
                  handleTextClick(e, {
                    id: 'contact_workshop_info',
                    label: 'Workshop Details',
                    mainHeading: 'SIALKOT GEAR LAB & FACTORY',
                    subHeading:
                      'Direct workshop fulfillment: Sialkot, Punjab, Pakistan. Email: custom@armourcraft.com. Priority WhatsApp: +92 300 1234567.',
                    textColor: '#FFFFFF',
                    fontSize: 20,
                    ctaLink: '/contact'
                  })
                }
                className={`p-6 rounded-2xl bg-[#0b1325] border border-slate-800 ${
                  isActive('contact_workshop_info')
                    ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                }`}
              >
                <h3 className="text-lg font-black text-white mb-4 uppercase">SIALKOT GEAR LAB & FACTORY</h3>
                <div className="space-y-3 text-sm text-slate-300">
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Sialkot Industrial Zone, Punjab, Pakistan</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>custom@armourcraft.com</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>WhatsApp: +92 300 1234567</span>
                  </p>
                </div>
              </div>

              <div
                onClick={(e) =>
                  handleMediaClick(e, {
                    id: 'contact_custom_img',
                    label: 'Custom Squad Gear Media',
                    imageSrc: '/images/custom_guard_number_07.jpg',
                    mediaType: 'image'
                  })
                }
                className={`rounded-2xl overflow-hidden aspect-[16/10] bg-slate-900 border border-slate-800 ${
                  isActive('contact_custom_img')
                    ? 'ring-2 ring-[#1d63ed]'
                    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                }`}
              >
                <img
                  src="/images/custom_guard_number_07.jpg"
                  alt="Custom Squad Number"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================================= */
          /* E. DEFAULT: HOME PAGE FULL SCROLLABLE STRUCTURE                         */
          /* ======================================================================= */
          <>
            {/* ------------------------------------------------------------------- */}
            {/* SECTION 1: HERO SECTION                                             */}
            {/* ------------------------------------------------------------------- */}
            <section className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[580px] flex items-center overflow-hidden border-b border-slate-800/80">
              {/* Media Layer (Image or Video) */}
              <div
                onClick={(e) =>
                  handleMediaClick(e, {
                    id: 'hero_media',
                    label: 'Hero Background Media',
                    imageSrc: heroData.imageSrc || '/images/nextgen_batsman_helmet.jpg',
                    imageOpacity: heroData.imageOpacity || 100,
                    overlayTint: heroData.overlayTint || 40,
                    blurAmount: heroData.blurAmount || 0,
                    videoSrc: heroData.videoSrc,
                    videoPoster: heroData.videoPoster,
                    videoAutoplay: heroData.videoAutoplay,
                    videoLoop: heroData.videoLoop,
                    videoMute: heroData.videoMute,
                    videoControls: heroData.videoControls,
                    mediaType: heroData.mediaType || 'image'
                  })
                }
                className={`absolute inset-0 z-0 transition-all ${
                  isActive('hero_media')
                    ? 'ring-2 ring-[#1d63ed] ring-inset shadow-[0_0_25px_rgba(29,99,237,0.4)]'
                    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                }`}
              >
                {/* Active Media Badge */}
                {isActive('hero_media') && (
                  <div className="absolute top-4 left-4 z-30 bg-[#1d63ed] text-white text-[10px] font-black px-2.5 py-1 rounded shadow-lg flex items-center gap-1.5 uppercase tracking-wide">
                    {heroData.mediaType === 'video' ? (
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

                {heroData.mediaType === 'video' ? (
                  <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
                    <img
                      src={heroData.videoPoster || '/images/nextgen_batsman_helmet.jpg'}
                      alt="Hero Video Poster"
                      className="w-full h-full object-cover object-[center_35%] brightness-75 contrast-110"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/15 border border-white/40 backdrop-blur-md flex items-center justify-center text-white shadow-2xl">
                        <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      opacity: `${heroData.imageOpacity || 100}%`,
                      filter: `blur(${heroData.blurAmount || 0}px)`
                    }}
                    className="w-full h-full"
                  >
                    <img
                      src={heroData.imageSrc || '/images/nextgen_batsman_helmet.jpg'}
                      alt="Cricket Batsman Hero"
                      className="w-full h-full object-cover object-[center_35%] brightness-75 contrast-110"
                    />
                  </div>
                )}

                {/* Dark Overlay Tint Layer */}
                <div
                  style={{
                    backgroundColor: `rgba(0, 0, 0, ${(heroData.overlayTint || 40) / 100})`
                  }}
                  className="absolute inset-0 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25 pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-transparent to-black/40 pointer-events-none" />
              </div>

              {/* Text Layer (Tag, Heading, Subheading, CTAs) */}
              <div className="relative z-10 w-full h-full px-6 sm:px-12 lg:px-16 flex flex-col justify-center pointer-events-none">
                <div className="max-w-2xl">
                  {/* Tag */}
                  <div
                    onClick={(e) =>
                      handleTextClick(e, {
                        id: 'hero_tag',
                        label: 'Hero Tag Badge',
                        mainHeading: heroData.tag || 'ELITE PERFORMANCE',
                        subHeading: 'Upper performance category badge',
                        textColor: '#60a5fa',
                        fontSize: 10,
                        ctaLink: '#'
                      })
                    }
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0a1630]/90 border border-blue-500/40 text-[10px] font-extrabold uppercase tracking-widest text-blue-400 mb-4 shadow-lg backdrop-blur-md pointer-events-auto transition-all ${
                      isActive('hero_tag')
                        ? 'ring-2 ring-[#1d63ed]'
                        : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                    }`}
                  >
                    <Sparkles className="w-3 h-3 text-blue-400" />
                    <span>{heroData.tag || 'ELITE PERFORMANCE'}</span>
                  </div>

                  {/* Main Heading with Selection Bounding Box */}
                  {!heroData.isHeadingHidden && (
                    <div
                      onClick={(e) =>
                        handleTextClick(e, {
                          id: 'hero_heading',
                          label: 'Main Heading Text',
                          mainHeading: heroData.mainHeading || 'Next-Gen Ergonomic Thigh Protection',
                          subHeading:
                            heroData.subHeading ||
                            'Engineered for maximum mobility & impact absorption in every stroke. Trusted against 150+ km/h deliveries.',
                          textColor: heroData.textColor || '#FFFFFF',
                          fontSize: heroData.fontSize || 48,
                          ctaLink: heroData.ctaLink || '/shop-armours'
                        })
                      }
                      className={`relative group inline-block my-1 transition-all pointer-events-auto ${
                        isActive('hero_heading')
                          ? 'border-2 border-[#1d63ed] shadow-[0_0_20px_rgba(29,99,237,0.35)] rounded-sm p-2 sm:p-3 bg-blue-950/20'
                          : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 p-2 sm:p-3 rounded-sm cursor-pointer'
                      }`}
                    >
                      {isActive('hero_heading') && (
                        <div className="absolute -top-7 left-0 bg-[#1d63ed] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg flex items-center gap-1 z-30">
                          <MousePointer className="w-3 h-3 fill-current" />
                          <span>Active Element: Main Heading</span>
                        </div>
                      )}
                      <h1
                        style={{
                          fontSize: `${Math.max(28, heroData.fontSize || 48)}px`,
                          lineHeight: 1.08,
                          letterSpacing: '-0.025em'
                        }}
                        className="font-black text-white select-none transition-all tracking-tight"
                      >
                        {getRenderedHeading(heroData.mainHeading, 'Next-Gen Ergonomic Thigh Protection', heroData.textColor)}
                      </h1>
                    </div>
                  )}

                  {/* Sub-heading */}
                  {!heroData.isSubHeadingHidden && (
                    <div
                      onClick={(e) =>
                        handleTextClick(e, {
                          id: 'hero_subheading',
                          label: 'Hero Sub-heading Text',
                          mainHeading: heroData.subHeading || 'Engineered for maximum mobility & impact absorption in every stroke.',
                          subHeading: 'Hero description displayed under the primary heading.',
                          textColor: '#cbd5e1',
                          fontSize: 14,
                          ctaLink: heroData.ctaLink || '/shop-armours'
                        })
                      }
                      className={`relative inline-block mt-4 mb-6 transition-all pointer-events-auto ${
                        isActive('hero_subheading')
                          ? 'border-2 border-[#1d63ed] shadow-[0_0_15px_rgba(29,99,237,0.3)] rounded-lg p-2.5 bg-blue-950/20'
                          : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 p-2.5 rounded-lg cursor-pointer'
                      }`}
                    >
                      <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl font-normal drop-shadow">
                        {heroData.subHeading ||
                          'Engineered for maximum mobility & impact absorption in every stroke. Trusted against 150+ km/h deliveries.'}
                      </p>
                    </div>
                  )}

                  {/* CTA Buttons */}
                  {!heroData.isButtonsHidden && (
                    <div
                      onClick={(e) =>
                        handleTextClick(e, {
                          id: 'hero_cta',
                          label: 'Hero Action Buttons',
                          mainHeading: heroData.ctaText || 'Explore Collection',
                          subHeading: heroData.secondaryCtaText || 'Customize Your Gear',
                          textColor: '#FFFFFF',
                          fontSize: 14,
                          ctaLink: heroData.ctaLink || '/shop-armours'
                        })
                      }
                      className={`relative inline-flex flex-wrap items-center gap-3 sm:gap-4 mt-2 transition-all pointer-events-auto ${
                        isActive('hero_cta')
                          ? 'border-2 border-[#1d63ed] shadow-[0_0_15px_rgba(29,99,237,0.3)] rounded-2xl p-2 bg-blue-950/20'
                          : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 p-2 rounded-2xl cursor-pointer'
                      }`}
                    >
                      <button className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#1d63ed] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2">
                        <span>{heroData.ctaText || 'Explore Collection'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-900/60 text-white border border-white/25 text-xs sm:text-sm font-semibold">
                        {heroData.secondaryCtaText || 'Customize Your Gear'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------------- */}
            {/* SECTION 2: PRO MATCH ESSENTIALS (FEATURES SECTION)                  */}
            {/* ------------------------------------------------------------------- */}
            <section className="py-16 px-6 sm:px-12 border-b border-slate-800/80 bg-[#070b14]">
              <div
                onClick={(e) =>
                  handleTextClick(e, {
                    id: 'essentials_header',
                    label: 'Pro Match Essentials Title',
                    mainHeading: essentialsData.heading || 'PRO MATCH ESSENTIALS',
                    subHeading:
                      essentialsData.subheading ||
                      'Ballistic-tested thigh guards engineered in Sialkot for modern power hitting.',
                    textColor: '#FFFFFF',
                    fontSize: 32,
                    ctaLink: '/shop-armours'
                  })
                }
                className={`text-center max-w-2xl mx-auto mb-12 p-4 rounded-xl transition-all ${
                  isActive('essentials_header')
                    ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                }`}
              >
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
                  {essentialsData.heading || 'PRO MATCH ESSENTIALS'}
                </h2>
                <p className="text-slate-400 text-sm">
                  {essentialsData.subheading ||
                    'Ballistic-tested thigh guards engineered in Sialkot for modern power hitting.'}
                </p>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {(essentialsData.products || []).map((p, idx) => (
                  <div
                    key={p.id || idx}
                    className="bg-[#0b1325] border border-slate-800 rounded-2xl p-5 flex flex-col justify-between group hover:border-slate-700 transition-colors"
                  >
                    {/* Clickable Card Media */}
                    <div
                      onClick={(e) =>
                        handleMediaClick(e, {
                          id: `p_img_${idx}`,
                          label: `${p.title} Product Image`,
                          imageSrc: p.image,
                          mediaType: p.mediaType || 'image'
                        })
                      }
                      className={`aspect-square w-full rounded-xl bg-[#060a14] border border-slate-800/80 mb-4 overflow-hidden flex items-center justify-center p-4 transition-all ${
                        isActive(`p_img_${idx}`)
                          ? 'ring-2 ring-[#1d63ed]'
                          : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                      }`}
                    >
                      <img src={p.image} alt={p.title} className="w-full h-full object-contain" />
                    </div>

                    {/* Clickable Card Text */}
                    <div
                      onClick={(e) =>
                        handleTextClick(e, {
                          id: `p_txt_${idx}`,
                          label: `${p.title} Info`,
                          mainHeading: p.title,
                          subHeading: p.desc || p.price,
                          textColor: '#FFFFFF',
                          fontSize: 14,
                          ctaLink: '/shop-armours'
                        })
                      }
                      className={`p-2 rounded-lg transition-all ${
                        isActive(`p_txt_${idx}`)
                          ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                          : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                      }`}
                    >
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider block mb-1">
                        {p.badge}
                      </span>
                      <h3 className="text-xs sm:text-sm font-bold text-white truncate">{p.title}</h3>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{p.desc}</p>
                      <span className="text-xs font-mono font-bold text-white block mt-2">{p.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ------------------------------------------------------------------- */}
            {/* SECTION 3: THE ARMOURCRAFT ADVANTAGE (TECH SPECIFICATIONS)          */}
            {/* ------------------------------------------------------------------- */}
            <section className="py-16 px-6 sm:px-12 border-b border-slate-800/80 bg-[#060a12]">
              <div
                onClick={(e) =>
                  handleTextClick(e, {
                    id: 'advantage_header',
                    label: 'ArmourCraft Advantage Title',
                    mainHeading: advantageData.heading || 'THE ARMOURCRAFT ADVANTAGE',
                    subHeading:
                      advantageData.subheading ||
                      'Engineered with Multi-Density EVA and Carbon Matrix technology.',
                    textColor: '#FFFFFF',
                    fontSize: 32,
                    ctaLink: '/what-we-are'
                  })
                }
                className={`text-center max-w-2xl mx-auto mb-12 p-4 rounded-xl transition-all ${
                  isActive('advantage_header')
                    ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                    : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                }`}
              >
                <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight mb-2">
                  {advantageData.heading || 'THE ARMOURCRAFT ADVANTAGE'}
                </h2>
                <p className="text-slate-400 text-sm">
                  {advantageData.subheading ||
                    'Engineered with Multi-Density EVA and Carbon Matrix technology.'}
                </p>
              </div>

              {/* Tech Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(advantageData.cards || []).map((card, idx) => (
                  <div
                    key={card.id || idx}
                    className="bg-[#0b1325] border border-slate-800 rounded-2xl overflow-hidden p-6 flex flex-col justify-between"
                  >
                    <div
                      onClick={(e) =>
                        handleMediaClick(e, {
                          id: `adv_media_${idx}`,
                          label: `${card.title} Media`,
                          imageSrc: card.image,
                          mediaType: card.mediaType || 'image'
                        })
                      }
                      className={`aspect-video w-full rounded-xl bg-slate-900 overflow-hidden mb-4 ${
                        isActive(`adv_media_${idx}`)
                          ? 'ring-2 ring-[#1d63ed]'
                          : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                      }`}
                    >
                      <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                    </div>

                    <div
                      onClick={(e) =>
                        handleTextClick(e, {
                          id: `adv_text_${idx}`,
                          label: `${card.title} Spec`,
                          mainHeading: card.title,
                          subHeading: card.desc,
                          textColor: '#FFFFFF',
                          fontSize: 16,
                          ctaLink: '/what-we-are'
                        })
                      }
                      className={`p-2 rounded-lg ${
                        isActive(`adv_text_${idx}`)
                          ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                          : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                      }`}
                    >
                      <h3 className="text-sm font-bold text-white uppercase mb-1">{card.title}</h3>
                      <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ------------------------------------------------------------------- */}
            {/* SECTION 4: CUSTOM TEAM GEAR BANNER                                  */}
            {/* ------------------------------------------------------------------- */}
            <section className="py-12 px-6 sm:px-12 border-b border-slate-800/80 bg-[#091122]">
              <div className="max-w-6xl mx-auto rounded-3xl bg-[#0b1730] border border-blue-500/30 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div
                  onClick={(e) =>
                    handleTextClick(e, {
                      id: 'custom_squad_text',
                      label: 'Custom Squad Gear Headline',
                      mainHeading: customSquadData.heading || 'CUSTOM SQUAD GEAR & SPONSOR LOGOS',
                      subHeading:
                        customSquadData.subheading ||
                        'Outfit your entire academy or club squad with bespoke color palettes and squad numbering.',
                      textColor: '#FFFFFF',
                      fontSize: 26,
                      ctaLink: customSquadData.ctaLink || '/contact',
                      ctaText: customSquadData.ctaText || 'Request Custom Squad Quote →'
                    })
                  }
                  className={`flex-1 p-4 rounded-xl ${
                    isActive('custom_squad_text')
                      ? 'ring-2 ring-[#1d63ed] bg-blue-950/30'
                      : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                  }`}
                >
                  <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight mb-2">
                    {customSquadData.heading || 'CUSTOM SQUAD GEAR & SPONSOR LOGOS'}
                  </h3>
                  <p className="text-slate-300 text-sm max-w-lg mb-6 leading-relaxed">
                    {customSquadData.subheading ||
                      'Outfit your entire academy or club squad with bespoke color palettes and squad numbering.'}
                  </p>
                  <button className="px-6 py-3 rounded-xl bg-[#1d63ed] text-white text-xs font-bold uppercase tracking-wider">
                    {customSquadData.ctaText || 'Request Custom Squad Quote →'}
                  </button>
                </div>

                <div
                  onClick={(e) =>
                    handleMediaClick(e, {
                      id: 'custom_squad_media',
                      label: 'Custom Squad Showcase Image',
                      imageSrc: customSquadData.image || '/images/custom_guard_team_logo.jpg',
                      mediaType: customSquadData.mediaType || 'image'
                    })
                  }
                  className={`w-full md:w-72 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-blue-500/40 shadow-xl ${
                    isActive('custom_squad_media')
                      ? 'ring-2 ring-[#1d63ed]'
                      : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                  }`}
                >
                  <img
                    src={customSquadData.image || '/images/custom_guard_team_logo.jpg'}
                    alt="Custom Guard Team Logo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </section>

            {/* ------------------------------------------------------------------- */}
            {/* SECTION 5: GLOBAL FOOTER                                            */}
            {/* ------------------------------------------------------------------- */}
            <footer className="py-16 px-6 sm:px-12 bg-[#050811] border-t border-slate-900 text-slate-400">
              <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Brand About */}
                <div
                  onClick={(e) =>
                    handleTextClick(e, {
                      id: 'footer_brand',
                      label: 'Footer Brand Bio',
                      mainHeading: 'ARMOURCRAFT AS',
                      subHeading:
                        footerData.brandDesc ||
                        'Handcrafted in Sialkot, Pakistan. Engineered for the fastest bowling on earth.',
                      textColor: '#FFFFFF',
                      fontSize: 14,
                      ctaLink: '/'
                    })
                  }
                  className={`p-4 rounded-xl ${
                    isActive('footer_brand')
                      ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                      : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                  }`}
                >
                  <h4 className="text-white text-sm font-black uppercase mb-2">ARMOURCRAFT AS</h4>
                  <p className="text-xs leading-relaxed">
                    {footerData.brandDesc ||
                      'Handcrafted in Sialkot, Pakistan. Engineered for the fastest bowling on earth.'}
                  </p>
                </div>

                {/* Newsletter Box */}
                <div
                  onClick={(e) =>
                    handleTextClick(e, {
                      id: 'footer_newsletter',
                      label: 'Newsletter Box',
                      mainHeading: footerData.newsletterTitle || 'JOIN THE BATSMAN CLUB',
                      subHeading:
                        footerData.newsletterDesc ||
                        'Get gear release announcements, exclusive factory discounts, and ballistics lab insights.',
                      textColor: '#FFFFFF',
                      fontSize: 14,
                      ctaLink: '#'
                    })
                  }
                  className={`p-4 rounded-xl ${
                    isActive('footer_newsletter')
                      ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                      : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                  }`}
                >
                  <h4 className="text-white text-sm font-black uppercase mb-2">
                    {footerData.newsletterTitle || 'JOIN THE BATSMAN CLUB'}
                  </h4>
                  <p className="text-xs leading-relaxed mb-3">
                    {footerData.newsletterDesc ||
                      'Get gear release announcements, exclusive factory discounts, and ballistics lab insights.'}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white flex-1"
                      readOnly
                    />
                    <button className="bg-blue-600 px-3 py-1.5 text-xs font-bold text-white rounded">
                      Join
                    </button>
                  </div>
                </div>

                {/* Legal & Copyright */}
                <div
                  onClick={(e) =>
                    handleTextClick(e, {
                      id: 'footer_legal',
                      label: 'Copyright Notice',
                      mainHeading: 'LEGAL & COMPLIANCE',
                      subHeading: footerData.copyright || '© 2026 ARMOURCRAFT AS. All rights reserved.',
                      textColor: '#94a3b8',
                      fontSize: 12,
                      ctaLink: '#'
                    })
                  }
                  className={`p-4 rounded-xl ${
                    isActive('footer_legal')
                      ? 'ring-2 ring-[#1d63ed] bg-blue-950/20'
                      : 'hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/50 cursor-pointer'
                  }`}
                >
                  <h4 className="text-white text-sm font-black uppercase mb-2">LEGAL & COMPLIANCE</h4>
                  <p className="text-xs leading-relaxed">
                    {footerData.copyright || '© 2026 ARMOURCRAFT AS. All rights reserved.'}
                  </p>
                </div>
              </div>
            </footer>
          </>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM FLOATING CANVAS TOOLBAR (ZOOM & RESPONSIVE DEVICE CONTROLS)     */}
      {/* ========================================================================= */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 bg-[#0d1424]/95 border border-slate-800 rounded-full px-4 py-1.5 shadow-2xl backdrop-blur-md flex items-center gap-3">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(50, prev - 10))}
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
            onClick={() => setZoomLevel((prev) => Math.min(125, prev + 10))}
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

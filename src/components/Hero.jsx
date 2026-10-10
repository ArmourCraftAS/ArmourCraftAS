import React, { useState, useRef, useEffect } from 'react'
import { ArrowRight, ShieldCheck, Sparkles, Activity } from 'lucide-react'
import Armour3DModal from './Armour3DModal'
import CustomQuoteModal from './CustomQuoteModal'

import { useCmsContent } from '../admin/cmsStore'

export default function Hero({ onNavigate, onOpenCustomModal }) {
  const [is3DModalOpen, setIs3DModalOpen] = useState(false)
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const videoRef = useRef(null)

  // Context-aware CMS Hero Content (Draft in Admin/Canvas Preview, Published on Live Storefront)
  const cmsHero = useCmsContent('home.hero', null)

  const isVideo = cmsHero?.mediaType === 'video'
  const activeVideoSrc = cmsHero?.videoSrc || (isVideo ? '/videos/batsman_hero.mp4' : '')
  const isMuted = cmsHero?.videoMute !== false
  const isAutoplay = cmsHero?.videoAutoplay !== false

  // Ensure HTML5 video autoplay and muted properties are natively enforced in DOM
  useEffect(() => {
    if (isVideo && videoRef.current) {
      const v = videoRef.current
      v.defaultMuted = isMuted
      v.muted = isMuted
      if (isAutoplay) {
        const p = v.play()
        if (p !== undefined) {
          p.catch(() => {
            // Autoplay policy fallback handled gracefully
          })
        }
      }
    }
  }, [isVideo, activeVideoSrc, isMuted, isAutoplay])

  const heroSlides = [
    {
      image: '/images/batsman_hero.jpg',
      alt: 'Professional Cricket Batsman in Batting Stance',
      badge: 'NEW 2026 COLLECTION',
      statLabel: 'Impact Tested',
      statValue: '160+ km/h'
    },
    {
      image: '/images/cricket_hero.jpg',
      alt: 'Match Day Test Stance',
      badge: 'PRO SERIES ELITE',
      statLabel: 'Mobility Index',
      statValue: '99.4%'
    }
  ]

  const currentSlide = heroSlides[activeSlide]

  return (
    <section
      data-hero-section="true"
      data-background-media-path="home.hero.imageSrc"
      className="relative w-full min-h-[calc(100vh-80px)] flex items-center bg-[#060a12] overflow-hidden"
    >
      
      {/* Background Hero Image Container (Right Side) */}
      <div
        data-background-media-target="home.hero.imageSrc"
        className="absolute inset-0 z-0"
      >
        <div className="relative w-full h-full">
          {isVideo ? (
            <video
              ref={videoRef}
              key={activeVideoSrc || 'hero-video'}
              src={activeVideoSrc}
              poster={cmsHero?.videoPoster || cmsHero?.imageSrc || currentSlide.image}
              autoPlay={isAutoplay}
              loop={cmsHero?.videoLoop !== false}
              muted={isMuted}
              controls={cmsHero?.videoControls === true}
              playsInline
              className="w-full h-full object-cover"
              style={{ opacity: (cmsHero?.imageOpacity || 90) / 100 }}
              data-cms-path="home.hero.imageSrc"
              data-cms-label="Hero Background Video"
              data-cms-type="media"
            />
          ) : (
            <img
              key={cmsHero?.imageSrc || currentSlide.image}
              src={cmsHero?.imageSrc || currentSlide.image}
              alt={currentSlide.alt}
              className="w-full h-full object-cover object-[70%_25%] md:object-[right_top] transition-opacity duration-700 ease-in-out scale-[1.01]"
              style={{ opacity: (cmsHero?.imageOpacity || 90) / 100 }}
              data-cms-path="home.hero.imageSrc"
              data-cms-label="Hero Background Media"
              data-cms-type="media"
            />
          )}

          {/* Left-to-Right Dark Gradient Overlay (Guarantees High Contrast for Headline) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#060a12] via-[#060a12]/90 md:via-[#060a12]/75 to-transparent to-75% pointer-events-none" />

          {/* Top & Bottom Soft Vignettes */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060a12] via-transparent to-[#060a12]/50 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#060a12] to-transparent pointer-events-none" />
          
          {/* Subtle Atmospheric Blue Radial Glow */}
          <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
        </div>
      </div>

      {/* Main Content (Left Column) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
        <div className="max-w-2xl lg:max-w-3xl">
          
          {/* Pill Badge */}
          <div
            data-cms-path="home.hero.tag"
            data-cms-label="Hero Pill Badge"
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#0d162a]/90 border border-blue-500/25 shadow-sm shadow-blue-500/20 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-blue-300 uppercase">
              {cmsHero?.tag || currentSlide.badge}
            </span>
          </div>

          {/* Main Headline */}
          <h1
            data-cms-path="home.hero.mainHeading"
            data-cms-label="Hero Main Headline"
            style={{
              fontSize: cmsHero?.fontSize ? `${cmsHero.fontSize}px` : undefined,
              color: cmsHero?.textColor || undefined,
              textAlign: cmsHero?.alignment || undefined,
              fontWeight: cmsHero?.isBold !== false ? '900' : 'normal',
              fontStyle: cmsHero?.isItalic ? 'italic' : 'normal'
            }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-black text-white tracking-tight leading-[1.06] mb-6"
          >
            {cmsHero?.mainHeading ? (
              (() => {
                const parts = cmsHero.mainHeading.split(' ')
                if (parts.length >= 3) {
                  return (
                    <>
                      {parts[0]} <br />
                      {parts[1]} <br />
                      <span className="text-[#3b82f6] drop-shadow-[0_0_30px_rgba(59,130,246,0.35)]">
                        {parts.slice(2).join(' ')}
                      </span>
                    </>
                  )
                }
                return cmsHero.mainHeading
              })()
            ) : (
              <>
                Next-Gen <br />
                Ergonomic <br />
                <span className="text-[#3b82f6] drop-shadow-[0_0_30px_rgba(59,130,246,0.35)]">
                  Thigh Protection
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p
            data-cms-path="home.hero.subHeading"
            data-cms-label="Hero Subtitle"
            className="text-slate-300 text-base sm:text-lg md:text-xl font-normal leading-relaxed max-w-xl mb-10 text-slate-300/90"
          >
            {cmsHero?.subHeading || 'Engineered for maximum mobility & impact absorption in every stance. Tested against 160+ km/h deliveries.'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-16">
            
            {/* Primary Blue Button */}
            <a
              href="/shop"
              data-cms-path="home.hero.ctaText"
              data-cms-label="Hero Primary Button"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate('/shop')
                }
              }}
              className="inline-flex items-center justify-center gap-2.5 bg-[#1762f0] hover:bg-[#1354d4] text-white px-8 py-4 rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all duration-200 shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 hover:translate-y-[-1px] active:translate-y-[0px] group cursor-pointer"
            >
              <span>{cmsHero?.ctaText || 'Explore Collection'}</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>

            {/* Secondary Dark Outlined Button (Opens Customization Modal) */}
            <button
              type="button"
              data-cms-path="home.hero.secondaryCtaText"
              data-cms-label="Hero Secondary Button"
              onClick={() => {
                if (onOpenCustomModal) {
                  onOpenCustomModal()
                } else {
                  setIsCustomizationModalOpen(true)
                }
              }}
              className="inline-flex items-center justify-center gap-2.5 bg-[#0a1120]/80 hover:bg-[#111c33] border border-slate-700/80 hover:border-slate-500 text-white px-8 py-4 rounded-xl font-bold text-sm sm:text-base tracking-wide transition-all duration-200 backdrop-blur-sm hover:translate-y-[-1px] active:translate-y-[0px] cursor-pointer"
            >
              <span>{cmsHero?.secondaryCtaText || 'Customize Your Stance'}</span>
            </button>
          </div>

          {/* Bottom Left Carousel Pagination Indicators */}
          <div className="flex items-center gap-3">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`transition-all duration-300 rounded-full ${
                  activeSlide === idx
                    ? 'w-7 h-2 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]'
                    : 'w-2 h-2 bg-slate-700 hover:bg-slate-500'
                }`}
              />
            ))}
            <span className="text-[11px] font-semibold text-slate-500 ml-2 uppercase tracking-wider">
              {currentSlide.statLabel}: <span className="text-slate-300">{currentSlide.statValue}</span>
            </span>
          </div>

        </div>
      </div>

      {/* Custom Team Gear & Customization Modal Popup */}
      <CustomQuoteModal
        isOpen={isCustomizationModalOpen}
        onClose={() => setIsCustomizationModalOpen(false)}
      />

      {/* Interactive 3D Armour Modal */}
      <Armour3DModal
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
      />
    </section>
  )
}

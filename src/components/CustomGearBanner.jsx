import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import CustomQuoteModal from './CustomQuoteModal'
import { useCmsContent } from '../admin/cmsStore'
import CmsMedia, { isVideoAsset } from './CmsMedia'
import { FadeIn } from './StorefrontMotion'

export default function CustomGearBanner() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const heading = useCmsContent('home.customSquad.heading', 'CUSTOM TEAM GEAR & JERSEY MATCHING')
  const subheading = useCmsContent('home.customSquad.subheading', "Elevate your team's look. Professional-grade printing of names, numbers, and club logos directly onto your guards. Matches any team colors.")
  const ctaText = useCmsContent('home.customSquad.ctaText', 'GET CUSTOM TEAM QUOTE')
  const image = useCmsContent('home.customSquad.image', '/images/custom_pads.png')
  const imageProps = useCmsContent('home.customSquad.imageProps', null)

  const isVideo = imageProps?.mediaType === 'video' || isVideoAsset(image, imageProps?.mediaType) || isVideoAsset(imageProps?.videoSrc, imageProps?.mediaType)
  const activeVideo = imageProps?.videoSrc || (isVideo ? (typeof image === 'string' ? image : '') : '')
  const activeImg = (typeof image === 'string' && !isVideoAsset(image)) ? image : (imageProps?.src || '/images/custom_pads.png')

  return (
    <section className="relative w-full bg-black border-y border-slate-900 overflow-hidden text-white">
      
      {/* Background Container: Split Layout with Right-Side Pads Image */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="relative w-full h-full flex justify-end">
          
          {/* Right Image */}
          <div className="w-full lg:w-[58%] h-full relative">
            <CmsMedia
              src={activeImg}
              videoSrc={activeVideo}
              videoAssetId={imageProps?.videoAssetId}
              mediaType={isVideo ? 'video' : 'image'}
              alt="Custom Team Cricket Guards with Initials and Numbers"
              poster={imageProps?.poster || activeImg}
              autoPlay={imageProps?.autoplay !== false}
              loop={imageProps?.loop !== false}
              muted={imageProps?.muted !== false}
              controls={imageProps?.controls !== undefined ? imageProps?.controls : true}
              cmsPath="home.customSquad.image"
              cmsLabel="Custom Gear Banner Image"
              className="w-full h-full object-cover object-center lg:object-right select-none opacity-85 lg:opacity-100"
            />
            {/* Seamless Left Gradient to Black */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 lg:via-black/50 to-transparent" />
            {/* Top & Bottom Vignettes */}
            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent" />
          </div>

        </div>
      </div>

      {/* Main Container Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <FadeIn direction="up" distance={25}>
          <div className="max-w-xl lg:max-w-2xl animate-slide-up">
            
            {/* Main Heading */}
            <h2
              data-cms-path="home.customSquad.heading"
              data-cms-label="Custom Gear Banner Heading"
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black uppercase tracking-tight leading-[1.1] mb-5"
            >
              {heading}
            </h2>

            {/* Description */}
            <p
              data-cms-path="home.customSquad.subheading"
              data-cms-label="Custom Gear Banner Description"
              className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mb-8 text-slate-300/90 font-normal"
            >
              {subheading}
            </p>

            {/* Primary Call to Action Button */}
            <div>
              <button
                onClick={() => setIsQuoteModalOpen(true)}
                data-cms-path="home.customSquad.ctaText"
                data-cms-label="Custom Gear Banner CTA"
                className="inline-flex items-center justify-center bg-white hover:bg-slate-200 text-black font-black text-xs sm:text-sm uppercase tracking-widest px-8 py-4 rounded-none sm:rounded-md transition-all duration-200 shadow-xl shadow-white/10 hover:shadow-white/20 active:scale-[0.98] btn-elevate btn-hover group cursor-pointer"
              >
                <span>{ctaText}</span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1 text-black" />
              </button>
            </div>

          </div>
        </FadeIn>
      </div>

      {/* Interactive Custom Team Quote Modal Popup */}
      <CustomQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />

    </section>
  )
}

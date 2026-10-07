import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import CustomQuoteModal from './CustomQuoteModal'

export default function CustomGearBanner() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)

  return (
    <section className="relative w-full bg-black border-y border-slate-900 overflow-hidden text-white">
      
      {/* Background Container: Split Layout with Right-Side Pads Image */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="relative w-full h-full flex justify-end">
          
          {/* Right Image */}
          <div className="w-full lg:w-[58%] h-full relative">
            <img
              src="/images/custom_pads.png"
              alt="Custom Team Cricket Guards with Initials and Numbers"
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
        <div className="max-w-xl lg:max-w-2xl">
          
          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black uppercase tracking-tight leading-[1.1] mb-5">
            CUSTOM TEAM GEAR &amp; <br />
            <span className="text-[#1d68ed] drop-shadow-[0_0_25px_rgba(29,104,237,0.45)]">
              JERSEY MATCHING
            </span>
          </h2>

          {/* Description */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mb-8 text-slate-300/90 font-normal">
            Elevate your team's look. Professional-grade printing of names, numbers, and club logos directly onto your guards. Matches any team colors.
          </p>

          {/* Primary Call to Action Button */}
          <div>
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="inline-flex items-center justify-center bg-white hover:bg-slate-200 text-black font-black text-xs sm:text-sm uppercase tracking-widest px-8 py-4 rounded-none sm:rounded-md transition-all duration-200 shadow-xl shadow-white/10 hover:shadow-white/20 active:scale-[0.98] group cursor-pointer"
            >
              <span>GET CUSTOM TEAM QUOTE</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1 text-black" />
            </button>
          </div>

        </div>
      </div>

      {/* Interactive Custom Team Quote Modal Popup */}
      <CustomQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />

    </section>
  )
}

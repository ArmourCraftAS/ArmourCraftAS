import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import CustomQuoteModal from './CustomQuoteModal'
import { FadeIn, StaggerContainer, StaggerItem } from './StorefrontMotion'

export default function CustomSquadBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <FadeIn direction="up" className="w-full mt-16 sm:mt-20 lg:mt-24">
      {/* Main Full-Width Rounded Dark Card Container */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl bg-[#0b1325]/90 border border-slate-800/80 p-4 sm:p-10 lg:p-14 shadow-2xl backdrop-blur-md overflow-hidden card-elevate">
        
        {/* Subtle ambient corner glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Description & CTA Button */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Heading */}
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[44px] font-black uppercase text-white tracking-tight leading-[1.08] mb-4 sm:mb-5">
              WANT YOUR SQUAD NUMBER <br className="hidden sm:inline" />
              OR JERSEY MATCH?
            </h2>

            {/* Description Text */}
            <p className="text-slate-400 text-xs sm:text-base leading-relaxed max-w-xl mb-6 sm:mb-8">
              Make it truly yours. Print your name, squad number (like{' '}
              <strong className="text-white font-bold">DK 21</strong>), or your local club logo directly on your guards using our high-durability heat-press tech.
            </p>

            {/* Action Button */}
            <div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 bg-[#1762f0] hover:bg-[#1354d4] text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider btn-elevate cursor-pointer group shadow-lg shadow-blue-600/35"
              >
                <span>GET CUSTOM SQUAD QUOTE</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

          </div>

          {/* Right Column: Visual Showcase Preview Cards */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-3 sm:gap-6 w-full max-w-sm mx-auto lg:mx-0">
            
            {/* Card 1: Personalized Numbers */}
            <div className="bg-[#060a14] border border-slate-800/90 rounded-2xl p-2.5 sm:p-3 pb-3 sm:pb-4 flex flex-col items-center w-full shadow-2xl card-elevate group min-w-0">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#e2e8f0] flex items-center justify-center">
                <img
                  src="/images/custom_guard_number_07.jpg"
                  alt="Personalized Numbers - 07 Guard"
                  className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>
              <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 group-hover:text-slate-200 tracking-widest uppercase mt-2.5 sm:mt-3 text-center transition-colors truncate w-full">
                PERSONALIZED NUMBERS
              </span>
            </div>

            {/* Card 2: Team Logos */}
            <div className="bg-[#060a14] border border-slate-800/90 rounded-2xl p-2.5 sm:p-3 pb-3 sm:pb-4 flex flex-col items-center w-full shadow-2xl card-elevate group min-w-0">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#e2e8f0] flex items-center justify-center">
                <img
                  src="/images/custom_guard_team_logo.jpg"
                  alt="Team Logos - Club Crest Guard"
                  className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>
              <span className="text-[9px] sm:text-[11px] font-bold text-slate-400 group-hover:text-slate-200 tracking-widest uppercase mt-2.5 sm:mt-3 text-center transition-colors truncate w-full">
                TEAM LOGOS
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Interactive Custom Squad Quote Modal Popup */}
      <CustomQuoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </FadeIn>
  )
}

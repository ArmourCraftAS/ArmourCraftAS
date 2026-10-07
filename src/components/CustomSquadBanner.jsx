import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import CustomQuoteModal from './CustomQuoteModal'

export default function CustomSquadBanner() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section className="w-full mt-16 sm:mt-20 lg:mt-24">
      {/* Main Full-Width Rounded Dark Card Container */}
      <div className="relative w-full rounded-2xl sm:rounded-3xl bg-[#0b1325]/90 border border-slate-800/80 p-8 sm:p-10 lg:p-14 shadow-2xl backdrop-blur-md overflow-hidden">
        
        {/* Subtle ambient corner glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Heading, Description & CTA Button */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black uppercase text-white tracking-tight leading-[1.08] mb-5">
              WANT YOUR SQUAD NUMBER <br className="hidden sm:inline" />
              OR JERSEY MATCH?
            </h2>

            {/* Description Text */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mb-8">
              Make it truly yours. Print your name, squad number (like{' '}
              <strong className="text-white font-bold">DK 21</strong>), or your local club logo directly on your guards using our high-durability heat-press tech.
            </p>

            {/* Action Button */}
            <div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center gap-2.5 bg-[#1762f0] hover:bg-[#1354d4] text-white px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
              >
                <span>GET CUSTOM SQUAD QUOTE</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>

          </div>

          {/* Right Column: Visual Showcase Preview Cards */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end gap-4 sm:gap-6">
            
            {/* Card 1: Personalized Numbers */}
            <div className="bg-[#060a14] border border-slate-800/90 rounded-2xl p-3 pb-4 flex flex-col items-center w-36 sm:w-44 shadow-2xl transition-all duration-300 hover:border-blue-500/40 hover:scale-[1.02] group">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#e2e8f0] flex items-center justify-center">
                <img
                  src="/images/custom_guard_number_07.jpg"
                  alt="Personalized Numbers - 07 Guard"
                  className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 group-hover:text-slate-200 tracking-widest uppercase mt-3 text-center transition-colors">
                PERSONALIZED NUMBERS
              </span>
            </div>

            {/* Card 2: Team Logos */}
            <div className="bg-[#060a14] border border-slate-800/90 rounded-2xl p-3 pb-4 flex flex-col items-center w-36 sm:w-44 shadow-2xl transition-all duration-300 hover:border-blue-500/40 hover:scale-[1.02] group">
              <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-[#e2e8f0] flex items-center justify-center">
                <img
                  src="/images/custom_guard_team_logo.jpg"
                  alt="Team Logos - Club Crest Guard"
                  className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 group-hover:text-slate-200 tracking-widest uppercase mt-3 text-center transition-colors">
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
    </section>
  )
}

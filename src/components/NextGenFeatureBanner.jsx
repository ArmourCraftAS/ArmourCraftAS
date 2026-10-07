import React from 'react'
import { Check } from 'lucide-react'

export default function NextGenFeatureBanner() {
  return (
    <section className="w-full bg-[#060a12] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 border-t border-slate-900/80">
      <div className="max-w-7xl mx-auto">
        {/* Dark, Sleek Rounded Card Container */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl bg-[#0b1325]/90 border border-slate-800/80 p-8 sm:p-10 lg:p-14 shadow-2xl backdrop-blur-md overflow-hidden">
          
          {/* Subtle atmospheric ambient glow */}
          <div className="absolute top-0 right-1/3 w-80 h-80 bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />

          {/* 2-Column Grid Layout */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              
              {/* Heading */}
              <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-white leading-[1.15] tracking-tight mb-5 max-w-md">
                Designed for the Next Generation of Batsmen
              </h2>

              {/* Description */}
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg mb-8 font-normal">
                ARMOURCRAFT blends century-old artisanal craftsmanship from Sialkot with modern ballistic-grade impact foam. We&apos;ve redesigned protection from the crease up.
              </p>

              {/* Badges / Checkmarks */}
              <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                
                {/* Badge 1: Ballistic Tested */}
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-8 h-8 rounded-full bg-[#0d1d3d] border border-blue-500/30 flex items-center justify-center text-[#1d68ed] shadow-inner group-hover:border-blue-400/50 transition-colors">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide">
                    Ballistic Tested
                  </span>
                </div>

                {/* Badge 2: Tournament Certified */}
                <div className="flex items-center gap-3 group cursor-default">
                  <div className="w-8 h-8 rounded-full bg-[#0d1d3d] border border-blue-500/30 flex items-center justify-center text-[#1d68ed] shadow-inner group-hover:border-blue-400/50 transition-colors">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-slate-200 tracking-wide">
                    Tournament Certified
                  </span>
                </div>

              </div>

            </div>

            {/* Right Column Image */}
            <div className="lg:col-span-6 flex items-center justify-center">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-[#070b14] border border-slate-800/80 shadow-2xl group">
                <img
                  src="/images/nextgen_batsman_helmet.jpg"
                  alt="Cricketer wearing helmet with blue protective grille"
                  className="w-full h-full object-cover object-[center_35%] select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}

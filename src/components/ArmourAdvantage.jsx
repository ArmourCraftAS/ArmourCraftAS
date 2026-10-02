import React, { useState } from 'react'
import { ShieldCheck, Eye, Layers } from 'lucide-react'
import Armour3DModal from './Armour3DModal'

export default function ArmourAdvantage() {
  const [is3DModalOpen, setIs3DModalOpen] = useState(false)

  return (
    <section className="relative w-full bg-[#060a14] py-20 lg:py-28 overflow-hidden text-white border-t border-slate-900/60">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-blue-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: Overlapping Image Cards */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
            
            {/* Outer Container with exact height to comfortably accommodate overlapping cards */}
            <div className="relative w-full max-w-[480px] h-[460px] sm:h-[510px]">
              
              {/* Subtle Blue Accent Corner Line (bottom left background) */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 w-32 sm:w-40 h-32 sm:h-40 border-l-2 border-b-2 border-blue-500/25 rounded-bl-2xl pointer-events-none" />

              {/* 1. Background Card (Carbon-fiber/Foam Macro Texture) */}
              <div className="absolute top-0 left-0 w-[58%] sm:w-[60%] h-[74%] sm:h-[76%] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700/70 shadow-2xl bg-[#090f1d] group transition-transform duration-300 hover:scale-[1.01]">
                <img
                  src="/images/advantage_carbon.png"
                  alt="High-density Carbon-Fiber Composite Texture"
                  className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                {/* Subtle sheen overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/[0.04] pointer-events-none" />
                
                {/* Material Tag Badge */}
                <div className="absolute top-3.5 left-3.5 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-semibold text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-blue-400" />
                  <span>Carbon-Foam Matrix</span>
                </div>
              </div>

              {/* 2. Foreground Floating Card (Blue 3D Thigh Guard Model) */}
              <div 
                onClick={() => setIs3DModalOpen(true)}
                className="absolute bottom-0 right-0 sm:right-4 w-[65%] sm:w-[66%] h-[74%] sm:h-[76%] rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-[#0a1120] group cursor-pointer transition-all duration-300 hover:border-blue-500/50 hover:translate-y-[-4px]"
              >
                <img
                  src="/images/advantage_thigh_guard.png"
                  alt="ArmourCraft 3D Ergonomic Blue Thigh Guard"
                  className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                {/* Subtle dark vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                {/* Floating 3D Badge on hover */}
                <div className="absolute bottom-4 right-4 bg-blue-600/90 hover:bg-blue-500 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide flex items-center gap-1.5 shadow-lg shadow-blue-600/40 transition-transform group-hover:scale-105">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect 3D</span>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE: Content Card */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl p-8 sm:p-12 md:p-14 bg-gradient-to-br from-[#0c1426] via-[#090f1e] to-[#060a14] border border-slate-800/90 shadow-2xl shadow-blue-950/20 overflow-hidden">
              
              {/* Corner soft light reflection */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl pointer-events-none rounded-full" />
              
              {/* Top Tag */}
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-6 h-[2px] bg-blue-500 rounded-full inline-block" />
                <span className="text-blue-500 font-extrabold text-xs sm:text-sm tracking-widest uppercase">
                  THE ARMOURCRAFT ADVANTAGE
                </span>
              </div>

              {/* Main Heading */}
              <h2 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-white leading-[1.08] tracking-tight mb-7">
                Mastery in <br />
                Impact <br />
                Protection
              </h2>

              {/* Decorative Divider */}
              <div className="flex items-center gap-2 mb-8">
                <div className="w-1.5 h-1.5 bg-blue-500 rotate-45" />
                <div className="w-20 h-[1.5px] bg-gradient-to-r from-blue-500 to-transparent" />
              </div>

              {/* Paragraph 1 */}
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                Designed for elite performance. Our guards combine advanced, light-weight composite materials with high-density impact absorption foam, ensuring unparalleled thigh protection without compromising mobility on the field.
              </p>

              {/* Paragraph 2 */}
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
                Every guard is meticulously crafted, integrating carbon-fiber weave for rigid strength and dynamic ergonomic contours that flex with your movements, so you can focus entirely on your stance and scoring runs.
              </p>

            </div>
          </div>

        </div>
      </div>

      {/* Interactive 3D Model Modal */}
      <Armour3DModal
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
      />
    </section>
  )
}

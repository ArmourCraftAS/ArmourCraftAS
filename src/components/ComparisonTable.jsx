import React from 'react'
import { useCmsContent } from '../admin/cmsStore'

export default function ComparisonTable() {
  const heading = useCmsContent('home.comparison.heading', 'SmartThighs vs. The Others')
  const rows = [
    {
      feature: 'Running Between Wickets',
      armourCraft: 'Zero-Shift Molded Fit',
      traditional: 'Loose / Repeated Adjustment Needed',
    },
    {
      feature: 'Hard Season Ball Impact',
      armourCraft: '140+ KM/H Leather Ball Proof',
      traditional: 'Deep Bruising / Heavy Sting',
    },
    {
      feature: 'Match Day Comfort & Sweat',
      armourCraft: 'Breathable Mesh Inner Lining',
      traditional: 'Heavy Sweat Accumulation',
    },
    {
      feature: 'Velcro Strap Grip',
      armourCraft: 'Military Grade Double-Velcro',
      traditional: 'Loose Elastic / Fraying',
    },
    {
      feature: 'Protection-to-Weight',
      armourCraft: 'Ultra-Lightweight (~320g Dual)',
      traditional: 'Bulky & Heavy (~650g)',
    },
  ]

  return (
    <section className="relative w-full bg-[#060a12] py-20 lg:py-28 px-4 sm:px-6 lg:px-8 text-white border-t border-slate-900/80 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <h2
          data-cms-path="home.comparison.heading"
          data-cms-label="Comparison Table Heading"
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center tracking-tight mb-12 sm:mb-16"
        >
          {heading}
        </h2>

        {/* Comparison Table Container */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#091122]/95 border border-slate-800/90 shadow-2xl overflow-hidden backdrop-blur-md">
          
          {/* Table Header */}
          <div className="grid grid-cols-12 items-center text-xs sm:text-sm font-bold tracking-wider uppercase border-b border-slate-800/80">
            {/* Column 1: Performance Feature */}
            <div className="col-span-4 p-4 sm:p-6 text-slate-400 flex items-center">
              <span>PERFORMANCE FEATURE</span>
            </div>

            {/* Column 2: ARMOURCRAFT AS (Highlighted Column - Text Only) */}
            <div className="col-span-4 p-4 sm:p-6 flex items-center justify-center bg-[#0f2142] border-x border-blue-500/25 shadow-inner">
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-black tracking-wider uppercase text-center inline-flex items-center justify-center gap-1.5 select-none">
                <span className="text-[#2b7fff] drop-shadow-[0_0_16px_rgba(43,127,255,0.45)]">
                  ARMOURCRAFT
                </span>
                <span className="text-slate-200 drop-shadow-sm">
                  AS
                </span>
              </span>
            </div>

            {/* Column 3: Traditional Local Pads */}
            <div className="col-span-4 p-4 sm:p-6 text-center text-slate-400 flex items-center justify-center">
              <span>TRADITIONAL LOCAL PADS</span>
            </div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-800/60">
            {rows.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-12 items-center transition-colors duration-150 hover:bg-slate-800/20"
              >
                {/* Column 1: Feature Title */}
                <div className="col-span-4 p-4 sm:p-6 text-slate-200 text-xs sm:text-sm md:text-base font-semibold">
                  {row.feature}
                </div>

                {/* Column 2: ARMOURCRAFT AS (Elevated Highlighted Column) */}
                <div className="col-span-4 p-4 sm:p-6 text-center text-white text-xs sm:text-sm md:text-base font-bold bg-[#0d1c38]/95 border-x border-blue-500/20 flex items-center justify-center shadow-sm">
                  {row.armourCraft}
                </div>

                {/* Column 3: Traditional Local Pads (Red / Italic Accent) */}
                <div className="col-span-4 p-4 sm:p-6 text-center text-rose-400/90 italic text-xs sm:text-sm md:text-base font-medium flex items-center justify-center">
                  {row.traditional}
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}

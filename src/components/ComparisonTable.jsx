import React, { useState } from 'react'
import { ArrowLeftRight, Layers, Table as TableIcon } from 'lucide-react'
import { useCmsContent } from '../admin/cmsStore'
import { FadeIn } from './StorefrontMotion'

export default function ComparisonTable() {
  const [viewMode, setViewMode] = useState('cards') // 'cards' | 'table' for mobile
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
    <section className="relative w-full bg-[#060a12] py-12 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 text-white border-t border-slate-900/80 overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Section Heading */}
        <FadeIn direction="up" distance={20}>
          <h2
            data-cms-path="home.comparison.heading"
            data-cms-label="Comparison Table Heading"
            className="text-2xl sm:text-4xl md:text-5xl font-black text-white text-center tracking-tight mb-6 sm:mb-12 animate-slide-up"
          >
            {heading}
          </h2>
        </FadeIn>

        {/* Mobile View Toggle Switcher (< sm viewports) */}
        <FadeIn direction="up" distance={15} delay={0.1}>
          <div className="flex sm:hidden items-center justify-center gap-2 mb-6">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-[#1762f0] text-white shadow-md shadow-blue-600/40'
                  : 'bg-[#0d1627] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Stacked Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#1762f0] text-white shadow-md shadow-blue-600/40'
                  : 'bg-[#0d1627] text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Full Table</span>
            </button>
          </div>
        </FadeIn>

        {/* Mobile Stacked Cards Layout (< sm) */}
        {viewMode === 'cards' && (
          <FadeIn direction="up" distance={20} delay={0.12} className="block sm:hidden">
            <div className="space-y-3">
              {rows.map((row, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-[#091122]/95 border border-slate-800/90 p-3.5 shadow-lg backdrop-blur-md card-elevate"
                >
                  <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800/80">
                    <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                      {row.feature}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-950/70 border border-blue-800/60 rounded px-1.5 py-0.5">
                      0{idx + 1}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {/* ArmourCraft Box */}
                    <div className="bg-[#0f2142] border border-blue-500/30 rounded-lg p-2.5 flex flex-col justify-between shadow-sm">
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-wider mb-1">
                        ARMOURCRAFT AS
                      </span>
                      <span className="text-xs font-bold text-white leading-tight">
                        {row.armourCraft}
                      </span>
                    </div>

                    {/* Traditional Box */}
                    <div className="bg-[#0b101c] border border-slate-800 rounded-lg p-2.5 flex flex-col justify-between">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        TRADITIONAL PADS
                      </span>
                      <span className="text-xs font-medium text-rose-400/90 italic leading-tight">
                        {row.traditional}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        )}

        {/* Comparison Table Container (Horizontal Scroll on Mobile or Desktop) */}
        <FadeIn
          direction="up"
          distance={25}
          delay={0.15}
          className={`${viewMode === 'table' ? 'block' : 'hidden sm:block'}`}
        >
          <div className="rounded-2xl sm:rounded-3xl bg-[#091122]/95 border border-slate-800/90 shadow-2xl overflow-hidden backdrop-blur-md card-elevate card-hover animate-slide-up">
            
            {/* Horizontal Scroll Hint Badge for Mobile Screen */}
            <div className="flex sm:hidden items-center justify-center gap-1.5 text-[11px] text-blue-400 font-semibold py-2 px-3 bg-[#0c1830] border-b border-blue-900/40 animate-pulse">
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Swipe horizontally to compare columns</span>
            </div>

            {/* Horizontal Scroll Wrapper */}
            <div className="overflow-x-auto custom-scrollbar">
              <div className="min-w-[580px] sm:min-w-full">
                
                {/* Table Header */}
                <div className="grid grid-cols-12 items-center text-[11px] sm:text-xs md:text-sm font-bold tracking-wider uppercase border-b border-slate-800/80">
                  {/* Column 1: Performance Feature */}
                  <div className="col-span-4 p-3.5 sm:p-5 md:p-6 text-slate-400 flex items-center">
                    <span>PERFORMANCE FEATURE</span>
                  </div>

                  {/* Column 2: ARMOURCRAFT AS (Highlighted Column - Text Only) */}
                  <div className="col-span-4 p-3.5 sm:p-5 md:p-6 flex items-center justify-center bg-[#0f2142] border-x border-blue-500/25 shadow-inner">
                    <span className="text-xs sm:text-lg md:text-xl lg:text-2xl font-black tracking-wider uppercase text-center inline-flex items-center justify-center gap-1.5 select-none">
                      <span className="text-[#2b7fff] drop-shadow-[0_0_16px_rgba(43,127,255,0.45)]">
                        ARMOURCRAFT
                      </span>
                      <span className="text-slate-200 drop-shadow-sm">
                        AS
                      </span>
                    </span>
                  </div>

                  {/* Column 3: Traditional Local Pads */}
                  <div className="col-span-4 p-3.5 sm:p-5 md:p-6 text-center text-slate-400 flex items-center justify-center">
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
                      <div className="col-span-4 p-3.5 sm:p-5 md:p-6 text-slate-200 text-xs sm:text-sm md:text-base font-semibold">
                        {row.feature}
                      </div>

                      {/* Column 2: ARMOURCRAFT AS (Elevated Highlighted Column) */}
                      <div className="col-span-4 p-3.5 sm:p-5 md:p-6 text-center text-white text-xs sm:text-sm md:text-base font-bold bg-[#0d1c38]/95 border-x border-blue-500/20 flex items-center justify-center shadow-sm">
                        {row.armourCraft}
                      </div>

                      {/* Column 3: Traditional Local Pads (Red / Italic Accent) */}
                      <div className="col-span-4 p-3.5 sm:p-5 md:p-6 text-center text-rose-400/90 italic text-xs sm:text-sm md:text-base font-medium flex items-center justify-center">
                        {row.traditional}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </FadeIn>

      </div>
    </section>
  )
}

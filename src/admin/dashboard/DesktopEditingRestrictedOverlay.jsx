import React from 'react'
import { Monitor, AlertTriangle, ArrowLeft } from 'lucide-react'

export default function DesktopEditingRestrictedOverlay({ onNavigate }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed inset-0 z-[999999] bg-[#070b14]/95 backdrop-blur-md flex items-center justify-center p-4 text-center select-none animate-in fade-in duration-200"
    >
      <div className="max-w-md w-full bg-[#0c1427] border border-blue-900/50 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-blue-950/60 flex flex-col items-center">
        {/* Device Icon Graphic */}
        <div className="relative mb-5 flex items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_25px_rgba(23,98,240,0.25)]">
            <Monitor className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/60 flex items-center justify-center text-amber-400 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5 stroke-[2.2]" />
          </div>
        </div>

        {/* Badge */}
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[10px] font-bold tracking-wider uppercase mb-3">
          Desktop Only Feature
        </span>

        {/* Heading */}
        <h3 className="text-lg font-black text-white uppercase tracking-tight mb-2">
          Desktop Screen Required
        </h3>

        {/* Required Notice Message */}
        <p className="text-slate-300 text-sm leading-relaxed mb-6 font-normal">
          Admin editing requires a desktop screen (width 800px or higher). Please switch to a larger device to edit content.
        </p>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
          <a
            href="/"
            onClick={(e) => {
              if (onNavigate) {
                e.preventDefault()
                onNavigate('/')
              }
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-slate-700/60"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Storefront</span>
          </a>
        </div>

        {/* Viewport Info Footnote */}
        <div className="mt-4 text-[11px] text-slate-500 font-mono">
          Current width: &lt; 800px • Required: ≥ 800px
        </div>
      </div>
    </div>
  )
}


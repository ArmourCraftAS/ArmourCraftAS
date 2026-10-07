import React from 'react'
import {
  SlidersHorizontal,
  Link as LinkIcon,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  Check
} from 'lucide-react'

export default function ElementPropertiesPanel({
  elementData,
  onUpdateElement,
  onResetDefaults,
  onSaveElement,
  isSaving = false
}) {
  const {
    mainHeading = 'Next-Gen Ergonomic Thigh Protection',
    subHeading = 'Engineered for maximum mobility & impact absorption in every stroke. Trusted against 150+ km/h deliveries.',
    textColor = '#FFFFFF',
    fontSize = 48,
    ctaLink = '/shop-armours',
    isHeadingHidden = false,
    activeElement = 'heading'
  } = elementData || {}

  const handleFontSizeChange = (delta) => {
    const nextSize = Math.max(24, Math.min(72, (fontSize || 48) + delta))
    onUpdateElement({ fontSize: nextSize })
  }

  return (
    <aside className="w-80 lg:w-[340px] bg-[#0c1220] border-l border-slate-800/80 flex flex-col justify-between p-5 z-20 overflow-y-auto select-none shrink-0 shadow-2xl">
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* 1. HEADER: ELEMENT PROPERTIES & TAG                                       */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#1d63ed]" />
            <h2 className="text-xs font-black tracking-wider text-slate-100 uppercase font-sans">
              ELEMENT PROPERTIES
            </h2>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-[#121c2e] border border-slate-700/60 px-2 py-0.5 rounded uppercase tracking-wider">
            {activeElement === 'heading' ? 'Text' : activeElement}
          </span>
        </div>

        {/* ========================================================================= */}
        {/* 2. SECTION: CONTENT EDIT                                                  */}
        {/* ========================================================================= */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
            CONTENT EDIT
          </span>

          {/* Main Heading Text */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 block">
              Main Heading Text
            </label>
            <textarea
              rows={3}
              value={mainHeading}
              onChange={(e) => onUpdateElement({ mainHeading: e.target.value })}
              placeholder="Next-Gen Ergonomic Thigh Protection"
              className="w-full bg-[#080d19] border border-slate-800 focus:border-[#1d63ed] focus:ring-1 focus:ring-[#1d63ed] rounded-lg p-2.5 text-xs text-white placeholder-slate-600 resize-none font-medium outline-none transition-colors leading-relaxed"
            />
          </div>

          {/* Sub-heading Text */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 block">
              Sub-heading Text
            </label>
            <textarea
              rows={2}
              value={subHeading}
              onChange={(e) => onUpdateElement({ subHeading: e.target.value })}
              placeholder="Engineered for maximum mobility..."
              className="w-full bg-[#080d19] border border-slate-800 focus:border-[#1d63ed] focus:ring-1 focus:ring-[#1d63ed] rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-600 resize-none font-normal outline-none transition-colors leading-relaxed"
            />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 3. SECTION: STYLING & LINKS                                               */}
        {/* ========================================================================= */}
        <div className="space-y-3.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
            STYLING & LINKS
          </span>

          {/* Text Color & Font Size Row */}
          <div className="grid grid-cols-2 gap-3">
            {/* Text Color */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 block">
                Text Color
              </label>
              <div className="bg-[#080d19] border border-slate-800 rounded-lg p-2 flex items-center gap-2">
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => onUpdateElement({ textColor: e.target.value })}
                  className="w-4 h-4 rounded-full border border-slate-600 cursor-pointer bg-transparent p-0 overflow-hidden"
                  title="Choose text color"
                />
                <input
                  type="text"
                  value={textColor}
                  onChange={(e) => onUpdateElement({ textColor: e.target.value })}
                  className="w-full bg-transparent text-[11px] font-mono text-slate-200 outline-none uppercase"
                />
              </div>
            </div>

            {/* Font Size */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 block">
                Font Size
              </label>
              <div className="bg-[#080d19] border border-slate-800 rounded-lg p-2 flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-200 pl-1">
                  {fontSize}px
                </span>
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => handleFontSizeChange(2)}
                    className="p-0.5 hover:text-white text-slate-400 hover:bg-slate-800 rounded cursor-pointer"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFontSizeChange(-2)}
                    className="p-0.5 hover:text-white text-slate-400 hover:bg-slate-800 rounded cursor-pointer"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Link */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 block">
              CTA Link
            </label>
            <div className="bg-[#080d19] border border-slate-800 focus-within:border-[#1d63ed] rounded-lg p-2.5 flex items-center gap-2 transition-colors">
              <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <input
                type="text"
                value={ctaLink}
                onChange={(e) => onUpdateElement({ ctaLink: e.target.value })}
                placeholder="/shop-armours"
                className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-600 outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 4. SECTION: QUICK ACTIONS                                                 */}
        {/* ========================================================================= */}
        <div className="space-y-3 pt-2 border-t border-slate-800/60">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
            QUICK ACTIONS
          </span>

          {/* Hide Element Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-300">Hide Element</span>
            <button
              type="button"
              onClick={() => onUpdateElement({ isHeadingHidden: !isHeadingHidden })}
              className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer ${
                isHeadingHidden ? 'bg-blue-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform duration-200 ${
                  isHeadingHidden ? 'translate-x-4' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Reset to Default */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Reset to Default</span>
            <button
              type="button"
              onClick={onResetDefaults}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 underline cursor-pointer transition-colors"
            >
              Restore
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. BOTTOM ACTION BUTTON: UPDATE ELEMENT                                   */}
      {/* ========================================================================= */}
      <div className="pt-6">
        <button
          type="button"
          onClick={onSaveElement}
          disabled={isSaving}
          className="w-full py-3 rounded-xl bg-[#1d63ed] hover:bg-[#1554d1] active:scale-98 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
        >
          {isSaving ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>SAVING...</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>UPDATE ELEMENT</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

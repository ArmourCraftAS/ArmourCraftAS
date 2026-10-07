import React, { useState } from 'react'
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Trash2,
  MousePointer,
  ArrowRight,
  Sparkles,
  Maximize2
} from 'lucide-react'

export default function CanvasPreview({
  elementData,
  onSelectElement,
  onUpdateElement,
  isPreviewMode = false,
  onNavigate
}) {
  const {
    mainHeading = 'Next-Gen Ergonomic Thigh Protection',
    subHeading = 'Engineered for maximum mobility & impact absorption in every stroke. Trusted against 150+ km/h deliveries.',
    textColor = '#FFFFFF',
    fontSize = 48,
    ctaLink = '/shop-armours',
    isHeadingHidden = false,
    isSubHeadingHidden = false,
    isButtonsHidden = false,
    isBold = true,
    isItalic = false,
    alignment = 'left',
    activeElement = 'heading'
  } = elementData || {}

  // Parse multi-line or segmented heading to support the signature two-tone highlight
  // E.g. "Next-Gen Ergonomic Thigh Protection" -> "Next-Gen\nErgonomic\n" + "Thigh Protection" (blue)
  const getRenderedHeading = () => {
    const raw = mainHeading || ''
    const parts = raw.split(' ')
    if (parts.length >= 3) {
      // Last 2 words or last phrase gets the signature royal blue highlight
      const whitePart1 = parts[0]
      const whitePart2 = parts[1]
      const bluePart = parts.slice(2).join(' ')
      return (
        <>
          <span className="block">{whitePart1}</span>
          <span className="block">{whitePart2}</span>
          <span className="block text-[#2563eb] drop-shadow-[0_4px_16px_rgba(37,99,235,0.4)]">
            {bluePart}
          </span>
        </>
      )
    }
    return <span style={{ color: textColor }}>{raw}</span>
  }

  const handleToggleBold = (e) => {
    e.stopPropagation()
    onUpdateElement({ isBold: !isBold })
  }

  const handleToggleItalic = (e) => {
    e.stopPropagation()
    onUpdateElement({ isItalic: !isItalic })
  }

  const handleCycleAlignment = (e) => {
    e.stopPropagation()
    const nextAlign = alignment === 'left' ? 'center' : alignment === 'center' ? 'right' : 'left'
    onUpdateElement({ alignment: nextAlign })
  }

  const handleDeleteActive = (e) => {
    e.stopPropagation()
    if (activeElement === 'heading') {
      onUpdateElement({ isHeadingHidden: true })
    } else if (activeElement === 'subheading') {
      onUpdateElement({ isSubHeadingHidden: true })
    } else if (activeElement === 'buttons') {
      onUpdateElement({ isButtonsHidden: true })
    }
  }

  return (
    <div
      className="flex-1 relative overflow-hidden bg-[#070b14] flex items-center justify-center p-3 sm:p-6 lg:p-8 select-none"
      onClick={() => onSelectElement && onSelectElement('hero')}
    >
      {/* Visual Canvas Viewport Frame */}
      <div className="relative w-full max-w-5xl aspect-[16/10] sm:aspect-[16/9.5] rounded-2xl overflow-hidden bg-[#050811] border border-slate-800 shadow-2xl transition-all">
        
        {/* ========================================================================= */}
        {/* 1. HERO BACKGROUND IMAGE & ATMOSPHERIC LIGHTING                           */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/nextgen_batsman_helmet.jpg"
            alt="Cricket Batsman in Helmet under Stadium Floodlights"
            className="w-full h-full object-cover object-[center_35%] select-none brightness-75 contrast-110"
            onError={(e) => {
              // Fallback to batsman hero
              e.currentTarget.src = '/images/batsman_hero.jpg'
            }}
          />
          {/* Radial Dark Vignette & Gradient Overlays for High Contrast Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-black/40 pointer-events-none" />
          <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />
        </div>

        {/* ========================================================================= */}
        {/* 2. LIVE HERO CONTENT LAYER WITH INTERACTIVE BOUNDING BOXES                */}
        {/* ========================================================================= */}
        <div className="relative z-10 w-full h-full p-6 sm:p-10 lg:p-14 flex flex-col justify-center">
          <div className="max-w-2xl">
            
            {/* Top Pill Tag: ELITE PERFORMANCE */}
            <div
              onClick={(e) => {
                e.stopPropagation()
                onSelectElement('tag')
              }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0a1630]/90 border border-blue-500/40 text-[10px] font-extrabold uppercase tracking-widest text-blue-400 mb-4 shadow-lg backdrop-blur-md cursor-pointer hover:border-blue-400 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>ELITE PERFORMANCE</span>
            </div>

            {/* =================================================================== */}
            {/* A. MAIN HEADING WITH SELECTION BOUNDING BOX & INLINE TOOLBAR        */}
            {/* =================================================================== */}
            {!isHeadingHidden && (
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectElement('heading')
                }}
                className={`relative group inline-block my-1 transition-all ${
                  activeElement === 'heading' && !isPreviewMode
                    ? 'border-2 border-[#1d63ed] shadow-[0_0_20px_rgba(29,99,237,0.35)] rounded-sm p-2 sm:p-3 bg-blue-950/15'
                    : 'border-2 border-transparent hover:border-blue-500/40 p-2 sm:p-3 rounded-sm cursor-pointer'
                }`}
              >
                {/* 1. Active Selection Tag Badge */}
                {activeElement === 'heading' && !isPreviewMode && (
                  <div className="absolute -top-7 left-0 bg-[#1d63ed] text-white text-[10px] font-black px-2 py-0.5 rounded shadow-lg flex items-center gap-1 z-30 tracking-wide select-none">
                    <MousePointer className="w-3 h-3 fill-current" />
                    <span>Active Element: Main Heading</span>
                  </div>
                )}

                {/* 2. Floating Inline Formatting Toolbar */}
                {activeElement === 'heading' && !isPreviewMode && (
                  <div
                    className="absolute -top-16 left-0 bg-[#0d1527] border border-slate-700/90 rounded-lg px-2 py-1.5 flex items-center gap-1 shadow-2xl z-30 backdrop-blur-md"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Bold button */}
                    <button
                      type="button"
                      onClick={handleToggleBold}
                      className={`w-7 h-7 rounded flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                        isBold
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Bold"
                    >
                      B
                    </button>

                    {/* Italic button */}
                    <button
                      type="button"
                      onClick={handleToggleItalic}
                      className={`w-7 h-7 rounded flex items-center justify-center font-serif italic text-xs transition-colors cursor-pointer ${
                        isItalic
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800'
                      }`}
                      title="Italic"
                    >
                      I
                    </button>

                    {/* Alignment button */}
                    <button
                      type="button"
                      onClick={handleCycleAlignment}
                      className="w-7 h-7 rounded flex items-center justify-center text-xs text-blue-400 bg-blue-600/20 hover:bg-blue-600/30 transition-colors cursor-pointer"
                      title={`Align (${alignment})`}
                    >
                      {alignment === 'center' ? (
                        <AlignCenter className="w-3.5 h-3.5" />
                      ) : alignment === 'right' ? (
                        <AlignRight className="w-3.5 h-3.5" />
                      ) : (
                        <AlignLeft className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <div className="w-[1px] h-4 bg-slate-700 mx-1" />

                    {/* Link button */}
                    <button
                      type="button"
                      onClick={() => onSelectElement('ctaLink')}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                      title="Edit CTA Link"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={handleDeleteActive}
                      className="w-7 h-7 rounded flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Hide Element"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* 3. Corner & Edge Resize Handles */}
                {activeElement === 'heading' && !isPreviewMode && (
                  <>
                    <div className="absolute -top-1.5 -left-1.5 w-2.5 h-2.5 bg-[#1d63ed] border border-white rounded-none shadow-sm pointer-events-none" />
                    <div className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 bg-[#1d63ed] border border-white rounded-none shadow-sm pointer-events-none" />
                    <div className="absolute -bottom-1.5 -left-1.5 w-2.5 h-2.5 bg-[#1d63ed] border border-white rounded-none shadow-sm pointer-events-none" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-2.5 h-2.5 bg-[#1d63ed] border border-white rounded-none shadow-sm pointer-events-none" />
                    <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-2 bg-[#1d63ed] border border-white rounded-none pointer-events-none" />
                    <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-2 bg-[#1d63ed] border border-white rounded-none pointer-events-none" />
                  </>
                )}

                {/* 4. Rendered Heading Typography */}
                <h1
                  style={{
                    fontSize: `${Math.max(28, fontSize)}px`,
                    fontWeight: isBold ? 900 : 700,
                    fontStyle: isItalic ? 'italic' : 'normal',
                    textAlign: alignment,
                    lineHeight: 1.08,
                    letterSpacing: '-0.025em'
                  }}
                  className="font-black text-white select-none transition-all tracking-tight"
                >
                  {getRenderedHeading()}
                </h1>
              </div>
            )}

            {/* =================================================================== */}
            {/* B. SUB-HEADING TEXT ELEMENT                                         */}
            {/* =================================================================== */}
            {!isSubHeadingHidden && (
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectElement('subheading')
                }}
                className={`relative inline-block mt-4 mb-6 transition-all ${
                  activeElement === 'subheading' && !isPreviewMode
                    ? 'border-2 border-[#1d63ed] shadow-[0_0_15px_rgba(29,99,237,0.3)] rounded-lg p-2.5 bg-blue-950/20'
                    : 'border-2 border-transparent hover:border-blue-500/40 p-2.5 rounded-lg cursor-pointer'
                }`}
              >
                {activeElement === 'subheading' && !isPreviewMode && (
                  <div className="absolute -top-6 left-0 bg-[#1d63ed] text-white text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1 z-30">
                    <MousePointer className="w-2.5 h-2.5 fill-current" />
                    <span>Active Element: Sub-heading</span>
                  </div>
                )}
                <p className="text-slate-300 text-xs sm:text-sm lg:text-base leading-relaxed max-w-xl font-normal drop-shadow">
                  {subHeading}
                </p>
              </div>
            )}

            {/* =================================================================== */}
            {/* C. ACTION BUTTONS OVERLAY                                          */}
            {/* =================================================================== */}
            {!isButtonsHidden && (
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectElement('buttons')
                }}
                className={`relative inline-flex flex-wrap items-center gap-3 sm:gap-4 mt-2 transition-all ${
                  activeElement === 'buttons' && !isPreviewMode
                    ? 'border-2 border-[#1d63ed] shadow-[0_0_15px_rgba(29,99,237,0.3)] rounded-2xl p-2 bg-blue-950/20'
                    : 'border-2 border-transparent hover:border-blue-500/40 p-2 rounded-2xl cursor-pointer'
                }`}
              >
                {activeElement === 'buttons' && !isPreviewMode && (
                  <div className="absolute -top-6 left-0 bg-[#1d63ed] text-white text-[9px] font-black px-2 py-0.5 rounded shadow flex items-center gap-1 z-30">
                    <MousePointer className="w-2.5 h-2.5 fill-current" />
                    <span>Active Element: Action Buttons</span>
                  </div>
                )}

                {/* Primary Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onNavigate) onNavigate(ctaLink || '/shop-armours')
                  }}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-[#1d63ed] hover:bg-[#1554d1] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <span>Explore Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Secondary Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onNavigate) onNavigate('/contact')
                  }}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-white border border-white/25 hover:border-white/50 text-xs sm:text-sm font-semibold backdrop-blur-md cursor-pointer transition-all active:scale-95"
                >
                  Customize Your Gear
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Viewport Scale Indicator */}
        <div className="absolute bottom-3 right-4 px-2 py-1 rounded bg-black/60 border border-slate-800 text-[10px] text-slate-400 font-mono flex items-center gap-1.5 backdrop-blur-sm z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>100% Canvas</span>
        </div>

      </div>
    </div>
  )
}

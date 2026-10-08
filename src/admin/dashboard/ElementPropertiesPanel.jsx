import React, { useRef } from 'react'
import {
  SlidersHorizontal,
  Link as LinkIcon,
  RotateCcw,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  Check,
  X,
  UploadCloud,
  Image as ImageIcon,
  Video as VideoIcon,
  Eye,
  Film
} from 'lucide-react'

export default function ElementPropertiesPanel({
  isOpen = false,
  onClose,
  elementData,
  onUpdateElement,
  onResetDefaults,
  onSaveElement,
  isSaving = false
}) {
  const fileInputRef = useRef(null)
  const videoInputRef = useRef(null)
  const posterInputRef = useRef(null)

  if (!isOpen) return null

  const {
    mainHeading = 'Next-Gen Ergonomic Thigh Protection',
    subHeading = 'Engineered for maximum mobility & impact absorption in every stroke. Trusted against 150+ km/h deliveries.',
    textColor = '#FFFFFF',
    fontSize = 48,
    ctaLink = '/shop-armours',
    isHeadingHidden = false,
    activeElement = 'heading', // 'heading' | 'subheading' | 'buttons' | 'media'
    // Media settings
    mediaType = 'image', // 'image' | 'video'
    imageSrc = '/images/nextgen_batsman_helmet.jpg',
    imageOpacity = 100,
    overlayTint = 40,
    blurAmount = 0,
    videoSrc = 'https://assets.armourcraft.io/static/batsman_hero.mp4',
    videoPoster = '/images/nextgen_batsman_helmet.jpg',
    videoAutoplay = true,
    videoLoop = true,
    videoMute = true,
    videoControls = false
  } = elementData || {}

  const isMediaMode = activeElement === 'media'

  const handleFontSizeChange = (delta) => {
    const nextSize = Math.max(24, Math.min(72, (fontSize || 48) + delta))
    onUpdateElement({ fontSize: nextSize })
  }

  // Handle local file uploads
  const handleImageFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onUpdateElement({ imageSrc: url })
    }
  }

  const handleVideoFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onUpdateElement({ videoSrc: url, mediaType: 'video' })
    }
  }

  const handlePosterFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      onUpdateElement({ videoPoster: url })
    }
  }

  return (
    <aside className="fixed md:sticky top-16 right-0 h-[calc(100vh-4rem)] w-80 lg:w-[340px] bg-[#0c1220] border-l border-slate-800/80 flex flex-col justify-between p-5 z-40 overflow-y-auto select-none shrink-0 shadow-2xl transition-transform duration-200">
      <div className="space-y-6">
        {/* ========================================================================= */}
        {/* 1. HEADER: ELEMENT PROPERTIES WITH MODE TAG & CLOSE ICON                   */}
        {/* ========================================================================= */}
        <div className="pb-3 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#1d63ed]" />
              <h2 className="text-xs font-black tracking-wider text-slate-100 uppercase font-sans">
                ELEMENT PROPERTIES
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 bg-[#121c2e] border border-slate-700/60 px-2 py-0.5 rounded uppercase tracking-wider">
                {isMediaMode ? 'Media' : 'Text'}
              </span>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 cursor-pointer"
                  title="Close sidebar"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {isMediaMode && (
            <div className="text-[11px] font-black tracking-wider text-slate-400 uppercase mt-1">
              MEDIA COMPONENT
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* 2. MODE SWITCH: IF MEDIA COMPONENT (image_99e1d9.png & image_99e2d9.png)   */}
        {/* ========================================================================= */}
        {isMediaMode ? (
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* A. MEDIA TYPE SEGMENTED TOGGLE */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                MEDIA TYPE
              </span>
              <div className="grid grid-cols-2 gap-2 bg-[#080d19] p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => onUpdateElement({ mediaType: 'image' })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    mediaType === 'image'
                      ? 'bg-[#1d63ed] text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Image</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateElement({ mediaType: 'video' })}
                  className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    mediaType === 'video'
                      ? 'bg-[#1d63ed] text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <VideoIcon className="w-3.5 h-3.5" />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {/* B. IMAGE MODE PROPERTIES (image_99e2d9.png) */}
            {mediaType === 'image' && (
              <>
                {/* IMAGE SOURCE */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    IMAGE SOURCE
                  </span>

                  {/* Upload File Drag-and-Drop Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-800 hover:border-blue-500/60 rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-[#080d19]/80 hover:bg-[#080d19] transition-all cursor-pointer group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white uppercase tracking-wider">
                      UPLOAD FILE
                    </span>
                  </div>

                  {/* Direct URL Input */}
                  <div className="space-y-1">
                    <div className="bg-[#080d19] border border-slate-800 focus-within:border-[#1d63ed] rounded-lg p-2.5 flex items-center gap-2 transition-colors">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={imageSrc}
                        onChange={(e) => onUpdateElement({ imageSrc: e.target.value })}
                        placeholder="https://assets.armourcraft.io/static/hero.jpg"
                        className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-600 outline-none font-mono truncate"
                      />
                    </div>
                  </div>
                </div>

                {/* STYLING & EFFECTS */}
                <div className="space-y-4 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    STYLING & EFFECTS
                  </span>

                  {/* Image Opacity */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Image Opacity</span>
                      <span className="text-blue-400 font-mono font-bold">{imageOpacity}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={imageOpacity}
                      onChange={(e) => onUpdateElement({ imageOpacity: Number(e.target.value) })}
                      className="w-full accent-[#1d63ed] cursor-pointer"
                    />
                  </div>

                  {/* Dark Overlay Tint */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Dark Overlay Tint</span>
                      <span className="text-blue-400 font-mono font-bold">{overlayTint}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={overlayTint}
                      onChange={(e) => onUpdateElement({ overlayTint: Number(e.target.value) })}
                      className="w-full accent-[#1d63ed] cursor-pointer"
                    />
                  </div>

                  {/* Blur Amount */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium">Blur Amount</span>
                      <span className="text-blue-400 font-mono font-bold">{blurAmount}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={20}
                      value={blurAmount}
                      onChange={(e) => onUpdateElement({ blurAmount: Number(e.target.value) })}
                      className="w-full accent-[#1d63ed] cursor-pointer"
                    />
                  </div>
                </div>
              </>
            )}

            {/* C. VIDEO MODE PROPERTIES (image_99e1d9.png) */}
            {mediaType === 'video' && (
              <>
                {/* VIDEO SOURCE */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    VIDEO SOURCE
                  </span>

                  {/* Upload MP4 File Box */}
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-800 hover:border-blue-500/60 rounded-xl p-5 flex flex-col items-center justify-center gap-2 bg-[#080d19]/80 hover:bg-[#080d19] transition-all cursor-pointer group"
                  >
                    <input
                      type="file"
                      ref={videoInputRef}
                      onChange={handleVideoFileUpload}
                      accept="video/mp4,video/*"
                      className="hidden"
                    />
                    <UploadCloud className="w-7 h-7 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    <span className="text-xs font-bold text-slate-300 group-hover:text-white uppercase tracking-wider">
                      UPLOAD MP4 FILE
                    </span>
                  </div>

                  {/* YouTube or Vimeo Link */}
                  <div className="space-y-1">
                    <div className="bg-[#080d19] border border-slate-800 focus-within:border-[#1d63ed] rounded-lg p-2.5 flex items-center gap-2 transition-colors">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <input
                        type="text"
                        value={videoSrc}
                        onChange={(e) => onUpdateElement({ videoSrc: e.target.value })}
                        placeholder="YouTube or Vimeo Link..."
                        className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-600 outline-none font-mono truncate"
                      />
                    </div>
                  </div>
                </div>

                {/* PLAYBACK SETTINGS */}
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    PLAYBACK SETTINGS
                  </span>

                  {/* Autoplay Video */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">Autoplay Video</span>
                    <button
                      type="button"
                      onClick={() => onUpdateElement({ videoAutoplay: !videoAutoplay })}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer ${
                        videoAutoplay ? 'bg-blue-600' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform duration-200 ${
                          videoAutoplay ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Loop Video */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">Loop Video</span>
                    <button
                      type="button"
                      onClick={() => onUpdateElement({ videoLoop: !videoLoop })}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer ${
                        videoLoop ? 'bg-blue-600' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform duration-200 ${
                          videoLoop ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Mute Audio */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">Mute Audio</span>
                    <button
                      type="button"
                      onClick={() => onUpdateElement({ videoMute: !videoMute })}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer ${
                        videoMute ? 'bg-blue-600' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform duration-200 ${
                          videoMute ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Show Player Controls */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300">Show Player Controls</span>
                    <button
                      type="button"
                      onClick={() => onUpdateElement({ videoControls: !videoControls })}
                      className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer ${
                        videoControls ? 'bg-blue-600' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[3px] transition-transform duration-200 ${
                          videoControls ? 'translate-x-4' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* POSTER FRAME (FALLBACK) */}
                <div className="space-y-3 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    POSTER FRAME (FALLBACK)
                  </span>

                  <div
                    onClick={() => posterInputRef.current?.click()}
                    className="w-full relative aspect-[16/9] border border-slate-800 rounded-xl overflow-hidden flex flex-col items-center justify-center gap-2 bg-[#080d19] hover:border-blue-500/60 transition-all cursor-pointer group"
                  >
                    <input
                      type="file"
                      ref={posterInputRef}
                      onChange={handlePosterFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    {videoPoster ? (
                      <>
                        <img
                          src={videoPoster}
                          alt="Poster Frame"
                          className="w-full h-full object-cover brightness-50 group-hover:brightness-75 transition-all"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                          <ImageIcon className="w-5 h-5 text-blue-400 drop-shadow" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-white drop-shadow">
                            CHANGE POSTER
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-6 h-6 text-slate-400 group-hover:text-blue-400" />
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                          UPLOAD POSTER FRAME
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* 3. TEXT MODE PROPERTIES (image_998b67.jpg)                                 */
          /* ========================================================================= */
          <div className="space-y-6 animate-in fade-in duration-150">
            {/* CONTENT EDIT */}
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

            {/* STYLING & LINKS */}
            <div className="space-y-3.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                STYLING & LINKS
              </span>

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

            {/* QUICK ACTIONS */}
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
        )}
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM ACTION BUTTON: UPDATE ELEMENT                                   */}
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

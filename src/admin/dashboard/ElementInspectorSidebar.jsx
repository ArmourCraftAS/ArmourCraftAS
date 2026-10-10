import React, { useState } from 'react'
import {
  X,
  Type,
  Image as ImageIcon,
  Video,
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Sliders,
  RotateCcw,
  Check,
  Upload,
  Database,
  ExternalLink,
  Shield,
  ShieldCheck,
  Zap,
  Hammer,
  Award,
  Activity,
  CheckCircle2,
  Lock,
  Truck,
  Star,
  Feather,
  Flame,
  Layers,
  Globe,
  Compass,
  Heart,
  Target,
  TrendingUp,
  Box,
  Package,
  Clock
} from 'lucide-react'

// Available gallery image presets in project
const PRESET_IMAGES = [
  { name: 'Batsman Stance', src: '/images/batsman_hero.jpg' },
  { name: 'Match Day Stance', src: '/images/cricket_hero.jpg' },
  { name: 'Next-Gen Helmet', src: '/images/nextgen_batsman_helmet.jpg' },
  { name: 'Carbon Texture', src: '/images/advantage_carbon.png' },
  { name: 'Blue Thigh Guard', src: '/images/advantage_thigh_guard.png' },
  { name: 'Inner Protector', src: '/images/product_inner_guard.png' },
  { name: 'Leg Guards', src: '/images/product_leg_guard.png' },
  { name: 'Custom Team Pads', src: '/images/custom_pads.png' },
  { name: 'Lab Ballistics Test', src: '/images/blog_ballistic_test.jpg' },
  { name: 'EVA Honeycomb Foam', src: '/images/blog_eva_honeycomb.jpg' },
  { name: 'Sialkot Workshop', src: '/images/what_we_are_craftsmanship.jpg' },
  { name: 'Carbon Grid Lab', src: '/images/what_we_are_carbon_grid.jpg' }
]

// Available icons in library
const ICON_LIBRARY = [
  { name: 'Shield', icon: Shield },
  { name: 'ShieldCheck', icon: ShieldCheck },
  { name: 'Zap', icon: Zap },
  { name: 'Hammer', icon: Hammer },
  { name: 'Award', icon: Award },
  { name: 'Sparkles', icon: Sparkles },
  { name: 'Activity', icon: Activity },
  { name: 'CheckCircle2', icon: CheckCircle2 },
  { name: 'Lock', icon: Lock },
  { name: 'Truck', icon: Truck },
  { name: 'RotateCcw', icon: RotateCcw },
  { name: 'Star', icon: Star },
  { name: 'Feather', icon: Feather },
  { name: 'Flame', icon: Flame },
  { name: 'Layers', icon: Layers },
  { name: 'Globe', icon: Globe },
  { name: 'Compass', icon: Compass },
  { name: 'Heart', icon: Heart },
  { name: 'Target', icon: Target },
  { name: 'TrendingUp', icon: TrendingUp },
  { name: 'Box', icon: Box },
  { name: 'Package', icon: Package },
  { name: 'Clock', icon: Clock }
]

// Text color palette presets
const COLOR_PRESETS = [
  '#FFFFFF',
  '#E2E8F0',
  '#94A3B8',
  '#3B82F6',
  '#60A5FA',
  '#38BDF8',
  '#10B981',
  '#F59E0B',
  '#EF4444'
]

export default function ElementInspectorSidebar({
  selectedElement,
  onClose,
  onUpdateElement,
  onResetElement,
  onSwitchTab
}) {
  const [iconSearch, setIconSearch] = useState('')

  if (!selectedElement) return null

  const {
    id,
    type = 'text',
    label = 'Element',
    path = '',
    value = '',
    fontStyle = {},
    mediaProps = {},
    iconProps = {},
    dynamicNotice = null
  } = selectedElement

  // Handle local file upload converting to data URL
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      onUpdateElement({
        ...selectedElement,
        value: reader.result,
        mediaProps: {
          ...mediaProps,
          src: reader.result,
          mediaType: 'image'
        }
      })
    }
    reader.readAsDataURL(file)
  }

  const filteredIcons = ICON_LIBRARY.filter((item) =>
    item.name.toLowerCase().includes(iconSearch.toLowerCase())
  )

  return (
    <aside className="w-80 sm:w-96 h-full bg-[#080d19]/98 backdrop-blur-2xl border-l border-slate-800/90 flex flex-col z-40 select-none shadow-2xl transition-all duration-200">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER: BADGE & TYPE (FIGMA SPEC)                                  */}
      {/* ========================================================================= */}
      <div className="p-4 border-b border-slate-800/90 flex items-center justify-between shrink-0 bg-[#060a14]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            {type === 'text' ? (
              <Type className="w-4 h-4" />
            ) : type === 'media' ? (
              mediaProps?.mediaType === 'video' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />
            ) : type === 'icon' ? (
              <Sparkles className="w-4 h-4" />
            ) : (
              <Database className="w-4 h-4 text-purple-400" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-extrabold tracking-wider text-blue-400 uppercase block leading-none">
              ELEMENT PROPERTIES
            </span>
            <h3 className="text-xs font-black text-white uppercase tracking-wider mt-0.5">
              {type === 'text'
                ? 'TEXT COMPONENT'
                : type === 'media'
                ? 'MEDIA COMPONENT'
                : type === 'icon'
                ? 'ICON COMPONENT'
                : 'DYNAMIC COMPONENT'}
            </h3>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Selected Element Breadcrumb / Identifier */}
      <div className="px-4 py-2 bg-[#0c1426] border-b border-slate-800/80 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 truncate font-mono">
          {label}
        </span>
        <span className="text-blue-400/80 font-mono text-[10px]">
          {path || id}
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 2. SCROLLABLE INSPECTOR CONTROLS                                          */}
      {/* ========================================================================= */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
        
        {/* ======================================================================= */}
        {/* CASE A: DYNAMIC COMPONENT NOTICE (SMART SCOPING RULE)                    */}
        {/* ======================================================================= */}
        {type === 'dynamic' && (
          <div className="rounded-xl p-4 bg-purple-950/20 border border-purple-500/30 space-y-3">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
              <Database className="w-4 h-4 shrink-0" />
              <span>Dynamic Database Component</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              {dynamicNotice ||
                'This card is dynamically bound to Supabase backend tables. Layout structure and styling are isolated to preserve storefront integrity.'}
            </p>
            <p className="text-[11px] text-slate-400">
              To update this item, pricing, or media, use its dedicated management tab.
            </p>
            {onSwitchTab && (
              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => onSwitchTab('product')}
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
                >
                  <span>Open Products Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchTab('Blog')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <span>Open Blog Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onSwitchTab('FAQs')}
                  className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-700"
                >
                  <span>Open FAQs Tab</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* ======================================================================= */}
        {/* CASE B: TEXT COMPONENT PROPERTIES                                       */}
        {/* ======================================================================= */}
        {type === 'text' && (
          <>
            {/* 1. Content Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Text Content
              </label>
              <textarea
                value={value || ''}
                rows={4}
                onChange={(e) =>
                  onUpdateElement({
                    ...selectedElement,
                    value: e.target.value
                  })
                }
                placeholder="Enter text or heading content..."
                className="w-full px-3 py-2.5 rounded-xl bg-[#0e1628] border border-slate-700 text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors leading-relaxed resize-none shadow-inner"
              />
              <div className="flex justify-between items-center text-[10px] text-slate-500">
                <span>Direct visual sync</span>
                <span>{(value || '').length} chars</span>
              </div>
            </div>

            {/* 2. Font Size Slider & Presets */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Font Size
                </label>
                <span className="text-xs font-mono font-bold text-blue-400">
                  {fontStyle.fontSize || 16}px
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="96"
                step="2"
                value={fontStyle.fontSize || 16}
                onChange={(e) =>
                  onUpdateElement({
                    ...selectedElement,
                    fontStyle: {
                      ...fontStyle,
                      fontSize: Number(e.target.value)
                    }
                  })
                }
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              {/* Quick Size Presets */}
              <div className="grid grid-cols-5 gap-1.5 pt-1">
                {[14, 18, 28, 48, 72].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() =>
                      onUpdateElement({
                        ...selectedElement,
                        fontStyle: { ...fontStyle, fontSize: sz }
                      })
                    }
                    className={`py-1 text-[10px] font-bold rounded-lg border transition-all cursor-pointer ${
                      fontStyle.fontSize === sz
                        ? 'bg-blue-600 text-white border-blue-500'
                        : 'bg-[#0e1628] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {sz}px
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Text Alignment & Styling */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Alignment & Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* Alignment Pill */}
                <div className="flex items-center rounded-xl bg-[#0e1628] border border-slate-700/80 p-1">
                  {[
                    { align: 'left', icon: AlignLeft },
                    { align: 'center', icon: AlignCenter },
                    { align: 'right', icon: AlignRight }
                  ].map((btn) => {
                    const IconComp = btn.icon
                    const isActive = (fontStyle.textAlign || 'left') === btn.align
                    return (
                      <button
                        key={btn.align}
                        type="button"
                        onClick={() =>
                          onUpdateElement({
                            ...selectedElement,
                            fontStyle: { ...fontStyle, textAlign: btn.align }
                          })
                        }
                        className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-400 hover:text-white'
                        }`}
                        title={`Align ${btn.align}`}
                      >
                        <IconComp className="w-3.5 h-3.5" />
                      </button>
                    )
                  })}
                </div>

                {/* Bold & Italic Toggles */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateElement({
                        ...selectedElement,
                        fontStyle: { ...fontStyle, isBold: !fontStyle.isBold }
                      })
                    }
                    className={`flex-1 py-2 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                      fontStyle.isBold
                        ? 'bg-blue-600/30 text-blue-300 border-blue-500/60'
                        : 'bg-[#0e1628] text-slate-400 border-slate-700/80 hover:text-white'
                    }`}
                    title="Toggle Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateElement({
                        ...selectedElement,
                        fontStyle: { ...fontStyle, isItalic: !fontStyle.isItalic }
                      })
                    }
                    className={`flex-1 py-2 rounded-xl border flex items-center justify-center transition-colors cursor-pointer ${
                      fontStyle.isItalic
                        ? 'bg-blue-600/30 text-blue-300 border-blue-500/60'
                        : 'bg-[#0e1628] text-slate-400 border-slate-700/80 hover:text-white'
                    }`}
                    title="Toggle Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Text Color Swatches */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Text Color
                </label>
                <span className="text-xs font-mono text-slate-400">
                  {fontStyle.color || '#FFFFFF'}
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      onUpdateElement({
                        ...selectedElement,
                        fontStyle: { ...fontStyle, color }
                      })
                    }
                    className="w-6 h-6 rounded-full border border-slate-600 hover:scale-110 transition-transform cursor-pointer flex items-center justify-center relative shadow"
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {fontStyle.color === color && (
                      <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                    )}
                  </button>
                ))}
                {/* Hex input */}
                <input
                  type="text"
                  value={fontStyle.color || '#FFFFFF'}
                  onChange={(e) =>
                    onUpdateElement({
                      ...selectedElement,
                      fontStyle: { ...fontStyle, color: e.target.value }
                    })
                  }
                  className="w-20 px-2 py-1 rounded-lg bg-[#0e1628] border border-slate-700 text-white text-xs font-mono focus:outline-none"
                  placeholder="#hex"
                />
              </div>
            </div>
          </>
        )}

        {/* ======================================================================= */}
        {/* CASE C: MEDIA COMPONENT PROPERTIES (IMAGE / VIDEO)                      */}
        {/* ======================================================================= */}
        {type === 'media' && (
          <>
            {/* 1. Source Type Selector (Image vs Video) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Media Source Type
              </label>
              <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0e1628] border border-slate-700/80">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateElement({
                      ...selectedElement,
                      mediaProps: { ...mediaProps, mediaType: 'image' }
                    })
                  }
                  className={`py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    mediaProps.mediaType !== 'video'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Image</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateElement({
                      ...selectedElement,
                      mediaProps: { ...mediaProps, mediaType: 'video' }
                    })
                  }
                  className={`py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    mediaProps.mediaType === 'video'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Video</span>
                </button>
              </div>
            </div>

            {/* 2. Image Source Configuration */}
            {mediaProps.mediaType !== 'video' ? (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Image URL or Path
                  </label>
                  <input
                    type="text"
                    value={mediaProps.src || value || ''}
                    onChange={(e) =>
                      onUpdateElement({
                        ...selectedElement,
                        value: e.target.value,
                        mediaProps: { ...mediaProps, src: e.target.value }
                      })
                    }
                    placeholder="/images/... or https://..."
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1628] border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                  {/* File Upload Button */}
                  <label className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider cursor-pointer transition-colors shadow">
                    <Upload className="w-3.5 h-3.5 text-blue-400" />
                    <span>Upload Local File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset Gallery Thumbnails */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Quick Gallery Presets
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.src}
                        type="button"
                        onClick={() =>
                          onUpdateElement({
                            ...selectedElement,
                            value: img.src,
                            mediaProps: { ...mediaProps, src: img.src }
                          })
                        }
                        className={`group relative aspect-video rounded-lg overflow-hidden border transition-all cursor-pointer ${
                          (mediaProps.src || value) === img.src
                            ? 'border-blue-500 ring-2 ring-blue-500/50'
                            : 'border-slate-800 hover:border-slate-600'
                        }`}
                        title={img.name}
                      >
                        <img
                          src={img.src}
                          alt={img.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute inset-x-0 bottom-0 bg-black/80 text-[8px] text-white px-1 py-0.5 truncate text-center block">
                          {img.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Opacity Slider */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Opacity
                    </label>
                    <span className="text-xs font-mono text-blue-400">
                      {mediaProps.opacity || 100}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={mediaProps.opacity || 100}
                    onChange={(e) =>
                      onUpdateElement({
                        ...selectedElement,
                        mediaProps: {
                          ...mediaProps,
                          opacity: Number(e.target.value)
                        }
                      })
                    }
                    className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>
              </>
            ) : (
              /* 3. Video Source Configuration */
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Direct Video Link (MP4 / WebM)
                  </label>
                  <input
                    type="text"
                    value={mediaProps.videoSrc || ''}
                    onChange={(e) =>
                      onUpdateElement({
                        ...selectedElement,
                        mediaProps: { ...mediaProps, videoSrc: e.target.value }
                      })
                    }
                    placeholder="https://.../video.mp4"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1628] border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Poster Image URL
                  </label>
                  <input
                    type="text"
                    value={mediaProps.poster || ''}
                    onChange={(e) =>
                      onUpdateElement({
                        ...selectedElement,
                        mediaProps: { ...mediaProps, poster: e.target.value }
                      })
                    }
                    placeholder="/images/poster.jpg"
                    className="w-full px-3 py-2 rounded-xl bg-[#0e1628] border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Playback Toggles */}
                <div className="space-y-2 pt-1 border-t border-slate-800">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                    Playback Behavior
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: 'autoplay', label: 'Autoplay' },
                      { key: 'loop', label: 'Loop' },
                      { key: 'muted', label: 'Muted (Required for Autoplay)' },
                      { key: 'controls', label: 'Show Player Controls' }
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={!!mediaProps[item.key]}
                          onChange={(e) =>
                            onUpdateElement({
                              ...selectedElement,
                              mediaProps: {
                                ...mediaProps,
                                [item.key]: e.target.checked
                              }
                            })
                          }
                          className="w-4 h-4 rounded bg-[#0e1628] border-slate-700 text-blue-600 accent-blue-500"
                        />
                        <span>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ======================================================================= */}
        {/* CASE D: ICON COMPONENT PROPERTIES                                       */}
        {/* ======================================================================= */}
        {type === 'icon' && (
          <>
            {/* Search filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Select Icon
              </label>
              <input
                type="text"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                placeholder="Search icon..."
                className="w-full px-3 py-2 rounded-xl bg-[#0e1628] border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Icon Grid */}
            <div className="grid grid-cols-4 gap-2 max-h-56 overflow-y-auto custom-scrollbar p-1">
              {filteredIcons.map((item) => {
                const IconComp = item.icon
                const isSelected = iconProps.iconName === item.name
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() =>
                      onUpdateElement({
                        ...selectedElement,
                        iconProps: { ...iconProps, iconName: item.name }
                      })
                    }
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/30 border-blue-500 text-white shadow-md shadow-blue-500/20'
                        : 'bg-[#0e1628] border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                    title={item.name}
                  >
                    <IconComp className="w-5 h-5" />
                    <span className="text-[9px] font-mono truncate w-full text-center">
                      {item.name}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Icon Color Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Icon Accent Color
              </label>
              <div className="flex items-center gap-2 flex-wrap">
                {COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      onUpdateElement({
                        ...selectedElement,
                        iconProps: { ...iconProps, color }
                      })
                    }
                    className="w-6 h-6 rounded-full border border-slate-600 hover:scale-110 transition-transform cursor-pointer flex items-center justify-center shadow"
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {iconProps.color === color && (
                      <Check className="w-3.5 h-3.5 text-black stroke-[3]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Size Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Icon Size
                </label>
                <span className="text-xs font-mono text-blue-400">
                  {iconProps.size || 20}px
                </span>
              </div>
              <input
                type="range"
                min="16"
                max="48"
                step="2"
                value={iconProps.size || 20}
                onChange={(e) =>
                  onUpdateElement({
                    ...selectedElement,
                    iconProps: { ...iconProps, size: Number(e.target.value) }
                  })
                }
                className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
            </div>
          </>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 3. BOTTOM ACTIONS BAR                                                     */}
      {/* ========================================================================= */}
      <div className="p-4 border-t border-slate-800/90 bg-[#060a14] shrink-0 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => onResetElement && onResetElement(selectedElement)}
          className="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-slate-700/80 flex items-center gap-1.5"
          title="Reset to original content"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-2 rounded-xl bg-[#1762f0] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-blue-600/30 flex items-center justify-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>Done</span>
        </button>
      </div>

    </aside>
  )
}

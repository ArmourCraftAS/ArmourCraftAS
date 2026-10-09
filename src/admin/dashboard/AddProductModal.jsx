import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CloudUpload, Plus, ChevronDown, X, Check } from 'lucide-react'

const defaultDescriptions = {
  'pro-dual-thigh': 'Ultra-lightweight high-density foam construction with carbon fiber inserts for maximum impact protection.',
  'interceptor-leg-guards': 'Next-gen ergonomic fit designed for professional mobility and 3D molded shin protection.',
  'vanguard-inner-pads': 'Fully customizable moisture-wicking inner padding with antimicrobial fabric technology.',
  'aegis-chest-protector': 'Anatomically shaped chest guard with multi-layered protective shells for maximum rib cage safety.',
  'shadow-batting-gloves': 'Pittards leather palms providing ultimate grip and Pittards Airflow technology for cooling.',
  'sentinel-aero-helmet': 'Lightweight ABS shell with high-grade steel visor for uncompromised vision and protection.',
  'youth-elite-thigh': 'Ages 8-14 high impact EVA protection for junior & academy players.',
  'aero-leg-guards': 'Revolutionary 3D-molded foam for zero-weight sprinting speed.',
  'smart-inner-thigh': 'Extra internal protection for high-impact deliveries. Discrete & comfortable.'
}

const getFallbackDescription = (prod) => {
  if (!prod) return ''
  if (prod.description && prod.description.trim()) return prod.description.trim()
  if (prod.id && defaultDescriptions[prod.id]) return defaultDescriptions[prod.id]
  const titleLower = (prod.title || '').toLowerCase()
  if (titleLower.includes('youth')) return 'Ages 8-14 high impact EVA protection for junior & academy players.'
  if (titleLower.includes('interceptor')) return 'Next-gen ergonomic fit designed for professional mobility and 3D molded shin protection.'
  if (titleLower.includes('vanguard')) return 'Fully customizable moisture-wicking inner padding with antimicrobial fabric technology.'
  if (titleLower.includes('chest') || titleLower.includes('aegis')) return 'Anatomically shaped chest guard with multi-layered protective shells for maximum rib cage safety.'
  if (titleLower.includes('glove') || titleLower.includes('shadow')) return 'Pittards leather palms providing ultimate grip and Pittards Airflow technology for cooling.'
  if (titleLower.includes('helmet') || titleLower.includes('sentinel')) return 'Lightweight ABS shell with high-grade steel visor for uncompromised vision and protection.'
  if (titleLower.includes('thigh')) return 'Ultra-lightweight high-density foam construction with carbon fiber inserts for maximum impact protection.'
  if (titleLower.includes('leg')) return 'Next-gen ergonomic fit designed for professional mobility and 3D molded shin protection.'
  return 'Professional-grade ergonomic cricket protection engineered for maximum mobility.'
}

export default function AddProductModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  categories = ['All Products', 'Thigh Guards', 'Inner Pads', 'Leg Guards']
}) {
  const fileInputRef = useRef(null)

  const isEditMode = Boolean(initialData)

  // Filter out "All Products" for the category selector
  const availableCategories = categories.filter((c) => c !== 'All Products')

  // Form State
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState(availableCategories[0] || 'Thigh Guards')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [stance, setStance] = useState('All Stances')
  const [image, setImage] = useState('')
  const [imageName, setImageName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [impactRating, setImpactRating] = useState('160+ km/h')
  const [stock, setStock] = useState(50)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [pendingPayload, setPendingPayload] = useState(null)

  // Stance Options matching image_c27943.png & image_c25b81.png
  const stanceOptions = ['All Stances', 'Right-Handed Only', 'Left-Handed Only']

  // Pre-fill on Edit Mode or reset on Add Mode
  useEffect(() => {
    if (isOpen) {
      setShowConfirmation(false)
      setPendingPayload(null)
      if (initialData) {
        setTitle(initialData.title || '')
        setCategory(initialData.category || availableCategories[0] || 'Thigh Guards')
        setPrice(initialData.price !== undefined ? String(initialData.price) : '')
        setDescription(getFallbackDescription(initialData))

        // Normalize stance
        const rawStance = String(initialData.stance || (Array.isArray(initialData.stances) ? initialData.stances[0] : 'All Stances'))
        if (rawStance.toLowerCase().includes('right')) {
          setStance('Right-Handed Only')
        } else if (rawStance.toLowerCase().includes('left')) {
          setStance('Left-Handed Only')
        } else {
          setStance('All Stances')
        }

        setImage(initialData.image || '')
        const resolvedName =
          initialData.imageName ||
          (initialData.image ? initialData.image.split('/').pop().replace(/[?#].*$/, '') : 'image name')
        setImageName(resolvedName || 'image name')
        setImpactRating(initialData.impactRating || '160+ km/h')
        setStock(initialData.stock !== undefined ? initialData.stock : 45)
      } else {
        setTitle('')
        setCategory(availableCategories[0] || 'Thigh Guards')
        setPrice('')
        setDescription('')
        setStance('All Stances')
        setImage('')
        setImageName('')
        setImpactRating('160+ km/h')
        setStock(50)
      }
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  // File Upload Handlers
  const handleFileProcess = (file) => {
    if (!file) return
    setImageName(file.name)
    const reader = new FileReader()
    reader.onload = (e) => {
      setImage(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) handleFileProcess(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileProcess(file)
  }

  const handleRemoveImage = () => {
    setImage('')
    setImageName('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const parsedPrice = parseFloat(price) || 0
    const payload = {
      title: title.trim(),
      category,
      price: parsedPrice,
      description: description.trim(),
      stance,
      image: image || '/images/product_thigh_guard.png',
      imageName: imageName || 'product_visual.png',
      impactRating,
      stock: parseInt(stock, 10) || 45
    }

    setPendingPayload(payload)
    setShowConfirmation(true)
  }

  const handleConfirmAction = () => {
    if (pendingPayload) {
      onSave(pendingPayload)
    }
    setShowConfirmation(false)
    setPendingPayload(null)
  }

  const handleDismissConfirmation = () => {
    setShowConfirmation(false)
  }

  const modalContent = (
    <>
      <div
        className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      >
      {/* Inner Centered Floating Modal Card */}
      <div
        className="max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800/80 shadow-2xl bg-[#0B0F17] text-white relative animate-in zoom-in-95 duration-150 p-6 sm:p-8 md:p-9 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sleek Circular Close Button inside Top-Right Corner */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 sm:top-6 sm:right-6 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#131d31] hover:bg-[#1c2a47] border border-slate-700/70 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-150 cursor-pointer shadow-lg group z-30"
          title="Close modal"
        >
          <X className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform group-hover:scale-110" />
        </button>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {/* 2-Column Responsive Layout */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8">
            
            {/* ===================================================================== */}
            {/* LEFT PANEL: PRODUCT DETAILS FORM                                      */}
            {/* ===================================================================== */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
              
              {/* Header */}
              <div className="pr-12">
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Product Details
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal leading-relaxed">
                  Modify product identifiers, pricing, stance options and store visibility metrics.
                </p>
              </div>

              {/* Inputs Container */}
              <div className="space-y-4">
                
                {/* 1. PRODUCT TITLE */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    PRODUCT TITLE
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Pro Dual-Leg Thigh Guard Set"
                    className="w-full bg-[#070b14] border border-slate-800/90 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 outline-none transition-colors"
                  />
                </div>

                {/* 2. PRODUCT TYPE & PRICE (USD) (2 Columns) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  
                  {/* Product Type Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      PRODUCT TYPE
                    </label>
                    <div className="relative">
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#070b14] border border-slate-800/90 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white outline-none appearance-none cursor-pointer pr-10 transition-colors"
                      >
                        {availableCategories.map((cat) => (
                          <option key={cat} value={cat} className="bg-[#0b1220] text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Price (USD) with $ Prefix */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      PRICE (USD)
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-slate-400 text-sm font-semibold pointer-events-none select-none">
                        $
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-[#070b14] border border-slate-800/90 focus:border-blue-500 rounded-xl pl-8 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 outline-none font-mono transition-colors"
                      />
                    </div>
                  </div>

                </div>

                {/* 3. DESCRIPTION */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    DESCRIPTION
                  </label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter detailed ergonomic specifications, carbon fiber placement, and match safety rating..."
                    className="w-full bg-[#070b14] border border-slate-800/90 focus:border-blue-500 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-600 outline-none resize-none transition-colors leading-relaxed"
                  />
                </div>

                {/* 4. TARGET PLAYER STANCE (Segmented Buttons) */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    TARGET PLAYER STANCE
                  </label>
                  <div className="w-full bg-[#070b14] border border-slate-800/90 rounded-xl p-1 grid grid-cols-3 gap-1">
                    {stanceOptions.map((st) => {
                      const isSelected = stance === st
                      return (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setStance(st)}
                          className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer text-center truncate ${
                            isSelected
                              ? 'bg-[#15233c] text-white font-bold shadow-sm border border-blue-500/40'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    })}
                  </div>
                </div>

              </div>

              {/* Action Buttons (Bottom Left): Discard Changes / Cancel & Save & Update Live / Add Products */}
              <div className="flex items-center justify-end gap-3 pt-6 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-[#0c1424] hover:bg-[#131f38] border border-slate-700/70 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  {isEditMode ? 'Discard Changes' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1d68ed] hover:bg-blue-600 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {isEditMode ? 'Save & Update Live' : 'Add Products'}
                </button>
              </div>

            </div>

            {/* ===================================================================== */}
            {/* RIGHT PANEL: MEDIA PREVIEW & UPLOAD                                   */}
            {/* ===================================================================== */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              
              {/* Header */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Media Preview
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal leading-relaxed">
                  Upload, frame or remove the high-definition product visual assets.
                </p>
              </div>

              {/* Interactive Image Upload / Preview Box */}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-square sm:h-64 rounded-2xl bg-[#070b14] border transition-all duration-200 overflow-hidden flex flex-col justify-between relative cursor-pointer group ${
                  isDragging
                    ? 'border-blue-500 bg-blue-950/20 shadow-xl shadow-blue-500/20'
                    : 'border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {/* Center Content: Image or Upload Cloud Icon */}
                <div className="flex-1 w-full flex flex-col items-center justify-center p-4">
                  {image ? (
                    <img
                      src={image}
                      alt={imageName || 'Product Visual'}
                      className="w-full h-full object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] select-none"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="relative mb-2">
                        <CloudUpload className="w-16 h-16 text-[#8ba2cb]/80 group-hover:text-blue-400 transition-colors stroke-[1.2]" />
                      </div>
                      <span className="text-sm font-semibold text-slate-300">
                        Upload
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Image Name Bar */}
                <div
                  className="w-full bg-[#050811]/90 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    placeholder="image name"
                    className="w-full bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none truncate font-mono"
                  />
                  {image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                      title="Clear"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Media Action Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* + Replace / + Add image button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2.5 rounded-xl bg-[#0c1424] hover:bg-[#131f38] border border-slate-700/70 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>{isEditMode ? 'Replace Product Image' : 'Add image'}</span>
                </button>

                {/* Remove Product Image red outline button */}
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="w-full py-2.5 rounded-xl bg-transparent hover:bg-rose-500/10 border border-rose-900/60 hover:border-rose-600 text-rose-500 text-xs sm:text-sm font-bold flex items-center justify-center cursor-pointer transition-all active:scale-[0.99]"
                >
                  <span>Remove Product Image</span>
                </button>
              </div>

            </div>

          </form>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* CONDITIONAL CONFIRMATION MODAL OVERLAY (image_5b8f07.png & image_5b92cb.png) */}
      {/* ===================================================================== */}
      {showConfirmation && (
        <div
          className="fixed inset-0 z-[100001] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={handleDismissConfirmation}
        >
          {isEditMode ? (
            /* Edit Mode Confirmation Flow (image_5b8f07.png) */
            <div
              className="w-full max-w-[460px] bg-[#141820] border border-slate-800/90 rounded-3xl p-7 sm:p-8 shadow-2xl text-white relative animate-in zoom-in-95 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Blue upload cloud icon */}
              <div className="w-12 h-12 rounded-full bg-blue-950/60 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-5">
                <CloudUpload className="w-6 h-6 text-blue-500" />
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                Confirm Update Live
              </h3>

              {/* Subtext */}
              <p className="text-sm text-slate-400 font-normal leading-relaxed mb-7">
                You have unsaved changes. Are you sure you want to save and update the live product listing? This action will reflect immediately on the storefront.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className="w-full py-3 px-4 rounded-xl bg-[#1264e8] hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Yes, Update Live Listing
                </button>
                <button
                  type="button"
                  onClick={handleDismissConfirmation}
                  className="w-full py-3 px-4 rounded-xl bg-[#181d27] hover:bg-[#1f2633] text-slate-300 hover:text-white font-semibold text-sm sm:text-base border border-slate-700/60 transition-colors cursor-pointer"
                >
                  Go Back and Review
                </button>
              </div>
            </div>
          ) : (
            /* Add Mode Confirmation Flow (image_5b92cb.png) */
            <div
              className="w-full max-w-[460px] bg-[#141820] border border-slate-800/90 rounded-3xl p-7 sm:p-8 shadow-2xl text-white relative animate-in zoom-in-95 duration-150 text-center flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Blue checkmark circle icon */}
              <div className="w-14 h-14 rounded-2xl bg-[#0c1e3d] border border-blue-500/30 flex items-center justify-center mb-5">
                <div className="w-7 h-7 rounded-full bg-[#1665ec] flex items-center justify-center text-white">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
                Confirm Add New Product
              </h3>

              {/* Subtext */}
              <p className="text-sm text-slate-400 font-normal leading-relaxed mb-7 max-w-sm">
                Are you sure you want to add this new product to the <strong className="text-white font-semibold">ArmourCraft</strong> catalog and publish it live?
              </p>

              {/* Action Buttons */}
              <div className="space-y-3 w-full">
                <button
                  type="button"
                  onClick={handleConfirmAction}
                  className="w-full py-3 px-4 rounded-xl bg-[#1264e8] hover:bg-blue-600 active:scale-[0.99] text-white font-bold text-sm sm:text-base shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Yes, Add Product
                </button>
                <button
                  type="button"
                  onClick={handleDismissConfirmation}
                  className="w-full py-3 px-4 rounded-xl bg-[#181d27] hover:bg-[#1f2633] text-slate-300 hover:text-white font-semibold text-sm sm:text-base border border-slate-700/60 transition-colors cursor-pointer"
                >
                  Keep Editing
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent
}

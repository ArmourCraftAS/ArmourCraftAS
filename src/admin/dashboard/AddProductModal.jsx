import React, { useState, useEffect, useRef } from 'react'
import { CloudUpload, Plus, ChevronDown, X, Sparkles, Image as ImageIcon } from 'lucide-react'

export default function AddProductModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  categories = ['All Products', 'Thigh Guards', 'Inner Pads', 'Leg Guards']
}) {
  const fileInputRef = useRef(null)

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

  // Stance Options matching image_c25b81.png
  const stanceOptions = ['All Stances', 'Right-Handed Only', 'Left-Handed Only']

  // Pre-load data if editing or reset when opening
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setTitle(initialData.title || '')
        setCategory(initialData.category || availableCategories[0] || 'Thigh Guards')
        setPrice(initialData.price !== undefined ? String(initialData.price) : '')
        setDescription(initialData.description || '')
        
        // Normalize stance
        const rawStance = initialData.stance || 'All Stances'
        if (rawStance.includes('Right')) setStance('Right-Handed Only')
        else if (rawStance.includes('Left')) setStance('Left-Handed Only')
        else setStance('All Stances')

        setImage(initialData.image || '')
        setImageName(initialData.imageName || initialData.image?.split('/').pop() || 'image name')
        setImpactRating(initialData.impactRating || '160+ km/h')
        setStock(initialData.stock !== undefined ? initialData.stock : 50)
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

    onSave(payload)
  }

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-[#080d19] border border-slate-800/90 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl text-white relative animate-in zoom-in-95 duration-150 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* 2-Column Responsive Layout matching image_c25b81.png */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* ===================================================================== */}
          {/* LEFT PANEL: PRODUCT DETAILS FORM (image_c25b81.png)                  */}
          {/* ===================================================================== */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Product Details
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal leading-relaxed">
                Modify product identifiers, pricing, stance options and store visibility metrics.
              </p>
            </div>

            {/* Inputs Container */}
            <div className="space-y-5">
              
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
                  className="w-full bg-[#050811] border border-slate-800/90 focus:border-blue-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 outline-none transition-colors"
                />
              </div>

              {/* 2. PRODUCT TYPE & PRICE (USD) (2 Columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Product Type Dropdown */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    PRODUCT TYPE
                  </label>
                  <div className="relative">
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-[#050811] border border-slate-800/90 focus:border-blue-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white outline-none appearance-none cursor-pointer pr-10 transition-colors"
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
                      className="w-full bg-[#050811] border border-slate-800/90 focus:border-blue-500 rounded-xl pl-8 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 outline-none font-mono transition-colors"
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
                  className="w-full bg-[#050811] border border-slate-800/90 focus:border-blue-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-600 outline-none resize-none transition-colors leading-relaxed"
                />
              </div>

              {/* 4. TARGET PLAYER STANCE (Segmented Buttons) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  TARGET PLAYER STANCE
                </label>
                <div className="w-full bg-[#050811] border border-slate-800/90 rounded-xl p-1 grid grid-cols-3 gap-1">
                  {stanceOptions.map((st) => {
                    const isSelected = stance === st
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStance(st)}
                        className={`py-2.5 px-2 sm:px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer text-center truncate ${
                          isSelected
                            ? 'bg-[#15233c] text-white font-bold shadow-sm border border-blue-500/30'
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

            {/* Action Buttons (Bottom Left) */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800/60 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#0c1424] hover:bg-[#131f38] border border-slate-700/60 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-7 py-2.5 rounded-xl bg-[#1d68ed] hover:bg-blue-600 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                {initialData ? 'Save Changes' : 'Add Products'}
              </button>
            </div>

          </div>

          {/* ===================================================================== */}
          {/* RIGHT PANEL: MEDIA PREVIEW & UPLOAD (image_c25b81.png)                */}
          {/* ===================================================================== */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            
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
            <div className="space-y-3">
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setIsDragging(true)
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-square sm:h-72 rounded-2xl bg-[#0c1322] border transition-all duration-200 overflow-hidden flex flex-col justify-between relative cursor-pointer group ${
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
                      {/* Cloud Upload Icon matching image_c25b81.png */}
                      <div className="relative mb-2">
                        <CloudUpload className="w-20 h-20 text-[#8ba2cb]/80 group-hover:text-blue-400 transition-colors stroke-[1.2]" />
                      </div>
                      <span className="text-sm font-semibold text-slate-300">
                        Upload
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Image Name Bar (image_c25b81.png) */}
                <div
                  className="w-full bg-[#060a14]/90 border-t border-slate-800/80 px-4 py-2.5 flex items-center justify-between"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    value={imageName}
                    onChange={(e) => setImageName(e.target.value)}
                    placeholder="image name"
                    className="w-full bg-transparent text-xs text-slate-300 placeholder-slate-600 outline-none truncate"
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

              {/* Quick Image Presets Selector */}
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mr-1">
                  Presets:
                </span>
                {[
                  { name: 'Thigh Guard', path: '/images/product_thigh_guard.png' },
                  { name: 'Leg Guard', path: '/images/product_leg_guard.png' },
                  { name: 'Inner Pad', path: '/images/advantage_carbon.png' },
                  { name: 'Chest Plate', path: '/images/aegis_chest_protector.jpg' },
                  { name: 'Batting Gloves', path: '/images/shadow_batting_gloves.jpg' },
                  { name: 'Aero Helmet', path: '/images/nextgen_batsman_helmet.jpg' }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setImage(preset.path)
                      setImageName(preset.name.toLowerCase().replace(/\s+/g, '_') + '.png')
                    }}
                    className="px-2 py-0.5 rounded bg-[#090e1a] hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-400 hover:text-white cursor-pointer transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Media Action Buttons matching image_c25b81.png */}
            <div className="space-y-3 pt-2">
              {/* + Add image button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-[#0c1424] hover:bg-[#131f38] border border-slate-700/70 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Add image</span>
              </button>

              {/* Remove Product Image red outline button */}
              <button
                type="button"
                onClick={handleRemoveImage}
                className="w-full py-2.5 sm:py-3 rounded-xl bg-transparent hover:bg-rose-500/10 border border-rose-900/60 hover:border-rose-600 text-rose-500 text-xs sm:text-sm font-bold flex items-center justify-center cursor-pointer transition-all active:scale-[0.99]"
              >
                <span>Remove Product Image</span>
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  )
}

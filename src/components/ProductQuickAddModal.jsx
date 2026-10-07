import React, { useState, useEffect } from 'react'
import { X, ShoppingCart, Minus, Plus } from 'lucide-react'

export default function ProductQuickAddModal({
  isOpen,
  onClose,
  product,
  onAddToCart
}) {
  const [stance, setStance] = useState('Right-Handed (RH)')
  const [size, setSize] = useState('Medium')
  const [quantity, setQuantity] = useState(1)

  // Reset defaults whenever modal opens for a product
  useEffect(() => {
    if (isOpen) {
      setStance('Right-Handed (RH)')
      setSize('Medium')
      setQuantity(1)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, product, onClose])

  if (!isOpen || !product) return null

  const handleDecreaseQty = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1)
  }

  const handleIncreaseQty = () => {
    if (quantity < 99) setQuantity((prev) => prev + 1)
  }

  const handleConfirmAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        stance,
        size,
        quantity
      })
    }
    onClose()
  }

  const sizes = ['Small', 'Medium', 'Large', 'Oversize']

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[440px] bg-[#0c1424] border border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-2xl text-white select-none animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Row: Category Badge & Close Icon */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#121c32] border border-slate-700/60 text-slate-400 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase">
            {product.categoryBadge || 'CRICKET IMPACT PROTECTION'}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Summary Row */}
        <div className="flex items-center gap-4 sm:gap-5 mb-6">
          <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-2xl bg-[#060a14] border border-slate-800/80 overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
              loading="eager"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight tracking-tight mb-1 truncate sm:whitespace-normal">
              {product.title}
            </h3>
            <div className="text-lg sm:text-xl font-extrabold text-[#1762f0] tracking-tight">
              {product.price}
            </div>
          </div>
        </div>

        {/* 1. SELECT STANCE */}
        <div className="mb-5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            SELECT STANCE
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setStance('Right-Handed (RH)')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold rounded-xl text-center transition-all cursor-pointer ${
                stance === 'Right-Handed (RH)'
                  ? 'bg-[#0d62f2] text-white shadow-md shadow-blue-600/30 font-bold scale-[1.01]'
                  : 'bg-[#10182b] hover:bg-slate-800/70 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Right-Handed (RH)
            </button>

            <button
              type="button"
              onClick={() => setStance('Left-Handed (LH)')}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold rounded-xl text-center transition-all cursor-pointer ${
                stance === 'Left-Handed (LH)'
                  ? 'bg-[#0d62f2] text-white shadow-md shadow-blue-600/30 font-bold scale-[1.01]'
                  : 'bg-[#10182b] hover:bg-slate-800/70 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              Left-Handed (LH)
            </button>
          </div>
        </div>

        {/* 2. SELECT SIZE */}
        <div className="mb-5">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            SELECT SIZE
          </div>
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((s) => {
              const isSelected = size === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`py-2 sm:py-2.5 px-2 text-xs sm:text-sm font-semibold rounded-xl text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#0d62f2] text-white shadow-md shadow-blue-600/30 font-bold scale-[1.02]'
                      : 'bg-[#10182b] hover:bg-slate-800/70 border border-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        {/* 3. QUANTITY */}
        <div className="mb-6">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
            QUANTITY
          </div>
          <div className="inline-flex items-center bg-[#10182b] border border-slate-800 rounded-xl overflow-hidden">
            <button
              type="button"
              onClick={handleDecreaseQty}
              aria-label="Decrease quantity"
              className="px-3.5 py-2 text-slate-400 hover:text-white hover:bg-slate-800/60 font-bold transition-colors cursor-pointer select-none"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>

            <span className="px-4 py-2 text-white font-bold text-sm min-w-[38px] text-center bg-[#070b14]/70 select-none">
              {quantity}
            </span>

            <button
              type="button"
              onClick={handleIncreaseQty}
              aria-label="Increase quantity"
              className="px-3.5 py-2 text-slate-400 hover:text-white hover:bg-slate-800/60 font-bold transition-colors cursor-pointer select-none"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Main CTA Button: ADD TO CART */}
        <button
          type="button"
          onClick={handleConfirmAddToCart}
          className="w-full py-3.5 sm:py-4 rounded-xl bg-[#0d62f2] hover:bg-[#1259dc] active:bg-[#0b51cc] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 hover:scale-[1.01] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 group"
        >
          <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
          <span>ADD TO CART</span>
        </button>
      </div>
    </div>
  )
}

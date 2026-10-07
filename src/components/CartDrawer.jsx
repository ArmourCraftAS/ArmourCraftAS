import React, { useEffect } from 'react'
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems = [],
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onNavigate
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Calculate subtotal and total count
  const subtotal = cartItems.reduce((acc, item) => {
    const numPrice = parseFloat(String(item.price || '').replace(/[^0-9.]/g, '')) || 0
    return acc + numPrice * (item.quantity || 1)
  }, 0)

  const totalCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)

  const handleShopNowClick = () => {
    onClose()
    if (onNavigate) {
      onNavigate('/shop')
    } else if (typeof window !== 'undefined') {
      window.location.href = '/shop'
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Blur Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0a1120] border-l border-slate-800 shadow-2xl flex flex-col text-white animate-in slide-in-from-right duration-300">
          
          {/* Drawer Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
                YOUR CART ({totalCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6">
            {cartItems.length === 0 ? (
              /* Clean Empty Cart State */
              <div className="h-full min-h-[380px] flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95 duration-200">
                {/* Glowing Cart Icon */}
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shadow-[0_0_40px_rgba(20,98,234,0.22)]">
                    <ShoppingBag className="w-12 h-12 stroke-[1.6]" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#060a14] border-2 border-slate-700 flex items-center justify-center text-xs font-bold text-slate-400">
                    0
                  </span>
                </div>

                {/* Primary Message */}
                <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
                  Your Cart is Empty
                </h3>

                {/* Subtitle */}
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-8">
                  Looks like you haven't added any armours yet. Explore our pro-grade cricket protection gear.
                </p>

                {/* Primary CTA Button */}
                <button
                  type="button"
                  onClick={handleShopNowClick}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1462ea] hover:bg-[#196ff8] active:bg-blue-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              /* Item Cards List */
              <div className="space-y-3.5">
                {cartItems.map((item, index) => {
                  const stanceClean = item.stance
                    ? item.stance.replace(/\s*\([^)]*\)/, '')
                    : 'Right-Handed'

                  return (
                    <div
                      key={`${item.id}-${item.stance}-${item.size}-${index}`}
                      className="p-3.5 rounded-2xl bg-[#0e1628] border border-slate-800/80 flex items-center gap-3.5 relative group hover:border-slate-700/80 transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-xl bg-[#060a14] border border-slate-800 flex items-center justify-center p-1.5 flex-shrink-0">
                        <img
                          src={item.image || '/images/product_thigh_guard.png'}
                          alt={item.title}
                          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.7)]"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h4 className="text-xs sm:text-sm font-bold text-white truncate pr-2">
                            {item.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemoveItem && onRemoveItem(index)}
                            className="text-slate-500 hover:text-rose-400 p-0.5 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-slate-400 space-x-1.5 mb-2">
                          <span className="text-blue-400 font-semibold">{stanceClean}</span>
                          <span>•</span>
                          <span>Size: <strong className="text-slate-200">{item.size || 'Medium'}</strong></span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-black text-[#1da1f2]">
                            {item.price}
                          </span>

                          {/* Stepper */}
                          <div className="inline-flex items-center bg-[#070b14] border border-slate-700/80 rounded-lg overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity && onUpdateQuantity(index, (item.quantity || 1) - 1)
                              }
                              className="px-2 py-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer select-none"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="px-2.5 py-0.5 text-xs font-bold text-white select-none">
                              {item.quantity || 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateQuantity && onUpdateQuantity(index, (item.quantity || 1) + 1)
                              }
                              className="px-2 py-0.5 text-slate-400 hover:text-white transition-colors cursor-pointer select-none"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cartItems.length > 0 && (
            <div className="p-5 sm:p-6 border-t border-slate-800 bg-[#070c17]/95 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm font-semibold tracking-wide">Subtotal</span>
                <span className="text-2xl font-black text-white tracking-tight">${subtotal.toFixed(2)}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onCheckout) onCheckout()
                  else alert(`Proceeding to checkout with $${subtotal.toFixed(2)} total!`)
                }}
                className="w-full py-3.5 sm:py-4 rounded-xl bg-[#1462ea] hover:bg-[#1a6df6] active:bg-blue-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

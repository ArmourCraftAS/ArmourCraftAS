import React, { useEffect } from 'react'
import { CheckCircle2, ShoppingBag, X } from 'lucide-react'

export default function CartToast({ item, onClose, onViewCart }) {
  useEffect(() => {
    if (!item) return
    const timer = setTimeout(() => {
      onClose()
    }, 4500)
    return () => clearTimeout(timer)
  }, [item, onClose])

  if (!item) return null

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full bg-[#0b1325]/95 border border-blue-500/40 rounded-2xl p-4 shadow-2xl backdrop-blur-md text-white animate-in slide-in-from-bottom-5 duration-300">
      <div className="flex items-start gap-3">
        {/* Success Icon */}
        <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-0.5">
          <CheckCircle2 className="w-4 h-4" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              Added to Cart!
            </span>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2.5 my-1.5">
            {item.image && (
              <img
                src={item.image}
                alt={item.title}
                className="w-9 h-9 object-contain rounded-lg bg-black/40 border border-slate-800 p-0.5"
              />
            )}
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
              <p className="text-[11px] text-slate-400 truncate">
                {item.stance?.includes('LH') ? 'LH' : 'RH'} • Size: {item.size} • Qty: {item.quantity}
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onViewCart}
              className="w-full py-1.5 px-3 rounded-lg bg-[#1462ea] hover:bg-[#196ff8] text-white font-bold text-[11px] uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm shadow-blue-500/20 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>View Cart &amp; Checkout</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

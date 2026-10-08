import React from 'react'
import { createPortal } from 'react-dom'
import { AlertTriangle, ShieldAlert, Trash2 } from 'lucide-react'

export default function DeleteProductModal({
  isOpen,
  product,
  onClose,
  onConfirm,
  isDeleting = false
}) {
  if (!isOpen || !product) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] bg-[#0B0F17] border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-white relative animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header: Red warning icon circle with title Delete Product */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 shrink-0">
            <AlertTriangle className="w-5 h-5 text-rose-500 stroke-[2.2]" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Delete Product
          </h3>
        </div>

        {/* Dynamic Product Title Body Text */}
        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-5">
          Are you sure you want to delete the product{' '}
          <span className="font-bold text-white">“{product.title}”</span>?
        </p>

        {/* Warning Banner: Red highlighted alert box with shield icon */}
        <div className="bg-[#221015] border border-rose-900/60 rounded-xl p-4 mb-6 flex items-start gap-3.5">
          <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-[13px] text-rose-300 leading-relaxed font-normal">
            This action is permanent and cannot be undone. The product will be completely removed from your active catalog and storefront.
          </p>
        </div>

        {/* Modal Action Buttons: Cancel & Delete Product */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-5 py-2.5 rounded-xl bg-[#131d31] hover:bg-[#1a2842] border border-slate-700/60 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onConfirm(product)}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#f04438] hover:bg-rose-600 active:scale-[0.98] text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 stroke-[2.2]" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Product'}</span>
          </button>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent
}

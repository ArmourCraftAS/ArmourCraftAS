import React from 'react'
import { createPortal } from 'react-dom'
import { LogOut, AlertTriangle } from 'lucide-react'

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoggingOut = false,
  activePageName = 'SmartThighs Symmetry Landing Page'
}) {
  if (!isOpen) return null

  const modalContent = (
    <div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => !isLoggingOut && onClose()}
    >
      <div
        className="w-full max-w-[420px] bg-[#0c1322] border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative animate-in zoom-in-95 duration-150 select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Icon: Red circular logout arrow icon centered at the top */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-[#271014] border border-red-500/25 flex items-center justify-center shadow-lg shadow-red-950/40">
            <LogOut className="w-6 h-6 text-[#ef4444] stroke-[2.4]" />
          </div>
        </div>

        {/* Modal Title: Bold centered header Confirm Logout */}
        <h3 className="text-xl sm:text-2xl font-bold text-white text-center tracking-tight mb-2">
          Confirm Logout
        </h3>

        {/* Subtext Description */}
        <p className="text-xs sm:text-sm text-slate-400 text-center leading-relaxed mb-6 font-normal px-2">
          Are you sure you want to exit the{' '}
          <span className="font-bold text-white">ARMOURCRAFT</span> CMS Admin Session?
        </p>

        {/* Warning Alert Box: Left-aligned red warning triangle icon & warning copy */}
        <div className="bg-[#0b101c] border border-red-900/40 rounded-2xl p-4 mb-6 flex items-start gap-3 text-left shadow-inner">
          <AlertTriangle className="w-5 h-5 text-[#ef4444] shrink-0 mt-0.5 stroke-[2.2]" />
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Any unsaved live edits on{' '}
            <span className="font-semibold text-white">"{activePageName}"</span> will be lost
            if you logout without publishing.
          </p>
        </div>

        {/* Action Buttons: Cancel (Dark Border) & Yes, Logout (Solid Red) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoggingOut}
            className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-[#111726] hover:bg-[#182238] border border-slate-700/70 text-slate-200 hover:text-white text-sm font-bold transition-colors cursor-pointer disabled:opacity-50 text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoggingOut}
            className="w-full py-3 sm:py-3.5 px-4 rounded-2xl bg-[#ef4444] hover:bg-red-600 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer disabled:opacity-50 text-center flex items-center justify-center gap-2"
          >
            {isLoggingOut ? 'Logging out...' : 'Yes, Logout'}
          </button>
        </div>
      </div>
    </div>
  )

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent
}

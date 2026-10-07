import React, { useState } from 'react'
import { Mail, AlertCircle } from 'lucide-react'
import { useAdminAuth } from '../AdminAuthContext'

export default function AdminForgotPasswordPage({ onNavigate }) {
  const { requestPasswordReset } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid registered admin email address.')
      return
    }

    setIsLoading(true)

    try {
      const res = await requestPasswordReset(email.trim())
      setIsLoading(false)
      if (res.success) {
        if (res.resetUrl) {
          console.log('RESET LINK:', res.resetUrl)
        }
        // Immediately redirect directly back to Login screen with success toast parameter
        onNavigate('/admin/login?reset_sent=true')
      } else {
        setError(res.error || 'Failed to dispatch reset link.')
      }
    } catch (err) {
      setIsLoading(false)
      setError('An error occurred while generating reset link. Please try again.')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#000000] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Main Card Container matching exact screenshot design */}
      <div className="w-full max-w-[420px] bg-[#111827] border border-slate-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Section (Centered) */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
            Forgot Your Password?
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-normal leading-relaxed">
            Enter your registered admin email to receive a password reset link.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
              ADMIN EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@armourcraft.com"
                className="w-full bg-[#182236] border border-slate-700/50 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Action Button: SEND RESET LINK */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm tracking-wider uppercase transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center cursor-pointer"
            >
              <span>{isLoading ? 'DISPATCHING LINK...' : 'SEND RESET LINK'}</span>
            </button>
          </div>

          {/* Center-aligned grey link: ← Back to Login */}
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => onNavigate('/admin/login')}
              className="text-xs sm:text-sm text-slate-400 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1.5 font-normal"
            >
              <span>&larr; Back to Login</span>
            </button>
          </div>
        </form>

      </div>

      {/* Return to Customer Storefront link */}
      <button
        type="button"
        onClick={() => onNavigate('/')}
        className="mt-6 text-xs text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
      >
        &larr; Return to Customer Storefront
      </button>

    </div>
  )
}

import React, { useState } from 'react'
import { User, Mail, Lock, Check, AlertCircle } from 'lucide-react'
import { useAdminAuth, REQUIRED_ADMIN_PASSCODE } from '../AdminAuthContext'

export default function AdminSignupPage({ onNavigate }) {
  const { signup } = useAdminAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!fullName.trim()) {
      setError('Please provide your full name.')
      return
    }

    if (!email.trim()) {
      setError('Please provide your work email.')
      return
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.')
      return
    }

    setIsLoading(true)

    setTimeout(() => {
      // Passes secret admin authorization token in the background
      const res = signup(fullName, email, password, REQUIRED_ADMIN_PASSCODE)
      setIsLoading(false)

      if (res.success) {
        onNavigate('/admin/dashboard')
      } else {
        setError(res.error)
      }
    }, 350)
  }

  return (
    <div className="min-h-screen w-full bg-[#000000] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top small text outside/above card */}
      <div className="w-full max-w-[420px] mb-2 px-1">
        <span className="text-xs font-normal text-slate-400">Sign up</span>
      </div>

      {/* Main Card Container */}
      <div className="w-full max-w-[420px] bg-[#111827] border border-slate-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative">
        
        {/* Header Section (Centered) */}
        <div className="text-center mb-6">
          {/* Metallic 3D Logo Emblem */}
          <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <img
              src="/images/admin_emblem.svg"
              alt="ARMOURCRAFT 3D Logo"
              className="w-full h-full object-contain select-none drop-shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
            />
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Create Admin Account
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-normal">
            Join the ARMOURCRAFT store management team
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Field 1: FULL NAME */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
              FULL NAME
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Subhan Ali"
                className="w-full bg-[#182236] border border-slate-700/50 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Field 2: WORK EMAIL */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
              WORK EMAIL
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@armourcraft.com"
                className="w-full bg-[#182236] border border-slate-700/50 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Field 3: PASSWORD */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
              PASSWORD
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                className="w-full bg-[#182236] border border-slate-700/50 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Field 4: CONFIRM PASSWORD */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
              CONFIRM PASSWORD
            </label>
            <div className="relative">
              <Check className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[2.2]" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-[#182236] border border-slate-700/50 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>
          </div>

          {/* Action Button: CREATE ACCOUNT */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm tracking-wider uppercase transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center cursor-pointer"
            >
              <span>{isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}</span>
            </button>
          </div>
        </form>

        {/* Footer Text (Centered) */}
        <div className="mt-6 text-center text-xs sm:text-sm text-slate-400">
          <span>Already have an account? </span>
          <button
            type="button"
            onClick={() => onNavigate('/admin/login')}
            className="text-[#2563eb] hover:text-blue-400 font-semibold transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </div>

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

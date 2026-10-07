import React, { useState } from 'react'
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff, KeyRound } from 'lucide-react'
import { useAdminAuth } from '../AdminAuthContext'

export default function AdminLoginPage({ onNavigate }) {
  const { login } = useAdminAuth()
  const [email, setEmail] = useState('admin@armourcraft.com')
  const [password, setPassword] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    setTimeout(() => {
      const res = login(email, password)
      setIsLoading(false)
      if (res.success) {
        onNavigate('/admin/dashboard')
      } else {
        setError(res.error)
      }
    }, 400)
  }

  const handleQuickDemoFill = () => {
    setEmail('admin@armourcraft.com')
    setPassword('admin')
    setError('')
  }

  return (
    <div className="min-h-screen w-full bg-[#060a12] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans selection:bg-blue-600 selection:text-white">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-cyan-500/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-[#0b1222]/95 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <img
              src="/images/admin_emblem.svg"
              alt="ARMOURCRAFT 3D Logo"
              className="w-full h-full object-contain select-none drop-shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Admin Portal
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-normal">
            ARMOURCRAFT AS Internal Management Console
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Email field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@armourcraft.com"
                className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-600 transition-colors"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[10px] text-blue-400 hover:text-blue-300 font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                Use Demo Login
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl pl-10 pr-10 py-3 text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-[#1762f0] hover:bg-[#1354d4] active:bg-blue-700 disabled:opacity-50 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 flex items-center justify-center gap-2 cursor-pointer group mt-2"
          >
            <span>{isLoading ? 'AUTHENTICATING...' : 'SIGN IN TO DASHBOARD'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        {/* Quick Demo Info Pill */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-500">Need new credentials?</span>
          <button
            type="button"
            onClick={() => onNavigate('/admin/signup')}
            className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Create Admin Account</span>
          </button>
        </div>

      </div>

      {/* Return to Public Website link */}
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

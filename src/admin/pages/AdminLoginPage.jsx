import React, { useState } from 'react'
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAdminAuth } from '../AdminAuthContext'

export default function AdminLoginPage({ onNavigate }) {
  const { login } = useAdminAuth()
  const [email, setEmail] = useState('admin@armourcraft.com')
  const [password, setPassword] = useState('admin')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [forgotNotice, setForgotNotice] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setForgotNotice('')
    setIsLoading(true)

    setTimeout(() => {
      const res = login(email, password)
      setIsLoading(false)
      if (res.success) {
        onNavigate('/admin/dashboard')
      } else {
        setError(res.error)
      }
    }, 350)
  }

  const handleForgotPassword = () => {
    setForgotNotice(
      'Default Master Admin credentials: admin@armourcraft.com / admin. To register a new administrator account, use the Sign Up link below with passcode ARMOUR2026.'
    )
    setError('')
  }

  return (
    <div className="min-h-screen w-full bg-[#000000] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Top small text outside/above card */}
      <div className="w-full max-w-[420px] mb-2 px-1">
        <span className="text-xs font-normal text-slate-400">Log in</span>
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
            Welcome Back, Admin
          </h1>

          {/* Subtitle */}
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-normal">
            Sign in to manage your live store & products
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Forgot Password Notice */}
        {forgotNotice && (
          <div className="mb-4 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <span className="leading-relaxed">{forgotNotice}</span>
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Field 1: Email Address */}
          <div>
            <label className="text-xs sm:text-[13px] font-medium text-slate-300 mb-1.5 block">
              Email Address
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

          {/* Field 2: Password */}
          <div>
            <label className="text-xs sm:text-[13px] font-medium text-slate-300 mb-1.5 block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#182236] border border-slate-700/50 text-white placeholder-slate-500 text-sm rounded-xl pl-10 pr-10 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
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

          {/* Controls Row: Remember Me & Forgot Password */}
          <div className="flex items-center justify-between pt-1">
            {/* Remember Me Toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none group">
              <button
                type="button"
                role="switch"
                aria-checked={rememberMe}
                onClick={() => setRememberMe(!rememberMe)}
                className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-in-out cursor-pointer relative ${
                  rememberMe ? 'bg-blue-600' : 'bg-[#182236] border border-slate-700'
                }`}
              >
                <span
                  className={`block w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 ease-in-out shadow-sm ${
                    rememberMe ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
              <span className="text-xs sm:text-sm text-slate-400 group-hover:text-slate-300 transition-colors font-normal">
                Remember Me
              </span>
            </label>

            {/* Forgot Password Link */}
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-xs sm:text-sm text-[#2563eb] hover:text-blue-400 font-medium transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Action Button: SIGN IN TO DASHBOARD */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm tracking-wider uppercase transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center cursor-pointer"
            >
              <span>{isLoading ? 'SIGNING IN...' : 'SIGN IN TO DASHBOARD'}</span>
            </button>
          </div>
        </form>

        {/* Divider: OR */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-[1px] bg-slate-800" />
          <span className="px-3 text-[11px] font-bold text-slate-500 tracking-wider">
            OR
          </span>
          <div className="flex-1 h-[1px] bg-slate-800" />
        </div>

        {/* Footer Text (Centered) */}
        <div className="text-center text-xs sm:text-sm text-slate-400">
          <span>Don't have an admin account? </span>
          <button
            type="button"
            onClick={() => onNavigate('/admin/signup')}
            className="text-[#2563eb] hover:text-blue-400 font-semibold transition-colors cursor-pointer"
          >
            Sign Up
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

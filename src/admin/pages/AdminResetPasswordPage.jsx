import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, AlertCircle, CheckCircle2, Settings } from 'lucide-react'
import { useAdminAuth } from '../AdminAuthContext'
import { supabase } from '../../../lib/supabaseClient'

export default function AdminResetPasswordPage({ onNavigate }) {
  const { updateAdminPassword } = useAdminAuth()

  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionEmail, setSessionEmail] = useState('')

  // Handle Supabase recovery email link redirect (access_token in hash or code in query)
  useEffect(() => {
    // 1. Listen for Supabase PASSWORD_RECOVERY event
    let authListener = null
    try {
      if (supabase?.auth?.onAuthStateChange) {
        const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'PASSWORD_RECOVERY' || session?.user) {
            if (session?.user?.email) setSessionEmail(session.user.email)
          }
        })
        authListener = data
      }
    } catch (e) {
      console.warn('Supabase auth state listener notice:', e)
    }

    // 2. Parse hash fragment (#access_token=...&refresh_token=...)
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const tokenFromQuery = searchParams.get('token')
      const codeFromQuery = searchParams.get('code')

      if (tokenFromQuery) {
        setToken(tokenFromQuery)
      }

      if (codeFromQuery && supabase?.auth?.exchangeCodeForSession) {
        supabase.auth.exchangeCodeForSession(codeFromQuery)
          .then(({ data, error }) => {
            if (!error && data?.session?.user?.email) {
              setSessionEmail(data.session.user.email)
            }
          })
          .catch((err) => console.warn('Supabase code exchange error:', err))
      }

      if (window.location.hash && window.location.hash.includes('access_token')) {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')

        if (accessToken) setToken(accessToken)

        if (accessToken && refreshToken && supabase?.auth?.setSession) {
          supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
            .then(({ data, error }) => {
              if (!error && data?.session?.user?.email) {
                setSessionEmail(data.session.user.email)
              }
            })
            .catch((err) => console.warn('Supabase session set error:', err))
        }
      }
    }

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // 1. Minimum 8 characters
    if (!newPassword || newPassword.length < 8) {
      setError('Password must be at least 8 characters long.')
      return
    }

    // 2. Mix of letters and numbers
    const hasLetter = /[a-zA-Z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)
    if (!hasLetter || !hasNumber) {
      setError('Must be at least 8 characters with a mix of letters & numbers.')
      return
    }

    // 3. Confirm password match
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-type the new password.')
      return
    }

    setIsLoading(true)

    try {
      // Step A: Call Supabase Auth updateUser to permanently update password in database
      let supabaseUpdated = false
      try {
        if (supabase?.auth?.updateUser) {
          const { data: supaData, error: supaError } = await supabase.auth.updateUser({
            password: newPassword
          })
          if (supaError) {
            console.warn('Supabase updateUser notice:', supaError.message)
          } else if (supaData?.user) {
            supabaseUpdated = true
          }
        }
      } catch (supaErr) {
        console.warn('Supabase updateUser exception:', supaErr)
      }

      // Step B: Update local admin credentials & clear reset token
      const res = await updateAdminPassword({
        token,
        newPassword,
        confirmPassword
      })

      if (res.success || supabaseUpdated) {
        setSuccess(true)
        setIsLoading(false)
        // Show confirmation message and auto-redirect back to /admin/login with success toast
        setTimeout(() => {
          onNavigate('/admin/login?reset=success')
        }, 1200)
      } else {
        setIsLoading(false)
        setError(res.error || 'Failed to update password. Please try again.')
      }
    } catch (err) {
      setIsLoading(false)
      setError('An error occurred during password update. Please try again.')
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#000000] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Main Card matching screenshot image_024361.png */}
      <div className="w-full max-w-[420px] bg-[#111827] border border-slate-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Section */}
        <div className="text-center mb-6">
          {/* Top ARMOURCRAFT metallic 3D logo emblem */}
          <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
            <img
              src="/images/admin_emblem.svg"
              alt="ARMOURCRAFT 3D Logo"
              className="w-full h-full object-contain select-none drop-shadow-[0_4px_16px_rgba(37,99,235,0.35)]"
            />
          </div>

          {/* Main Title: Set New Password */}
          <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
            Set New Password
          </h1>

          {/* Subtitle: Must be at least 8 characters with a mix of letters & numbers. */}
          <p className="text-slate-400 text-xs sm:text-sm font-normal leading-relaxed max-w-[280px] mx-auto">
            Must be at least 8 characters with a mix of letters & numbers.
          </p>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
            <span className="leading-relaxed font-medium">
              Password updated successfully! Redirecting to login...
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Reset Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Field 1: New Password */}
          <div>
            <label className="text-xs sm:text-[13px] font-medium text-slate-300 mb-1.5 block">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••"
                className={`w-full bg-[#182236] border border-slate-700/50 text-white placeholder-slate-500 text-sm rounded-xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                  !showNewPassword && newPassword ? 'tracking-[0.15em]' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                aria-label="Toggle new password visibility"
              >
                {showNewPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Field 2: Confirm New Password */}
          <div>
            <label className="text-xs sm:text-[13px] font-medium text-slate-300 mb-1.5 block">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                className={`w-full bg-[#182236] border border-slate-700/50 text-white placeholder-slate-500 text-sm rounded-xl pl-4 pr-10 py-3.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors ${
                  !showConfirmPassword && confirmPassword ? 'tracking-[0.15em]' : ''
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Button: Full-width royal blue button UPDATE PASSWORD */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full py-3.5 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] active:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm tracking-wider uppercase transition-colors shadow-lg shadow-blue-600/30 flex items-center justify-center cursor-pointer"
            >
              <span>{isLoading ? 'UPDATING PASSWORD...' : 'UPDATE PASSWORD'}</span>
            </button>
          </div>

          {/* Footer Subtitle & Brand Tag matching screenshot */}
          <div className="pt-3 text-center space-y-5">
            <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
              YOU WILL BE REDIRECTED TO LOGIN AFTER UPDATING.
            </p>

            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest pt-1">
              <Settings className="w-3.5 h-3.5 text-slate-500 stroke-[2]" />
              <span>ARMOURCRAFT ADMIN</span>
            </div>
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

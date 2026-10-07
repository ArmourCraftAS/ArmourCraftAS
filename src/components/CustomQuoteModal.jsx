import React, { useState, useEffect, useRef } from 'react'
import { X, UploadCloud, ArrowRight, CheckCircle2, FileText, Trash2 } from 'lucide-react'
import CountryPhoneInput from './CountryPhoneInput'

export default function CustomQuoteModal({ isOpen, onClose }) {
  const [countryCode, setCountryCode] = useState('+92')
  const [formData, setFormData] = useState({
    clubName: '',
    quantity: '',
    jerseyColor: '',
    phone: '',
    email: ''
  })
  const [logoFile, setLogoFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)
  const fileInputRef = useRef(null)

  // Close on Escape key and handle body scroll lock
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.size <= 10 * 1024 * 1024) {
        setLogoFile(file)
      } else {
        alert('File size exceeds 10MB limit.')
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.size <= 10 * 1024 * 1024) {
        setLogoFile(file)
      } else {
        alert('File size exceeds 10MB limit.')
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const fullPhone = `${countryCode} ${formData.phone.trim()}`

    // Simulate API quote submission with combined phone number
    setTimeout(() => {
      setSubmittedData({
        ...formData,
        fullPhone,
        countryCode
      })
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 700)
  }

  const handleReset = () => {
    setCountryCode('+92')
    setFormData({
      clubName: '',
      quantity: '',
      jerseyColor: '',
      phone: '',
      email: ''
    })
    setSubmittedData(null)
    setLogoFile(null)
    setIsSuccess(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-[#0c1527] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[92vh] overflow-y-auto text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-10 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              Custom Quote Request Sent!
            </h3>

            <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
              Thank you for submitting details for{' '}
              <span className="text-white font-bold">{formData.clubName || 'your squad'}</span>. Our Sialkot bespoke division will review your requirements and reach out via WhatsApp at{' '}
              <span className="text-emerald-400 font-semibold">{submittedData?.fullPhone || `${countryCode} ${formData.phone}`}</span> or email{' '}
              <span className="text-blue-400 font-semibold">{formData.email}</span> within 24 hours.
            </p>

            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Submit Another Request
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#1462ea] hover:bg-[#1a6df6] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-600/30 cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Modal Header */}
            <div className="pr-8 mb-6">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight leading-snug mb-2">
                CUSTOM TEAM GEAR &amp; JERSEY MATCHING
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-normal">
                Get custom names, squad numbers, and club logos printed directly onto your products. Enter your team details below.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
              
              {/* Row 1: Club Name & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 block">
                    CLUB NAME
                  </label>
                  <input
                    type="text"
                    required
                    name="clubName"
                    value={formData.clubName}
                    onChange={handleChange}
                    placeholder="e.g. Royal Strikers CC"
                    className="w-full bg-[#131b2e] border border-slate-800/90 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 block">
                    QUANTITY
                  </label>
                  <input
                    type="text"
                    required
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="Enter number of sets (e.g. 15)"
                    className="w-full bg-[#131b2e] border border-slate-800/90 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-500 transition-colors"
                  />
                </div>
              </div>

              {/* Row 2: Primary Jersey Color & WhatsApp / Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 block">
                    PRIMARY JERSEY COLOR
                  </label>
                  <input
                    type="text"
                    required
                    name="jerseyColor"
                    value={formData.jerseyColor}
                    onChange={handleChange}
                    placeholder="e.g. Electric Blue & Gold"
                    className="w-full bg-[#131b2e] border border-slate-800/90 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 block">
                    WHATSAPP / PHONE
                  </label>
                  <CountryPhoneInput
                    id="phone"
                    name="phone"
                    countryCode={countryCode}
                    onCountryCodeChange={setCountryCode}
                    phoneNumber={formData.phone}
                    onPhoneNumberChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                    placeholder="300 1234567"
                    required
                    containerBgClass="bg-[#131b2e]"
                  />
                </div>
              </div>

              {/* Row 3: Contact Email */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 block">
                  CONTACT EMAIL
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@club.com"
                  className="w-full bg-[#131b2e] border border-slate-800/90 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-500 transition-colors"
                />
              </div>

              {/* Row 4: Upload Team Logo (Drag & Drop) */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 block">
                  UPLOAD TEAM LOGO
                </label>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".png,.svg,.jpg,.jpeg,.pdf"
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className={`w-full border-2 border-dashed rounded-xl p-5 sm:p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-slate-800 bg-[#070b14]/70 hover:border-slate-700 hover:bg-[#070b14]'
                  }`}
                >
                  {logoFile ? (
                    <div className="flex items-center gap-3">
                      <FileText className="w-8 h-8 text-blue-400" />
                      <div className="text-left">
                        <p className="text-xs font-bold text-white max-w-[200px] sm:max-w-xs truncate">
                          {logoFile.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {(logoFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          setLogoFile(null)
                        }}
                        className="p-1.5 hover:bg-slate-800 rounded-lg text-rose-400 hover:text-rose-300 transition-colors"
                        title="Remove file"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Cloud Upload Icon Inside Circular Blue Badge */}
                      <div className="w-11 h-11 rounded-full bg-blue-600/20 text-[#1762f0] flex items-center justify-center mb-2.5 shadow-sm shadow-blue-500/20">
                        <UploadCloud className="w-5 h-5 stroke-[2.2]" />
                      </div>

                      <p className="text-xs text-slate-300 font-medium mb-1">
                        Drag &amp; drop team vector logo (PNG/SVG) or{' '}
                        <span className="text-[#1762f0] hover:underline font-bold">
                          browse
                        </span>
                      </p>

                      <p className="text-[11px] text-slate-500">
                        Maximum file size: 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 sm:py-4 rounded-xl bg-[#1462ea] hover:bg-[#1a6df6] active:bg-blue-700 disabled:opacity-75 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 cursor-pointer flex items-center justify-center gap-2 group"
                >
                  <span>{isSubmitting ? 'SUBMITTING...' : 'SUBMIT FOR CUSTOM TEAM QUOTE'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  )
}

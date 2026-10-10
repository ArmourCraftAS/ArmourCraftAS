import React, { useState, useEffect } from 'react'
import { Send, Headphones, Users, CheckCircle2, ChevronDown } from 'lucide-react'
import CountryPhoneInput from '../components/CountryPhoneInput'
import { getStoredFaqs } from '../data/faqsData'
import { supabase } from '../../lib/supabaseClient'
import { useCmsContent } from '../admin/cmsStore'

export default function ContactPage() {
  const heading = useCmsContent('contact.heading', "WE'RE HERE TO KEEP YOU PROTECTED.")
  const subheading = useCmsContent('contact.subheading', 'Have a question about sizing, order tracking, or custom team printing? Reach out to us—we usually reply within a few hours.')
  const [openFaq, setOpenFaq] = useState(0)
  const [faqList, setFaqList] = useState(() => getStoredFaqs())
  const [countryCode, setCountryCode] = useState('+92')

  useEffect(() => {
    // 1. Sync on custom event
    const handleUpdate = (e) => {
      if (Array.isArray(e.detail) && e.detail.length > 0) {
        setFaqList(e.detail)
      }
    }
    window.addEventListener('armourcraft:faqs-updated', handleUpdate)

    // 2. Fetch from Supabase
    async function fetchFromSupabase() {
      try {
        if (supabase && typeof supabase.from === 'function') {
          const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .order('id', { ascending: true })

          if (!error && Array.isArray(data) && data.length > 0) {
            setFaqList(data)
          }
        }
      } catch (err) {
        console.info('ContactPage FAQ fetch notice:', err?.message || err)
      }
    }
    fetchFromSupabase()

    return () => window.removeEventListener('armourcraft:faqs-updated', handleUpdate)
  }, [])
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'General Question',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const fullPhone = formData.phone?.trim()
      ? `${countryCode} ${formData.phone.trim()}`
      : ''

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 600)
  }

  const handleReset = () => {
    setCountryCode('+92')
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      inquiryType: 'General Question',
      message: ''
    })
    setIsSubmitted(false)
  }

  return (
    <div className="w-full bg-[#060a12] text-white min-h-[calc(100vh-80px)] py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-12 sm:space-y-16">
        
        {/* ========================================================================= */}
        {/* 1. HEADER SECTION (CENTERED TEXT)                                         */}
        {/* ========================================================================= */}
        <div className="text-center max-w-3xl mx-auto">
          <h1
            data-cms-path="contact.heading"
            data-cms-label="Contact Page Main Heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-[1.08] mb-4 sm:mb-6"
          >
            {heading}
          </h1>
          <p
            data-cms-path="contact.subheading"
            data-cms-label="Contact Page Subtitle"
            className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {subheading}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 2. MAIN 2-COLUMN LAYOUT                                                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* Left Side: Interactive Contact Form Card */}
          <div className="lg:col-span-7 bg-[#0b1324] border border-slate-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-md relative overflow-hidden">
            {/* Subtle atmospheric ambient glow */}
            <div className="absolute top-0 right-1/4 w-72 h-72 bg-blue-600/5 blur-3xl pointer-events-none rounded-full" />

            {isSubmitted ? (
              <div className="py-12 sm:py-16 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Message Sent Successfully!
                </h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-semibold">{formData.fullName || 'Batsman'}</span>. Our Sialkot gear specialists have received your inquiry and will respond to <span className="text-blue-400">{formData.email}</span> shortly.
                </p>
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                
                {/* Row 1: Full Name & Email Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2 block"
                    >
                      FULL NAME
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Virat Kohli"
                      className="w-full bg-[#070b14] border border-slate-800/90 text-white rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 focus:outline-none placeholder:text-slate-600 transition-all"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2 block"
                    >
                      EMAIL ADDRESS
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="vk@eleven.com"
                      className="w-full bg-[#070b14] border border-slate-800/90 text-white rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 focus:outline-none placeholder:text-slate-600 transition-all"
                    />
                  </div>
                </div>

                {/* Row 2: Phone Number (Optional) & Inquiry Type */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2 block"
                    >
                      PHONE NUMBER (OPTIONAL)
                    </label>
                    <CountryPhoneInput
                      id="phone"
                      name="phone"
                      countryCode={countryCode}
                      onCountryCodeChange={setCountryCode}
                      phoneNumber={formData.phone}
                      onPhoneNumberChange={(val) => setFormData((prev) => ({ ...prev, phone: val }))}
                      placeholder="300 1234567"
                      containerBgClass="bg-[#070b14]"
                      inputPyClass="py-3"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="inquiryType"
                      className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2 block"
                    >
                      INQUIRY TYPE
                    </label>
                    <div className="relative">
                      <select
                        id="inquiryType"
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full bg-[#070b14] border border-slate-800/90 text-white rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 focus:outline-none transition-all cursor-pointer appearance-none"
                      >
                        <option value="General Question">General Question</option>
                        <option value="Sizing & Fit Advice">Sizing & Fit Advice</option>
                        <option value="Order Tracking">Order Tracking</option>
                        <option value="Custom Squad & Bulk Orders">Custom Squad & Bulk Orders</option>
                        <option value="Warranty & Product Support">Warranty & Product Support</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 3: Your Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="text-[10px] sm:text-[11px] font-bold text-slate-400 tracking-wider uppercase mb-2 block"
                  >
                    YOUR MESSAGE
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="How can we help you today?"
                    className="w-full bg-[#070b14] border border-slate-800/90 text-white rounded-xl px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 focus:outline-none placeholder:text-slate-600 transition-all resize-y"
                  />
                </div>

                {/* Submit Button: Full-width Electric Blue */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-[#1462ea] hover:bg-[#1a6df6] active:bg-blue-700 disabled:opacity-70 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 cursor-pointer flex items-center justify-center gap-2 group"
                  >
                    <span>{isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}</span>
                    <Send className="w-4 h-4 shrink-0 stroke-[2.5] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

              </form>
            )}
          </div>

          {/* Right Side: Support Direct Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Card 1 - Direct WhatsApp Support */}
            <div className="bg-[#0b1324] border border-slate-800/80 hover:border-slate-700/90 rounded-2xl p-6 sm:p-7 shadow-xl transition-all">
              {/* Icon badge at top left */}
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-sm shadow-blue-500/10">
                <Headphones className="w-5 h-5 stroke-[2.2]" />
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-bold text-white mb-1.5 tracking-tight">
                Direct WhatsApp Support
              </h2>

              {/* Subtext */}
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 font-normal">
                For all individual orders, sizing queries, and delivery tracking updates.
              </p>

              {/* Contact Link */}
              <a
                href="https://wa.me/923001234567?text=Hi%20ArmourCraft%2C%20I%20have%20an%20inquiry%20regarding%20my%20order%20or%20sizing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1d68ed] hover:text-blue-400 transition-colors group cursor-pointer"
              >
                <span className="text-base group-hover:scale-110 transition-transform">💬</span>
                <span className="underline-offset-4 group-hover:underline">+92 300 1234567</span>
              </a>
            </div>

            {/* Card 2 - Custom Squad & Club Orders */}
            <div className="bg-[#0b1324] border border-slate-800/80 hover:border-slate-700/90 rounded-2xl p-6 sm:p-7 shadow-xl transition-all">
              {/* Icon badge at top left */}
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 shadow-sm shadow-blue-500/10">
                <Users className="w-5 h-5 stroke-[2.2]" />
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-bold text-white mb-1.5 tracking-tight">
                Custom Squad & Club Orders
              </h2>

              {/* Subtext */}
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-4 font-normal">
                Bulk orders for cricket academies, professional clubs, and personalized prints.
              </p>

              {/* Contact Link */}
              <a
                href="mailto:orders@armourcraft.com?subject=Custom%20Squad%20Inquiry"
                className="inline-flex items-center gap-2 text-sm font-bold text-[#1d68ed] hover:text-blue-400 transition-colors group cursor-pointer"
              >
                <span className="text-base group-hover:scale-110 transition-transform">✉</span>
                <span className="underline-offset-4 group-hover:underline">orders@armourcraft.com</span>
              </a>
            </div>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. INTERACTIVE FREQUENTLY ASKED QUESTIONS (FAQ) SECTION                   */}
        {/* ========================================================================= */}
        <section aria-label="Frequently Asked Questions" className="max-w-4xl mx-auto pt-6 sm:pt-10">
          
          {/* Centered Heading */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white uppercase tracking-tight">
              FREQUENTLY ASKED{' '}
              <span className="text-[#1762f0] italic drop-shadow-[0_0_20px_rgba(23,98,240,0.5)]">
                QUESTIONS
              </span>
            </h2>
          </div>

          {/* Accordion Cards List */}
          <div className="space-y-4">
            {faqList.map((item, idx) => {
              const isOpen = openFaq === idx
              return (
                <div
                  key={idx}
                  className="bg-[#0b1324] border border-slate-800/80 hover:border-slate-700/90 rounded-2xl p-5 sm:p-6 shadow-xl transition-all"
                >
                  {/* Accordion Header / Question */}
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer focus:outline-none group select-none"
                  >
                    <span className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-[#1762f0] shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Accordion Body / Answer */}
                  {isOpen && (
                    <div className="mt-4 pt-4 border-t border-slate-800/80 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal animate-in fade-in duration-200">
                      {item.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

        </section>

      </div>
    </div>
  )
}

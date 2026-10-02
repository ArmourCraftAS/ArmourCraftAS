import React, { useState } from 'react'
import { ArrowRight, Sparkles, X, Send, CheckCircle2 } from 'lucide-react'

export default function CustomGearBanner() {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [quoteForm, setQuoteForm] = useState({
    teamName: '',
    email: '',
    squadSize: '15-20 players',
    notes: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormSubmitted(true)
    setTimeout(() => {
      setFormSubmitted(false)
      setIsQuoteModalOpen(false)
      setQuoteForm({ teamName: '', email: '', squadSize: '15-20 players', notes: '' })
    }, 2000)
  }

  return (
    <section className="relative w-full bg-black border-y border-slate-900 overflow-hidden text-white">
      
      {/* Background Container: Split Layout with Right-Side Pads Image */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="relative w-full h-full flex justify-end">
          
          {/* Right Image */}
          <div className="w-full lg:w-[58%] h-full relative">
            <img
              src="/images/custom_pads.png"
              alt="Custom Team Cricket Guards with Initials and Numbers"
              className="w-full h-full object-cover object-center lg:object-right select-none opacity-85 lg:opacity-100"
            />
            {/* Seamless Left Gradient to Black */}
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 lg:via-black/50 to-transparent" />
            {/* Top & Bottom Vignettes */}
            <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-black to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent" />
          </div>

        </div>
      </div>

      {/* Main Container Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="max-w-xl lg:max-w-2xl">
          
          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[46px] font-black uppercase tracking-tight leading-[1.1] mb-5">
            CUSTOM TEAM GEAR &amp; <br />
            <span className="text-[#1d68ed] drop-shadow-[0_0_25px_rgba(29,104,237,0.45)]">
              JERSEY MATCHING
            </span>
          </h2>

          {/* Description */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mb-8 text-slate-300/90 font-normal">
            Elevate your team's look. Professional-grade printing of names, numbers, and club logos directly onto your guards. Matches any team colors.
          </p>

          {/* Primary Call to Action Button */}
          <div>
            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="inline-flex items-center justify-center bg-white hover:bg-slate-200 text-black font-black text-xs sm:text-sm uppercase tracking-widest px-8 py-4 rounded-none sm:rounded-md transition-all duration-200 shadow-xl shadow-white/10 hover:shadow-white/20 active:scale-[0.98] group cursor-pointer"
            >
              <span>GET CUSTOM TEAM QUOTE</span>
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1 text-black" />
            </button>
          </div>

        </div>
      </div>

      {/* Interactive Custom Team Quote Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0a1120] border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8">
            
            <button
              onClick={() => setIsQuoteModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {formSubmitted ? (
              <div className="py-12 text-center flex flex-col items-center">
                <CheckCircle2 className="w-16 h-16 text-emerald-400 mb-4 animate-bounce" />
                <h3 className="text-2xl font-bold text-white mb-2">Quote Request Received!</h3>
                <p className="text-slate-400 text-sm">
                  Our custom gear specialist will contact you with 3D mockups within 24 hours.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Custom Squad Customization</span>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-2">
                  Get Your Team Quote
                </h3>
                
                <p className="text-slate-400 text-xs leading-relaxed mb-6">
                  Provide your team info below. We offer tiered bulk pricing and Pantone color matching for schools, clubs, and franchises.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Team / Club Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Marylebone Cricket Club"
                      value={quoteForm.teamName}
                      onChange={(e) => setQuoteForm({ ...quoteForm, teamName: e.target.value })}
                      className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="captain@yourteam.com"
                      value={quoteForm.email}
                      onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })}
                      className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Squad Size / Units Needed
                    </label>
                    <select
                      value={quoteForm.squadSize}
                      onChange={(e) => setQuoteForm({ ...quoteForm, squadSize: e.target.value })}
                      className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="5-10 players">5 - 10 players (Starter squad)</option>
                      <option value="15-20 players">15 - 20 players (Full XI + reserves)</option>
                      <option value="25+ players">25+ players (Academy / Club fleet)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">
                      Color Scheme / Requirements
                    </label>
                    <textarea
                      rows="2"
                      placeholder="e.g. Navy blue with gold numbers & initials"
                      value={quoteForm.notes}
                      onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                      className="w-full bg-[#060a14] border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2"
                  >
                    <span>Submit Request</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  )
}

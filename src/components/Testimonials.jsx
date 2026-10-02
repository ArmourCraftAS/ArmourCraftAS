import React from 'react'
import { Star, Check } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      id: 'david',
      name: 'David Warner Jr.',
      avatar: '/images/avatar_david.png',
      quote:
        'Honestly, the lightest thigh guards I\'ve ever worn. I forgot I had them on during a 3-hour net session. The protection is top-notch.'
    },
    {
      id: 'aidan',
      name: 'Aidan Miller',
      avatar: '/images/avatar_aidan.png',
      quote:
        'Got hit by a nasty 145km yorker on the thigh. Expected a massive bruise, but the guard absorbed everything. Saved my season!'
    },
    {
      id: 'steve',
      name: 'Steve Thompson',
      avatar: '/images/avatar_steve.png',
      quote:
        'The custom printing for my club was perfect. The logos are crisp and haven\'t peeled after 10 matches. Absolute game changer.'
    }
  ]

  return (
    <section className="relative w-full bg-[#060a12] py-20 lg:py-24 px-4 sm:px-6 lg:px-8 text-white border-t border-slate-900/60 overflow-hidden">
      {/* Subtle backdrop glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">
            TRUSTED BY 10,000+ BATSMEN
          </h2>

          {/* 5-Star Rating Graphic */}
          <div className="inline-flex items-center justify-center gap-2 text-amber-400">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-black tracking-wider text-slate-200 uppercase ml-1">
              4.9/5 AVERAGE RATING
            </span>
          </div>
        </div>

        {/* Testimonial Cards Grid (3 Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-[#0b1222] border border-slate-800/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-blue-500/40 hover:shadow-2xl transition-all duration-300 hover:translate-y-[-2px] group"
            >
              {/* Header with Avatar, Name, Verified Badge */}
              <div className="flex items-center gap-3.5 mb-5">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500/40 bg-slate-800 flex-shrink-0 shadow-md shadow-blue-500/10">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm sm:text-base tracking-wide leading-tight group-hover:text-blue-300 transition-colors">
                    {item.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-[#1762f0] text-white">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-[#1762f0] tracking-wider uppercase">
                      VERIFIED BUYER
                    </span>
                  </div>
                </div>
              </div>

              {/* Italicized Quote */}
              <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed font-light">
                &ldquo;{item.quote}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

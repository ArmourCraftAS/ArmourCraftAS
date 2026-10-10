import React from 'react'
import { FadeIn } from './StorefrontMotion'

function WhatsAppIcon({ className = 'w-5 h-5 fill-current' }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  )
}

export default function WhatsAppCalloutBanner({ className = '' }) {
  return (
    <FadeIn direction="up">
      <section
        aria-label="WhatsApp Sizing Support"
        className={`relative w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl bg-[#0c1427]/90 border border-blue-900/30 p-8 sm:p-12 lg:p-16 shadow-2xl backdrop-blur-md overflow-hidden text-center card-elevate ${className}`}
      >
        {/* Atmospheric Radial Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-blue-600/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Green Circular Badge with WhatsApp Icon */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#0d2a1f] border border-emerald-500/40 flex items-center justify-center text-[#25D366] mb-6 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
            <WhatsAppIcon className="w-6 h-6 fill-current" />
          </div>

          {/* Heading */}
          <h3 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-white uppercase tracking-tight leading-snug mb-3 max-w-2xl">
            NEED HELP CHOOSING THE <br className="hidden sm:inline" />
            RIGHT SIZES FOR YOUR TEAM?
          </h3>

          {/* Subtext */}
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed mb-8 font-normal">
            Talk directly with our Sialkot gear specialists on WhatsApp for custom bulk team orders and technical sizing assistance.
          </p>

          {/* Blue Action Button */}
          <a
            href="https://wa.me/923001234567?text=Hi%20ArmourCraft%2C%20I%20need%20help%20choosing%20the%20right%20sizes%20for%20our%20team"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#1462ea] hover:bg-[#1a6df6] active:bg-blue-700 text-white font-bold text-xs sm:text-sm tracking-wider uppercase btn-elevate cursor-pointer group shadow-lg shadow-blue-600/30"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white shrink-0 group-hover:scale-110 transition-transform" />
            <span>CHAT ON WHATSAPP NOW</span>
          </a>
        </div>
      </section>
    </FadeIn>
  )
}

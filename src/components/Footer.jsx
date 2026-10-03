import React from 'react'
import { Mail, MapPin, MessageCircle } from 'lucide-react'

export default function Footer({ onNavigate }) {
  const quickNavLinks = [
    { name: 'Shop Thigh Guards', href: '/shop', path: '/shop' },
    { name: 'Custom Team Orders', href: '/#custom-team', hash: '#custom-team' },
    { name: 'What We Are', href: '/#about', hash: '#about' },
    { name: 'Cricket Blog', href: '/#blog', hash: '#blog' }
  ]

  const handleLinkClick = (e, link) => {
    if (onNavigate) {
      if (link.path) {
        e.preventDefault()
        onNavigate(link.path)
      } else if (link.hash) {
        e.preventDefault()
        onNavigate('/')
        setTimeout(() => {
          const el = document.querySelector(link.hash)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }
  }

  return (
    <footer className="w-full bg-[#04070e] text-slate-400 border-t border-slate-900/90 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 mb-14">
          
          {/* Column 1: Brand Info & Socials */}
          <div className="flex flex-col">
            {/* Brand Logo */}
            <a
              href="/"
              onClick={(e) => {
                if (onNavigate) {
                  e.preventDefault()
                  onNavigate('/')
                }
              }}
              className="inline-block mb-5 cursor-pointer"
            >
              <img
                src="/images/logo.png"
                alt="ARMOURCRAFT AS"
                className="h-10 sm:h-11 w-auto object-contain select-none drop-shadow-[0_2px_12px_rgba(23,98,240,0.25)]"
              />
            </a>

            {/* Brand Description */}
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6 max-w-sm">
              Sialkot-crafted high-performance cricket thigh guards. Built with high-density EVA foam and non-slip straps to withstand 140+ km/h leather ball impacts.
            </p>

            {/* Social Media Circular Buttons */}
            <div className="flex items-center gap-3">
              {/* WhatsApp */}
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-[#0a1222] border border-slate-800/80 flex items-center justify-center text-[#25D366] hover:border-emerald-500/50 hover:bg-[#0f1d36] hover:scale-110 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-[#0a1222] border border-slate-800/80 flex items-center justify-center text-[#ec4899] hover:border-pink-500/50 hover:bg-[#0f1d36] hover:scale-110 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-[#0a1222] border border-slate-800/80 flex items-center justify-center text-[#1877F2] hover:border-blue-500/50 hover:bg-[#0f1d36] hover:scale-110 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.82 0-1.666.113-1.928.328-.396.326-.49.919-.49 2.006v1.656h4.551l-.66 3.667h-3.891v7.98h-4.666z"/>
                </svg>
              </a>

              {/* Snapchat */}
              <a
                href="https://snapchat.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Snapchat"
                className="w-10 h-10 rounded-full bg-[#0a1222] border border-slate-800/80 flex items-center justify-center text-[#eab308] hover:border-yellow-500/50 hover:bg-[#0f1d36] hover:scale-110 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.003 2.002c-4.484 0-6.938 3.197-6.938 6.577 0 1.25.438 2.502.934 3.326.248.414.288.665.176 1.056-.129.447-.565.986-1.121 1.29-.442.24-.627.502-.627.771 0 .506.666.862 1.637.892.428.013.791-.122 1.229-.029.356.076.671.391.972.937.608 1.103 1.854 1.547 3.717 1.547 1.863 0 3.109-.444 3.717-1.547.301-.546.616-.861.972-.937.438-.093.801.042 1.229.029.971-.03 1.637-.386 1.637-.892 0-.269-.185-.531-.627-.771-.556-.304-.992-.843-1.121-1.29-.112-.391-.072-.642.176-1.056.496-.824.934-2.076.934-3.326 0-3.38-2.454-6.577-6.938-6.577z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase mb-5">
              QUICK NAVIGATION
            </h3>
            <ul className="space-y-3">
              {quickNavLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(e) => handleLinkClick(e, link)}
                    className="text-slate-400 hover:text-white transition-colors duration-200 text-xs sm:text-sm block cursor-pointer"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Support */}
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase mb-5">
              CUSTOMER SUPPORT
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors duration-200 text-xs sm:text-sm block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Direct Contact */}
          <div>
            <h3 className="text-white font-bold text-xs sm:text-sm tracking-wider uppercase mb-5">
              DIRECT CONTACT
            </h3>
            <div className="space-y-4">
              
              {/* Phone / WhatsApp */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-6 h-6 rounded-md flex items-center justify-center text-[#1762f0] flex-shrink-0">
                  <MessageCircle className="w-5 h-5 fill-[#1762f0]/20 text-[#1762f0]" />
                </div>
                <div>
                  <a
                    href="https://wa.me/923001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-bold text-sm sm:text-base hover:text-blue-400 transition-colors block"
                  >
                    +92 300 1234567
                  </a>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Instant Order Support
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-[#1762f0] flex-shrink-0">
                  <Mail className="w-5 h-5 text-[#1762f0]" />
                </div>
                <a
                  href="mailto:orders@armourcraft.com"
                  className="text-slate-300 hover:text-white transition-colors text-xs sm:text-sm"
                >
                  orders@armourcraft.com
                </a>
              </div>

              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 flex items-center justify-center text-[#1762f0] flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#1762f0]" />
                </div>
                <span className="text-slate-400 text-xs sm:text-sm">
                  Sialkot, Punjab, Pakistan
                </span>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Bar / Copyright */}
        <div className="border-t border-slate-900/90 pt-8">
          <p className="text-xs text-slate-500">
            © 2026 ArmourCraft Protection. All Rights Reserved. | <span className="text-slate-400">Crafted in Sialkot.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Check } from 'lucide-react'

export const COUNTRY_DIAL_CODES = [
  { name: 'Pakistan', code: '+92', flag: '🇵🇰', iso: 'PK' },
  { name: 'India', code: '+91', flag: '🇮🇳', iso: 'IN' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧', iso: 'GB' },
  { name: 'United States', code: '+1', flag: '🇺🇸', iso: 'US' },
  { name: 'United Arab Emirates', code: '+971', flag: '🇦🇪', iso: 'AE' },
  { name: 'Australia', code: '+61', flag: '🇦🇺', iso: 'AU' },
  { name: 'Canada', code: '+1', flag: '🇨🇦', iso: 'CA' },
  { name: 'Saudi Arabia', code: '+966', flag: '🇸🇦', iso: 'SA' },
  { name: 'South Africa', code: '+27', flag: '🇿🇦', iso: 'ZA' },
  { name: 'New Zealand', code: '+64', flag: '🇳🇿', iso: 'NZ' },
  { name: 'Sri Lanka', code: '+94', flag: '🇱🇰', iso: 'LK' },
  { name: 'Bangladesh', code: '+880', flag: '🇧🇩', iso: 'BD' },
  { name: 'Qatar', code: '+974', flag: '🇶🇦', iso: 'QA' },
  { name: 'Oman', code: '+968', flag: '🇴🇲', iso: 'OM' },
  { name: 'Kuwait', code: '+965', flag: '🇰🇼', iso: 'KW' },
  { name: 'Bahrain', code: '+973', flag: '🇧🇭', iso: 'BH' },
  { name: 'Ireland', code: '+353', flag: '🇮🇪', iso: 'IE' },
  { name: 'Afghanistan', code: '+93', flag: '🇦🇫', iso: 'AF' },
  { name: 'Nepal', code: '+977', flag: '🇳🇵', iso: 'NP' },
  { name: 'Jamaica (WI)', code: '+1876', flag: '🇯🇲', iso: 'JM' },
  { name: 'Zimbabwe', code: '+263', flag: '🇿🇼', iso: 'ZW' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱', iso: 'NL' },
  { name: 'Germany', code: '+49', flag: '🇩🇪', iso: 'DE' },
  { name: 'France', code: '+33', flag: '🇫🇷', iso: 'FR' },
  { name: 'Singapore', code: '+65', flag: '🇸🇬', iso: 'SG' },
  { name: 'Malaysia', code: '+60', flag: '🇲🇾', iso: 'MY' }
]

export default function CountryPhoneInput({
  countryCode = '+92',
  onCountryCodeChange,
  phoneNumber = '',
  onPhoneNumberChange,
  placeholder = '300 1234567',
  required = false,
  id = 'phone',
  name = 'phone',
  containerBgClass = 'bg-[#131b2e]',
  inputPyClass = 'py-2.5'
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Find active country or fallback to Pakistan
  const selectedCountry =
    COUNTRY_DIAL_CODES.find((c) => c.code === countryCode) || COUNTRY_DIAL_CODES[0]

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      // Auto-focus search input when opened
      setTimeout(() => searchInputRef.current?.focus(), 50)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  // Filtered countries based on query
  const filteredCountries = COUNTRY_DIAL_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.includes(searchQuery) ||
      c.iso.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSelectCountry = (country) => {
    if (onCountryCodeChange) {
      onCountryCodeChange(country.code)
    }
    setIsOpen(false)
    setSearchQuery('')
  }

  return (
    <div
      ref={dropdownRef}
      className={`relative flex items-center ${containerBgClass} border border-slate-800/90 rounded-xl overflow-visible focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/30 transition-all`}
    >
      {/* Country Code Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 pl-3.5 pr-2.5 ${inputPyClass} text-xs sm:text-sm text-slate-300 hover:text-white font-medium border-r border-slate-800/90 select-none cursor-pointer hover:bg-slate-800/40 transition-colors flex-shrink-0`}
        title="Select Country Dialing Code"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none select-none">{selectedCountry.flag}</span>
        <span className="font-semibold text-slate-200">{selectedCountry.code}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-blue-400' : ''
          }`}
        />
      </button>

      {/* Phone Number Input Field */}
      <input
        id={id}
        name={name}
        type="tel"
        required={required}
        value={phoneNumber}
        onChange={(e) => onPhoneNumberChange && onPhoneNumberChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent px-3.5 ${inputPyClass} text-xs sm:text-sm text-white focus:outline-none placeholder:text-slate-500 font-normal`}
      />

      {/* Dropdown Floating Menu with Search */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 z-50 w-72 max-w-[90vw] bg-[#0c1527] border border-slate-700/90 rounded-xl shadow-2xl shadow-black/80 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Search Bar */}
          <div className="p-2 border-b border-slate-800 bg-[#090f1d]">
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country or code..."
                className="w-full bg-[#131b2e] border border-slate-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Country List */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-800/40 p-1">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => {
                const isSelected = country.code === selectedCountry.code && country.iso === selectedCountry.iso
                return (
                  <button
                    key={`${country.iso}-${country.code}`}
                    type="button"
                    onClick={() => handleSelectCountry(country)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer text-left ${
                      isSelected
                        ? 'bg-blue-600/20 text-blue-400 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-base select-none leading-none">{country.flag}</span>
                      <span className="truncate">{country.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                      <span className="font-semibold text-slate-400">{country.code}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="py-4 text-center text-xs text-slate-500">
                No matching country found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

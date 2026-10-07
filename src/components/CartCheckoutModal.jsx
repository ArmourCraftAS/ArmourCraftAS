import React, { useState, useEffect } from 'react'
import { X, Trash2, Check, CheckCircle2, ChevronRight, ShoppingBag } from 'lucide-react'
import CountryPhoneInput from './CountryPhoneInput'

export default function CartCheckoutModal({
  isOpen,
  onClose,
  cartItems = [],
  onRemoveItem,
  onClearOrderedItems,
  onNavigate
}) {
  // Selected items state (array of cart item indices)
  const [selectedIndices, setSelectedIndices] = useState([])
  const [countryCode, setCountryCode] = useState('+92')
  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderConfirmation, setOrderConfirmation] = useState(null)

  // Initialize all items as selected by default when modal opens or items change
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // If we don't have a selection yet, select all items
      setSelectedIndices(cartItems.map((_, i) => i))
    } else {
      document.body.style.overflow = ''
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, cartItems.length, onClose])

  if (!isOpen) return null

  const handleShopNowClick = () => {
    onClose()
    if (onNavigate) {
      onNavigate('/shop')
    } else if (typeof window !== 'undefined') {
      window.location.href = '/shop'
    }
  }

  // Checkbox toggle logic
  const allSelected = cartItems.length > 0 && selectedIndices.length === cartItems.length

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedIndices([])
    } else {
      setSelectedIndices(cartItems.map((_, i) => i))
    }
  }

  const handleToggleItem = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index))
    } else {
      setSelectedIndices([...selectedIndices, index])
    }
  }

  // Calculate dynamic total price based ONLY on checked items
  const totalPrice = selectedIndices.reduce((acc, index) => {
    const item = cartItems[index]
    if (!item) return acc
    const numPrice = parseFloat(String(item.price || '').replace(/[^0-9.]/g, '')) || 0
    return acc + numPrice * (item.quantity || 1)
  }, 0)

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setCustomerDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitOrder = (e) => {
    e.preventDefault()

    if (selectedIndices.length === 0) {
      alert('Please select at least one item to checkout.')
      return
    }

    if (!customerDetails.fullName.trim() || !customerDetails.address.trim()) {
      alert('Please fill in your Full Name and Shipping Address.')
      return
    }

    setIsSubmitting(true)

    // Simulate order placement
    setTimeout(() => {
      const orderId = `AC-${Math.floor(100000 + Math.random() * 900000)}`
      const fullPhone = customerDetails.phone?.trim()
        ? `${countryCode} ${customerDetails.phone.trim()}`
        : ''

      const confirmation = {
        orderId,
        total: totalPrice.toFixed(2),
        customerName: customerDetails.fullName,
        fullPhone,
        address: customerDetails.address,
        itemsCount: selectedIndices.length
      }

      // Persist the order to Admin Orders store for the Admin Portal
      try {
        const existingRaw = window.localStorage.getItem('armourcraft_admin_orders_v1')
        const currentOrders = existingRaw ? JSON.parse(existingRaw) : []
        const newAdminOrder = {
          id: orderId,
          customer: customerDetails.fullName.trim(),
          email: customerDetails.email?.trim() || 'customer@gmail.com',
          phone: fullPhone || '+92 300 0000000',
          address: customerDetails.address.trim(),
          items: selectedIndices.map((idx) => {
            const it = cartItems[idx]
            if (!it) return 'Armour Item'
            const stance = it.stance ? (it.stance.includes('LH') ? 'LH' : 'RH') : 'RH'
            const size = it.size || 'M'
            const qty = it.quantity || 1
            return `${it.title} (${stance} - ${size}${qty > 1 ? ` x${qty}` : ''})`
          }),
          total: totalPrice,
          paymentMethod: 'Cash on Delivery',
          status: 'Pending',
          date: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
        window.localStorage.setItem(
          'armourcraft_admin_orders_v1',
          JSON.stringify([newAdminOrder, ...currentOrders])
        )
      } catch (err) {
        console.warn('Failed to save order to admin orders store:', err)
      }

      setOrderConfirmation(confirmation)
      setIsSubmitting(false)

      // Remove ordered items from cart
      if (onClearOrderedItems) {
        onClearOrderedItems(selectedIndices)
      }
    }, 700)
  }

  const handleCloseAndReset = () => {
    setOrderConfirmation(null)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={handleCloseAndReset}
    >
      <div
        className="relative w-full max-w-[480px] bg-[#0c1424] border border-slate-800/90 rounded-3xl p-5 sm:p-7 shadow-2xl text-white max-h-[92vh] overflow-y-auto select-none animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Right Close Button */}
        <button
          type="button"
          onClick={handleCloseAndReset}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. Empty Cart View */}
        {cartItems.length === 0 && !orderConfirmation ? (
          <div className="py-10 px-2 text-center flex flex-col items-center justify-center animate-in fade-in duration-200">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400 shadow-[0_0_35px_rgba(20,98,234,0.25)]">
                <ShoppingBag className="w-10 h-10 stroke-[1.6]" />
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#060a14] border-2 border-slate-700 flex items-center justify-center text-[11px] font-bold text-slate-400">
                0
              </span>
            </div>

            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-2">
              Your Cart is Empty
            </h3>

            <p className="text-slate-400 text-sm max-w-xs leading-relaxed mb-7">
              Looks like you haven't added any armours yet. Explore our pro-grade cricket protection gear.
            </p>

            <button
              type="button"
              onClick={handleShopNowClick}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#1462ea] hover:bg-[#1a6df6] active:bg-blue-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>Shop Now</span>
              <ChevronRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        ) : orderConfirmation ? (
          /* 2. Order Confirmation View */
          <div className="py-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_25px_rgba(16,185,129,0.25)]">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-white uppercase tracking-tight">
              Order Confirmed!
            </h3>

            <div className="bg-[#090f1d] border border-slate-800 rounded-2xl p-4 text-left text-xs space-y-2 text-slate-300">
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <span className="text-slate-500">Order ID:</span>
                <span className="font-mono font-bold text-blue-400">{orderConfirmation.orderId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Customer:</span>
                <span className="font-semibold text-white">{orderConfirmation.customerName}</span>
              </div>
              {orderConfirmation.fullPhone && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">WhatsApp / Phone:</span>
                  <span className="font-semibold text-emerald-400">{orderConfirmation.fullPhone}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Payment Method:</span>
                <span className="font-bold text-blue-400 uppercase">Cash on Delivery</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <span className="text-slate-400 font-bold">Total Amount:</span>
                <span className="font-black text-white text-sm">${orderConfirmation.total}</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-xs mx-auto">
              Our fulfillment team in Sialkot is preparing your parcel. You will pay upon delivery.
            </p>

            <button
              type="button"
              onClick={handleCloseAndReset}
              className="w-full py-3.5 rounded-xl bg-[#1462ea] hover:bg-[#1a6df6] text-white font-extrabold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          /* 3. Main Checkout Form Content */
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            
            {/* Header: Title & Subtext */}
            <div className="pr-8">
              <h2 className="text-2xl font-black text-white tracking-tight leading-snug mb-1">
                Complete Your Order
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm font-normal">
                Enter your delivery details for{' '}
                <span className="text-[#1da1f2] font-semibold tracking-wide">
                  CASH ON DELIVERY
                </span>
              </p>
            </div>

            {/* Section: Items in Your Cart + Batch Select Toggle */}
            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <h3 className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Items in Your Cart ({cartItems.length})
                </h3>

                {cartItems.length > 0 && (
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-[#1da1f2] hover:text-blue-400 uppercase tracking-wider cursor-pointer select-none transition-colors"
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${
                        allSelected
                          ? 'bg-[#1da1f2] text-black'
                          : 'border border-[#1da1f2]/80 bg-transparent'
                      }`}
                    >
                      {allSelected && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                    </div>
                    <span>{allSelected ? 'UNSELECT ALL' : 'SELECT ALL'}</span>
                  </button>
                )}
              </div>

              {/* Cart Item Cards List */}
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {cartItems.map((item, index) => {
                  const isChecked = selectedIndices.includes(index)

                  const stanceLabel = item.stance
                    ? item.stance.replace(/\s*\([^)]*\)/, '')
                    : 'Right-Handed'
                  const sizeLabel = item.size || 'Medium'
                  const qtyLabel = item.quantity || 1
                  const variantsText = `${stanceLabel} | Size: ${sizeLabel} | Qty: ${qtyLabel}`

                  return (
                    <div
                      key={`${item.id}-${index}`}
                      onClick={() => handleToggleItem(index)}
                      className={`p-3 rounded-2xl border transition-all flex items-center gap-3.5 cursor-pointer ${
                        isChecked
                          ? 'bg-[#0f1728] border-slate-700/80 shadow-sm'
                          : 'bg-[#090f1d]/70 border-slate-800/80 opacity-75 hover:opacity-100'
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#060a14] border border-slate-800 flex items-center justify-center p-1 flex-shrink-0">
                        <img
                          src={item.image || '/images/product_thigh_guard.png'}
                          alt={item.title}
                          className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                        />
                      </div>

                      {/* Title, Variants & Price */}
                      <div className="flex-1 min-w-0 pr-1">
                        <h4 className="text-xs sm:text-sm font-bold text-white leading-tight truncate mb-0.5">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium truncate mb-1">
                          {variantsText}
                        </p>
                        <div className="text-xs sm:text-sm font-bold text-[#1da1f2]">
                          {item.price}
                        </div>
                      </div>

                      {/* Actions: Delete & Selection Checkbox */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (onRemoveItem) onRemoveItem(index)
                            setSelectedIndices((prev) => prev.filter((i) => i !== index))
                          }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                            isChecked
                              ? 'bg-[#1462ea] text-white shadow-sm shadow-blue-500/40'
                              : 'border border-slate-700 bg-[#070b14]'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Customer Details Form Section */}
            <div className="bg-[#090f1d]/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                CUSTOMER DETAILS
              </span>

              {/* Full Name */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  FULL NAME
                </label>
                <input
                  type="text"
                  required
                  name="fullName"
                  value={customerDetails.fullName}
                  onChange={handleFormChange}
                  placeholder="John Doe"
                  className="w-full bg-[#11192b] border border-slate-800/90 text-white rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-600 transition-colors"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  required
                  name="email"
                  value={customerDetails.email}
                  onChange={handleFormChange}
                  placeholder="john@example.com"
                  className="w-full bg-[#11192b] border border-slate-800/90 text-white rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-600 transition-colors"
                />
              </div>

              {/* WhatsApp | Phone Number */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  WHATSAPP | PHONE NUMBER
                </label>
                <CountryPhoneInput
                  countryCode={countryCode}
                  onCountryCodeChange={setCountryCode}
                  phoneNumber={customerDetails.phone}
                  onPhoneNumberChange={(val) =>
                    setCustomerDetails((prev) => ({ ...prev, phone: val }))
                  }
                  placeholder="300 1234567"
                  required
                  containerBgClass="bg-[#11192b]"
                  inputPyClass="py-2.5 sm:py-3"
                />
              </div>

              {/* Shipping Address */}
              <div>
                <label className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  SHIPPING ADDRESS
                </label>
                <textarea
                  rows="2"
                  required
                  name="address"
                  value={customerDetails.address}
                  onChange={handleFormChange}
                  placeholder="Enter your full street address, city and postal code"
                  className="w-full bg-[#11192b] border border-slate-800/90 text-white rounded-xl px-3.5 py-2.5 sm:py-3 text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-600 resize-none transition-colors"
                />
              </div>
            </div>

            {/* Total Row & Main CTA Button */}
            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-white font-extrabold text-base sm:text-lg">
                  Total
                </span>
                <span className="text-2xl sm:text-3xl font-black text-[#1da1f2] tracking-tight">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || selectedIndices.length === 0}
                className="w-full py-3.5 sm:py-4 rounded-xl bg-[#1462ea] hover:bg-[#1a6df6] active:bg-blue-700 disabled:opacity-50 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg shadow-blue-600/35 hover:shadow-blue-500/50 flex items-center justify-center gap-1.5 cursor-pointer group"
              >
                <span>{isSubmitting ? 'PROCESSING ORDER...' : 'CONFIRM & PLACE ORDER'}</span>
                <ChevronRight className="w-4 h-4 stroke-[3] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}

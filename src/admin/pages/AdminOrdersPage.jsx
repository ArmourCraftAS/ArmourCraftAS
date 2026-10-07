import React, { useState } from 'react'
import {
  ShoppingCart,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  Phone,
  MapPin,
  Mail
} from 'lucide-react'
import { useAdminAuth } from '../AdminAuthContext'

export default function AdminOrdersPage() {
  const { orders, updateOrderStatus } = useAdminAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const statuses = ['All', 'Pending', 'Confirmed', 'Shipped', 'Delivered']

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.phone.includes(searchQuery)
    const matchesStatus =
      statusFilter === 'All' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
      case 'Shipped':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30'
      case 'Confirmed':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
      default:
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30'
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Orders Management ({orders.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Process Cash on Delivery dispatches and update fulfillment stages
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0b1222] border border-slate-800/90 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, customer, or phone..."
            className="w-full bg-[#080d19] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {statuses.map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

      </div>

      {/* Orders List / Cards Table */}
      <div className="space-y-3.5">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-[#0b1222] border border-slate-800/80 rounded-2xl text-slate-500 text-sm">
            No orders match the current filter.
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-[#0b1222] border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700/80 transition-all shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/70">
                {/* Order ID & Date */}
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-base text-blue-400">
                    {order.id}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {order.date}
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Status Switcher Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Update Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="bg-[#080d19] border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1.5 focus:border-blue-500 focus:outline-none cursor-pointer"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Order Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs">
                {/* Customer Details */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Customer Info
                  </span>
                  <div className="font-bold text-white text-sm">{order.customer}</div>
                  <div className="text-slate-400 flex items-center gap-1.5 font-mono">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{order.phone}</span>
                  </div>
                  <div className="text-slate-400 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span className="truncate">{order.email}</span>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Shipping Address (COD)
                  </span>
                  <div className="text-slate-300 flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{order.address}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-bold uppercase pt-1">
                    Payment: {order.paymentMethod}
                  </div>
                </div>

                {/* Items & Total */}
                <div className="space-y-1 md:text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                    Ordered Armours
                  </span>
                  <ul className="text-slate-300 space-y-0.5">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="truncate">
                        • {item}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <span className="text-slate-400 text-xs mr-2">Total:</span>
                    <span className="text-lg font-black text-white font-mono">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}

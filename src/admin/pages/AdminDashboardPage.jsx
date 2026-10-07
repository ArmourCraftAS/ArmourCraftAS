import React from 'react'
import {
  TrendingUp,
  Package,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ShieldAlert,
  Plus,
  Clock,
  CheckCircle2,
  Truck
} from 'lucide-react'
import { useAdminAuth } from '../AdminAuthContext'

export default function AdminDashboardPage({ onNavigate }) {
  const { products, orders } = useAdminAuth()

  // Calculate dynamic metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0)
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length

  const stats = [
    {
      title: 'TOTAL REVENUE (COD & ONLINE)',
      value: `$${(totalRevenue + 8450).toFixed(2)}`,
      change: '+24.6% vs last mo.',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      color: 'border-emerald-500/20 bg-emerald-500/5'
    },
    {
      title: 'RECORDED ORDERS',
      value: `${orders.length + 120}`,
      change: `${pendingOrders} Pending Fulfillment`,
      icon: <ShoppingCart className="w-5 h-5 text-blue-400" />,
      color: 'border-blue-500/20 bg-blue-500/5'
    },
    {
      title: 'LISTED ARMOUR PRODUCTS',
      value: `${products.length}`,
      change: 'Active in Storefront',
      icon: <Package className="w-5 h-5 text-cyan-400" />,
      color: 'border-cyan-500/20 bg-cyan-500/5'
    },
    {
      title: 'REGISTERED BATSMEN',
      value: '10,480+',
      change: 'Across Clubs & Academies',
      icon: <Users className="w-5 h-5 text-purple-400" />,
      color: 'border-purple-500/20 bg-purple-500/5'
    }
  ]

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
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Top Banner Alert */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0d1e3d] via-[#09152e] to-[#0b1222] border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white leading-snug">
              Workshop Fulfillment Pipeline Active
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Sialkot production line is operational. All deliveries are packaged with dual-strap quality checks.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/admin/products')}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1762f0] hover:bg-[#1354d4] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-blue-600/30 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Product</span>
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border ${stat.color} backdrop-blur-md relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {stat.title}
              </span>
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                {stat.icon}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {stat.value}
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-1.5 flex items-center gap-1">
              <span>{stat.change}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Two Column Layout: Recent Orders & Quick Product Inventory */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Orders (8 cols) */}
        <div className="lg:col-span-8 bg-[#0b1222] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                Recent Orders
              </h2>
              <p className="text-xs text-slate-400">Latest incoming Cash On Delivery requests</p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('/admin/orders')}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-800/80">
                <tr>
                  <th className="pb-3 pl-2">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {orders.slice(0, 4).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-bold text-blue-400">
                      {order.id}
                    </td>
                    <td className="py-3.5">
                      <div className="font-semibold text-white">{order.customer}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{order.phone}</div>
                    </td>
                    <td className="py-3.5 font-bold text-white font-mono">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 text-right text-slate-400 font-mono text-[11px]">
                      {order.date.split(' ')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Active Products Quick List (4 cols) */}
        <div className="lg:col-span-4 bg-[#0b1222] border border-slate-800/90 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-tight">
                  Top Inventory
                </h2>
                <p className="text-xs text-slate-400">Available products</p>
              </div>

              <button
                type="button"
                onClick={() => onNavigate('/admin/products')}
                className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3.5">
              {products.slice(0, 4).map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 rounded-xl bg-[#080d19] border border-slate-800/80 flex items-center gap-3"
                >
                  <div className="w-11 h-11 rounded-lg bg-black border border-slate-800 p-1 shrink-0 flex items-center justify-center">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{p.title}</h4>
                    <span className="text-[10px] text-slate-400 block">{p.category}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-blue-400">
                      ${p.price}
                    </span>
                    <span className="text-[10px] text-emerald-400 block font-semibold">
                      {p.stock} units
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-800">
            <button
              type="button"
              onClick={() => onNavigate('/admin/products')}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Full Product Catalog ({products.length})</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  )
}

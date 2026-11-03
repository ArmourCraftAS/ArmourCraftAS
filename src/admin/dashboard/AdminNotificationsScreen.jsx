import React, { useState } from 'react'
import {
  ArrowLeft,
  Bell,
  ShoppingCart,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Clock,
  Trash2
} from 'lucide-react'

export default function AdminNotificationsScreen({ onClose }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'order',
      title: 'New Cash on Delivery Order',
      time: '5 min ago',
      desc: 'Order #ORD-7821 for Advantage Thigh Guard ($145.00) received.',
      unread: true,
      badge: 'ORDER'
    },
    {
      id: 2,
      type: 'cms',
      title: 'CMS Sync Notice',
      time: '20 min ago',
      desc: 'Hero Section landing content snapshot updated in draft store.',
      unread: true,
      badge: 'CMS'
    },
    {
      id: 3,
      type: 'inventory',
      title: 'Low Stock Alert',
      time: '1 hour ago',
      desc: 'Advantage Carbon Guard has 4 units left in inventory.',
      unread: false,
      badge: 'STOCK'
    },
    {
      id: 4,
      type: 'system',
      title: 'Security Session Verified',
      time: '2 hours ago',
      desc: 'Master admin credentials authenticated from current workspace.',
      unread: false,
      badge: 'SYSTEM'
    }
  ])

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'unread') return n.unread
    if (activeFilter === 'orders') return n.type === 'order'
    return true
  })

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  const clearAll = () => {
    setNotifications([])
  }

  return (
    <div
      role="region"
      aria-label="Admin Notifications Fullscreen"
      className="fixed inset-0 z-[999999] bg-[#070b14] flex flex-col text-slate-100 select-none animate-in fade-in duration-200"
    >
      {/* ========================================================================= */}
      {/* 1. TOP HEADER WITH CLEAR BACKWARD / BACK ARROW (←)                         */}
      {/* ========================================================================= */}
      <header className="h-16 px-4 bg-[#0b1222] border-b border-slate-800/90 flex items-center justify-between shrink-0 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          {/* Back Button with ArrowLeft (←) */}
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer border border-slate-700/70"
            title="Back to Admin View"
            aria-label="Back to Admin View"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>BACK</span>
          </button>

          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-tight flex items-center gap-1.5">
              <span>Admin Alerts</span>
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            </h1>
            <p className="text-[10px] text-slate-400 font-medium">Real-time system events</p>
          </div>
        </div>

        {/* Clear / Read Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={markAllRead}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            Mark Read
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FILTER PILLS                                                            */}
      {/* ========================================================================= */}
      <div className="px-4 py-3 bg-[#080d1a] border-b border-slate-800/60 flex items-center gap-2 shrink-0 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('unread')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'unread'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Unread ({notifications.filter((n) => n.unread).length})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('orders')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'orders'
              ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Orders
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 3. NOTIFICATION CARDS LIST (FULL-SCREEN MOBILE SCROLLABLE)                 */}
      {/* ========================================================================= */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-[#0b1222] border border-slate-800 rounded-2xl">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2 opacity-80" />
            <h3 className="text-sm font-bold text-white mb-1">All Caught Up!</h3>
            <p className="text-xs text-slate-400">No active notifications matching this filter.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all ${
                item.unread
                  ? 'bg-[#0e172a] border-blue-500/40 shadow-lg shadow-blue-950/20'
                  : 'bg-[#0a101d] border-slate-800/80 text-slate-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      item.type === 'order'
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                        : item.type === 'inventory'
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                        : item.type === 'cms'
                        ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                        : 'bg-purple-500/10 border border-purple-500/30 text-purple-400'
                    }`}
                  >
                    {item.type === 'order' ? (
                      <ShoppingCart className="w-4 h-4" />
                    ) : item.type === 'inventory' ? (
                      <ShieldAlert className="w-4 h-4" />
                    ) : item.type === 'cms' ? (
                      <Sparkles className="w-4 h-4" />
                    ) : (
                      <Bell className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white leading-tight">
                      {item.title}
                    </h3>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono mt-0.5">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    item.unread
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed pl-10">
                {item.desc}
              </p>
            </div>
          ))
        )}
      </main>

      {/* ========================================================================= */}
      {/* 4. FOOTER RETURN BUTTON                                                    */}
      {/* ========================================================================= */}
      <footer className="p-4 bg-[#0b1222] border-t border-slate-800/90 shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-600/30 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          <span>RETURN TO MAIN ADMIN VIEW</span>
        </button>
      </footer>
    </div>
  )
}

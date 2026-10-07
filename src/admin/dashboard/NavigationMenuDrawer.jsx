import React from 'react'
import {
  Home,
  ShoppingBag,
  Info,
  BookOpen,
  Mail,
  PanelTop,
  PanelBottom,
  ChevronRight
} from 'lucide-react'

export default function NavigationMenuDrawer({
  activePage = 'Home',
  onSelectPage,
  onNavigate
}) {
  const menuItems = [
    { id: 'Home', label: 'Home', icon: Home, path: '/admin/dashboard' },
    { id: 'Shop Armours', label: 'Shop Armours', icon: ShoppingBag, path: '/admin/products' },
    { id: 'What We Are', label: 'What We Are', icon: Info, path: '/what-we-are' },
    { id: 'Blog / Insights', label: 'Blog / Insights', icon: BookOpen, path: '/blog' },
    { id: 'Contact Us', label: 'Contact Us', icon: Mail, path: '/contact' },
    { id: 'Header', label: 'Header', icon: PanelTop },
    { id: 'Footer', label: 'Footer', icon: PanelBottom }
  ]

  const handleClick = (item) => {
    if (onSelectPage) {
      onSelectPage(item.id)
    }
    if (item.path && item.path.startsWith('/admin') && item.path !== '/admin/dashboard' && onNavigate) {
      onNavigate(item.path)
    }
  }

  return (
    <div className="hidden xl:flex flex-col justify-start p-4 z-20 shrink-0">
      <div className="w-44 bg-[#0d1424]/95 border border-slate-800/90 rounded-2xl p-2 shadow-2xl backdrop-blur-md select-none">
        <div className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = activePage === item.id
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClick(item)}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center justify-between group cursor-pointer relative ${
                  isActive
                    ? 'bg-[#131d33] text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {/* Active blue vertical indicator bar on the left edge */}
                {isActive && (
                  <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#1d63ed] rounded-r-full shadow-[0_0_8px_rgba(29,99,237,0.8)]" />
                )}

                <span className="truncate pl-1.5">{item.label}</span>

                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 shadow-sm" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

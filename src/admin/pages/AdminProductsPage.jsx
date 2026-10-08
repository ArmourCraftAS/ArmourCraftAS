import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  FolderPlus,
  X,
  CheckCircle2,
  AlertTriangle,
  Package,
  Layers,
  Sparkles
} from 'lucide-react'
import { useAdminAuth } from '../AdminAuthContext'
import DeleteProductModal from '../dashboard/DeleteProductModal'
import AddProductModal from '../dashboard/AddProductModal'
import { supabase } from '../../../lib/supabaseClient'

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminAuth()

  // 1. Interactive Filters State
  const [activeCategory, setActiveCategory] = useState('All Products')
  const [activeStance, setActiveStance] = useState('All Stances')
  const [searchQuery, setSearchQuery] = useState('')

  // 2. Custom Categories management with persistent storage
  const [customCategories, setCustomCategories] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = window.localStorage.getItem('armourcraft_admin_custom_categories')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist custom categories
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      window.localStorage.setItem(
        'armourcraft_admin_custom_categories',
        JSON.stringify(customCategories)
      )
    } catch {
      // ignore
    }
  }, [customCategories])

  const baseCategories = ['All Products', 'Thigh Guards', 'Inner Pads', 'Leg Guards']
  const allCategories = useMemo(() => {
    const set = new Set([...baseCategories, ...customCategories])
    return Array.from(set)
  }, [customCategories])

  const stances = ['All Stances', 'Right-Handed', 'Left-Handed']

  // 3. Modals State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState(false)
  const [newTypeName, setNewTypeName] = useState('')
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // 4. Form State for Add / Edit
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Thigh Guards',
    stance: 'All Stances',
    image: '/images/product_thigh_guard.png',
    impactRating: '160+ km/h',
    stock: 50
  })

  // Image Presets for rapid selection in modal
  const imagePresets = [
    { label: 'Thigh Guard Set', url: '/images/product_thigh_guard.png' },
    { label: 'Interceptor Leg Guards', url: '/images/product_leg_guard.png' },
    { label: 'Custom Pads Combo', url: '/images/custom_pads.png' },
    { label: 'Vanguard Inner Pads', url: '/images/advantage_carbon.png' },
    { label: 'Aegis Chest Protector', url: '/images/aegis_chest_protector.jpg' },
    { label: 'Shadow Batting Gloves', url: '/images/shadow_batting_gloves.jpg' },
    { label: 'Sentinel Aero Helmet', url: '/images/nextgen_batsman_helmet.jpg' }
  ]

  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type })
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Open Add Product Modal
  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setIsAddProductModalOpen(true)
  }

  // Open Edit Product Modal
  const handleOpenEditModal = (product) => {
    setEditingProduct(product)
    setIsAddProductModalOpen(true)
  }

  // Save Product (Add or Edit) with Supabase synchronization
  const handleSaveProduct = async (payload) => {
    if (editingProduct) {
      // 1. Update in local state / context
      updateProduct(editingProduct.id, payload)

      // 2. Sync with Supabase if table exists
      try {
        if (supabase && typeof supabase.from === 'function') {
          await supabase.from('products').update(payload).eq('id', editingProduct.id)
        }
      } catch (err) {
        console.info('Supabase product update notice:', err?.message || err)
      }

      showToast(`Updated "${payload.title}" successfully!`)
    } else {
      // 1. Add to local state / context
      const newId = `product-${Date.now()}`
      const newProduct = { ...payload, id: newId }
      addProduct(newProduct)

      // 2. Sync with Supabase if table exists
      try {
        if (supabase && typeof supabase.from === 'function') {
          await supabase.from('products').insert([newProduct])
        }
      } catch (err) {
        console.info('Supabase product insert notice:', err?.message || err)
      }

      showToast(`Added "${payload.title}" to catalog!`)
    }

    setIsAddProductModalOpen(false)
    setEditingProduct(null)
  }

  // Submit New Product Type (Category)
  const handleCreateProductType = (e) => {
    e.preventDefault()
    const trimmed = newTypeName.trim()
    if (!trimmed) return

    if (!allCategories.includes(trimmed)) {
      setCustomCategories((prev) => [...prev, trimmed])
      setActiveCategory(trimmed)
      showToast(`Created new product type "${trimmed}"!`)
    } else {
      setActiveCategory(trimmed)
      showToast(`Switched to "${trimmed}"`)
    }

    setNewTypeName('')
    setIsAddTypeModalOpen(false)
  }

  // Delete Product from State & Supabase
  const handleConfirmDelete = async (productToDelete) => {
    const target = productToDelete || deleteConfirmProduct
    if (!target) return

    setIsDeleting(true)
    const targetId = target.id
    const targetTitle = target.title

    // 1. Remove from active store & localStorage
    deleteProduct(targetId)

    // 2. Remove from Supabase backend if connected
    try {
      if (supabase && typeof supabase.from === 'function') {
        const { error } = await supabase.from('products').delete().eq('id', targetId)
        if (error) {
          console.info('Supabase delete notification (handled):', error.message)
        }
      }
    } catch (err) {
      console.info('Supabase product removal notice:', err?.message || err)
    }

    // 3. Close modal & show toast
    setIsDeleting(false)
    setDeleteConfirmProduct(null)
    showToast(`Product “${targetTitle}” removed successfully!`)
  }

  // Filter Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // 1. Category Filter
      if (activeCategory !== 'All Products' && prod.category !== activeCategory) {
        return false
      }

      // 2. Stance Filter
      if (activeStance !== 'All Stances') {
        const prodStance = prod.stance || 'All Stances'
        if (
          prodStance !== 'All Stances' &&
          prodStance !== activeStance &&
          !(Array.isArray(prod.stances) && prod.stances.includes(activeStance))
        ) {
          return false
        }
      }

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const titleMatch = prod.title?.toLowerCase().includes(q)
        const descMatch = prod.description?.toLowerCase().includes(q)
        const catMatch = prod.category?.toLowerCase().includes(q)
        if (!titleMatch && !descMatch && !catMatch) {
          return false
        }
      }

      return true
    })
  }, [products, activeCategory, activeStance, searchQuery])

  return (
    <div className="w-full min-h-screen bg-[#070b14] text-slate-100 font-sans p-4 sm:p-6 lg:p-8 space-y-6">
      
      {/* ========================================================================= */}
      {/* 1. TOP CONTROL BAR (image_b6fe51.png)                                      */}
      {/* ========================================================================= */}
      <div className="space-y-4 max-w-7xl mx-auto">
        
        {/* ROW 1: CATEGORY FILTER PILLS & "ADD NEW PRODUCT TYPE" BUTTON */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {allCategories.map((cat) => {
              const isSelected = activeCategory === cat
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#1965eb] text-white font-bold shadow-lg shadow-blue-600/30'
                      : 'bg-[#0d1527] hover:bg-[#14203a] text-slate-300 hover:text-white border border-slate-800/80'
                  }`}
                >
                  {cat}
                </button>
              )
            })}
          </div>

          {/* Primary Action Button: ADD NEW PRODUCT TYPE */}
          <button
            type="button"
            onClick={() => setIsAddTypeModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1965eb] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/25 cursor-pointer shrink-0 active:scale-[0.98] transition-all"
          >
            <FolderPlus className="w-4 h-4 stroke-[2.5]" />
            <span>ADD NEW PRODUCT TYPE</span>
          </button>
        </div>

        {/* ROW 2: STANCE FILTER PILLS & SEARCH BAR & "ADD PRODUCT" BUTTON */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-1">
          
          {/* Stance Filter Pills */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 tracking-wider uppercase mr-1">
              STANCE:
            </span>
            {stances.map((stance) => {
              const isSelected = activeStance === stance
              return (
                <button
                  key={stance}
                  type="button"
                  onClick={() => setActiveStance(stance)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-[#0f1b33] text-white border border-blue-500/70 shadow-sm'
                      : 'bg-transparent text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {stance}
                </button>
              )
            })}
          </div>

          {/* Search Input & Accent Action: + ADD PRODUCT */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64 sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full bg-[#0a101d] border border-slate-800 rounded-xl pl-4 pr-10 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Accent Action Button: + ADD PRODUCT */}
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#2563eb] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-600/30 cursor-pointer shrink-0 active:scale-[0.98] transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>ADD PRODUCT</span>
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 2. PRODUCT CARDS GRID (3-COLUMN RESPONSIVE LAYOUT, image_b6fe51.png)       */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto pt-2">
        {filteredProducts.length === 0 ? (
          <div className="w-full py-16 bg-[#0b1220] border border-slate-800/80 rounded-2xl flex flex-col items-center justify-center text-center p-6">
            <Package className="w-12 h-12 text-slate-600 mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No products match your filters</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              Try selecting a different category, clearing your search query, or adding a new product.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveCategory('All Products')
                setActiveStance('All Stances')
                setSearchQuery('')
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#0b1220] border border-slate-800/90 rounded-2xl p-5 hover:border-slate-700/80 transition-all duration-200 flex flex-col justify-between shadow-xl shadow-black/40 group"
              >
                {/* Product Image Frame */}
                <div className="w-full h-56 bg-[#070b14] rounded-xl flex items-center justify-center p-3 mb-4 overflow-hidden border border-slate-800/50 relative">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] group-hover:scale-[1.02] transition-transform duration-300 select-none"
                    onError={(e) => {
                      e.currentTarget.src = '/images/product_thigh_guard.png'
                    }}
                  />
                </div>

                {/* Title & Description */}
                <div className="flex-1 flex flex-col mb-4">
                  <h3 className="text-base font-bold text-white mb-2 leading-snug line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2 min-h-[34px]">
                    {product.description ||
                      'Ultra-lightweight ergonomic cricket protection engineered for maximum mobility.'}
                  </p>
                </div>

                {/* Bottom Bar: Price & Action Icons (Edit & Delete) */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 mt-auto">
                  <span className="text-lg font-black text-white font-mono">
                    ${typeof product.price === 'number'
                      ? product.price.toFixed(2)
                      : parseFloat(product.price || 0).toFixed(2)}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Edit Pencil Icon Button */}
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(product)}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
                      title="Edit product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete Trash Icon Button */}
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmProduct(product)}
                      className="p-2 text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. ADD / EDIT PRODUCT MODAL (image_c25b81.png)                            */}
      {/* ========================================================================= */}
      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => {
          setIsAddProductModalOpen(false)
          setEditingProduct(null)
        }}
        onSave={handleSaveProduct}
        initialData={editingProduct}
        categories={allCategories}
      />

      {/* ========================================================================= */}
      {/* 4. ADD NEW PRODUCT TYPE (CATEGORY) MODAL                                  */}
      {/* ========================================================================= */}
      {isAddTypeModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-8 bg-black/70 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsAddTypeModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-[#0B0F17] border border-slate-800/80 rounded-3xl p-6 sm:p-7 shadow-2xl text-white relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <FolderPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black uppercase text-white tracking-tight">
                  Add New Product Type
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTypeModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProductType} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Product Type / Category Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  placeholder="e.g. Chest Guards, Batting Gloves, Helmets"
                  className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-800 mt-5">
                <button
                  type="button"
                  onClick={() => setIsAddTypeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1965eb] hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Create Product Type
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 5. PRODUCT DELETE CONFIRMATION MODAL (image_b7797a.png)                    */}
      {/* ========================================================================= */}
      <DeleteProductModal
        isOpen={Boolean(deleteConfirmProduct)}
        product={deleteConfirmProduct}
        onClose={() => setDeleteConfirmProduct(null)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />

      {/* ========================================================================= */}
      {/* 6. TOAST NOTIFICATION                                                     */}
      {/* ========================================================================= */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[99999] animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="px-4 py-3 rounded-xl bg-[#0c1424] border border-blue-500/50 shadow-2xl shadow-blue-900/40 flex items-center gap-3 backdrop-blur-md text-white">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-bold">{toastMessage.message}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

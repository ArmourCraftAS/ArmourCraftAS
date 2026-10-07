import React, { useState } from 'react'
import {
  Package,
  Plus,
  Trash2,
  Edit,
  Search,
  Check,
  X,
  Image as ImageIcon,
  DollarSign,
  Tag,
  Layers,
  AlertTriangle
} from 'lucide-react'
import { useAdminAuth } from '../AdminAuthContext'

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdminAuth()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null)

  // Form state for adding/editing products
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: 'Thigh Guards',
    sizes: 'Small, Medium, Large',
    image: '/images/product_thigh_guard.png',
    impactRating: '160+ km/h',
    stock: 50
  })

  const categories = ['All', 'Thigh Guards', 'Leg Guards', 'Inner Pads', 'Accessories']

  const handleOpenAddModal = () => {
    setFormData({
      title: '',
      price: '',
      category: 'Thigh Guards',
      sizes: 'Small, Medium, Large',
      image: '/images/product_thigh_guard.png',
      impactRating: '160+ km/h',
      stock: 50
    })
    setEditingProduct(null)
    setIsAddModalOpen(true)
  }

  const handleOpenEditModal = (product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      price: product.price,
      category: product.category,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : product.sizes || 'Universal',
      image: product.image,
      impactRating: product.impactRating || '160+ km/h',
      stock: product.stock || 40
    })
    setIsAddModalOpen(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const sizeList = formData.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const productPayload = {
      title: formData.title.trim(),
      price: parseFloat(formData.price) || 0,
      category: formData.category,
      sizes: sizeList.length > 0 ? sizeList : ['Standard'],
      image: formData.image.trim() || '/images/product_thigh_guard.png',
      impactRating: formData.impactRating,
      stock: parseInt(formData.stock, 10) || 30
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, productPayload)
    } else {
      addProduct(productPayload)
    }

    setIsAddModalOpen(false)
    setEditingProduct(null)
  }

  const handleDelete = (id) => {
    deleteProduct(id)
    setDeleteConfirmationId(null)
  }

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            Armour Products ({products.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Create, update, or remove cricket armours and thigh guard models
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1762f0] hover:bg-[#1354d4] active:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-blue-600/30 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Armour</span>
        </button>
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
            placeholder="Search by product title or category..."
            className="w-full bg-[#080d19] border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Products Table */}
      <div className="bg-[#0b1222] border border-slate-800/90 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#080d19] text-[10px] uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3.5 pl-4 sm:pl-6">Product</th>
                <th className="py-3.5">Category</th>
                <th className="py-3.5">Price</th>
                <th className="py-3.5">Sizes Available</th>
                <th className="py-3.5">Stock</th>
                <th className="py-3.5 pr-4 sm:pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const sizesFormatted = Array.isArray(product.sizes)
                    ? product.sizes.join(', ')
                    : product.sizes

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Product Thumbnail & Title */}
                      <td className="py-3.5 pl-4 sm:pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-black border border-slate-800 p-1 flex items-center justify-center shrink-0">
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-full h-full object-contain filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                            />
                          </div>
                          <div>
                            <span className="font-bold text-white block leading-snug">
                              {product.title}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: {product.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5">
                        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-semibold text-blue-300">
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3.5 font-bold font-mono text-white">
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
                      </td>

                      {/* Sizes */}
                      <td className="py-3.5 text-xs text-slate-300">
                        {sizesFormatted}
                      </td>

                      {/* Stock / Status */}
                      <td className="py-3.5">
                        <span className="text-emerald-400 font-bold text-xs">
                          {product.stock || 45} in stock
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pr-4 sm:pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-slate-400 hover:text-blue-400 border border-slate-800 hover:border-blue-500/30 transition-colors cursor-pointer"
                            title="Edit product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => setDeleteConfirmationId(product.id)}
                            className="p-2 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 hover:border-rose-500/30 transition-colors cursor-pointer"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD / EDIT PRODUCT MODAL                                                  */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-[#0b1222] border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-white relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black uppercase text-white tracking-tight">
                  {editingProduct ? 'Edit Armour Product' : 'Add New Armour Product'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Product Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Pro Dual-Leg Thigh Guard Set"
                  className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Price & Category in 2 Cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="79.99"
                    className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  >
                    <option value="Thigh Guards">Thigh Guards</option>
                    <option value="Leg Guards">Leg Guards</option>
                    <option value="Inner Pads">Inner Pads</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              {/* Sizes Available */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Sizes Available (Comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="Small, Medium, Large"
                  className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Image URL & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/product_thigh_guard.png"
                    className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Initial Stock Count
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50"
                    className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-sm focus:border-blue-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1762f0] hover:bg-[#1354d4] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setDeleteConfirmationId(null)}
        >
          <div
            className="w-full max-w-sm bg-[#0b1222] border border-rose-500/30 rounded-2xl p-6 text-center text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 mx-auto flex items-center justify-center mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold uppercase mb-1">Delete Product?</h3>
            <p className="text-xs text-slate-400 mb-5">
              This action will remove the product from the admin inventory list.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmationId(null)}
                className="flex-1 py-2 rounded-xl bg-slate-900 text-slate-400 text-xs font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmationId)}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold uppercase cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

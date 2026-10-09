import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import {
  Plus,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
  X,
  AlertTriangle,
  CheckCircle2,
  HelpCircle
} from 'lucide-react'
import { initialFaqs, getStoredFaqs, saveStoredFaqs } from '../../data/faqsData'
import { supabase } from '../../../lib/supabaseClient'

export default function AdminFaqsPage({ onNavigate }) {
  // 1. FAQs State initialized from localStorage / initialFaqs
  const [faqs, setFaqs] = useState(() => getStoredFaqs())
  // In image_6a79b6.png, the first card (index 0) is expanded by default
  const [openIds, setOpenIds] = useState(() => new Set([faqs[0]?.id || 'faq-1']))

  // 2. Modals & Actions State
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [editingFaq, setEditingFaq] = useState(null)
  const [deleteConfirmFaq, setDeleteConfirmFaq] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [toastMessage, setToastMessage] = useState(null)

  // 3. Form State
  const [formData, setFormData] = useState({
    question: '',
    answer: ''
  })

  // Toast feedback helper
  const showToast = (message, type = 'success') => {
    setToastMessage({ message, type })
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Fetch from Supabase on mount
  useEffect(() => {
    async function fetchFromSupabase() {
      try {
        if (supabase && typeof supabase.from === 'function') {
          const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .order('id', { ascending: true })

          if (!error && Array.isArray(data) && data.length > 0) {
            setFaqs(data)
            saveStoredFaqs(data)
          }
        }
      } catch (err) {
        console.info('Supabase FAQs notice (using local store):', err?.message || err)
      }
    }
    fetchFromSupabase()
  }, [])

  // Toggle Accordion Item
  const toggleFaq = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingFaq(null)
    setFormData({
      question: '',
      answer: ''
    })
    setIsAddEditModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEditModal = (faq) => {
    setEditingFaq(faq)
    setFormData({
      question: faq.question || '',
      answer: faq.answer || ''
    })
    setIsAddEditModalOpen(true)
  }

  // Save FAQ (Add or Edit)
  const handleSaveFaq = async (e) => {
    e.preventDefault()
    const trimmedQuestion = formData.question.trim()
    const trimmedAnswer = formData.answer.trim()

    if (!trimmedQuestion || !trimmedAnswer) {
      showToast('Please fill in both Question and Answer.', 'info')
      return
    }

    setIsSaving(true)

    if (editingFaq) {
      // 1. Update Existing FAQ
      const updated = {
        ...editingFaq,
        question: trimmedQuestion,
        answer: trimmedAnswer
      }

      const updatedList = faqs.map((f) => (f.id === editingFaq.id ? updated : f))
      setFaqs(updatedList)
      saveStoredFaqs(updatedList)

      // Sync Supabase
      try {
        if (supabase && typeof supabase.from === 'function') {
          await supabase.from('faqs').update(updated).eq('id', editingFaq.id)
        }
      } catch (err) {
        console.info('Supabase update notice:', err?.message || err)
      }

      showToast('FAQ updated successfully!')
    } else {
      // 2. Insert New FAQ
      const newFaq = {
        id: `faq-${Date.now()}`,
        question: trimmedQuestion,
        answer: trimmedAnswer
      }

      const updatedList = [...faqs, newFaq]
      setFaqs(updatedList)
      saveStoredFaqs(updatedList)

      // Ensure newly added FAQ starts expanded
      setOpenIds((prev) => new Set([...prev, newFaq.id]))

      // Sync Supabase
      try {
        if (supabase && typeof supabase.from === 'function') {
          await supabase.from('faqs').insert([newFaq])
        }
      } catch (err) {
        console.info('Supabase insert notice:', err?.message || err)
      }

      showToast('New FAQ added and published live!')
    }

    setIsSaving(false)
    setIsAddEditModalOpen(false)
    setEditingFaq(null)
  }

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!deleteConfirmFaq) return
    setIsDeleting(true)
    const targetId = deleteConfirmFaq.id

    const updatedList = faqs.filter((f) => f.id !== targetId)
    setFaqs(updatedList)
    saveStoredFaqs(updatedList)

    // Sync Supabase
    try {
      if (supabase && typeof supabase.from === 'function') {
        await supabase.from('faqs').delete().eq('id', targetId)
      }
    } catch (err) {
      console.info('Supabase delete notice:', err?.message || err)
    }

    setIsDeleting(false)
    setDeleteConfirmFaq(null)
    showToast('FAQ question deleted.')
  }

  return (
    <div className="w-full min-h-screen bg-[#070b14] text-slate-100 font-sans p-4 sm:p-6 lg:p-8 space-y-8 select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER & CONTROL BAR (image_6a79b6.png)                            */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions (FAQs)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 font-normal">
            Manage, edit, or create customer support questions and answers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAddModal}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1965eb] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. ACCORDION FAQ CARDS (image_6a79b6.png)                                 */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto space-y-4">
        {faqs.map((faq) => {
          const isOpen = openIds.has(faq.id)

          return (
            <div
              key={faq.id}
              className="w-full bg-[#0c1322] border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-5 sm:p-6 transition-all duration-200 shadow-xl"
            >
              {/* Header: Question & Action Icons */}
              <div className="w-full flex items-center justify-between gap-4">
                {/* Question clickable title */}
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="text-left flex-1 cursor-pointer focus:outline-none group"
                >
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-400 transition-colors leading-snug">
                    {faq.question}
                  </h3>
                </button>

                {/* Right Action Icons: Edit, Delete, Chevron */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Edit Pencil Icon */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(faq)}
                    className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer"
                    title="Edit FAQ"
                  >
                    <Edit2 className="w-4 h-4 stroke-[2]" />
                  </button>

                  {/* Delete Trash Icon */}
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmFaq(faq)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                    title="Delete FAQ"
                  >
                    <Trash2 className="w-4 h-4 stroke-[2]" />
                  </button>

                  {/* Chevron Expand/Collapse Icon */}
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="p-1.5 cursor-pointer text-slate-400 hover:text-white transition-colors"
                    title={isOpen ? 'Collapse answer' : 'Expand answer'}
                  >
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-blue-400 stroke-[2.5]" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 stroke-[2.5]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Answer Body */}
              {isOpen && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-800/60 text-xs sm:text-sm text-slate-400 leading-relaxed font-normal animate-in fade-in duration-150">
                  {faq.answer}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ========================================================================= */}
      {/* 3. ADD / EDIT FAQ POPUP MODAL                                             */}
      {/* ========================================================================= */}
      {isAddEditModalOpen && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => !isSaving && setIsAddEditModalOpen(false)}
        >
          <div
            className="w-full max-w-xl bg-[#0B0F17] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <HelpCircle className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    {editingFaq ? 'Edit FAQ Question' : 'Add New FAQ'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configure customer question and informative answer.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddEditModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800/60 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveFaq} className="space-y-5">
              {/* Question */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  QUESTION *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. What materials are used in ArmourCraft thigh guards?"
                  className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-4 py-3 text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-600 font-medium"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  ANSWER *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide an informative, clear response for customers..."
                  className="w-full bg-[#080d19] border border-slate-800 text-white rounded-xl px-4 py-3 text-xs sm:text-sm focus:border-blue-500 focus:outline-none placeholder:text-slate-600 resize-none leading-relaxed font-normal"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEditModalOpen(false)}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#111726] hover:bg-[#182238] border border-slate-700/60 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                >
                  {editingFaq ? 'Discard Changes' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#1965eb] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
                >
                  {isSaving
                    ? 'Saving...'
                    : editingFaq
                    ? 'Save & Update FAQ'
                    : 'Save & Publish FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 4. DELETE CONFIRMATION POPUP MODAL                                        */}
      {/* ========================================================================= */}
      {deleteConfirmFaq && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => !isDeleting && setDeleteConfirmFaq(null)}
        >
          <div
            className="w-full max-w-md bg-[#0c1322] border border-slate-800/90 rounded-3xl p-6 sm:p-7 shadow-2xl text-white relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Red Alert Icon */}
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full bg-[#241114] border border-red-500/20 flex items-center justify-center shadow-lg shadow-red-950/40">
                <AlertTriangle className="w-6 h-6 text-[#ef4444] stroke-[2.2] fill-[#ef4444]/20" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white text-center tracking-tight mb-3">
              Delete FAQ Question?
            </h3>

            <p className="text-sm text-slate-400 text-center leading-relaxed px-2 mb-6">
              Are you sure you want to delete <span className="font-bold text-white">"{deleteConfirmFaq.question}"</span>? This will immediately remove it from customer support on the live website.
            </p>

            <div className="border-t border-slate-800/80 pt-5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmFaq(null)}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-[#111726] hover:bg-[#182238] border border-slate-700/60 text-slate-300 hover:text-white text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-6 py-2.5 rounded-xl bg-[#e6392a] hover:bg-red-600 text-white text-sm font-bold shadow-lg shadow-red-600/30 transition-all cursor-pointer active:scale-[0.98] disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete FAQ'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* ========================================================================= */}
      {/* 5. TOAST NOTIFICATION                                                     */}
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

import React, { useState, useEffect } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { getStoredFaqs } from '../data/faqsData'
import { supabase } from '../../lib/supabaseClient'
import { useCmsContent } from '../admin/cmsStore'
import { FadeIn, StaggerContainer, StaggerItem } from './StorefrontMotion'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0)
  const [faqItems, setFaqItems] = useState(() => getStoredFaqs())
  const heading = useCmsContent('home.faq.heading', 'Frequently Asked Questions')

  useEffect(() => {
    // 1. Sync on custom event
    const handleUpdate = (e) => {
      if (Array.isArray(e.detail) && e.detail.length > 0) {
        setFaqItems(e.detail)
      }
    }
    window.addEventListener('armourcraft:faqs-updated', handleUpdate)

    // 2. Fetch from Supabase
    async function fetchFromSupabase() {
      try {
        if (supabase && typeof supabase.from === 'function') {
          const { data, error } = await supabase
            .from('faqs')
            .select('*')
            .order('id', { ascending: true })

          if (!error && Array.isArray(data) && data.length > 0) {
            setFaqItems(data)
          }
        }
      } catch (err) {
        console.info('Storefront FAQ fetch notice:', err?.message || err)
      }
    }
    fetchFromSupabase()

    return () => window.removeEventListener('armourcraft:faqs-updated', handleUpdate)
  }, [])

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative w-full bg-[#060a12] py-20 lg:py-28 px-4 sm:px-6 lg:px-8 text-white border-t border-slate-900/60 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-blue-600/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Heading */}
        <FadeIn direction="up" distance={20}>
          <h2
            data-cms-path="home.faq.heading"
            data-cms-label="FAQ Section Heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center tracking-tight mb-12 sm:mb-14"
          >
            {heading}
          </h2>
        </FadeIn>

        {/* Accordion Layout with Staggered Scroll Reveal */}
        <StaggerContainer staggerDelay={0.06} className="space-y-4 sm:space-y-4.5">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <StaggerItem key={item.id}>
                <div
                  data-dynamic-type="faq"
                  data-dynamic-id={item.id}
                  data-dynamic-title={item.question}
                  className="bg-[#091734] border border-blue-900/40 rounded-xl sm:rounded-2xl transition-all duration-200 overflow-hidden hover:border-blue-700/50 card-elevate card-hover animate-slide-up"
                >
                {/* Accordion Header Button */}
                <button
                  type="button"
                  onClick={() => toggleItem(index)}
                  className="w-full py-4 sm:py-5 px-5 sm:px-7 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors duration-200"
                  aria-expanded={isOpen}
                >
                  <span
                    className={`text-sm sm:text-base font-bold tracking-wide transition-colors duration-200 ${
                      isOpen
                        ? 'text-[#1762f0]'
                        : 'text-white hover:text-blue-300'
                    }`}
                  >
                    {item.question}
                  </span>

                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-[#1762f0]">
                    {isOpen ? (
                      <Minus className="w-5 h-5 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    )}
                  </span>
                </button>

                {/* Animated Accordion Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-7 pb-5 sm:pb-6 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed font-normal">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              </StaggerItem>
            )
          })}
        </StaggerContainer>
      </div>
    </section>
  )
}

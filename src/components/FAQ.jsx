import React, { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQ() {
  // Item 2 (index 1) is expanded by default to match the reference design
  const [openIndex, setOpenIndex] = useState(1)

  const faqItems = [
    {
      id: 1,
      question: 'What is the highest ball speed these guards can handle?',
      answer:
        'Our guards are rigorously lab-tested and match-certified against hard season leather cricket balls delivered at speeds in excess of 160+ km/h (99+ mph), offering maximum impact dispersion and shock absorption.'
    },
    {
      id: 2,
      question: 'Can I use the outer guard without the inner guard?',
      answer:
        'Yes, all our guards are modular. You can wear the Carbon Flex outer guard independently for practice or combine it with the Aero Inner for full match protection.'
    },
    {
      id: 3,
      question: 'How do I choose between Right-Handed and Left-Handed?',
      answer:
        'Right-handed batsmen wear the primary outer guard on their left (front) thigh facing the bowler, while left-handed batsmen wear it on their right thigh. Select your batting stance during checkout to get the anatomically contoured fit.'
    },
    {
      id: 4,
      question: 'What is your warranty policy for strap breakage?',
      answer:
        'We offer a 1-year comprehensive replacement guarantee on all straps, elastic bands, and velcro closures. If your straps experience any fraying or breakage under match conditions, we replace them free of charge.'
    }
  ]

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative w-full bg-[#060a12] py-20 lg:py-28 px-4 sm:px-6 lg:px-8 text-white border-t border-slate-900/60 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-blue-600/5 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Heading */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white text-center tracking-tight mb-12 sm:mb-14">
          Frequently Asked Questions
        </h2>

        {/* Accordion Layout */}
        <div className="space-y-4 sm:space-y-4.5">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={item.id}
                className="bg-[#091734] border border-blue-900/40 rounded-xl sm:rounded-2xl transition-colors duration-200 overflow-hidden hover:border-blue-700/50"
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
            )
          })}
        </div>
      </div>
    </section>
  )
}

import { supabase } from '../../lib/supabaseClient'

export const FAQS_STORAGE_KEY = 'armourcraft_faqs_v1'

export const initialFaqs = [
  {
    id: 'faq-1',
    question: 'What materials are used in ArmourCraft thigh guards?',
    answer:
      'Our gear uses high-density EVA foam combined with reinforced carbon-fiber shells for maximum impact protection without extra weight.'
  },
  {
    id: 'faq-2',
    question: 'How do I choose between Right-Handed and Left-Handed sizing?',
    answer:
      'Right-handed batsmen wear the primary outer guard on their left (front) thigh facing the bowler, while left-handed batsmen wear it on their right thigh. Select your batting stance during checkout to get the anatomically contoured fit.'
  },
  {
    id: 'faq-3',
    question: 'What is your shipping and return policy for international orders?',
    answer:
      'We offer express worldwide shipping with tracking on all orders. Standard returns are accepted within 30 days of delivery in unused condition.'
  },
  {
    id: 'faq-4',
    question: 'What is the highest ball speed these guards can handle?',
    answer:
      'Our guards are rigorously lab-tested and match-certified against hard season leather cricket balls delivered at speeds in excess of 160+ km/h (99+ mph), offering maximum impact dispersion and shock absorption.'
  },
  {
    id: 'faq-5',
    question: 'What is your warranty policy for strap breakage?',
    answer:
      'We offer a 1-year comprehensive replacement guarantee on all straps, elastic bands, and velcro closures. If your straps experience any fraying or breakage under match conditions, we replace them free of charge.'
  }
]

export function getStoredFaqs() {
  if (typeof window === 'undefined') return initialFaqs
  try {
    const saved = window.localStorage.getItem(FAQS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.warn('Error reading FAQs from localStorage:', err)
  }
  return initialFaqs
}

export function saveStoredFaqs(faqs) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(FAQS_STORAGE_KEY, JSON.stringify(faqs))
    window.dispatchEvent(new CustomEvent('armourcraft:faqs-updated', { detail: faqs }))
  } catch (err) {
    console.warn('Error saving FAQs to localStorage:', err)
  }
}

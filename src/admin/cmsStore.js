// Comprehensive Visual CMS Store for ARMOURCRAFT AS
import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { rehydrateVideoAsset } from './mediaAssetStore'

export const DEFAULT_CMS_DATA = {
  home: {
    hero: {
      tag: 'NEW 2026 COLLECTION',
      mainHeading: 'Next-Gen Ergonomic Thigh Protection',
      subHeading:
        'Engineered for maximum mobility & impact absorption in every stance. Tested against 160+ km/h deliveries.',
      textColor: '#FFFFFF',
      fontSize: 72,
      ctaLink: '/shop',
      ctaText: 'Explore Collection',
      secondaryCtaText: 'Customize Your Stance',
      secondaryCtaLink: '/contact',
      isHeadingHidden: false,
      isSubHeadingHidden: false,
      isButtonsHidden: false,
      isBold: true,
      isItalic: false,
      alignment: 'left',
      // Media settings
      mediaType: 'image', // 'image' | 'video'
      imageSrc: '/images/batsman_hero.jpg',
      imageOpacity: 90,
      overlayTint: 40,
      blurAmount: 0,
      videoSrc: '/videos/batsman_hero.mp4',
      videoPoster: '/images/batsman_hero.jpg',
      videoAutoplay: true,
      videoLoop: true,
      videoMute: true,
      videoControls: false
    },
    essentials: {
      heading: 'PRO MATCH ESSENTIALS',
      subheading: 'Elite-level protection for competitive cricket.',
      features: [
        { title: 'Sialkot Crafted', desc: 'Handmade with Premium Materials.', icon: 'Hammer' },
        { title: '140+ KM/H Ready', desc: 'Tested Against Hard Season Leather Balls.', icon: 'Zap' },
        { title: '500+ Matches Trusted', desc: 'Used by Club & Academy Cricketers.', icon: 'ShieldCheck' },
        { title: 'Zero Shift Fit', desc: 'Double-Strap Lock for Fast Running.', icon: 'Lock' }
      ]
    },
    advantage: {
      tag: 'THE ARMOURCRAFT ADVANTAGE',
      heading: 'Mastery in Impact Protection',
      desc1: 'Designed for elite performance. Our guards combine advanced, light-weight composite materials with high-density impact absorption foam, ensuring unparalleled thigh protection without compromising mobility on the field.',
      desc2: 'Every guard is meticulously crafted, integrating carbon-fiber weave for rigid strength and dynamic ergonomic contours that flex with your movements, so you can focus entirely on your stance and scoring runs.',
      image1: '/images/advantage_carbon.png',
      image2: '/images/advantage_thigh_guard.png'
    },
    customSquad: {
      heading: 'CUSTOM TEAM GEAR & JERSEY MATCHING',
      subheading: "Elevate your team's look. Professional-grade printing of names, numbers, and club logos directly onto your guards. Matches any team colors.",
      ctaText: 'GET CUSTOM TEAM QUOTE',
      ctaLink: '/contact',
      image: '/images/custom_pads.png',
      mediaType: 'image',
      videoSrc: ''
    },
    comparison: {
      heading: 'SmartThighs vs. The Others',
      subheading: 'Discover why modern cricketers are abandoning bulky traditional pads.'
    },
    showcase: {
      heading: 'BROWSE THE SMART COLLECTION',
      subheading: 'High impact protection designed for modern cricket.'
    },
    testimonials: {
      heading: 'TRUSTED BY 10,000+ BATSMEN',
      subheading: 'Verified match reviews from professional and club cricketers.'
    },
    faq: {
      heading: 'Frequently Asked Questions',
      subheading: 'Everything you need to know about sizing, ballistic testing, and shipping.'
    },
    footer: {
      brandDesc: 'Handcrafted in Sialkot, Pakistan. Engineered for the fastest bowling on earth.',
      newsletterTitle: 'JOIN THE BATSMAN CLUB',
      newsletterDesc: 'Get gear release announcements, exclusive factory discounts, and ballistics lab insights.',
      copyright: '© 2026 ARMOURCRAFT AS. All rights reserved.'
    }
  },
  shop: {
    heading: 'ALL PROTECTION GEAR',
    subheading: 'Simple, lightweight, and pro-tested cricket pads engineered for maximum comfort and elite performance.',
    bannerImage: '/images/batsman_hero.jpg'
  },
  whatWeAre: {
    tag: 'WHAT WE ARE',
    heading: 'CRAFTED FOR IMPACT. ENGINEERED FOR SPEED.',
    subheading: 'ArmourCraft is not just an equipment brand. We are a cricket protection lab dedicated to eliminating bulk and maximizing batsman mobility.',
    heroImage: '/images/what_we_are_craftsmanship.jpg'
  },
  blog: {
    heading: 'CRICKET ENGINEERING INSIGHTS',
    subheading: 'Expert research, ballistics impact testing, and cricket protection lab reports.',
    latestInsightsHeading: 'LATEST INSIGHTS',
    heroImage: '/images/blog_ballistic_test.jpg'
  },
  contact: {
    heading: "WE'RE HERE TO KEEP YOU PROTECTED.",
    subheading: 'Have a question about sizing, order tracking, or custom team printing? Reach out to us—we usually reply within a few hours.',
    bannerImage: '/images/custom_guard_number_07.jpg'
  }
}

// -----------------------------------------------------------------------------
// STRICT DRAFT VS. LIVE PUBLISHING STORAGE KEYS
// -----------------------------------------------------------------------------
export const DRAFT_STORAGE_KEY = 'armourcraft_cms_draft'
export const PUBLISHED_STORAGE_KEY = 'armourcraft_cms_published'

// React Context to control whether components read Draft or Live Published CMS data
export const CmsContext = createContext({ isDraft: false })

export function CmsProvider({ isDraft = false, children }) {
  return React.createElement(CmsContext.Provider, { value: { isDraft } }, children)
}

// Helper to deep-merge data with DEFAULT_CMS_DATA
function mergeWithDefaults(parsed) {
  if (!parsed || typeof parsed !== 'object') return DEFAULT_CMS_DATA
  return {
    ...DEFAULT_CMS_DATA,
    ...parsed,
    home: {
      ...DEFAULT_CMS_DATA.home,
      ...(parsed.home || {}),
      hero: {
        ...DEFAULT_CMS_DATA.home.hero,
        ...(parsed.home?.hero || {})
      },
      essentials: {
        ...DEFAULT_CMS_DATA.home.essentials,
        ...(parsed.home?.essentials || {})
      },
      advantage: {
        ...DEFAULT_CMS_DATA.home.advantage,
        ...(parsed.home?.advantage || {})
      },
      customSquad: {
        ...DEFAULT_CMS_DATA.home.customSquad,
        ...(parsed.home?.customSquad || {})
      },
      footer: {
        ...DEFAULT_CMS_DATA.home.footer,
        ...(parsed.home?.footer || {})
      }
    },
    shop: {
      ...DEFAULT_CMS_DATA.shop,
      ...(parsed.shop || {})
    },
    whatWeAre: {
      ...DEFAULT_CMS_DATA.whatWeAre,
      ...(parsed.whatWeAre || {})
    },
    blog: {
      ...DEFAULT_CMS_DATA.blog,
      ...(parsed.blog || {})
    },
    contact: {
      ...DEFAULT_CMS_DATA.contact,
      ...(parsed.contact || {})
    }
  }
}

// In-memory caches to guarantee UI responsiveness even if localStorage is restricted
let inMemoryDraftCache = null
let inMemoryPublishedCache = null

/**
 * Sanitize deep CMS data before writing to localStorage to prevent QuotaExceededError
 * Strips huge raw data:video/base64 strings if present, preserving asset IDs and URLs
 */
function sanitizeForLocalStorage(obj, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 8) return obj
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeForLocalStorage(item, depth + 1))
  }
  const copy = {}
  for (const [key, val] of Object.entries(obj)) {
    if (typeof val === 'string' && val.startsWith('data:video/') && val.length > 50000) {
      // Large video data URL stripped from localStorage; will be preserved in memory & IndexedDB
      copy[key] = ''
    } else if (typeof val === 'object' && val !== null) {
      copy[key] = sanitizeForLocalStorage(val, depth + 1)
    } else {
      copy[key] = val
    }
  }
  return copy
}

/**
 * 1. GET PUBLISHED CMS DATA (LIVE USER STOREFRONT)
 * Strictly returns live published data. Never contains uncommitted draft edits.
 */
export function getPublishedCmsData() {
  if (typeof window === 'undefined') return DEFAULT_CMS_DATA
  if (inMemoryPublishedCache) return inMemoryPublishedCache
  try {
    const raw = localStorage.getItem(PUBLISHED_STORAGE_KEY)
    if (raw) {
      const parsed = mergeWithDefaults(JSON.parse(raw))
      inMemoryPublishedCache = parsed
      return parsed
    }
  } catch (e) {
    console.warn('Error reading published CMS data:', e)
  }
  inMemoryPublishedCache = DEFAULT_CMS_DATA
  return DEFAULT_CMS_DATA
}

/**
 * 2. GET WORKING DRAFT CMS DATA (ADMIN WORKSPACE & CANVAS PREVIEW)
 * Returns the active uncommitted working draft.
 * If no draft exists yet, initializes it from the currently published state.
 */
export function getDraftCmsData() {
  if (typeof window === 'undefined') return DEFAULT_CMS_DATA
  if (inMemoryDraftCache) return inMemoryDraftCache
  try {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY)
    if (raw) {
      const parsed = mergeWithDefaults(JSON.parse(raw))
      inMemoryDraftCache = parsed
      return parsed
    }
    // Initialize draft from published data if none exists
    const published = getPublishedCmsData()
    saveDraftCmsData(published)
    inMemoryDraftCache = published
    return published
  } catch (e) {
    console.warn('Error reading draft CMS data:', e)
  }
  inMemoryDraftCache = DEFAULT_CMS_DATA
  return DEFAULT_CMS_DATA
}

// Backward-compatibility alias: in admin contexts getCmsData() returns draft
export function getCmsData() {
  return getDraftCmsData()
}

/**
 * 3. SAVE WORKING DRAFT STATE (LOCAL ONLY)
 * Strictly writes to local draft store and notifies the preview canvas.
 * DOES NOT write to Supabase. DOES NOT update live user storefront.
 */
export function saveDraftCmsData(data) {
  if (typeof window === 'undefined') return
  inMemoryDraftCache = data

  // 1. Dispatch update event FIRST to trigger immediate React UI reconciliation in 0ms
  try {
    window.dispatchEvent(new CustomEvent('armourcraft_cms_draft_updated', { detail: data }))
  } catch (e) {
    console.warn('Event dispatch warning:', e)
  }

  // 2. Persist to localStorage safely in background
  try {
    const safeData = sanitizeForLocalStorage(data)
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(safeData))
  } catch (e) {
    console.warn('LocalStorage draft write warning:', e)
  }
}

/**
 * 4. INLINE INSPECTOR FIELD UPDATE
 * Updates an uncommitted draft field only.
 */
export function updateCmsField(path, value) {
  if (typeof window === 'undefined') return DEFAULT_CMS_DATA
  const current = JSON.parse(JSON.stringify(getDraftCmsData()))
  if (!path) return current
  const keys = path.split('.')
  let target = current
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]
    if (!target[k] || typeof target[k] !== 'object') {
      target[k] = {}
    }
    target = target[k]
  }
  target[keys[keys.length - 1]] = value
  saveDraftCmsData(current)
  return current
}

/**
 * 4B. ATOMIC BATCH FIELD UPDATE
 * Updates multiple draft fields in a single atomic pass, eliminating redundant re-renders and writes
 */
export function updateCmsFields(fieldMap) {
  if (typeof window === 'undefined') return DEFAULT_CMS_DATA
  const current = JSON.parse(JSON.stringify(getDraftCmsData()))
  if (!fieldMap || typeof fieldMap !== 'object') return current

  Object.entries(fieldMap).forEach(([path, value]) => {
    if (!path) return
    const keys = path.split('.')
    let target = current
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!target[k] || typeof target[k] !== 'object') {
        target[k] = {}
      }
      target = target[k]
    }
    target[keys[keys.length - 1]] = value
  })

  saveDraftCmsData(current)
  return current
}

/**
 * 5. TOP HEADER PUBLISH BUTTON WORKFLOW
 * Commits the working draft to the live published state and syncs to Supabase.
 */
export async function publishCmsData(data) {
  const toPublish = data || getDraftCmsData()
  if (typeof window === 'undefined') return true

  inMemoryPublishedCache = toPublish
  inMemoryDraftCache = toPublish

  try {
    // 1. Commit to live published localStorage
    try {
      const safeData = sanitizeForLocalStorage(toPublish)
      localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(safeData))
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(safeData))
    } catch (lsErr) {
      console.warn('Publish localStorage warning:', lsErr)
    }

    // 2. Commit to Supabase cms_content table
    if (supabase && typeof supabase.from === 'function') {
      try {
        const payloadToSync = sanitizeForLocalStorage(toPublish)
        await supabase.from('cms_content').upsert([
          {
            key: 'landing_cms_data',
            data: payloadToSync,
            updated_at: new Date().toISOString()
          }
        ], { onConflict: 'key' })
      } catch (sErr) {
        console.warn('Supabase publish cms_content notice:', sErr)
      }
    }

    // 3. Dispatch published event for all active storefront listeners
    window.dispatchEvent(new CustomEvent('armourcraft_cms_published', { detail: toPublish }))
    return true
  } catch (e) {
    console.error('Error publishing CMS data:', e)
    return false
  }
}

/**
 * 6. DISCARD DRAFT CHANGES
 * Reverts the working draft back to the last published state.
 */
export function discardDraftCmsData() {
  const published = getPublishedCmsData()
  saveDraftCmsData(published)
  return published
}

/**
 * 7. RESET ALL CMS DATA TO SYSTEM DEFAULTS
 */
export function resetCmsData() {
  inMemoryDraftCache = DEFAULT_CMS_DATA
  inMemoryPublishedCache = DEFAULT_CMS_DATA
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY)
      localStorage.removeItem(PUBLISHED_STORAGE_KEY)
      window.dispatchEvent(new CustomEvent('armourcraft_cms_draft_updated', { detail: DEFAULT_CMS_DATA }))
      window.dispatchEvent(new CustomEvent('armourcraft_cms_published', { detail: DEFAULT_CMS_DATA }))
    } catch (e) {}
  }
  return DEFAULT_CMS_DATA
}

/**
 * 8. SYNC PUBLISHED DATA FROM SUPABASE
 * Called on public customer app initialization to ensure live sync with cloud database.
 */
export async function syncPublishedCmsFromSupabase() {
  if (typeof window === 'undefined' || !supabase || typeof supabase.from !== 'function') return null
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('data')
      .eq('key', 'landing_cms_data')
      .single()

    if (!error && data?.data) {
      const merged = mergeWithDefaults(data.data)
      inMemoryPublishedCache = merged
      try {
        localStorage.setItem(PUBLISHED_STORAGE_KEY, JSON.stringify(sanitizeForLocalStorage(merged)))
      } catch (e) {}
      window.dispatchEvent(new CustomEvent('armourcraft_cms_published', { detail: merged }))
      return merged
    }
  } catch (e) {
    console.info('Storefront Supabase CMS sync notice:', e?.message || e)
  }
  return null
}

/**
 * 9. REACTIVE useCmsContent HOOK
 * Automatically switches between Draft (inside Preview Canvas / Admin) and Live Published (Storefront).
 * Rehydrates video asset references if blob URLs expired.
 */
export function useCmsContent(path, defaultValue) {
  const context = useContext(CmsContext)
  // Determine if in Draft mode: either explicitly in CmsContext, or inside admin path
  const isDraftMode = Boolean(
    context?.isDraft ||
    (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'))
  )

  const resolveValue = (data) => {
    if (!path) return data
    const keys = path.split('.')
    let current = data
    for (const k of keys) {
      if (current === undefined || current === null) return defaultValue
      current = current[k]
    }
    return current !== undefined ? current : defaultValue
  }

  const [value, setValue] = useState(() => {
    const sourceData = isDraftMode ? getDraftCmsData() : getPublishedCmsData()
    return resolveValue(sourceData)
  })

  // Re-hydrate video asset if applicable
  useEffect(() => {
    if (value && typeof value === 'object' && value.videoAssetId && (!value.videoSrc || value.videoSrc.startsWith('blob:'))) {
      rehydrateVideoAsset(value.videoAssetId, value.videoSrc).then((freshUrl) => {
        if (freshUrl && freshUrl !== value.videoSrc) {
          setValue((prev) => (prev && typeof prev === 'object' ? { ...prev, videoSrc: freshUrl } : prev))
        }
      })
    }
  }, [value])

  useEffect(() => {
    const handleUpdate = () => {
      const sourceData = isDraftMode ? getDraftCmsData() : getPublishedCmsData()
      setValue(resolveValue(sourceData))
    }

    // In Draft mode, listen for working draft updates
    if (isDraftMode) {
      window.addEventListener('armourcraft_cms_draft_updated', handleUpdate)
    }
    // In all modes, listen for published updates
    window.addEventListener('armourcraft_cms_published', handleUpdate)

    return () => {
      if (isDraftMode) {
        window.removeEventListener('armourcraft_cms_draft_updated', handleUpdate)
      }
      window.removeEventListener('armourcraft_cms_published', handleUpdate)
    }
  }, [path, defaultValue, isDraftMode])

  return value
}

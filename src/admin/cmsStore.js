// Comprehensive Visual CMS Store for ARMOURCRAFT AS
import { useState, useEffect } from 'react'

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
      videoSrc: '',
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
      mediaType: 'image'
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

const STORAGE_KEY = 'armourcraft_cms_data'

export function getCmsData() {
  if (typeof window === 'undefined') return DEFAULT_CMS_DATA
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
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
  } catch (e) {
    console.warn('Error reading CMS data from localStorage:', e)
  }
  return DEFAULT_CMS_DATA
}

export function updateCmsField(path, value) {
  if (typeof window === 'undefined') return DEFAULT_CMS_DATA
  const current = getCmsData()
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
  saveCmsData(current)
  return current
}

export function getPublishedCmsData() {
  if (typeof window === 'undefined') return DEFAULT_CMS_DATA
  try {
    const pub = localStorage.getItem('armourcraft_cms_published')
    if (pub) {
      return JSON.parse(pub)
    }
  } catch {}
  return getCmsData()
}

export function saveCmsData(data) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent('armourcraft_cms_updated', { detail: data }))
  } catch (e) {
    console.error('Error saving CMS data:', e)
  }
}

export function publishCmsData(data) {
  const toSave = data || getCmsData()
  saveCmsData(toSave)
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('armourcraft_cms_published', JSON.stringify(toSave))
      window.dispatchEvent(new CustomEvent('armourcraft_cms_published', { detail: toSave }))
    } catch (e) {}
  }
  return true
}

export function resetCmsData() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem('armourcraft_cms_published')
      window.dispatchEvent(new CustomEvent('armourcraft_cms_updated', { detail: DEFAULT_CMS_DATA }))
    } catch (e) {}
  }
  return DEFAULT_CMS_DATA
}

// Custom React hook for live real-time CMS content sync
export function useCmsContent(path, defaultValue) {
  const [value, setValue] = useState(() => {
    const data = getCmsData()
    if (!path) return data
    const keys = path.split('.')
    let current = data
    for (const k of keys) {
      if (current === undefined || current === null) return defaultValue
      current = current[k]
    }
    return current !== undefined ? current : defaultValue
  })

  useEffect(() => {
    const handleUpdate = () => {
      const data = getCmsData()
      if (!path) {
        setValue(data)
        return
      }
      const keys = path.split('.')
      let current = data
      for (const k of keys) {
        if (current === undefined || current === null) {
          setValue(defaultValue)
          return
        }
        current = current[k]
      }
      setValue(current !== undefined ? current : defaultValue)
    }

    window.addEventListener('armourcraft_cms_updated', handleUpdate)
    window.addEventListener('armourcraft_cms_published', handleUpdate)
    return () => {
      window.removeEventListener('armourcraft_cms_updated', handleUpdate)
      window.removeEventListener('armourcraft_cms_published', handleUpdate)
    }
  }, [path, defaultValue])

  return value
}


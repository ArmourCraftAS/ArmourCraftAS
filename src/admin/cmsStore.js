// Visual CMS Store for ARMOURCRAFT AS
export const DEFAULT_CMS_DATA = {
  home: {
    hero: {
      tag: 'ELITE PERFORMANCE',
      mainHeading: 'Next-Gen Ergonomic Thigh Protection',
      subHeading:
        'Engineered for maximum mobility & impact absorption in every stroke. Trusted against 150+ km/h deliveries.',
      textColor: '#FFFFFF',
      fontSize: 48,
      ctaLink: '/shop-armours',
      ctaText: 'Explore Collection',
      secondaryCtaText: 'Customize Your Gear',
      secondaryCtaLink: '/contact',
      isHeadingHidden: false,
      isSubHeadingHidden: false,
      isButtonsHidden: false,
      isBold: true,
      isItalic: false,
      alignment: 'left',
      // Media settings matching image_99e1d9.png & image_99e2d9.png
      mediaType: 'image', // 'image' | 'video'
      imageSrc: '/images/nextgen_batsman_helmet.jpg',
      imageOpacity: 100,
      overlayTint: 40,
      blurAmount: 0,
      videoSrc: 'https://assets.armourcraft.io/static/batsman_hero.mp4',
      videoPoster: '/images/nextgen_batsman_helmet.jpg',
      videoAutoplay: true,
      videoLoop: true,
      videoMute: true,
      videoControls: false
    },
    essentials: {
      heading: 'PRO MATCH ESSENTIALS',
      subheading: 'Ballistic-tested thigh guards engineered in Sialkot for modern power hitting.'
    },
    advantage: {
      heading: 'THE ARMOURCRAFT ADVANTAGE',
      subheading: 'Engineered with Multi-Density EVA and Carbon Matrix technology.'
    }
  },
  shop: {
    heading: 'SHOP PRO CRICKET PROTECTION',
    subheading: 'Handcrafted ergonomic cricket armours engineered for batsmen facing 150+ km/h deliveries.'
  },
  whatWeAre: {
    heading: 'CRICKET PROTECTION LAB',
    subheading: 'Centuries of Sialkot craftsmanship fused with modern ballistic engineering.'
  },
  blog: {
    heading: 'CRICKET ENGINEERING INSIGHTS',
    subheading: 'Expert research, ballistics impact testing, and cricket protection lab reports.'
  },
  contact: {
    heading: 'CUSTOM GEAR & SQUAD INQUIRIES',
    subheading: 'Request bespoke team thigh guards, personalized player numbers, and academy gear.'
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
          }
        }
      }
    }
  } catch (e) {
    console.warn('Error reading CMS data from localStorage:', e)
  }
  return DEFAULT_CMS_DATA
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
  saveCmsData(data)
  // Also store to publish key for live site synchronization
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('armourcraft_cms_published', JSON.stringify(data))
      window.dispatchEvent(new CustomEvent('armourcraft_cms_published', { detail: data }))
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

// Comprehensive Visual CMS Store for ARMOURCRAFT AS
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
      // Media settings
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
      subheading: 'Ballistic-tested thigh guards engineered in Sialkot for modern power hitting.',
      products: [
        {
          id: 'p1',
          title: 'ADVANTAGE CARBON DUAL GUARD',
          price: '$169.00',
          badge: 'BESTSELLER',
          image: '/images/advantage_carbon.png',
          mediaType: 'image',
          desc: 'Ultra-light carbon matrix inner and outer thigh protection with dual ergonomic straps.'
        },
        {
          id: 'p2',
          title: 'PRO SPLIT THIGH GUARD COMBO',
          price: '$145.00',
          badge: 'MATCH DAY READY',
          image: '/images/advantage_thigh_guard.png',
          mediaType: 'image',
          desc: 'High-density multi-cell EVA foam dissipating ball speeds up to 160+ km/h.'
        },
        {
          id: 'p3',
          title: 'AERODYNAMIC INNER THIGH SHIELD',
          price: '$89.00',
          badge: 'AERODYNAMIC',
          image: '/images/product_inner_guard.png',
          mediaType: 'image',
          desc: 'Contoured low-profile inner protector ensuring zero restriction during quick singles.'
        },
        {
          id: 'p4',
          title: 'YOUTH ACADEMY ARMOUR SHIELD',
          price: '$79.00',
          badge: 'YOUTH SPECIAL',
          image: '/images/product_youth_guard.png',
          mediaType: 'image',
          desc: 'Tournament certified junior protection designed for emerging academy batsmen.'
        }
      ]
    },
    advantage: {
      heading: 'THE ARMOURCRAFT ADVANTAGE',
      subheading: 'Engineered with Multi-Density EVA and Carbon Matrix technology.',
      cards: [
        {
          id: 'adv1',
          title: '160+ KM/H BALLISTIC ABSORPTION',
          desc: 'Multi-layer composite structure disperses lethal impact energy across 240 square centimeters.',
          image: '/images/what_we_are_lab_testing.jpg',
          mediaType: 'image'
        },
        {
          id: 'adv2',
          title: 'DUAL-STRAP ERGONOMIC LOCK',
          desc: 'Custom medical-grade elastic webbing prevents slipping during explosive sprint changes of direction.',
          image: '/images/blog_thigh_strapping.jpg',
          mediaType: 'image'
        },
        {
          id: 'adv3',
          title: 'FEATHERWEIGHT 185G FORM FACTOR',
          desc: 'Eliminates bulky traditional padding while multiplying front-quad safety by 3.4x.',
          image: '/images/what_we_are_carbon_grid.jpg',
          mediaType: 'image'
        }
      ]
    },
    customSquad: {
      heading: 'CUSTOM SQUAD GEAR & SPONSOR LOGOS',
      subheading: 'Outfit your entire academy or club squad with bespoke color palettes and squad numbering.',
      ctaText: 'Request Custom Squad Quote →',
      ctaLink: '/contact',
      image: '/images/custom_guard_team_logo.jpg',
      mediaType: 'image'
    },
    comparison: {
      heading: 'SMARTTHIGHS VS TRADITIONAL GEAR',
      subheading: 'Discover why modern international players are abandoning bulky cotton pads.'
    },
    showcase: {
      heading: 'BROWSE THE SMART ARMOUR COLLECTION',
      subheading: 'Handcrafted protection tuned for the demanding speeds of modern T20 and Test cricket.'
    },
    testimonials: {
      heading: 'TRUSTED BY 10,000+ BATSMEN GLOBALLY',
      subheading: 'Verified match reviews from professional county and premier league cricketers.'
    },
    faq: {
      heading: 'FREQUENTLY ASKED QUESTIONS',
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
    heading: 'SHOP PRO CRICKET PROTECTION',
    subheading: 'Handcrafted ergonomic cricket armours engineered for batsmen facing 150+ km/h deliveries.',
    bannerImage: '/images/batsman_hero.jpg'
  },
  whatWeAre: {
    heading: 'CRICKET PROTECTION LAB',
    subheading: 'Centuries of Sialkot craftsmanship fused with modern ballistic engineering.',
    heroImage: '/images/what_we_are_craftsmanship.jpg'
  },
  blog: {
    heading: 'CRICKET ENGINEERING INSIGHTS',
    subheading: 'Expert research, ballistics impact testing, and cricket protection lab reports.',
    heroImage: '/images/blog_ballistic_test.jpg'
  },
  contact: {
    heading: 'CUSTOM GEAR & SQUAD INQUIRIES',
    subheading: 'Request bespoke team thigh guards, personalized player numbers, and academy gear.',
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

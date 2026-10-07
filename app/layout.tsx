import React from 'react'
import Navbar from '../src/components/Navbar'
import Footer from '../src/components/Footer'
import '../src/index.css'

export const metadata = {
  metadataBase: new URL('https://armourcraftas.vercel.app'),
  title: 'ARMOURCRAFT AS | Next-Gen Ergonomic Cricket Protection & Thigh Guards',
  description:
    'Engineered for elite performance. ARMOURCRAFT AS delivers ultra-lightweight, high-impact custom cricket thigh guards and protective gear tested against 160+ km/h deliveries.',
  keywords: [
    'cricket thigh guards',
    'custom cricket armours',
    'pro cricket protection',
    'ergonomic thigh guards',
    'cricket gloves',
    'ARMOURCRAFT AS',
    'lightweight cricket protection',
    'cricket batting pads',
    'Sialkot cricket equipment'
  ],
  authors: [{ name: 'ARMOURCRAFT AS' }],
  creator: 'ARMOURCRAFT AS',
  publisher: 'ARMOURCRAFT AS',
  alternates: {
    canonical: 'https://armourcraftas.vercel.app'
  },
  openGraph: {
    title: 'ARMOURCRAFT AS | Next-Gen Ergonomic Cricket Protection & Thigh Guards',
    description:
      'Engineered for elite performance. ARMOURCRAFT AS delivers ultra-lightweight, high-impact custom cricket thigh guards and protective gear tested against 160+ km/h deliveries.',
    url: 'https://armourcraftas.vercel.app',
    siteName: 'ARMOURCRAFT AS',
    images: [
      {
        url: 'https://armourcraftas.vercel.app/images/og_banner.png',
        width: 1200,
        height: 630,
        alt: 'ARMOURCRAFT AS Pro Cricket Armor & Thigh Guards'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ARMOURCRAFT AS | Next-Gen Ergonomic Cricket Protection & Thigh Guards',
    description:
      'Engineered for elite performance. ARMOURCRAFT AS delivers ultra-lightweight, high-impact custom cricket thigh guards and protective gear tested against 160+ km/h deliveries.',
    images: ['https://armourcraftas.vercel.app/images/og_banner.png'],
    creator: '@ArmourCraftAS'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  }
}

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://armourcraftas.vercel.app/#organization',
      name: 'ARMOURCRAFT AS',
      url: 'https://armourcraftas.vercel.app',
      logo: 'https://armourcraftas.vercel.app/images/logo_clean.png',
      image: 'https://armourcraftas.vercel.app/images/og_banner.png',
      description:
        'Engineered for elite performance. Sialkot-crafted custom cricket thigh guards and high-density protective gear.',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Sialkot',
        addressCountry: 'PK'
      }
    },
    {
      '@type': 'Product',
      '@id': 'https://armourcraftas.vercel.app/shop#pro-dual-thigh',
      name: 'Pro Dual-Leg Thigh Guard Set',
      image: 'https://armourcraftas.vercel.app/images/product_thigh_guard.png',
      description:
        'Elite ergonomic dual-leg cricket thigh protection engineered to withstand 160+ km/h leather ball deliveries.',
      brand: {
        '@type': 'Brand',
        name: 'ARMOURCRAFT AS'
      },
      offers: {
        '@type': 'Offer',
        url: 'https://armourcraftas.vercel.app/shop',
        priceCurrency: 'USD',
        price: '79.99',
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '128'
      }
    }
  ]
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://armourcraftas.vercel.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="min-h-screen bg-[#060a12] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
        {/* Global Persistent Header / Navbar */}
        <Navbar cartCount={0} />

        {/* Dynamic Page Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Global Persistent Footer */}
        <Footer />
      </body>
    </html>
  )
}

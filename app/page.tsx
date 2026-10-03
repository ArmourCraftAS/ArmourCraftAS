'use client'

import React, { useState } from 'react'
import Hero from '../src/components/Hero'
import ProMatchEssentials from '../src/components/ProMatchEssentials'
import ArmourAdvantage from '../src/components/ArmourAdvantage'
import CustomGearBanner from '../src/components/CustomGearBanner'
import ComparisonTable from '../src/components/ComparisonTable'
import SmartCollection from '../src/components/SmartCollection'
import Testimonials from '../src/components/Testimonials'
import FAQ from '../src/components/FAQ'

export default function Home() {
  const [cartCount, setCartCount] = useState(2)

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1)
  }

  return (
    <>
      <Hero />
      <ProMatchEssentials onAddToCart={handleAddToCart} />
      <ArmourAdvantage />
      <CustomGearBanner />
      <ComparisonTable />
      <SmartCollection onAddToCart={handleAddToCart} />
      <Testimonials />
      <FAQ />
    </>
  )
}

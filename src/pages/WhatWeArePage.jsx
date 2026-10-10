import React from 'react'
import { Shield, Zap, Gem } from 'lucide-react'
import NextGenFeatureBanner from '../components/NextGenFeatureBanner'
import { useCmsContent } from '../admin/cmsStore'
import CmsMedia, { isVideoAsset } from '../components/CmsMedia'

export default function WhatWeArePage({ onNavigate }) {
  const tag = useCmsContent('whatWeAre.tag', 'WHAT WE ARE')
  const heading = useCmsContent('whatWeAre.heading', 'CRAFTED FOR IMPACT. ENGINEERED FOR SPEED.')
  const subheading = useCmsContent('whatWeAre.subheading', 'ArmourCraft is not just an equipment brand. We are a cricket protection lab dedicated to eliminating bulk and maximizing batsman mobility.')
  const heroImage = useCmsContent('whatWeAre.heroImage', '/images/what_we_are_craftsmanship.jpg')
  const heroImageProps = useCmsContent('whatWeAre.heroImageProps', null)

  const isVideo = heroImageProps?.mediaType === 'video' || isVideoAsset(heroImage, heroImageProps?.mediaType) || isVideoAsset(heroImageProps?.videoSrc, heroImageProps?.mediaType)
  const activeVideo = heroImageProps?.videoSrc || (isVideo ? (typeof heroImage === 'string' ? heroImage : '') : '')
  const activeImg = (typeof heroImage === 'string' && !isVideoAsset(heroImage)) ? heroImage : (heroImageProps?.src || '/images/what_we_are_craftsmanship.jpg')

  return (
    <>
      <div className="w-full bg-[#060a12] text-white min-h-[calc(100vh-80px)] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* ========================================================================= */}
        {/* 1. HERO HEADER SECTION                                                    */}
        {/* ========================================================================= */}
        <div className="text-center max-w-4xl mx-auto mb-16 sm:mb-20 lg:mb-24">
          
          {/* Top Pill Badge */}
          <div
            data-cms-path="whatWeAre.tag"
            data-cms-label="What We Are Tag"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d162a] border border-blue-500/30 shadow-sm shadow-blue-500/20 backdrop-blur-md mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-bold tracking-widest text-blue-300 uppercase">
              {tag}
            </span>
          </div>

          {/* Main Heading */}
          <h1
            data-cms-path="whatWeAre.heading"
            data-cms-label="What We Are Heading"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-[1.08] mb-6"
          >
            {heading}
          </h1>

          {/* Subheading Text */}
          <p
            data-cms-path="whatWeAre.subheading"
            data-cms-label="What We Are Subtitle"
            className="text-slate-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed font-normal"
          >
            {subheading}
          </p>

        </div>

        {/* ========================================================================= */}
        {/* 2. CONTENT & IMAGE COLLAGE GRID SECTION                                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center mb-20 lg:mb-28">
          
          {/* Left Side: 3-Image Collage Grid */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4 sm:gap-6 items-stretch">
              
              {/* Tall Vertical Image (Textured Carbon/Foam Craftsmanship) */}
              <div className="relative rounded-2xl overflow-hidden bg-[#090f1e] border border-slate-800/80 shadow-2xl group transition-all duration-300 hover:border-blue-500/40">
                <CmsMedia
                  src={activeImg}
                  videoSrc={activeVideo}
                  videoAssetId={heroImageProps?.videoAssetId}
                  mediaType={isVideo ? 'video' : 'image'}
                  alt="High-density EVA foam and carbon craftsmanship"
                  poster={heroImageProps?.poster || activeImg}
                  autoPlay={heroImageProps?.autoplay !== false}
                  loop={heroImageProps?.loop !== false}
                  muted={heroImageProps?.muted !== false}
                  controls={heroImageProps?.controls !== undefined ? heroImageProps?.controls : true}
                  cmsPath="whatWeAre.heroImage"
                  cmsLabel="What We Are Craftsmanship Image"
                  className="w-full h-full min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                    Contoured Foam Architecture
                  </span>
                </div>
              </div>

              {/* Stacked Images Column */}
              <div className="flex flex-col gap-4 sm:gap-6 justify-between">
                
                {/* Top Stacked Image (Woven Carbon Fiber Grid Texture) */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#090f1e] border border-slate-800/80 shadow-2xl group transition-all duration-300 hover:border-blue-500/40">
                  <img
                    src="/images/what_we_are_carbon_grid.jpg"
                    alt="Woven carbon fiber composite grid texture"
                    className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                    Aerospace Weave
                  </div>
                </div>

                {/* Bottom Stacked Image (Precision Lab Crafting/Testing Setup) */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#090f1e] border border-slate-800/80 shadow-2xl group transition-all duration-300 hover:border-blue-500/40">
                  <img
                    src="/images/what_we_are_lab_testing.jpg"
                    alt="Precision impact testing and engineering lab setup"
                    className="w-full h-full object-cover select-none group-hover:scale-105 transition-transform duration-500 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Impact Test Rig</span>
                    <span className="text-blue-400 font-mono">160+ KM/H</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Right Side: Text Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            
            {/* Section Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black uppercase text-white tracking-tight leading-[1.1] mb-3">
              THE MODERN <br />
              BATSMAN&apos;S DILEMMA
            </h2>

            {/* Subtle Blue Underline Accent */}
            <div className="w-14 h-1 bg-[#1762f0] rounded-full mb-8 shadow-[0_0_12px_rgba(23,98,240,0.6)]" />

            {/* Paragraph 1 */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              For decades, cricket protection has been a game of compromise. To be safe, you had to be slow. Traditional leather thigh pads were heavy, moisture-absorbent, and notorious for shifting during high-speed runs.
            </p>

            {/* Paragraph 2 */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
              At ArmourCraft, we started with a blank slate. By integrating high-density EVA foam layering and carbon-fiber reinforcement, we engineered ergonomic, zero-shift protection that moves with the athlete, not against them. Our gear is built to withstand the fastest deliveries on earth without weighing down the player who has to face them.
            </p>

          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. OUR CRAFT & PROTECTION SECTION                                         */}
        {/* ========================================================================= */}
        <div className="pt-16 sm:pt-20 border-t border-slate-800/80">
          
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            {/* Pill Badge */}
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#1762f0] text-white shadow-md shadow-blue-600/30 mb-4">
              <span className="text-[11px] font-black uppercase tracking-wider">
                OUR CRAFT &amp; PROTECTION
              </span>
            </div>

            {/* Main Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight text-center">
              BUILT FOR THE REAL GAME
            </h2>
          </div>

          {/* 3-Column Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-6 sm:mb-8">
            
            {/* Card 1: Hard Leather Impact Protection */}
            <div className="bg-[#0b1325] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-blue-500/40 hover:scale-[1.01] group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#091530] border border-blue-500/30 flex items-center justify-center text-[#1762f0] mb-6 shadow-inner group-hover:scale-105 transition-transform">
                  <Shield className="w-5 h-5 fill-[#1762f0]/20 text-[#1762f0]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-snug group-hover:text-blue-300 transition-colors">
                  Hard Leather Impact Protection
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Built using high-density molded EVA foam to absorb fast-bowling impacts. Protects against 140+ km/h leather ball deliveries without deep bruising.
                </p>
              </div>
              <span className="text-[10px] sm:text-[11px] font-black text-[#1762f0] uppercase tracking-widest mt-auto">
                PRO-GRADE SAFETY
              </span>
            </div>

            {/* Card 2: Zero-Shift Running Fit */}
            <div className="bg-[#0b1325] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-blue-500/40 hover:scale-[1.01] group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#091530] border border-blue-500/30 flex items-center justify-center text-[#1762f0] mb-6 shadow-inner group-hover:scale-105 transition-transform">
                  <Zap className="w-5 h-5 fill-[#1762f0]/20 text-[#1762f0]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-snug group-hover:text-blue-300 transition-colors">
                  Zero-Shift Running Fit
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Designed with dual wide-strap Velcro locks that grip securely over trousers. Stays firmly in place while taking quick singles and turning tight doubles.
                </p>
              </div>
              <span className="text-[10px] sm:text-[11px] font-black text-[#1762f0] uppercase tracking-widest mt-auto">
                PERFORMANCE FIT
              </span>
            </div>

            {/* Card 3: Sialkot Master Craftsmanship */}
            <div className="bg-[#0b1325] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-7 sm:p-8 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-blue-500/40 hover:scale-[1.01] group">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#091530] border border-blue-500/30 flex items-center justify-center text-[#1762f0] mb-6 shadow-inner group-hover:scale-105 transition-transform">
                  <Gem className="w-5 h-5 fill-[#1762f0]/20 text-[#1762f0]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-3 leading-snug group-hover:text-blue-300 transition-colors">
                  Sialkot Master Craftsmanship
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-6">
                  Hand-stitched in Sialkot using lightweight, sweat-resistant materials. Eliminates the heavy, bulky feel of traditional leather pads during long innings.
                </p>
              </div>
              <span className="text-[10px] sm:text-[11px] font-black text-[#1762f0] uppercase tracking-widest mt-auto">
                HERITAGE BUILT
              </span>
            </div>

          </div>

          {/* Bottom Stats Bar */}
          <div className="w-full bg-[#0b1325] border border-slate-800/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center text-center">
              
              {/* Stat 1 */}
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-1.5">
                  320g
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Ultra-Light Dual Set</span>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-1.5">
                  140+ KM/H
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Leather Ball Impact Proof</span>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-1.5">
                  Zero Shift
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Double-Strap Lock</span>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="flex flex-col items-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mb-1.5">
                  500+
                </div>
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Local Matches Played</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>

    {/* Feature Highlight: Designed for the Next Generation of Batsmen */}
    <NextGenFeatureBanner />
  </>
  )
}

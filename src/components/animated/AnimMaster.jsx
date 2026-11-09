import React, { useState, useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { Shield, Zap, Sparkles, Activity, Award, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useStorefrontMotion } from '../StorefrontMotion'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const TECH_SPECS = [
  {
    id: 'impact',
    label: 'Impact Dispersion',
    icon: Shield,
    badge: 'BALLISTIC GRADE',
    headline: 'Multi-Stage Deceleration Matrix',
    description:
      'High-density composite dispersion layers absorb and redirect impact energy horizontally across the guard surface, protecting soft tissue from high-velocity cricket deliveries.',
    stats: [
      { label: 'Force Reduction', value: '65%' },
      { label: 'Energy Dissipation', value: '2500N' },
      { label: 'Ball Speed Tested', value: '145+ km/h' }
    ],
    accent: 'from-blue-500 to-cyan-400'
  },
  {
    id: 'weight',
    label: 'Featherlight Core',
    icon: Zap,
    badge: 'AEROSPACE COMPOSITE',
    headline: 'Zero-Burden Weight Optimization',
    description:
      'Engineered with micro-cellular EVA foam and contoured composite plates to deliver elite ballistic protection at less than half the bulk of traditional thigh guards.',
    stats: [
      { label: 'Unit Weight', value: '178g' },
      { label: 'Thickness', value: '12mm' },
      { label: 'Sprint Drag', value: '-40%' }
    ],
    accent: 'from-amber-400 to-rose-500'
  },
  {
    id: 'mobility',
    label: 'Symmetric Ergonomics',
    icon: Activity,
    badge: 'ANATOMICAL CONTOUR',
    headline: 'Adaptive Motion Dynamic Fit',
    description:
      'Bilateral contouring curves naturally with your quadriceps and hip flexors. Running between wickets feels completely unhindered with zero slippage or awkward readjustments.',
    stats: [
      { label: 'Flex Angle', value: '180°' },
      { label: 'Strap Lockdown', value: 'Dual-Flex' },
      { label: 'Creep Shift', value: '0.00 mm' }
    ],
    accent: 'from-emerald-400 to-teal-500'
  }
]

export default function AnimMaster({ className = '', onExplore = () => {} }) {
  const enableMotion = useStorefrontMotion()
  const [activeTab, setActiveTab] = useState(TECH_SPECS[0].id)
  const cardRef = useRef(null)

  // 3D Parallax Tilt Effect with Spring Physics
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 200 }
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig)
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig)

  const handleMouseMove = (e) => {
    if (!enableMotion || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXPos = (e.clientX - rect.left) / width - 0.5
    const mouseYPos = (e.clientY - rect.top) / height - 0.5
    mouseX.set(mouseXPos)
    mouseY.set(mouseYPos)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const currentSpec = TECH_SPECS.find((s) => s.id === activeTab) || TECH_SPECS[0]
  const IconComponent = currentSpec.icon

  return (
    <section
      aria-label="AnimMaster Technology Showcase"
      className={cn(
        'w-full py-12 sm:py-16 lg:py-20 px-3.5 sm:px-6 lg:px-8 bg-[#050811] relative overflow-hidden select-none',
        className
      )}
    >
      {/* Background Animated Gradient Aura */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/4 right-1/4 w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[11px] sm:text-xs font-black uppercase tracking-widest mb-3.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ANIMMASTER PRO ARCHITECTURE</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3">
            Ballistic Engineering in <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">Every Layer</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto font-normal leading-relaxed">
            Interact with our precision-molded dynamic composite technology. Built for opening batsmen confronting express fast bowling.
          </p>
        </div>

        {/* Interactive Filter Pills */}
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 flex-wrap">
          {TECH_SPECS.map((spec) => {
            const isActive = spec.id === activeTab
            const TabIcon = spec.icon
            return (
              <button
                key={spec.id}
                type="button"
                onClick={() => setActiveTab(spec.id)}
                className={cn(
                  'relative flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:text-slate-200 bg-[#0a101f] border border-slate-800 hover:border-slate-700'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="animMasterPill"
                    className="absolute inset-0 rounded-xl bg-[#1d63ed] border border-blue-400/40"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <TabIcon className="w-4 h-4" />
                  <span>{spec.label}</span>
                </span>
              </button>
            )
          })}
        </div>

        {/* 3D Interactive Master Showcase Container */}
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ perspective: 1000 }}
          className="w-full flex items-center justify-center"
        >
          <motion.div
            style={
              enableMotion
                ? {
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d'
                  }
                : {}
            }
            className="w-full rounded-2xl sm:rounded-3xl bg-[#0b1325]/90 border border-slate-800/90 p-5 sm:p-8 lg:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden"
          >
            {/* Top Sheen Shimmer Reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none rounded-3xl" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              {/* Left Column: Spec Details */}
              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] sm:text-xs font-black tracking-wider uppercase mb-3 w-fit">
                  <Award className="w-3.5 h-3.5" />
                  <span>{currentSpec.badge}</span>
                </div>

                <motion.h3
                  key={currentSpec.headline}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-xl sm:text-3xl font-black text-white tracking-tight leading-snug mb-3"
                >
                  {currentSpec.headline}
                </motion.h3>

                <motion.p
                  key={currentSpec.description}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 }}
                  className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6 font-normal"
                >
                  {currentSpec.description}
                </motion.p>

                {/* Animated Stat Badges Grid */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-2 pb-6 border-t border-b border-slate-800/80 mb-6">
                  {currentSpec.stats.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: i * 0.08 }}
                      className="p-2 sm:p-3 rounded-xl bg-[#070b14]/70 border border-slate-800 text-center"
                    >
                      <span className="block text-base sm:text-2xl font-black text-white font-mono leading-tight">
                        {stat.value}
                      </span>
                      <span className="block text-[9px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                        {stat.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Interactive Action Button */}
                <div className="flex items-center gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={onExplore}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1d63ed] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-colors cursor-pointer"
                  >
                    <span>EXPLORE ARMOUR CRAFT TECH</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </motion.button>
                </div>
              </div>

              {/* Right Column: 3D Holographic Visual Card */}
              <div className="lg:col-span-5 flex items-center justify-center">
                <div className="relative w-full aspect-square max-w-[340px] rounded-2xl bg-gradient-to-br from-[#0c162e] to-[#070d1a] border border-blue-500/20 p-6 flex flex-col items-center justify-between shadow-2xl overflow-hidden group">
                  {/* Orbiting Ambient Ring */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-56 h-56 rounded-full border border-blue-500/20 border-dashed animate-[spin_25s_linear_infinite]" />
                    <div className="absolute w-44 h-44 rounded-full border border-cyan-400/15" />
                  </div>

                  <div className="w-full flex items-center justify-between z-10">
                    <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      LIVE TELEMETRY
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">REV 4.2</span>
                  </div>

                  {/* Central Dynamic Graphic */}
                  <motion.div
                    key={activeTab}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 260 }}
                    className="relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-blue-600/30 to-cyan-500/10 border border-blue-400/40 flex items-center justify-center shadow-[0_0_40px_rgba(29,99,237,0.35)]"
                  >
                    <IconComponent className="w-12 h-12 text-blue-300 stroke-[1.8]" />
                  </motion.div>

                  {/* Bottom Feature Pill */}
                  <div className="w-full z-10 bg-[#070d1a]/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-slate-300 font-bold text-[11px]">Match Certified</span>
                    </div>
                    <span className="text-blue-400 font-mono text-[10px] font-bold">100% PASS</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

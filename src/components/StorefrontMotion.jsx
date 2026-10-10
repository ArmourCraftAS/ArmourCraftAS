import React, { createContext, useContext } from 'react'
import { motion } from 'framer-motion'

/**
 * Helper to check if the current environment is the public customer storefront
 * Returns false on /admin/* to keep the visual CMS canvas lightning-fast and static.
 */
export function isStorefront() {
  if (typeof window === 'undefined') return true
  return !window.location.pathname.startsWith('/admin')
}

// Optional context to explicitly enable/disable animations
export const StorefrontAnimationContext = createContext(null)

export function useStorefrontMotion() {
  const contextVal = useContext(StorefrontAnimationContext)
  if (contextVal !== null) return contextVal
  return isStorefront()
}

/**
 * 1. FADE IN ON SCROLL / LOAD
 * Supports directions: 'up', 'down', 'left', 'right', 'none'
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.55,
  direction = 'up',
  distance = 25,
  scale = 1,
  once = true,
  className = '',
  style = {},
  threshold = 0.15,
  ...rest
}) {
  const enableMotion = useStorefrontMotion()

  if (!enableMotion) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    )
  }

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0, scale }
      case 'down':
        return { y: -distance, opacity: 0, scale }
      case 'left':
        return { x: distance, opacity: 0, scale }
      case 'right':
        return { x: -distance, opacity: 0, scale }
      default:
        return { opacity: 0, scale }
    }
  }

  return (
    <motion.div
      initial={getInitialPosition()}
      whileInView={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      viewport={{ once, amount: threshold }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98]
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/**
 * 2. STAGGERED CHILDREN CONTAINER
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.1,
  delay = 0,
  className = '',
  style = {},
  once = true,
  ...rest
}) {
  const enableMotion = useStorefrontMotion()

  if (!enableMotion) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.1 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/**
 * 3. STAGGERED ITEM
 */
export function StaggerItem({
  children,
  duration = 0.5,
  distance = 20,
  className = '',
  style = {},
  ...rest
}) {
  const enableMotion = useStorefrontMotion()

  if (!enableMotion) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: distance },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration,
            ease: [0.21, 0.47, 0.32, 0.98]
          }
        }
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/**
 * 4. FLOATING AMBIENT PARALLAX ELEMENT
 * Perfect for featured product cards and hero graphics
 */
export function FloatingElement({
  children,
  duration = 5,
  distance = 8,
  className = '',
  style = {},
  ...rest
}) {
  const enableMotion = useStorefrontMotion()

  if (!enableMotion) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      animate={{
        y: [0, -distance, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut'
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/**
 * 5. HOVER ELEVATION & SCALE MICRO-INTERACTION WRAPPER
 */
export function HoverCard({
  children,
  scale = 1.015,
  lift = -4,
  className = '',
  style = {},
  ...rest
}) {
  const enableMotion = useStorefrontMotion()

  if (!enableMotion) {
    return (
      <div className={className} style={style} {...rest}>
        {children}
      </div>
    )
  }

  return (
    <motion.div
      whileHover={{
        y: lift,
        scale,
        transition: { duration: 0.25, ease: 'easeOut' }
      }}
      whileTap={{
        scale: 0.98,
        transition: { duration: 0.1 }
      }}
      className={className}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/**
 * 6. INTERACTIVE MOTION BUTTON
 */
export function InteractiveButton({
  children,
  className = '',
  onClick,
  type = 'button',
  ...rest
}) {
  const enableMotion = useStorefrontMotion()

  if (!enableMotion) {
    return (
      <button type={type} onClick={onClick} className={className} {...rest}>
        {children}
      </button>
    )
  }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{
        scale: 1.025,
        y: -1.5,
        transition: { duration: 0.2, ease: 'easeOut' }
      }}
      whileTap={{
        scale: 0.97,
        y: 0,
        transition: { duration: 0.1 }
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.button>
  )
}

/**
 * 7. GLOBAL STOREFRONT PAGE TRANSITION WRAPPER
 */
export function PageTransition({ children, routeKey, className = '' }) {
  const enableMotion = useStorefrontMotion()

  if (!enableMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      key={routeKey}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * 8. SEQUENTIAL WORD-BY-WORD TEXT REVEAL
 */
export function TextReveal({
  text,
  delay = 0,
  stagger = 0.045,
  className = '',
  wordClassName = 'inline-block'
}) {
  const enableMotion = useStorefrontMotion()

  if (!enableMotion || !text || typeof text !== 'string') {
    return <span className={className}>{text}</span>
  }

  const words = text.split(' ')

  return (
    <motion.span
      className={`inline-block ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            delayChildren: delay,
            staggerChildren: stagger
          }
        }
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className={`${wordClassName} mr-[0.26em] last:mr-0 inline-block`}
          variants={{
            hidden: { opacity: 0, y: 18, filter: 'blur(4px)' },
            visible: {
              opacity: 1,
              y: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98] }
            }
          }}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}

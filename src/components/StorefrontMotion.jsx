import React, { createContext, useContext } from 'react'

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
 * 1. GUARANTEED NATIVE CSS FADE IN / SLIDE UP
 * Runs 100% reliably via hardware-accelerated CSS keyframes
 */
export function FadeIn({
  children,
  delay = 0,
  direction = 'up',
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

  const animationClass =
    direction === 'down'
      ? 'animate-slide-down'
      : direction === 'left'
      ? 'animate-slide-left'
      : direction === 'right'
      ? 'animate-slide-right'
      : direction === 'none'
      ? 'animate-fade-in'
      : 'animate-slide-up'

  const customStyle = delay ? { animationDelay: `${delay}s`, ...style } : style

  return (
    <div
      className={`${animationClass} ${className}`}
      style={customStyle}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * 2. STAGGERED CHILDREN CONTAINER
 */
export function StaggerContainer({
  children,
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
    <div
      className={`animate-fade-in ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * 3. STAGGERED ITEM
 */
export function StaggerItem({
  children,
  delay = 0,
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

  const customStyle = delay ? { animationDelay: `${delay}s`, ...style } : style

  return (
    <div
      className={`animate-slide-up ${className}`}
      style={customStyle}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * 4. FLOATING AMBIENT PARALLAX ELEMENT
 */
export function FloatingElement({
  children,
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
    <div
      className={`animate-float ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
  )
}

/**
 * 5. HOVER ELEVATION & SCALE MICRO-INTERACTION WRAPPER
 */
export function HoverCard({
  children,
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
    <div
      className={`card-hover ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </div>
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
    <button
      type={type}
      onClick={onClick}
      className={`btn-hover ${className}`}
      {...rest}
    >
      {children}
    </button>
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
    <div
      key={routeKey}
      className={`animate-fade-in ${className}`}
    >
      {children}
    </div>
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
    <span className={`inline-block ${className}`}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`${wordClassName} animate-slide-up mr-[0.26em] last:mr-0 inline-block`}
          style={{ animationDelay: `${delay + i * stagger}s` }}
        >
          {word}
        </span>
      ))}
    </span>
  )
}

import React, { useRef, useEffect, useState } from 'react'
import { rehydrateVideoAsset } from '../admin/mediaAssetStore'

/**
 * Helper to check if a source URL is a video asset or video MIME/Blob
 */
export function isVideoAsset(src, mediaType = null) {
  if (mediaType === 'video') return true
  if (mediaType === 'image') return false
  if (!src || typeof src !== 'string') return false
  if (src.startsWith('data:video/')) return true
  if (src.startsWith('blob:') && mediaType !== 'image') return true
  const clean = src.split('?')[0].toLowerCase()
  return (
    clean.endsWith('.mp4') ||
    clean.endsWith('.webm') ||
    clean.endsWith('.ogg') ||
    clean.endsWith('.mov') ||
    clean.endsWith('.m4v')
  )
}

/**
 * Universal Reactive CMS Media Component
 * Dynamically swaps between HTML5 <video> and <img> elements with zero delay.
 * Prevents broken image placeholders when a video file or link is selected.
 */
export default function CmsMedia({
  src,
  videoSrc,
  videoAssetId,
  mediaType = 'image',
  alt = 'ArmourCraft Media',
  poster = '',
  className = '',
  style = {},
  autoPlay = true,
  loop = true,
  muted = true,
  controls = true,
  cmsPath = '',
  cmsLabel = '',
  loading = 'lazy',
  ...rest
}) {
  const resolvedSrc = typeof src === 'string' ? src : (src?.src || '')
  const resolvedVideoSrc = videoSrc || (typeof src === 'object' ? src?.videoSrc : '')
  const isVideo = isVideoAsset(resolvedVideoSrc, mediaType) || isVideoAsset(resolvedSrc, mediaType)
  const initialVideoUrl = resolvedVideoSrc || (isVideo ? resolvedSrc : '')
  const [currentVideoUrl, setCurrentVideoUrl] = useState(initialVideoUrl)
  const videoRef = useRef(null)

  // Sync internal state when props update
  useEffect(() => {
    const nextUrl = resolvedVideoSrc || (isVideo ? resolvedSrc : '')
    setCurrentVideoUrl(nextUrl)
  }, [resolvedVideoSrc, resolvedSrc, isVideo])

  // Re-hydrate video from IndexedDB if videoAssetId exists and blob is missing/stale
  useEffect(() => {
    if (isVideo && videoAssetId) {
      rehydrateVideoAsset(videoAssetId, currentVideoUrl).then((freshUrl) => {
        if (freshUrl && freshUrl !== currentVideoUrl) {
          setCurrentVideoUrl(freshUrl)
        }
      })
    }
  }, [isVideo, videoAssetId, currentVideoUrl])

  // Enforce native DOM muted & autoPlay properties for uninterrupted video playback
  useEffect(() => {
    if (isVideo && videoRef.current) {
      const v = videoRef.current
      v.defaultMuted = muted
      v.muted = muted
      if (autoPlay) {
        const p = v.play()
        if (p !== undefined) {
          p.catch(() => {
            // Autoplay policy handled gracefully
          })
        }
      }
    }
  }, [isVideo, currentVideoUrl, autoPlay, muted])

  if (isVideo && currentVideoUrl) {
    const validPoster = poster && !isVideoAsset(poster, 'image') && !poster.startsWith('data:video/') ? poster : undefined

    return (
      <video
        ref={videoRef}
        key={currentVideoUrl}
        src={currentVideoUrl}
        poster={validPoster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        controls={controls}
        playsInline
        preload="auto"
        className={className}
        style={style}
        data-cms-path={cmsPath}
        data-cms-label={cmsLabel || 'Media Component'}
        data-cms-type="media"
        {...rest}
      />
    )
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      data-cms-path={cmsPath}
      data-cms-label={cmsLabel || 'Media Component'}
      data-cms-type="media"
      {...rest}
    />
  )
}

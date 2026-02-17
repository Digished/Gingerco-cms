'use client'
import React, { useState } from 'react'

/**
 * Detects YouTube / Vimeo URLs and returns the appropriate embed src.
 * Returns null for direct file URLs so the caller falls back to <video>.
 */
function getEmbedUrl(url: string): string | null {
  // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
  )
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`

  // Vimeo: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoMatch = url.match(
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/,
  )
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`

  return null
}

/**
 * Google Drive URLs are converted to the /preview embed URL
 * which works reliably inside an iframe.
 * The file MUST be shared publicly ("Anyone with the link").
 */
function getDriveEmbedUrl(url: string): string | null {
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`

  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([\w-]+)/)
  if (driveOpenMatch) return `https://drive.google.com/file/d/${driveOpenMatch[1]}/preview`

  return null
}

interface VideoEmbedProps {
  url: string
  style?: React.CSSProperties
  controls?: boolean
  preload?: 'none' | 'metadata' | 'auto'
  /** Optional placeholder image URL shown before the video plays */
  posterImage?: string
}

export function VideoEmbed({
  url,
  style,
  controls = true,
  preload = 'none',
  posterImage,
}: VideoEmbedProps) {
  const [activated, setActivated] = useState(false)

  const embedSrc = getEmbedUrl(url) || getDriveEmbedUrl(url)

  // Iframe-based embeds (YouTube / Vimeo / Google Drive)
  if (embedSrc) {
    // If we have a poster image and haven't been clicked yet, show the poster
    if (posterImage && !activated) {
      return (
        <div
          role="button"
          tabIndex={0}
          aria-label="Play video"
          onClick={() => setActivated(true)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActivated(true) }}
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '8px',
            overflow: 'hidden',
            cursor: 'pointer',
            ...style,
          }}
        >
          <img
            src={posterImage}
            alt="Video placeholder"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.3)',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 28,
              }}
            >
              &#9654;
            </div>
          </div>
        </div>
      )
    }

    const isYtOrVimeo = getEmbedUrl(url) !== null
    return (
      <iframe
        src={embedSrc + (activated ? '&autoplay=1' : '')}
        style={{
          width: '100%',
          aspectRatio: '16/9',
          border: 'none',
          borderRadius: '8px',
          ...style,
        }}
        allow={
          isYtOrVimeo
            ? 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            : 'autoplay; encrypted-media'
        }
        allowFullScreen
        referrerPolicy={isYtOrVimeo ? 'no-referrer-when-downgrade' : undefined}
      />
    )
  }

  // Direct file URL → native <video>
  return (
    <video
      controls={controls}
      preload={posterImage ? 'none' : preload}
      poster={posterImage || undefined}
      style={{ width: '100%', borderRadius: '8px', ...style }}
    >
      <source src={url} />
      Your browser does not support the video tag.
    </video>
  )
}

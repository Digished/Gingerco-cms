'use client'
import React from 'react'

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
 * Google Drive URLs are converted to a direct download/stream URL
 * that works reliably with native <video> elements.
 * The file MUST be shared publicly ("Anyone with the link").
 */
function getDriveDirectUrl(url: string): string | null {
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (driveMatch) return `https://drive.google.com/uc?export=download&id=${driveMatch[1]}`

  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([\w-]+)/)
  if (driveOpenMatch) return `https://drive.google.com/uc?export=download&id=${driveOpenMatch[1]}`

  return null
}

interface VideoEmbedProps {
  url: string
  style?: React.CSSProperties
  controls?: boolean
  preload?: 'none' | 'metadata' | 'auto'
}

export function VideoEmbed({
  url,
  style,
  controls = true,
  preload = 'none',
}: VideoEmbedProps) {
  // YouTube / Vimeo → iframe embed
  const embedSrc = getEmbedUrl(url)
  if (embedSrc) {
    return (
      <iframe
        src={embedSrc}
        style={{
          width: '100%',
          aspectRatio: '16/9',
          border: 'none',
          borderRadius: '8px',
          ...style,
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    )
  }

  // Google Drive → native <video> with direct download URL
  const driveUrl = getDriveDirectUrl(url)
  if (driveUrl) {
    return (
      <video
        controls
        preload="metadata"
        style={{ width: '100%', aspectRatio: '16/9', borderRadius: '8px', background: '#000', ...style }}
      >
        <source src={driveUrl} />
        Your browser does not support the video tag.
      </video>
    )
  }

  // Direct file URL → native <video>
  return (
    <video
      controls={controls}
      preload={preload}
      style={{ width: '100%', borderRadius: '8px', ...style }}
    >
      <source src={url} />
      Your browser does not support the video tag.
    </video>
  )
}

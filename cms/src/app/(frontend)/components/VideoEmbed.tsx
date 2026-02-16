'use client'
import React from 'react'

/**
 * Detects YouTube / Vimeo URLs and returns the appropriate embed src.
 * Returns null for direct file URLs (MP4 etc.) so the caller can
 * fall back to a native <video> element.
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

  // Google Drive: drive.google.com/file/d/ID/...
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`

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
      />
    )
  }

  // Direct file URL — use native <video>
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

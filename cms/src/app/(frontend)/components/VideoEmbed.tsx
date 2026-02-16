'use client'
import React from 'react'

/**
 * Detects YouTube / Vimeo / Google Drive URLs and returns the appropriate embed src.
 * Returns null for direct file URLs (MP4 etc.) so the caller can
 * fall back to a native <video> element.
 */
function getEmbedInfo(url: string): { src: string; provider: string } | null {
  // YouTube: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
  )
  if (ytMatch) return { src: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`, provider: 'youtube' }

  // Vimeo: vimeo.com/ID, player.vimeo.com/video/ID
  const vimeoMatch = url.match(
    /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/,
  )
  if (vimeoMatch) return { src: `https://player.vimeo.com/video/${vimeoMatch[1]}`, provider: 'vimeo' }

  // Google Drive: drive.google.com/file/d/ID/... or drive.google.com/open?id=ID
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (driveMatch) return { src: `https://drive.google.com/file/d/${driveMatch[1]}/preview`, provider: 'gdrive' }

  const driveOpenMatch = url.match(/drive\.google\.com\/open\?id=([\w-]+)/)
  if (driveOpenMatch) return { src: `https://drive.google.com/file/d/${driveOpenMatch[1]}/preview`, provider: 'gdrive' }

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
  const embed = getEmbedInfo(url)

  if (embed) {
    return (
      <iframe
        src={embed.src}
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
        sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
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

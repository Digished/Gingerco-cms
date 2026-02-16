/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { VideoEmbed } from '../VideoEmbed'

export function GalleryBlock({ block }: { block: any }) {
  const { heading, columns = '3', backgroundColor } = block
  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : 'bg-white'

  // Support new "items" array and fall back to legacy "images" array
  const galleryItems: any[] = block.items?.length ? block.items : block.images || []

  if (galleryItems.length === 0) return null

  return (
    <section className={`block-gallery ${bgClass}`}>
      <div className="gallery-inner">
        {heading && <h2>{heading}</h2>}
        <div className={`gallery-grid cols-${columns}`}>
          {galleryItems.map((item: any, i: number) => {
            const isVideo = item.mediaType === 'video'
            const img = item.image

            if (isVideo && item.videoUrl) {
              return (
                <div key={item.id || i} className="gallery-item gallery-item--video">
                  <div className="gallery-video-wrapper">
                    <VideoEmbed url={item.videoUrl} style={{ aspectRatio: '16/9' }} />
                  </div>
                  {item.caption && (
                    <div className="gallery-caption">{item.caption}</div>
                  )}
                </div>
              )
            }

            if (!img?.url) return null
            return (
              <div key={item.id || i} className="gallery-item">
                <img src={img.url} alt={img.alt || item.caption || ''} loading="lazy" />
                {item.caption && (
                  <div className="gallery-caption">{item.caption}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

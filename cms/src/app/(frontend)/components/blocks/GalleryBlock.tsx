/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState, useEffect } from 'react'
import { VideoEmbed } from '../VideoEmbed'

export function GalleryBlock({ block }: { block: any }) {
  const { heading, columns = '3', backgroundColor, layoutMode = 'grid', slidesPerView = '1' } = block
  const slidesPerViewNum = parseInt(slidesPerView, 10) || 1
  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : 'bg-white'
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches)
      setCurrentSlide(0)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const effectiveSlidesPerView = isMobile ? 1 : slidesPerViewNum

  // Support new "items" array and fall back to legacy "images" array
  const galleryItems: any[] = block.items?.length ? block.items : block.images || []

  if (galleryItems.length === 0) return null

  const isCarousel = layoutMode === 'carousel'

  const renderItem = (item: any, i: number) => {
    const isVideo = item.mediaType === 'video'
    const img = item.image

    if (isVideo && item.videoUrl) {
      return (
        <div key={item.id || i} className="gallery-item gallery-item--video">
          <div className="gallery-video-wrapper">
            <VideoEmbed url={item.videoUrl} posterImage={item.posterImage?.url} style={{ aspectRatio: '16/9' }} />
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
  }

  if (isCarousel) {
    const maxSlide = Math.max(0, galleryItems.length - effectiveSlidesPerView)
    const itemWidthPct = 100 / effectiveSlidesPerView
    return (
      <section className={`block-gallery ${bgClass}`}>
        <div className="gallery-inner">
          {heading && <h2>{heading}</h2>}
          <div className="gallery-carousel-container">
            <div
              className="gallery-carousel"
              style={{ transform: `translateX(-${currentSlide * itemWidthPct}%)` }}
            >
              {galleryItems.map((item, i) => (
                <div key={item.id || i} style={{ flex: `0 0 ${itemWidthPct}%`, maxWidth: `${itemWidthPct}%`, boxSizing: 'border-box', padding: '0 12px' }}>
                  {renderItem(item, i)}
                </div>
              ))}
            </div>
            {galleryItems.length > effectiveSlidesPerView && (
              <>
                <button
                  className="carousel-nav carousel-prev"
                  onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
                  aria-label="Previous slide"
                >
                  ‹
                </button>
                <button
                  className="carousel-nav carousel-next"
                  onClick={() => setCurrentSlide((prev) => Math.min(maxSlide, prev + 1))}
                  aria-label="Next slide"
                >
                  ›
                </button>
                <div className="carousel-dots">
                  {Array.from({ length: maxSlide + 1 }).map((_, i) => (
                    <button
                      key={i}
                      className={`carousel-dot ${currentSlide === i ? 'active' : ''}`}
                      onClick={() => setCurrentSlide(i)}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`block-gallery ${bgClass}`}>
      <div className="gallery-inner">
        {heading && <h2>{heading}</h2>}
        <div className={`gallery-grid cols-${columns}`}>
          {galleryItems.map((item, i) => renderItem(item, i))}
        </div>
      </div>
    </section>
  )
}

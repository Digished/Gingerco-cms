'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useCallback } from 'react'

export function GalleryCarousel({ items }: { items: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const total = items.length

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, total - 1)))
  }, [total])

  const goPrev = () => goTo(currentIndex - 1)
  const goNext = () => goTo(currentIndex + 1)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current
    // Only swipe if horizontal movement is dominant
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      if (dx < 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <div className="gallery-carousel" aria-label="Image gallery">
      <div
        className="gallery-carousel-track-wrapper"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={trackRef}
          className="gallery-carousel-track"
          style={{ transform: `translateX(calc(-${currentIndex * 85}% - ${currentIndex * 16}px))` }}
        >
          {items.map((item: any, i: number) => {
            const img = item.image
            const isActive = i === currentIndex
            return (
              <div
                key={item.id || i}
                className={`gallery-carousel-slide ${isActive ? 'active' : ''}`}
                aria-hidden={!isActive}
              >
                {img?.url ? (
                  <img
                    src={img.url}
                    alt={img.alt || item.caption || `Slide ${i + 1}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                ) : null}
                {item.caption && (
                  <div className="gallery-carousel-caption">{item.caption}</div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation arrows */}
      {total > 1 && (
        <>
          <button
            className="gallery-carousel-btn gallery-carousel-btn--prev"
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Previous image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
          <button
            className="gallery-carousel-btn gallery-carousel-btn--next"
            onClick={goNext}
            disabled={currentIndex === total - 1}
            aria-label="Next image"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {total > 1 && (
        <div className="gallery-carousel-dots" role="tablist" aria-label="Gallery slides">
          {items.map((_: any, i: number) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Go to slide ${i + 1}`}
              className={`gallery-carousel-dot ${i === currentIndex ? 'active' : ''}`}
              onClick={() => goTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

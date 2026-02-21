/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'

export function PartnerCarousel({ partners }: { partners: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  if (!partners.length) return null

  return (
    <div className="partners-carousel-container">
      <div className="partners-carousel" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
        {partners.map((partner: any) => {
          const logo = partner.logo
          const content = (
            <div key={partner.id} className="partner-item">
              {logo?.url ? (
                <img src={logo.url} alt={partner.name} loading="lazy" />
              ) : (
                <span className="partner-name-fallback">{partner.name}</span>
              )}
            </div>
          )

          if (partner.url) {
            return (
              <a key={partner.id} href={partner.url} target="_blank" rel="noopener noreferrer" className="partner-link">
                {content}
              </a>
            )
          }

          return content
        })}
      </div>
      {partners.length > 1 && (
        <>
          <button
            className="carousel-nav carousel-prev"
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? partners.length - 1 : prev - 1))}
            aria-label="Previous slide"
          >
            ‹
          </button>
          <button
            className="carousel-nav carousel-next"
            onClick={() => setCurrentSlide((prev) => (prev === partners.length - 1 ? 0 : prev + 1))}
            aria-label="Next slide"
          >
            ›
          </button>
          <div className="carousel-dots">
            {partners.map((_, i) => (
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
  )
}

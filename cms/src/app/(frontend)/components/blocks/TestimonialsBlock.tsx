/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

function Stars({ count }: { count: number }) {
  return (
    <div className="testimonial-stars">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? 'star filled' : 'star'}>&#9733;</span>
      ))}
    </div>
  )
}

export function TestimonialsBlock({ block }: { block: any }) {
  const { heading, items } = block

  if (!items || items.length === 0) return null

  return (
    <section className="block-testimonials">
      <div className="testimonials-inner">
        {heading && <h2>{heading}</h2>}
        <div className="testimonials-grid">
          {items.map((item: any, i: number) => (
            <div key={item.id || i} className="testimonial-card">
              {item.rating && <Stars count={item.rating} />}
              <blockquote className="testimonial-quote">
                &ldquo;{item.quote}&rdquo;
              </blockquote>
              <div className="testimonial-author">
                {item.photo?.url && (
                  <img src={item.photo.url} alt={item.photo.alt || item.name} className="testimonial-photo" />
                )}
                <div>
                  <p className="testimonial-name">{item.name}</p>
                  {item.role && <p className="testimonial-role">{item.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

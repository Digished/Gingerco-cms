/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState, useRef } from 'react'

function Stars({ count }: { count: number }) {
  return (
    <div className="stars">
      {Array.from({ length: count }, (_, i) => (
        <span key={i}>&#9733;</span>
      ))}
    </div>
  )
}

function VideoTestimonial({ item }: { item: any }) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play()
      setPlaying(true)
    }
  }

  const posterUrl = item.photo?.url || ''

  return (
    <div
      className={`video-testimonial ${playing ? 'is-playing' : ''}`}
      style={posterUrl && !playing ? { backgroundImage: `url(${posterUrl})` } : undefined}
      onClick={!playing ? handlePlay : undefined}
    >
      <h4>{item.name}</h4>
      <video
        ref={videoRef}
        controls={playing}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          borderRadius: '8px',
          display: playing ? 'block' : 'none',
        }}
        preload="none"
      >
        {item.videoUrl && <source src={item.videoUrl} type="video/mp4" />}
      </video>
      {!playing && <div className="play-button-overlay">&#9654;</div>}
    </div>
  )
}

export function TestimonialsBlock({ block }: { block: any }) {
  const { heading, intro, subLabel, items } = block

  if (!items || items.length === 0) return null

  return (
    <section className="block-community">
      <div className="community-container">
        {heading && <h2>{heading}</h2>}
        {intro && <p className="community-intro">{intro}</p>}
        {subLabel && <div className="testimonials-header">{subLabel}</div>}
        <div className="testimonials">
          {items.map((item: any, i: number) => {
            if (item.type === 'video') {
              return <VideoTestimonial key={item.id || i} item={item} />
            }

            return (
              <div key={item.id || i} className="testimonial">
                <h4>{item.name}</h4>
                {item.rating && <Stars count={item.rating} />}
                {item.quote && <p>&ldquo;{item.quote}&rdquo;</p>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

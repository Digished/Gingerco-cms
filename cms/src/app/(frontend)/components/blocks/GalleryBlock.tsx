/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

export function GalleryBlock({ block }: { block: any }) {
  const { heading, images, columns = '3', backgroundColor } = block
  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : 'bg-white'

  if (!images || images.length === 0) return null

  return (
    <section className={`block-gallery ${bgClass}`}>
      <div className="gallery-inner">
        {heading && <h2>{heading}</h2>}
        <div className={`gallery-grid cols-${columns}`}>
          {images.map((item: any, i: number) => {
            const img = item.image
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

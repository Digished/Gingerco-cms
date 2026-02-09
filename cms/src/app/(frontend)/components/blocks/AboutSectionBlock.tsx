/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { RichText } from '../RichText'

export function AboutSectionBlock({ block }: { block: any }) {
  const { heading, content, image, imagePosition, imageCaption, backgroundColor } = block

  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : 'bg-white'
  const posClass = imagePosition === 'right' ? 'image-right' : 'image-left'

  return (
    <section className={`block-about ${bgClass}`}>
      <div className={`about-container ${posClass}`}>
        <div className="about-image">
          {image?.url && (
            <img src={image.url} alt={image.alt || heading || ''} loading="lazy" />
          )}
          {imageCaption && (imageCaption.title || imageCaption.description) && (
            <div className="studio-info">
              {imageCaption.title && (
                <div className="studio-title">
                  {imageCaption.title}
                  {imageCaption.badge && (
                    <span
                      className="coming-soon"
                      style={imageCaption.badgeColor ? { color: imageCaption.badgeColor } : undefined}
                    >
                      {' '}{imageCaption.badge}
                    </span>
                  )}
                </div>
              )}
              {imageCaption.description && (
                <p className="studio-description">{imageCaption.description}</p>
              )}
            </div>
          )}
        </div>
        <div className="about-content">
          {heading && <h2>{heading}</h2>}
          <RichText content={content} />
        </div>
      </div>
    </section>
  )
}

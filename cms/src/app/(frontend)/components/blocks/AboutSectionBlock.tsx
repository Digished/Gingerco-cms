/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { RichText } from '../RichText'
import { LinkButton } from '../LinkButton'

export function AboutSectionBlock({ block }: { block: any }) {
  const { heading, headingColor, content, image, imagePosition, imageCaption, links, backgroundColor } = block

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
          {heading && (
            <h2 style={headingColor ? { color: headingColor } : undefined}>{heading}</h2>
          )}
          <RichText content={content} />
          {links && links.length > 0 && (
            <div className="block-actions">
              {links.map((link: any, i: number) => (
                <LinkButton key={link.id || i} link={link} className={`btn btn-${link.style || 'primary'}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

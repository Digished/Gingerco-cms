/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { resolveLink } from '../resolveLink'

export function ShowcaseSectionBlock({ block }: { block: any }) {
  const {
    sectionHeading, mediaType, image, videoUrl,
    mediaPosition, infoHeading, infoDescription,
    details, links, backgroundColor,
  } = block

  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : 'bg-white'
  const posClass = mediaPosition === 'right' ? 'media-right' : 'media-left'

  return (
    <section className={`block-showcase ${bgClass}`}>
      <div className={`showcase-container ${posClass}`}>
        {/* Media column */}
        <div className="showcase-media-col">
          {sectionHeading && <h2>{sectionHeading}</h2>}
          <div className="showcase-media">
            {mediaType === 'video' && videoUrl ? (
              <video controls style={{ width: '100%', height: '100%', borderRadius: '8px' }}>
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : image?.url ? (
              <img src={image.url} alt={image.alt || sectionHeading || ''} loading="lazy" />
            ) : null}
          </div>
        </div>

        {/* Info column */}
        <div className="showcase-info">
          {infoHeading && <h3>{infoHeading}</h3>}
          {infoDescription && <p className="showcase-description">{infoDescription}</p>}

          {details && details.length > 0 && (
            <div className="showcase-details">
              {details.map((detail: any, i: number) => (
                <div key={detail.id || i} className="showcase-detail">
                  <div className="showcase-detail-icon" />
                  <div>
                    <strong>{detail.label}</strong> {detail.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {links && links.length > 0 && (
            <div className="showcase-actions">
              {links.map((link: any, i: number) => {
                const resolved = resolveLink(link)
                return (
                  <a
                    key={link.id || i}
                    href={resolved.href}
                    className={`btn-showcase btn-showcase-${link.style || 'outline'}`}
                    {...(resolved.target ? { target: resolved.target, rel: resolved.rel } : {})}
                  >
                    {link.label}
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

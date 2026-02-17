/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { LinkButton } from '../LinkButton'
import { VideoEmbed } from '../VideoEmbed'

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
              <VideoEmbed url={videoUrl} style={{ height: '100%' }} />
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
              {links.map((link: any, i: number) => (
                <LinkButton
                  key={link.id || i}
                  link={link}
                  className={`btn-showcase btn-showcase-${link.style || 'outline'}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

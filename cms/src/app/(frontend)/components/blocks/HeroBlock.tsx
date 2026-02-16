/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { LinkButton } from '../LinkButton'

export function HeroBlock({ block }: { block: any }) {
  const { headingSegments, subheading, subheadingSize, image, overlay, textAlign, minHeight, links } = block

  const sizeMap: Record<string, string> = {
    small: '0.95rem',
    default: '1.1rem',
    medium: '1.4rem',
    large: '1.8rem',
    xl: '2.2rem',
    '2xl': '2.8rem',
    '3xl': '3.5rem',
  }

  // Support old 'heading' field for backward compatibility
  const hasSegments = headingSegments && headingSegments.length > 0
  const oldHeading = block.heading

  const alignClass = textAlign === 'right' ? 'text-right' : textAlign === 'center' ? 'text-center' : 'text-left'

  return (
    <section
      className={`block-hero ${alignClass}`}
      style={{ minHeight: minHeight || '600px' }}
    >
      {image?.url && (
        <img src={image.url} alt={image.alt || ''} className="hero-bg" />
      )}
      {overlay && <div className="hero-overlay" />}
      <div className="hero-content">
        <h1>
          {hasSegments ? (
            headingSegments.map((seg: any, i: number) => (
              <React.Fragment key={seg.id || i}>
                <span
                  style={{
                    ...(seg.color ? { color: seg.color } : {}),
                    ...(seg.bold ? { fontWeight: 700 } : {}),
                  }}
                >
                  {seg.text}
                </span>
                {seg.lineBreakAfter && <br />}
              </React.Fragment>
            ))
          ) : (
            oldHeading || ''
          )}
        </h1>
        {subheading && (
          <p
            className={`hero-subheading${subheadingSize && subheadingSize !== 'default' ? ' hero-subheading-lg' : ''}`}
            style={subheadingSize && subheadingSize !== 'default' ? { fontSize: sizeMap[subheadingSize] || '1.1rem' } : undefined}
          >
            {subheading}
          </p>
        )}
        {links && links.length > 0 && (
          <div className="hero-links">
            {links.map((link: any, i: number) => (
              <LinkButton
                key={link.id || i}
                link={link}
                className={`btn btn-${link.style || 'primary'}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

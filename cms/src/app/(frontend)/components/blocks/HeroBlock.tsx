/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

export function HeroBlock({ block }: { block: any }) {
  const { headingSegments, subheading, image, overlay, textAlign, minHeight, links } = block

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
        {subheading && <p className="hero-subheading">{subheading}</p>}
        {links && links.length > 0 && (
          <div className="hero-links">
            {links.map((link: any, i: number) => (
              <a
                key={i}
                href={link.url}
                className={`btn btn-${link.style || 'primary'}`}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

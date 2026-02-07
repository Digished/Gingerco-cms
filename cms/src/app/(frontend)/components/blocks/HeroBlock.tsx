/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

export function HeroBlock({ block }: { block: any }) {
  const { heading, subheading, image, overlay, links } = block

  return (
    <section className="block-hero">
      {image?.url && (
        <img src={image.url} alt={image.alt || heading || ''} className="hero-bg" />
      )}
      {overlay && <div className="hero-overlay" />}
      <div className="hero-content">
        <h1>{heading}</h1>
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

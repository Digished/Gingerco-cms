/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { LinkButton } from '../LinkButton'

export function CTABlock({ block }: { block: any }) {
  const { heading, description, links, backgroundImage, backgroundColor } = block
  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : 'bg-white'

  return (
    <section className={`block-cta ${bgClass}`}>
      {backgroundImage?.url && (
        <img src={backgroundImage.url} alt="" className="cta-bg" loading="lazy" />
      )}
      <div className="cta-content">
        <h2>{heading}</h2>
        {description && <p className="cta-description">{description}</p>}
        {links && links.length > 0 && (
          <div className="cta-links">
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

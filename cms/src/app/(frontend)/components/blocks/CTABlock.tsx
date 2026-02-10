/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { resolveLink } from '../resolveLink'

export function CTABlock({ block }: { block: any }) {
  const { heading, description, links, backgroundImage } = block

  return (
    <section className="block-cta">
      {backgroundImage?.url && (
        <img src={backgroundImage.url} alt="" className="cta-bg" />
      )}
      <div className="cta-content">
        <h2>{heading}</h2>
        {description && <p className="cta-description">{description}</p>}
        {links && links.length > 0 && (
          <div className="cta-links">
            {links.map((link: any, i: number) => {
              const resolved = resolveLink(link)
              return (
                <a
                  key={link.id || i}
                  href={resolved.href}
                  className={`btn btn-${link.style || 'primary'}`}
                  {...(resolved.target ? { target: resolved.target, rel: resolved.rel } : {})}
                >
                  {link.label}
                </a>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PartnerCarousel } from './PartnerCarousel'

export async function PartnerSectionBlock({ block }: { block: any }) {
  const { heading, description, partners: partnerIds, layout, backgroundColor } = block

  if (!partnerIds || partnerIds.length === 0) return null

  const payload = await getPayload({ config: configPromise })

  const ids = partnerIds.map((p: any) => (typeof p === 'object' ? p.id : p)).filter(Boolean)
  if (ids.length === 0) return null

  const result = await payload.find({
    collection: 'partners' as any,
    where: { id: { in: ids } },
    limit: 50,
    depth: 1,
  })

  const partners = result.docs

  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : ''

  return (
    <section className={`block-partners ${bgClass}`}>
      <div className="partners-inner">
        {heading && <h2>{heading}</h2>}
        {description && <p className="partners-description">{description}</p>}
        {layout === 'slide' ? (
          <PartnerCarousel partners={partners} />
        ) : (
          <div className={`partners-display ${layout === 'row' ? 'partners-row' : 'partners-grid'}`}>
            {partners.map((partner: any) => {
              const logo = partner.logo
              const content = (
                <div key={partner.id} className="partner-item">
                  {logo?.url ? (
                    <img src={logo.url} alt={partner.name} loading="lazy" />
                  ) : (
                    <span className="partner-name-fallback">{partner.name}</span>
                  )}
                </div>
              )

              if (partner.url) {
                return (
                  <a key={partner.id} href={partner.url} target="_blank" rel="noopener noreferrer" className="partner-link">
                    {content}
                  </a>
                )
              }

              return content
            })}
          </div>
        )}
      </div>
    </section>
  )
}

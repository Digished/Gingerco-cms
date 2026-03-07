/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { ClientLinkButtons } from '../ClientLinkButtons'

export async function PartnerSectionBlock({ block }: { block: any }) {
  const { heading, description, partners: partnerIds, backgroundColor, links } = block

  const hasLinks = links && links.length > 0
  const hasContent = heading || description || hasLinks

  // Fetch partner logos only if partners are selected
  let partners: any[] = []
  if (partnerIds && partnerIds.length > 0) {
    const payload = await getPayload({ config: configPromise })
    const ids = partnerIds.map((p: any) => (typeof p === 'object' ? p.id : p)).filter(Boolean)
    if (ids.length > 0) {
      const result = await payload.find({
        collection: 'partners' as any,
        where: { id: { in: ids } },
        limit: 50,
        depth: 1,
      })
      partners = result.docs
    }
  }

  // Nothing to render at all
  if (!hasContent && partners.length === 0) return null

  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : ''

  return (
    <section className={`block-partners ${bgClass}`}>
      <div className="partners-inner">
        {heading && <h2>{heading}</h2>}
        {description && <p className="partners-description">{description}</p>}
        {hasLinks && (
          <div className="partners-links">
            <ClientLinkButtons links={links} />
          </div>
        )}
        {partners.length > 0 && (
          <div className="partners-display partners-grid">
            {partners.map((partner: any) => {
              const logo = partner.logo
              const content = (
                <div className="partner-item">
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

              return <React.Fragment key={partner.id}>{content}</React.Fragment>
            })}
          </div>
        )}
      </div>
    </section>
  )
}

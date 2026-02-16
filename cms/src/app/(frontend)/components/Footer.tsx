/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Link from 'next/link'
import { resolveLink } from './resolveLink'
import { LinkButton } from './LinkButton'

function FooterIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'email':
      return (
        <svg className="social-icon" viewBox="0 0 24 24">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      )
    case 'instagram':
      return (
        <svg className="social-icon" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    case 'tiktok':
      return (
        <svg className="social-icon" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg className="social-icon" viewBox="0 0 24 24">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    case 'facebook':
      return (
        <svg className="social-icon" viewBox="0 0 24 24">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )
    case 'youtube':
      return (
        <svg className="social-icon" viewBox="0 0 24 24">
          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
          <polygon points="9.75,15.02 15.5,11.75 9.75,8.48" />
        </svg>
      )
    case 'twitter':
      return (
        <svg className="social-icon" viewBox="0 0 24 24">
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      )
    case 'phone':
      return (
        <svg className="social-icon" viewBox="0 0 24 24">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      )
    case 'globe':
      return (
        <svg className="social-icon" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      )
    case 'map-pin':
      return (
        <svg className="social-icon" viewBox="0 0 24 24">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      )
    case 'arrow-right':
      return (
        <svg className="social-icon" viewBox="0 0 24 24">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12,5 19,12 12,19" />
        </svg>
      )
    default:
      return null
  }
}

export function Footer({ footer }: { footer: any }) {
  const hashtag = footer?.hashtag || '#NOPAINNOGINGER'
  const hashtagAlign = footer?.hashtagAlign || 'left'
  const logo = footer?.logo
  const brandName = footer?.brandName || 'Ginger & Co.'
  const columns = footer?.columns || []
  const copyright = footer?.copyright || `All rights reserved to Ginger & Co`
  const contactLabel = footer?.contactLabel || 'For more information contact:'
  const contactPhone = footer?.contactPhone || '+43 676 7261062'
  const contactEmail = footer?.contactEmail || 'info@gingerandco.at'

  // Split brand name for line break (e.g. "Ginger & Co." -> "Ginger &" + "Co.")
  const brandParts = brandName.includes('&')
    ? [brandName.split('&')[0].trim() + ' &', brandName.split('&').slice(1).join('&').trim()]
    : [brandName]

  return (
    <footer className="site-footer">
      {/* Hashtag */}
      {hashtag && (
        <div className={`footer-hashtag-wrapper footer-hashtag-${hashtagAlign}`}>
          <span className="footer-hashtag">{hashtag}</span>
        </div>
      )}

      {/* Main footer content: brand + columns */}
      <div className="footer-container">
        {/* Brand section */}
        <div className="footer-brand-col">
          <div className="footer-brand">
            {logo?.url && (
              <div className="footer-logo">
                <img src={logo.url} alt={logo.alt || 'Logo'} loading="lazy" />
              </div>
            )}
            <h3 className="footer-company-name">
              {brandParts.map((part, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <br />}
                  {part}
                </React.Fragment>
              ))}
            </h3>
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col: any, i: number) => (
          <div key={i} className="footer-links">
            {col.heading && <h4>{col.heading}</h4>}
            {col.links && col.links.some((link: any) => link.icon && link.icon !== 'none') ? (
              // Column with icons (social/connect style)
              <div className="social-links">
                {col.links.map((link: any, j: number) => {
                  if (link.linkAction === 'popup-form') {
                    return (
                      <LinkButton key={j} link={link} className="social-link" />
                    )
                  }
                  const { href } = resolveLink(link)
                  const isExternal = link.newTab || (href.startsWith('http') || href.startsWith('mailto:'))

                  if (isExternal || link.linkType === 'custom') {
                    return (
                      <a
                        key={j}
                        href={href}
                        className="social-link"
                        {...(link.newTab || (href.startsWith('http'))
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {link.icon && link.icon !== 'none' && <FooterIcon icon={link.icon} />}
                        {link.label}
                      </a>
                    )
                  }

                  return (
                    <Link key={j} href={href} className="social-link">
                      {link.icon && link.icon !== 'none' && <FooterIcon icon={link.icon} />}
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            ) : (
              // Column without icons (plain list style)
              <ul>
                {col.links?.map((link: any, j: number) => {
                  if (link.linkAction === 'popup-form') {
                    return (
                      <li key={j}><LinkButton link={link} className="footer-popup-btn" /></li>
                    )
                  }
                  const { href } = resolveLink(link)
                  const isExternal = link.newTab || href.startsWith('http')

                  return (
                    <li key={j}>
                      {isExternal || link.linkType === 'custom' ? (
                        <a
                          href={href}
                          {...(link.newTab || href.startsWith('http')
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link href={href}>{link.label}</Link>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Footer bottom */}
      <div className="footer-bottom">
        <p className="footer-copyright">&copy; {new Date().getFullYear()} {copyright}</p>
        {(contactPhone || contactEmail) && (
          <div className="footer-inquiry">
            {contactLabel && <span>{contactLabel}</span>}
            <div className="footer-inquiry-items">
              {contactPhone && (
                <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="contact-item">{contactPhone}</a>
              )}
              {contactEmail && (
                <a href={`mailto:${contactEmail}`} className="contact-item">{contactEmail}</a>
              )}
            </div>
          </div>
        )}
      </div>
    </footer>
  )
}

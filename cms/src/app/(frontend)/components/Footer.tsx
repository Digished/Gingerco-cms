/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Link from 'next/link'

const platformLabels: Record<string, string> = {
  instagram: 'IG',
  facebook: 'FB',
  tiktok: 'TK',
  youtube: 'YT',
  twitter: 'X',
}

export function Footer({ footer }: { footer: any }) {
  const columns = footer?.columns || []
  const copyright = footer?.copyright || `\u00A9 ${new Date().getFullYear()} Ginger & Co. All rights reserved.`
  const socialLinks = footer?.socialLinks || []

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {columns.length > 0 && (
          <div className="footer-columns">
            {columns.map((col: any, i: number) => (
              <div key={i} className="footer-column">
                {col.heading && <h4>{col.heading}</h4>}
                {col.links?.map((link: any, j: number) => {
                  const href = link.linkType === 'page' && link.page
                    ? `/${(typeof link.page === 'object' ? link.page.slug : '')}`
                    : link.url || '#'

                  return (
                    <Link key={j} href={href}>
                      {link.label}
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>
        )}
        <div className="footer-bottom">
          <p className="footer-copyright">{copyright}</p>
          {socialLinks.length > 0 && (
            <div className="footer-social">
              {socialLinks.map((social: any, i: number) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.platform}
                >
                  {platformLabels[social.platform] || social.platform}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}

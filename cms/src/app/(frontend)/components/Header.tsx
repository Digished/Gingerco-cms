/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Link from 'next/link'
import { MobileMenuToggle } from './MobileMenuToggle'

export function Header({ header }: { header: any }) {
  const logo = header?.logo
  const navItems = header?.navItems || []

  const navLinks = navItems.map((item: any, i: number) => {
    const href = item.linkType === 'page' && item.page
      ? `/${(typeof item.page === 'object' ? item.page.slug : '')}`
      : item.url || '#'

    return (
      <Link
        key={i}
        href={href}
        target={item.newTab ? '_blank' : undefined}
        rel={item.newTab ? 'noopener noreferrer' : undefined}
      >
        {item.label}
      </Link>
    )
  })

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="header-logo">
          {logo?.url ? (
            <img src={logo.url} alt={logo.alt || 'Ginger & Co.'} />
          ) : (
            'Ginger & Co.'
          )}
        </Link>
        <MobileMenuToggle>
          {navLinks}
        </MobileMenuToggle>
      </div>
    </header>
  )
}

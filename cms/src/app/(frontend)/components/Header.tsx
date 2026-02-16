/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import Link from 'next/link'
import { MobileMenuToggle } from './MobileMenuToggle'
import { resolveLink } from './resolveLink'

export function Header({ header }: { header: any }) {
  const logo = header?.logo
  const navItems = header?.navItems || []

  const navLinks = navItems.map((item: any, i: number) => {
    const resolved = resolveLink(item)

    return (
      <Link
        key={i}
        href={resolved.href}
        target={resolved.target as any}
        rel={resolved.rel}
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

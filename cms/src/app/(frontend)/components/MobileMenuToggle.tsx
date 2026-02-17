'use client'

import React, { useState } from 'react'

export function MobileMenuToggle({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className={`mobile-menu-btn${open ? ' active' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
      >
        <span />
        <span />
        <span />
      </button>
      <nav className={`header-nav${open ? ' open' : ''}`} onClick={() => setOpen(false)}>
        {children}
      </nav>
    </>
  )
}

'use client'

import React from 'react'
import { LinkButton } from './LinkButton'

export function ClientLinkButtons({ links }: { links: any[] }) {
  if (!links || links.length === 0) return null

  return (
    <>
      {links.map((link: any, i: number) => (
        <LinkButton
          key={link.id || i}
          link={link}
          style={link.style || 'primary'}
        />
      ))}
    </>
  )
}

import type React from 'react'
import type { Metadata } from 'next'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Ginger & Co.',
    template: '%s | Ginger & Co.',
  },
  description: 'Vienna-based Afrobeats fitness company.',
}

export default function FrontendLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

import type React from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Header } from './components/Header'
import { Footer } from './components/Footer'

import './globals.css'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: {
    default: 'Ginger & Co.',
    template: '%s | Ginger & Co.',
  },
  description: 'Vienna-based Afrobeats fitness company.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  let header = null
  let footer = null

  try {
    const payload = await getPayload({ config: configPromise })
    header = await payload.findGlobal({ slug: 'header' })
    footer = await payload.findGlobal({ slug: 'footer' })
  } catch {
    // Globals may not exist yet on first deploy
  }

  return (
    <html lang="en">
      <body>
        <Header header={header} />
        {children}
        <Footer footer={footer} />
      </body>
    </html>
  )
}

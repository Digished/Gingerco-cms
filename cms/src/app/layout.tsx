/**
 * Root Layout
 *
 * App-wide layout wrapper
 * Provides global styles and metadata
 */

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gingerco CMS',
  description: 'Content Management System for Gingerco Events',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react'
import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { FloatingButtons } from './components/FloatingButtons'

import './globals.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  let seoTitle = 'Ginger & Co.'
  let seoDescription = 'Vienna-based boutique fitness and lifestyle company'

  try {
    const payload = await getPayload({ config: configPromise })
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    if (settings?.seoTitle) seoTitle = settings.seoTitle
    if (settings?.siteDescription) seoDescription = settings.siteDescription
  } catch {
    // Use defaults if settings can't be loaded
  }

  return {
    title: {
      default: seoTitle,
      template: `%s | ${seoTitle}`,
    },
    description: seoDescription,
  }
}

const fontMap: Record<string, string> = {
  'Playfair Display': 'Playfair+Display:wght@400;600;700',
  'Merriweather': 'Merriweather:wght@400;700',
  'Lora': 'Lora:wght@400;600;700',
  'Poppins': 'Poppins:wght@300;400;500;600;700',
  'Montserrat': 'Montserrat:wght@400;500;600;700',
  'Raleway': 'Raleway:wght@300;400;500;600;700',
  'Oswald': 'Oswald:wght@400;500;600;700',
  'Dancing Script': 'Dancing+Script:wght@400;700',
  'Inter': 'Inter:wght@300;400;500;600;700',
  'Open Sans': 'Open+Sans:wght@300;400;500;600;700',
  'Lato': 'Lato:wght@300;400;700',
  'Nunito': 'Nunito:wght@300;400;600;700',
  'Roboto': 'Roboto:wght@300;400;500;700',
  'Source Sans 3': 'Source+Sans+3:wght@300;400;500;600;700',
}

const buttonRadiusMap: Record<string, string> = {
  rounded: '50px',
  slight: '8px',
  square: '0px',
}

function darkenColor(hex: string): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max((num >> 16) - 20, 0)
  const g = Math.max(((num >> 8) & 0x00FF) - 20, 0)
  const b = Math.max((num & 0x0000FF) - 20, 0)
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`
}

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  let header = null
  let footer = null
  let settings: any = null

  try {
    const payload = await getPayload({ config: configPromise })
    try { header = await payload.findGlobal({ slug: 'header' }) } catch { /* column may not exist yet */ }
    try { footer = await payload.findGlobal({ slug: 'footer' }) } catch { /* column may not exist yet */ }
    try { settings = await payload.findGlobal({ slug: 'site-settings', depth: 2 }) } catch { /* column may not exist yet */ }
  } catch {
    // Payload may not be ready on first deploy
  }

  const faviconUrl = (settings?.favicon && typeof settings.favicon === 'object') ? settings.favicon.url : null

  const primaryColor = settings?.primaryColor || '#E85D3A'
  const secondaryColor = settings?.secondaryColor || '#F4A261'
  const backgroundColor = settings?.backgroundColor || '#FFFAF5'
  const textColor = settings?.textColor || '#2D2D2D'
  const headingFont = settings?.headingFont || 'Playfair Display'
  const bodyFont = settings?.bodyFont || 'Poppins'
  const buttonStyle = settings?.buttonStyle || 'rounded'

  const fonts = new Set([headingFont, bodyFont])
  const fontFamilies = Array.from(fonts).map(f => fontMap[f]).filter(Boolean).join('&family=')
  const googleFontsUrl = fontFamilies ? `https://fonts.googleapis.com/css2?family=${fontFamilies}&display=swap` : ''

  const themeVars = `
    :root {
      --color-primary: ${primaryColor};
      --color-primary-dark: ${darkenColor(primaryColor)};
      --color-accent: ${secondaryColor};
      --color-bg: ${backgroundColor};
      --color-text: ${textColor};
      --color-secondary: ${textColor};
      --font-heading: '${headingFont}', Georgia, serif;
      --font-body: '${bodyFont}', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --btn-radius: ${buttonRadiusMap[buttonStyle] || '50px'};
    }
    .btn { border-radius: var(--btn-radius); }
  `

  return (
    <html lang="en">
      <head>
        {googleFontsUrl && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="stylesheet" href={googleFontsUrl} />
          </>
        )}
        {faviconUrl && <link rel="icon" href={faviconUrl} />}
        {!faviconUrl && <link rel="icon" href="/favicon.svg" />}
        <style dangerouslySetInnerHTML={{ __html: themeVars }} />
      </head>
      <body>
        <Header header={header} />
        {children}
        <Footer footer={footer} />
        <FloatingButtons buttons={settings?.floatingButtons || []} toggleIcon={settings?.toggleIcon} />
      </body>
    </html>
  )
}

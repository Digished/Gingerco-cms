import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RenderBlocks } from './components/RenderBlocks'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let homePageData = null

  try {
    const payload = await getPayload({ config: configPromise })

    const page = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: 'home' },
        _status: { equals: 'published' },
      },
      limit: 1,
      depth: 2,
    })

    homePageData = page.docs[0]
  } catch (err) {
    // Database tables may not exist yet on first deploy
    console.error('[HomePage] Failed to load page data:', err instanceof Error ? err.message : String(err))
  }

  if (!homePageData) {
    return (
      <main style={{ padding: '4rem 2rem', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem' }}>Ginger &amp; Co.</h1>
        <p style={{ fontSize: '1.1rem', color: '#6B6B6B', maxWidth: '500px', lineHeight: '1.8' }}>
          Welcome! This site is being set up. Visit{' '}
          <a href="/admin" style={{ color: '#E85D3A', textDecoration: 'underline' }}>
            /admin
          </a>{' '}
          to start creating content.
        </p>
      </main>
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const layout = (homePageData as any).layout || []

  return (
    <main>
      <RenderBlocks blocks={layout} />
    </main>
  )
}

import { getPayload } from 'payload'
import configPromise from '@payload-config'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: { equals: 'home' },
      status: { equals: 'published' },
    },
    limit: 1,
  })

  const homePageData = page.docs[0]

  if (!homePageData) {
    return (
      <main style={{ padding: '4rem 2rem', textAlign: 'center' }}>
        <h1>Ginger &amp; Co.</h1>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          Welcome! This site is being set up. Visit{' '}
          <a href="/admin" style={{ color: '#3B82F6', textDecoration: 'underline' }}>
            /admin
          </a>{' '}
          to start creating content.
        </p>
      </main>
    )
  }

  return (
    <main>
      <h1>{homePageData.title}</h1>
      {/* Block rendering will be added as the frontend is built out */}
    </main>
  )
}

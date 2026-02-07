import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { RenderBlocks } from '../components/RenderBlocks'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string[] }>
}

export default async function Page({ params }: Args) {
  const { slug } = await params
  const slugString = slug.join('/')

  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slugString },
        _status: { equals: 'published' },
      },
      limit: 1,
      depth: 2,
    })

    const page = result.docs[0]

    if (!page) {
      notFound()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const layout = (page as any).layout || []
    const hasHero = layout.length > 0 && layout[0].blockType === 'hero'

    return (
      <main>
        {!hasHero && (
          <div className="page-title">
            <h1>{page.title}</h1>
          </div>
        )}
        <RenderBlocks blocks={layout} />
      </main>
    )
  } catch {
    notFound()
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const slugString = slug.join('/')

  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slugString },
        _status: { equals: 'published' },
      },
      limit: 1,
    })

    const page = result.docs[0]

    if (!page) {
      return { title: 'Not Found' }
    }

    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      title: (page.meta as any)?.title || page.title,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      description: (page.meta as any)?.description || undefined,
    }
  } catch {
    return { title: 'Not Found' }
  }
}

import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'

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
    })

    const page = result.docs[0]

    if (!page) {
      notFound()
    }

    return (
      <main>
        <h1>{page.title}</h1>
        {/* Block rendering will be added as the frontend is built out */}
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
      title: (page.meta as { title?: string })?.title || page.title,
      description: (page.meta as { description?: string })?.description || undefined,
    }
  } catch {
    return { title: 'Not Found' }
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { RichText } from '../../components/RichText'

export const dynamic = 'force-dynamic'

type Args = {
  params: Promise<{ slug: string }>
}

export default async function BlogPost({ params }: Args) {
  const { slug } = await params

  try {
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'blog-posts',
      where: {
        slug: { equals: slug },
        _status: { equals: 'published' },
      },
      limit: 1,
      depth: 2,
    })

    const post = result.docs[0] as any

    if (!post) notFound()

    return (
      <main className="blog-post">
        <div className="blog-post-header">
          {post.category && <span className="blog-card-category">{post.category}</span>}
          <h1>{post.title}</h1>
          <div className="blog-post-meta">
            {post.publishedDate && (
              <span>{new Date(post.publishedDate).toLocaleDateString('en-AT', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}</span>
            )}
            {post.author && typeof post.author === 'object' && (
              <span>By {post.author.name}</span>
            )}
          </div>
        </div>
        {post.featuredImage?.url && (
          <div className="blog-post-featured">
            <img src={post.featuredImage.url} alt={post.featuredImage.alt || post.title} loading="lazy" />
          </div>
        )}
        <div className="rich-text">
          <RichText content={post.content} />
        </div>
      </main>
    )
  } catch {
    notFound()
  }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params

  try {
    const payload = await getPayload({ config: configPromise })
    const result = await payload.find({
      collection: 'blog-posts',
      where: { slug: { equals: slug }, _status: { equals: 'published' } },
      limit: 1,
    })

    const post = result.docs[0] as any
    if (!post) return { title: 'Not Found' }

    return {
      title: post.meta?.title || post.title,
      description: post.meta?.description || post.excerpt || undefined,
    }
  } catch {
    return { title: 'Not Found' }
  }
}

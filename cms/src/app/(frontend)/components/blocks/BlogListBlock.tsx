/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function BlogListBlock({ block }: { block: any }) {
  const { heading, showCount = 6, filterByCategory = 'all', layout = 'grid', backgroundColor } = block
  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : 'bg-white'

  let posts: any[] = []
  try {
    const payload = await getPayload({ config: configPromise })

    const where: any = {
      _status: { equals: 'published' },
    }

    if (filterByCategory !== 'all') {
      where.category = { equals: filterByCategory }
    }

    const result = await payload.find({
      collection: 'blog-posts',
      where,
      sort: '-publishedDate',
      limit: showCount,
      depth: 1,
    })

    posts = result.docs
  } catch {
    // Collection may not exist yet
  }

  return (
    <section className={`block-blog ${bgClass}`}>
      <div className="blog-inner">
        {heading && <h2>{heading}</h2>}
        {posts.length === 0 ? (
          <p className="blog-empty">No posts yet. Check back soon!</p>
        ) : (
          <div className={layout === 'grid' ? 'blog-grid' : 'blog-list-layout'}>
            {posts.map((post: any) => (
              <article key={post.id} className="blog-card">
                {post.featuredImage?.url && (
                  <div className="blog-card-image">
                    <img src={post.featuredImage.url} alt={post.featuredImage.alt || post.title} loading="lazy" />
                  </div>
                )}
                <div className="blog-card-body">
                  {post.category && (
                    <span className="blog-card-category">{post.category}</span>
                  )}
                  <h3>{post.title}</h3>
                  {post.publishedDate && (
                    <p className="blog-card-date">
                      {new Date(post.publishedDate).toLocaleDateString('en-AT', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                  {post.excerpt && (
                    <p className="blog-card-excerpt">{post.excerpt}</p>
                  )}
                  <a href={`/blog/${post.slug}`} className="blog-card-link">
                    Read more &rarr;
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

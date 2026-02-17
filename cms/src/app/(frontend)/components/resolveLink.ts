/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Resolves a link object (from linkFields) into href + optional target props.
 * Handles Pages, Events, Blog Posts, Team Members, and custom URLs.
 */
export function resolveLink(link: any): { href: string; target?: string; rel?: string } {
  let href = '#'

  if (link.linkType === 'page') {
    const collection = link.linkCollection || 'pages'
    let doc: any = null

    switch (collection) {
      case 'events':
        doc = typeof link.event === 'object' ? link.event : null
        if (doc?.slug) href = `/events/${doc.slug}`
        break
      case 'blog-posts':
        doc = typeof link.blogPost === 'object' ? link.blogPost : null
        if (doc?.slug) href = `/blog/${doc.slug}`
        break
      case 'team-members':
        doc = typeof link.teamMember === 'object' ? link.teamMember : null
        if (doc?.slug) href = `/team/${doc.slug}`
        break
      default:
        // Backwards compatible: existing links without linkCollection default to pages
        doc = typeof link.page === 'object' ? link.page : null
        if (doc?.slug) href = doc.slug === 'home' ? '/' : `/${doc.slug}`
    }
  } else if (link.url) {
    href = link.url
  }

  return {
    href,
    ...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  }
}

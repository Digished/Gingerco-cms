/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Resolves a link object (from linkFields) into href + optional target props.
 * Handles both internal page references and custom URLs.
 */
export function resolveLink(link: any): { href: string; target?: string; rel?: string } {
  let href = '#'

  if (link.linkType === 'page' && link.page) {
    const slug = typeof link.page === 'object' ? link.page.slug : null
    href = slug === 'home' ? '/' : `/${slug}`
  } else if (link.url) {
    href = link.url
  }

  return {
    href,
    ...(link.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {}),
  }
}

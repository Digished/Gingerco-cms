/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

// Maps state values from TextStateFeature to inline CSS
const stateStyleMap: Record<string, Record<string, React.CSSProperties>> = {
  color: {
    'text-red': { color: '#dc2626' },
    'text-orange': { color: '#ea580c' },
    'text-yellow': { color: '#ca8a04' },
    'text-green': { color: '#16a34a' },
    'text-blue': { color: '#2563eb' },
    'text-purple': { color: '#9333ea' },
    'text-pink': { color: '#db2777' },
    'text-gold': { color: '#D4AF37' },
    'text-white': { color: '#FFFFFF' },
    'text-black': { color: '#1A1A1A' },
    'text-gray': { color: '#666666' },
  },
  backgroundColor: {
    'bg-red': { backgroundColor: '#fecaca' },
    'bg-orange': { backgroundColor: '#fed7aa' },
    'bg-yellow': { backgroundColor: '#fef08a' },
    'bg-green': { backgroundColor: '#bbf7d0' },
    'bg-blue': { backgroundColor: '#bfdbfe' },
    'bg-purple': { backgroundColor: '#e9d5ff' },
    'bg-pink': { backgroundColor: '#fbcfe8' },
    'bg-gold': { backgroundColor: '#D4AF37' },
    'bg-black': { backgroundColor: '#1A1A1A' },
    'bg-white': { backgroundColor: '#FFFFFF' },
  },
  fontSize: {
    'size-xs': { fontSize: '0.75rem' },
    'size-sm': { fontSize: '0.875rem' },
    'size-base': { fontSize: '1rem' },
    'size-lg': { fontSize: '1.25rem' },
    'size-xl': { fontSize: '1.5rem' },
    'size-2xl': { fontSize: '2rem' },
    'size-3xl': { fontSize: '2.5rem' },
    'size-4xl': { fontSize: '3rem' },
  },
}

// State keys that TextStateFeature might store on text nodes
const stateKeys = ['color', 'backgroundColor', 'fontSize']

function getTextStateStyles(node: any): React.CSSProperties | undefined {
  const styles: React.CSSProperties = {}
  let hasStyles = false

  for (const key of stateKeys) {
    const value = node[key]
    if (value && stateStyleMap[key]?.[value]) {
      Object.assign(styles, stateStyleMap[key][value])
      hasStyles = true
    }
  }

  // Also check for a generic style object on the node
  if (node.style) {
    try {
      const parsed = typeof node.style === 'string'
        ? Object.fromEntries(node.style.split(';').filter(Boolean).map((s: string) => s.split(':').map((v: string) => v.trim())))
        : node.style
      Object.assign(styles, parsed)
      hasStyles = true
    } catch {
      // ignore parse errors
    }
  }

  return hasStyles ? styles : undefined
}

function renderNode(node: any, key: number): React.ReactNode {
  if (!node) return null

  // Text node
  if (node.type === 'text') {
    let text: React.ReactNode = node.text
    if (node.format & 1) text = <strong>{text}</strong>
    if (node.format & 2) text = <em>{text}</em>
    if (node.format & 4) text = <s>{text}</s>
    if (node.format & 8) text = <u>{text}</u>
    if (node.format & 16) text = <code>{text}</code>
    if (node.format & 32) text = <sub>{text}</sub>
    if (node.format & 64) text = <sup>{text}</sup>

    // Apply TextStateFeature styles (color, backgroundColor, fontSize)
    const inlineStyles = getTextStateStyles(node)
    if (inlineStyles) {
      text = <span style={inlineStyles}>{text}</span>
    }

    return <React.Fragment key={key}>{text}</React.Fragment>
  }

  // Linebreak
  if (node.type === 'linebreak') {
    return <br key={key} />
  }

  const children = node.children?.map((child: any, i: number) => renderNode(child, i))

  // Heading
  if (node.type === 'heading') {
    const tag = node.tag || 'h2'
    if (tag === 'h1') return <h1 key={key}>{children}</h1>
    if (tag === 'h2') return <h2 key={key}>{children}</h2>
    if (tag === 'h3') return <h3 key={key}>{children}</h3>
    if (tag === 'h4') return <h4 key={key}>{children}</h4>
    if (tag === 'h5') return <h5 key={key}>{children}</h5>
    if (tag === 'h6') return <h6 key={key}>{children}</h6>
    return <h2 key={key}>{children}</h2>
  }

  // Paragraph
  if (node.type === 'paragraph') {
    return <p key={key}>{children}</p>
  }

  // List
  if (node.type === 'list') {
    const Tag = node.listType === 'number' ? 'ol' : 'ul'
    return <Tag key={key}>{children}</Tag>
  }

  // List item
  if (node.type === 'listitem') {
    return <li key={key}>{children}</li>
  }

  // Link
  if (node.type === 'link' || node.type === 'autolink') {
    const url = node.fields?.url || node.url || '#'
    const target = node.fields?.newTab ? '_blank' : undefined
    return (
      <a key={key} href={url} target={target} rel={target ? 'noopener noreferrer' : undefined}>
        {children}
      </a>
    )
  }

  // Quote
  if (node.type === 'quote') {
    return <blockquote key={key}>{children}</blockquote>
  }

  // Horizontal rule
  if (node.type === 'horizontalrule') {
    return <hr key={key} />
  }

  // Upload / Image
  if (node.type === 'upload') {
    const value = node.value
    if (value?.url) {
      return (
        <figure key={key}>
          <img src={value.url} alt={value.alt || ''} />
        </figure>
      )
    }
    return null
  }

  // Fallback: render children
  if (children) {
    return <React.Fragment key={key}>{children}</React.Fragment>
  }

  return null
}

export function RichText({ content }: { content: any }) {
  if (!content?.root?.children) return null

  return (
    <div className="rich-text">
      {content.root.children.map((node: any, i: number) => renderNode(node, i))}
    </div>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

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

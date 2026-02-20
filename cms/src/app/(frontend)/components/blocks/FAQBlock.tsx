'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { LinkButton } from '../LinkButton'

function FAQItem({ question, answer }: { question: string; answer: any }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        <span>{question}</span>
        <span className="faq-icon">+</span>
      </button>
      <div className="faq-answer">
        {renderFAQAnswer(answer)}
      </div>
    </div>
  )
}

function renderFAQAnswer(content: any): React.ReactNode {
  if (!content?.root?.children) return null

  return content.root.children.map((node: any, i: number) => {
    if (node.type === 'paragraph') {
      return (
        <p key={i}>
          {node.children?.map((child: any, j: number) => renderTextNode(child, j))}
        </p>
      )
    }
    if (node.type === 'list') {
      const Tag = node.listType === 'number' ? 'ol' : 'ul'
      return (
        <Tag key={i}>
          {node.children?.map((li: any, j: number) => (
            <li key={j}>
              {li.children?.map((child: any, k: number) => renderTextNode(child, k))}
            </li>
          ))}
        </Tag>
      )
    }
    return null
  })
}

function renderTextNode(node: any, key: number): React.ReactNode {
  if (node.type === 'text') {
    let text: React.ReactNode = node.text
    if (node.format & 1) text = <strong key={key}>{text}</strong>
    if (node.format & 2) text = <em key={key}>{text}</em>
    return text
  }
  if (node.type === 'link') {
    return (
      <a key={key} href={node.fields?.url || '#'}>
        {node.children?.map((child: any, i: number) => renderTextNode(child, i))}
      </a>
    )
  }
  return null
}

export function FAQBlock({ block }: { block: any }) {
  const { heading, headingColor, items, links, backgroundColor } = block
  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : 'bg-white'

  if (!items || items.length === 0) return null

  return (
    <section className={`block-faq ${bgClass}`}>
      <div className="faq-inner">
        {heading && (
          <h2 style={headingColor ? { color: headingColor } : undefined}>{heading}</h2>
        )}
        {items.map((item: any, i: number) => (
          <FAQItem key={item.id || i} question={item.question} answer={item.answer} />
        ))}
        {links && links.length > 0 && (
          <div className="block-actions">
            {links.map((link: any, i: number) => (
              <LinkButton key={link.id || i} link={link} className={`btn btn-${link.style || 'primary'}`} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

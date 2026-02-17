/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

export function ComingSoonBlock({ block }: { block: any }) {
  const { heading, description, emoji, backgroundColor } = block

  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : ''

  return (
    <section className={`block-coming-soon ${bgClass}`}>
      <div className="coming-soon-inner">
        {emoji && <div className="coming-soon-emoji">{emoji}</div>}
        {heading && <h2>{heading}</h2>}
        {description && <p>{description}</p>}
      </div>
    </section>
  )
}

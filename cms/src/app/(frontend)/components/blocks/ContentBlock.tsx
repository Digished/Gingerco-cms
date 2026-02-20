/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { RichText } from '../RichText'
import { LinkButton } from '../LinkButton'

export function ContentBlock({ block }: { block: any }) {
  const { layout = 'full', richText, image, backgroundColor, headingColor, links } = block
  const layoutClass = `layout-${layout}`
  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : 'bg-white'

  return (
    <section
      className={`block-content ${layoutClass} ${bgClass}`}
      style={headingColor ? ({ '--section-heading-color': headingColor } as React.CSSProperties) : undefined}
    >
      <div className="content-inner">
        <div className="content-text">
          <RichText content={richText} />
        </div>
        {image?.url && (layout === 'text-image' || layout === 'image-text') && (
          <div className="content-image">
            <img src={image.url} alt={image.alt || ''} loading="lazy" />
          </div>
        )}
      </div>
      {links && links.length > 0 && (
        <div className="block-actions">
          {links.map((link: any, i: number) => (
            <LinkButton key={link.id || i} link={link} className={`btn btn-${link.style || 'primary'}`} />
          ))}
        </div>
      )}
    </section>
  )
}

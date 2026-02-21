/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { RichText } from '../RichText'
import { LinkButton } from '../LinkButton'

export function ContentBlock({ block }: { block: any }) {
  const { layout = 'full', richText, image, backgroundColor, links } = block
  const layoutClass = `layout-${layout}`
  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : 'bg-white'

  return (
    <section className={`block-content ${layoutClass} ${bgClass}`}>
      <div className="content-inner">
        <div className="content-text">
          <RichText content={richText} />
          {links && links.length > 0 && (
            <div className="content-links">
              {links.map((link: any, i: number) => (
                <LinkButton
                  key={link.id || i}
                  link={link}
                  style={link.style || 'primary'}
                />
              ))}
            </div>
          )}
        </div>
        {image?.url && (layout === 'text-image' || layout === 'image-text') && (
          <div className="content-image">
            <img src={image.url} alt={image.alt || ''} loading="lazy" />
          </div>
        )}
      </div>
    </section>
  )
}

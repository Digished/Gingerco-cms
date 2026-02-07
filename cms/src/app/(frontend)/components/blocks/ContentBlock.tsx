/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { RichText } from '../RichText'

export function ContentBlock({ block }: { block: any }) {
  const { layout = 'full', richText, image } = block
  const layoutClass = `layout-${layout}`

  return (
    <section className={`block-content ${layoutClass}`}>
      <div className="content-inner">
        <div className="content-text">
          <RichText content={richText} />
        </div>
        {image?.url && (layout === 'text-image' || layout === 'image-text') && (
          <div className="content-image">
            <img src={image.url} alt={image.alt || ''} />
          </div>
        )}
      </div>
    </section>
  )
}

import React from 'react'
import { HeroBlock } from './blocks/HeroBlock'
import { ContentBlock } from './blocks/ContentBlock'
import { EventsListBlock } from './blocks/EventsListBlock'
import { GalleryBlock } from './blocks/GalleryBlock'
import { CTABlock } from './blocks/CTABlock'
import { FAQBlock } from './blocks/FAQBlock'
import { FormBlockComponent } from './blocks/FormBlockComponent'

/* eslint-disable @typescript-eslint/no-explicit-any */
const blockComponents: Record<string, React.FC<{ block: any }>> = {
  hero: HeroBlock,
  content: ContentBlock,
  eventsList: EventsListBlock,
  gallery: GalleryBlock,
  cta: CTABlock,
  faq: FAQBlock,
  formBlock: FormBlockComponent,
}

export function RenderBlocks({ blocks }: { blocks: any[] }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, i) => {
        const Component = blockComponents[block.blockType]
        if (!Component) return null
        return <Component key={block.id || i} block={block} />
      })}
    </>
  )
}

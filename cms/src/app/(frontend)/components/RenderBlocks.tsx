import React from 'react'
import { HeroBlock } from './blocks/HeroBlock'
import { ContentBlock } from './blocks/ContentBlock'
import { AboutSectionBlock } from './blocks/AboutSectionBlock'
import { ShowcaseSectionBlock } from './blocks/ShowcaseSectionBlock'
import { EventsListBlock } from './blocks/EventsListBlock'
import { GalleryBlock } from './blocks/GalleryBlock'
import { CTABlock } from './blocks/CTABlock'
import { FAQBlock } from './blocks/FAQBlock'
import { FormBlockComponent } from './blocks/FormBlockComponent'
import { CountdownTimerBlock } from './blocks/CountdownTimerBlock'
import { TeamBlockComponent } from './blocks/TeamBlockComponent'
import { TestimonialsBlock } from './blocks/TestimonialsBlock'
import { BlogListBlock } from './blocks/BlogListBlock'
import { BulletListBlock } from './blocks/BulletListBlock'
import { SplitContentBlock } from './blocks/SplitContentBlock'
import { PopupModalBlock } from './blocks/PopupModalBlock'
import { PartnerSectionBlock } from './blocks/PartnerSectionBlock'
import { ComingSoonBlock } from './blocks/ComingSoonBlock'

/* eslint-disable @typescript-eslint/no-explicit-any */
const blockComponents: Record<string, React.FC<{ block: any }>> = {
  hero: HeroBlock,
  content: ContentBlock,
  'about-section': AboutSectionBlock,
  'showcase-section': ShowcaseSectionBlock,
  eventsList: EventsListBlock as any,
  gallery: GalleryBlock,
  cta: CTABlock,
  faq: FAQBlock,
  formBlock: FormBlockComponent,
  countdownTimer: CountdownTimerBlock,
  team: TeamBlockComponent as any,
  testimonials: TestimonialsBlock,
  blogList: BlogListBlock as any,
  bulletList: BulletListBlock,
  splitContent: SplitContentBlock as any,
  popupModal: PopupModalBlock,
  partnerSection: PartnerSectionBlock as any,
  comingSoon: ComingSoonBlock,
}

export function RenderBlocks({ blocks }: { blocks: any[] }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, i) => {
        if (block.hidden) return null
        const Component = blockComponents[block.blockType]
        if (!Component) return null
        return <Component key={block.id || i} block={block} />
      })}
    </>
  )
}

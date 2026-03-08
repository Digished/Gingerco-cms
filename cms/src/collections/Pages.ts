import type { Block, CollectionConfig } from 'payload'
import { isValidRelation, sanitiseLinkRow } from '../fields/linkFields'
import { Hero } from '../blocks/Hero'
import { Content } from '../blocks/Content'
import { AboutSection } from '../blocks/AboutSection'
import { ShowcaseSection } from '../blocks/ShowcaseSection'
import { EventsList } from '../blocks/EventsList'
import { Gallery } from '../blocks/Gallery'
import { CallToAction } from '../blocks/CallToAction'
import { FAQ } from '../blocks/FAQ'
import { FormBlock } from '../blocks/FormBlock'
import { CountdownTimer } from '../blocks/CountdownTimer'
import { TeamBlock } from '../blocks/TeamBlock'
import { Testimonials } from '../blocks/Testimonials'
import { BlogList } from '../blocks/BlogList'
import { BulletList } from '../blocks/BulletList'
import { SplitContent } from '../blocks/SplitContent'
import { PopupModal } from '../blocks/PopupModal'
import { PartnerSection } from '../blocks/PartnerSection'
import { ComingSoon } from '../blocks/ComingSoon'
import { NewsletterBlock } from '../blocks/NewsletterBlock'

/** Strip empty/invalid link rows from a block's links array before validation. */
function cleanBlockLinks(block: Record<string, unknown>): Record<string, unknown> {
  if (!Array.isArray(block?.links)) return block
  const cleaned = (block.links as Record<string, unknown>[])
    // sanitiseLinkRow strips UUID string `id`s (prevents "invalid: id" UUID errors),
    // preserves integer `id`s (so Payload can UPDATE existing rows), and nulls
    // out empty relationship objects (prevents "invalid: id" relation errors).
    .map(sanitiseLinkRow)
    .filter((link) => {
      // Drop rows that have no label and no meaningful target
      const hasLabel = Boolean(link?.label)
      const hasUrl = Boolean(link?.url)
      const hasTarget = link?.page || link?.event || link?.blogPost || link?.teamMember || link?.popupForm
      return hasLabel || hasUrl || hasTarget
    })
  return { ...block, links: cleaned }
}

/** Inject a hidden toggle into every block so editors can hide blocks without deleting them. */
function withVisibility(blocks: Block[]): Block[] {
  return blocks.map((block) => ({
    ...block,
    fields: [
      {
        name: 'hidden',
        type: 'checkbox' as const,
        defaultValue: false,
        admin: {
          description: 'Hide this block on the frontend without deleting it.',
        },
      },
      ...block.fields,
    ],
  }))
}

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.slug && typeof data.slug === 'string') {
          data.slug = data.slug.replace(/\s+/g, '_')
        }
        // Sanitise link rows in every block before Payload validates relationships
        if (Array.isArray(data?.layout)) {
          data.layout = data.layout.map(cleanBlockLinks)
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL path for this page (e.g. "about" becomes /about).',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: withVisibility([Hero, Content, AboutSection, ShowcaseSection, EventsList, Gallery, CallToAction, FAQ, FormBlock, CountdownTimer, TeamBlock, Testimonials, BlogList, BulletList, SplitContent, PopupModal, PartnerSection, ComingSoon, NewsletterBlock]),
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      admin: {
        description: 'Search engine optimization settings.',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Custom title for search engines. Defaults to page title if empty.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 160,
          admin: {
            description: 'Short description for search engine results (max 160 characters).',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Image used when sharing on social media.',
          },
        },
      ],
    },
  ],
}

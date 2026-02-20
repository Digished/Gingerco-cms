import type { Block, CollectionConfig } from 'payload'
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
        if (data.slug && typeof data.slug === 'string') {
          data.slug = data.slug.replace(/\s+/g, '_')
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
      blocks: withVisibility([Hero, Content, AboutSection, ShowcaseSection, EventsList, Gallery, CallToAction, FAQ, FormBlock, CountdownTimer, TeamBlock, Testimonials, BlogList, BulletList, SplitContent, PopupModal, PartnerSection, ComingSoon]),
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

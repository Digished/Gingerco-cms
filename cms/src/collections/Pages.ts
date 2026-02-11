import type { CollectionConfig, TextFieldSingleValidation } from 'payload'
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

const validateUniqueSlug: TextFieldSingleValidation = async (value, { req, id }) => {
  if (!value || !req?.payload) return true
  const existing = await req.payload.find({
    collection: 'pages',
    where: {
      slug: { equals: value },
      ...(id ? { id: { not_equals: id } } : {}),
    },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    return 'A page with this slug already exists.'
  }
  return true
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
    maxPerDoc: 25,
    drafts: {
      autosave: true,
    },
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
      index: true,
      validate: validateUniqueSlug,
      admin: {
        position: 'sidebar',
        description: 'URL path for this page (e.g. "about" becomes /about).',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      blocks: [Hero, Content, AboutSection, ShowcaseSection, EventsList, Gallery, CallToAction, FAQ, FormBlock, CountdownTimer, TeamBlock, Testimonials, BlogList, BulletList, SplitContent, PopupModal, PartnerSection, ComingSoon],
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

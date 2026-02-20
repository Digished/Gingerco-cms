import type { Block } from 'payload'
import { linkFields } from '../fields/linkFields'

export const AboutSection: Block = {
  slug: 'about-section',
  labels: {
    singular: 'About Section',
    plural: 'About Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      defaultValue: 'ABOUT US',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description: 'The main text content (right column)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'The main image (left column)',
      },
    },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Image Left / Text Right', value: 'left' },
        { label: 'Image Right / Text Left', value: 'right' },
      ],
    },
    {
      name: 'imageCaption',
      type: 'group',
      admin: {
        description: 'Optional caption/badge shown below the image',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Caption title (e.g. "GINGER & CO. STUDIO")',
          },
        },
        {
          name: 'badge',
          type: 'text',
          admin: {
            description: 'Highlighted badge text (e.g. "— COMING SOON")',
          },
        },
        {
          name: 'badgeColor',
          type: 'text',
          defaultValue: '#D4AF37',
          admin: {
            description: 'Color for the badge text (e.g. #D4AF37 for gold)',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Short description below the title',
          },
        },
      ],
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 3,
      fields: [
        ...linkFields,
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (Filled)', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Gray', value: 'light-gray' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}

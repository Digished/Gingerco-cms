import type { Block } from 'payload'
import { linkFields } from '../fields/linkFields'

export const Content: Block = {
  slug: 'content',
  labels: {
    singular: 'Content Section',
    plural: 'Content Sections',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'full',
      options: [
        { label: 'Full Width', value: 'full' },
        { label: 'Two Columns', value: 'two-column' },
        { label: 'Text Left / Image Right', value: 'text-image' },
        { label: 'Image Left / Text Right', value: 'image-text' },
      ],
    },
    {
      name: 'richText',
      type: 'richText',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) =>
          siblingData?.layout === 'text-image' || siblingData?.layout === 'image-text',
      },
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

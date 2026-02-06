import type { Block } from 'payload'

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
  ],
}

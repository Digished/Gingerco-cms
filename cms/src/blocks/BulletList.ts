import type { Block } from 'payload'
import { linkFields } from '../fields/linkFields'

export const BulletList: Block = {
  slug: 'bulletList',
  labels: {
    singular: 'Bullet List Section',
    plural: 'Bullet List Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      admin: {
        description: 'Section heading (e.g. "Partnership Benefits")',
      },
    },
    {
      name: 'headingColor',
      type: 'text',
      admin: {
        description: 'Custom heading color for this section (hex, e.g. #E85D3A).',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional intro text below the heading.',
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '1',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
      ],
      admin: {
        description: 'Split bullet lists into 1 or 2 columns.',
      },
    },
    {
      name: 'lists',
      type: 'array',
      minRows: 1,
      maxRows: 2,
      admin: {
        description: 'Each list gets its own heading and bullet items. Use 2 lists with 2-column layout for side-by-side lists.',
      },
      fields: [
        {
          name: 'listHeading',
          type: 'text',
          admin: {
            description: 'Optional heading for this list column.',
          },
        },
        {
          name: 'items',
          type: 'array',
          minRows: 1,
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'bulletColor',
      type: 'text',
      defaultValue: '#D4AF37',
      admin: {
        description: 'Custom color for bullet points (hex). Defaults to gold.',
      },
    },
    {
      name: 'bulletStyle',
      type: 'select',
      defaultValue: 'dot',
      options: [
        { label: 'Dot', value: 'dot' },
        { label: 'Dash', value: 'dash' },
        { label: 'Check', value: 'check' },
        { label: 'Arrow', value: 'arrow' },
      ],
    },
    {
      name: 'links',
      type: 'array',
      label: 'Action Buttons',
      maxRows: 3,
      admin: {
        description: 'Add action buttons below the list.',
      },
      fields: [
        ...linkFields,
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
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

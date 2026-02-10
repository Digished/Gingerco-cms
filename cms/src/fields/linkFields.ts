import type { Field } from 'payload'

/**
 * Reusable link fields for internal page or external URL linking.
 * Use inside array or group fields across blocks and globals.
 */
export const linkFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
  },
  {
    name: 'linkType',
    type: 'radio',
    defaultValue: 'custom',
    options: [
      { label: 'Internal Page', value: 'page' },
      { label: 'Custom URL', value: 'custom' },
    ],
  },
  {
    name: 'page',
    type: 'relationship',
    relationTo: 'pages',
    admin: {
      condition: (_, siblingData) => siblingData?.linkType === 'page',
    },
  },
  {
    name: 'url',
    type: 'text',
    admin: {
      condition: (_, siblingData) => siblingData?.linkType === 'custom',
    },
  },
  {
    name: 'newTab',
    type: 'checkbox',
    defaultValue: false,
  },
]

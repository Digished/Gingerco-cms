import type { Block } from 'payload'
import { linkFields } from '../fields/linkFields'

export const PartnerSection: Block = {
  slug: 'partnerSection',
  labels: {
    singular: 'Partner Section',
    plural: 'Partner Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Event Partners',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'partners',
      type: 'relationship',
      relationTo: 'partners' as any,
      hasMany: true,
      admin: {
        description: 'Select partners/sponsors to display.',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Logo Grid', value: 'grid' },
        { label: 'Logo Row (Scrollable)', value: 'row' },
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
  ],
}

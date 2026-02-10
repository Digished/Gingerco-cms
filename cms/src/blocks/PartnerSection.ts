import type { Block } from 'payload'

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
  ],
}

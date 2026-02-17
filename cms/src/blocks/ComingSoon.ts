import type { Block } from 'payload'

export const ComingSoon: Block = {
  slug: 'comingSoon',
  labels: {
    singular: 'Coming Soon Section',
    plural: 'Coming Soon Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'More Details Coming Soon',
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Message to display (e.g. "Check back in a few days to secure your spot.")',
      },
    },
    {
      name: 'emoji',
      type: 'text',
      defaultValue: '',
      admin: {
        description: 'Optional emoji or icon text displayed above the heading.',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'light-gray',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Gray', value: 'light-gray' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}

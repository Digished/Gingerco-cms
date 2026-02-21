import type { Block } from 'payload'
import { linkFields } from '../fields/linkFields'

export const TeamBlock: Block = {
  slug: 'team',
  labels: {
    singular: 'Team Section',
    plural: 'Team Sections',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Meet Our Team',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'showAll',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show all team members. Uncheck to select specific members.',
      },
    },
    {
      name: 'selectedMembers',
      type: 'relationship',
      relationTo: 'team-members',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => !siblingData?.showAll,
        description: 'Choose which team members to display.',
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
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

import type { CollectionConfig } from 'payload'

export const Partners: CollectionConfig = {
  slug: 'partners',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        description: 'Link to partner website.',
      },
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'partner',
      options: [
        { label: 'Partner', value: 'partner' },
        { label: 'Sponsor', value: 'sponsor' },
        { label: 'Media Partner', value: 'media' },
        { label: 'Ticket Vendor', value: 'vendor' },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of the partnership.',
      },
    },
  ],
}

import type { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'status', 'subscribedAt'],
    group: 'Email',
    description: 'Manage newsletter subscribers. Use the public /api/subscribe endpoint for opt-in forms.',
  },
  access: {
    // Public: anyone can create a subscriber (subscribe form)
    create: () => true,
    // Admin only for everything else
    read: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create') {
          if (!data.unsubscribeToken) {
            data.unsubscribeToken = crypto.randomBytes(32).toString('hex')
          }
          if (!data.subscribedAt) {
            data.subscribedAt = new Date().toISOString()
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'firstName',
      type: 'text',
    },
    {
      name: 'lastName',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'subscribed',
      options: [
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
        { label: 'Pending (awaiting confirmation)', value: 'pending' },
        { label: 'Bounced', value: 'bounced' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags / Segments',
      admin: {
        position: 'sidebar',
        description: 'Tag subscribers to send targeted campaigns.',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Where they signed up (e.g. "homepage", "event-page", "manual").',
      },
    },
    {
      name: 'subscribedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Date when this subscriber was added.',
        readOnly: true,
      },
    },
    {
      name: 'unsubscribeToken',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Auto-generated token used to generate one-click unsubscribe links.',
        readOnly: true,
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Internal notes about this subscriber (not visible to the subscriber).',
      },
    },
  ],
}

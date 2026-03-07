import type { CollectionConfig } from 'payload'
import crypto from 'crypto'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'firstName', 'lastName', 'status', 'subscribedAt'],
    group: 'Email',
    description: 'Manage people who have signed up for your newsletter. New subscribers receive a confirmation email and are activated once they click the link.',
  },
  access: {
    create: () => true,
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
          if (!data.confirmationToken) {
            data.confirmationToken = crypto.randomBytes(32).toString('hex')
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
      defaultValue: 'pending',
      options: [
        { label: 'Pending (awaiting confirmation)', value: 'pending' },
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
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
        description: 'Date when this subscriber confirmed their subscription.',
        readOnly: true,
      },
    },
    {
      name: 'unsubscribeToken',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Auto-generated token used in every email unsubscribe link.',
        readOnly: true,
      },
    },
    {
      name: 'confirmationToken',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'Auto-generated token sent in the double opt-in confirmation email.',
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

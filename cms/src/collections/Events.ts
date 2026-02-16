import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'status', 'date', 'location'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Cancelled', value: 'cancelled' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Details',
          fields: [
            {
              name: 'description',
              type: 'richText',
            },
            {
              name: 'shortDescription',
              type: 'textarea',
              maxLength: 300,
            },
            {
              name: 'featuredImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'gallery',
              type: 'array',
              admin: {
                description: 'Optional gallery images for the event detail page.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
            {
              name: 'videoUrl',
              type: 'text',
              admin: {
                description: 'Optional video URL (MP4) for the event detail page.',
              },
            },
            {
              name: 'eventType',
              type: 'select',
              options: [
                { label: 'Class', value: 'class' },
                { label: 'Workshop', value: 'workshop' },
                { label: 'Event', value: 'event' },
                { label: 'Performance', value: 'performance' },
              ],
            },
          ],
        },
        {
          label: 'Schedule',
          fields: [
            {
              name: 'date',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'endDate',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
            {
              name: 'recurring',
              type: 'checkbox',
              defaultValue: false,
            },
            {
              name: 'recurrencePattern',
              type: 'select',
              options: [
                { label: 'Weekly', value: 'weekly' },
                { label: 'Bi-weekly', value: 'biweekly' },
                { label: 'Monthly', value: 'monthly' },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.recurring,
              },
            },
          ],
        },
        {
          label: 'Location & Pricing',
          fields: [
            {
              name: 'location',
              type: 'text',
            },
            {
              name: 'address',
              type: 'textarea',
            },
            {
              name: 'price',
              type: 'number',
              min: 0,
            },
            {
              name: 'currency',
              type: 'select',
              defaultValue: 'EUR',
              options: [
                { label: 'EUR', value: 'EUR' },
                { label: 'USD', value: 'USD' },
              ],
            },
            {
              name: 'capacity',
              type: 'number',
              min: 0,
              admin: {
                description: 'Maximum number of participants. Leave empty for unlimited.',
              },
            },
          ],
        },
        {
          label: 'Sessions',
          fields: [
            {
              name: 'sessions',
              type: 'array',
              admin: {
                description: 'Add individual time slots for this event.',
              },
              fields: [
                {
                  name: 'sessionTitle',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'startTime',
                  type: 'date',
                  required: true,
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
                {
                  name: 'endTime',
                  type: 'date',
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
                {
                  name: 'sessionCapacity',
                  type: 'number',
                  min: 0,
                },
                {
                  name: 'sessionPrice',
                  type: 'number',
                  min: 0,
                },
                {
                  name: 'instructor',
                  type: 'text',
                },
              ],
            },
          ],
        },
        {
          label: 'Partners & Sponsors',
          fields: [
            {
              name: 'sponsors',
              type: 'relationship',
              relationTo: 'partners' as any,
              hasMany: true,
              admin: {
                description: 'Select sponsors/partners for this event.',
              },
            },
          ],
        },
        {
          label: 'Registration',
          fields: [
            {
              name: 'ctaLabel',
              type: 'text',
              defaultValue: 'Register Now',
              admin: {
                description: 'Button text for the registration CTA.',
              },
            },
            {
              name: 'ctaAction',
              type: 'select',
              defaultValue: 'navigate',
              options: [
                { label: 'Navigate to URL', value: 'navigate' },
                { label: 'Open Popup Form', value: 'popup-form' },
              ],
              admin: {
                description: 'What happens when the CTA button is clicked.',
              },
            },
            {
              name: 'externalRegistrationUrl',
              type: 'text',
              admin: {
                description: 'Registration URL (external ticketing page, etc.).',
                condition: (_, siblingData) => siblingData?.ctaAction === 'navigate',
              },
            },
            {
              name: 'ctaNewTab',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Open link in new tab.',
                condition: (_, siblingData) => siblingData?.ctaAction === 'navigate',
              },
            },
            {
              name: 'registrationForm',
              type: 'relationship',
              relationTo: 'forms',
              admin: {
                description: 'Select which form to show in the popup.',
                condition: (_, siblingData) => siblingData?.ctaAction === 'popup-form',
              },
            },
            {
              name: 'ctaRedirectUrl',
              type: 'text',
              admin: {
                description: 'Optional: Redirect to this URL after form is submitted.',
                condition: (_, siblingData) => siblingData?.ctaAction === 'popup-form',
              },
            },
            {
              name: 'registrationDeadline',
              type: 'date',
            },
            {
              name: 'registrationEnabled',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description: 'Uncheck to hide the registration CTA section entirely.',
              },
            },
          ],
        },
      ],
    },
  ],
}

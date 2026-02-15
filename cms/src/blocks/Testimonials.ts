import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonials / Community',
    plural: 'Testimonials / Community',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'COMMUNITY',
      admin: {
        description: 'Main section heading',
      },
    },
    {
      name: 'intro',
      type: 'textarea',
      admin: {
        description: 'Intro paragraph below the heading',
      },
    },
    {
      name: 'subLabel',
      type: 'text',
      defaultValue: 'TESTIMONIALS',
      admin: {
        description: 'Small highlighted label above the testimonial cards (e.g. "TESTIMONIALS")',
      },
    },
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      fields: [
        {
          name: 'type',
          type: 'radio',
          defaultValue: 'text',
          options: [
            { label: 'Text Quote', value: 'text' },
            { label: 'Video Testimonial', value: 'video' },
          ],
        },
        {
          name: 'quote',
          type: 'textarea',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'text',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Name or initial (e.g. "S." or "Video Testimonial")',
          },
        },
        {
          name: 'role',
          type: 'text',
          admin: {
            description: 'e.g. "Regular Attendee"',
            condition: (_, siblingData) => siblingData?.type === 'text',
          },
        },
        {
          name: 'photo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'For text: optional author photo. For video: poster/thumbnail image.',
          },
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            description: 'Star rating from 1 to 5',
            condition: (_, siblingData) => siblingData?.type === 'text',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          admin: {
            description: 'Direct URL to video file (MP4)',
            condition: (_, siblingData) => siblingData?.type === 'video',
          },
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

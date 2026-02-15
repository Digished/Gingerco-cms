import type { Block } from 'payload'

export const CountdownTimer: Block = {
  slug: 'countdownTimer',
  labels: {
    singular: 'Countdown Timer',
    plural: 'Countdown Timers',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. "Next Class Starts In" or "Event Countdown"',
      },
    },
    {
      name: 'targetDate',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'The date and time to count down to.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional text shown below the countdown.',
      },
    },
    {
      name: 'link',
      type: 'group',
      fields: [
        {
          name: 'label',
          type: 'text',
          admin: {
            description: 'Button text (e.g. "Register Now").',
          },
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
      ],
    },
    {
      name: 'expiredMessage',
      type: 'text',
      defaultValue: 'This event has started!',
      admin: {
        description: 'Message shown after the countdown reaches zero.',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'dark',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Gray', value: 'light-gray' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}

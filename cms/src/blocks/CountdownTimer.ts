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
          name: 'url',
          type: 'text',
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
  ],
}

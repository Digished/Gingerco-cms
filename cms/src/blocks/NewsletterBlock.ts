import type { Block } from 'payload'

export const NewsletterBlock: Block = {
  slug: 'newsletterBlock',
  labels: {
    singular: 'Newsletter Signup',
    plural: 'Newsletter Signups',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Stay in the loop',
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Short text shown below the heading.',
      },
    },
    {
      name: 'collectFirstName',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Add a First Name field to the form.',
      },
    },
    {
      name: 'collectLastName',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Add a Last Name field to the form.',
      },
    },
    {
      name: 'submitButtonLabel',
      type: 'text',
      defaultValue: 'Subscribe',
    },
    {
      name: 'successMessage',
      type: 'text',
      defaultValue: 'Thanks for subscribing!',
      admin: {
        description: 'Shown after the form is submitted successfully.',
      },
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        description: 'Internal label for where this signup came from (e.g. "homepage-footer"). Saved with each subscriber.',
      },
    },
    {
      name: 'tags',
      type: 'text',
      admin: {
        description: 'Comma-separated tags to assign to new subscribers (e.g. "newsletter,launch").',
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
    {
      name: 'alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
      ],
    },
  ],
}

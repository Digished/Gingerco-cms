import type { Block } from 'payload'

export const FormBlock: Block = {
  slug: 'formBlock',
  labels: {
    singular: 'Form',
    plural: 'Forms',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      required: true,
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
      name: 'accentColor',
      type: 'select',
      defaultValue: 'gold',
      options: [
        { label: 'Gold', value: 'gold' },
        { label: 'Coral', value: 'coral' },
        { label: 'Dark', value: 'dark' },
        { label: 'White', value: 'white' },
      ],
      admin: {
        description: 'Accent color for form borders, focus states, and submit button',
      },
    },
    {
      name: 'formStyle',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Bordered', value: 'bordered' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Rounded', value: 'rounded' },
      ],
      admin: {
        description: 'Visual style of the form fields and container',
      },
    },
  ],
}

import type { Block } from 'payload'

export const PopupModal: Block = {
  slug: 'popupModal',
  labels: {
    singular: 'Popup Modal',
    plural: 'Popup Modals',
  },
  fields: [
    {
      name: 'triggerLabel',
      type: 'text',
      required: true,
      defaultValue: 'Open Form',
      admin: {
        description: 'Text shown on the button that opens the modal.',
      },
    },
    {
      name: 'triggerStyle',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary (Filled)', value: 'primary' },
        { label: 'Outline', value: 'outline' },
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
    {
      name: 'modalHeading',
      type: 'text',
      admin: {
        description: 'Heading shown at the top of the modal.',
      },
    },
    {
      name: 'modalSubtitle',
      type: 'textarea',
      admin: {
        description: 'Subtitle text below the modal heading.',
      },
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      admin: {
        description: 'Form to display inside the modal.',
      },
    },
  ],
}

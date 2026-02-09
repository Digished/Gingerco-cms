import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: {
    singular: 'Hero Section',
    plural: 'Hero Sections',
  },
  fields: [
    {
      name: 'headingSegments',
      label: 'Heading Text Segments',
      type: 'array',
      minRows: 1,
      admin: {
        description: 'Build your heading by adding text segments. Each segment can have its own color and style.',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          admin: {
            description: 'The text for this segment (e.g. "GINGER & CO.")',
          },
        },
        {
          name: 'color',
          type: 'text',
          admin: {
            description: 'Custom color for this text (e.g. #D4AF37 for gold). Leave empty for default white.',
          },
        },
        {
          name: 'bold',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Make this text segment bold (heavier weight)',
          },
        },
        {
          name: 'lineBreakAfter',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Add a line break after this segment',
          },
        },
      ],
    },
    {
      name: 'subheading',
      type: 'textarea',
      admin: {
        description: 'Optional subtitle text below the heading',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Background image for the hero section',
      },
    },
    {
      name: 'overlay',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Add a dark overlay on the image for better text readability',
      },
    },
    {
      name: 'textAlign',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'minHeight',
      type: 'select',
      defaultValue: '600px',
      admin: {
        description: 'Minimum height of the hero section',
      },
      options: [
        { label: 'Small (400px)', value: '400px' },
        { label: 'Medium (600px)', value: '600px' },
        { label: 'Large (80vh)', value: '80vh' },
        { label: 'Full Screen (100vh)', value: '100vh' },
      ],
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 3,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary (Filled)', value: 'primary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Dark', value: 'dark' },
          ],
        },
      ],
    },
  ],
}

import type { Block } from 'payload'
import { linkFields } from '../fields/linkFields'

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
      name: 'subheadingSize',
      type: 'select',
      defaultValue: 'default',
      admin: {
        description: 'Font size of the subheading text.',
      },
      options: [
        { label: 'Small (0.95rem)', value: 'small' },
        { label: 'Default (1.1rem)', value: 'default' },
        { label: 'Medium (1.4rem)', value: 'medium' },
        { label: 'Large (1.8rem)', value: 'large' },
        { label: 'XL (2.2rem)', value: 'xl' },
        { label: '2XL - Statement (2.8rem)', value: '2xl' },
        { label: '3XL - Hero (3.5rem)', value: '3xl' },
      ],
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
        ...linkFields,
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

import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  admin: {
    group: 'Navigation',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'hashtag',
      type: 'text',
      defaultValue: '#NOPAINNOGINGER',
      admin: {
        description: 'The branded hashtag shown at the top of the footer (e.g. #NOPAINNOGINGER)',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Footer logo image',
      },
    },
    {
      name: 'brandName',
      type: 'text',
      defaultValue: 'Ginger & Co.',
      admin: {
        description: 'Large brand name displayed next to the logo',
      },
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      fields: [
        {
          name: 'heading',
          type: 'text',
        },
        {
          name: 'links',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'icon',
              type: 'select',
              admin: {
                description: 'Optional icon displayed next to the link',
              },
              options: [
                { label: 'None', value: 'none' },
                { label: 'Email', value: 'email' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'LinkedIn', value: 'linkedin' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'YouTube', value: 'youtube' },
                { label: 'X / Twitter', value: 'twitter' },
                { label: 'Phone', value: 'phone' },
                { label: 'Globe / Website', value: 'globe' },
                { label: 'Map Pin', value: 'map-pin' },
                { label: 'Arrow Right', value: 'arrow-right' },
              ],
              defaultValue: 'none',
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
                description: 'Full URL (e.g. https://instagram.com/...) or mailto:email@example.com',
              },
            },
            {
              name: 'newTab',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Open link in a new tab',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'copyright',
      type: 'text',
      defaultValue: 'All rights reserved to Ginger & Co',
    },
    {
      name: 'contactLabel',
      type: 'text',
      defaultValue: 'For more information contact:',
      admin: {
        description: 'Text shown before the contact email in the footer bottom',
      },
    },
    {
      name: 'contactPhone',
      type: 'text',
      defaultValue: '+43 676 7261062',
      admin: {
        description: 'Contact phone number shown in the footer bottom',
      },
    },
    {
      name: 'contactEmail',
      type: 'text',
      defaultValue: 'info@gingerandco.at',
      admin: {
        description: 'Contact email shown in the footer bottom',
      },
    },
  ],
}

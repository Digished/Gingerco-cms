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
      name: 'hashtagAlign',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
      admin: {
        description: 'Position the hashtag to the left, center, or right of the viewport',
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
              name: 'linkCollection',
              type: 'select',
              defaultValue: 'pages',
              options: [
                { label: 'Page', value: 'pages' },
                { label: 'Event', value: 'events' },
                { label: 'Blog Post', value: 'blog-posts' },
                { label: 'Team Member', value: 'team-members' },
              ],
              admin: {
                condition: (_, siblingData) => siblingData?.linkType === 'page',
              },
            },
            {
              name: 'page',
              type: 'relationship',
              relationTo: 'pages',
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.linkType === 'page' &&
                  (!siblingData?.linkCollection || siblingData?.linkCollection === 'pages'),
              },
            },
            {
              name: 'event',
              type: 'relationship',
              relationTo: 'events',
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.linkType === 'page' && siblingData?.linkCollection === 'events',
              },
            },
            {
              name: 'blogPost',
              type: 'relationship',
              relationTo: 'blog-posts',
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.linkType === 'page' && siblingData?.linkCollection === 'blog-posts',
              },
            },
            {
              name: 'teamMember',
              type: 'relationship',
              relationTo: 'team-members',
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.linkType === 'page' && siblingData?.linkCollection === 'team-members',
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
            {
              name: 'linkAction',
              type: 'select',
              defaultValue: 'navigate',
              options: [
                { label: 'Navigate (link)', value: 'navigate' },
                { label: 'Open Popup Form', value: 'popup-form' },
              ],
            },
            {
              name: 'popupForm',
              type: 'relationship',
              relationTo: 'forms',
              admin: {
                description: 'Form to display in a popup when clicked.',
                condition: (_, siblingData) => siblingData?.linkAction === 'popup-form',
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

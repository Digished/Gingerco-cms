import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Admin',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Ginger & Co.',
      required: true,
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      defaultValue: 'Vienna-based Afrobeats fitness company.',
    },
    {
      name: 'contactEmail',
      type: 'email',
    },
    {
      name: 'contactPhone',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'defaultSeoImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Default image used for social media sharing when no page-specific image is set.',
      },
    },
    {
      name: 'googleAnalyticsId',
      type: 'text',
      admin: {
        description: 'Google Analytics measurement ID (e.g. G-XXXXXXXXXX).',
      },
    },
  ],
}

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
      type: 'tabs',
      tabs: [
        {
          label: 'General',
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
          ],
        },
        {
          label: 'Theme',
          fields: [
            {
              name: 'primaryColor',
              type: 'text',
              defaultValue: '#E85D3A',
              admin: {
                description: 'Main brand color used for buttons, links, and accents. Use a hex color code (e.g. #E85D3A).',
              },
            },
            {
              name: 'secondaryColor',
              type: 'text',
              defaultValue: '#F4A261',
              admin: {
                description: 'Secondary accent color. Use a hex color code (e.g. #F4A261).',
              },
            },
            {
              name: 'backgroundColor',
              type: 'text',
              defaultValue: '#FFFAF5',
              admin: {
                description: 'Page background color (e.g. #FFFAF5 for warm cream, #FFFFFF for white).',
              },
            },
            {
              name: 'textColor',
              type: 'text',
              defaultValue: '#2D2D2D',
              admin: {
                description: 'Main text color (e.g. #2D2D2D for dark gray).',
              },
            },
            {
              name: 'headingFont',
              type: 'select',
              defaultValue: 'Playfair Display',
              options: [
                { label: 'Playfair Display (Elegant Serif)', value: 'Playfair Display' },
                { label: 'Merriweather (Classic Serif)', value: 'Merriweather' },
                { label: 'Lora (Modern Serif)', value: 'Lora' },
                { label: 'Poppins (Clean Sans-Serif)', value: 'Poppins' },
                { label: 'Montserrat (Bold Sans-Serif)', value: 'Montserrat' },
                { label: 'Raleway (Light Sans-Serif)', value: 'Raleway' },
                { label: 'Oswald (Strong Sans-Serif)', value: 'Oswald' },
                { label: 'Dancing Script (Handwritten)', value: 'Dancing Script' },
              ],
              admin: {
                description: 'Font used for headings and titles.',
              },
            },
            {
              name: 'bodyFont',
              type: 'select',
              defaultValue: 'Poppins',
              options: [
                { label: 'Poppins (Clean & Modern)', value: 'Poppins' },
                { label: 'Inter (Neutral & Readable)', value: 'Inter' },
                { label: 'Open Sans (Friendly)', value: 'Open Sans' },
                { label: 'Lato (Warm & Professional)', value: 'Lato' },
                { label: 'Nunito (Soft & Rounded)', value: 'Nunito' },
                { label: 'Roboto (Standard)', value: 'Roboto' },
                { label: 'Source Sans 3 (Technical)', value: 'Source Sans 3' },
              ],
              admin: {
                description: 'Font used for body text and paragraphs.',
              },
            },
            {
              name: 'buttonStyle',
              type: 'select',
              defaultValue: 'rounded',
              options: [
                { label: 'Rounded (Pill Shape)', value: 'rounded' },
                { label: 'Slightly Rounded', value: 'slight' },
                { label: 'Square', value: 'square' },
              ],
              admin: {
                description: 'Shape of buttons across the site.',
              },
            },
          ],
        },
        {
          label: 'SEO & Analytics',
          fields: [
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
        },
      ],
    },
  ],
}

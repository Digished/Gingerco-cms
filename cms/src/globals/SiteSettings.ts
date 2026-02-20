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
              defaultValue: 'Vienna-based boutique fitness and lifestyle company',
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
              name: 'favicon',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Site favicon. Upload a .ico, .png (32x32 or 64x64), or .svg file.',
              },
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
          label: 'Floating Buttons',
          description: 'Floating action buttons displayed in the bottom-right corner of the site.',
          fields: [
            {
              name: 'toggleIcon',
              type: 'select',
              defaultValue: 'chat',
              options: [
                { label: 'Plus Sign (+)', value: 'plus' },
                { label: 'Chat / Message', value: 'chat' },
                { label: 'WhatsApp', value: 'whatsapp' },
                { label: 'Phone', value: 'phone' },
                { label: 'Email', value: 'email' },
                { label: 'Calendar / Book', value: 'calendar' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'TikTok', value: 'tiktok' },
                { label: 'Facebook', value: 'facebook' },
                { label: 'Arrow Up', value: 'arrow-up' },
              ],
              admin: {
                description: 'Icon to display on the toggle button (when there are multiple floating buttons). The × will show when expanded.',
              },
            },
            {
              name: 'floatingButtons',
              type: 'array',
              label: 'Buttons',
              maxRows: 5,
              admin: {
                description: 'Add up to 5 floating action buttons. They stack vertically above the toggle button.',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  admin: { description: 'Tooltip / accessible label for the button.' },
                },
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'WhatsApp', value: 'whatsapp' },
                    { label: 'Phone', value: 'phone' },
                    { label: 'Email', value: 'email' },
                    { label: 'Instagram', value: 'instagram' },
                    { label: 'TikTok', value: 'tiktok' },
                    { label: 'Facebook', value: 'facebook' },
                    { label: 'Chat / Message', value: 'chat' },
                    { label: 'Calendar / Book', value: 'calendar' },
                    { label: 'Arrow Up (scroll to top)', value: 'arrow-up' },
                  ],
                },
                {
                  name: 'color',
                  type: 'text',
                  defaultValue: '#25D366',
                  admin: { description: 'Button background colour (hex). Default is WhatsApp green.' },
                },
                {
                  name: 'action',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Open URL / Link', value: 'url' },
                    { label: 'WhatsApp Chat', value: 'whatsapp' },
                    { label: 'Phone Call', value: 'phone' },
                    { label: 'Send Email', value: 'email' },
                    { label: 'Open Popup Form', value: 'popup-form' },
                    { label: 'Scroll to Top', value: 'scroll-top' },
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  admin: {
                    description: 'URL to open (for "Open URL" action).',
                    condition: (_, siblingData) => siblingData?.action === 'url',
                  },
                },
                {
                  name: 'whatsappNumber',
                  type: 'text',
                  admin: {
                    description: 'Phone number with country code, e.g. +436767261062',
                    condition: (_, siblingData) => siblingData?.action === 'whatsapp',
                  },
                },
                {
                  name: 'whatsappMessage',
                  type: 'text',
                  admin: {
                    description: 'Pre-filled message (optional).',
                    condition: (_, siblingData) => siblingData?.action === 'whatsapp',
                  },
                },
                {
                  name: 'phoneNumber',
                  type: 'text',
                  admin: {
                    description: 'Phone number to call.',
                    condition: (_, siblingData) => siblingData?.action === 'phone',
                  },
                },
                {
                  name: 'emailAddress',
                  type: 'text',
                  admin: {
                    description: 'Email address to open.',
                    condition: (_, siblingData) => siblingData?.action === 'email',
                  },
                },
                {
                  name: 'popupForm',
                  type: 'relationship',
                  relationTo: 'forms',
                  admin: {
                    description: 'Form to display in a popup.',
                    condition: (_, siblingData) => siblingData?.action === 'popup-form',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'SEO & Analytics',
          fields: [
            {
              name: 'seoTitle',
              type: 'text',
              defaultValue: 'Vienna-based boutique fitness and lifestyle company',
              admin: {
                description: 'Main SEO title for the homepage (shown in browser tab and search results).',
              },
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
        },
      ],
    },
  ],
}

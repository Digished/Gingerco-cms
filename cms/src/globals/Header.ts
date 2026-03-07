import type { GlobalConfig } from 'payload'
import { isValidRelation } from '../fields/linkFields'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header Navigation',
  admin: {
    group: 'Navigation',
  },
  access: {
    read: () => true,
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (Array.isArray(data?.navItems)) {
          data.navItems = (data.navItems as Record<string, unknown>[]).map((item) => {
            const { id: itemId, ...rest } = item as Record<string, unknown>
            const preservedId = typeof itemId === 'number' ? { id: itemId } : {}
            return {
              ...preservedId,
              ...rest,
              page: isValidRelation(rest.page) ? rest.page : null,
              event: isValidRelation(rest.event) ? rest.event : null,
              blogPost: isValidRelation(rest.blogPost) ? rest.blogPost : null,
              teamMember: isValidRelation(rest.teamMember) ? rest.teamMember : null,
              popupForm: isValidRelation(rest.popupForm) ? rest.popupForm : null,
            }
          })
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'navItems',
      type: 'array',
      maxRows: 8,
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'linkType',
          type: 'radio',
          defaultValue: 'page',
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
          },
        },
        {
          name: 'newTab',
          type: 'checkbox',
          defaultValue: false,
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
}

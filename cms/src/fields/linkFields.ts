import type { Field } from 'payload'

/**
 * Reusable link fields for internal page or external URL linking.
 * Supports linking to Pages, Events, Blog Posts, and Team Members.
 * Use inside array or group fields across blocks and globals.
 */
export const linkFields: Field[] = [
  {
    name: 'label',
    type: 'text',
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
      description: 'Form to display in a popup when this button is clicked.',
      condition: (_, siblingData) => siblingData?.linkAction === 'popup-form',
    },
  },
  {
    name: 'popupRedirectUrl',
    type: 'text',
    admin: {
      description: 'Optional: Redirect to this URL after the popup form is submitted.',
      condition: (_, siblingData) => siblingData?.linkAction === 'popup-form',
    },
  },
]

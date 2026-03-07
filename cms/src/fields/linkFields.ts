import type { Field } from 'payload'

/**
 * Reusable link fields for internal page or external URL linking.
 * Supports linking to Pages, Events, Blog Posts, and Team Members.
 * Use inside array or group fields across blocks and globals.
 */

/** Returns true only if val is a non-empty relationship value (id string/number or populated object). */
export function isValidRelation(val: unknown): boolean {
  if (!val) return false
  if (typeof val === 'string') return val.length > 0
  if (typeof val === 'number') return true
  if (typeof val === 'object' && val !== null && 'id' in val && (val as Record<string, unknown>).id) return true
  return false
}

/**
 * Strip the row `id` and null out any invalid/empty relationship fields from a single link row.
 * Stripping `id` is required because the admin UI assigns a UUID string to new rows, which
 * PostgreSQL rejects as invalid for the auto-increment integer `id` column. Payload replaces
 * array rows with a full delete → insert cycle on every save, so the id is never needed.
 */
export function sanitiseLinkRow(link: Record<string, unknown>): Record<string, unknown> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id: _id, ...rest } = link
  return {
    ...rest,
    page: isValidRelation(rest.page) ? rest.page : null,
    event: isValidRelation(rest.event) ? rest.event : null,
    blogPost: isValidRelation(rest.blogPost) ? rest.blogPost : null,
    teamMember: isValidRelation(rest.teamMember) ? rest.teamMember : null,
    popupForm: isValidRelation(rest.popupForm) ? rest.popupForm : null,
  }
}

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

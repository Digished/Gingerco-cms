import type { Block } from 'payload'
import { linkFields } from '../fields/linkFields'

export const EventsList: Block = {
  slug: 'eventsList',
  labels: {
    singular: 'Events List',
    plural: 'Events Lists',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Upcoming Events',
    },
    {
      name: 'headingColor',
      type: 'text',
      admin: {
        description: 'Custom heading color for this section (hex, e.g. #E85D3A).',
      },
    },
    {
      name: 'showCount',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 20,
      admin: {
        description: 'Number of events to display.',
      },
    },
    {
      name: 'filterByType',
      type: 'select',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Classes', value: 'class' },
        { label: 'Workshops', value: 'workshop' },
        { label: 'Events', value: 'event' },
        { label: 'Performances', value: 'performance' },
      ],
      defaultValue: 'all',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
      ],
    },
    {
      name: 'links',
      type: 'array',
      label: 'Action Buttons',
      maxRows: 3,
      admin: {
        description: 'Add action buttons below the events list.',
      },
      fields: [
        ...linkFields,
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'white',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Gray', value: 'light-gray' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}

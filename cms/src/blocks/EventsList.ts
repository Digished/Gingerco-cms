import type { Block } from 'payload'

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

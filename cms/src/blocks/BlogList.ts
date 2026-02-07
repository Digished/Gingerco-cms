import type { Block } from 'payload'

export const BlogList: Block = {
  slug: 'blogList',
  labels: {
    singular: 'Blog Posts',
    plural: 'Blog Posts',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Latest Posts',
    },
    {
      name: 'showCount',
      type: 'number',
      defaultValue: 6,
      min: 1,
      max: 20,
      admin: {
        description: 'Number of posts to display.',
      },
    },
    {
      name: 'filterByCategory',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All Categories', value: 'all' },
        { label: 'News', value: 'news' },
        { label: 'Fitness', value: 'fitness' },
        { label: 'Dance', value: 'dance' },
        { label: 'Lifestyle', value: 'lifestyle' },
        { label: 'Events', value: 'events' },
        { label: 'Behind the Scenes', value: 'behind-the-scenes' },
      ],
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
  ],
}

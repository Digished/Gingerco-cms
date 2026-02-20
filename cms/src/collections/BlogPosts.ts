import type { CollectionConfig } from 'payload'

export const BlogPosts: CollectionConfig = {
  slug: 'blog-posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', '_status', 'publishedDate'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  versions: {
    drafts: {
      autosave: true,
    },
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
        description: 'URL path for this post. Use underscores instead of spaces (e.g. "my_first_post" becomes /blog/my_first_post).',
      },
      hooks: {
        beforeValidate: [
          ({ value }: { value: string }) =>
            typeof value === 'string'
              ? value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_-]/g, '')
              : value,
        ],
      },
      validate: (value: string | null | undefined) => {
        if (value && /\s/.test(value)) return 'Slug cannot contain spaces — use underscores instead.'
        return true
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'category',
      type: 'select',
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'News', value: 'news' },
        { label: 'Fitness', value: 'fitness' },
        { label: 'Dance', value: 'dance' },
        { label: 'Lifestyle', value: 'lifestyle' },
        { label: 'Events', value: 'events' },
        { label: 'Behind the Scenes', value: 'behind-the-scenes' },
      ],
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      maxLength: 300,
      admin: {
        description: 'Short summary shown in blog listings.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'meta',
      type: 'group',
      label: 'SEO',
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'description',
          type: 'textarea',
          maxLength: 160,
        },
      ],
    },
  ],
}

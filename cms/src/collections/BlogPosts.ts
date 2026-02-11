import type { CollectionConfig, TextFieldSingleValidation } from 'payload'

const validateUniqueSlug: TextFieldSingleValidation = async (value, { payload, id }) => {
  if (!value || !payload) return true
  const existing = await payload.find({
    collection: 'blog-posts',
    where: {
      slug: { equals: value },
      ...(id ? { id: { not_equals: id } } : {}),
    },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    return 'A blog post with this slug already exists.'
  }
  return true
}

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
      index: true,
      validate: validateUniqueSlug,
      admin: {
        position: 'sidebar',
        description: 'URL path for this post (e.g. "my-first-post" becomes /blog/my-first-post).',
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

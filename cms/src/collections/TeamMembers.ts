import type { CollectionConfig } from 'payload'

export const TeamMembers: CollectionConfig = {
  slug: 'team-members',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order'],
    group: 'Content',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (data?.slug && typeof data.slug === 'string') {
          data.slug = data.slug.replace(/\s+/g, '_')
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-friendly identifier (e.g. "jane-doe"). Used for the team member profile page.',
        position: 'sidebar',
      },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'e.g. Founder & Lead Instructor, Dance Coach, etc.',
      },
    },
    {
      name: 'profileTheme',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard (1 photo, compact)', value: 'standard' },
        { label: 'Featured (3 photos, L-shape)', value: 'featured' },
      ],
      admin: {
        description: 'Choose "Featured" for CEO/key members (uses 3 photos in an L-shaped layout). "Standard" is a compact single-photo layout.',
        position: 'sidebar',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main profile photo (displayed on team grid and profile page hero).',
      },
    },
    {
      name: 'photo2',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional second photo (shown on profile page).',
      },
    },
    {
      name: 'photo3',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional third photo (shown on profile page).',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      maxLength: 500,
      admin: {
        description: 'Short biography shown in the profile header (max 500 chars).',
      },
    },
    {
      name: 'profileContent',
      type: 'richText',
      admin: {
        description: 'Extended profile content shown as the body section of the team member profile page. Supports rich text formatting.',
      },
    },
    {
      name: 'specialties',
      type: 'text',
      admin: {
        description: 'Comma-separated specialties (e.g. Afrobeats, Hip Hop, Yoga).',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        {
          name: 'instagram',
          type: 'text',
        },
        {
          name: 'facebook',
          type: 'text',
        },
        {
          name: 'tiktok',
          type: 'text',
        },
        {
          name: 'website',
          type: 'text',
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Display order (lower numbers appear first).',
        position: 'sidebar',
      },
    },
  ],
}

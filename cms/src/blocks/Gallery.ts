import type { Block } from 'payload'

export const Gallery: Block = {
  slug: 'gallery',
  labels: {
    singular: 'Gallery',
    plural: 'Galleries',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'items',
      type: 'array',
      label: 'Gallery Items',
      minRows: 1,
      fields: [
        {
          name: 'mediaType',
          type: 'select',
          defaultValue: 'image',
          options: [
            { label: 'Image', value: 'image' },
            { label: 'Video (URL)', value: 'video' },
          ],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (_, siblingData) => siblingData?.mediaType !== 'video',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'Video URL',
          admin: {
            description: 'YouTube, Vimeo, or direct video URL',
            condition: (_, siblingData) => siblingData?.mediaType === 'video',
          },
        },
        {
          name: 'posterImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Video Placeholder Image',
          admin: {
            description: 'Optional image shown before the video plays. Only used when media type is Video.',
          },
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    // Keep legacy "images" field so existing data still loads
    {
      name: 'images',
      type: 'array',
      admin: { hidden: true },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
    {
      name: 'layoutMode',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel / Slider', value: 'carousel' },
      ],
      admin: {
        description: 'Display items in a grid layout or as a carousel/slider.',
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.layoutMode === 'grid',
      },
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

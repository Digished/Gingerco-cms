import type { Block } from 'payload'
import { linkFields } from '../fields/linkFields'

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
      name: 'headingColor',
      type: 'text',
      admin: {
        description: 'Custom heading color for this section (hex, e.g. #E85D3A).',
      },
    },
    {
      name: 'displayMode',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Carousel / Slideshow', value: 'carousel' },
      ],
      admin: {
        description: 'Grid shows all images in columns. Carousel allows swiping through images with a peek of the next.',
      },
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
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      admin: {
        description: 'Number of columns (only applies to Grid mode).',
        condition: (_, siblingData) => siblingData?.displayMode !== 'carousel',
      },
    },
    {
      name: 'links',
      type: 'array',
      label: 'Action Buttons',
      maxRows: 3,
      admin: {
        description: 'Add action buttons below the gallery.',
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

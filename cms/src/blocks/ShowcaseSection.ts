import type { Block } from 'payload'
import { linkFields } from '../fields/linkFields'

export const ShowcaseSection: Block = {
  slug: 'showcase-section',
  labels: {
    singular: 'Showcase Section',
    plural: 'Showcase Sections',
  },
  fields: [
    {
      name: 'sectionHeading',
      type: 'text',
      admin: {
        description: 'Large heading above the media (e.g. "AFROBEATS INDOOR CYCLING: VIENNA TAKEOVER 2025")',
      },
    },
    {
      name: 'mediaType',
      type: 'radio',
      defaultValue: 'image',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'image',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        description: 'Direct URL to a video file (MP4)',
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
    },
    {
      name: 'posterImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Optional placeholder image shown before the video plays',
        condition: (_, siblingData) => siblingData?.mediaType === 'video',
      },
    },
    {
      name: 'mediaPosition',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Media Left / Info Right', value: 'left' },
        { label: 'Media Right / Info Left', value: 'right' },
      ],
    },
    {
      name: 'infoHeading',
      type: 'text',
      admin: {
        description: 'Heading for the info column (e.g. "Austria\'s Largest Indoor Group-Fitness...")',
      },
    },
    {
      name: 'infoDescription',
      type: 'textarea',
      admin: {
        description: 'Description paragraph for the info column',
      },
    },
    {
      name: 'details',
      type: 'array',
      admin: {
        description: 'List of detail items with bullet points (e.g. Date, Venue, Time)',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Bold label (e.g. "Date:")',
          },
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: {
            description: 'Detail value (e.g. "Saturday, 06 December 2025")',
          },
        },
      ],
    },
    {
      name: 'links',
      type: 'array',
      maxRows: 3,
      fields: [
        ...linkFields,
        {
          name: 'style',
          type: 'select',
          defaultValue: 'outline',
          options: [
            { label: 'Outline', value: 'outline' },
            { label: 'Primary (Dark Fill)', value: 'primary' },
          ],
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'select',
      defaultValue: 'light-gray',
      options: [
        { label: 'White', value: 'white' },
        { label: 'Light Gray', value: 'light-gray' },
        { label: 'Dark', value: 'dark' },
      ],
    },
  ],
}

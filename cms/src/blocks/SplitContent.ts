import type { Block } from 'payload'
import { linkFields } from '../fields/linkFields'

export const SplitContent: Block = {
  slug: 'splitContent',
  labels: {
    singular: 'Split Content (Columns with Form)',
    plural: 'Split Content Blocks',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: '50-50',
      options: [
        { label: '50% / 50%', value: '50-50' },
        { label: '60% / 40%', value: '60-40' },
        { label: '40% / 60%', value: '40-60' },
        { label: '70% / 30%', value: '70-30' },
        { label: '30% / 70%', value: '30-70' },
      ],
      admin: {
        description: 'Width ratio between left and right columns.',
      },
    },
    {
      name: 'leftColumn',
      type: 'group',
      label: 'Left Column',
      fields: [
        {
          name: 'contentType',
          type: 'select',
          defaultValue: 'richText',
          options: [
            { label: 'Rich Text', value: 'richText' },
            { label: 'Form', value: 'form' },
          ],
        },
        {
          name: 'heading',
          type: 'text',
          admin: {
            description: 'Optional heading for this column.',
          },
        },
        {
          name: 'richText',
          type: 'richText',
          admin: {
            condition: (_, siblingData) => siblingData?.contentType === 'richText',
          },
        },
        {
          name: 'form',
          type: 'relationship',
          relationTo: 'forms',
          admin: {
            condition: (_, siblingData) => siblingData?.contentType === 'form',
            description: 'Select a form to display in this column.',
          },
        },
      ],
    },
    {
      name: 'rightColumn',
      type: 'group',
      label: 'Right Column',
      fields: [
        {
          name: 'contentType',
          type: 'select',
          defaultValue: 'form',
          options: [
            { label: 'Rich Text', value: 'richText' },
            { label: 'Form', value: 'form' },
          ],
        },
        {
          name: 'heading',
          type: 'text',
          admin: {
            description: 'Optional heading for this column.',
          },
        },
        {
          name: 'richText',
          type: 'richText',
          admin: {
            condition: (_, siblingData) => siblingData?.contentType === 'richText',
          },
        },
        {
          name: 'form',
          type: 'relationship',
          relationTo: 'forms',
          admin: {
            condition: (_, siblingData) => siblingData?.contentType === 'form',
            description: 'Select a form to display in this column.',
          },
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
    {
      name: 'verticalAlign',
      type: 'select',
      defaultValue: 'top',
      options: [
        { label: 'Top', value: 'top' },
        { label: 'Center', value: 'center' },
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
          defaultValue: 'primary',
          options: [
            { label: 'Primary (Filled)', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
          ],
        },
      ],
    },
  ],
}

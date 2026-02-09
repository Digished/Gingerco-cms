import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { lexicalEditor, FixedToolbarFeature, TextStateFeature, defaultColors } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { migrations } from './src/migrations'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

import { Users } from './src/collections/Users'
import { Pages } from './src/collections/Pages'
import { Events } from './src/collections/Events'
import { Media } from './src/collections/Media'
import { BlogPosts } from './src/collections/BlogPosts'
import { TeamMembers } from './src/collections/TeamMembers'
import { Header } from './src/globals/Header'
import { Footer } from './src/globals/Footer'
import { SiteSettings } from './src/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',

  db: postgresAdapter({
    prodMigrations: migrations,
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),

  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures,
      FixedToolbarFeature(),
      TextStateFeature({
        state: {
          color: {
            ...defaultColors.text,
            'text-gold': { label: 'Gold', css: { color: '#D4AF37' } },
            'text-white': { label: 'White', css: { color: '#FFFFFF' } },
            'text-black': { label: 'Black', css: { color: '#1A1A1A' } },
            'text-gray': { label: 'Gray', css: { color: '#666666' } },
          },
          backgroundColor: {
            ...defaultColors.background,
            'bg-gold': { label: 'Gold', css: { 'background-color': '#D4AF37' } },
            'bg-black': { label: 'Black', css: { 'background-color': '#1A1A1A' } },
            'bg-white': { label: 'White', css: { 'background-color': '#FFFFFF' } },
          },
          fontSize: {
            'size-xs': { label: 'Extra Small', css: { 'font-size': '0.75rem' } },
            'size-sm': { label: 'Small', css: { 'font-size': '0.875rem' } },
            'size-base': { label: 'Normal', css: { 'font-size': '1rem' } },
            'size-lg': { label: 'Large', css: { 'font-size': '1.25rem' } },
            'size-xl': { label: 'Extra Large', css: { 'font-size': '1.5rem' } },
            'size-2xl': { label: '2X Large', css: { 'font-size': '2rem' } },
            'size-3xl': { label: '3X Large', css: { 'font-size': '2.5rem' } },
            'size-4xl': { label: '4X Large', css: { 'font-size': '3rem' } },
          },
        },
      }),
    ],
  }),

  collections: [Users, Pages, Events, BlogPosts, TeamMembers, Media],

  globals: [Header, Footer, SiteSettings],

  plugins: [
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        select: true,
        email: true,
        checkbox: true,
        number: true,
        message: true,
      },
      formOverrides: {
        admin: {
          group: 'Forms',
        },
      },
      formSubmissionOverrides: {
        admin: {
          group: 'Forms',
        },
      },
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' - Ginger & Co. Admin',
      title: 'Ginger & Co. Admin',
    },
  },

})

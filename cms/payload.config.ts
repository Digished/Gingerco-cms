import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { migrations } from './src/migrations'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

import { Users } from './src/collections/Users'
import { Pages } from './src/collections/Pages'
import { Events } from './src/collections/Events'
import { Media } from './src/collections/Media'
import { Header } from './src/globals/Header'
import { Footer } from './src/globals/Footer'
import { SiteSettings } from './src/globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '')

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',

  db: postgresAdapter({
    prodMigrations: migrations,
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),

  editor: lexicalEditor({}),

  collections: [Users, Pages, Events, Media],

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
      titleSuffix: ' - Ginger & Co.',
    },
  },

  serverURL,

  csrf: [
    serverURL,
  ].filter(Boolean),
})

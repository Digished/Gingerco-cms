import sharp from 'sharp'
import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { lexicalEditor, FixedToolbarFeature, TextStateFeature, defaultColors } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { migrations } from './src/migrations'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { s3Storage } from '@payloadcms/storage-s3'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'

import { Users } from './src/collections/Users'
import { Pages } from './src/collections/Pages'
import { Events } from './src/collections/Events'
import { Media } from './src/collections/Media'
import { BlogPosts } from './src/collections/BlogPosts'
import { TeamMembers } from './src/collections/TeamMembers'
import { Partners } from './src/collections/Partners'
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

  collections: [Users, Pages, Events, BlogPosts, TeamMembers, Partners, Media],

  globals: [Header, Footer, SiteSettings],

  plugins: [
    formBuilderPlugin({
      beforeEmail: async () => [],
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
        fields: ({ defaultFields }) => [
          ...defaultFields,
          {
            name: 'arrivalNotice',
            type: 'textarea',
            label: 'Notice / Warning',
            admin: {
              description: 'Optional notice shown before consent sections (e.g. arrival time, important notes). Displayed with a warning style.',
            },
          },
          {
            name: 'consentSections',
            type: 'array',
            label: 'Consent & GDPR Sections',
            admin: {
              description: 'Add consent declarations, GDPR notices, and waivers to this form.',
            },
            fields: [
              {
                name: 'sectionTitle',
                type: 'text',
                required: true,
                admin: { description: 'Section heading, e.g. "Participant Declarations & Waiver" or "GDPR & Media Consent".' },
              },
              {
                name: 'declarations',
                type: 'array',
                label: 'Consent Declarations',
                fields: [
                  {
                    name: 'title',
                    type: 'text',
                    required: true,
                    admin: { description: 'e.g. "Age Confirmation", "Liability Waiver", "GDPR Consent".' },
                  },
                  {
                    name: 'description',
                    type: 'textarea',
                    admin: { description: 'Full text of the declaration the user must agree to.' },
                  },
                  {
                    name: 'required',
                    type: 'checkbox',
                    defaultValue: true,
                    admin: { description: 'Must the user agree to this declaration?' },
                  },
                ],
              },
              {
                name: 'collapsibleLabel',
                type: 'text',
                defaultValue: 'View Full Consent Details',
                admin: { description: 'Label for the expandable details button.' },
              },
              {
                name: 'collapsibleContent',
                type: 'richText',
                admin: { description: 'Full legal text shown when expanded (e.g. full GDPR policy, media consent text).' },
              },
            ],
          },
        ],
      },
      formSubmissionOverrides: {
        admin: {
          group: 'Forms',
        },
      },
    }),
    // S3 takes priority when configured (supports large video uploads).
    // Vercel Blob is the fallback when S3 is not available.
    ...(process.env.SUPABASE_S3_ENDPOINT
      ? [
          s3Storage({
            collections: {
              media: {
                prefix: 'media',
              },
            },
            bucket: process.env.SUPABASE_S3_BUCKET || 'media',
            config: {
              endpoint: process.env.SUPABASE_S3_ENDPOINT,
              credentials: {
                accessKeyId: process.env.SUPABASE_S3_ACCESS_KEY || '',
                secretAccessKey: process.env.SUPABASE_S3_SECRET_KEY || '',
              },
              region: process.env.SUPABASE_S3_REGION || 'eu-central-1',
              forcePathStyle: true,
            },
          }),
        ]
      : []),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN) && !process.env.SUPABASE_S3_ENDPOINT,
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],

  upload: {
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
    },
  },

  sharp,

  typescript: {
    outputFile: path.resolve(dirname, 'src/payload-types.ts'),
  },

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' - Ginger and Co CRM',
      title: 'Ginger and Co CRM',
    },
    components: {
      graphics: {
        Logo: '@/components/admin/Logo#Logo',
        Icon: '@/components/admin/Icon#Icon',
      },
    },
  },

})

import type { CollectionConfig } from 'payload'
import { sendCampaign } from '@/lib/sendCampaign'

export const EmailCampaigns: CollectionConfig = {
  slug: 'email-campaigns',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'status', 'recipientFilter', 'scheduledFor', 'sentAt', 'totalSent'],
    group: 'Email',
    description: 'Create and send email campaigns to your subscribers. Use "Send Now" to dispatch immediately or set a scheduled time.',
    components: {
      edit: {
        beforeDocumentControls: ['@/components/admin/SendCampaignButton#SendCampaignButton'],
      },
    },
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  endpoints: [
    {
      path: '/:id/send',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = req.routeParams as { id: string }

        await req.payload.update({
          collection: 'email-campaigns',
          id,
          data: { status: 'sending' },
        })

        try {
          const { sent, errors } = await sendCampaign(id, req.payload)

          await req.payload.update({
            collection: 'email-campaigns',
            id,
            data: {
              status: errors.length > 0 && sent === 0 ? 'failed' : 'sent',
              sentAt: new Date().toISOString(),
              totalSent: sent,
            },
          })

          if (errors.length > 0) {
            return Response.json({ sent, warnings: errors }, { status: 207 })
          }
          return Response.json({ sent })
        } catch (err: any) {
          await req.payload.update({
            collection: 'email-campaigns',
            id,
            data: { status: 'failed' },
          })
          return Response.json({ error: err.message }, { status: 500 })
        }
      },
    },
    {
      path: '/:id/schedule',
      method: 'post',
      handler: async (req) => {
        if (!req.user) {
          return Response.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = req.routeParams as { id: string }
        const body = await req.json?.() as { scheduledFor?: string } | undefined
        const scheduledFor = body?.scheduledFor

        if (!scheduledFor) {
          return Response.json({ error: 'scheduledFor is required' }, { status: 400 })
        }

        const scheduledDate = new Date(scheduledFor)
        if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
          return Response.json({ error: 'scheduledFor must be a future date/time' }, { status: 400 })
        }

        await req.payload.update({
          collection: 'email-campaigns',
          id,
          data: { status: 'scheduled', scheduledFor },
        })

        return Response.json({ scheduled: true, scheduledFor })
      },
    },
  ],
  fields: [
    // ─── Main content ─────────────────────────────────────────────────────────
    {
      name: 'subject',
      type: 'text',
      required: true,
      admin: {
        description: 'The email subject line subscribers will see in their inbox.',
      },
    },
    {
      name: 'previewText',
      type: 'text',
      maxLength: 90,
      admin: {
        description: 'Short preview shown in email clients next to the subject (max ~90 chars).',
      },
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: {
        description: 'Compose your email content here. Supports headings, bold, italic, links, and lists.',
      },
    },

    // ─── Sending settings (sidebar) ───────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Ready to Send', value: 'ready' },
        { label: 'Scheduled', value: 'scheduled' },
        { label: 'Sending…', value: 'sending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Use the buttons above to send now or schedule.',
      },
    },
    {
      name: 'scheduledFor',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'When to send this campaign automatically. Leave blank to send manually.',
        date: {
          pickerAppearance: 'dayAndTime',
        },
        condition: (data) => ['draft', 'ready', 'scheduled'].includes(data?.status),
      },
    },
    {
      name: 'recipientFilter',
      type: 'select',
      required: true,
      defaultValue: 'all',
      options: [
        { label: 'All active subscribers', value: 'all' },
        { label: 'By tag / segment', value: 'by-tags' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Who should receive this campaign?',
      },
    },
    {
      name: 'filterTags',
      type: 'array',
      label: 'Target Tags',
      admin: {
        position: 'sidebar',
        description: 'Only send to subscribers with at least one of these tags.',
        condition: (data) => data?.recipientFilter === 'by-tags',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },

    // ─── Stats (read-only) ────────────────────────────────────────────────────
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'When this campaign was sent.',
      },
    },
    {
      name: 'totalSent',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Number of emails successfully dispatched.',
      },
    },
  ],
}

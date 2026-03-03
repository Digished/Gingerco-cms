import type { CollectionConfig } from 'payload'
import { Resend } from 'resend'
import { campaignEmail, lexicalToEmailHtml } from '../emails/templates'

async function sendCampaign(campaignId: string | number, payload: any): Promise<{ sent: number; errors: string[] }> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://gingerandco.at'

  // Fetch the campaign document
  const campaign = await payload.findByID({ collection: 'email-campaigns', id: campaignId })
  if (!campaign) throw new Error('Campaign not found')

  // Build subscriber query
  const where: Record<string, any> = { status: { equals: 'subscribed' } }

  if (campaign.recipientFilter === 'by-tags' && campaign.filterTags?.length) {
    const tagValues: string[] = campaign.filterTags.map((t: any) => t.tag)
    where['tags.tag'] = { in: tagValues }
  }

  // Paginate through all matching subscribers
  const PAGE_SIZE = 100
  let page = 1
  let hasMore = true
  let totalSent = 0
  const errors: string[] = []

  while (hasMore) {
    const result = await payload.find({
      collection: 'subscribers',
      where,
      limit: PAGE_SIZE,
      page,
    })

    const subscribers: any[] = result.docs
    hasMore = result.hasNextPage
    page++

    if (subscribers.length === 0) break

    // Convert Lexical body to HTML
    const bodyHtml = campaign.body?.root
      ? lexicalToEmailHtml(campaign.body.root)
      : campaign.body
        ? `<p>${campaign.body}</p>`
        : '<p>No content.</p>'

    // Build batch email array for Resend (max 100 per call)
    const emails = subscribers.map((sub: any) => {
      const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${sub.unsubscribeToken}`
      const html = campaignEmail({
        subject: campaign.subject,
        previewText: campaign.previewText || '',
        bodyHtml,
        unsubscribeUrl,
        siteUrl,
      })

      return {
        from: `Ginger & Co <${process.env.RESEND_FROM_EMAIL || 'events@gingerandco.at'}>`,
        to: sub.email,
        subject: campaign.subject,
        html,
      }
    })

    // Send batch (Resend supports up to 100 per batch)
    try {
      const { data, error } = await resend.batch.send(emails)
      if (error) {
        errors.push(`Batch page ${page - 1}: ${error.message}`)
      } else {
        totalSent += emails.length
      }
    } catch (err: any) {
      errors.push(`Batch page ${page - 1}: ${err.message}`)
    }
  }

  return { sent: totalSent, errors }
}

export const EmailCampaigns: CollectionConfig = {
  slug: 'email-campaigns',
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'status', 'recipientFilter', 'sentAt', 'totalSent'],
    group: 'Email',
    description: 'Create and send email campaigns to your subscribers.',
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

        // Mark as sending
        await req.payload.update({
          collection: 'email-campaigns',
          id,
          data: { status: 'sending' },
        })

        try {
          const { sent, errors } = await sendCampaign(id, req.payload)

          // Update campaign stats
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
  ],
  fields: [
    // ─── Main content ───────────────────────────────────────────────────────
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
      admin: {
        description: 'Short preview/snippet shown in email clients next to the subject (max ~90 chars).',
      },
      maxLength: 90,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
      admin: {
        description: 'Compose your email content here. Supports headings, bold, italic, links, and lists.',
      },
    },

    // ─── Sending settings (sidebar) ─────────────────────────────────────────
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Ready to Send', value: 'ready' },
        { label: 'Sending...', value: 'sending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Use the "Send Campaign" button above to dispatch this email.',
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

    // ─── Stats (read-only) ───────────────────────────────────────────────────
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

import { Resend } from 'resend'
import { campaignEmail, lexicalToEmailHtml } from '@/emails/templates'

/** Send a campaign to all matching subscribers. Returns counts and any errors. */
export async function sendCampaign(
  campaignId: string | number,
  payload: any,
): Promise<{ sent: number; errors: string[] }> {
  const resend = new Resend(process.env.RESEND_API_KEY)
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://gingerandco.at'
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'events@gingerandco.at'

  const campaign = await payload.findByID({ collection: 'email-campaigns', id: campaignId })
  if (!campaign) throw new Error('Campaign not found')

  // Build subscriber query — only confirmed (subscribed) subscribers
  const where: Record<string, any> = { status: { equals: 'subscribed' } }

  if (campaign.recipientFilter === 'by-tags' && campaign.filterTags?.length) {
    const tagValues: string[] = campaign.filterTags.map((t: any) => t.tag)
    where['tags.tag'] = { in: tagValues }
  }

  const bodyHtml = campaign.body?.root
    ? lexicalToEmailHtml(campaign.body.root)
    : campaign.body
      ? `<p>${campaign.body}</p>`
      : '<p>No content.</p>'

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

    const emails = subscribers.map((sub: any) => {
      const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${sub.unsubscribeToken}`
      return {
        from: `Ginger & Co <${fromEmail}>`,
        to: sub.email,
        subject: campaign.subject,
        html: campaignEmail({
          subject: campaign.subject,
          previewText: campaign.previewText || '',
          bodyHtml,
          unsubscribeUrl,
          siteUrl,
        }),
      }
    })

    try {
      const { error } = await resend.batch.send(emails)
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

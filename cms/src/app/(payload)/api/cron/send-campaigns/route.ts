import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sendCampaign } from '@/lib/sendCampaign'

/**
 * GET /api/cron/send-campaigns
 *
 * Called by Vercel Cron every 5 minutes. Finds all campaigns with
 * status = 'scheduled' and scheduledFor <= now, then sends them.
 *
 * Secured via the Authorization header that Vercel Cron automatically
 * sends: "Authorization: Bearer $CRON_SECRET"
 *
 * Can also be triggered manually by passing the same header.
 */
export async function GET(req: NextRequest) {
  // Verify caller is Vercel Cron (or an authorised manual trigger)
  const cronSecret = process.env.CRON_SECRET
  if (cronSecret) {
    const auth = req.headers.get('authorization')
    if (auth !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  const payload = await getPayload({ config })
  const now = new Date().toISOString()

  // Find campaigns that are scheduled and due
  const due = await payload.find({
    collection: 'email-campaigns',
    where: {
      and: [
        { status: { equals: 'scheduled' } },
        { scheduledFor: { less_than_equal: now } },
      ],
    },
    limit: 100,
  })

  if (due.docs.length === 0) {
    return NextResponse.json({ processed: 0 })
  }

  const results: Array<{ id: string | number; subject: string; sent: number; errors: string[] }> = []

  for (const campaign of due.docs) {
    // Mark as sending first so it won't be picked up again on the next cron tick
    await payload.update({
      collection: 'email-campaigns',
      id: campaign.id,
      data: { status: 'sending' },
    })

    try {
      const { sent, errors } = await sendCampaign(campaign.id, payload)

      await payload.update({
        collection: 'email-campaigns',
        id: campaign.id,
        data: {
          status: errors.length > 0 && sent === 0 ? 'failed' : 'sent',
          sentAt: new Date().toISOString(),
          totalSent: sent,
        },
      })

      results.push({ id: campaign.id, subject: campaign.subject, sent, errors })
    } catch (err: any) {
      await payload.update({
        collection: 'email-campaigns',
        id: campaign.id,
        data: { status: 'failed' },
      })
      results.push({ id: campaign.id, subject: campaign.subject, sent: 0, errors: [err.message] })
    }
  }

  return NextResponse.json({ processed: results.length, results })
}

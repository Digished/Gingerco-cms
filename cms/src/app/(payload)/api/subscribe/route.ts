import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'
import { confirmationEmail } from '@/emails/templates'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, firstName, lastName, source, tags } = body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const payload = await getPayload({ config })
    const normalizedEmail = email.toLowerCase().trim()

    // Check for existing subscriber
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const sub = existing.docs[0]

      if (sub.status === 'subscribed') {
        // Already active — return success silently (don't leak info)
        return NextResponse.json({ success: true })
      }

      // Re-send confirmation for pending or re-subscribing users
      await sendConfirmationEmail(sub.email, sub.confirmationToken, firstName || sub.firstName)

      // Update name if provided, keep existing token
      await payload.update({
        collection: 'subscribers',
        id: sub.id,
        data: {
          status: 'pending',
          firstName: firstName || sub.firstName,
          lastName: lastName || sub.lastName,
        },
      })

      return NextResponse.json({ success: true, message: 'Check your email to confirm your subscription.' })
    }

    // Create new subscriber with status 'pending'
    const tagArray = Array.isArray(tags) ? tags.map((t: string) => ({ tag: t })) : []

    const subscriber = await payload.create({
      collection: 'subscribers',
      data: {
        email: normalizedEmail,
        firstName: firstName || '',
        lastName: lastName || '',
        status: 'pending',
        source: source || 'api',
        tags: tagArray,
      },
    })

    // Send double opt-in confirmation email
    await sendConfirmationEmail(subscriber.email, subscriber.confirmationToken, firstName)

    return NextResponse.json(
      { success: true, message: 'Thanks! Please check your email to confirm your subscription.' },
      { status: 201 },
    )
  } catch (err: any) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

async function sendConfirmationEmail(
  email: string,
  confirmationToken: string,
  firstName?: string,
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return

  const resend = new Resend(resendKey)
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://gingerandco.at'
  const confirmationUrl = `${siteUrl}/api/confirm-subscription?token=${confirmationToken}`

  await resend.emails.send({
    from: `Ginger & Co <${process.env.RESEND_FROM_EMAIL || 'events@gingerandco.at'}>`,
    to: email,
    subject: 'Please confirm your subscription — Ginger & Co',
    html: confirmationEmail({ firstName, confirmationUrl, siteUrl }),
  })
}

import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'
import { welcomeEmail } from '@/emails/templates'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, firstName, lastName, source, tags } = body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Check for existing subscriber
    const existing = await payload.find({
      collection: 'subscribers',
      where: { email: { equals: email.toLowerCase().trim() } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const sub = existing.docs[0]

      if (sub.status === 'subscribed') {
        // Already subscribed — return success silently (don't leak info)
        return NextResponse.json({ success: true, message: 'You are already subscribed!' })
      }

      // Re-subscribe if previously unsubscribed
      await payload.update({
        collection: 'subscribers',
        id: sub.id,
        data: {
          status: 'subscribed',
          firstName: firstName || sub.firstName,
          lastName: lastName || sub.lastName,
          subscribedAt: new Date().toISOString(),
        },
      })

      return NextResponse.json({ success: true, message: 'Welcome back! You have been re-subscribed.' })
    }

    // Create new subscriber
    const tagArray = Array.isArray(tags)
      ? tags.map((t: string) => ({ tag: t }))
      : []

    const subscriber = await payload.create({
      collection: 'subscribers',
      data: {
        email: email.toLowerCase().trim(),
        firstName: firstName || '',
        lastName: lastName || '',
        status: 'subscribed',
        source: source || 'api',
        tags: tagArray,
      },
    })

    // Send welcome email via Resend
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const resend = new Resend(resendKey)
      const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://gingerandco.at'
      const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${subscriber.unsubscribeToken}`

      await resend.emails.send({
        from: `Ginger & Co <${process.env.RESEND_FROM_EMAIL || 'events@gingerandco.at'}>`,
        to: subscriber.email,
        subject: 'Welcome to Ginger & Co!',
        html: welcomeEmail({ firstName, unsubscribeUrl, siteUrl }),
      })
    }

    return NextResponse.json({ success: true, message: 'Thanks for subscribing!' }, { status: 201 })
  } catch (err: any) {
    console.error('[subscribe]', err)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

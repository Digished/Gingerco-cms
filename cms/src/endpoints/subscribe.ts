import type { PayloadHandler } from 'payload'
import { Resend } from 'resend'
import { welcomeEmail } from '../emails/templates'

async function sendWelcomeEmail(
  email: string,
  unsubscribeToken: string,
  firstName?: string,
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return

  const resend = new Resend(resendKey)
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'https://gingerandco.at'
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://gingerandco.at'
  const unsubscribeUrl = `${cmsUrl}/api/unsubscribe?token=${unsubscribeToken}`

  await resend.emails.send({
    from: `Ginger & Co <${process.env.RESEND_FROM_EMAIL || 'events@gingerandco.at'}>`,
    to: email,
    subject: 'Welcome to Ginger & Co!',
    html: welcomeEmail({ firstName, unsubscribeUrl, siteUrl }),
  })
}

export const subscribeEndpoint: PayloadHandler = async (req) => {
  try {
    const body = await (req as unknown as Request).json()
    const { email, firstName, lastName, source, tags } = body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return Response.json({ error: 'A valid email address is required.' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existing = await req.payload.find({
      collection: 'subscribers',
      where: { email: { equals: normalizedEmail } },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const sub = existing.docs[0]

      if (sub.status === 'subscribed') {
        return Response.json({ success: true })
      }

      await req.payload.update({
        collection: 'subscribers',
        id: sub.id,
        data: {
          status: 'subscribed',
          subscribedAt: new Date().toISOString(),
          firstName: firstName || sub.firstName,
          lastName: lastName || sub.lastName,
        },
      })

      await sendWelcomeEmail(sub.email, sub.unsubscribeToken as string, firstName || sub.firstName as string)

      return Response.json({ success: true, message: 'Thanks for subscribing!' })
    }

    const tagArray = Array.isArray(tags) ? tags.map((t: string) => ({ tag: t })) : []

    const subscriber = await req.payload.create({
      collection: 'subscribers',
      data: {
        email: normalizedEmail,
        firstName: firstName || '',
        lastName: lastName || '',
        status: 'subscribed',
        subscribedAt: new Date().toISOString(),
        source: source || 'api',
        tags: tagArray,
      },
    })

    await sendWelcomeEmail(subscriber.email, subscriber.unsubscribeToken as string, firstName)

    return Response.json(
      { success: true, message: 'Thanks for subscribing!' },
      { status: 201 },
    )
  } catch (err) {
    req.payload.logger.error({ err }, '[subscribe]')
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

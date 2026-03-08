import type { PayloadHandler } from 'payload'
import { Resend } from 'resend'
import { confirmationEmail } from '../emails/templates'

async function sendConfirmationEmail(
  email: string,
  confirmationToken: string,
  firstName?: string,
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return

  const resend = new Resend(resendKey)
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'https://gingerandco.at'
  const confirmationUrl = `${cmsUrl}/api/confirm-subscription?token=${confirmationToken}`

  await resend.emails.send({
    from: `Ginger & Co <${process.env.RESEND_FROM_EMAIL || 'events@gingerandco.at'}>`,
    to: email,
    subject: 'Please confirm your subscription — Ginger & Co',
    html: confirmationEmail({ firstName, confirmationUrl, siteUrl }),
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

      await sendConfirmationEmail(sub.email, sub.confirmationToken as string, firstName || sub.firstName as string)

      await req.payload.update({
        collection: 'subscribers',
        id: sub.id,
        data: {
          status: 'pending',
          firstName: firstName || sub.firstName,
          lastName: lastName || sub.lastName,
        },
      })

      return Response.json({ success: true, message: 'Check your email to confirm your subscription.' })
    }

    const tagArray = Array.isArray(tags) ? tags.map((t: string) => ({ tag: t })) : []

    const subscriber = await req.payload.create({
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

    await sendConfirmationEmail(subscriber.email, subscriber.confirmationToken as string, firstName)

    return Response.json(
      { success: true, message: 'Thanks! Please check your email to confirm your subscription.' },
      { status: 201 },
    )
  } catch (err) {
    req.payload.logger.error({ err }, '[subscribe]')
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

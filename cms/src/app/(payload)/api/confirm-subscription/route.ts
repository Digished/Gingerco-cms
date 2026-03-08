import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { Resend } from 'resend'
import { welcomeEmail } from '@/emails/templates'

/** GET /api/confirm-subscription?token=<confirmationToken>
 *  Validates the double opt-in token, activates the subscriber, sends welcome email.
 */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  const siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://gingerandco.at'

  if (!token) {
    return htmlResponse('Invalid Link', 'This confirmation link is invalid or has expired.', false, siteUrl)
  }

  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'subscribers',
      where: { confirmationToken: { equals: token } },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return htmlResponse('Link Not Found', 'This confirmation link is invalid or has already been used.', false, siteUrl)
    }

    const subscriber = result.docs[0]

    if (subscriber.status === 'subscribed') {
      return htmlResponse('Already Confirmed', 'Your subscription is already active. Welcome to Ginger & Co!', true, siteUrl)
    }

    // Activate subscriber
    await payload.update({
      collection: 'subscribers',
      id: subscriber.id,
      data: {
        status: 'subscribed',
        subscribedAt: new Date().toISOString(),
      },
    })

    // Send welcome email
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      const resend = new Resend(resendKey)
      const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${subscriber.unsubscribeToken}`

      await resend.emails.send({
        from: `Ginger & Co <${process.env.RESEND_FROM_EMAIL || 'events@gingerandco.at'}>`,
        to: subscriber.email,
        subject: 'Welcome to Ginger & Co!',
        html: welcomeEmail({ firstName: subscriber.firstName, unsubscribeUrl, siteUrl }),
      })
    }

    return htmlResponse(
      'Subscription Confirmed!',
      `Welcome! ${subscriber.email} is now subscribed to Ginger & Co updates.`,
      true,
      siteUrl,
    )
  } catch (err) {
    console.error('[confirm-subscription]', err)
    return htmlResponse('Error', 'Something went wrong. Please try again later.', false, siteUrl)
  }
}

function htmlResponse(title: string, message: string, success: boolean, siteUrl: string) {
  const color = success ? '#166534' : '#991b1b'
  const bg = success ? '#f0fdf4' : '#fef2f2'

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — Ginger &amp; Co</title>
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; padding: 0; background: #f4f4f4; font-family: Georgia, serif; }
    .wrapper { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px 20px; }
    .card { background: #fff; max-width: 480px; width: 100%; border-radius: 6px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,.08); }
    .header { background: #1A1A1A; padding: 28px 32px; text-align: center; }
    .header h1 { color: #D4AF37; margin: 0; font-size: 22px; letter-spacing: 2px; }
    .body { padding: 36px 32px; text-align: center; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    .status { display: inline-block; padding: 10px 20px; background: ${bg}; color: ${color}; border-radius: 4px; font-size: 15px; margin-bottom: 20px; }
    h2 { color: #1A1A1A; margin: 0 0 12px; }
    p { color: #555; line-height: 1.6; margin: 0 0 24px; }
    a.btn { display: inline-block; background: #D4AF37; color: #1A1A1A; padding: 12px 28px; border-radius: 4px; text-decoration: none; font-weight: bold; font-size: 14px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header"><h1>Ginger &amp; Co</h1></div>
      <div class="body">
        <div class="icon">${success ? '✓' : '✗'}</div>
        <div class="status">${title}</div>
        <h2>${title}</h2>
        <p>${message}</p>
        <a href="${siteUrl}" class="btn">Explore Our Events</a>
      </div>
    </div>
  </div>
</body>
</html>`

  return new NextResponse(html, {
    status: success ? 200 : 400,
    headers: { 'Content-Type': 'text/html' },
  })
}

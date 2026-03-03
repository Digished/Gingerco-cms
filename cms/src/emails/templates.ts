/** Shared email HTML templates for Ginger & Co */

interface EmailTemplateOptions {
  previewText?: string
  siteUrl?: string
}

const baseStyles = `
  body { margin: 0; padding: 0; background-color: #f4f4f4; font-family: 'Georgia', serif; }
  .wrapper { width: 100%; background-color: #f4f4f4; padding: 40px 0; }
  .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 4px; overflow: hidden; }
  .header { background-color: #1A1A1A; padding: 32px 40px; text-align: center; }
  .header h1 { color: #D4AF37; font-size: 24px; margin: 0; letter-spacing: 2px; text-transform: uppercase; }
  .header p { color: #999; font-size: 13px; margin: 6px 0 0; letter-spacing: 1px; }
  .body { padding: 40px; color: #333333; font-size: 16px; line-height: 1.7; }
  .body h2 { color: #1A1A1A; font-size: 22px; margin-top: 0; }
  .body p { margin: 0 0 16px; }
  .body a { color: #D4AF37; text-decoration: none; }
  .body ul { padding-left: 20px; }
  .cta-button { display: inline-block; background-color: #D4AF37; color: #1A1A1A !important; padding: 14px 32px; border-radius: 3px; font-weight: bold; font-size: 15px; letter-spacing: 1px; text-decoration: none; margin: 16px 0; }
  .divider { border: none; border-top: 1px solid #eeeeee; margin: 32px 0; }
  .footer { background-color: #1A1A1A; padding: 24px 40px; text-align: center; }
  .footer p { color: #666; font-size: 12px; margin: 4px 0; }
  .footer a { color: #D4AF37; text-decoration: none; }
`

function htmlWrapper(content: string, opts: EmailTemplateOptions = {}): string {
  const { previewText = '', siteUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://gingerandco.at' } = opts
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Ginger &amp; Co</title>
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌&nbsp;‌</div>` : ''}
  <style>${baseStyles}</style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>Ginger &amp; Co</h1>
        <p>Move. Dance. Live.</p>
      </div>
      ${content}
    </div>
  </div>
</body>
</html>`
}

/** Welcome email sent to new subscribers */
export function welcomeEmail(opts: {
  firstName?: string
  unsubscribeUrl: string
  siteUrl?: string
}): string {
  const name = opts.firstName ? opts.firstName : 'there'
  const siteUrl = opts.siteUrl || process.env.NEXT_PUBLIC_SERVER_URL || 'https://gingerandco.at'

  const body = `
    <div class="body">
      <h2>Welcome, ${name}!</h2>
      <p>You're now subscribed to the Ginger &amp; Co newsletter. We're so glad you're here!</p>
      <p>Here's what to expect in your inbox:</p>
      <ul>
        <li>Upcoming classes, workshops &amp; events</li>
        <li>Behind-the-scenes stories from our community</li>
        <li>Exclusive early access &amp; special offers</li>
      </ul>
      <p style="text-align:center;">
        <a href="${siteUrl}" class="cta-button">Explore Our Events</a>
      </p>
      <hr class="divider" />
      <p style="font-size:13px;color:#888;">
        You're receiving this because you subscribed at ${siteUrl}.<br />
        Not interested? <a href="${opts.unsubscribeUrl}">Unsubscribe here</a>.
      </p>
    </div>
    <div class="footer">
      <p>Ginger &amp; Co &mdash; Vienna, Austria</p>
      <p><a href="${opts.unsubscribeUrl}">Unsubscribe</a></p>
    </div>
  `
  return htmlWrapper(body, { previewText: `Welcome to Ginger & Co, ${name}!` })
}

/** Campaign email body wrapper */
export function campaignEmail(opts: {
  subject: string
  previewText?: string
  bodyHtml: string
  unsubscribeUrl: string
  siteUrl?: string
}): string {
  const siteUrl = opts.siteUrl || process.env.NEXT_PUBLIC_SERVER_URL || 'https://gingerandco.at'

  const body = `
    <div class="body">
      ${opts.bodyHtml}
      <hr class="divider" />
      <p style="font-size:13px;color:#888;">
        You're receiving this because you subscribed to Ginger &amp; Co updates.<br />
        <a href="${opts.unsubscribeUrl}">Unsubscribe</a> &middot;
        <a href="${siteUrl}">Visit our website</a>
      </p>
    </div>
    <div class="footer">
      <p>Ginger &amp; Co &mdash; Vienna, Austria</p>
      <p><a href="${opts.unsubscribeUrl}">Unsubscribe</a></p>
    </div>
  `
  return htmlWrapper(body, { previewText: opts.previewText, siteUrl })
}

/** Simple Lexical JSON → email-safe HTML converter */
export function lexicalToEmailHtml(node: any): string {
  if (!node) return ''

  if (node.type === 'text') {
    let text: string = escapeHtml(node.text || '')
    const format: number = node.format || 0
    if (format & 1) text = `<strong>${text}</strong>`  // bold
    if (format & 2) text = `<em>${text}</em>`           // italic
    if (format & 8) text = `<u>${text}</u>`             // underline
    if (format & 16) text = `<s>${text}</s>`            // strikethrough
    return text
  }

  const children = ((node.children || []) as any[]).map(lexicalToEmailHtml).join('')

  switch (node.type) {
    case 'root':
      return children
    case 'paragraph':
      return `<p style="margin:0 0 16px;">${children || '&nbsp;'}</p>`
    case 'heading': {
      const tag = node.tag || 'h2'
      return `<${tag} style="color:#1A1A1A;margin:24px 0 12px;">${children}</${tag}>`
    }
    case 'list':
      return node.listType === 'bullet'
        ? `<ul style="padding-left:20px;margin:0 0 16px;">${children}</ul>`
        : `<ol style="padding-left:20px;margin:0 0 16px;">${children}</ol>`
    case 'listitem':
      return `<li style="margin-bottom:6px;">${children}</li>`
    case 'link': {
      const url = node.fields?.url || node.url || '#'
      return `<a href="${url}" style="color:#D4AF37;">${children}</a>`
    }
    case 'linebreak':
      return '<br />'
    case 'quote':
      return `<blockquote style="border-left:3px solid #D4AF37;padding-left:16px;color:#666;margin:0 0 16px;">${children}</blockquote>`
    case 'horizontalrule':
      return `<hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />`
    default:
      return children
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

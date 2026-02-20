'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import { LinkButton } from './LinkButton'

/* ── SVG Icons ── */

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function ArrowUpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5,12 12,5 19,12" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

const iconMap: Record<string, React.FC> = {
  plus: PlusIcon,
  whatsapp: WhatsAppIcon,
  phone: PhoneIcon,
  email: EmailIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
  facebook: FacebookIcon,
  chat: ChatIcon,
  calendar: CalendarIcon,
  'arrow-up': ArrowUpIcon,
}

export function FloatingButtons({ buttons, toggleIcon, toggleButtonColor }: { buttons: any[]; toggleIcon?: string; toggleButtonColor?: string }) {
  const [expanded, setExpanded] = useState(false)

  if (!buttons || buttons.length === 0) return null

  // If only one button, show it directly (no expand toggle)
  if (buttons.length === 1) {
    return (
      <div className="fab-container">
        <FabButton item={buttons[0]} />
      </div>
    )
  }

  const IconComponent = iconMap[toggleIcon || 'chat'] || ChatIcon

  return (
    <div className={`fab-container ${expanded ? 'fab-expanded' : ''}`}>
      {expanded && (
        <div className="fab-list">
          {buttons.map((btn: any, i: number) => (
            <FabButton key={btn.id || i} item={btn} />
          ))}
        </div>
      )}
      <button
        className="fab-toggle"
        style={{ background: toggleButtonColor || '#E85D3A' }}
        onClick={() => setExpanded(!expanded)}
        aria-label={expanded ? 'Close menu' : 'Open menu'}
      >
        <span className={`fab-toggle-icon ${expanded ? 'fab-toggle-close' : ''}`}>
          {expanded ? '\u00D7' : <IconComponent />}
        </span>
      </button>
    </div>
  )
}

function FabButton({ item }: { item: any }) {
  const [modalOpen, setModalOpen] = useState(false)
  const IconComponent = iconMap[item.icon] || ChatIcon

  function getHref(): string | null {
    switch (item.action) {
      case 'whatsapp': {
        const num = (item.whatsappNumber || '').replace(/\s/g, '').replace(/^\+/, '')
        const msg = item.whatsappMessage ? `&text=${encodeURIComponent(item.whatsappMessage)}` : ''
        return `https://wa.me/${num}${msg}`
      }
      case 'phone':
        return `tel:${(item.phoneNumber || '').replace(/\s/g, '')}`
      case 'email':
        return `mailto:${item.emailAddress || ''}`
      case 'url':
        return item.url || '#'
      default:
        return null
    }
  }

  // Scroll to top action
  if (item.action === 'scroll-top') {
    return (
      <button
        className="fab-btn"
        style={{ background: item.color || '#333' }}
        title={item.label}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <IconComponent />
      </button>
    )
  }

  // Popup form action
  if (item.action === 'popup-form') {
    const formData = typeof item.popupForm === 'object' ? item.popupForm : null
    return (
      <>
        <button
          className="fab-btn"
          style={{ background: item.color || 'var(--color-primary)' }}
          title={item.label}
          onClick={() => setModalOpen(true)}
        >
          <IconComponent />
        </button>
        {modalOpen && formData && (
          <FabFormModal formData={formData} onClose={() => setModalOpen(false)} />
        )}
      </>
    )
  }

  // Link action (URL, WhatsApp, phone, email)
  const href = getHref()
  return (
    <a
      className="fab-btn"
      style={{ background: item.color || '#25D366' }}
      href={href || '#'}
      target="_blank"
      rel="noopener noreferrer"
      title={item.label}
    >
      <IconComponent />
    </a>
  )
}

/* ── Inline form modal for FAB popup-form action ── */

function FabFormModal({ formData, onClose }: { formData: any; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fields = formData.fields || []

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const data = new FormData(e.currentTarget)
    const submissionData: any[] = []
    fields.forEach((field: any) => {
      if (field.blockType === 'message') return
      const name = field.name || field.label
      if (!name) return
      const value = data.get(name)
      const strValue = value !== null ? String(value) : ''
      if (strValue || field.blockType === 'checkbox') {
        submissionData.push({ field: name, value: strValue || '(empty)' })
      }
    })
    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formData.id, submissionData }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const errBody = await res.text().catch(() => '(unreadable)')
        console.error('[FAB form] Submission failed', res.status, errBody)
        setError('Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error('[FAB form] Network error', err)
      setError('Network error. Please check your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose} aria-label="Close">&times;</button>
        {formData.title && <h2>{formData.title}</h2>}
        {submitted ? (
          <div className="form-message success">
            {renderConfirmation(formData.confirmationMessage) || 'Thank you! Your submission has been received.'}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            {fields.map((field: any, i: number) => {
              const name = field.name || field.label
              const bt = field.blockType
              if (bt === 'email') return <div key={i} className="form-field"><label>{field.label}{field.required && <span className="required-mark"> *</span>}</label><input type="email" name={name} required={field.required} /></div>
              if (bt === 'textarea') return <div key={i} className="form-field"><label>{field.label}{field.required && <span className="required-mark"> *</span>}</label><textarea name={name} required={field.required} rows={3} /></div>
              if (bt === 'select') return <div key={i} className="form-field"><label>{field.label}{field.required && <span className="required-mark"> *</span>}</label><select name={name} required={field.required}><option value="">Select...</option>{field.options?.map((o: any, j: number) => <option key={j} value={o.value}>{o.label}</option>)}</select></div>
              if (bt === 'checkbox') return <div key={i} className="form-field form-checkbox"><input type="checkbox" id={`fab-${name}`} name={name} required={field.required} /><label htmlFor={`fab-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label></div>
              if (bt === 'message') return <div key={i} className="form-field form-message-field"><p>{field.message}</p></div>
              return <div key={i} className="form-field"><label>{field.label}{field.required && <span className="required-mark"> *</span>}</label><input type="text" name={name} required={field.required} /></div>
            })}
            {error && <div className="form-message error">{error}</div>}
            <div className="form-submit">
              <button type="submit" className="form-submit-btn" disabled={submitting}>
                {submitting ? 'Sending...' : (formData.submitButtonLabel || 'Submit')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

function renderConfirmation(msg: any): React.ReactNode {
  if (!msg) return null
  if (typeof msg === 'string') return msg
  if (msg?.root?.children) {
    const html = msg.root.children
      .map((node: any) => {
        if (node.type === 'paragraph') {
          const text = (node.children || []).map((c: any) => c.text || '').join('')
          return `<p>${text}</p>`
        }
        return ''
      })
      .join('')
    return <div dangerouslySetInnerHTML={{ __html: html }} />
  }
  return null
}

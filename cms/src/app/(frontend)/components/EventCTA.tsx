'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'

function ensureAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

interface EventCTAProps {
  event: any
  currency?: string
  /** 'section' = full CTA section with heading/price. 'hero' = just the button. */
  variant?: 'section' | 'hero'
}

export function EventCTA({ event, currency = '€', variant = 'section' }: EventCTAProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const label = event.ctaLabel || 'Register Now'
  const formData = (event.registrationForm && typeof event.registrationForm === 'object') ? event.registrationForm : null

  // Smart detection: if a form is configured, use popup mode.
  // If an external URL is set (and no form), navigate.
  const action = formData
    ? 'popup-form'
    : (event.ctaAction || 'navigate')

  const hasUrl = action === 'navigate' && event.externalRegistrationUrl
  const hasForm = action === 'popup-form' && formData

  if (!hasUrl && !hasForm) return null

  const button = (
    <>
      {hasUrl && (
        <a
          href={event.externalRegistrationUrl}
          className="btn btn-primary"
          {...(event.ctaNewTab !== false ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {label}
        </a>
      )}

      {hasForm && (
        <>
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            {label}
          </button>
          {modalOpen && (
            <FormModal
              formData={formData}
              onClose={() => setModalOpen(false)}
            />
          )}
        </>
      )}
    </>
  )

  if (variant === 'hero') return button

  return (
    <section className="event-cta">
      <div className="event-container" style={{ textAlign: 'center' }}>
        <h2>Ready to Join?</h2>
        {event.price != null && (
          <p className="event-cta-price">
            {event.price === 0 ? 'Free Event' : `From ${currency}${event.price}`}
          </p>
        )}
        {button}
      </div>
    </section>
  )
}

/* ── Popup form modal ── */

function FormModal({
  formData,
  onClose,
}: {
  formData: any
  onClose: () => void
}) {
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (submitted) {
      const timer = setTimeout(() => onClose(), 3000)
      return () => clearTimeout(timer)
    }
  }, [submitted, onClose])

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={onClose} aria-label="Close">&times;</button>
        {submitted ? (
          <div className="form-message success">
            {renderConfirmation(formData.confirmationMessage) || 'Thank you! Your registration has been received.'}
          </div>
        ) : (
          <>
            {formData.title && <h2>{formData.title}</h2>}
            <PopupForm formData={formData} onSuccess={() => setSubmitted(true)} />
          </>
        )}
      </div>
    </div>
  )
}

/* ── Form rendering ── */

function PopupForm({ formData, onSuccess }: { formData: any; onSuccess: () => void }) {
  const [submitting, setSubmitting] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState<Record<number, boolean>>({})

  const fields = formData.fields || []
  const consentSections = formData.consentSections || []
  const arrivalNotice = formData.arrivalNotice

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setSubmitting(true)

    const data = new FormData(form)
    const submissionData: any[] = []

    fields.forEach((field: any) => {
      if (field.blockType === 'message') return
      const name = field.name || field.label || field.blockName
      if (!name) return
      const value = data.get(name)
      const strValue = value !== null ? String(value) : ''
      if (strValue || field.blockType === 'checkbox') {
        submissionData.push({ field: name, value: strValue || '(empty)' })
      }
    })

    consentSections.forEach((section: any) => {
      section.declarations?.forEach((decl: any) => {
        const name = `consent_${decl.id || decl.title}`
        const value = data.get(name)
        submissionData.push({ field: `[Consent] ${decl.title}`, value: value ? 'Agreed' : 'Not agreed' })
      })
    })

    try {
      await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form: formData.id, submissionData }),
      })
    } catch { /* submit silently */ }

    setSubmitting(false)
    const redirectUrl = formData.confirmationType === 'redirect' && formData.redirect?.url
    if (redirectUrl) { window.location.href = ensureAbsoluteUrl(redirectUrl); return }
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      {fields.map((field: any, i: number) => renderFormField(field, i, 'ecta'))}

      {arrivalNotice && (
        <div className="arrival-notice"><strong>Important:</strong> {arrivalNotice}</div>
      )}

      {consentSections.map((section: any, si: number) => (
        <div key={si} className="consent-section">
          <div className="consent-section-title">{section.sectionTitle}</div>
          {section.declarations?.map((decl: any, di: number) => (
            <div key={di} className="declaration-item">
              <input
                type="checkbox"
                id={`ecta-consent-${si}-${di}`}
                name={`consent_${decl.id || decl.title}`}
                required={decl.required}
              />
              <label htmlFor={`ecta-consent-${si}-${di}`}>
                {decl.title && <strong>{decl.title}</strong>}
                {decl.description && <span> {decl.description}</span>}
                {decl.required && <span className="required-mark"> *</span>}
              </label>
            </div>
          ))}
          {section.collapsibleContent && (
            <div className="collapsible-details">
              <button
                type="button"
                className={`details-toggle${detailsOpen[si] ? ' active' : ''}`}
                onClick={() => setDetailsOpen(prev => ({ ...prev, [si]: !prev[si] }))}
              >
                {section.collapsibleLabel || 'View Full Consent Details'}
              </button>
              <div className={`details-content${detailsOpen[si] ? ' active' : ''}`}>
                <div className="rich-text" dangerouslySetInnerHTML={{ __html: serializeRichText(section.collapsibleContent) }} />
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="form-submit">
        <button type="submit" className="form-submit-btn" disabled={submitting}>
          {submitting ? (
            <span className="form-spinner-wrap"><span className="form-spinner" />Sending...</span>
          ) : (
            formData.submitButtonLabel || 'Submit'
          )}
        </button>
      </div>
    </form>
  )
}

/* ── Shared form field renderer ── */

function renderFormField(field: any, i: number, prefix: string) {
  const name = field.name || field.label || field.blockName || `field-${i}`
  const label = field.label || field.name || field.blockName || ''
  const blockType = field.blockType

  if (blockType === 'checkbox') {
    return (
      <div key={i} className="form-field form-checkbox">
        <input type="checkbox" id={`${prefix}-${name}`} name={name} required={field.required} />
        <label htmlFor={`${prefix}-${name}`}>{label}{field.required && <span className="required-mark"> *</span>}</label>
      </div>
    )
  }
  if (blockType === 'textarea') {
    return (
      <div key={i} className="form-field">
        <label htmlFor={`${prefix}-${name}`}>{label}{field.required && <span className="required-mark"> *</span>}</label>
        <textarea id={`${prefix}-${name}`} name={name} placeholder={label} required={field.required} rows={4} />
      </div>
    )
  }
  if (blockType === 'select') {
    return (
      <div key={i} className="form-field">
        <label htmlFor={`${prefix}-${name}`}>{label}{field.required && <span className="required-mark"> *</span>}</label>
        <select id={`${prefix}-${name}`} name={name} required={field.required}>
          <option value="">Select...</option>
          {field.options?.map((opt: any, j: number) => (
            <option key={j} value={opt.value || opt.label}>{opt.label}</option>
          ))}
        </select>
      </div>
    )
  }
  if (blockType === 'email') {
    return (
      <div key={i} className="form-field">
        <label htmlFor={`${prefix}-${name}`}>{label}{field.required && <span className="required-mark"> *</span>}</label>
        <input type="email" id={`${prefix}-${name}`} name={name} placeholder={label} required={field.required} />
      </div>
    )
  }
  if (blockType === 'number') {
    return (
      <div key={i} className="form-field">
        <label htmlFor={`${prefix}-${name}`}>{label}{field.required && <span className="required-mark"> *</span>}</label>
        <input type="number" id={`${prefix}-${name}`} name={name} placeholder={label} required={field.required} />
      </div>
    )
  }
  if (blockType === 'message') {
    const msg = field.message
    if (msg?.root?.children) {
      return <div key={i} className="form-field form-message-field"><div className="rich-text" dangerouslySetInnerHTML={{ __html: serializeRichText(msg) }} /></div>
    }
    if (typeof msg === 'string') {
      return <div key={i} className="form-field form-message-field"><p>{msg}</p></div>
    }
    return null
  }
  // Default: text input
  return (
    <div key={i} className="form-field">
      <label htmlFor={`${prefix}-${name}`}>{label}{field.required && <span className="required-mark"> *</span>}</label>
      <input type="text" id={`${prefix}-${name}`} name={name} placeholder={label} required={field.required} />
    </div>
  )
}

function renderConfirmation(msg: any): React.ReactNode {
  if (!msg) return null
  if (typeof msg === 'string') return msg
  if (msg?.root?.children) {
    return <div className="rich-text" dangerouslySetInnerHTML={{ __html: serializeRichText(msg) }} />
  }
  return null
}

function serializeRichText(content: any): string {
  if (!content?.root?.children) return ''
  return content.root.children.map((node: any) => serializeNode(node)).join('')
}

function serializeNode(node: any): string {
  if (node.type === 'text') {
    let text = node.text || ''
    if (node.format & 1) text = `<strong>${text}</strong>`
    if (node.format & 2) text = `<em>${text}</em>`
    return text
  }
  const children = (node.children || []).map((c: any) => serializeNode(c)).join('')
  switch (node.type) {
    case 'paragraph': return `<p>${children}</p>`
    case 'heading': return `<h${node.tag?.[1] || '4'}>${children}</h${node.tag?.[1] || '4'}>`
    case 'list': return node.listType === 'number' ? `<ol>${children}</ol>` : `<ul>${children}</ul>`
    case 'listitem': return `<li>${children}</li>`
    default: return children
  }
}

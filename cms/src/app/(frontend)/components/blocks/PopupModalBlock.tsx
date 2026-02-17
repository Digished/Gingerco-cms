'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'

function ensureAbsoluteUrl(url: string): string {
  if (/^https?:\/\//i.test(url)) return url
  return `https://${url}`
}

export function PopupModalBlock({ block }: { block: any }) {
  const { triggerLabel, triggerStyle, alignment, modalHeading, modalSubtitle, form } = block
  const [open, setOpen] = useState(false)

  const formData = typeof form === 'object' ? form : null

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className={`block-popup-trigger ${alignment === 'left' ? 'align-left' : 'align-center'}`}>
      <button
        className={`btn btn-${triggerStyle || 'primary'}`}
        onClick={() => setOpen(true)}
      >
        {triggerLabel || 'Open'}
      </button>

      {open && (
        <div className="popup-overlay" onClick={() => setOpen(false)}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setOpen(false)} aria-label="Close">&times;</button>
            {modalHeading && <h2>{modalHeading}</h2>}
            {modalSubtitle && <p className="popup-subtitle">{modalSubtitle}</p>}
            {formData && (
              <ModalForm formData={formData} onSuccess={() => {}} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function ModalForm({ formData, onSuccess }: { formData: any; onSuccess: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState<Record<number, boolean>>({})

  const fields = formData.fields || []
  const consentSections = formData.consentSections || []
  const arrivalNotice = formData.arrivalNotice

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

    // Collect consent checkbox values
    consentSections.forEach((section: any) => {
      section.declarations?.forEach((decl: any) => {
        const name = `consent_${decl.id || decl.title}`
        const value = data.get(name)
        submissionData.push({ field: `[Consent] ${decl.title}`, value: value ? 'Agreed' : 'Not agreed' })
      })
    })

    try {
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formData.id,
          submissionData,
        }),
      })

      if (res.ok) {
        const redirectUrl = formData.confirmationType === 'redirect' && formData.redirect?.url
        if (redirectUrl) { window.location.href = ensureAbsoluteUrl(redirectUrl); return }
        setSubmitted(true)
        onSuccess()
      } else {
        setError('Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="form-message success">
        {renderConfirmation(formData.confirmationMessage) || 'Thank you! Your submission has been received.'}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="modal-form">
      {fields.map((field: any, i: number) => {
        const name = field.name || field.label
        const blockType = field.blockType

        if (blockType === 'checkbox') {
          return (
            <div key={i} className="form-field form-checkbox">
              <input type="checkbox" id={`modal-${name}`} name={name} required={field.required} />
              <label htmlFor={`modal-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
            </div>
          )
        }

        if (blockType === 'textarea') {
          return (
            <div key={i} className="form-field">
              <label htmlFor={`modal-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
              <textarea id={`modal-${name}`} name={name} required={field.required} rows={4} />
            </div>
          )
        }

        if (blockType === 'select') {
          return (
            <div key={i} className="form-field">
              <label htmlFor={`modal-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
              <select id={`modal-${name}`} name={name} required={field.required}>
                <option value="">Select...</option>
                {field.options?.map((opt: any, j: number) => (
                  <option key={j} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )
        }

        if (blockType === 'email') {
          return (
            <div key={i} className="form-field">
              <label htmlFor={`modal-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
              <input type="email" id={`modal-${name}`} name={name} required={field.required} />
            </div>
          )
        }

        if (blockType === 'number') {
          return (
            <div key={i} className="form-field">
              <label htmlFor={`modal-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
              <input type="number" id={`modal-${name}`} name={name} required={field.required} />
            </div>
          )
        }

        if (blockType === 'message') {
          return (
            <div key={i} className="form-field form-message-field">
              <p>{field.message}</p>
            </div>
          )
        }

        return (
          <div key={i} className="form-field">
            <label htmlFor={`modal-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
            <input type="text" id={`modal-${name}`} name={name} required={field.required} />
          </div>
        )
      })}

      {/* Arrival Notice */}
      {arrivalNotice && (
        <div className="arrival-notice">
          <strong>Important:</strong> {arrivalNotice}
        </div>
      )}

      {/* Consent Sections */}
      {consentSections.map((section: any, si: number) => (
        <div key={si} className="consent-section">
          <div className="consent-section-title">{section.sectionTitle}</div>
          {section.declarations?.map((decl: any, di: number) => (
            <div key={di} className="declaration-item">
              <input
                type="checkbox"
                id={`consent-modal-${si}-${di}`}
                name={`consent_${decl.id || decl.title}`}
                required={decl.required}
              />
              <label htmlFor={`consent-modal-${si}-${di}`}>
                {decl.title && <strong>{decl.title}</strong>}
                {decl.description && <span>{decl.description}</span>}
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

      {error && <div className="form-message error">{error}</div>}

      <div className="form-submit">
        <button type="submit" className="form-submit-btn" disabled={submitting}>
          {submitting ? (
            <span className="form-spinner-wrap">
              <span className="form-spinner" />
              Sending...
            </span>
          ) : (
            formData.submitButtonLabel || 'Submit'
          )}
        </button>
      </div>
    </form>
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

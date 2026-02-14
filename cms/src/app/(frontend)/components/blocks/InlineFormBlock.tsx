'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'

export function InlineFormBlock({ formData }: { formData: any }) {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState<Record<number, boolean>>({})

  if (!formData) return null

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
      const name = field.name || field.label
      const value = data.get(name)
      if (value !== null) {
        submissionData.push({ field: name, value: String(value) })
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
      const res = await fetch('/api/form-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          form: formData.id,
          submissionData,
        }),
      })

      if (res.ok) {
        setSubmitted(true)
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
      <div className="inline-form-success">
        {formData.confirmationMessage || 'Thank you! Your submission has been received.'}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="inline-form">
      {fields.map((field: any, i: number) => {
        const name = field.name || field.label
        const blockType = field.blockType

        if (blockType === 'checkbox') {
          return (
            <div key={i} className="form-field form-checkbox">
              <input type="checkbox" id={`inline-${name}`} name={name} required={field.required} />
              <label htmlFor={`inline-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
            </div>
          )
        }

        if (blockType === 'textarea') {
          return (
            <div key={i} className="form-field">
              <label htmlFor={`inline-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
              <textarea id={`inline-${name}`} name={name} required={field.required} />
            </div>
          )
        }

        if (blockType === 'select') {
          return (
            <div key={i} className="form-field">
              <label htmlFor={`inline-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
              <select id={`inline-${name}`} name={name} required={field.required}>
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
              <label htmlFor={`inline-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
              <input type="email" id={`inline-${name}`} name={name} required={field.required} />
            </div>
          )
        }

        if (blockType === 'number') {
          return (
            <div key={i} className="form-field">
              <label htmlFor={`inline-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
              <input type="number" id={`inline-${name}`} name={name} required={field.required} />
            </div>
          )
        }

        if (blockType === 'message') {
          return (
            <div key={i} className="form-field">
              <p>{field.message}</p>
            </div>
          )
        }

        return (
          <div key={i} className="form-field">
            <label htmlFor={`inline-${name}`}>{field.label}{field.required && <span className="required-mark"> *</span>}</label>
            <input type="text" id={`inline-${name}`} name={name} required={field.required} />
          </div>
        )
      })}

      {arrivalNotice && (
        <div className="arrival-notice">
          <strong>Important:</strong> {arrivalNotice}
        </div>
      )}

      {consentSections.map((section: any, si: number) => (
        <div key={si} className="consent-section">
          <div className="consent-section-title">{section.sectionTitle}</div>
          {section.declarations?.map((decl: any, di: number) => (
            <div key={di} className="declaration-item">
              <input
                type="checkbox"
                id={`inline-consent-${si}-${di}`}
                name={`consent_${decl.id || decl.title}`}
                required={decl.required}
              />
              <label htmlFor={`inline-consent-${si}-${di}`}>
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

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Sending...' : (formData.submitButtonLabel || 'Submit')}
      </button>
    </form>
  )
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

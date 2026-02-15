'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'

export function FormBlockComponent({ block }: { block: any }) {
  const { heading, description, form, backgroundColor } = block
  const bgClass = backgroundColor === 'dark' ? 'bg-dark' : backgroundColor === 'light-gray' ? 'bg-light-gray' : 'bg-white'
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState<Record<number, boolean>>({})

  const formData = typeof form === 'object' ? form : null
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
      <section className={`block-form ${bgClass}`}>
        <div className="form-inner">
          <div className="form-message success">
            {formData.confirmationMessage || 'Thank you! Your submission has been received.'}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`block-form ${bgClass}`}>
      <div className="form-inner">
        {heading && <h2>{heading}</h2>}
        {description && <p className="form-description">{description}</p>}
        <form onSubmit={handleSubmit} className="cms-form">
          {fields.map((field: any, i: number) => {
            const name = field.name || field.label
            const label = field.label || field.name || ''
            const blockType = field.blockType

            if (blockType === 'checkbox') {
              // If field has options, render as a multi-checkbox group
              if (field.options && field.options.length > 0) {
                return (
                  <div key={i} className="form-field">
                    <label>{label}{field.required && <span className="required-mark"> *</span>}</label>
                    <div className="checkbox-group">
                      {field.options.map((opt: any, j: number) => (
                        <div key={j} className="form-checkbox">
                          <input type="checkbox" id={`${name}-${j}`} name={name} value={opt.value} />
                          <label htmlFor={`${name}-${j}`}>{opt.label}</label>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              }
              return (
                <div key={i} className="form-field form-checkbox">
                  <input type="checkbox" id={name} name={name} required={field.required} />
                  <label htmlFor={name}>{label}{field.required && <span className="required-mark"> *</span>}</label>
                </div>
              )
            }

            if (blockType === 'textarea') {
              return (
                <div key={i} className="form-field">
                  <label htmlFor={name}>{label}{field.required && <span className="required-mark"> *</span>}</label>
                  <textarea id={name} name={name} required={field.required} rows={4} />
                </div>
              )
            }

            if (blockType === 'select') {
              return (
                <div key={i} className="form-field">
                  <label htmlFor={name}>{label}{field.required && <span className="required-mark"> *</span>}</label>
                  <select id={name} name={name} required={field.required} multiple={field.multiple || false}>
                    {!field.multiple && <option value="">Select...</option>}
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
                  <label htmlFor={name}>{label}{field.required && <span className="required-mark"> *</span>}</label>
                  <input type="email" id={name} name={name} required={field.required} />
                </div>
              )
            }

            if (blockType === 'number') {
              return (
                <div key={i} className="form-field">
                  <label htmlFor={name}>{label}{field.required && <span className="required-mark"> *</span>}</label>
                  <input type="number" id={name} name={name} required={field.required} />
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
                <label htmlFor={name}>{label}{field.required && <span className="required-mark"> *</span>}</label>
                <input type="text" id={name} name={name} required={field.required} />
              </div>
            )
          })}

          {/* Arrival Notice */}
          {arrivalNotice && (
            <div className="arrival-notice">
              <strong>Important:</strong> {arrivalNotice}
            </div>
          )}

          {/* Consent / GDPR Sections */}
          {consentSections.map((section: any, si: number) => (
            <div key={si} className="consent-section">
              <div className="consent-section-title">{section.sectionTitle}</div>
              {section.declarations?.map((decl: any, di: number) => (
                <div key={di} className="declaration-item">
                  <input
                    type="checkbox"
                    id={`consent-${si}-${di}`}
                    name={`consent_${decl.id || decl.title}`}
                    required={decl.required}
                  />
                  <label htmlFor={`consent-${si}-${di}`}>
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
      </div>
    </section>
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

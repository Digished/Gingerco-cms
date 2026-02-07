'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'

export function FormBlockComponent({ block }: { block: any }) {
  const { heading, description, form } = block
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const formData = typeof form === 'object' ? form : null
  if (!formData) return null

  const fields = formData.fields || []

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
      <section className="block-form">
        <div className="form-inner">
          <div className="form-message success">
            {formData.confirmationMessage || 'Thank you! Your submission has been received.'}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="block-form">
      <div className="form-inner">
        {heading && <h2>{heading}</h2>}
        {description && <p className="form-description">{description}</p>}
        <form onSubmit={handleSubmit}>
          {fields.map((field: any, i: number) => {
            const name = field.name || field.label
            const blockType = field.blockType

            if (blockType === 'checkbox') {
              return (
                <div key={i} className="form-field form-checkbox">
                  <input type="checkbox" id={name} name={name} required={field.required} />
                  <label htmlFor={name}>{field.label}{field.required && ' *'}</label>
                </div>
              )
            }

            if (blockType === 'textarea') {
              return (
                <div key={i} className="form-field">
                  <label htmlFor={name}>{field.label}{field.required && ' *'}</label>
                  <textarea id={name} name={name} required={field.required} />
                </div>
              )
            }

            if (blockType === 'select') {
              return (
                <div key={i} className="form-field">
                  <label htmlFor={name}>{field.label}{field.required && ' *'}</label>
                  <select id={name} name={name} required={field.required}>
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
                  <label htmlFor={name}>{field.label}{field.required && ' *'}</label>
                  <input type="email" id={name} name={name} required={field.required} />
                </div>
              )
            }

            if (blockType === 'number') {
              return (
                <div key={i} className="form-field">
                  <label htmlFor={name}>{field.label}{field.required && ' *'}</label>
                  <input type="number" id={name} name={name} required={field.required} />
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

            // Default: text input
            return (
              <div key={i} className="form-field">
                <label htmlFor={name}>{field.label}{field.required && ' *'}</label>
                <input type="text" id={name} name={name} required={field.required} />
              </div>
            )
          })}

          {error && <div className="form-message error">{error}</div>}

          <div className="form-submit">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Sending...' : (formData.submitButtonLabel || 'Submit')}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}

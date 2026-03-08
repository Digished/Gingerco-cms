'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'

export function NewsletterBlockComponent({ block }: { block: any }) {
  const {
    heading,
    description,
    collectFirstName = false,
    collectLastName = false,
    submitButtonLabel = 'Subscribe',
    successMessage = 'Thanks! Please check your email to confirm your subscription.',
    source,
    tags,
    backgroundColor = 'light-gray',
    alignment = 'center',
  } = block

  const bgClass =
    backgroundColor === 'dark'
      ? 'bg-dark'
      : backgroundColor === 'light-gray'
        ? 'bg-light-gray'
        : 'bg-white'
  const alignClass = alignment === 'left' ? 'newsletter-align-left' : 'newsletter-align-center'

  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setSubmitting(true)
    setError('')

    const data = new FormData(form)
    const payload: Record<string, string> = {
      email: String(data.get('email') || ''),
    }
    if (collectFirstName) payload.firstName = String(data.get('firstName') || '')
    if (collectLastName) payload.lastName = String(data.get('lastName') || '')
    if (source) payload.source = source
    if (tags) payload.tags = tags

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        setSubmitted(true)
      } else {
        const body = await res.json().catch(() => ({}))
        setError(body?.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <section className={`block-newsletter ${bgClass}`}>
        <div className={`newsletter-inner ${alignClass}`}>
          <p className="newsletter-success">{successMessage}</p>
        </div>
      </section>
    )
  }

  return (
    <section className={`block-newsletter ${bgClass}`}>
      <div className={`newsletter-inner ${alignClass}`}>
        {heading && <h2 className="newsletter-heading">{heading}</h2>}
        {description && <p className="newsletter-description">{description}</p>}

        <form onSubmit={handleSubmit} className="newsletter-form">
          {(collectFirstName || collectLastName) && (
            <div className="newsletter-name-row">
              {collectFirstName && (
                <div className="form-field">
                  <label htmlFor="newsletter-firstName">First Name</label>
                  <input type="text" id="newsletter-firstName" name="firstName" />
                </div>
              )}
              {collectLastName && (
                <div className="form-field">
                  <label htmlFor="newsletter-lastName">Last Name</label>
                  <input type="text" id="newsletter-lastName" name="lastName" />
                </div>
              )}
            </div>
          )}

          <div className="newsletter-email-row">
            <div className="form-field">
              <label htmlFor="newsletter-email">
                Email <span className="required-mark">*</span>
              </label>
              <input type="email" id="newsletter-email" name="email" required />
            </div>
            <button type="submit" className="btn btn-primary newsletter-submit" disabled={submitting}>
              {submitting ? (
                <span className="form-spinner-wrap">
                  <span className="form-spinner" />
                  Sending...
                </span>
              ) : (
                submitButtonLabel
              )}
            </button>
          </div>

          {error && <div className="form-message error">{error}</div>}
        </form>
      </div>
    </section>
  )
}

'use client'

import React, { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export const SendCampaignButton: React.FC = () => {
  const { id, savedDocumentData } = useDocumentInfo()
  const [sending, setSending] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [showSchedulePicker, setShowSchedulePicker] = useState(false)
  const [scheduledFor, setScheduledFor] = useState('')
  const [result, setResult] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null)

  const status = savedDocumentData?.status

  if (!id) return null

  if (status === 'sent') {
    return (
      <div style={bannerStyle('#f0fdf4', '#86efac', '#166534')}>
        ✓ Campaign sent — {savedDocumentData?.totalSent ?? 0} emails dispatched
      </div>
    )
  }

  if (status === 'sending') {
    return (
      <div style={bannerStyle('#fef9c3', '#fde047', '#854d0e')}>
        Sending in progress…
      </div>
    )
  }

  if (status === 'scheduled') {
    const when = savedDocumentData?.scheduledFor
      ? new Date(savedDocumentData.scheduledFor).toLocaleString()
      : 'unknown time'
    return (
      <div style={bannerStyle('#eff6ff', '#93c5fd', '#1e40af')}>
        ⏰ Scheduled for {when}
        <button
          onClick={handleCancelSchedule}
          style={{ marginLeft: 12, background: 'none', border: '1px solid #93c5fd', borderRadius: 4, padding: '2px 8px', cursor: 'pointer', fontSize: 12, color: '#1e40af' }}
        >
          Cancel
        </button>
      </div>
    )
  }

  const handleSendNow = async () => {
    const confirmed = window.confirm(
      `Send "${savedDocumentData?.subject || 'this campaign'}" to ${
        savedDocumentData?.recipientFilter === 'by-tags' ? 'tagged' : 'all'
      } subscribers?\n\nThis cannot be undone.`,
    )
    if (!confirmed) return

    setSending(true)
    setResult(null)

    try {
      const res = await fetch(`/api/email-campaigns/${id}/send`, { method: 'POST' })
      const data = await res.json()

      if (res.ok) {
        setResult({
          type: data.warnings?.length ? 'warning' : 'success',
          message: data.warnings?.length
            ? `Sent to ${data.sent} subscribers (${data.warnings.length} partial errors)`
            : `✓ Sent to ${data.sent} subscribers`,
        })
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setResult({ type: 'error', message: `Error: ${data.error || 'Failed to send'}` })
      }
    } catch {
      setResult({ type: 'error', message: 'Network error — please try again.' })
    } finally {
      setSending(false)
    }
  }

  const handleSchedule = async () => {
    if (!scheduledFor) {
      setResult({ type: 'error', message: 'Please pick a date and time.' })
      return
    }
    if (new Date(scheduledFor) <= new Date()) {
      setResult({ type: 'error', message: 'Scheduled time must be in the future.' })
      return
    }

    setScheduling(true)
    setResult(null)

    try {
      const res = await fetch(`/api/email-campaigns/${id}/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledFor }),
      })
      const data = await res.json()

      if (res.ok) {
        setResult({ type: 'success', message: `✓ Scheduled for ${new Date(scheduledFor).toLocaleString()}` })
        setShowSchedulePicker(false)
        setTimeout(() => window.location.reload(), 1500)
      } else {
        setResult({ type: 'error', message: `Error: ${data.error || 'Failed to schedule'}` })
      }
    } catch {
      setResult({ type: 'error', message: 'Network error — please try again.' })
    } finally {
      setScheduling(false)
    }
  }

  async function handleCancelSchedule() {
    if (!window.confirm('Cancel this scheduled campaign? It will return to "Ready to Send" status.')) return
    try {
      await fetch(`/api/email-campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ready', scheduledFor: null }),
      })
      window.location.reload()
    } catch {
      // ignore
    }
  }

  const resultStyles: Record<string, React.CSSProperties> = {
    success: { background: '#f0fdf4', border: '1px solid #86efac', color: '#166534' },
    warning: { background: '#fef9c3', border: '1px solid #fde047', color: '#854d0e' },
    error:   { background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b' },
  }

  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
        {/* Send Now */}
        <button
          onClick={handleSendNow}
          disabled={sending || scheduling}
          style={btnStyle(sending || scheduling, '#D4AF37', '#1A1A1A')}
        >
          {sending ? 'Sending…' : 'Send Now'}
        </button>

        {/* Schedule toggle */}
        <button
          onClick={() => { setShowSchedulePicker(v => !v); setResult(null) }}
          disabled={sending || scheduling}
          style={btnStyle(sending || scheduling, '#1A1A1A', '#D4AF37')}
        >
          ⏰ Schedule
        </button>
      </div>

      {showSchedulePicker && (
        <div style={{ marginTop: 8, padding: '12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 4 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#374151', marginBottom: 4 }}>
            Send at (your local time):
          </label>
          <input
            type="datetime-local"
            value={scheduledFor}
            onChange={(e) => setScheduledFor(e.target.value)}
            min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
            style={{ width: '100%', padding: '6px 8px', border: '1px solid #d1d5db', borderRadius: 4, fontSize: 13, marginBottom: 8 }}
          />
          <button
            onClick={handleSchedule}
            disabled={scheduling || !scheduledFor}
            style={btnStyle(scheduling || !scheduledFor, '#D4AF37', '#1A1A1A')}
          >
            {scheduling ? 'Scheduling…' : 'Confirm Schedule'}
          </button>
        </div>
      )}

      {result && (
        <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 4, fontSize: 13, ...resultStyles[result.type] }}>
          {result.message}
        </div>
      )}
    </div>
  )
}

function bannerStyle(bg: string, border: string, color: string): React.CSSProperties {
  return { marginBottom: 8, padding: '10px 14px', background: bg, border: `1px solid ${border}`, borderRadius: 4, fontSize: 13, color }
}

function btnStyle(disabled: boolean, bg: string, color: string): React.CSSProperties {
  return {
    flex: 1,
    background: disabled ? '#999' : bg,
    color,
    border: 'none',
    padding: '10px 16px',
    borderRadius: 4,
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: 'bold',
    fontSize: 13,
    letterSpacing: '0.5px',
  }
}

'use client'

import React, { useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export const SendCampaignButton: React.FC = () => {
  const { id, savedDocumentData } = useDocumentInfo()
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error' | 'warning'; message: string } | null>(null)

  const status = savedDocumentData?.status

  // Don't show for new unsaved documents
  if (!id) return null

  // Already sent — show read-only info
  if (status === 'sent') {
    return (
      <div style={{ marginBottom: '8px', padding: '10px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '4px', fontSize: '13px', color: '#166534' }}>
        ✓ Campaign sent — {savedDocumentData?.totalSent ?? 0} emails dispatched
      </div>
    )
  }

  if (status === 'sending') {
    return (
      <div style={{ marginBottom: '8px', padding: '10px 14px', background: '#fef9c3', border: '1px solid #fde047', borderRadius: '4px', fontSize: '13px', color: '#854d0e' }}>
        Sending in progress...
      </div>
    )
  }

  const handleSend = async () => {
    const confirmed = window.confirm(
      `Send "${savedDocumentData?.subject || 'this campaign'}" to ${
        savedDocumentData?.recipientFilter === 'by-tags' ? 'tagged' : 'all'
      } subscribers?\n\nThis cannot be undone.`
    )
    if (!confirmed) return

    setSending(true)
    setResult(null)

    try {
      const res = await fetch(`/api/email-campaigns/${id}/send`, { method: 'POST' })
      const data = await res.json()

      if (res.ok) {
        if (data.warnings?.length) {
          setResult({ type: 'warning', message: `Sent to ${data.sent} subscribers (${data.warnings.length} partial errors)` })
        } else {
          setResult({ type: 'success', message: `✓ Sent to ${data.sent} subscribers` })
        }
        // Reload to refresh the status fields
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

  const resultStyles: Record<string, React.CSSProperties> = {
    success: { background: '#f0fdf4', border: '1px solid #86efac', color: '#166534' },
    warning: { background: '#fef9c3', border: '1px solid #fde047', color: '#854d0e' },
    error: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b' },
  }

  return (
    <div style={{ marginBottom: '8px' }}>
      <button
        onClick={handleSend}
        disabled={sending}
        style={{
          background: sending ? '#999' : '#D4AF37',
          color: '#1A1A1A',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          cursor: sending ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          letterSpacing: '0.5px',
          width: '100%',
        }}
      >
        {sending ? 'Sending…' : 'Send Campaign'}
      </button>

      {result && (
        <div
          style={{
            marginTop: '8px',
            padding: '8px 12px',
            borderRadius: '4px',
            fontSize: '13px',
            ...resultStyles[result.type],
          }}
        >
          {result.message}
        </div>
      )}
    </div>
  )
}

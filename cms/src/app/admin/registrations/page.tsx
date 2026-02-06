/**
 * Registrations Management Page
 *
 * View and manage all event registrations
 * Features:
 * - List registrations in table format
 * - Filter by event and status
 * - Export to CSV
 * - View registration details
 * - Approve/reject registrations
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Registration {
  id: string
  event_id: string
  full_name_encrypted?: string
  email_encrypted?: string
  phone_encrypted?: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  event?: {
    name: string
  }
}

interface Event {
  id: string
  name: string
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const supabase = createClient()

  useEffect(() => {
    fetchData()
    setupSubscription()
  }, [supabase])

  async function fetchData() {
    try {
      setLoading(true)

      // Fetch events for filter dropdown
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('id, name')
        .eq('status', 'published')
        .order('start_date', { ascending: false })

      if (eventsError) throw eventsError
      setEvents(eventsData || [])

      // Fetch registrations
      let query = supabase
        .from('registrations')
        .select('id, event_id, status, created_at')
        .order('created_at', { ascending: false })

      if (selectedEvent !== 'all') {
        query = query.eq('event_id', selectedEvent)
      }

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus)
      }

      const { data: regData, error: regError } = await query

      if (regError) throw regError

      // Enrich with event names
      const enrichedRegistrations = (regData || []).map((reg) => ({
        ...reg,
        event: eventsData?.find((e) => e.id === reg.event_id),
      }))

      setRegistrations(enrichedRegistrations)
      setError(null)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load registrations')
    } finally {
      setLoading(false)
    }
  }

  function setupSubscription() {
    const subscription = supabase
      .channel('registrations-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        () => {
          fetchData()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  async function updateStatus(
    registrationId: string,
    newStatus: 'pending' | 'approved' | 'rejected'
  ) {
    try {
      const { error: updateError } = await supabase
        .from('registrations')
        .update({ status: newStatus })
        .eq('id', registrationId)

      if (updateError) throw updateError
      await fetchData()
    } catch (err) {
      console.error('Error updating registration:', err)
      setError('Failed to update registration')
    }
  }

  function exportToCSV() {
    const headers = ['ID', 'Event', 'Status', 'Date']
    const rows = registrations.map((reg) => [
      reg.id,
      reg.event?.name || 'N/A',
      reg.status,
      new Date(reg.created_at).toLocaleDateString(),
    ])

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const filteredRegistrations =
    selectedEvent === 'all'
      ? registrations
      : registrations.filter((r) => r.event_id === selectedEvent)

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registrations</h1>
          <p className="text-gray-600 mt-1">View and manage event registrations</p>
        </div>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition"
        >
          📥 Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Event
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Events</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Registrations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Loading registrations...
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No registrations found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                    {reg.id.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {reg.event?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(reg.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={reg.status}
                      onChange={(e) =>
                        updateStatus(reg.id, e.target.value as any)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium border-0 focus:ring-2 cursor-pointer ${
                        reg.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : reg.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => {/* TODO: View details */}}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

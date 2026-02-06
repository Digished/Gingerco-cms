/**
 * Edit Event Page
 */

'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { EventForm } from '../../EventForm'

interface Event {
  id: string
  name: string
  description: string
  start_date: string
  capacity: number
  location?: string
}

export default function EditEventPage() {
  const params = useParams()
  const eventId = params.id as string
  const supabase = createClient()

  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  async function fetchEvent() {
    try {
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single()

      if (fetchError) throw fetchError
      setEvent(data)
    } catch (err) {
      console.error('Error fetching event:', err)
      setError('Failed to load event')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading event...</p>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-800">{error || 'Event not found'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
        <p className="text-gray-600 mt-1">Update event details</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <EventForm eventId={eventId} initialData={event} />
      </div>
    </div>
  )
}

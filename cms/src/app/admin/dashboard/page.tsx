/**
 * Admin Dashboard
 *
 * Overview page with real-time statistics:
 * - Total events and registrations
 * - Recent activity
 * - Upcoming events
 * - Revenue metrics (if applicable)
 */

'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  totalEvents: number
  totalRegistrations: number
  totalSessions: number
  pendingApprovals: number
}

interface Event {
  id: string
  name: string
  status: string
  start_date: string
  capacity: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch statistics
        const [eventsRes, registrationsRes, sessionsRes] = await Promise.all([
          supabase
            .from('events')
            .select('id', { count: 'exact', head: true })
            .eq('status', 'published'),
          supabase
            .from('registrations')
            .select('id', { count: 'exact', head: true }),
          supabase
            .from('sessions')
            .select('id', { count: 'exact', head: true }),
        ])

        const eventsCount = eventsRes.count ?? 0
        const registrationsCount = registrationsRes.count ?? 0
        const sessionsCount = sessionsRes.count ?? 0

        setStats({
          totalEvents: eventsCount,
          totalRegistrations: registrationsCount,
          totalSessions: sessionsCount,
          pendingApprovals: 0, // TODO: Count pending registrations
        })

        // Fetch upcoming events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('id, name, status, start_date, capacity')
          .eq('status', 'published')
          .order('start_date', { ascending: true })
          .limit(5)

        if (eventsError) throw eventsError

        setUpcomingEvents(events || [])
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()

    // Set up real-time subscription
    const subscription = supabase
      .channel('dashboard-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        () => {
          // Refetch data on any event change
          fetchDashboardData()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: stats?.totalEvents ?? 0, icon: '📅' },
          { label: 'Registrations', value: stats?.totalRegistrations ?? 0, icon: '👥' },
          { label: 'Sessions', value: stats?.totalSessions ?? 0, icon: '⏰' },
          { label: 'Pending', value: stats?.pendingApprovals ?? 0, icon: '⏳' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stat.value}
                </p>
              </div>
              <div className="text-4xl">{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Event Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {upcomingEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No upcoming events
                  </td>
                </tr>
              ) : (
                upcomingEvents.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{event.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(event.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {event.capacity}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {event.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Create Event', href: '/admin/events/new', color: 'blue' },
          { label: 'View Registrations', href: '/admin/registrations', color: 'green' },
          { label: 'Manage Forms', href: '/admin/forms', color: 'purple' },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className={`bg-${action.color}-600 hover:bg-${action.color}-700 text-white rounded-lg p-4 text-center font-medium transition`}
          >
            {action.label}
          </a>
        ))}
      </div>
    </div>
  )
}

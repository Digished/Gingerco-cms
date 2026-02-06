/**
 * Create Event Page
 */

import { EventForm } from '../EventForm'

export const metadata = {
  title: 'Create Event - Gingerco CMS',
}

export default function CreateEventPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Event</h1>
        <p className="text-gray-600 mt-1">Add a new event to your calendar</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <EventForm />
      </div>
    </div>
  )
}

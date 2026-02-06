/**
 * Forms Management Page
 *
 * Manage dynamic forms for events and general use
 * Features:
 * - List all forms
 * - Create new form
 * - Edit form configuration
 * - View form submissions
 * - Delete form
 */

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface Form {
  id: string
  name: string
  description: string
  fields: any[]
  submissions_count?: number
  created_at: string
}

export default function FormsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchForms()
    setupSubscription()
  }, [supabase])

  async function fetchForms() {
    try {
      setLoading(true)
      const { data, error: fetchError } = await supabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setForms(data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching forms:', err)
      setError('Failed to load forms')
    } finally {
      setLoading(false)
    }
  }

  function setupSubscription() {
    const subscription = supabase
      .channel('forms-list')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'forms' },
        () => {
          fetchForms()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  async function deleteForm(formId: string) {
    if (!confirm('Are you sure you want to delete this form?')) return

    try {
      const { error: deleteError } = await supabase
        .from('forms')
        .delete()
        .eq('id', formId)

      if (deleteError) throw deleteError
      await fetchForms()
    } catch (err) {
      console.error('Error deleting form:', err)
      setError('Failed to delete form')
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-600 mt-1">Create and manage dynamic forms</p>
        </div>
        <Link
          href="/admin/forms/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
        >
          + Create Form
        </Link>
      </div>

      {/* Forms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            Loading forms...
          </div>
        ) : forms.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500">
            <p className="text-lg mb-2">No forms yet</p>
            <Link
              href="/admin/forms/new"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first form
            </Link>
          </div>
        ) : (
          forms.map((form) => (
            <div
              key={form.id}
              className="bg-white rounded-lg shadow p-6 border border-gray-200 hover:shadow-lg transition"
            >
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">{form.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {form.description}
                  </p>
                </div>

                <div className="flex items-center justify-between py-2 border-t border-gray-100">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-700">
                      {form.fields?.length || 0}
                    </p>
                    <p className="text-xs">fields</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-gray-700">
                      {form.submissions_count || 0}
                    </p>
                    <p className="text-xs">submissions</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Link
                    href={`/admin/forms/${form.id}/edit`}
                    className="flex-1 text-center px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded text-sm font-medium transition"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/admin/forms/${form.id}/submissions`}
                    className="flex-1 text-center px-3 py-2 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium transition"
                  >
                    Submissions
                  </Link>
                  <button
                    onClick={() => deleteForm(form.id)}
                    className="px-3 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

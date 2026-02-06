/**
 * Create Form Page
 *
 * Simple form builder for creating new forms
 */

'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface FormField {
  id: string
  name: string
  type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'checkbox'
  label: string
  required: boolean
  options?: string[]
}

export default function CreateFormPage() {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
  })

  const [fields, setFields] = useState<FormField[]>([
    {
      id: '1',
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
    },
  ])

  const [newFieldName, setNewFieldName] = useState('')
  const [newFieldType, setNewFieldType] = useState<FormField['type']>('text')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addField() {
    if (!newFieldName) return

    const newField: FormField = {
      id: Date.now().toString(),
      name: newFieldName.toLowerCase().replace(/\s+/g, '_'),
      type: newFieldType,
      label: newFieldName,
      required: false,
    }

    setFields([...fields, newField])
    setNewFieldName('')
    setNewFieldType('text')
  }

  function removeField(fieldId: string) {
    setFields(fields.filter((f) => f.id !== fieldId))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error: insertError } = await supabase
        .from('forms')
        .insert({
          name: formData.name,
          description: formData.description,
          fields: fields,
        })

      if (insertError) throw insertError
      router.push('/admin/forms')
    } catch (err) {
      console.error('Error creating form:', err)
      setError('Failed to create form')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Form</h1>
        <p className="text-gray-600 mt-1">Build a new form with custom fields</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Details */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Form Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Event Registration"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Form description and instructions"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="font-semibold text-gray-900">Form Fields</h3>

          {/* Fields List */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {fields.map((field) => (
              <div
                key={field.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <p className="font-medium text-gray-900">{field.label}</p>
                  <p className="text-xs text-gray-600">
                    {field.type} {field.required && '(required)'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeField(field.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Add Field Form */}
          <div className="border-t border-gray-200 pt-4 space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Add Field</h4>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
                placeholder="Field name"
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              />
              <select
                value={newFieldType}
                onChange={(e) => setNewFieldType(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="textarea">Textarea</option>
                <option value="select">Dropdown</option>
                <option value="checkbox">Checkbox</option>
              </select>
            </div>
            <button
              type="button"
              onClick={addField}
              className="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
            >
              + Add Field
            </button>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading || !formData.name || fields.length === 0}
            className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Form'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

/**
 * Settings Page
 *
 * Application settings and configuration
 * Features:
 * - General settings (app name, description, logo)
 * - Email settings
 * - Payment settings (Stripe)
 * - User management
 */

'use client'

import { FormEvent, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Settings {
  app_name: string
  app_description: string
  contact_email: string
  stripe_public_key: string
  smtp_server: string
  smtp_port: number
}

export default function SettingsPage() {
  const supabase = createClient()

  const [settings, setSettings] = useState<Settings>({
    app_name: 'Gingerco CMS',
    app_description: 'Content Management System for Gingerco Events',
    contact_email: 'admin@gingerandco.at',
    stripe_public_key: '',
    smtp_server: '',
    smtp_port: 587,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Save settings to database
      const { error: updateError } = await supabase
        .from('settings')
        .upsert({
          key: 'app_settings',
          value: settings,
        })

      if (updateError) throw updateError

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error('Error saving settings:', err)
      setError('Failed to save settings')
    } finally {
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

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">✓ Settings saved successfully</p>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Configure your application</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 border-b pb-3">General Settings</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Application Name
            </label>
            <input
              type="text"
              value={settings.app_name}
              onChange={(e) => setSettings({ ...settings, app_name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Gingerco CMS"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={settings.app_description}
              onChange={(e) =>
                setSettings({ ...settings, app_description: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="App description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@example.com"
            />
          </div>
        </div>

        {/* Payment Settings */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 border-b pb-3">Payment Settings</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stripe Public Key
            </label>
            <input
              type="password"
              value={settings.stripe_public_key}
              onChange={(e) =>
                setSettings({ ...settings, stripe_public_key: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="pk_live_..."
            />
            <p className="text-xs text-gray-600 mt-1">
              Get your key from{' '}
              <a
                href="https://stripe.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700"
              >
                Stripe Dashboard
              </a>
            </p>
          </div>
        </div>

        {/* Email Settings */}
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="font-semibold text-gray-900 border-b pb-3">Email Settings</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Server
            </label>
            <input
              type="text"
              value={settings.smtp_server}
              onChange={(e) => setSettings({ ...settings, smtp_server: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="smtp.gmail.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SMTP Port
            </label>
            <input
              type="number"
              value={settings.smtp_port}
              onChange={(e) => setSettings({ ...settings, smtp_port: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="587"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-800">
            <p className="font-medium mb-1">Using Resend for emails?</p>
            <p>Email settings are managed through Resend API. Leave empty to use Resend.</p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          <button
            type="reset"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Admin Users Section */}
      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <h3 className="font-semibold text-gray-900 border-b pb-3">Admin Users</h3>
        <p className="text-sm text-gray-600">
          Manage admin users and their permissions in Supabase Console →{' '}
          <a
            href="https://supabase.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Authentication
          </a>
        </p>
      </div>
    </div>
  )
}

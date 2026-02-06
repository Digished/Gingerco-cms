/**
 * Admin Layout
 *
 * Layout for admin pages with sidebar navigation
 * Includes:
 * - Left sidebar with navigation menu
 * - Top header with user menu
 * - Main content area
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Middleware will redirect to login
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-700">
          <Link href="/admin/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">
              G
            </div>
            {sidebarOpen && <span className="font-bold">Gingerco</span>}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {[
            { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
            { name: 'Events', href: '/admin/events', icon: '📅' },
            { name: 'Registrations', href: '/admin/registrations', icon: '👥' },
            { name: 'Forms', href: '/admin/forms', icon: '📝' },
            { name: 'Pages', href: '/admin/pages', icon: '📄' },
            { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
            { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 hover:bg-gray-800 flex items-center space-x-3 text-sm"
            >
              <span>{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>

        {/* Toggle */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white text-sm w-full text-left"
          >
            {sidebarOpen ? '«' : '»'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <button
              onClick={() => {
                // TODO: Implement logout via API
                window.location.href = '/api/auth/logout'
              }}
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

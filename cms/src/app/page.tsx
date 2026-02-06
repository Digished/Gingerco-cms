/**
 * Home Page
 *
 * Public landing page
 * Redirects authenticated users to /admin/dashboard
 */

'use client'

import Link from 'next/link'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/admin/dashboard')
    }
  }, [user, loading, router])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-screen flex flex-col items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Gingerco CMS</h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8">
            Content Management System for Gingerco Events
          </p>

          <div className="space-y-4">
            {user ? (
              <div>
                <p className="text-blue-100 mb-4">Welcome back, {user.email}!</p>
                <Link
                  href="/admin/dashboard"
                  className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <>
                <p className="text-blue-100 mb-4">
                  Manage your events, forms, and content from one place.
                </p>
                <Link
                  href="/login"
                  className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-blue-50 transition"
                >
                  Admin Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

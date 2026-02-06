/**
 * Logout API Route
 *
 * Handles user logout via POST request
 * Clears session and redirects to login page
 */

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Redirect to login page
    return NextResponse.redirect(new URL('/login', request.url))
  } catch (err) {
    console.error('Logout error:', err)
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    )
  }
}

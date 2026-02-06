/**
 * Authentication Utilities
 *
 * Handles Supabase authentication:
 * - User login/logout
 * - Session management
 * - User role checking
 * - Protected route helpers
 */

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * Get the current user session
 * Returns null if user is not authenticated
 */
export async function getSession() {
  const supabase = await createClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    console.error('Error getting session:', error)
    return null
  }
}

/**
 * Get the current user's profile
 * Fetches from users table (extended auth info)
 */
export async function getCurrentUser() {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    // Fetch extended user info from users table
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return {
      ...user,
      ...profile,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Get the current user's role
 * Returns 'admin', 'editor', 'viewer', or null
 */
export async function getUserRole() {
  const user = await getCurrentUser()
  return user?.role || null
}

/**
 * Check if current user has a specific role
 */
export async function hasRole(requiredRole: 'admin' | 'editor' | 'viewer') {
  const role = await getUserRole()
  if (requiredRole === 'admin') return role === 'admin'
  if (requiredRole === 'editor') return role === 'admin' || role === 'editor'
  return true // viewer can always access
}

/**
 * Require authentication
 * Redirects to login if user is not authenticated
 * Use at the top of server components
 */
export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  return session
}

/**
 * Require admin role
 * Redirects to login if user is not an admin
 */
export async function requireAdmin() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const role = await getUserRole()
  if (role !== 'admin') {
    redirect('/unauthorized')
  }

  return session
}

/**
 * Require editor or admin role
 */
export async function requireEditor() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const role = await getUserRole()
  if (role !== 'admin' && role !== 'editor') {
    redirect('/unauthorized')
  }

  return session
}

/**
 * Login user with email and password
 * Returns { success: boolean, error?: string }
 */
export async function loginUser(email: string, password: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to sign in',
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'An unexpected error occurred',
    }
  }
}

/**
 * Logout current user
 */
export async function logoutUser() {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: 'Failed to logout' }
  }
}

/**
 * Create a new user (admin only)
 */
export async function createUser(
  email: string,
  password: string,
  displayName: string,
  role: 'admin' | 'editor' | 'viewer' = 'viewer'
) {
  const supabase = await createClient()

  try {
    // Create auth user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert({
        id: data.user.id,
        email,
        display_name: displayName,
        role,
        active: true,
      })

    if (profileError) {
      console.error('Error creating user profile:', profileError)
      return { success: false, error: 'Failed to create user profile' }
    }

    return { success: true, userId: data.user.id }
  } catch (error) {
    console.error('Create user error:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(
  userId: string,
  role: 'admin' | 'editor' | 'viewer'
) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', userId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Update role error:', error)
    return { success: false, error: 'Failed to update user role' }
  }
}

/**
 * Reset password for a user
 */
export async function resetPassword(email: string) {
  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error('Reset password error:', error)
    return { success: false, error: 'Failed to send reset email' }
  }
}

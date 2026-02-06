/**
 * Next.js Middleware
 *
 * Protects routes based on authentication state
 * - Public routes: /login, /signup, /
 * - Protected routes: /admin/* requires authentication and admin role
 * - Redirects unauthenticated users to /login
 */

import { createServerClient, CookieOptions } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session if exists
  await supabase.auth.getSession()

  // Get current path
  const { pathname } = request.nextUrl

  // Public routes - allow access
  if (pathname === '/login' || pathname === '/signup' || pathname === '/') {
    return response
  }

  // Admin routes - require authentication
  if (pathname.startsWith('/admin')) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Optionally check user role from database
    // This is done in the component itself via server components
    // since middleware doesn't have easy access to data layer
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

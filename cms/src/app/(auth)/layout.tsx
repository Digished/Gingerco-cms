/**
 * Auth Layout
 *
 * Layout for authentication pages (login, signup, reset-password)
 * No sidebar or navigation - just full-page auth forms
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

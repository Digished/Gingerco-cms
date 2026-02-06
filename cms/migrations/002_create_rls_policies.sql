-- ============================================================================
-- GINGERCO CMS - PHASE 1 FOUNDATION
-- Row-Level Security (RLS) Policies
--
-- Purpose: Fine-grained access control at the database level
-- Benefits: Automatic enforcement, even from API, no application-level checks needed
-- Security: Public users can't access admin-only data
--
-- Policies defined for:
-- - USERS: Only admins can view/modify
-- - PAGES: Public reads published, admins modify all
-- - EVENTS: Public reads published, admins manage
-- - SESSIONS: Public reads, admins manage
-- - REGISTRATIONS: Public insert only, admins read/update
-- - FORMS: Admin only
-- - SUBMISSIONS: Public insert only, admins read
-- - ANALYTICS_EVENTS: Public insert, admins read
-- - AUDIT_LOGS: Admin only
-- - EMAIL_LOGS: Admin only
-- - SETTINGS: Admin only
-- - MEDIA: Public reads, admins manage
--
-- How it works: When a query reaches the database, it's automatically filtered
-- based on these policies. A public user cannot retrieve admin data even if
-- they try to modify the SQL query - it's enforced at the database level.
-- ============================================================================

-- ============================================================================
-- HELPER: User Role Check Function
-- ============================================================================
-- Purpose: Reusable function to check if current user has a specific role
-- Usage: In WHERE clauses of policies

CREATE OR REPLACE FUNCTION has_role(role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = role_name
    AND users.active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- HELPER: User is Admin Check
-- ============================================================================
-- Purpose: Check if current user is admin (shorthand)
-- Usage: In WHERE clauses where admin-only access is needed

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN has_role('admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- HELPER: User is Admin or Editor Check
-- ============================================================================
-- Purpose: Check if current user can edit (admin or editor role)
-- Usage: In WHERE clauses where editing permissions needed

CREATE OR REPLACE FUNCTION can_edit()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN auth.uid() IS NOT NULL AND EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'editor')
    AND users.active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Only admins can view user list
-- - Users can view their own profile
-- - Only admins can create/update/delete users

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy 1: Admin can read all users
CREATE POLICY "admin_read_users"
ON users FOR SELECT
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 2: Users can read their own profile
CREATE POLICY "users_read_own_profile"
ON users FOR SELECT
USING (id = auth.uid());

-- Policy 3: Only admins can create users
CREATE POLICY "admin_create_users"
ON users FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 4: Only admins can update users (including themselves)
CREATE POLICY "admin_update_users"
ON users FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 5: Only admins can delete users
CREATE POLICY "admin_delete_users"
ON users FOR DELETE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- ============================================================================
-- PAGES TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Public can read published, public pages
-- - Admins/editors can read all pages (for editing)
-- - Only admins can create/update/delete

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can read published, public pages
CREATE POLICY "public_read_published_pages"
ON pages FOR SELECT
USING (
  is_published = true
  AND visible_to_public = true
  AND requires_auth = false
);

-- Policy 2: Authenticated admins/editors can read all pages
CREATE POLICY "admin_editor_read_all_pages"
ON pages FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    has_role('admin') OR has_role('editor')
  )
);

-- Policy 3: Only admins can create pages
CREATE POLICY "admin_create_pages"
ON pages FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 4: Only admins/editors can update pages they created or admins can update any
CREATE POLICY "admin_editor_update_pages"
ON pages FOR UPDATE
USING (
  auth.uid() IS NOT NULL
  AND (
    has_role('admin') OR
    (has_role('editor') AND created_by = auth.uid())
  )
);

-- Policy 5: Only admins can delete pages
CREATE POLICY "admin_delete_pages"
ON pages FOR DELETE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- ============================================================================
-- EVENTS TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Public can read published events
-- - Admins can read/modify all events

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can read published events
CREATE POLICY "public_read_published_events"
ON events FOR SELECT
USING (status = 'published');

-- Policy 2: Admins can read all events (for editing)
CREATE POLICY "admin_read_all_events"
ON events FOR SELECT
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 3: Only admins can create events
CREATE POLICY "admin_create_events"
ON events FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 4: Only admins can update events
CREATE POLICY "admin_update_events"
ON events FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 5: Only admins can delete events
CREATE POLICY "admin_delete_events"
ON events FOR DELETE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- ============================================================================
-- SESSIONS TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Public can read all sessions (needed for booking)
-- - Admins can manage sessions

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can read all sessions
CREATE POLICY "public_read_sessions"
ON sessions FOR SELECT
USING (true);

-- Policy 2: Only admins can create sessions
CREATE POLICY "admin_create_sessions"
ON sessions FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 3: Only admins can update sessions
CREATE POLICY "admin_update_sessions"
ON sessions FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 4: Only admins can delete sessions
CREATE POLICY "admin_delete_sessions"
ON sessions FOR DELETE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- ============================================================================
-- REGISTRATIONS TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Public can INSERT (form submission)
-- - Only admins/editors can READ registrations
-- - Admins can UPDATE/DELETE registrations

ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can create registrations (form submission)
CREATE POLICY "public_create_registrations"
ON registrations FOR INSERT
WITH CHECK (true);

-- Policy 2: Only admins/editors can read registrations
CREATE POLICY "admin_editor_read_registrations"
ON registrations FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (has_role('admin') OR has_role('editor'))
);

-- Policy 3: Only admins can update registrations
CREATE POLICY "admin_update_registrations"
ON registrations FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 4: Only admins can delete registrations
CREATE POLICY "admin_delete_registrations"
ON registrations FOR DELETE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- ============================================================================
-- FORMS TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Admin only (create/read/update/delete)

ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

-- Policy 1: Only admins can read forms
CREATE POLICY "admin_read_forms"
ON forms FOR SELECT
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 2: Only admins can create forms
CREATE POLICY "admin_create_forms"
ON forms FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 3: Only admins can update forms
CREATE POLICY "admin_update_forms"
ON forms FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 4: Only admins can delete forms
CREATE POLICY "admin_delete_forms"
ON forms FOR DELETE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- ============================================================================
-- SUBMISSIONS TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Public can INSERT (form submission)
-- - Only admins/editors can READ
-- - Admins can UPDATE/DELETE

ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can create submissions (form submission)
CREATE POLICY "public_create_submissions"
ON submissions FOR INSERT
WITH CHECK (true);

-- Policy 2: Only admins/editors can read submissions
CREATE POLICY "admin_editor_read_submissions"
ON submissions FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (has_role('admin') OR has_role('editor'))
);

-- Policy 3: Only admins can update submissions
CREATE POLICY "admin_update_submissions"
ON submissions FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 4: Only admins can delete submissions
CREATE POLICY "admin_delete_submissions"
ON submissions FOR DELETE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- ============================================================================
-- ANALYTICS_EVENTS TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Public can INSERT (anonymous tracking)
-- - Only admins can READ

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can create analytics events
CREATE POLICY "public_create_analytics_events"
ON analytics_events FOR INSERT
WITH CHECK (true);

-- Policy 2: Only admins can read analytics events
CREATE POLICY "admin_read_analytics_events"
ON analytics_events FOR SELECT
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- ============================================================================
-- AUDIT_LOGS TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Admin only (read only, no modify)

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy 1: Only admins can read audit logs
CREATE POLICY "admin_read_audit_logs"
ON audit_logs FOR SELECT
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Note: No INSERT/UPDATE/DELETE policies - logs are created by triggers/functions only

-- ============================================================================
-- EMAIL_LOGS TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Admin only (read only)

ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Policy 1: Only admins can read email logs
CREATE POLICY "admin_read_email_logs"
ON email_logs FOR SELECT
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Note: No INSERT/UPDATE/DELETE policies - logs are created by functions only

-- ============================================================================
-- SETTINGS TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Admin only (read/update)
-- - No delete (only one row)

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Policy 1: Only admins can read settings
CREATE POLICY "admin_read_settings"
ON settings FOR SELECT
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 2: Only admins can update settings
CREATE POLICY "admin_update_settings"
ON settings FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Note: No INSERT/DELETE policies - settings are initialized once

-- ============================================================================
-- MEDIA TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Public can read media (if used in published pages)
-- - Admins can manage media

ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can read media (for display)
CREATE POLICY "public_read_media"
ON media FOR SELECT
USING (true);

-- Policy 2: Only admins can create media
CREATE POLICY "admin_create_media"
ON media FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 3: Only admins can update media
CREATE POLICY "admin_update_media"
ON media FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- Policy 4: Only admins can delete media
CREATE POLICY "admin_delete_media"
ON media FOR DELETE
USING (
  auth.uid() IS NOT NULL AND has_role('admin')
);

-- ============================================================================
-- SESSION_REGISTRATION_COUNTS TABLE POLICIES
-- ============================================================================
-- Access control:
-- - Public can read (for displaying availability)
-- - No direct INSERT/UPDATE/DELETE (managed by triggers)

ALTER TABLE session_registration_counts ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can read session counts
CREATE POLICY "public_read_session_counts"
ON session_registration_counts FOR SELECT
USING (true);

-- Note: No other policies - counts updated via triggers automatically

-- ============================================================================
-- Migration Complete: RLS Policies
-- ============================================================================
-- Summary:
-- ✓ Enabled RLS on all 13 tables
-- ✓ Created 3 helper functions for role checking
-- ✓ Defined 34+ policies for fine-grained access control
-- ✓ Public users can only view published content and submit forms
-- ✓ Admins/editors can manage content
-- ✓ All sensitive data protected at database level
--
-- Security Benefits:
-- - Impossible for authenticated user to read someone else's registration data
-- - Public users cannot access any admin tables
-- - Database enforces access control even if application is compromised
-- - Each table has specific policies matching its business rules
--
-- Next steps:
-- 1. Run migration/003_create_functions.sql for analytics functions
-- 2. Test policies by connecting as different roles
-- 3. Create first admin user via Supabase Auth
-- ============================================================================

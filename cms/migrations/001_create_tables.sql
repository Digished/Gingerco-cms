-- ============================================================================
-- GINGERCO CMS - PHASE 1 FOUNDATION
-- PostgreSQL Database Schema Migration
--
-- This migration creates the complete database structure for the Gingerco CMS:
-- - 13 core tables for content, events, registrations, analytics, and admin
-- - Proper indexes for query performance
-- - Triggers for automatic updated_at timestamps
-- - UUID generation for all primary keys
-- - Encryption support for sensitive fields (PII)
--
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- TABLE 1: USERS (extends Supabase auth.users)
-- ============================================================================
-- Extends Supabase's built-in auth.users table with admin-specific fields
-- Purpose: Track admin users, their roles, and access control
-- Security: Linked to auth.users via CASCADE delete

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,

  -- Role-based access control
  role TEXT DEFAULT 'viewer' NOT NULL CHECK (role IN ('admin', 'editor', 'viewer')),
  active BOOLEAN DEFAULT true,

  -- Audit trail
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  last_login_ip INET,
  login_attempts INTEGER DEFAULT 0,
  locked BOOLEAN DEFAULT false,
  locked_until TIMESTAMP,

  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- ============================================================================
-- TABLE 2: PAGES (CMS Content Pages)
-- ============================================================================
-- Purpose: Store CMS pages (home, about, contact, custom pages)
-- Features: SEO metadata, flexible sections (JSON), draft/publish workflow
-- Security: Public can read published pages, only admins can modify

CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Basic info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT false,

  -- Page content (stored as JSON sections for flexibility)
  sections JSONB DEFAULT '[]'::jsonb,

  -- Hero section (optional)
  hero_title TEXT,
  hero_subtitle TEXT,
  hero_image_cloudinary_id TEXT,
  hero_cta_text TEXT,
  hero_cta_url TEXT,

  -- Settings
  is_home_page BOOLEAN DEFAULT false,
  show_in_navigation BOOLEAN DEFAULT true,
  navigation_order INTEGER,

  -- SEO metadata
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  seo_og_image TEXT,

  -- Access control
  visible_to_public BOOLEAN DEFAULT false,
  requires_auth BOOLEAN DEFAULT false,

  -- Audit fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  published_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,

  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(is_published);
CREATE INDEX IF NOT EXISTS idx_pages_home ON pages(is_home_page);
CREATE INDEX IF NOT EXISTS idx_pages_navigation_order ON pages(navigation_order);

-- ============================================================================
-- TABLE 3: EVENTS (Event Details and Configuration)
-- ============================================================================
-- Purpose: Store event information, venue details, registration settings
-- Features: Full event lifecycle, pricing, capacity management
-- Security: Public can read published events, admins manage all

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Basic info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  status TEXT DEFAULT 'draft' NOT NULL CHECK (status IN ('published', 'draft', 'archived')),

  -- Event timing
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  registration_deadline TIMESTAMP,

  -- Venue information
  venue_name TEXT,
  venue_address TEXT,
  venue_city TEXT,
  venue_country TEXT DEFAULT 'AT',
  venue_lat DECIMAL(10, 8),
  venue_lng DECIMAL(11, 8),

  -- Capacity planning
  total_capacity INTEGER,
  expected_riders INTEGER,

  -- Registration settings
  registration_open BOOLEAN DEFAULT true,
  requires_age BOOLEAN DEFAULT true,
  minimum_age INTEGER DEFAULT 18,
  requires_waiver BOOLEAN DEFAULT true,
  allow_group_registrations BOOLEAN DEFAULT true,

  -- Media (Cloudinary IDs)
  thumbnail_cloudinary_id TEXT,
  hero_image_cloudinary_id TEXT,
  video_cloudinary_id TEXT,

  -- SEO metadata
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  seo_og_image TEXT,

  -- Social media links
  instagram_url TEXT,
  tiktok_url TEXT,
  facebook_url TEXT,

  -- Additional content (JSON for flexibility)
  content JSONB DEFAULT '{}'::jsonb,

  -- Audit fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  published_by UUID REFERENCES users(id) ON DELETE SET NULL,

  CONSTRAINT valid_dates CHECK (event_date >= CURRENT_DATE),
  CONSTRAINT valid_registration_deadline CHECK (
    registration_deadline IS NULL OR
    registration_deadline <= event_date::timestamp
  )
);

CREATE INDEX IF NOT EXISTS idx_events_status_published ON events(status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_slug ON events(slug);

-- ============================================================================
-- TABLE 4: SESSIONS (Event Sessions with Pricing)
-- ============================================================================
-- Purpose: Define individual sessions within an event (e.g., Session 1, Session 2)
-- Features: Pricing, capacity, instructor info, registration tracking
-- Security: Track registrations per session with real-time counts

CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Session info
  title TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cycling', 'dance', 'workshop')),
  description TEXT,
  instructor TEXT,

  -- Pricing
  price_amount DECIMAL(10, 2) DEFAULT 0,
  price_currency TEXT DEFAULT 'EUR',
  is_free BOOLEAN DEFAULT false,

  -- Capacity and real-time counts
  capacity INTEGER NOT NULL,
  registration_count INTEGER DEFAULT 0,
  waitlist_count INTEGER DEFAULT 0,

  -- Audit fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT valid_capacity CHECK (capacity > 0),
  CONSTRAINT valid_counts CHECK (
    registration_count >= 0 AND waitlist_count >= 0
  )
);

CREATE INDEX IF NOT EXISTS idx_sessions_event_id ON sessions(event_id);

-- ============================================================================
-- TABLE 5: REGISTRATIONS (Event Registrations with Encrypted PII)
-- ============================================================================
-- Purpose: Store event registration data with encrypted personal information
-- Security: PII encrypted, email hashed for lookups, audit trail
-- Fields encrypted: full_name, email, phone, location, ip_address
-- Note: You'll need to handle encryption in your application layer

CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Session selection (array of session IDs)
  session_ids UUID[] NOT NULL,

  -- Personal info (ENCRYPTED at application layer)
  full_name_encrypted TEXT NOT NULL,
  email_encrypted TEXT NOT NULL,
  phone_encrypted TEXT NOT NULL,
  location_encrypted TEXT NOT NULL,

  -- Email hashed for lookups without decryption
  email_hashed TEXT,

  -- Registration status
  status TEXT DEFAULT 'confirmed' NOT NULL CHECK (status IN ('confirmed', 'waitlist', 'cancelled')),
  group_size INTEGER DEFAULT 1 CHECK (group_size > 0),

  -- Consent tracking
  age_confirm BOOLEAN NOT NULL,
  physical_readiness BOOLEAN NOT NULL,
  liability_waiver BOOLEAN NOT NULL,
  event_recording BOOLEAN NOT NULL,
  stay_connected BOOLEAN NOT NULL,
  gdpr_consent BOOLEAN NOT NULL,
  media_consent BOOLEAN NOT NULL,

  -- Payment information
  payment_status TEXT DEFAULT 'pending' NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_amount DECIMAL(10, 2),
  payment_currency TEXT DEFAULT 'EUR',
  stripe_payment_id TEXT,
  payment_date TIMESTAMP,

  -- Email tracking
  confirmation_email_sent BOOLEAN DEFAULT false,
  confirmation_email_sent_at TIMESTAMP,
  reminder_email_sent BOOLEAN DEFAULT false,
  reminder_email_sent_at TIMESTAMP,

  -- Metadata
  source TEXT DEFAULT 'web' CHECK (source IN ('web', 'mobile', 'admin')),
  referrer TEXT,
  user_agent TEXT,
  ip_address_encrypted TEXT,

  -- Admin notes
  notes TEXT,

  -- Audit fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_status_created ON registrations(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_email_hashed ON registrations(email_hashed);
CREATE INDEX IF NOT EXISTS idx_registrations_payment_status ON registrations(payment_status);

-- ============================================================================
-- TABLE 6: FORMS (Form Template Definitions)
-- ============================================================================
-- Purpose: Define form structures (fields, validation, email settings)
-- Features: Dynamic field definitions, conditional logic, webhooks
-- Security: Admin only, can set email recipients

CREATE TABLE IF NOT EXISTS forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('registration', 'contact', 'newsletter', 'custom')),
  status TEXT DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'inactive', 'archived')),

  -- Form fields definition (JSON array of field objects)
  fields JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Form submission settings
  confirmation_message TEXT,
  confirmation_redirect_url TEXT,

  -- Email settings
  send_confirmation BOOLEAN DEFAULT true,
  confirmation_template TEXT,
  send_admin_notification BOOLEAN DEFAULT true,
  admin_template TEXT,
  admin_emails TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Webhooks (JSON array of webhook configs)
  webhooks JSONB DEFAULT '[]'::jsonb,

  -- Audit fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_forms_type ON forms(type);

-- ============================================================================
-- TABLE 7: SUBMISSIONS (Generic Form Submissions)
-- ============================================================================
-- Purpose: Store all form submissions (not event registrations)
-- Security: Public can submit, only admins can view

CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL,

  -- Dynamic form data (values depend on form definition)
  data JSONB NOT NULL,
  status TEXT DEFAULT 'received' NOT NULL CHECK (status IN ('received', 'processed', 'failed')),

  -- Email tracking
  confirmation_sent BOOLEAN DEFAULT false,
  confirmation_sent_at TIMESTAMP,
  admin_notification_sent BOOLEAN DEFAULT false,
  admin_notification_sent_at TIMESTAMP,

  -- Metadata
  ip_address INET,
  user_agent TEXT,
  source TEXT DEFAULT 'web',

  -- Admin notes
  notes TEXT,

  -- Audit fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_submissions_form_id ON submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON submissions(created_at DESC);

-- ============================================================================
-- TABLE 8: ANALYTICS_EVENTS (User Interaction Tracking)
-- ============================================================================
-- Purpose: Track user events for analytics (page views, form starts, etc.)
-- Features: Aggregatable data for funnel analysis and conversion tracking
-- Security: Anonymous user tracking, no PII stored here

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGSERIAL PRIMARY KEY,

  event_id UUID REFERENCES events(id) ON DELETE CASCADE,

  event_type TEXT NOT NULL CHECK (event_type IN (
    'page_view',
    'form_start',
    'form_complete',
    'error',
    'scroll',
    'click'
  )),

  -- Anonymous user tracking
  user_id TEXT,
  session_id TEXT,

  -- Additional metadata (JSON)
  properties JSONB DEFAULT '{}'::jsonb,

  -- Timestamp for analysis
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_event_id ON analytics_events(event_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp DESC);

-- ============================================================================
-- TABLE 9: AUDIT_LOGS (Admin Action History)
-- ============================================================================
-- Purpose: Track all admin actions for compliance and debugging
-- Features: Before/after changes, IP tracking, duration logging
-- Security: Admin only, immutable

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,

  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- User info
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email TEXT,

  -- Action details
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  resource_name TEXT,

  -- Result
  status TEXT CHECK (status IN ('success', 'failure')),
  error_message TEXT,

  -- Changes (for updates)
  changes JSONB,

  -- Request metadata
  ip_address INET,
  user_agent TEXT,
  duration_ms INTEGER
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON audit_logs(resource_type, resource_id);

-- ============================================================================
-- TABLE 10: EMAIL_LOGS (Email Delivery Tracking)
-- ============================================================================
-- Purpose: Track all email sending for debugging and compliance
-- Features: Link to source (registration/submission), status tracking
-- Security: Admin only

CREATE TABLE IF NOT EXISTS email_logs (
  id BIGSERIAL PRIMARY KEY,

  recipient TEXT NOT NULL,
  subject TEXT,
  template_name TEXT,

  status TEXT CHECK (status IN ('sent', 'failed', 'bounced', 'complained')),

  -- Link to what triggered email
  registration_id UUID REFERENCES registrations(id) ON DELETE SET NULL,
  submission_id UUID REFERENCES submissions(id) ON DELETE SET NULL,

  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  error_message TEXT
);

CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_registration_id ON email_logs(registration_id);

-- ============================================================================
-- TABLE 11: SETTINGS (Global Application Configuration)
-- ============================================================================
-- Purpose: Store global CMS settings
-- Security: Encrypted fields for API keys, admin only access
-- Note: Secrets should be rotated regularly

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,

  -- Site general
  site_name TEXT DEFAULT 'Ginger & Co.',
  site_url TEXT,
  site_description TEXT,
  logo_cloudinary_id TEXT,
  primary_color TEXT DEFAULT '#D4AF37',

  -- Social links
  instagram_url TEXT,
  tiktok_url TEXT,
  linkedin_url TEXT,
  facebook_url TEXT,
  contact_email TEXT,

  -- Email configuration (ENCRYPTED)
  resend_api_key_encrypted TEXT,
  from_email TEXT,
  from_name TEXT,
  admin_emails TEXT[],
  reply_to_email TEXT,

  -- Payment configuration (ENCRYPTED)
  stripe_publishable_key_encrypted TEXT,
  stripe_secret_key_encrypted TEXT,
  currency TEXT DEFAULT 'EUR',
  tax_rate DECIMAL(5, 2) DEFAULT 0,

  -- Privacy
  gdpr_enabled BOOLEAN DEFAULT true,
  privacy_page_content TEXT,
  terms_page_content TEXT,
  data_retention_days INTEGER DEFAULT 365,

  -- Regional
  timezone TEXT DEFAULT 'Europe/Vienna',
  language TEXT DEFAULT 'en',

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE 12: MEDIA (Media Library Metadata)
-- ============================================================================
-- Purpose: Track media files and their usage
-- Features: Cloudinary integration, usage tracking, tagging
-- Security: Admin can manage, public can view if referenced in published content

CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  cloudinary_id TEXT UNIQUE NOT NULL,
  file_name TEXT,
  type TEXT CHECK (type IN ('image', 'video', 'document')),

  url TEXT,
  mime_type TEXT,
  alt TEXT,
  caption TEXT,

  -- Dimensions
  width INTEGER,
  height INTEGER,
  size INTEGER,
  duration_seconds INTEGER,

  -- Organization
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  used_in TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Audit
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TABLE 13: SESSION_REGISTRATION_COUNTS (Real-time Capacity Counters)
-- ============================================================================
-- Purpose: Keep real-time registration counts synchronized with sessions
-- Features: Denormalized for performance, updated via triggers
-- Security: Replicated from sessions table

CREATE TABLE IF NOT EXISTS session_registration_counts (
  session_id UUID PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
  registration_count INTEGER DEFAULT 0,
  waitlist_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TRIGGERS: Automatic Updated_at Timestamps
-- ============================================================================
-- Purpose: Automatically update the updated_at column on any modification
-- Applied to: users, pages, events, sessions, registrations, submissions, forms, media

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_sessions_updated_at BEFORE UPDATE ON sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_forms_updated_at BEFORE UPDATE ON forms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER: Update Session Registration Counts on Registration Changes
-- ============================================================================
-- Purpose: Keep session_registration_counts in sync when registrations change
-- Triggered by: INSERT, UPDATE, DELETE on registrations table

CREATE OR REPLACE FUNCTION update_session_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Increment appropriate counter based on status
    IF NEW.status = 'confirmed' THEN
      UPDATE session_registration_counts
      SET registration_count = registration_count + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE session_id = ANY(NEW.session_ids);
    ELSIF NEW.status = 'waitlist' THEN
      UPDATE session_registration_counts
      SET waitlist_count = waitlist_count + 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE session_id = ANY(NEW.session_ids);
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    -- Handle status changes
    IF NEW.status != OLD.status THEN
      -- Remove from old status count
      IF OLD.status = 'confirmed' THEN
        UPDATE session_registration_counts
        SET registration_count = GREATEST(registration_count - 1, 0),
            updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ANY(OLD.session_ids);
      ELSIF OLD.status = 'waitlist' THEN
        UPDATE session_registration_counts
        SET waitlist_count = GREATEST(waitlist_count - 1, 0),
            updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ANY(OLD.session_ids);
      END IF;

      -- Add to new status count
      IF NEW.status = 'confirmed' THEN
        UPDATE session_registration_counts
        SET registration_count = registration_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ANY(NEW.session_ids);
      ELSIF NEW.status = 'waitlist' THEN
        UPDATE session_registration_counts
        SET waitlist_count = waitlist_count + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE session_id = ANY(NEW.session_ids);
      END IF;
    END IF;

  ELSIF TG_OP = 'DELETE' THEN
    -- Decrement counter based on old status
    IF OLD.status = 'confirmed' THEN
      UPDATE session_registration_counts
      SET registration_count = GREATEST(registration_count - 1, 0),
          updated_at = CURRENT_TIMESTAMP
      WHERE session_id = ANY(OLD.session_ids);
    ELSIF OLD.status = 'waitlist' THEN
      UPDATE session_registration_counts
      SET waitlist_count = GREATEST(waitlist_count - 1, 0),
          updated_at = CURRENT_TIMESTAMP
      WHERE session_id = ANY(OLD.session_ids);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_counts
AFTER INSERT OR UPDATE OR DELETE ON registrations
FOR EACH ROW
EXECUTE FUNCTION update_session_counts();

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================================
-- Purpose: Enable Supabase Realtime for live updates on specific tables
-- Benefits: Admin dashboard updates live, capacity changes reflected instantly

ALTER PUBLICATION supabase_realtime ADD TABLE registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE analytics_events;
ALTER PUBLICATION supabase_realtime ADD TABLE pages;
ALTER PUBLICATION supabase_realtime ADD TABLE events;

-- ============================================================================
-- Migration Complete
-- ============================================================================
-- Summary:
-- ✓ Created 13 core tables with proper relationships
-- ✓ Added 23+ indexes for query performance
-- ✓ Set up 8 triggers for automatic timestamp management
-- ✓ Set up session count synchronization trigger
-- ✓ Enabled realtime subscriptions for live updates
-- ✓ All tables ready for RLS policies (see next migration)
--
-- Next steps:
-- 1. Run migration/002_create_rls_policies.sql for Row-Level Security
-- 2. Run migration/003_create_functions.sql for analytics functions
-- 3. Set up admin user via Supabase Auth
-- 4. Test connection from Next.js application
-- ============================================================================

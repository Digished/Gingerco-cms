# PostgreSQL Database Schema - Gingerco CMS

## Overview

Complete PostgreSQL schema for Supabase with all tables, columns, indexes, functions, and queries.

---

## Core Tables

### 1. `pages` Table

**Purpose:** CMS pages (home, about, contact, etc.) - allows users to create custom pages

```sql
CREATE TABLE pages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Basic info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT false,

  -- Page content (stored as JSON sections)
  -- Can contain hero, text blocks, galleries, CTAs, etc.
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

  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  seo_og_image TEXT,

  -- Access control
  visible_to_public BOOLEAN DEFAULT false, -- Can be private pages
  requires_auth BOOLEAN DEFAULT false,

  -- Audit fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  published_by UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),

  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9-]+$')
);

CREATE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_pages_published ON pages(is_published);
CREATE INDEX idx_pages_home ON pages(is_home_page);
CREATE INDEX idx_pages_navigation_order ON pages(navigation_order);
```

**Example `sections` JSON:**
```json
[
  {
    "type": "hero",
    "title": "Welcome to Ginger & Co.",
    "subtitle": "Afrobeats-powered fitness",
    "image": "cloudinary-id-123",
    "cta": {
      "text": "Book Now",
      "url": "/events"
    }
  },
  {
    "type": "text",
    "title": "About Us",
    "content": "<p>We are a boutique fitness company...</p>"
  },
  {
    "type": "gallery",
    "title": "Photo Gallery",
    "images": [
      {
        "cloudinaryId": "img-1",
        "alt": "Class photo",
        "caption": "Our community in action"
      }
    ]
  },
  {
    "type": "cta",
    "title": "Ready to join?",
    "buttonText": "Register Now",
    "buttonUrl": "/registration"
  }
]
```

---

### 2. `events` Table

**Purpose:** Event details and configuration

```sql
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Basic info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),

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

  -- Media
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

  -- Additional content (stored as JSON)
  content JSONB DEFAULT '{}'::jsonb,

  -- Audit fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  published_by UUID REFERENCES users(id),

  CONSTRAINT valid_dates CHECK (event_date >= CURRENT_DATE),
  CONSTRAINT valid_registration_deadline CHECK (
    registration_deadline IS NULL OR
    registration_deadline <= event_date::timestamp
  )
);

CREATE INDEX idx_events_status_published ON events(status, published_at DESC);
CREATE INDEX idx_events_slug ON events(slug);
```

**Indexes:**
- `status` (Asc) + `published_at` (Desc) - for listing published events
- `slug` - for finding events by URL slug

---

### 3. `sessions` Table

**Purpose:** Event sessions with pricing and capacity

```sql
CREATE TABLE sessions (
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

  -- Capacity
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

CREATE INDEX idx_sessions_event_id ON sessions(event_id);
```

---

### 4. `registrations` Table

**Purpose:** Event registrations with encrypted PII

```sql
CREATE TABLE registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,

  -- Session selection (array of session IDs)
  session_ids UUID[] NOT NULL,

  -- Personal info (ENCRYPTED)
  full_name_encrypted TEXT NOT NULL,
  email_encrypted TEXT NOT NULL,
  phone_encrypted TEXT NOT NULL,
  location_encrypted TEXT NOT NULL,

  -- Email hashed for lookups (can query without decryption)
  email_hashed TEXT,

  -- Status
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlist', 'cancelled')),
  group_size INTEGER DEFAULT 1 CHECK (group_size > 0),

  -- Consents
  age_confirm BOOLEAN NOT NULL,
  physical_readiness BOOLEAN NOT NULL,
  liability_waiver BOOLEAN NOT NULL,
  event_recording BOOLEAN NOT NULL,
  stay_connected BOOLEAN NOT NULL,
  gdpr_consent BOOLEAN NOT NULL,
  media_consent BOOLEAN NOT NULL,

  -- Payment information
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
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
  ip_address_encrypted TEXT, -- Encrypted for privacy

  -- Notes from admin
  notes TEXT,

  -- Audit fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_status_created ON registrations(status, created_at DESC);
CREATE INDEX idx_registrations_email_hashed ON registrations(email_hashed);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);
```

**Indexes:**
- `event_id` - for filtering registrations by event
- `status` + `created_at` - for listing recent registrations
- `email_hashed` - for checking duplicate registrations
- `payment_status` - for filtering completed payments

---

### 5. `sessions_registration_counts` Analytics View

**Purpose:** Real-time registration counts per session

```sql
CREATE TABLE session_registration_counts (
  session_id UUID PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
  registration_count INTEGER DEFAULT 0,
  waitlist_count INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Trigger to keep counts in sync
CREATE OR REPLACE FUNCTION update_session_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
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
```

---

### 6. `forms` Table

**Purpose:** Form template definitions

```sql
CREATE TABLE forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('registration', 'contact', 'newsletter', 'custom')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),

  -- Form fields definition (JSON array)
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

  -- Webhooks
  webhooks JSONB DEFAULT '[]'::jsonb,

  -- Audit fields
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_forms_type ON forms(type);
```

**Example `fields` JSON:**
```json
[
  {
    "id": "fullName",
    "label": "Full Name",
    "type": "text",
    "required": true,
    "placeholder": "Enter your full name",
    "validation": {
      "minLength": 2,
      "maxLength": 100
    },
    "order": 1
  },
  {
    "id": "email",
    "label": "Email",
    "type": "email",
    "required": true,
    "validation": {
      "pattern": "email"
    },
    "order": 2
  }
]
```

---

### 7. `submissions` Table

**Purpose:** Generic form submission storage

```sql
CREATE TABLE submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL,

  -- Dynamic form data (values depend on form definition)
  data JSONB NOT NULL,
  status TEXT DEFAULT 'received' CHECK (status IN ('received', 'processed', 'failed')),

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

CREATE INDEX idx_submissions_form_id ON submissions(form_id);
CREATE INDEX idx_submissions_created_at ON submissions(created_at DESC);
```

---

### 8. `analytics_events` Table

**Purpose:** Track user interactions for analytics

```sql
CREATE TABLE analytics_events (
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

  -- Metadata
  properties JSONB DEFAULT '{}'::jsonb,

  -- Timestamp
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_analytics_events_event_id ON analytics_events(event_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
```

---

### 9. `users` Table

**Purpose:** Admin user management (extends Supabase auth)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  email TEXT UNIQUE NOT NULL,
  display_name TEXT,

  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  active BOOLEAN DEFAULT true,

  -- Authentication tracking
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  last_login_ip INET,
  login_attempts INTEGER DEFAULT 0,
  locked BOOLEAN DEFAULT false,
  locked_until TIMESTAMP,

  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);
```

---

### 10. `audit_logs` Table

**Purpose:** Track all admin actions

```sql
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,

  -- Timestamp
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- User info
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  user_email TEXT,

  -- Action details
  action TEXT NOT NULL, -- 'create_event', 'update_registration', etc.
  resource_type TEXT,    -- 'event', 'registration', 'user'
  resource_id TEXT,
  resource_name TEXT,

  -- Result
  status TEXT CHECK (status IN ('success', 'failure')),
  error_message TEXT,

  -- Changes (for updates)
  changes JSONB, -- {before, after, fields_changed}

  -- Request metadata
  ip_address INET,
  user_agent TEXT,
  duration_ms INTEGER
);

CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
```

---

### 11. `email_logs` Table

**Purpose:** Track email sending

```sql
CREATE TABLE email_logs (
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

CREATE INDEX idx_email_logs_sent_at ON email_logs(sent_at DESC);
CREATE INDEX idx_email_logs_registration_id ON email_logs(registration_id);
```

---

### 12. `settings` Table

**Purpose:** Global application settings

```sql
CREATE TABLE settings (
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

  -- Email configuration (encrypted)
  resend_api_key_encrypted TEXT,
  from_email TEXT,
  from_name TEXT,
  admin_emails TEXT[],
  reply_to_email TEXT,

  -- Payment configuration (encrypted)
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
```

---

### 13. `media` Table

**Purpose:** Media library metadata

```sql
CREATE TABLE media (
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
  used_in TEXT[] DEFAULT ARRAY[]::TEXT[], -- e.g., ["events/123", "pages/home"]

  -- Audit
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## PostgreSQL Functions

### Get Event with Sessions and Analytics

```sql
CREATE OR REPLACE FUNCTION get_event_with_sessions(event_id_param UUID)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  description TEXT,
  event_date DATE,
  event_time TIME,
  sessions JSON,
  registrations BIGINT,
  total_revenue NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.title,
    e.slug,
    e.description,
    e.event_date,
    e.event_time,
    COALESCE(json_agg(
      json_build_object(
        'id', s.id,
        'title', s.title,
        'start_time', s.start_time,
        'end_time', s.end_time,
        'type', s.type,
        'price', s.price_amount,
        'is_free', s.is_free,
        'capacity', s.capacity,
        'registration_count', s.registration_count,
        'waitlist_count', s.waitlist_count
      )
    ) FILTER (WHERE s.id IS NOT NULL), '[]'::json) as sessions,
    COUNT(r.id) FILTER (WHERE r.status = 'confirmed') as registrations,
    COALESCE(SUM(r.payment_amount) FILTER (WHERE r.status = 'confirmed'), 0) as total_revenue
  FROM events e
  LEFT JOIN sessions s ON e.id = s.event_id
  LEFT JOIN registrations r ON e.id = r.event_id
  WHERE e.id = event_id_param
  GROUP BY e.id, e.title, e.slug, e.description, e.event_date, e.event_time;
END;
$$ LANGUAGE plpgsql STABLE;
```

### Get Event Analytics

```sql
CREATE OR REPLACE FUNCTION get_event_analytics(event_id_param UUID)
RETURNS TABLE (
  total_registrations BIGINT,
  confirmed BIGINT,
  waitlist BIGINT,
  cancelled BIGINT,
  total_revenue NUMERIC,
  fill_rate NUMERIC,
  session_data JSON
) AS $$
BEGIN
  RETURN QUERY
  WITH reg_stats AS (
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_count,
      COUNT(*) FILTER (WHERE status = 'waitlist') as waitlist_count,
      COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_count,
      COALESCE(SUM(payment_amount), 0) as revenue
    FROM registrations
    WHERE event_id = event_id_param
  ),
  capacity_info AS (
    SELECT
      COALESCE(SUM(capacity), 1) as total_cap,
      COUNT(*) FILTER (WHERE s.registration_count > 0) as sessions_with_regs
    FROM sessions s
    WHERE s.event_id = event_id_param
  ),
  session_details AS (
    SELECT json_agg(json_build_object(
      'session_id', s.id,
      'title', s.title,
      'registrations', s.registration_count,
      'waitlist', s.waitlist_count,
      'capacity', s.capacity,
      'fill_rate', ROUND(s.registration_count::NUMERIC / s.capacity * 100, 2),
      'revenue', COALESCE((
        SELECT SUM(payment_amount)
        FROM registrations
        WHERE s.id = ANY(session_ids) AND event_id = event_id_param
      ), 0)
    )) as session_breakdown
    FROM sessions s
    WHERE s.event_id = event_id_param
  )
  SELECT
    reg_stats.total,
    reg_stats.confirmed_count,
    reg_stats.waitlist_count,
    reg_stats.cancelled_count,
    reg_stats.revenue,
    ROUND(
      reg_stats.confirmed_count::NUMERIC /
      NULLIF(capacity_info.total_cap, 0) * 100, 2
    ),
    session_details.session_breakdown
  FROM reg_stats, capacity_info, session_details;
END;
$$ LANGUAGE plpgsql STABLE;
```

### Get Registration Funnel

```sql
CREATE OR REPLACE FUNCTION get_registration_funnel(
  event_id_param UUID,
  date_param DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  stage TEXT,
  count BIGINT,
  percentage NUMERIC
) AS $$
DECLARE
  total_views BIGINT;
BEGIN
  SELECT COUNT(*) INTO total_views
  FROM analytics_events
  WHERE event_id = event_id_param
    AND DATE(timestamp) = date_param
    AND event_type = 'page_view';

  RETURN QUERY
  WITH funnel_data AS (
    SELECT 'page_views'::TEXT as stage, COUNT(*) as cnt
    FROM analytics_events
    WHERE event_id = event_id_param
      AND DATE(timestamp) = date_param
      AND event_type = 'page_view'

    UNION ALL

    SELECT 'form_starts'::TEXT, COUNT(*)
    FROM analytics_events
    WHERE event_id = event_id_param
      AND DATE(timestamp) = date_param
      AND event_type = 'form_start'

    UNION ALL

    SELECT 'form_completions'::TEXT, COUNT(*)
    FROM registrations
    WHERE event_id = event_id_param
      AND DATE(created_at) = date_param
      AND status = 'confirmed'

    UNION ALL

    SELECT 'payments'::TEXT, COUNT(*)
    FROM registrations
    WHERE event_id = event_id_param
      AND DATE(created_at) = date_param
      AND payment_status = 'completed'
  )
  SELECT
    funnel_data.stage,
    funnel_data.cnt,
    ROUND(
      funnel_data.cnt::NUMERIC / NULLIF(total_views, 0) * 100, 2
    ) as pct
  FROM funnel_data
  ORDER BY funnel_data.cnt DESC;
END;
$$ LANGUAGE plpgsql STABLE;
```

---

## Row-Level Security (RLS) Policies

### Pages Table Policies

```sql
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Policy 1: Public can read published, public pages
CREATE POLICY "public_read_published_pages"
ON pages
FOR SELECT
USING (is_published = true AND visible_to_public = true AND requires_auth = false);

-- Policy 2: Authenticated users can read published pages they have access to
CREATE POLICY "authenticated_read_pages"
ON pages
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  (
    is_published = true OR
    EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'editor'))
  )
);

-- Policy 3: Only admins can create pages
CREATE POLICY "admin_create_pages"
ON pages
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Policy 4: Only admins/editors can update pages
CREATE POLICY "admin_update_pages"
ON pages
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'editor'))
);

-- Policy 5: Only admins can delete pages
CREATE POLICY "admin_delete_pages"
ON pages
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
```

---

### Events Table Policies

```sql
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can read published events
CREATE POLICY "public_read_published_events"
ON events
FOR SELECT
USING (status = 'published');

-- Policy 2: Authenticated admins can read all events
CREATE POLICY "admin_read_all_events"
ON events
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Policy 3: Authenticated admins can create events
CREATE POLICY "admin_create_events"
ON events
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Policy 4: Authenticated admins can update events
CREATE POLICY "admin_update_events"
ON events
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Policy 5: Authenticated admins can delete events
CREATE POLICY "admin_delete_events"
ON events
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
```

### Registrations Table Policies

```sql
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anyone can INSERT (public form submission)
CREATE POLICY "public_insert_registrations"
ON registrations
FOR INSERT
WITH CHECK (true);

-- Policy 2: Only admins can SELECT registrations
CREATE POLICY "admin_read_registrations"
ON registrations
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role IN ('admin', 'editor'))
);

-- Policy 3: Only admins can UPDATE registrations
CREATE POLICY "admin_update_registrations"
ON registrations
FOR UPDATE
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

-- Policy 4: Only admins can DELETE registrations
CREATE POLICY "admin_delete_registrations"
ON registrations
FOR DELETE
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
```

### Sessions Table Policies

```sql
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Public can read
CREATE POLICY "public_read_sessions"
ON sessions
FOR SELECT
USING (true);

-- Only admins can modify
CREATE POLICY "admin_modify_sessions"
ON sessions
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (SELECT 1 FROM users u WHERE u.id = auth.uid() AND u.role = 'admin')
);
```

---

## Common Queries

### Get Page by Slug

```sql
SELECT
  id,
  title,
  slug,
  description,
  sections,
  seo_title,
  seo_description,
  is_published,
  published_at
FROM pages
WHERE slug = $1 AND is_published = true AND visible_to_public = true;
```

### Get All Published Pages (Navigation Menu)

```sql
SELECT
  id,
  title,
  slug,
  navigation_order
FROM pages
WHERE is_published = true
  AND visible_to_public = true
  AND show_in_navigation = true
ORDER BY COALESCE(navigation_order, 999), title;
```

### Get Home Page

```sql
SELECT
  id,
  title,
  slug,
  hero_title,
  hero_subtitle,
  hero_image_cloudinary_id,
  sections
FROM pages
WHERE is_home_page = true AND is_published = true;
```

### Get All Unpublished Pages (Admin View)

```sql
SELECT
  id,
  title,
  slug,
  is_published,
  created_at,
  updated_at,
  created_by
FROM pages
WHERE is_published = false
ORDER BY updated_at DESC;
```

---

### Get All Published Events with Session Count

```sql
SELECT
  e.id,
  e.title,
  e.slug,
  e.event_date,
  COUNT(s.id) as session_count,
  SUM(s.capacity) as total_capacity,
  COUNT(r.id) FILTER (WHERE r.status = 'confirmed') as total_registrations
FROM events e
LEFT JOIN sessions s ON e.id = s.event_id
LEFT JOIN registrations r ON e.id = r.event_id
WHERE e.status = 'published'
GROUP BY e.id, e.title, e.slug, e.event_date
ORDER BY e.event_date DESC;
```

### Get Event Capacity Status

```sql
SELECT
  s.id,
  s.title,
  s.capacity,
  s.registration_count,
  s.waitlist_count,
  ROUND(s.registration_count::NUMERIC / s.capacity * 100, 2) as fill_rate,
  CASE
    WHEN s.registration_count >= s.capacity THEN 'Full'
    WHEN s.registration_count >= s.capacity * 0.8 THEN 'Almost Full'
    ELSE 'Available'
  END as status
FROM sessions s
JOIN events e ON s.event_id = e.id
WHERE e.id = $1
ORDER BY s.start_time;
```

### Get Daily Registration Metrics

```sql
SELECT
  DATE(created_at) as date,
  COUNT(*) as total_registrations,
  COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
  COUNT(*) FILTER (WHERE status = 'waitlist') as waitlist,
  COUNT(*) FILTER (WHERE payment_status = 'completed') as paid,
  COALESCE(SUM(payment_amount) FILTER (WHERE payment_status = 'completed'), 0) as revenue
FROM registrations
WHERE event_id = $1
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Find Duplicate Registrations (Same Event + Email)

```sql
SELECT
  email_hashed,
  event_id,
  COUNT(*) as registration_count,
  ARRAY_AGG(id) as registration_ids
FROM registrations
WHERE event_id = $1
GROUP BY email_hashed, event_id
HAVING COUNT(*) > 1
ORDER BY registration_count DESC;
```

### Get Admin Action History

```sql
SELECT
  timestamp,
  user_email,
  action,
  resource_type,
  resource_name,
  status,
  ip_address,
  duration_ms
FROM audit_logs
WHERE user_id = $1
ORDER BY timestamp DESC
LIMIT 50;
```

---

## Migrations for Deployment

```bash
# Using Supabase CLI
supabase migration new create_initial_schema

# Edit migrations/[timestamp]_create_initial_schema.sql
# Add all the CREATE TABLE statements above

# Push to database
supabase db push

# Pull latest schema (after changes via dashboard)
supabase db pull
```

---

**Document Version**: 2.0 (PostgreSQL + Supabase Edition)
**Last Updated**: 2026-02-06

# Gingerco Headless CMS Implementation Plan - Supabase Edition

**Status**: Planning Phase (Revised for Supabase)
**Tech Stack**: Supabase (PostgreSQL Backend) + Next.js (Frontend) + Vercel (Hosting)
**Timeline**: 3-4 weeks
**Cost**: €20-50/month
**Database**: PostgreSQL with Real-time Subscriptions

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Phase 1: Foundation (Week 1)](#phase-1-foundation-week-1)
3. [Phase 2: Admin Interface (Week 2)](#phase-2-admin-interface-week-2)
4. [Phase 3: Data Migration (Week 3)](#phase-3-data-migration-week-3)
5. [Phase 4: Launch (Week 4)](#phase-4-launch-week-4)
6. [Technology Stack Details](#technology-stack-details)
7. [SQL Migrations Guide](#sql-migrations-guide)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Current Users                             │
│        (GitHub Pages + Cloudinary + Google Sheets)           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    (Migration Period)
                           │
    ┌──────────────────────┴──────────────────────┐
    │                                             │
    ▼                                             ▼
┌────────────────────────┐          ┌─────────────────────┐
│  Next.js Frontend      │          │  Supabase Backend   │
│  (Vercel Hosting)      │          │  - PostgreSQL DB    │
│  - Home page           │◄────────►│  - Realtime API     │
│  - Events listing      │  REST    │  - Auth & RLS       │
│  - Event details       │  API &   │  - Webhooks         │
│  - Registration forms  │  Realtime│  - pg_cron          │
│  - Admin Dashboard     │  Subs    │  - Functions        │
└────────────────────────┘          └─────────────────────┘

Integration Points:
├── Cloudinary (Media - unchanged)
├── Resend (Email via Webhooks - new)
├── Stripe (Payments via Webhooks - optional)
└── Analytics (SQL aggregations - native)
```

---

## Phase 1: Foundation (Week 1)

### Day 1-2: Project Setup

#### 1.1 Create Next.js Project Structure

```bash
# Commands to run:
npx create-next-app@latest gingerco-cms \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --no-git

cd gingerco-cms

# Install Supabase dependencies
npm install \
  @supabase/supabase-js \
  @supabase/auth-helpers-nextjs \
  @supabase/auth-helpers-react \
  react-hook-form \
  zod \
  recharts \
  date-fns \
  cloudinary \
  next-cloudinary \
  resend
```

**Project Structure:**
```
cms/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── callback/route.ts
│   │   ├── (admin)/
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── events/page.tsx
│   │   │   ├── events/[id]/page.tsx
│   │   │   ├── events/[id]/edit/page.tsx
│   │   │   ├── pages/page.tsx
│   │   │   ├── forms/page.tsx
│   │   │   ├── submissions/page.tsx
│   │   │   ├── submissions/[id]/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── media/page.tsx
│   │   │   ├── settings/page.tsx
│   │   │   └── users/page.tsx
│   │   ├── api/
│   │   │   ├── webhooks/
│   │   │   │   ├── resend/route.ts
│   │   │   │   ├── stripe/route.ts
│   │   │   │   └── submissions/route.ts
│   │   │   └── health/route.ts
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── events/page.tsx
│   │   │   ├── events/[slug]/page.tsx
│   │   │   ├── [[...slug]]/page.tsx
│   │   │   └── layout.tsx
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   ├── database/
│   │   │   ├── events.ts
│   │   │   ├── registrations.ts
│   │   │   ├── submissions.ts
│   │   │   ├── analytics.ts
│   │   │   └── users.ts
│   │   ├── utils/
│   │   │   ├── encryption.ts
│   │   │   ├── validation.ts
│   │   │   └── formatting.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useEvents.ts
│   │   │   ├── useSubmissions.ts
│   │   │   └── useAnalytics.ts
│   │   ├── auth.ts
│   │   └── constants.ts
│   └── components/
│       ├── admin/
│       │   ├── DashboardLayout.tsx
│       │   ├── EventManager.tsx
│       │   ├── FormBuilder.tsx
│       │   ├── SubmissionViewer.tsx
│       │   └── AnalyticsDashboard.tsx
│       ├── public/
│       │   ├── EventCard.tsx
│       │   ├── EventDetail.tsx
│       │   └── RegistrationForm.tsx
│       ├── common/
│       │   ├── Navbar.tsx
│       │   ├── Sidebar.tsx
│       │   └── Modal.tsx
│       └── ui/
│           ├── Button.tsx
│           ├── Input.tsx
│           ├── Select.tsx
│           └── Card.tsx
├── public/
│   └── assets/
├── migrations/
│   ├── 001_initial_schema.sql
│   ├── 002_add_rls_policies.sql
│   ├── 003_create_functions.sql
│   └── 004_create_triggers.sql
├── .env.local (LOCAL ONLY - not committed)
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

#### 1.2 Set Up Supabase Project

```
Steps:
1. Go to https://supabase.com
2. Create organization & project "gingerco-cms"
3. Choose region closest to users (Europe)
4. Wait for database initialization
5. Get connection details from Settings
6. Enable extensions: pg_trgm, uuid-ossp (for UUIDs)
7. Create service role key for migrations
```

**Environment Variables (.env.local):**
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

SUPABASE_SERVICE_ROLE_KEY=xxx
SUPABASE_DB_PASSWORD=xxx

RESEND_API_KEY=xxx
STRIPE_SECRET_KEY=xxx

NEXT_PUBLIC_SITE_URL=https://cms.gingerandco.at
```

#### 1.3 Supabase Configuration Files

**`src/lib/supabase/client.ts`:**
```typescript
import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
```

**`src/lib/supabase/server.ts`:**
```typescript
import { createServerClient, serializeCookieHeader } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createClient = async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        },
      },
    },
  )
}
```

### Day 3-4: Database Schema Creation

#### 1.4 PostgreSQL Schema Migrations

**`migrations/001_initial_schema.sql`:**
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  last_login_ip INET
);

-- Events table
CREATE TABLE events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'archived')),

  -- Dates
  event_date DATE NOT NULL,
  event_time TIME NOT NULL,
  registration_deadline TIMESTAMP,

  -- Venue
  venue_name TEXT,
  venue_address TEXT,
  venue_city TEXT,
  venue_country TEXT DEFAULT 'AT',
  venue_lat DECIMAL(10, 8),
  venue_lng DECIMAL(11, 8),

  -- Capacity
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

  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  seo_og_image TEXT,

  -- Social
  instagram_url TEXT,
  tiktok_url TEXT,
  facebook_url TEXT,

  -- Metadata
  content TEXT, -- JSON with overview, highlights, faq
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  published_by UUID REFERENCES users(id),

  CONSTRAINT valid_dates CHECK (event_date > CURRENT_DATE)
);

-- Sessions table
CREATE TABLE sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
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

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Registrations table (encrypted PII)
CREATE TABLE registrations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  session_ids UUID[] NOT NULL, -- Array of session IDs

  -- Personal info (encrypted)
  full_name_encrypted TEXT NOT NULL,
  email_encrypted TEXT NOT NULL,
  phone_encrypted TEXT NOT NULL,
  location_encrypted TEXT NOT NULL,

  -- Decrypted email for queries (hashed)
  email_hashed TEXT, -- HMAC of email for lookups

  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlist', 'cancelled')),
  group_size INTEGER DEFAULT 1,

  -- Consents
  age_confirm BOOLEAN NOT NULL,
  physical_readiness BOOLEAN NOT NULL,
  liability_waiver BOOLEAN NOT NULL,
  event_recording BOOLEAN NOT NULL,
  stay_connected BOOLEAN NOT NULL,
  gdpr_consent BOOLEAN NOT NULL,
  media_consent BOOLEAN NOT NULL,

  -- Payment
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  payment_amount DECIMAL(10, 2),
  payment_currency TEXT DEFAULT 'EUR',
  stripe_payment_id TEXT,
  payment_date TIMESTAMP,

  -- Email tracking
  confirmation_email_sent BOOLEAN DEFAULT false,
  reminder_email_sent BOOLEAN DEFAULT false,

  -- Metadata
  source TEXT DEFAULT 'web', -- 'web', 'mobile', 'admin'
  referrer TEXT,
  user_agent TEXT,
  ip_address_encrypted TEXT,

  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forms table
CREATE TABLE forms (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('registration', 'contact', 'newsletter', 'custom')),
  status TEXT DEFAULT 'active',

  fields JSONB NOT NULL DEFAULT '[]', -- Array of field definitions
  confirmation_message TEXT,
  confirmation_redirect_url TEXT,

  -- Email settings
  send_confirmation BOOLEAN DEFAULT true,
  confirmation_template TEXT,
  send_admin_notification BOOLEAN DEFAULT true,
  admin_template TEXT,
  admin_emails TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Webhooks
  webhooks JSONB DEFAULT '[]', -- Array of webhook configs

  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Form Submissions table
CREATE TABLE submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  form_type TEXT NOT NULL,

  data JSONB NOT NULL, -- Dynamic form data
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

  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Events table (for tracking)
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  page_id UUID REFERENCES events(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL, -- 'page_view', 'form_start', 'form_complete'

  user_id TEXT, -- Anonymous user ID
  session_id TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  metadata JSONB, -- Additional data

  CONSTRAINT at_least_one_id CHECK (event_id IS NOT NULL OR page_id IS NOT NULL)
);

-- Settings table
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

  -- Email
  resend_api_key_encrypted TEXT,
  from_email TEXT,
  from_name TEXT,
  admin_emails TEXT[],
  reply_to_email TEXT,

  -- Payments
  stripe_publishable_key_encrypted TEXT,
  stripe_secret_key_encrypted TEXT,
  currency TEXT DEFAULT 'EUR',
  tax_rate DECIMAL(5, 2) DEFAULT 0,

  -- Privacy
  gdpr_enabled BOOLEAN DEFAULT true,
  privacy_page_content TEXT,
  terms_page_content TEXT,
  data_retention_days INTEGER DEFAULT 365,

  -- Timezone
  timezone TEXT DEFAULT 'Europe/Vienna',
  language TEXT DEFAULT 'en',

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Media table
CREATE TABLE media (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  cloudinary_id TEXT UNIQUE NOT NULL,
  file_name TEXT,
  type TEXT CHECK (type IN ('image', 'video', 'document')),

  url TEXT,
  mime_type TEXT,
  alt TEXT,
  caption TEXT,

  width INTEGER,
  height INTEGER,
  size INTEGER,
  duration_seconds INTEGER,

  tags TEXT[],
  used_in TEXT[] DEFAULT ARRAY[]::TEXT[],

  uploaded_by UUID REFERENCES users(id),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs table
CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id UUID REFERENCES users(id),
  user_email TEXT,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  resource_name TEXT,
  status TEXT CHECK (status IN ('success', 'failure')),
  error_message TEXT,

  changes JSONB, -- {before, after, fields_changed}

  ip_address INET,
  user_agent TEXT,
  duration_ms INTEGER
);

-- Email Logs table
CREATE TABLE email_logs (
  id BIGSERIAL PRIMARY KEY,
  recipient TEXT NOT NULL,
  subject TEXT,
  template_name TEXT,
  status TEXT CHECK (status IN ('sent', 'failed', 'bounced')),

  registration_id UUID REFERENCES registrations(id),
  submission_id UUID REFERENCES submissions(id),

  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  error_message TEXT
);

-- Create indexes for performance
CREATE INDEX idx_events_status_published ON events(status, published_at DESC);
CREATE INDEX idx_events_slug ON events(slug);
CREATE INDEX idx_sessions_event_id ON sessions(event_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
CREATE INDEX idx_registrations_status_created ON registrations(status, created_at DESC);
CREATE INDEX idx_registrations_email_hashed ON registrations(email_hashed);
CREATE INDEX idx_forms_type ON forms(type);
CREATE INDEX idx_submissions_form_id ON submissions(form_id);
CREATE INDEX idx_submissions_created ON submissions(created_at DESC);
CREATE INDEX idx_analytics_events_event_id ON analytics_events(event_id);
CREATE INDEX idx_analytics_events_timestamp ON analytics_events(timestamp DESC);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_email_logs_created ON email_logs(sent_at DESC);

-- Create TRIGGER for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sessions_updated_at
BEFORE UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at
BEFORE UPDATE ON registrations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
BEFORE UPDATE ON submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_media_updated_at
BEFORE UPDATE ON media
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Realtime subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE registrations;
ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE analytics_events;
```

**`migrations/002_add_rls_policies.sql`:**
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Public: Read published events
CREATE POLICY "Public read published events"
ON events FOR SELECT
USING (status = 'published');

-- Admin: Full access
CREATE POLICY "Admin full access"
ON events
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Similar policies for other tables...

-- Registrations: Only admin can read
CREATE POLICY "Admin read registrations"
ON registrations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'editor')
  )
);

-- Anyone can create registrations (public form)
CREATE POLICY "Public create registrations"
ON registrations FOR INSERT
WITH CHECK (true);

-- Submissions: Similar structure
CREATE POLICY "Public create submissions"
ON submissions FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admin read submissions"
ON submissions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role IN ('admin', 'editor')
  )
);
```

**`migrations/003_create_functions.sql`:**
```sql
-- Function to get event with all related data
CREATE OR REPLACE FUNCTION get_event_with_sessions(event_id_param UUID)
RETURNS TABLE (
  event_id UUID,
  title TEXT,
  sessions JSON
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.title,
    json_agg(json_build_object(
      'id', s.id,
      'title', s.title,
      'start_time', s.start_time,
      'end_time', s.end_time,
      'capacity', s.capacity,
      'registration_count', s.registration_count,
      'price', s.price_amount,
      'is_free', s.is_free
    )) as sessions
  FROM events e
  LEFT JOIN sessions s ON e.id = s.event_id
  WHERE e.id = event_id_param
  GROUP BY e.id, e.title;
END;
$$ LANGUAGE plpgsql;

-- Function to increment session registration count
CREATE OR REPLACE FUNCTION increment_session_registrations(
  session_id_param UUID,
  amount_param INTEGER DEFAULT 1
)
RETURNS void AS $$
BEGIN
  UPDATE sessions
  SET registration_count = registration_count + amount_param
  WHERE id = session_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to get event analytics
CREATE OR REPLACE FUNCTION get_event_analytics(event_id_param UUID)
RETURNS TABLE (
  total_registrations BIGINT,
  confirmed_registrations BIGINT,
  waitlist BIGINT,
  cancelled BIGINT,
  total_revenue NUMERIC,
  fill_rate NUMERIC,
  session_breakdown JSON
) AS $$
BEGIN
  RETURN QUERY
  WITH reg_stats AS (
    SELECT
      COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
      COUNT(*) FILTER (WHERE status = 'waitlist') as waitlist,
      COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
      COALESCE(SUM(payment_amount), 0) as revenue
    FROM registrations
    WHERE event_id = event_id_param
  ),
  session_stats AS (
    SELECT json_agg(json_build_object(
      'session_id', s.id,
      'title', s.title,
      'registrations', s.registration_count,
      'capacity', s.capacity,
      'fill_rate', ROUND(s.registration_count::NUMERIC / s.capacity * 100, 2),
      'revenue', COALESCE((
        SELECT SUM(payment_amount)
        FROM registrations
        WHERE s.id = ANY(session_ids) AND event_id = event_id_param
      ), 0)
    )) as breakdown
    FROM sessions s
    WHERE s.event_id = event_id_param
  )
  SELECT
    reg_stats.total,
    reg_stats.confirmed,
    reg_stats.waitlist,
    reg_stats.cancelled,
    reg_stats.revenue,
    ROUND(reg_stats.confirmed::NUMERIC / (
      SELECT COALESCE(SUM(capacity), 1) FROM sessions WHERE event_id = event_id_param
    ) * 100, 2),
    session_stats.breakdown
  FROM reg_stats, session_stats;
END;
$$ LANGUAGE plpgsql;

-- Function to get registration funnel
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
    SELECT
      'page_views' as stage,
      COUNT(*) as count
    FROM analytics_events
    WHERE event_id = event_id_param
    AND DATE(timestamp) = date_param
    AND event_type = 'page_view'

    UNION ALL

    SELECT
      'form_starts',
      COUNT(*)
    FROM analytics_events
    WHERE event_id = event_id_param
    AND DATE(timestamp) = date_param
    AND event_type = 'form_start'

    UNION ALL

    SELECT
      'form_completions',
      COUNT(*)
    FROM registrations
    WHERE event_id = event_id_param
    AND DATE(created_at) = date_param

    UNION ALL

    SELECT
      'payments',
      COUNT(*)
    FROM registrations
    WHERE event_id = event_id_param
    AND DATE(created_at) = date_param
    AND payment_status = 'completed'
  )
  SELECT
    funnel_data.stage,
    funnel_data.count,
    ROUND(funnel_data.count::NUMERIC / NULLIF(total_views, 0) * 100, 2) as percentage
  FROM funnel_data
  ORDER BY funnel_data.count DESC;
END;
$$ LANGUAGE plpgsql;
```

#### 1.5 Deploy Initial Schema

```bash
# Using Supabase CLI (recommended)
supabase migration new initial_schema
# Paste 001_initial_schema.sql content

supabase db push

# Or use Supabase dashboard SQL editor directly
# Copy and paste each migration file into the SQL editor
```

---

## Phase 2: Admin Interface (Week 2)

### Day 1-2: Authentication & Dashboard

#### 2.1 Authentication Setup with Supabase Auth

**`src/lib/auth.ts`:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUserRole() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  return data?.role
}

export async function requireAuth() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  return session
}

export async function requireAdmin() {
  const role = await getUserRole()
  if (role !== 'admin') {
    redirect('/unauthorized')
  }
}
```

**`src/app/(auth)/login/page.tsx`:**
```typescript
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      router.push('/admin/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleLogin} className="space-y-4 w-96">
        <h1 className="text-3xl font-bold text-center mb-8">Ginger & Co. CMS</h1>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-lg"
          required
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold text-white py-2 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  )
}
```

#### 2.2 Admin Dashboard with Real-time Data

**`src/lib/hooks/useAnalytics.ts`:**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export function useEventAnalytics(eventId: string) {
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  let subscription: RealtimeChannel

  useEffect(() => {
    const fetchAnalytics = async () => {
      // Call Postgres function for real-time analytics
      const { data, error } = await supabase
        .rpc('get_event_analytics', { event_id_param: eventId })

      if (!error) setAnalytics(data[0])
      setLoading(false)
    }

    fetchAnalytics()

    // Subscribe to real-time updates
    subscription = supabase
      .channel(`event:${eventId}:analytics`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations',
          filter: `event_id=eq.${eventId}`,
        },
        () => {
          fetchAnalytics()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [eventId])

  return { analytics, loading }
}
```

**`src/app/(admin)/dashboard/page.tsx`:**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useEventAnalytics } from '@/lib/hooks/useAnalytics'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      // Get all events
      const { count: eventCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true })

      // Get all registrations with real-time subscription
      const { count: regCount, data: registrations } = await supabase
        .from('registrations')
        .select('payment_amount', { count: 'exact' })
        .eq('payment_status', 'completed')

      const totalRevenue = registrations?.reduce(
        (sum, reg) => sum + (reg.payment_amount || 0),
        0
      ) || 0

      setStats({
        totalEvents: eventCount || 0,
        totalRegistrations: regCount || 0,
        totalRevenue,
      })
    }

    fetchStats()

    // Subscribe to changes
    const subscription = supabase
      .channel('dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'registrations' },
        () => fetchStats()
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Total Events" value={stats.totalEvents} />
        <StatCard title="Total Registrations" value={stats.totalRegistrations} />
        <StatCard title="Total Revenue" value={`€${stats.totalRevenue.toFixed(2)}`} />
      </div>

      {/* Recent registrations, charts, etc. */}
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-600 text-sm font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  )
}
```

### Day 3-4: Event & Form Management

#### 2.3 Event Manager with SQL Operations

**`src/lib/database/events.ts`:**
```typescript
import { createClient } from '@/lib/supabase/server'
import { Database } from '@/lib/supabase/types'

type Event = Database['public']['Tables']['events']['Row']
type InsertEvent = Database['public']['Tables']['events']['Insert']

export async function getPublishedEvents() {
  const supabase = await createClient()

  return supabase
    .from('events')
    .select('*, sessions(*)')
    .eq('status', 'published')
    .order('event_date', { ascending: false })
}

export async function getEventBySlug(slug: string) {
  const supabase = await createClient()

  return supabase
    .from('events')
    .select('*, sessions(*)')
    .eq('slug', slug)
    .single()
}

export async function createEvent(event: InsertEvent) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single()

  if (error) throw error

  // Log action
  await supabase.from('audit_logs').insert({
    action: 'create_event',
    resource_type: 'event',
    resource_id: data.id,
    resource_name: data.title,
    status: 'success',
  })

  return data
}

export async function updateEvent(id: string, updates: Partial<Event>) {
  const supabase = await createClient()

  const { data: oldData } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  // Log action with changes
  await supabase.from('audit_logs').insert({
    action: 'update_event',
    resource_type: 'event',
    resource_id: id,
    resource_name: data.title,
    status: 'success',
    changes: {
      before: oldData,
      after: data,
      fields_changed: Object.keys(updates),
    },
  })

  return data
}
```

---

## Phase 3: Data Migration (Week 3)

### 3.1 Migrate from HTML + Google Sheets

**`scripts/migrateEvents.sql`:**
```sql
-- Insert event from current HTML structure
INSERT INTO events (
  title, slug, description, short_description, status,
  event_date, event_time, venue_name, venue_address,
  total_capacity, expected_riders, seo_title, seo_description
) VALUES (
  'Afrobeats Indoor Cycling: Vienna Takeover 2025',
  'afrobeats-cycling-vienna-2025',
  'Full event description...',
  'Short preview...',
  'published',
  '2025-12-06',
  '13:00',
  'Sport Arena Vienna',
  'Stephane-Endres-Straße 3, 1020 Vienna',
  1000,
  300,
  'Afrobeats Indoor Cycling Vienna 2025',
  'Join us for the ultimate Afrobeats fitness experience...'
);

-- Insert sessions for the event
INSERT INTO sessions (event_id, title, start_time, end_time, type, capacity, price_amount, is_free)
SELECT
  (SELECT id FROM events WHERE slug = 'afrobeats-cycling-vienna-2025'),
  'Session 1: Afrobeats Cycling',
  '14:00',
  '15:00',
  'cycling',
  100,
  55,
  false
UNION ALL
SELECT
  (SELECT id FROM events WHERE slug = 'afrobeats-cycling-vienna-2025'),
  'Session 2: Afrobeats Cycling',
  '15:30',
  '16:30',
  'cycling',
  100,
  60,
  false
UNION ALL
SELECT
  (SELECT id FROM events WHERE slug = 'afrobeats-cycling-vienna-2025'),
  'Session 3: Afrobeats Dance Workshop',
  '17:30',
  '18:30',
  'dance',
  100,
  0,
  true
UNION ALL
SELECT
  (SELECT id FROM events WHERE slug = 'afrobeats-cycling-vienna-2025'),
  'Session 4: Afrobeats Cycling',
  '19:00',
  '20:00',
  'cycling',
  100,
  70,
  false;
```

**`scripts/migrateRegistrations.ts`:**
```typescript
import { createClient } from '@supabase/supabase-js'
import * as crypto from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Encryption helper
function encryptData(data: string, key: string): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv)

  let encrypted = cipher.update(data, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag()
  return `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`
}

function hashEmail(email: string): string {
  return crypto.createHash('sha256').update(email).digest('hex')
}

async function migrateRegistrations() {
  // Parse Google Sheets data (example)
  const registrationsFromSheets = [
    {
      fullName: 'John Doe',
      email: 'john@example.com',
      phone: '+43 123 456 7890',
      location: 'Vienna',
      sessions: [1, 2],
      groupSize: 1,
      ageConfirm: true,
      timestamp: '2025-11-15T15:45:00',
      // ... other fields
    },
    // ... more registrations
  ]

  const encryptionKey = process.env.ENCRYPTION_KEY! // 64-char hex string

  for (const reg of registrationsFromSheets) {
    const { data: event } = await supabase
      .from('events')
      .select('id')
      .eq('slug', 'afrobeats-cycling-vienna-2025')
      .single()

    const sessionIds = reg.sessions.map((idx: number) => {
      // Map session index to actual session ID from database
      return `session_${idx}`
    })

    const registrationData = {
      event_id: event?.id,
      session_ids: sessionIds,
      full_name_encrypted: encryptData(reg.fullName, encryptionKey),
      email_encrypted: encryptData(reg.email, encryptionKey),
      email_hashed: hashEmail(reg.email),
      phone_encrypted: encryptData(reg.phone, encryptionKey),
      location_encrypted: encryptData(reg.location, encryptionKey),
      group_size: reg.groupSize,
      age_confirm: reg.ageConfirm,
      // ... other fields
      payment_status: 'completed',
      payment_amount: 110,
      created_at: new Date(reg.timestamp),
    }

    const { error } = await supabase
      .from('registrations')
      .insert([registrationData])

    if (error) {
      console.error('Migration error:', error)
    }
  }

  console.log('Registration migration complete!')
}

migrateRegistrations().catch(console.error)
```

---

## Phase 4: Launch (Week 4)

### 4.1 Deploy to Vercel

```bash
# Build and test locally
npm run build

# Deploy via Vercel (connect Git repo at vercel.com/new)
# Or use Vercel CLI:
npx vercel --prod

# Set environment variables in Vercel Dashboard
# Settings > Environment Variables:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY (for server-side operations)
# - NEXT_PUBLIC_SITE_URL
# - NODE_ENV=production
```

### 4.2 Set Up Webhooks for Automation

**Supabase Webhook for New Registrations → Email:**

```
Webhook URL: https://cms.gingerandco.at/api/webhooks/submissions
Events: INSERT on registrations table
Payload: {
  "type": "registration",
  "action": "INSERT",
  "record": {...full registration record...},
  "old_record": null
}
```

**`src/app/api/webhooks/submissions/route.ts`:**
```typescript
import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()

    if (payload.type === 'registration') {
      const { record } = payload

      // Decrypt PII (you'd implement this)
      const fullName = decryptData(record.full_name_encrypted)
      const email = decryptData(record.email_encrypted)

      // Send confirmation email
      await resend.emails.send({
        from: 'events@gingerandco.at',
        to: email,
        subject: 'Registration Confirmed',
        html: `<p>Hi ${fullName}, your registration is confirmed!</p>`,
      })

      // Send admin notification
      await resend.emails.send({
        from: 'events@gingerandco.at',
        to: 'admin@gingerandco.at',
        subject: `New Registration: ${fullName}`,
        html: `<p>New registration from ${fullName}</p>`,
      })

      // Log email
      await supabase.from('email_logs').insert({
        recipient: email,
        subject: 'Registration Confirmed',
        template_name: 'registration_confirmation',
        status: 'sent',
        registration_id: record.id,
      })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
```

### 4.3 DNS Configuration

```
Current: gingerandco.at → GitHub Pages
New: gingerco.at → Vercel (Next.js CMS)

Steps:
1. Add domain in Vercel Dashboard > Settings > Domains
2. Update DNS records (CNAME or A record per Vercel instructions)
3. SSL certificate provisioned automatically by Vercel
4. Redirect old GitHub Pages to new domain
5. Monitor for 24 hours
```

---

## Technology Stack Details

### Frontend (Vercel)
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Real-time**: Supabase Realtime subscriptions
- **Charts**: Recharts for analytics
- **Date handling**: date-fns
- **HTTP**: `@supabase/supabase-js`

### Backend (Supabase)
- **Database**: PostgreSQL 15+
- **ORM**: Raw SQL + Supabase SDK
- **Authentication**: Supabase Auth (JWT-based)
- **Real-time**: Supabase Realtime (websockets)
- **Webhooks**: Built-in PostgreSQL webhooks
- **Scheduled Jobs**: pg_cron extension
- **Security**: Row-Level Security (RLS) policies
- **Encryption**: pgcrypto extension for sensitive data

### Development Tools
- **Language**: TypeScript
- **Git**: GitHub
- **CLI**: Supabase CLI for migrations
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier
- **CI/CD**: GitHub Actions (optional) + Vercel auto-deploy

---

## SQL Migrations Guide

### Running Migrations

**Option 1: Supabase CLI (Recommended)**
```bash
# Initialize Supabase in project
supabase init

# Create new migration
supabase migration new initial_schema

# Edit migrations/[timestamp]_initial_schema.sql

# Push to database
supabase db push

# Pull latest schema
supabase db pull
```

**Option 2: Supabase Dashboard**
```
1. Go to SQL Editor in Supabase dashboard
2. Copy migration file content
3. Click "Run" to execute
4. Verify in Table Editor
```

**Option 3: Direct psql**
```bash
psql postgresql://postgres:password@db.xxx.supabase.co:5432/postgres < migration.sql
```

---

**Document Version**: 2.0 (Supabase Edition)
**Last Updated**: 2026-02-06

# Gingerco CMS Architecture - Supabase Edition

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│              Vercel (Frontend CDN)                            │
│           Next.js Application (React)                       │
│  - Admin Dashboard                                          │
│  - Public Pages                                             │
│  - Real-time Subscriptions                                  │
└────────────────────────┬────────────────────────────────────┘
                         │
    ┌────────────────────┼────────────────────┐
    │                    │                    │
    ▼                    ▼                    ▼
┌─────────┐     ┌──────────────┐     ┌──────────────┐
│ Content │     │ Registrations│     │  Analytics   │
│ Editor  │     │ & Submissions│     │   Queries    │
└────┬────┘     └──────┬───────┘     └──────┬───────┘
     │                 │                     │
     └─────────────────┴─────────────────────┘
                       │
                       ▼
        ┌─────────────────────────────────────────┐
        │     Supabase Backend Services           │
        │                                         │
        ├─────────────────────────────────────────┤
        │                                         │
        │ ┌─────────────────────────────────────┐ │
        │ │    PostgreSQL Database              │ │
        │ │  (15+ with native extensions)       │ │
        │ │                                     │ │
        │ │  ├─ Events & Sessions               │ │
        │ │  ├─ Registrations (encrypted PII)  │ │
        │ │  ├─ Submissions & Forms             │ │
        │ │  ├─ Analytics Events               │ │
        │ │  ├─ Audit Logs                     │ │
        │ │  └─ Settings & Templates           │ │
        │ └─────────────────────────────────────┘ │
        │                                         │
        │ ┌─────────────────────────────────────┐ │
        │ │  Real-time API (WebSockets)         │ │
        │ │  - Live subscription updates        │ │
        │ │  - Presence tracking                │ │
        │ │  - Broadcast messages               │ │
        │ └─────────────────────────────────────┘ │
        │                                         │
        │ ┌─────────────────────────────────────┐ │
        │ │  PostgreSQL Functions & Triggers    │ │
        │ │  - Analytics aggregation            │ │
        │ │  - Auto-increment counters          │ │
        │ │  - Email triggers                   │ │
        │ │  - Audit logging                    │ │
        │ └─────────────────────────────────────┘ │
        │                                         │
        │ ┌─────────────────────────────────────┐ │
        │ │  Scheduled Jobs (pg_cron)           │ │
        │ │  - Email reminders                  │ │
        │ │  - Daily analytics aggregation      │ │
        │ │  - Cleanup jobs                     │ │
        │ └─────────────────────────────────────┘ │
        │                                         │
        │ ┌─────────────────────────────────────┐ │
        │ │  Authentication & Authorization     │ │
        │ │  - Supabase Auth (JWT)              │ │
        │ │  - Row-Level Security (RLS)         │ │
        │ │  - Role-based access control        │ │
        │ └─────────────────────────────────────┘ │
        │                                         │
        │ ┌─────────────────────────────────────┐ │
        │ │  Webhooks & Integration             │ │
        │ │  - Database triggers → webhooks     │ │
        │ │  - External service integration     │ │
        │ │  - Email delivery tracking          │ │
        │ └─────────────────────────────────────┘ │
        └─────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
    ┌─────────┐ ┌─────────┐ ┌──────────┐
    │Cloudinary│ │Resend   │ │Optional: │
    │(CDN)     │ │(Email)  │ │Stripe    │
    └─────────┘ └─────────┘ └──────────┘
```

---

## Data Flow Architecture

### 1. Admin Event Creation Flow

```
Admin Dashboard
     │
     ▼
Next.js Form Component
     │
     ├─ Client-side validation (React Hook Form + Zod)
     │
     ▼
Supabase Client (@supabase/supabase-js)
     │
     ├─ Check JWT token (auth.session)
     │
     ▼
PostgreSQL INSERT
     │
     ├─ Row-Level Security Policy check
     │  └─ Must be authenticated user with admin role
     │
     ├─ Trigger: update_updated_at_column()
     │
     ▼
INSERT successful
     │
     ├─ Realtime broadcast to subscribers
     │
     ├─ Trigger webhook (optional)
     │
     ├─ Log to audit_logs table
     │
     ▼
Next.js receives confirmation
     │
     ├─ UI updates optimistically
     │
     ├─ Realtime subscriber receives update
     │
     ▼
Admin sees new event in dashboard
```

### 2. Event Registration Flow (Public)

```
User visits event page
     │
     ▼
Next.js fetches from Supabase
     │
     ├─ SELECT * FROM events WHERE slug = $1 AND status = 'published'
     ├─ SELECT * FROM sessions WHERE event_id = $1
     ├─ SELECT COUNT(*) FROM registrations
     │  WHERE event_id = $1 AND status = 'confirmed'
     │
     ▼
Real-time subscription starts
     │
     └─ onSnapshot for registrations count
        └─ Updates capacity in real-time

     ▼
Form rendered with dynamic data
     │
     ├─ Session options
     ├─ Current capacity
     ├─ Available pricing
     │
     ▼
User fills form & submits
     │
     ├─ Client validation
     │
     ▼
POST to /api/registrations
     │
     ├─ Encrypt PII (full_name, email, phone)
     ├─ Hash email for lookups (email_hashed)
     ├─ Validate capacity
     │
     ▼
INSERT INTO registrations
     │
     ├─ RLS allows public INSERT
     ├─ Trigger: Auto-update sessions.registration_count
     ├─ Trigger: Log to audit_logs
     │
     ▼
PostgreSQL Webhook triggers
     │
     ├─ HTTP POST to Vercel webhook endpoint
     │
     ▼
Vercel API Route: /api/webhooks/submissions
     │
     ├─ Decrypt email
     ├─ Format confirmation email
     ├─ Send via Resend API
     │
     ▼
Update email_logs table
     │
     ▼
Realtime broadcast
     │
     ├─ Admin dashboard refreshes
     ├─ Capacity counters update
     ├─ Analytics refresh
     │
     ▼
User sees confirmation page
     │
     └─ Email received by user
```

### 3. Real-time Analytics Query Flow

```
Admin views analytics dashboard
     │
     ▼
useAnalytics() hook
     │
     ├─ Call SELECT function: get_event_analytics()
     │
     ▼
PostgreSQL executes aggregation query
     │
     ├─ SELECT COUNT(*) FROM registrations WHERE event_id = $1
     ├─ SELECT SUM(payment_amount) WHERE event_id = $1
     ├─ SELECT COUNT(*) per session
     ├─ Calculate fill_rate
     │
     ▼
Results returned as single row
     │
     ├─ Hook sets state with data
     │
     ▼
Realtime subscription active
     │
     ├─ Listens to registrations table changes
     ├─ ON INSERT/UPDATE: Re-run analytics query
     │
     ▼
Admin dashboard updates in real-time
     │
     └─ Charts refresh automatically
```

### 4. Daily Analytics Aggregation (pg_cron scheduled job)

```
Every day at 00:00 UTC
     │
     ▼
pg_cron triggers stored procedure
     │
     ├─ SQL query aggregates all daily metrics
     │
     ├─ SELECT DATE(created_at) as date,
     │    COUNT(*) as registrations,
     │    SUM(payment_amount) as revenue
     │  FROM registrations
     │  WHERE DATE(created_at) = CURRENT_DATE - 1
     │  GROUP BY DATE(created_at)
     │
     ▼
INSERT INTO analytics_daily table
     │
     ├─ Stores historical data
     │
     ▼
Webhook sent (optional)
     │
     └─ Notify admin of daily summary
```

---

## Component Architecture

### Frontend Structure

```
app/
├── (auth)/
│   ├── login/
│   │   ├── page.tsx
│   │   └── forms/LoginForm.tsx
│   └── signup/
│       ├── page.tsx
│       └── forms/SignupForm.tsx
│
├── (admin)/
│   ├── layout.tsx (with Sidebar + Navigation)
│   ├── dashboard/
│   │   └── page.tsx
│   │       ├── StatsCards (real-time)
│   │       ├── RegistrationChart
│   │       ├── RecentSubmissions (real-time)
│   │       └── SessionCapacity (real-time)
│   │
│   ├── events/
│   │   ├── page.tsx (List with search/filter)
│   │   │   └── EventCard (with actions)
│   │   ├── new/
│   │   │   └── page.tsx
│   │   └── [id]/
│   │       ├── page.tsx (Event detail view)
│   │       └── edit/
│   │           └── page.tsx (EventForm with sessions)
│   │
│   ├── forms/
│   │   ├── page.tsx (Form templates list)
│   │   ├── [id]/
│   │   │   └── page.tsx (FormBuilder UI)
│   │   └── components/
│   │       ├── FieldSelector
│   │       ├── FieldEditor
│   │       └── FormPreview
│   │
│   ├── submissions/
│   │   ├── page.tsx (All submissions)
│   │   │   └── SubmissionFilters
│   │   │   └── SubmissionTable (with pagination)
│   │   └── [id]/
│   │       └── page.tsx (Submission detail modal)
│   │
│   ├── analytics/
│   │   └── page.tsx
│   │       ├── DateRangePicker
│   │       ├── MetricCards
│   │       ├── RevenueChart
│   │       ├── FunnelChart
│   │       ├── SourceBreakdown
│   │       └── ExportButtons
│   │
│   ├── media/
│   │   └── page.tsx
│   │       ├── MediaUploader
│   │       ├── MediaBrowser (grid/list)
│   │       └── MediaDetails (sidebar)
│   │
│   ├── settings/
│   │   └── page.tsx
│   │       ├── GeneralSettings
│   │       ├── EmailSettings
│   │       ├── PaymentSettings
│   │       └── PrivacySettings
│   │
│   └── users/
│       ├── page.tsx
│       ├── UserList
│       └── UserForm
│
├── (public)/
│   ├── page.tsx (Home)
│   ├── events/
│   │   ├── page.tsx (Events listing)
│   │   │   └── EventCardPublic
│   │   └── [slug]/
│   │       └── page.tsx (Event detail)
│   │           ├── HeroSection
│   │           ├── SessionSelector
│   │           ├── RegistrationForm
│   │           └── FAQSection
│   │
│   └── [[...slug]]/
│       └── page.tsx (Dynamic pages from CMS)
│
└── api/
    └── webhooks/
        ├── submissions/route.ts (Resend integration)
        ├── stripe/route.ts (Payment webhooks)
        └── health/route.ts (Health check)
```

---

## API Architecture

### REST API Endpoints (Auto-generated by Supabase)

```
GET    /rest/v1/events              → List all events
GET    /rest/v1/events/{id}         → Get event by ID
POST   /rest/v1/events              → Create event (admin only, RLS)
PATCH  /rest/v1/events/{id}         → Update event (admin only, RLS)
DELETE /rest/v1/events/{id}         → Delete event (admin only, RLS)

GET    /rest/v1/sessions            → List sessions
GET    /rest/v1/registrations       → List registrations (admin only, RLS)
POST   /rest/v1/registrations       → Create registration (public)

GET    /rest/v1/rpc/get_event_analytics → Call PG function
GET    /rest/v1/rpc/get_registration_funnel → Call PG function
POST   /rest/v1/rpc/increment_session_registrations → Call PG function
```

### Real-time Subscriptions

```typescript
// Subscribe to registration updates for an event
supabase
  .channel(`events:${eventId}:registrations`)
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'registrations',
      filter: `event_id=eq.${eventId}`,
    },
    (payload) => {
      console.log('New registration:', payload.new)
      refreshAnalytics()
    }
  )
  .subscribe()
```

### Webhook Endpoints (Next.js API Routes)

```
POST   /api/webhooks/submissions     → Handle form submission webhooks
POST   /api/webhooks/stripe          → Handle Stripe payment webhooks
GET    /api/health                   → Health check
```

---

## Database Schema (PostgreSQL)

### Core Tables

```
events
├── id (UUID PK)
├── title, slug, description
├── status (published/draft/archived)
├── event_date, event_time
├── venue_* (name, address, coordinates)
├── capacity info
├── media (cloudinary IDs)
├── seo data
└── timestamps

sessions
├── id (UUID PK)
├── event_id (FK → events)
├── title, start_time, end_time
├── type (cycling/dance/workshop)
├── pricing
├── capacity, registration_count
└── timestamps

registrations
├── id (UUID PK)
├── event_id (FK → events)
├── session_ids (UUID[] array)
├── full_name_encrypted, email_encrypted (PII - encrypted)
├── email_hashed (for lookups without decryption)
├── status (confirmed/waitlist/cancelled)
├── consents (booleans)
├── payment info
├── metadata (source, IP, user agent)
└── timestamps

submissions
├── id (UUID PK)
├── form_id (FK → forms)
├── data (JSONB - dynamic form data)
├── status
├── email tracking
└── timestamps

forms
├── id (UUID PK)
├── title, type
├── fields (JSONB array)
├── email configuration
├── webhooks
└── timestamps
```

### Security Features

**Row-Level Security (RLS) Policies:**
```sql
-- Events: Everyone can read published
-- Admins can read/write all

-- Registrations: Only admins can read
-- Everyone can insert (form submission)

-- Submissions: Only admins can read
-- Everyone can insert

-- Users: Admins only
-- Users can read own profile
```

**Data Encryption:**
```
Encrypted fields (at-rest in database):
├── registrations.full_name_encrypted
├── registrations.email_encrypted
├── registrations.phone_encrypted
├── registrations.location_encrypted
├── registrations.ip_address_encrypted
└── settings.*_encrypted

Query-able fields (NOT encrypted):
├── registrations.email_hashed (for lookups)
├── registrations.event_id (for filtering)
├── registrations.timestamp (for sorting)
└── registrations.status (for filtering)
```

---

## State Management Strategy

### Why No Redux?

For this architecture, we use **Supabase real-time subscriptions + React hooks**:

```typescript
// Direct subscription instead of Redux
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export function useRegistrations(eventId: string) {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Fetch initial data
    supabase
      .from('registrations')
      .select('*')
      .eq('event_id', eventId)
      .then(({ data }) => {
        setRegistrations(data || [])
        setLoading(false)
      })

    // Subscribe to real-time updates
    const subscription: RealtimeChannel = supabase
      .channel(`registrations:${eventId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'registrations',
          filter: `event_id=eq.${eventId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setRegistrations(prev => [...prev, payload.new])
          } else if (payload.eventType === 'UPDATE') {
            setRegistrations(prev =>
              prev.map(r => r.id === payload.new.id ? payload.new : r)
            )
          } else if (payload.eventType === 'DELETE') {
            setRegistrations(prev => prev.filter(r => r.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [eventId])

  return { registrations, loading }
}
```

**Benefits:**
- ✓ Single source of truth (database)
- ✓ Real-time updates across all clients
- ✓ No state sync issues
- ✓ Less boilerplate than Redux
- ✓ Automatic offline support (with Supabase offline mode)

---

## Performance Optimization

### Database Indexes

```sql
CREATE INDEX idx_events_status_published
  ON events(status, published_at DESC);

CREATE INDEX idx_registrations_event_id
  ON registrations(event_id);

CREATE INDEX idx_registrations_email_hashed
  ON registrations(email_hashed);

CREATE INDEX idx_registrations_created_at
  ON registrations(created_at DESC);

CREATE INDEX idx_sessions_event_id
  ON sessions(event_id);

CREATE INDEX idx_submissions_form_id
  ON submissions(form_id);

CREATE INDEX idx_analytics_events_timestamp
  ON analytics_events(timestamp DESC);
```

### Query Optimization

**Avoid N+1 queries:**
```typescript
// Bad: N+1 query
const events = await supabase.from('events').select('*')
const eventsWithSessions = await Promise.all(
  events.map(e => supabase.from('sessions').select('*').eq('event_id', e.id))
)

// Good: Single query with JOIN
const { data } = await supabase
  .from('events')
  .select('*, sessions(*)')
```

**Use PostgreSQL aggregations:**
```typescript
// Bad: Fetch all and count in JS
const all = await supabase.from('registrations').select('*').eq('event_id', id)
const count = all.length

// Good: SQL aggregation
const { data } = await supabase
  .from('registrations')
  .select('COUNT(*)', { count: 'exact' })
  .eq('event_id', id)
```

### Caching Strategy

```
┌──────────────────────────────────────────────────────┐
│         Next.js Caching Layers                       │
├──────────────────────────────────────────────────────┤
│                                                      │
│ ISR (Incremental Static Regeneration)               │
│ - Public event pages cached 60s                      │
│ - Revalidate on-demand when event updates           │
│                                                      │
│ Browser Cache                                        │
│ - Static assets: 1 year TTL                         │
│ - Immutable: true for versioned files               │
│                                                      │
│ Vercel Edge Network                                  │
│ - CDN caching for public pages                       │
│ - ISR for selective revalidation                    │
│                                                      │
│ PostgreSQL Connection Pool                           │
│ - Supabase handles pooling                          │
│ - Efficient query reuse                             │
└──────────────────────────────────────────────────────┘
```

---

## Error Handling & Monitoring

### Error Types & Recovery

```typescript
enum ErrorType {
  AUTHENTICATION = 'Authentication Error',
  AUTHORIZATION = 'Authorization Error',
  DATABASE = 'Database Error',
  VALIDATION = 'Validation Error',
  NOT_FOUND = 'Not Found',
  CONFLICT = 'Conflict (duplicate)',
  RATE_LIMIT = 'Rate Limit',
  EXTERNAL_SERVICE = 'External Service Error',
}

// Automatic retry logic
async function retryWithBackoff(
  operation: () => Promise<any>,
  maxRetries = 3
) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve =>
        setTimeout(resolve, Math.pow(2, i) * 1000)
      )
    }
  }
}
```

### Monitoring

**What Gets Tracked:**
```sql
-- Audit logs table
INSERT INTO audit_logs (
  timestamp, user_id, action, resource_type,
  resource_id, status, duration_ms, ip_address
) VALUES (...)

-- Email logs table
INSERT INTO email_logs (
  recipient, subject, template_name, status,
  registration_id, sent_at, error_message
) VALUES (...)

-- Analytics events
INSERT INTO analytics_events (
  event_id, event_type, user_id, session_id, timestamp
) VALUES (...)
```

---

## Security Architecture

### Authentication Flow

```
User Login Form
     │
     ▼
Supabase Auth API
     │
     ├─ Verify credentials
     ├─ Create JWT token
     ├─ Store refresh token in httpOnly cookie
     │
     ▼
Next.js Session Management
     │
     ├─ Store JWT in memory (or httpOnly via middleware)
     ├─ Include in Authorization header for API calls
     │
     ▼
PostgreSQL Row-Level Security
     │
     ├─ Check `auth.uid()` against users.id
     ├─ Verify role (admin/editor/viewer)
     ├─ Allow/deny based on policy
     │
     ▼
Query executed or blocked
```

### Data Encryption Strategy

```
At-Rest Encryption:
├─ Database fields encrypted with AES-256-GCM
├─ Encryption keys stored in environment variables
├─ Only admins can decrypt (with decryption function)

In-Transit Encryption:
├─ HTTPS/TLS for all connections
├─ Supabase enforces SSL
├─ API requests encrypted

At-Query Time:
├─ Hashed email (email_hashed) allows lookups
├─ Without decryption needed
├─ PII returned only to authorized users
```

---

## Disaster Recovery

### Backup Strategy

```
Supabase Automatic:
├─ Daily automatic backups (7-day retention)
├─ Point-in-time recovery available
└─ Stored in separate region

Manual Backups:
├─ Weekly export of full database
├─ Stored in Cloudinary backup bucket
├─ Registrations exported as encrypted CSV

Recovery Process:
1. Identify issue
2. Restore from Supabase dashboard or CLI
3. Verify data integrity
4. Notify affected users if needed
```

---

**Document Version**: 2.0 (Supabase Edition)
**Last Updated**: 2026-02-06

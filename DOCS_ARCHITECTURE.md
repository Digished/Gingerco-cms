# Gingerco CMS Architecture Document

## System Overview

```
User/Owner Device
        │
        ▼
┌─────────────────────────────────────────┐
│        Netlify CDN (Global)             │
│    (Next.js Frontend Application)       │
│  - Admin Dashboard                      │
│  - Public Pages                         │
│  - API Gateway                          │
└────────────────┬────────────────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌─────────┐  ┌──────────┐  ┌──────────────┐
│ Content │  │ Analytics│  │  APIs &      │
│ Editor  │  │Dashboard │  │Cloud Fn      │
└────┬────┘  └────┬─────┘  └──────┬───────┘
     │            │               │
     └────────────┴───────────────┘
                  │
                  ▼
        ┌─────────────────────────────────────┐
        │    Firebase (Backend Services)      │
        ├─────────────────────────────────────┤
        │ ┌─────────────────────────────────┐ │
        │ │   Firestore Database            │ │
        │ │  (Real-time NoSQL DB)           │ │
        │ │  - Pages                        │ │
        │ │  - Events & Sessions            │ │
        │ │  - Registrations                │ │
        │ │  - Form Submissions             │ │
        │ │  - Analytics                    │ │
        │ │  - User Data                    │ │
        │ └─────────────────────────────────┘ │
        │                                     │
        │ ┌─────────────────────────────────┐ │
        │ │  Cloud Functions (Serverless)   │ │
        │ │  - Email Triggers               │ │
        │ │  - Form Processing              │ │
        │ │  - Analytics Aggregation        │ │
        │ │  - Data Validation              │ │
        │ │  - Webhook Handlers             │ │
        │ └─────────────────────────────────┘ │
        │                                     │
        │ ┌─────────────────────────────────┐ │
        │ │  Cloud Storage                  │ │
        │ │  - Backups                      │ │
        │ │  - Archives                     │ │
        │ │  - Exports                      │ │
        │ └─────────────────────────────────┘ │
        │                                     │
        │ ┌─────────────────────────────────┐ │
        │ │  Authentication                 │ │
        │ │  - Email/Password               │ │
        │ │  - Google Sign-in               │ │
        │ │  - Role-Based Access Control    │ │
        │ └─────────────────────────────────┘ │
        └─────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┐
        │             │             │
        ▼             ▼             ▼
    ┌─────────┐ ┌─────────┐ ┌──────────┐
    │Cloudinary│ │Resend   │ │Optional: │
    │(CDN)     │ │(Email)  │ │G Sheets  │
    └─────────┘ └─────────┘ └──────────┘
```

---

## Data Flow Architecture

### 1. Admin Content Management Flow

```
Admin Creates Event
        │
        ▼
Next.js Admin Dashboard
        │
        ▼
API Route (/api/events/create)
        │
        ▼
Firebase Authentication Check
        │
        ├─ Valid? → Continue
        └─ Invalid? → Return 401

        ▼
Cloud Function Trigger
        │
        ├─ Validate event data
        ├─ Generate event ID
        ├─ Create event document
        ├─ Create session counters
        ├─ Log action (audit trail)
        └─ Return response

        ▼
Firestore Write
        │
        ├─ /events/{eventId}
        ├─ /counters/events
        └─ /logs/{logId}

        ▼
Real-time Update
        │
        ├─ Admin dashboard refreshes
        ├─ Public pages regenerate (ISR)
        └─ Webhook sent (optional)

        ▼
Success Response to Admin UI
```

### 2. Registration Flow

```
User Visits Event Page
        │
        ▼
Next.js fetches from Firestore
        │
        ├─ Event details
        ├─ Session availability
        ├─ Current capacity
        └─ Registration status

        ▼
Form Rendered with Dynamic Data
        │
        └─ Session options populated
        └─ Pricing updated in real-time
        └─ Availability shown

        ▼
User Fills & Submits Form
        │
        ▼
Client-side Validation
        │
        ├─ All required fields filled?
        ├─ Email format valid?
        ├─ Age requirement met?
        ├─ Consents checked?
        └─ Group size valid?

        ▼
Submit to API Route
        │
        ▼
/api/registrations/create
        │
        ├─ Rate limiting check
        ├─ Duplicate check
        ├─ Encrypt sensitive data
        ├─ Validate capacity
        └─ Create registration record

        ▼
Cloud Function Triggered
        │
        ├─ Update session counters
        ├─ Aggregate analytics
        ├─ Check if session full
        ├─ Send confirmation email (Resend)
        ├─ Send admin notification
        └─ Log submission

        ▼
Database Writes
        │
        ├─ /registrations/{regId}
        ├─ /counters/sessions/{sessionId}
        ├─ /analytics/events/{eventId}
        ├─ /analytics/funnel
        └─ /logs/{logId}

        ▼
Response to User
        │
        ├─ Success page shown
        ├─ Confirmation email sent
        ├─ Registration details provided
        └─ Next steps communicated

        ▼
Admin Dashboard Updated in Real-time
        │
        ├─ New registration count updates
        ├─ Revenue total increases
        ├─ Session capacity refreshes
        └─ Conversion rate recalculates
```

### 3. Analytics Collection Flow

```
User Interacts with Site
        │
        ├─ Page view
        ├─ Form started
        ├─ Form completed
        ├─ Form error
        └─ Link clicked

        ▼
Event Tracked by Firebase Analytics
        │
        ▼
Data aggregated in Cloud Function
        │
        ├─ Hourly aggregation
        ├─ Daily summary
        ├─ Weekly trends
        └─ Monthly reports

        ▼
Analytics Documents Updated
        │
        ├─ /analytics/events/{eventId}
        ├─ /analytics/pages/{pageId}
        ├─ /analytics/funnel
        └─ /analytics/daily/{date}

        ▼
Admin Dashboard Queries
        │
        ├─ Real-time listeners on analytics
        ├─ Charts updated automatically
        ├─ KPIs refreshed
        └─ Trends displayed

        ▼
Visualized in Admin Dashboard
        │
        ├─ Charts & graphs
        ├─ Tables & exports
        ├─ Custom reports
        └─ Trend analysis
```

---

## Component Architecture

### Frontend Components Structure

```
components/
├── admin/
│   ├── DashboardLayout
│   │   ├── Sidebar Navigation
│   │   ├── Top Navigation Bar
│   │   ├── Main Content Area
│   │   └── Footer
│   ├── EventManager
│   │   ├── EventList
│   │   │   ├── EventCard
│   │   │   └── EventFilters
│   │   ├── EventEditor
│   │   │   ├── BasicInfo
│   │   │   ├── SessionManager
│   │   │   ├── MediaUploader
│   │   │   └── SEOEditor
│   │   └── EventPublisher
│   ├── FormBuilder
│   │   ├── FieldSelector
│   │   ├── FieldEditor
│   │   ├── ConditionalLogic
│   │   ├── FormPreview
│   │   └── FormPublisher
│   ├── AnalyticsDashboard
│   │   ├── StatCards
│   │   ├── Chart Components
│   │   │   ├── RevenueTrendChart
│   │   │   ├── RegistrationFunnelChart
│   │   │   └── SourceBreakdownChart
│   │   ├── DataTables
│   │   └── ExportButtons
│   ├── SubmissionViewer
│   │   ├── SubmissionList
│   │   ├── SubmissionDetail
│   │   ├── SubmissionActions
│   │   └── BulkActions
│   └── MediaManager
│       ├── MediaBrowser
│       ├── MediaUploader
│       ├── MediaDetails
│       └── MediaTagger
│
├── public/
│   ├── EventListing
│   │   └── EventCard
│   ├── EventDetail
│   │   ├── HeroSection
│   │   ├── EventInfo
│   │   ├── SessionSelector
│   │   ├── FAQSection
│   │   └── RelatedEvents
│   ├── RegistrationForm
│   │   ├── FormField
│   │   ├── FormStep
│   │   ├── ConsentSection
│   │   └── SubmitButton
│   └── ConfirmationPage
│       ├── SuccessMessage
│       ├── RegistrationDetails
│       └── NextSteps
│
├── common/
│   ├── Header
│   ├── Footer
│   ├── Navigation
│   ├── Breadcrumb
│   └── LoadingSpinner
│
└── ui/
    ├── Button (variants: primary, secondary, danger)
    ├── Input (text, email, tel, etc.)
    ├── Select (dropdown, multi-select)
    ├── Checkbox
    ├── Radio
    ├── Modal
    ├── Card
    ├── Alert
    ├── Toast
    ├── Pagination
    ├── DatePicker
    └── TimePicker
```

---

## API Endpoints

### Admin APIs (Protected - Requires Admin Auth)

```
POST   /api/auth/login              → User login
POST   /api/auth/logout             → User logout
GET    /api/auth/me                 → Current user info

GET    /api/events                  → List all events
POST   /api/events                  → Create event
GET    /api/events/[id]             → Get event details
PUT    /api/events/[id]             → Update event
DELETE /api/events/[id]             → Delete event
POST   /api/events/[id]/publish     → Publish event
POST   /api/events/[id]/duplicate   → Duplicate event

GET    /api/submissions             → List all form submissions
GET    /api/submissions/[id]        → Get submission details
PUT    /api/submissions/[id]        → Update submission status
DELETE /api/submissions/[id]        → Delete submission
POST   /api/submissions/export      → Export submissions as CSV

GET    /api/analytics/events/[id]   → Get event analytics
GET    /api/analytics/pages/[id]    → Get page analytics
GET    /api/analytics/funnel        → Get registration funnel
GET    /api/analytics/dashboard     → Get dashboard summary

GET    /api/media                   → List media files
POST   /api/media/upload            → Upload media to Cloudinary
DELETE /api/media/[id]              → Delete media

GET    /api/settings                → Get site settings
PUT    /api/settings                → Update site settings

GET    /api/users                   → List users
POST   /api/users                   → Create user
PUT    /api/users/[id]              → Update user
DELETE /api/users/[id]              → Delete user
```

### Public APIs (No Auth Required)

```
GET    /api/public/events           → List published events
GET    /api/public/events/[slug]    → Get event details by slug
GET    /api/public/pages/[slug]     → Get page by slug

POST   /api/registrations           → Submit registration
GET    /api/registrations/[id]      → Check registration status
```

### Webhook Endpoints

```
POST   /api/webhooks/submissions    → Form submission webhook
POST   /api/webhooks/payments       → Payment webhook (Stripe)
POST   /api/webhooks/emails         → Email delivery webhook (Resend)
```

---

## State Management Strategy

### Why Not Redux/Zustand?

For this CMS, we use **Firestore real-time listeners** instead of global state management:

```typescript
// Direct Firestore usage instead of Redux
import { onSnapshot, collection } from 'firebase/firestore';

useEffect(() => {
  // Real-time listener - always in sync with database
  const unsubscribe = onSnapshot(
    collection(db, 'events'),
    (snapshot) => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
  );

  return () => unsubscribe();
}, []);
```

**Benefits:**
- ✓ Single source of truth (database)
- ✓ Real-time updates across tabs/users
- ✓ No state sync issues
- ✓ Less boilerplate than Redux
- ✓ Automatic offline support (with Firestore offline persistence)

### Custom Hooks for Data Fetching

```typescript
// hooks/useEvents.ts
import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export function useEvents(filters?: any) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      let q = collection(db, 'events');

      if (filters?.published) {
        q = query(q, where('status', '==', 'published'));
      }

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setEvents(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Event)));
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setLoading(false);
    }
  }, [filters]);

  return { events, loading, error };
}
```

---

## Security Architecture

### Authentication & Authorization

```
┌─────────────────────────────────────────┐
│     Firebase Authentication              │
│  (Email/Password + Google Sign-in)      │
└────────────────┬────────────────────────┘
                 │
                 ▼
        ┌─────────────────────┐
        │   Firebase Admin    │
        │   Verify ID Token   │
        └────────┬────────────┘
                 │
                 ▼
        ┌─────────────────────┐
        │  Check User Role    │
        │  admin/editor/      │
        │  viewer             │
        └────────┬────────────┘
                 │
                 ▼
        ┌─────────────────────┐
        │  Firestore Rules    │
        │  verify permissions │
        │  block unauthorized │
        │  access             │
        └─────────────────────┘
```

### Data Encryption

```typescript
// For sensitive personal data (PII)
import { secretbox, randombytes, decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util';
import nacl from 'tweetnacl';

export function encryptData(data: string, key: string): string {
  const nonce = randombytes(nacl.secretbox.nonceLength);
  const messageUint8 = decodeUTF8(data);
  const encrypted = nacl.secretbox(messageUint8, nonce, decodeBase64(key));
  const fullMessage = new Uint8Array(nonce.length + encrypted.length);
  fullMessage.set(nonce);
  fullMessage.set(encrypted, nonce.length);
  return encodeBase64(fullMessage);
}

export function decryptData(encrypted: string, key: string): string {
  const fullMessage = decodeBase64(encrypted);
  const nonce = fullMessage.slice(0, nacl.secretbox.nonceLength);
  const message = fullMessage.slice(nacl.secretbox.nonceLength);
  const decrypted = nacl.secretbox.open(message, nonce, decodeBase64(key));
  if (!decrypted) throw new Error('Decryption failed');
  return encodeUTF8(decrypted);
}
```

**Fields Encrypted in Firestore:**
- fullName
- email
- phone
- location

**Not Encrypted (queryable):**
- eventId
- sessionIds
- timestamp
- consents (boolean)
- status

---

## Performance Optimization

### Image Optimization (Cloudinary)

```typescript
// Next.js Image Component with Cloudinary
import { CldImage } from 'next-cloudinary';

export function OptimizedImage({ cloudinaryId, alt, width, height }) {
  return (
    <CldImage
      src={cloudinaryId}
      alt={alt}
      width={width}
      height={height}
      quality="auto"
      fetch="auto"
      responsive
    />
  );
}
```

### Database Query Optimization

```typescript
// Create Firestore indexes for common queries
/*
Index 1:
Collection: events
Fields: status (Ascending), publishedAt (Descending)
Use: List published events sorted by date

Index 2:
Collection: registrations
Fields: eventId (Ascending), timestamp (Descending)
Use: Get registrations for an event

Index 3:
Collection: analytics
Fields: date (Descending), eventId (Ascending)
Use: Event analytics trends
*/
```

### Caching Strategy

```
┌──────────────────────────────┐
│    Next.js Caching Layers    │
├──────────────────────────────┤
│ ISR (Incremental Static Regen)
│ - Regenerate pages every 60s
│ - On-demand revalidation on update
│
│ Netlify Edge Caching
│ - Cache public pages at edge
│ - 1 hour TTL
│
│ Browser Cache
│ - Immutable assets
│ - 1 year TTL
│
│ Firestore Response Caching
│ - Real-time listeners
│ - Local persistence
└──────────────────────────────┘
```

---

## Error Handling & Monitoring

### Error Types

```typescript
enum ErrorType {
  AUTHENTICATION = 'Authentication Error',
  AUTHORIZATION = 'Authorization Error',
  VALIDATION = 'Validation Error',
  NOT_FOUND = 'Not Found Error',
  RATE_LIMIT = 'Rate Limit Error',
  SERVER_ERROR = 'Server Error',
  EXTERNAL_SERVICE = 'External Service Error',
}
```

### Error Recovery

```typescript
// Automatic retry with exponential backoff
async function retryOperation(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
}
```

---

## Monitoring & Logging

### What Gets Logged

```typescript
interface AuditLog {
  timestamp: Date;
  userId: string;
  action: string; // 'create_event', 'update_registration', etc.
  resourceType: string; // 'event', 'registration', etc.
  resourceId: string;
  changes: {
    before: Record<string, any>;
    after: Record<string, any>;
  };
  ipAddress: string;
  status: 'success' | 'failure';
}
```

**Logged Actions:**
- Event creation/update/deletion
- Registration submission
- User authentication
- Admin dashboard access
- Data exports
- Settings changes
- User management

---

## Disaster Recovery

### Data Backups

```
Daily Exports:
├─ All registrations → CSV
├─ All events → JSON
├─ All analytics → JSON
└─ Stored in Firebase Cloud Storage

Weekly Full Backup:
└─ Full Firestore database export

Retention:
├─ Daily: 7 days
├─ Weekly: 12 weeks
└─ Monthly: 12 months
```

### Recovery Process

```
1. Identify issue
2. Stop ongoing operations
3. Restore from most recent backup
4. Verify data integrity
5. Resume operations
6. Notify admins
```

---

**Document Version**: 1.0
**Last Updated**: 2026-02-06

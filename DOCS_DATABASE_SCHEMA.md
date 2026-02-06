# Firestore Database Schema Reference

## Overview

Complete database structure for Gingerco CMS including all collections, documents, and fields.

---

## Collections

### 1. `events` Collection

**Purpose**: Store event details, sessions, and configuration

```
events/
├── {eventId}/ (e.g., "vienna-2025")
│   ├── title: string                              // "Afrobeats Indoor Cycling"
│   ├── slug: string                               // "afrobeats-cycling-vienna-2025"
│   ├── description: string                        // Long-form HTML content
│   ├── shortDescription: string                   // Preview text
│   ├── status: "published" | "draft" | "archived"
│   │
│   ├── dates: object
│   │   ├── eventDate: string                      // "2025-12-06" (ISO)
│   │   ├── eventTime: string                      // "13:00" (HH:mm)
│   │   ├── startDate: Timestamp                   // When registration starts
│   │   └── endDate: Timestamp                     // Event end time
│   │
│   ├── venue: object
│   │   ├── name: string                           // "Sport Arena Vienna"
│   │   ├── address: string                        // Full address
│   │   ├── city: string                           // "Vienna"
│   │   ├── country: string                        // "AT"
│   │   └── coordinates: object
│   │       ├── lat: number
│   │       └── lng: number
│   │
│   ├── capacity: object
│   │   ├── total: number                          // Total venue capacity
│   │   └── riders: number                         // Expected riders
│   │
│   ├── sessions: array[object]
│   │   └── [0]: object
│   │       ├── sessionId: string                  // "session_1"
│   │       ├── title: string                      // "Session 1"
│   │       ├── startTime: string                  // "14:00"
│   │       ├── endTime: string                    // "15:00"
│   │       ├── type: "cycling" | "dance" | "workshop"
│   │       ├── description: string
│   │       ├── instructor: string                 // "Gbolahan Ore"
│   │       ├── price: object
│   │       │   ├── amount: number                 // 55
│   │       │   ├── currency: string               // "EUR"
│   │       │   └── isFree: boolean
│   │       ├── capacity: number                   // 100
│   │       ├── registrationCount: number          // Current count
│   │       └── waitlistCount: number              // Waitlist count
│   │
│   ├── media: object
│   │   ├── thumbnail: object
│   │   │   ├── cloudinaryId: string
│   │   │   ├── url: string
│   │   │   ├── alt: string
│   │   │   ├── width: number
│   │   │   └── height: number
│   │   ├── heroImage: object (same structure)
│   │   ├── gallery: array[object]
│   │   │   └── [0]: (same media structure)
│   │   └── video: object (optional)
│   │
│   ├── registrationSettings: object
│   │   ├── registrationOpen: boolean
│   │   ├── registrationDeadline: Timestamp
│   │   ├── requiresAge: boolean
│   │   ├── minimumAge: number
│   │   ├── requiresWaiver: boolean
│   │   └── allowGroupRegistrations: boolean
│   │
│   ├── content: object
│   │   ├── overview: string
│   │   ├── highlights: array[string]
│   │   ├── programStructure: string
│   │   └── faq: array[object]
│   │       └── [0]: object
│   │           ├── question: string
│   │           └── answer: string
│   │
│   ├── seo: object
│   │   ├── title: string
│   │   ├── description: string
│   │   ├── keywords: string
│   │   └── ogImage: string (cloudinaryId)
│   │
│   ├── socialLinks: object
│   │   ├── instagram: string
│   │   ├── tiktok: string
│   │   └── facebook: string
│   │
│   ├── createdAt: Timestamp                       // Document creation
│   ├── updatedAt: Timestamp                       // Last modification
│   ├── publishedAt: Timestamp (optional)          // When published
│   └── publishedBy: string (optional)             // User ID who published
```

**Indexes Needed:**
- `status` (Asc) + `publishedAt` (Desc)
- `slug` (Asc)

---

### 2. `sessions` Collection

**Purpose**: Real-time session availability and registration counts

```
sessions/
├── {eventId}_{sessionId}/ (e.g., "vienna-2025_session_1")
│   ├── eventId: string
│   ├── sessionId: string
│   ├── totalRegistrations: number
│   ├── totalRevenue: number
│   ├── capacity: number
│   ├── cutoffDate: Timestamp
│   ├── isFull: boolean
│   ├── lastUpdated: Timestamp
│   └── registrations: array[object]
│       └── [0]: object
│           ├── registrationId: string
│           ├── timestamp: Timestamp
│           └── status: "confirmed" | "waitlist" | "cancelled"
```

**Purpose**: Quick lookup of session capacity for real-time updates

---

### 3. `registrations` Collection

**Purpose**: Store form submissions (encrypted sensitive data)

```
registrations/
├── {registrationId}/ (auto-generated)
│   ├── eventId: string
│   ├── sessionIds: array[string]                  // ["session_1", "session_2"]
│   ├── timestamp: Timestamp
│   ├── status: "confirmed" | "waitlist" | "cancelled"
│   │
│   ├── personalInfo: object (encrypted fields)
│   │   ├── fullName: string (encrypted)
│   │   ├── email: string (encrypted)
│   │   ├── phone: string (encrypted)
│   │   └── location: string (encrypted)
│   │
│   ├── groupSize: number                          // Number of guests
│   │
│   ├── consents: object
│   │   ├── ageConfirm: boolean
│   │   ├── physicalReadiness: boolean
│   │   ├── liabilityWaiver: boolean
│   │   ├── eventRecording: boolean
│   │   ├── stayConnected: boolean
│   │   ├── gdprConsent: boolean
│   │   └── mediaConsent: boolean
│   │
│   ├── paymentInfo: object
│   │   ├── status: "pending" | "completed" | "failed"
│   │   ├── amount: number                         // In EUR
│   │   ├── currency: string
│   │   ├── paymentId: string (optional)           // Stripe ID
│   │   └── paymentDate: Timestamp (optional)
│   │
│   ├── confirmationEmailSent: boolean
│   ├── reminderEmailSent: boolean (optional)
│   │
│   ├── metadata: object
│   │   ├── source: "web" | "mobile" | "admin"
│   │   ├── referrer: string (optional)
│   │   ├── userAgent: string
│   │   └── ipAddress: string (encrypted)
│   │
│   └── notes: string (optional)                   // Admin notes
```

**Indexes Needed:**
- `eventId` (Asc) + `timestamp` (Desc)
- `status` (Asc) + `timestamp` (Desc)
- `timestamp` (Desc) [for recent submissions]

**Security**: All sensitive fields encrypted. Admin-only read/write.

---

### 4. `forms` Collection

**Purpose**: Form templates and configurations

```
forms/
├── {formId}/ (e.g., "registration-event-vienna-2025")
│   ├── title: string
│   ├── description: string
│   ├── type: "registration" | "contact" | "newsletter" | "custom"
│   ├── status: "active" | "inactive"
│   │
│   ├── fields: array[object]
│   │   └── [0]: object
│   │       ├── id: string
│   │       ├── label: string
│   │       ├── type: "text" | "email" | "tel" | "checkbox" | "select" | "textarea"
│   │       ├── required: boolean
│   │       ├── placeholder: string
│   │       ├── helpText: string (optional)
│   │       ├── validation: object
│   │       │   ├── minLength: number (optional)
│   │       │   ├── maxLength: number (optional)
│   │       │   ├── pattern: string (optional regex)
│   │       │   └── customValidator: string (optional)
│   │       ├── options: array (if select/radio)
│   │       │   └── [0]: object
│   │       │       ├── label: string
│   │       │       └── value: string
│   │       ├── conditionalLogic: object (optional)
│   │       │   ├── show: boolean
│   │       │   ├── dependsOn: string (field id)
│   │       │   └── value: string
│   │       └── order: number
│   │
│   ├── confirmationMessage: string
│   ├── confirmationRedirectUrl: string (optional)
│   │
│   ├── emailSettings: object
│   │   ├── sendConfirmation: boolean
│   │   ├── confirmationTemplate: string (ref to emailTemplates)
│   │   ├── sendAdminNotification: boolean
│   │   ├── adminTemplate: string
│   │   └── adminEmails: array[string]
│   │
│   ├── webhooks: array[object]
│   │   └── [0]: object
│   │       ├── url: string
│   │       ├── events: array[string]              // ["submission", "completion"]
│   │       └── active: boolean
│   │
│   ├── createdAt: Timestamp
│   ├── updatedAt: Timestamp
│   └── createdBy: string
```

---

### 5. `submissions` Collection

**Purpose**: Generic form submissions (all forms)

```
submissions/
├── {submissionId}/ (auto-generated)
│   ├── formId: string
│   ├── formType: string
│   ├── timestamp: Timestamp
│   ├── status: "received" | "processed" | "failed"
│   │
│   ├── data: object                               // Dynamic form data
│   │   ├── [fieldId]: value
│   │   └── ... (varies by form)
│   │
│   ├── metadata: object
│   │   ├── ipAddress: string
│   │   ├── userAgent: string
│   │   └── source: string
│   │
│   ├── emails: object
│   │   ├── confirmationSent: boolean
│   │   ├── confirmationSentAt: Timestamp
│   │   ├── adminNotificationSent: boolean
│   │   └── adminNotificationSentAt: Timestamp
│   │
│   └── notes: string (optional)
```

**Note**: `submissions` differs from `registrations` - registrations are event-specific with encrypted PII, submissions are generic form data.

---

### 6. `analytics` Collection

**Purpose**: Aggregated analytics and metrics

```
analytics/
├── events/
│   └── {eventId}/
│       ├── totalViews: number
│       ├── totalRegistrations: number
│       ├── totalRevenue: number
│       ├── conversionRate: number (0.0-1.0)
│       ├── averageSessionPrice: number
│       ├── capacityFillRate: number
│       │
│       ├── sourceBreakdown: object
│       │   ├── direct: number
│       │   ├── google: number
│       │   ├── instagram: number
│       │   ├── tiktok: number
│       │   ├── other: number
│       │   └── lastUpdated: Timestamp
│       │
│       ├── dailyViews: array[object]
│       │   └── [0]: object
│       │       ├── date: string (YYYY-MM-DD)
│       │       └── views: number
│       │
│       ├── dailyRegistrations: array[object]
│       │   └── [0]: object
│       │       ├── date: string
│       │       ├── registrations: number
│       │       └── revenue: number
│       │
│       ├── sessions: object
│       │   └── {sessionId}: object
│       │       ├── registrations: number
│       │       ├── capacity: number
│       │       ├── fillRate: number
│       │       ├── revenue: number
│       │       └── averagePrice: number
│       │
│       ├── lastUpdated: Timestamp
│       └── nextUpdate: Timestamp (when aggregation runs)
│
├── pages/
│   └── {pageId}/
│       ├── totalViews: number
│       ├── uniqueVisitors: number
│       ├── bounceRate: number
│       ├── avgSessionDuration: number (seconds)
│       ├── conversionRate: number
│       ├── lastUpdated: Timestamp
│       └── dailyViews: array[object]
│
└── funnel/
    └── daily/
        └── {date}/ (e.g., "2025-12-06")
            ├── pageViews: number
            ├── formStarts: number
            ├── formCompletions: number
            ├── payments: number
            ├── conversionRate: number (completions/pageViews)
            └── averageTimeToComplete: number (seconds)
```

---

### 7. `emailTemplates` Collection

**Purpose**: Email template management

```
emailTemplates/
├── {templateId}/ (e.g., "registration-confirmation")
│   ├── name: string
│   ├── subject: string                            // "Registration Confirmed - {{eventTitle}}"
│   ├── htmlBody: string                           // HTML with {{variables}}
│   ├── plainTextBody: string
│   ├── variables: array[string]                   // ["fullName", "eventTitle", "sessionDetails"]
│   ├── createdAt: Timestamp
│   ├── updatedAt: Timestamp
│   ├── createdBy: string
│   └── lastUsedAt: Timestamp
```

**Example Variables:**
```
{{fullName}}
{{email}}
{{eventTitle}}
{{eventDate}}
{{eventTime}}
{{sessionDetails}}
{{totalAmount}}
{{confirmationLink}}
{{registrationId}}
```

---

### 8. `settings` Collection

**Purpose**: Global application settings

```
settings/
├── general/
│   ├── siteName: string
│   ├── siteUrl: string
│   ├── siteDescription: string
│   ├── logo: object
│   │   ├── cloudinaryId: string
│   │   └── url: string
│   ├── favicon: object
│   ├── primaryColor: string                       // "#D4AF37" (gold)
│   ├── socialLinks: object
│   │   ├── instagram: string
│   │   ├── tiktok: string
│   │   ├── linkedin: string
│   │   └── facebook: string
│   ├── contactEmail: string
│   ├── timezone: string                           // "Europe/Vienna"
│   ├── language: string                           // "en", "de"
│   └── updatedAt: Timestamp
│
├── email/
│   ├── resendApiKey: string (encrypted)
│   ├── fromEmail: string
│   ├── fromName: string
│   ├── adminEmails: array[string]
│   ├── replyToEmail: string
│   ├── unsubscribeUrl: string
│   └── updatedAt: Timestamp
│
├── payments/
│   ├── stripePublishableKey: string (encrypted)
│   ├── stripeSecretKey: string (encrypted)
│   ├── currency: string                           // "EUR"
│   ├── taxRate: number                            // 0.0
│   ├── enabled: boolean
│   └── updatedAt: Timestamp
│
├── privacy/
│   ├── gdprEnabled: boolean
│   ├── privacyPageContent: string (HTML)
│   ├── termsPageContent: string (HTML)
│   ├── dataRetentionDays: number                  // 365
│   ├── gdprEmail: string
│   └── updatedAt: Timestamp
│
├── analytics/
│   ├── googleAnalyticsId: string
│   ├── trackingEnabled: boolean
│   ├── trackingConsentRequired: boolean
│   └── updatedAt: Timestamp
│
└── maintenance/
    ├── maintenanceMode: boolean
    ├── maintenanceMessage: string
    └── updatedAt: Timestamp
```

---

### 9. `users` Collection

**Purpose**: Admin user management

```
users/
├── {userId}/ (Firebase Auth UID)
│   ├── email: string
│   ├── displayName: string
│   ├── role: "admin" | "editor" | "viewer"
│   ├── permissions: array[string]
│   │   └── [0]: "edit_content" | "view_analytics" | "manage_users" | etc.
│   ├── active: boolean
│   ├── createdAt: Timestamp
│   ├── updatedAt: Timestamp
│   ├── lastLogin: Timestamp (optional)
│   ├── lastLoginIp: string
│   ├── loginAttempts: number
│   ├── locked: boolean
│   └── lockedUntil: Timestamp (optional)
```

**Role Permissions:**

| Role | Permissions |
|------|-------------|
| **admin** | All permissions |
| **editor** | edit_content, view_analytics, manage_forms, view_submissions |
| **viewer** | view_analytics (read-only), view_submissions (read-only) |

---

### 10. `media` Collection

**Purpose**: Media library metadata

```
media/
├── {mediaId}/ (auto-generated)
│   ├── cloudinaryId: string                       // Unique ID in Cloudinary
│   ├── fileName: string
│   ├── type: "image" | "video" | "document"
│   ├── url: string
│   ├── mimeType: string                           // "image/jpeg"
│   ├── alt: string                                // Accessibility
│   ├── caption: string (optional)
│   ├── width: number (for images)
│   ├── height: number (for images)
│   ├── size: number                               // Bytes
│   ├── duration: number (for videos, in seconds)
│   │
│   ├── usedIn: array[string]                      // Where media is used
│   │   └── [0]: "events/vienna-2025"
│   │
│   ├── tags: array[string]                        // ["event", "2025", "cycling"]
│   ├── uploadedBy: string                         // User ID
│   ├── uploadedAt: Timestamp
│   ├── lastModified: Timestamp
│   └── metadata: object (optional)
│       ├── photographer: string
│       ├── license: string
│       └── customField: string
```

---

### 11. `logs` Collection

**Purpose**: Audit trail

```
logs/
├── {logId}/ (auto-generated)
│   ├── timestamp: Timestamp
│   ├── userId: string
│   ├── userEmail: string
│   ├── action: string                             // "create_event", "update_registration"
│   ├── resourceType: string                        // "event", "registration", "user"
│   ├── resourceId: string
│   ├── resourceName: string (optional)
│   ├── status: "success" | "failure"
│   ├── errorMessage: string (optional)
│   │
│   ├── changes: object
│   │   ├── before: object
│   │   ├── after: object
│   │   └── fieldsChanged: array[string]
│   │
│   ├── metadata: object
│   │   ├── ipAddress: string
│   │   ├── userAgent: string
│   │   └── apiVersion: string
│   │
│   └── duration: number                           // Milliseconds
```

**Indexes Needed:**
- `timestamp` (Desc)
- `userId` (Asc) + `timestamp` (Desc)
- `resourceType` (Asc) + `timestamp` (Desc)

---

### 12. `pages` Collection

**Purpose**: CMS pages content

```
pages/
├── {pageId}/ (e.g., "home", "about", "contact")
│   ├── title: string
│   ├── slug: string
│   ├── description: string (short)
│   ├── status: "published" | "draft" | "archived"
│   │
│   ├── hero: object (optional)
│   │   ├── title: string
│   │   ├── subtitle: string
│   │   ├── image: object
│   │   │   ├── cloudinaryId: string
│   │   │   └── alt: string
│   │   └── ctaButton: object
│   │       ├── text: string
│   │       └── url: string
│   │
│   ├── sections: array[object]                    // Page builder blocks
│   │   └── [0]: object
│   │       ├── id: string
│   │       ├── type: string                       // "about", "features", "gallery", "cta"
│   │       ├── title: string
│   │       ├── content: string (HTML)
│   │       ├── images: array[object]
│   │       ├── backgroundColor: string
│   │       ├── order: number
│   │       └── settings: object
│   │
│   ├── seo: object
│   │   ├── title: string
│   │   ├── description: string
│   │   ├── keywords: array[string]
│   │   ├── ogImage: string
│   │   ├── twitterCard: string
│   │   └── canonical: string (optional)
│   │
│   ├── createdAt: Timestamp
│   ├── updatedAt: Timestamp
│   ├── publishedAt: Timestamp (optional)
│   └── publishedBy: string (optional)
```

---

## Real-time Counters (Optimized)

For frequently updated values, use a dedicated counters collection:

```
counters/
├── sessions/
│   ├── {sessionId}: number                        // Quick capacity lookup
│   └── ...
│
├── events/
│   ├── {eventId}_views: number
│   ├── {eventId}_registrations: number
│   ├── {eventId}_revenue: number
│   └── ...
│
└── analytics/
    ├── daily_registrations: number
    ├── daily_revenue: number
    └── daily_submissions: number
```

**Update Pattern:**
```typescript
// Use batch writes for atomic counter updates
const batch = db.batch();

const sessionRef = db.collection('counters').doc('sessions');
batch.update(sessionRef, {
  [sessionId]: increment(1)
});

const analyticsRef = db.collection('counters').doc('events');
batch.update(analyticsRef, {
  [`${eventId}_registrations`]: increment(1),
  [`${eventId}_revenue`]: increment(amount)
});

await batch.commit();
```

---

## Field Types Reference

| Type | Description | Example |
|------|-------------|---------|
| `string` | Text | "Hello World" |
| `number` | Integer or Float | 42, 3.14 |
| `boolean` | True/False | true |
| `Date/Timestamp` | DateTime | new Date() |
| `array` | List of items | ["item1", "item2"] |
| `object` | Nested structure | { name: "John", age: 30 } |
| `reference` | Link to another doc | db.doc("users/123") |
| `geopoint` | Coordinates | new GeoPoint(lat, lng) |
| `bytes` | Binary data | Blob(data) |

---

## Query Examples

### Get All Published Events
```typescript
const q = query(
  collection(db, 'events'),
  where('status', '==', 'published'),
  orderBy('publishedAt', 'desc')
);
const docs = await getDocs(q);
```

### Get Registrations for Event
```typescript
const q = query(
  collection(db, 'registrations'),
  where('eventId', '==', 'vienna-2025'),
  orderBy('timestamp', 'desc')
);
const docs = await getDocs(q);
```

### Get Recent Analytics
```typescript
const q = query(
  collection(db, 'logs'),
  orderBy('timestamp', 'desc'),
  limit(50)
);
const docs = await getDocs(q);
```

---

**Document Version**: 1.0
**Last Updated**: 2026-02-06

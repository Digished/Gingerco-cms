# Gingerco Headless CMS Implementation Plan

**Status**: Planning Phase
**Tech Stack**: Firebase (Backend) + Next.js (Frontend) + Netlify (Hosting)
**Timeline**: 3-4 weeks
**Cost**: €20-50/month

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Phase 1: Foundation (Week 1)](#phase-1-foundation-week-1)
3. [Phase 2: Admin Interface (Week 2)](#phase-2-admin-interface-week-2)
4. [Phase 3: Data Migration (Week 3)](#phase-3-data-migration-week-3)
5. [Phase 4: Launch (Week 4)](#phase-4-launch-week-4)
6. [Repo Cleanup](#repo-cleanup)
7. [Technology Stack Details](#technology-stack-details)

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
│  Next.js Frontend      │          │  Firebase Backend   │
│  (Netlify Hosting)     │          │  - Firestore DB     │
│  - Home page           │◄────────►│  - Auth             │
│  - Events listing      │  API     │  - Cloud Functions  │
│  - Event details       │  Routes  │  - Cloud Storage    │
│  - Registration forms  │          │  - Analytics        │
│  - Admin Dashboard     │          └─────────────────────┘
└────────────────────────┘

Integration Points:
├── Cloudinary (Media - unchanged)
├── Resend (Email via Cloud Functions - new)
├── Google Sheets (Backup only - optional)
└── Analytics (Firebase native)
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

# Install additional dependencies
npm install \
  firebase \
  firebase-admin \
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
│   │   │   └── signup/page.tsx
│   │   ├── (admin)/
│   │   │   ├── dashboard/page.tsx
│   │   │   ├── events/page.tsx
│   │   │   ├── events/[id]/page.tsx
│   │   │   ├── pages/page.tsx
│   │   │   ├── forms/page.tsx
│   │   │   ├── submissions/page.tsx
│   │   │   ├── analytics/page.tsx
│   │   │   ├── media/page.tsx
│   │   │   └── settings/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/route.ts
│   │   │   ├── events/route.ts
│   │   │   ├── events/[id]/route.ts
│   │   │   ├── registrations/route.ts
│   │   │   ├── submissions/route.ts
│   │   │   ├── analytics/route.ts
│   │   │   ├── webhooks/submissions/route.ts
│   │   │   └── webhooks/firebase/route.ts
│   │   ├── (public)/
│   │   │   ├── page.tsx
│   │   │   ├── events/page.tsx
│   │   │   ├── events/[slug]/page.tsx
│   │   │   └── [[...slug]]/page.tsx
│   │   └── layout.tsx
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts
│   │   │   ├── admin.ts
│   │   │   ├── db.ts
│   │   │   └── utils.ts
│   │   ├── types/
│   │   │   ├── firestore.ts
│   │   │   ├── forms.ts
│   │   │   └── analytics.ts
│   │   ├── utils/
│   │   │   ├── encryption.ts
│   │   │   ├── validation.ts
│   │   │   └── formatting.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   ├── useEvents.ts
│   │   │   └── useAnalytics.ts
│   │   ├── auth.ts
│   │   └── constants.ts
│   └── components/
│       ├── admin/
│       │   ├── Dashboard.tsx
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
├── .env.local (LOCAL ONLY - not committed)
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

#### 1.2 Set Up Firebase Project

```
Steps:
1. Go to https://console.firebase.google.com
2. Create new project "gingerco-cms"
3. Enable:
   - Firestore Database (Start in production mode)
   - Authentication (Email/Password + Google Sign-in)
   - Cloud Functions
   - Cloud Storage
4. Create service account (Settings → Service Accounts)
5. Copy credentials to environment variables
```

**Environment Variables (.env.local):**
```
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx

FIREBASE_ADMIN_SDK_KEY=xxx
FIREBASE_PROJECT_ID=xxx

RESEND_API_KEY=xxx

NEXT_PUBLIC_SITE_URL=https://cms.gingerandco.at
```

#### 1.3 Firebase Configuration Files

**`src/lib/firebase/config.ts`:**
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

**`src/lib/firebase/admin.ts`:**
```typescript
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_SDK_KEY!)),
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
```

### Day 3-4: Database Schema Setup

#### 1.4 Create Firestore Collections & Rules

**Database Initialization Script:**
```typescript
// scripts/initializeFirestore.ts
import { adminDb } from '../src/lib/firebase/admin';

async function initializeCollections() {
  // Collections (auto-created on first write, but define structure here)
  const collections = [
    'pages',
    'events',
    'sessions',
    'registrations',
    'forms',
    'submissions',
    'analytics',
    'emailTemplates',
    'settings',
    'users',
    'media',
    'logs',
  ];

  // Create default documents
  await adminDb.collection('settings').doc('general').set({
    siteName: 'Ginger & Co.',
    siteUrl: 'https://gingerandco.at',
    createdAt: new Date(),
  });

  await adminDb.collection('settings').doc('email').set({
    fromEmail: 'events@gingerandco.at',
    fromName: 'Ginger & Co.',
    adminEmails: ['admin@gingerandco.at'],
  });

  console.log('Firestore initialized!');
}

initializeCollections().catch(console.error);
```

**Firestore Security Rules (`firestore.rules`):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Admin only
    match /{document=**} {
      allow read, write: if request.auth != null && hasRole('admin');
    }

    // Public read for published content
    match /events/{eventId} {
      allow read: if resource.data.status == 'published';
    }

    match /pages/{pageId} {
      allow read: if resource.data.status == 'published';
    }

    // Registrations can be submitted by anyone
    match /registrations/{registrationId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null && hasRole('admin');
    }

    // Helper function
    function hasRole(role) {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
  }
}
```

**Deploy Rules:**
```bash
firebase deploy --only firestore:rules
```

#### 1.5 Create TypeScript Types

**`src/lib/types/firestore.ts`:**
```typescript
export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  status: 'published' | 'draft' | 'archived';
  dates: {
    eventDate: string;
    eventTime: string;
    startDate: Date;
    endDate: Date;
  };
  venue: {
    name: string;
    address: string;
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  sessions: Session[];
  capacity: {
    total: number;
    riders: number;
  };
  media: {
    thumbnail: MediaFile;
    heroImage: MediaFile;
    gallery: MediaFile[];
    video?: MediaFile;
  };
  registrationSettings: {
    registrationOpen: boolean;
    registrationDeadline: Date;
    requiresAge: boolean;
    minimumAge: number;
    requiresWaiver: boolean;
    allowGroupRegistrations: boolean;
  };
  seo: SEOData;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  publishedBy?: string;
}

export interface Session {
  sessionId: string;
  title: string;
  startTime: string;
  endTime: string;
  type: 'cycling' | 'dance' | 'workshop';
  price: {
    amount: number;
    currency: string;
    isFree: boolean;
  };
  capacity: number;
  description: string;
  instructor?: string;
  registrationCount: number;
  waitlistCount: number;
}

export interface Registration {
  id: string;
  eventId: string;
  sessionIds: string[];
  timestamp: Date;
  personalInfo: {
    fullName: string; // encrypted
    email: string; // encrypted
    phone: string; // encrypted
    location: string; // encrypted
  };
  groupSize: number;
  consents: {
    ageConfirm: boolean;
    physicalReadiness: boolean;
    liabilityWaiver: boolean;
    eventRecording: boolean;
    stayConnected: boolean;
    gdprConsent: boolean;
    mediaConsent: boolean;
  };
  paymentInfo: {
    status: 'pending' | 'completed' | 'failed';
    amount: number;
    currency: string;
    paymentId?: string;
  };
  confirmationEmailSent: boolean;
  status: 'confirmed' | 'waitlist' | 'cancelled';
}

export interface MediaFile {
  cloudinaryId: string;
  url: string;
  alt: string;
  width?: number;
  height?: number;
  type: 'image' | 'video';
}

export interface SEOData {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'admin' | 'editor' | 'viewer';
  permissions: string[];
  createdAt: Date;
  lastLogin?: Date;
  active: boolean;
}
```

---

## Phase 2: Admin Interface (Week 2)

### Day 1-2: Authentication & Dashboard

#### 2.1 Authentication Setup

**`src/lib/auth.ts`:**
```typescript
import { auth } from './firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { adminDb } from './firebase/admin';

export async function getUserRole(uid: string) {
  const userDoc = await adminDb.collection('users').doc(uid).get();
  return userDoc.data()?.role || 'viewer';
}

export function subscribeToAuth(callback: (user: any) => void) {
  return onAuthStateChanged(auth, callback);
}
```

**`src/app/(auth)/login/page.tsx`:**
```typescript
'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleLogin} className="space-y-4 w-96">
        <h1 className="text-2xl font-bold">Ginger & Co. CMS</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
        />
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" className="w-full bg-gold text-white py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}
```

#### 2.2 Admin Dashboard

**`src/app/(admin)/dashboard/page.tsx`:**
```typescript
'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalRegistrations: 0,
    totalRevenue: 0,
    conversionRate: 0,
  });

  useEffect(() => {
    async function fetchStats() {
      const eventsSnap = await getDocs(collection(db, 'events'));
      const registrationsSnap = await getDocs(collection(db, 'registrations'));

      const totalRevenue = registrationsSnap.docs.reduce((sum, doc) => {
        return sum + (doc.data().paymentInfo?.amount || 0);
      }, 0);

      setStats({
        totalEvents: eventsSnap.size,
        totalRegistrations: registrationsSnap.size,
        totalRevenue,
        conversionRate: 0.029,
      });
    }

    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Events" value={stats.totalEvents} />
        <StatCard title="Total Registrations" value={stats.totalRegistrations} />
        <StatCard title="Total Revenue" value={`€${stats.totalRevenue}`} />
        <StatCard title="Conversion Rate" value={`${(stats.conversionRate * 100).toFixed(1)}%`} />
      </div>

      {/* Recent registrations, charts, etc. */}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-gray-600 text-sm font-semibold mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
```

### Day 3-4: Event & Form Management

#### 2.3 Event Manager

**`src/app/(admin)/events/page.tsx`:**
```typescript
'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      const snap = await getDocs(collection(db, 'events'));
      setEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }
    fetchEvents();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Events</h1>
        <Link href="/admin/events/new" className="bg-gold text-white px-4 py-2 rounded">
          + New Event
        </Link>
      </div>

      <div className="space-y-4">
        {events.map(event => (
          <div key={event.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{event.title}</h3>
              <p className="text-sm text-gray-600">{event.dates?.eventDate}</p>
            </div>
            <div className="space-x-2">
              <Link href={`/admin/events/${event.id}`} className="px-4 py-2 bg-blue-500 text-white rounded">
                Edit
              </Link>
              <button className="px-4 py-2 bg-red-500 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Phase 3: Data Migration (Week 3)

### 3.1 Export HTML to Firestore

**Script to parse HTML and create event documents:**
```typescript
// scripts/migrateContent.ts
import { adminDb } from '../src/lib/firebase/admin';

async function migrateEvents() {
  // Parse current event details from HTML
  // Map to Firestore Event structure

  const eventData = {
    title: 'Afrobeats Indoor Cycling: Vienna Takeover 2025',
    slug: 'afrobeats-cycling-vienna-2025',
    description: '...',
    status: 'published',
    dates: {
      eventDate: '2025-12-06',
      eventTime: '13:00',
      startDate: new Date('2025-12-06'),
      endDate: new Date('2025-12-06'),
    },
    sessions: [
      {
        sessionId: 'session_1',
        title: 'Session 1',
        startTime: '14:00',
        endTime: '15:00',
        type: 'cycling',
        price: { amount: 55, currency: 'EUR', isFree: false },
        capacity: 100,
        registrationCount: 0,
        waitlistCount: 0,
      },
      // ... more sessions
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    publishedAt: new Date(),
  };

  await adminDb.collection('events').doc('vienna-2025').set(eventData);
  console.log('Migration complete!');
}

migrateEvents().catch(console.error);
```

### 3.2 Migrate Registration History

```typescript
// scripts/migrateRegistrations.ts
import { adminDb } from '../src/lib/firebase/admin';
import { encryptData } from '../src/lib/utils/encryption';

async function migrateRegistrations() {
  // Parse Google Sheets data
  // Encrypt sensitive fields
  // Write to Firestore

  const registrations = [
    {
      eventId: 'vienna-2025',
      sessionIds: ['session_1'],
      timestamp: new Date('2025-11-15'),
      personalInfo: {
        fullName: encryptData('John Doe'),
        email: encryptData('john@example.com'),
        phone: encryptData('+43123456'),
        location: encryptData('Vienna'),
      },
      groupSize: 1,
      consents: { /* ... */ },
      paymentInfo: { status: 'pending', amount: 55 },
      status: 'confirmed',
    },
    // ... more registrations
  ];

  for (const reg of registrations) {
    await adminDb.collection('registrations').add(reg);
  }

  console.log('Registrations migrated!');
}

migrateRegistrations().catch(console.error);
```

---

## Phase 4: Launch (Week 4)

### 4.1 Deploy to Netlify

```bash
# Connect repository to Netlify
# Build command: npm run build
# Publish directory: .next

# Deploy environment variables:
# All NEXT_PUBLIC_ and FIREBASE_ variables
```

### 4.2 Set Up DNS

```
Current: gingerandco.at → GitHub Pages
New: gingerandco.at → Netlify (cms subdomain as staging)

Steps:
1. Deploy to netlify.app (automatic)
2. Test functionality
3. Update DNS to point to Netlify
4. Keep GitHub Pages as backup
```

---

## Repo Cleanup

### Files to Delete

```bash
# Redundant HTML test files
rm download-index.html
rm download-events-final.html
rm test-form.html

# Consolidate setup guides into DOCS/ and delete old ones
rm RESEND_SETUP_GUIDE.md
rm RESEND_WORLD4YOU_SETUP.md
rm SESSION3_EMAIL_SETUP.md

# Keep only README.md in root
```

### Directory Structure After Cleanup

```
/home/user/Gingerco/
├── .git/
├── .github/
│   └── workflows/
├── DOCS/
│   ├── IMPLEMENTATION_PLAN.md (this file)
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── SETUP_GUIDE.md
│   ├── API_REFERENCE.md
│   └── MIGRATION_GUIDE.md
├── home/
│   └── index.html
├── events/
│   └── index.html
├── event/
│   └── index.html
├── cms/ (NEW - Next.js project)
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
├── 404.html
├── 410.html
├── CNAME
├── robots.txt
├── sitemap.xml
├── README.md (updated)
├── .gitignore (updated)
└── package.json (if needed for scripts)
```

---

## Technology Stack Details

### Frontend (Netlify)
- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Date handling**: date-fns
- **HTTP Client**: fetch (built-in)

### Backend (Firebase)
- **Database**: Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Serverless**: Cloud Functions
- **File Storage**: Cloud Storage
- **Email**: Resend API (via Cloud Functions)
- **Hosting**: Firebase (backend APIs)

### Development Tools
- **Language**: TypeScript
- **Git**: GitHub
- **Version Control**: Git workflow with feature branches
- **CI/CD**: GitHub Actions (optional) + Netlify Auto-deploy
- **Monitoring**: Firebase Console + Netlify Analytics

### Security & Compliance
- **Data Encryption**: TweetNaCl.js for sensitive fields
- **GDPR**: Data retention policies in Firestore rules
- **HTTPS**: Automatic with Netlify & Firebase
- **Backups**: Firebase automatic + manual exports

---

## Deployment Checklist

- [ ] Firebase project created and configured
- [ ] Firestore collections and security rules deployed
- [ ] Next.js project initialized with all dependencies
- [ ] Authentication system implemented and tested
- [ ] Admin dashboard functional
- [ ] Event manager working
- [ ] Form builder complete
- [ ] Analytics dashboard built
- [ ] Data migration scripts tested
- [ ] Historical data migrated
- [ ] Email templates configured
- [ ] Netlify deployment configured
- [ ] DNS testing (staging subdomain)
- [ ] Security audit completed
- [ ] GDPR compliance verified
- [ ] Performance testing done
- [ ] Production DNS cutover
- [ ] Monitoring and alerting set up

---

## Support & Documentation

- Firebase Documentation: https://firebase.google.com/docs
- Next.js Documentation: https://nextjs.org/docs
- Netlify Documentation: https://docs.netlify.com
- Firestore Best Practices: https://firebase.google.com/docs/firestore/best-practices
- TypeScript Handbook: https://www.typescriptlang.org/docs/

---

**Document Version**: 1.0
**Last Updated**: 2026-02-06
**Next Review**: After Phase 1 completion

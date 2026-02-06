# Ginger & Co. - Headless CMS Project

Vienna-based Afrobeats fitness company transitioning from static website to a modern headless CMS powered by Supabase + Next.js.

## Project Status

**Phase**: Planning & Architecture (Complete) ✓
**Current Tech**: Static HTML site on GitHub Pages
**Target Tech**: Supabase (PostgreSQL) + Next.js + Vercel
**Timeline**: 4 weeks to MVP
**Cost**: €20-50/month

---

## Repository Structure

```
├── DOCS/                              # CMS Implementation Documentation ⭐
│   ├── CMS_IMPLEMENTATION_PLAN.md     # 4-week roadmap with code examples
│   ├── CMS_ARCHITECTURE.md            # System design & data flows
│   └── CMS_DATABASE_SCHEMA.md         # PostgreSQL schema & RLS policies
│
├── public/                             # Current Static Website (GitHub Pages)
│   ├── index.html, events.html
│   ├── home/, events/, event/          # Directory structure
│   └── 404.html, 410.html
│
├── cms/                                # Next.js CMS App (Phase 1)
│   ├── src/, public/, package.json
│   └── (Created during implementation)
│
├── .gitignore, README.md
├── CNAME, robots.txt, sitemap.xml
└── (Cleaned up: removed duplicate Firebase docs, test files, old guides)
```

---

## 📚 Documentation (Start Here!)

### 1. **`DOCS/CMS_IMPLEMENTATION_PLAN.md`** - START HERE
Complete 4-week phased roadmap with code examples:
- Week 1: Foundation (Supabase setup, schema, auth)
- Week 2: Admin interface (dashboard, event manager, forms)
- Week 3: Data migration (HTML → Firestore, Google Sheets → registrations)
- Week 4: Launch (deploy, DNS, monitoring)

### 2. **`DOCS/CMS_ARCHITECTURE.md`**
System design deep-dive:
- Architecture diagrams
- Data flow (registration, analytics, admin actions)
- Component structure
- API endpoints
- Real-time subscriptions
- Error handling & monitoring

### 3. **`DOCS/CMS_DATABASE_SCHEMA.md`**
PostgreSQL reference manual:
- 13 table definitions with all fields & constraints
- Row-Level Security (RLS) policies
- Indexes for performance
- PostgreSQL functions for analytics
- Common query examples
- Encryption strategy for sensitive data

---

## Why Supabase + PostgreSQL?

### Comparison

| Feature | Firebase | Supabase | Winner |
|---------|----------|----------|--------|
| **Real-time** | ✓ | ✓ | Tie |
| **Analytics** | Code aggregation | ✓ SQL queries | **Supabase** |
| **Reports** | 3-4 queries + code | 1 SQL query | **Supabase** |
| **Event Automation** | Cloud Functions | Webhooks + pg_cron | **Supabase** |
| **Cost** | €20-50/mo | €20-50/mo | Tie |

### Example: Get Event Revenue by Session

**Firebase** ❌
```typescript
// 1. Fetch all registrations
// 2. Filter by event
// 3. Aggregate in JavaScript
// 4. Manual calculation
```

**Supabase** ✅
```sql
SELECT session_id, SUM(payment_amount) as revenue
FROM registrations WHERE event_id = $1
GROUP BY session_id;  -- Single query!
```

---

## Tech Stack

### Frontend
- Next.js 14+ (React + TypeScript)
- Tailwind CSS, React Hook Form, Recharts

### Backend
- **Supabase** (Managed PostgreSQL)
- PostgreSQL 15+ with native extensions
- Row-Level Security (RLS) for authorization
- PostgreSQL Functions for complex logic
- pg_cron for scheduled jobs
- Webhooks for automation

### Hosting
- **Vercel** - Next.js frontend (free Hobby plan)
- **Supabase** - PostgreSQL backend (€0-30/month)
- **Cloudinary** - Media CDN (unchanged)
- **Resend** - Email service (€0-20/month)

---

## Database Schema (13 Tables)

1. **pages** - CMS pages (home, about, contact, etc.)
2. **events** - Event details & configuration
3. **sessions** - Sessions with pricing & capacity
4. **registrations** - Registrations (encrypted PII + analytics)
5. **submissions** - Form submissions
6. **forms** - Form templates
7. **analytics_events** - User interaction tracking
8. **users** - Admin user management
9. **audit_logs** - Admin action history
10. **email_logs** - Email delivery tracking
11. **media** - Media library metadata
12. **settings** - Global configuration
13. **session_registration_counts** - Real-time counters

**Key Features**:
- ✓ Encrypted PII (full_name, email, phone)
- ✓ Real-time capacity tracking
- ✓ SQL functions for analytics
- ✓ Row-Level Security for access control
- ✓ Audit trail for compliance

---

## Quick Implementation Guide

### Phase 1: Foundation (Week 1)
```bash
# 1. Create Supabase project
# Visit https://supabase.com → New Project → Europe region

# 2. Initialize Next.js app
npx create-next-app@latest cms --typescript --tailwind --app
cd cms

# 3. Install Supabase client
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# 4. Configure environment
cp .env.example .env.local
# Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 5. Create PostgreSQL schema
# Copy SQL from DOCS/CMS_DATABASE_SCHEMA.md
# Run in Supabase SQL Editor
```

### Phase 2-4: Follow Documentation
See **`DOCS/CMS_IMPLEMENTATION_PLAN.md`** for detailed week-by-week guide

---

## Current Site → CMS Features

### Current (Static Site)
- ✓ Event information pages
- ✓ Registration forms (Google Apps Script)
- ✓ Event tracking (Google Sheets)
- ✓ Responsive design
- ✓ SEO optimized

### New CMS Adds
- ✓ Admin dashboard for content management
- ✓ Create/edit pages without coding
- ✓ Real-time capacity tracking
- ✓ Analytics dashboard (funnel, revenue, fill rate)
- ✓ No-code form builder
- ✓ User role management
- ✓ Audit logging
- ✓ Data encryption for privacy

---

## Cost Analysis

### Monthly Recurring
| Service | Cost | Notes |
|---------|------|-------|
| Vercel | €0-20 | Pro tier if needed |
| Supabase | €0-30 | Scales with usage |
| Resend | €0-20 | Free: 3,000 emails/month |
| Cloudinary | Current | No change |
| **TOTAL** | **€20-50** | |

### Comparison
- **Contentful/Sanity**: €99-300+/month ❌
- **Self-hosted Strapi**: €30-50/month + DevOps overhead ⚠️
- **Supabase + Next.js**: €20-50/month ✅ **BEST CHOICE**

---

## File Changes in This Cleanup

### ✅ Kept
- `public/` - Current static site (all HTML pages)
- `DOCS/CMS_*` - Supabase implementation docs
- `README.md`, `.gitignore`, `CNAME`

### ❌ Removed
- Firebase docs (Firebase version - replaced by Supabase)
- Old setup guides (RESEND_*.md, SESSION3_*.md)
- Test files (download-*.html, test-form.html)
- Empty directories (home/, events/, event/)

### 📁 Reorganized
- Moved `index.html` → `public/index.html`
- Moved subdirectories → `public/home/`, `public/events/`, etc.
- Created `DOCS/` folder for all CMS documentation
- Added `.gitignore` for cleaner version control

---

## Getting Started

### 1. Read Documentation
```bash
# Start with the implementation plan
cat DOCS/CMS_IMPLEMENTATION_PLAN.md

# Then architecture
cat DOCS/CMS_ARCHITECTURE.md

# Then database schema
cat DOCS/CMS_DATABASE_SCHEMA.md
```

### 2. Set Up Supabase
- Visit https://supabase.com
- Create project "gingerco-cms"
- Choose Europe region
- Get API keys from Settings → API

### 3. Initialize Next.js
```bash
mkdir cms
npx create-next-app@latest cms --typescript --tailwind --app
cd cms && npm install @supabase/supabase-js
```

### 4. Follow Phase 1
See `DOCS/CMS_IMPLEMENTATION_PLAN.md` for detailed step-by-step guide

---

## Important Links

- **Supabase**: https://supabase.com/docs
- **Next.js**: https://nextjs.org/docs
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Vercel**: https://vercel.com/docs

---

## Project Info

**Project**: Ginger & Co. Headless CMS
**Company**: Ginger & Co. (Vienna)
**Website**: https://gingerandco.at
**Created**: 2026-02-06
**Status**: ✅ Planning Complete - Ready for Phase 1

---

**Questions?** Refer to the comprehensive documentation in `DOCS/` folder.
**Ready to build?** Start with Phase 1 in `DOCS/CMS_IMPLEMENTATION_PLAN.md`

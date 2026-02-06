# Ginger & Co. - Headless CMS

Vienna-based Afrobeats fitness company. This repository contains the CMS that manages the [gingerandco.at](https://gingerandco.at) website.

## Tech Stack

- **CMS**: [Payload CMS 3](https://payloadcms.com) (open-source, built on Next.js)
- **Framework**: Next.js 15 + React 19 + TypeScript
- **Database**: PostgreSQL (via Supabase or Vercel Postgres)
- **Media**: Vercel Blob Storage (or local filesystem in dev)
- **Hosting**: Vercel
- **Cost**: Free tier covers all current needs

---

## Repository Structure

```
Gingerco-cms/
├── cms/                           # Payload CMS application
│   ├── payload.config.ts          # Central CMS configuration
│   ├── src/
│   │   ├── app/
│   │   │   ├── (payload)/         # Admin panel + REST API (auto-generated)
│   │   │   └── (frontend)/        # Public website pages
│   │   ├── collections/           # Data models (Pages, Events, Media, Users)
│   │   ├── blocks/                # Page builder blocks (Hero, Content, Gallery, etc.)
│   │   └── globals/               # Site-wide settings (Header, Footer, SiteSettings)
│   ├── VERCEL_DEPLOYMENT.md       # Deployment guide
│   └── .env.example               # Environment variable template
│
├── DOCS/                          # Architecture documentation (reference)
│   ├── CMS_IMPLEMENTATION_PLAN.md
│   ├── CMS_ARCHITECTURE.md
│   └── CMS_DATABASE_SCHEMA.md
│
├── public/                        # Current static website (GitHub Pages)
│   ├── index.html, events.html
│   └── home/, events/, event/
│
└── _reference/                    # Archived SQL migrations from earlier phases
```

---

## What the CMS Does

The admin panel at `/admin` lets you:

- **Manage pages** -- create, edit, and publish pages using a block-based editor (Hero, Content, Gallery, Events List, CTA, FAQ, Forms)
- **Manage events** -- create events with sessions, pricing, capacity, registration forms, and recurring schedules
- **Build forms** -- drag-and-drop form builder for registration and contact forms
- **Upload media** -- image library with automatic resizing
- **Configure navigation** -- header nav, footer links, social links
- **Control site settings** -- site name, contact info, SEO defaults

The public website reads content from the CMS and renders it at `gingerandco.at`.

---

## Quick Start

### Prerequisites

- Node.js 20.9+
- PostgreSQL database (Supabase project or local)

### Setup

```bash
cd cms
cp .env.example .env

# Fill in DATABASE_URL and PAYLOAD_SECRET in .env

npm install
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the admin panel. You'll be prompted to create your first admin user.

---

## Deployment

See **[cms/VERCEL_DEPLOYMENT.md](./cms/VERCEL_DEPLOYMENT.md)** for the full deployment guide.

Quick version:
1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Set root directory to `cms`
3. Add environment variables (`DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`)
4. Deploy

---

## Collections

| Collection | Purpose |
|-----------|---------|
| **Pages** | Site pages built with content blocks |
| **Events** | Fitness classes, workshops, performances |
| **Media** | Images with auto-generated sizes |
| **Users** | Admin users with role-based access |
| **Forms** | Dynamic forms (via plugin) |
| **Form Submissions** | Submitted form data (via plugin) |

## Page Blocks

| Block | Purpose |
|-------|---------|
| Hero | Full-width hero section with image, heading, CTA buttons |
| Content | Rich text with layout options (full, two-column, text+image) |
| Events List | Displays upcoming events (filterable by type) |
| Gallery | Image gallery with configurable columns |
| Call to Action | CTA section with buttons and optional background |
| FAQ | Accordion-style questions and answers |
| Form | Embeds a form from the form builder |

## Globals

| Global | Purpose |
|--------|---------|
| Header | Logo and navigation links |
| Footer | Footer columns, copyright, social links |
| Site Settings | Site name, contact info, SEO defaults, analytics ID |

---

## Cost

| Service | Cost | Notes |
|---------|------|-------|
| Vercel | Free | Hobby plan |
| PostgreSQL (Supabase) | Free-€25/mo | Free tier: 500MB |
| Vercel Blob | Free-€5/mo | Free tier: 250MB |
| **Total** | **€0-30/mo** | |

---

## Links

- **Payload CMS**: https://payloadcms.com/docs
- **Next.js**: https://nextjs.org/docs
- **Vercel**: https://vercel.com/docs
- **Supabase**: https://supabase.com/docs

---

**Project**: Ginger & Co. Headless CMS
**Company**: Ginger & Co. (Vienna)
**Website**: https://gingerandco.at

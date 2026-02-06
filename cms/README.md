# Gingerco CMS

A complete headless CMS built with Next.js 14, Supabase, and Tailwind CSS.

## 📋 Project Overview

**Status**: Phase 2 Foundation Complete

**Tech Stack**:
- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Backend**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts (for analytics)
- **Hosting**: Vercel (frontend) + Supabase (backend)

**Cost**: €20-50/month (free tier covers needs)

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase project (see PHASE_1_SETUP_GUIDE.md)
- .env.local file with Supabase credentials

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📚 Documentation

### Setup & Guides
- **[PHASE_1_SETUP_GUIDE.md](./PHASE_1_SETUP_GUIDE.md)** - Database setup and initial configuration
- **[PHASE_2_SETUP_GUIDE.md](./PHASE_2_SETUP_GUIDE.md)** - Authentication and admin interface setup
- **[PHASE_2_PLAN.md](./PHASE_2_PLAN.md)** - Detailed implementation roadmap

### Project Documentation (Root)
- `DOCS/CMS_IMPLEMENTATION_PLAN.md` - Full 4-week implementation plan
- `DOCS/CMS_ARCHITECTURE.md` - System architecture and data flows
- `DOCS/CMS_DATABASE_SCHEMA.md` - PostgreSQL schema documentation

---

## 📁 Project Structure

```
cms/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/               # Authentication routes
│   │   │   ├── layout.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   │   ├── admin/                # Admin dashboard routes
│   │   │   ├── layout.tsx        # Sidebar + header
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   ├── events/           # TODO: Phase 2 Week 2
│   │   │   ├── registrations/    # TODO: Phase 2 Week 2
│   │   │   ├── forms/            # TODO: Phase 2 Week 2
│   │   │   ├── analytics/        # TODO: Phase 2 Week 2
│   │   │   └── settings/         # TODO: Phase 2 Week 2
│   │   ├── api/                  # API routes
│   │   │   └── auth/
│   │   │       └── logout/
│   │   │           └── route.ts
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home page
│   │   └── globals.css           # Global styles
│   └── lib/
│       ├── auth.ts               # Auth utilities
│       ├── hooks/
│       │   └── useAuth.ts        # useAuth hook
│       └── supabase/
│           ├── client.ts         # Browser client
│           └── server.ts         # Server-side client
├── migrations/                   # SQL migrations (Phase 1)
│   ├── 001_create_tables.sql
│   ├── 002_create_rls_policies.sql
│   └── 003_create_functions.sql
├── middleware.ts                 # Route protection
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.js               # Next.js config
├── tailwind.config.js           # Tailwind config
├── postcss.config.js            # PostCSS config
├── .gitignore                   # Git ignore rules
├── .env.example                 # Environment template (commit this)
└── README.md                    # This file
```

---

## 🔐 Environment Variables

Create `.env.local` (Git-ignored) with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

See `.env.example` for full list and documentation.

---

## 🔒 Authentication

### Login Flow
1. User enters email and password
2. Supabase Auth validates credentials
3. Session stored in HTTP-only cookies
4. User redirected to `/admin/dashboard`

### Protected Routes
- `/admin/*` - Requires authentication
- Public routes: `/`, `/login`

### User Roles
- **admin**: Full access
- **editor**: Can edit content (limited)
- **viewer**: Read-only access

---

## 📊 Database Schema

### 13 Tables
- `users` - Admin users
- `events` - Events/classes/workshops
- `sessions` - Time slots for events
- `registrations` - User registrations (encrypted PII)
- `pages` - CMS pages
- `forms` - Dynamic form configurations
- `submissions` - Form submissions
- `analytics_events` - Tracking events
- `audit_logs` - Admin action logs
- `email_logs` - Email delivery logs
- `settings` - App configuration
- `media` - Image/file metadata
- `session_registration_counts` - Real-time counters

See `migrations/` for complete schema and `DOCS/CMS_DATABASE_SCHEMA.md` for detailed docs.

---

## 🛣️ API Endpoints

### Authentication
- `GET /login` - Login page
- `POST /api/auth/logout` - Logout endpoint

### Admin Dashboard (Protected)
- `GET /admin/dashboard` - Stats and overview
- `GET /admin/events` - Event list (TODO)
- `GET /admin/registrations` - Registration management (TODO)
- `GET /admin/forms` - Form builder (TODO)
- `GET /admin/analytics` - Analytics dashboard (TODO)

### Public API (TODO - Phase 3)
- `GET /api/events` - List published events
- `GET /api/events/:id/sessions` - Sessions for event
- `POST /api/registrations` - Submit registration
- `POST /api/forms/:id/submissions` - Submit form

---

## 🎯 Phase Status

### ✅ Phase 1 - Foundation (Complete)
- [x] Supabase project setup
- [x] PostgreSQL schema (13 tables)
- [x] Row-Level Security policies
- [x] PostgreSQL functions for analytics
- [x] Environment configuration

### ✅ Phase 2 - Authentication & Admin UI (In Progress)

**Foundation Complete** (Days 1-2):
- [x] Authentication system (login/logout)
- [x] Session management with SSR
- [x] Admin layout with sidebar
- [x] Real-time dashboard
- [x] Route protection via middleware
- [x] User menu and logout

**To Complete** (Days 3-5):
- [ ] Event CRUD interface
- [ ] Form builder UI
- [ ] Registrations management
- [ ] Analytics dashboard with charts
- [ ] Settings page

### ⏳ Phase 3 - Public Interface & Features
- [ ] Public event listing
- [ ] Registration forms
- [ ] Email confirmations
- [ ] Payment integration (Stripe)

### ⏳ Phase 4 - Production Launch
- [ ] Deploy to Vercel
- [ ] DNS configuration
- [ ] Monitoring and logging
- [ ] Performance optimization

---

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server on port 3000
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Utilities
npm run type-check      # Check TypeScript without emitting
```

---

## 🧪 Testing

### Manual Testing Checklist
1. [ ] Home page loads
2. [ ] Login page accepts valid credentials
3. [ ] Dashboard shows real-time stats
4. [ ] Sidebar navigation works
5. [ ] Logout redirects to login
6. [ ] Unauthenticated users can't access /admin

### Automated Testing (TODO - Phase 2 Week 2)
```bash
# Jest + React Testing Library
npm run test
npm run test:watch
npm run test:coverage
```

---

## 🚢 Deployment

### Vercel Deployment

1. **Connect Repository**
   - Push to GitHub/GitLab
   - Import project at vercel.com/new

2. **Build Configuration**
   - Framework: Next.js (auto-detected)
   - Root Directory: `cms`
   - Build command: `npm run build` (auto-detected)

3. **Environment Variables**
   - Add during import or in Settings > Environment Variables
   - Add all variables from `.env.example`

4. **Deploy**
   ```bash
   # Pushes trigger automatic deployments
   git push origin main
   ```

See `VERCEL_DEPLOYMENT.md` for the full step-by-step guide.

---

## 🤝 Contributing

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting (TODO)
- Tailwind CSS for styling

### Pull Request Process
1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test locally: `npm run dev`
4. Type check: `npm run type-check`
5. Commit with clear message
6. Push and create PR

---

## 📖 Resources

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Hook Form**: https://react-hook-form.com
- **TypeScript**: https://www.typescriptlang.org/docs

---

## 🐛 Troubleshooting

### Development Server Won't Start
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules
npm install

# Start again
npm run dev
```

### Supabase Connection Issues
- Verify `.env.local` exists in `cms/` folder (not root)
- Check Supabase project is active
- Verify API keys haven't been rotated
- Check network connectivity

### Authentication Not Working
- Ensure admin user exists in Supabase Console
- Verify email and password are correct
- Check browser cookies are enabled
- Clear browser cache and try again

See `PHASE_2_SETUP_GUIDE.md` for detailed troubleshooting.

---

## 📄 License

Internal project for Gingerco. All rights reserved.

---

## 📞 Support

For questions or issues:
1. Check `PHASE_1_SETUP_GUIDE.md` and `PHASE_2_SETUP_GUIDE.md`
2. Review `DOCS/` folder documentation
3. Check GitHub issues
4. Contact project maintainer

---

**Last Updated**: February 2025
**Next Review**: After Phase 2 completion

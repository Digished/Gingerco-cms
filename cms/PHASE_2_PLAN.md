# Phase 2: Admin Interface Implementation Plan

**Duration**: 1-2 weeks of focused development
**Goal**: Build complete admin dashboard with authentication, event management, and analytics
**Tech**: Next.js + TypeScript + Tailwind CSS + Supabase + Recharts

---

## Overview

### Week 1: Authentication & Dashboard Foundation
- ✅ Authentication system (login/logout)
- ✅ Protected routes & middleware
- ✅ Admin layout & navigation
- ✅ Real-time dashboard with stats
- ✅ Realtime subscriptions

### Week 2: Features & Polish
- ✅ Event manager (CRUD)
- ✅ Form builder interface
- ✅ Analytics dashboard
- ✅ Settings management
- ✅ Deployment & testing

---

## Project Structure

```
cms/src/
├── app/
│   ├── (auth)/                    # Auth pages (public)
│   │   ├── login/page.tsx
│   │   └── callback/route.ts
│   │
│   ├── (admin)/                   # Protected admin routes
│   │   ├── layout.tsx             # Admin sidebar + nav
│   │   ├── dashboard/page.tsx     # Main dashboard
│   │   ├── events/
│   │   │   ├── page.tsx           # Events list
│   │   │   ├── [id]/page.tsx      # Event detail
│   │   │   └── [id]/edit/page.tsx # Event editor
│   │   ├── forms/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── submissions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── media/page.tsx
│   │   ├── settings/page.tsx
│   │   └── users/page.tsx
│   │
│   ├── (public)/                  # Public pages
│   │   ├── page.tsx               # Home
│   │   ├── events/page.tsx        # Event listing
│   │   └── events/[slug]/page.tsx # Event detail
│   │
│   └── api/
│       ├── auth/
│       │   ├── login/route.ts
│       │   └── logout/route.ts
│       ├── webhooks/
│       │   └── submissions/route.ts
│       └── health/route.ts
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── database/
│   │   ├── events.ts
│   │   ├── registrations.ts
│   │   ├── analytics.ts
│   │   └── users.ts
│   ├── auth.ts
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useEvents.ts
│   │   ├── useAnalytics.ts
│   │   └── useRealtime.ts
│   └── utils/
│       ├── formatting.ts
│       └── validation.ts
│
└── components/
    ├── admin/
    │   ├── AdminLayout.tsx
    │   ├── Sidebar.tsx
    │   ├── TopNav.tsx
    │   ├── DashboardStats.tsx
    │   ├── EventManager.tsx
    │   ├── FormBuilder.tsx
    │   ├── AnalyticsDashboard.tsx
    │   └── SubmissionViewer.tsx
    ├── common/
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   ├── Modal.tsx
    │   ├── Card.tsx
    │   ├── LoadingSpinner.tsx
    │   └── ErrorMessage.tsx
    └── forms/
        └── LoginForm.tsx
```

---

## Week 1: Foundation (Days 1-5)

### Day 1-2: Authentication System

**Goal**: Users can log in and access protected admin pages

**Components to build**:
1. Login page (`app/(auth)/login/page.tsx`)
2. Logout functionality
3. Auth middleware for protected routes
4. useAuth hook for auth state

**Key files**:
- `lib/auth.ts` - Auth utilities
- `lib/hooks/useAuth.ts` - Auth hook
- `app/(auth)/login/page.tsx` - Login page
- `middleware.ts` - Route protection

**Implementation steps**:
```
1. Create login page with form
2. Implement Supabase email/password auth
3. Store session in cookies
4. Create middleware to protect routes
5. Add logout endpoint
6. Create useAuth hook for components
```

### Day 3: Admin Layout

**Goal**: Consistent layout for all admin pages

**Components to build**:
1. Sidebar navigation
2. Top navigation bar
3. Admin layout wrapper
4. Theme switcher (optional)

**Key files**:
- `app/(admin)/layout.tsx` - Admin wrapper
- `components/admin/Sidebar.tsx`
- `components/admin/TopNav.tsx`

**Features**:
- Navigation menu
- User dropdown
- Logout button
- Responsive design

### Day 4-5: Dashboard with Real-time Stats

**Goal**: Live dashboard showing key metrics

**Components to build**:
1. Stats cards (registrations, revenue, etc.)
2. Recent submissions table
3. Session capacity chart
4. Real-time data subscription

**Key files**:
- `app/(admin)/dashboard/page.tsx`
- `components/admin/DashboardStats.tsx`
- `lib/hooks/useAnalytics.ts`

**Real-time features**:
- Subscribe to registration changes
- Live stat updates
- Automatic refresh on data change

---

## Week 2: Features & Polish (Days 6-10)

### Day 6-7: Event Manager

**Goal**: Full CRUD for events

**Pages to build**:
1. Events list with search/filter
2. Create event form
3. Edit event form
4. Event detail view

**Features**:
- Create/edit/delete events
- Publish/unpublish events
- Session management
- Event preview

### Day 8: Form Builder

**Goal**: No-code form creation

**Pages to build**:
1. Forms list
2. Form builder interface
3. Form preview

**Features**:
- Drag-and-drop fields
- Field validation rules
- Email settings
- Webhook configuration

### Day 9: Analytics Dashboard

**Goal**: Visual analytics and reporting

**Visualizations**:
1. Revenue trend chart
2. Registration funnel
3. Session fill rates
4. Traffic sources

**Features**:
- Date range filtering
- Export to CSV
- Real-time updates
- Custom reports

### Day 10: Polish & Deploy

**Final tasks**:
- Error handling improvements
- Loading states
- Form validation
- Mobile responsiveness
- Deploy to Netlify

---

## Tech Stack Details

### Frontend
```
Next.js 14+ (App Router)
React 18+ (Hooks)
TypeScript
Tailwind CSS
React Hook Form + Zod
Recharts
date-fns
```

### Backend
```
Supabase Client SDK
PostgreSQL (created in Phase 1)
Row-Level Security
Real-time subscriptions
```

### Development
```
ESLint
Prettier
Next.js dev server
Supabase local CLI (optional)
```

---

## Key Components to Build

### 1. Authentication
- Login page
- Logout endpoint
- Session management
- Protected routes

### 2. Admin Layout
- Sidebar navigation
- Top bar with user menu
- Responsive drawer for mobile
- Active route highlighting

### 3. Dashboard
- Stats cards (real-time)
- Charts (Recharts)
- Recent activity
- Quick actions

### 4. Event Manager
- Event list with table
- Create form modal
- Edit form modal
- Delete confirmation

### 5. Form Builder
- Field type selector
- Drag-and-drop reordering
- Field settings panel
- Email template editor

### 6. Analytics
- Revenue chart
- Registration funnel
- Session capacity
- Traffic breakdown

### 7. Settings
- Site configuration
- Email settings
- Payment settings
- User management

---

## Database Integration

### Real-time Subscriptions
```typescript
// Subscribe to registrations
supabase
  .channel('registrations')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'registrations'
  }, (payload) => {
    // Update dashboard stats
  })
  .subscribe()
```

### API Queries
```typescript
// Fetch events
const { data: events } = await supabase
  .from('events')
  .select('*, sessions(*)')
  .eq('status', 'published')

// Call analytics function
const { data: stats } = await supabase
  .rpc('get_event_analytics', {
    event_id_param: eventId
  })
```

---

## Security Considerations

1. **Route Protection**: Only authenticated admins can access /admin
2. **RLS Policies**: Database enforces access control
3. **CSRF Protection**: Next.js middleware handles CSRF tokens
4. **Input Validation**: Zod validates all form inputs
5. **Error Handling**: No sensitive info in error messages
6. **Session Management**: Secure cookie-based sessions

---

## Testing Strategy

### Unit Tests
- Utility functions
- Validation logic
- Component logic

### Integration Tests
- Auth flow
- Database queries
- Real-time subscriptions

### E2E Tests (Optional)
- User login workflow
- Create event workflow
- View analytics

---

## Deployment Checklist

- [ ] All routes protected
- [ ] Environment variables set in Netlify
- [ ] Database RLS policies active
- [ ] Real-time subscriptions working
- [ ] Forms validated on client & server
- [ ] Error handling complete
- [ ] Loading states on all async operations
- [ ] Mobile responsive
- [ ] Images optimized
- [ ] Analytics tracking set up
- [ ] Security headers configured
- [ ] Rate limiting configured

---

## Common Challenges & Solutions

### Challenge 1: Real-time Updates Lag
**Solution**: Use Supabase Realtime with proper subscriptions and cleanup

### Challenge 2: Form State Management
**Solution**: Use React Hook Form + Zod for validation

### Challenge 3: Slow Analytics Queries
**Solution**: Use PostgreSQL functions (already created) instead of client-side aggregation

### Challenge 4: Authentication State Lost on Refresh
**Solution**: Store session in cookies via Supabase

### Challenge 5: Race Conditions in Updates
**Solution**: Use Optimistic updates + Supabase error handling

---

## Quick Start

```bash
# Navigate to project
cd /home/user/Gingerco/cms

# Ensure dev server is running
npm run dev

# Open http://localhost:3000
# Create login page first (Step 1)
```

---

## Success Metrics

By end of Phase 2, you should have:

✅ Working authentication system
✅ Protected admin dashboard
✅ Event CRUD operations
✅ Real-time stats dashboard
✅ Form builder interface
✅ Analytics visualization
✅ Settings management
✅ Deployed to Netlify
✅ Mobile responsive
✅ All tests passing

---

## Next Steps

**Ready to start?** Begin with **Day 1-2: Authentication System**

Follow along in the detailed implementation guide (next document).

---

**Document Version**: 1.0
**Last Updated**: 2026-02-06
**Status**: Ready for Implementation

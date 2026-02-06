# Phase 2 Setup Guide - Authentication & Admin Interface

**Objective**: Set up the complete authentication system and admin interface with real-time dashboard

**Time to Complete**: 1-2 hours

**Prerequisites**: Phase 1 complete with Supabase configured and .env.local working

---

## STEP 1: Install Dependencies (10 minutes)

```bash
cd /home/user/Gingerco/cms

# Install all npm dependencies
npm install
```

**Expected output**:
```
added XXX packages in XXs
```

This installs:
- Next.js 14 with React 18
- @supabase/ssr and @supabase/supabase-js
- Tailwind CSS and PostCSS
- React Hook Form and Zod for forms
- Recharts for analytics (ready for Phase 3)

---

## STEP 2: Verify Environment Configuration (5 minutes)

### 2.1 Check .env.local Exists

```bash
# From cms folder
cat .env.local
```

Should contain:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

If not found, follow **PHASE_1_SETUP_GUIDE.md Step 3** to create it.

### 2.2 Verify Admin User Exists

In Supabase Console:
1. Click **Authentication** > **Users**
2. Should see your admin user email listed ✅

---

## STEP 3: Start Development Server (5 minutes)

```bash
cd /home/user/Gingerco/cms

# Start Next.js development server
npm run dev
```

**Expected output**:
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:3000
  - Environments: .env.local

  ✓ Ready in 2.5s
```

Leave this running in a terminal window.

---

## STEP 4: Test Application Flow (15 minutes)

### 4.1 Test Home Page

Open browser: **http://localhost:3000**

You should see:
- Gingerco CMS landing page
- "Admin Login" button
- Nice gradient background

**Expected behavior**:
- If authenticated: Redirects to `/admin/dashboard`
- If not authenticated: Shows login button

### 4.2 Test Login Page

1. Click **Admin Login** button
2. Or go directly to: **http://localhost:3000/login**

You should see:
- Email input field
- Password input field
- Sign in button
- "Demo credentials" message

### 4.3 Test Login Functionality

1. Enter your admin email (from Phase 1)
2. Enter your admin password (from Phase 1)
3. Click **Sign in**

**Expected behavior**:
- ✅ Success message appears
- ✅ Redirected to `/admin/dashboard`
- ✅ Dashboard shows with sidebar and header

### 4.4 Test Admin Dashboard

Dashboard should show:
- **Stats Cards**: Total Events, Registrations, Sessions, Pending
- **Upcoming Events Table**: Shows published events
- **Quick Actions**: Create Event, View Registrations, Manage Forms

Try clicking:
- Different navigation items in sidebar (Dashboard, Events, Registrations, etc.)
- User menu in top right
- Logout button

### 4.5 Test Logout

1. Click **Logout** button in top right
2. Should redirect to login page
3. Try accessing `/admin/dashboard` directly
   - Should redirect to login page ✅

---

## STEP 5: Verify File Structure (5 minutes)

Check that all Phase 2 files exist:

```bash
# From cms folder
find src -type f -name "*.ts" -o -name "*.tsx" -o -name "*.css" | sort
```

Should show:
```
src/app/(auth)/layout.tsx
src/app/(auth)/login/page.tsx
src/app/admin/dashboard/page.tsx
src/app/admin/layout.tsx
src/app/api/auth/logout/route.ts
src/app/globals.css
src/app/layout.tsx
src/app/page.tsx
src/lib/auth.ts
src/lib/hooks/useAuth.ts
src/lib/supabase/client.ts
src/lib/supabase/server.ts
```

### Check Configuration Files

```bash
# Should exist:
# - next.config.js
# - tailwind.config.js
# - tsconfig.json
# - postcss.config.js
# - package.json
# - middleware.ts

ls -la | grep -E "next|tailwind|tsconfig|postcss|package|middleware"
```

---

## STEP 6: Test Real-time Updates (10 minutes)

### 6.1 Create a Test Event (in Supabase)

1. Go to [Supabase Console](https://supabase.com)
2. Open your project
3. Click **Table Editor**
4. Click **events** table
5. Click **Insert row**
6. Fill in:
   - name: "Test Event"
   - status: "published"
   - start_date: Tomorrow's date
   - capacity: 50
7. Click **Save**

### 6.2 Watch Dashboard Update

1. Go back to browser (http://localhost:3000/admin/dashboard)
2. Watch for real-time updates:
   - Total Events count increases
   - New event appears in Upcoming Events table
   - This happens automatically via Supabase subscriptions ✅

---

## STEP 7: Check Browser Console (5 minutes)

### 7.1 Open Dev Tools

Press **F12** or **Cmd+Option+I** in browser

### 7.2 Check Console Tab

Should see:
- ✅ No errors
- ✅ No authentication warnings
- ✅ Supabase connection logs (if debug mode enabled)

**Fix any errors**:
- Check .env.local is correct
- Verify Supabase credentials
- Ensure admin user exists

### 7.3 Check Network Tab

When dashboard loads:
- ✅ Request to `/admin/dashboard` (200 status)
- ✅ Requests to Supabase for event data
- ✅ WebSocket connection for real-time updates (visible in Network tab)

---

## STEP 8: Verify Authentication Security (10 minutes)

### 8.1 Test Route Protection

1. Log out (click Logout)
2. Try to access `/admin/dashboard` directly in URL bar
3. Should redirect to `/login` ✅

### 8.2 Test Session Persistence

1. Log in successfully
2. Refresh the page (Cmd+R or Ctrl+R)
3. Should remain logged in ✅
4. Session persists due to Supabase SSR + cookies

### 8.3 Test Multiple Tabs

1. Open `/admin/dashboard` in one tab
2. Open another tab with same dashboard
3. Log out in one tab
4. Other tab should detect logout within a few seconds
5. Refresh other tab - redirects to login ✅

---

## STEP 9: TypeScript Type Checking (5 minutes)

```bash
cd /home/user/Gingerco/cms

# Check TypeScript compilation
npm run type-check
```

**Expected output**:
```
✓ No TypeScript errors
```

If errors appear:
- Review error messages
- Check file at indicated line
- Most commonly: missing imports or type mismatches

---

## STEP 10: Build for Production (5 minutes)

```bash
cd /home/user/Gingerco/cms

# Build Next.js application
npm run build
```

**Expected output**:
```
✓ Compiled successfully
✓ All routes ready for production
```

**What happens**:
- Minifies JavaScript
- Optimizes CSS
- Pre-renders static pages
- Checks for errors
- Creates `.next` folder with production build

---

## TROUBLESHOOTING

### Problem: "Cannot find module '@supabase/ssr'"
**Solution**: Run `npm install` again to ensure all packages are installed

### Problem: "NEXT_PUBLIC_SUPABASE_URL is not defined"
**Solution**: Check .env.local exists in cms folder (not root folder)
```bash
cat /home/user/Gingerco/cms/.env.local
```

### Problem: Login doesn't work / "Incorrect credentials"
**Solution**:
1. Verify admin user exists in Supabase Console > Authentication > Users
2. Check email and password are correct
3. Try resetting password in Supabase Console

### Problem: Dashboard loads but no data appears
**Solution**:
1. Check browser console (F12) for errors
2. In Supabase Console, verify events table has data
3. Check RLS policies allow reading (should see published events)
4. Try refreshing the page

### Problem: "middleware.ts causes 404 errors"
**Solution**: This is normal during development
1. Clear browser cache
2. Restart dev server: `npm run dev`
3. Hard refresh: Cmd+Shift+R or Ctrl+Shift+R

### Problem: Tailwind CSS not applying
**Solution**:
1. Verify `globals.css` imports Tailwind directives
2. Restart dev server
3. Clear `.next` folder: `rm -rf .next`
4. Run `npm run dev` again

---

## PHASE 2 COMPONENTS CREATED

### Supabase Clients
- `src/lib/supabase/server.ts` - Server-side client for API routes
- `src/lib/supabase/client.ts` - Browser client for components

### Authentication
- `src/lib/auth.ts` - Auth utility functions (login, logout, role checking)
- `src/lib/hooks/useAuth.ts` - React hook for auth state

### Pages & Routes
- `src/app/page.tsx` - Public home page
- `src/app/(auth)/login/page.tsx` - Login page with form
- `src/app/admin/dashboard/page.tsx` - Admin dashboard with stats

### Layouts
- `src/app/layout.tsx` - Root layout
- `src/app/(auth)/layout.tsx` - Auth pages layout
- `src/app/admin/layout.tsx` - Admin layout with sidebar

### API Routes
- `src/app/api/auth/logout/route.ts` - Logout endpoint

### Configuration
- `middleware.ts` - Route protection
- `tsconfig.json` - TypeScript config
- `next.config.js` - Next.js config
- `tailwind.config.js` - Tailwind CSS config
- `postcss.config.js` - PostCSS config
- `package.json` - Dependencies

---

## ✅ PHASE 2 FOUNDATION COMPLETE CHECKLIST

- [ ] Dependencies installed (`npm install` completed)
- [ ] .env.local configured with Supabase credentials
- [ ] Development server running (`npm run dev`)
- [ ] Home page loads at http://localhost:3000
- [ ] Login page accessible and working
- [ ] Successfully logged in to admin dashboard
- [ ] Dashboard loads with stats cards and upcoming events
- [ ] Real-time updates work (created test event, saw dashboard update)
- [ ] Logout functionality works
- [ ] Route protection works (unauthenticated users redirect to login)
- [ ] Session persists on page refresh
- [ ] TypeScript type checking passes
- [ ] Production build completes successfully

---

## NEXT PHASE

After completing Phase 2 Foundation, proceed to:

### Phase 2 Features (Days 3-5)

1. **Event CRUD Interface** (`src/app/admin/events/`)
   - List events with filters and sorting
   - Create new events (form)
   - Edit existing events
   - Delete events
   - Publish/unpublish status toggle

2. **Form Builder** (`src/app/admin/forms/`)
   - List forms
   - Create form with drag-drop fields
   - Edit form configuration
   - Preview form
   - Export form data

3. **Registrations Management** (`src/app/admin/registrations/`)
   - View registrations in table
   - Filter by event, status, date
   - Export to CSV
   - Approve/reject registrations

4. **Analytics Dashboard** (`src/app/admin/analytics/`)
   - Charts and graphs (Recharts)
   - Conversion funnel
   - Revenue metrics
   - Real-time counters

See: `PHASE_2_PLAN.md` for detailed implementation roadmap

---

## QUICK COMMANDS REFERENCE

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production
npm run start           # Start production build
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript

# Cleanup
rm -rf .next            # Clear Next.js cache
rm -rf node_modules     # Remove dependencies (then npm install)

# Database
# Run SQL in Supabase Console > SQL Editor
```

---

## RESOURCES

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Hook Form**: https://react-hook-form.com
- **TypeScript**: https://www.typescriptlang.org/docs

---

**Phase 2 Foundation Complete!** 🎉

You now have:
- ✅ Secure authentication system
- ✅ Protected admin interface
- ✅ Real-time dashboard
- ✅ Production-ready configuration

Ready to continue with Phase 2 features!

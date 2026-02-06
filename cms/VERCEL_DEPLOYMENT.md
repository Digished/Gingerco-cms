# Vercel Deployment Guide for Gingerco CMS

Deploy the Gingerco CMS (Next.js 14 + Supabase) to Vercel -- the platform built by the creators of Next.js.

**Cost**: Free tier (Hobby plan) covers everything needed for this project.

---

## Prerequisites

Before deploying, ensure you have:

1. **Git repository** with your code pushed (GitHub, GitLab, or Bitbucket)
2. **Vercel account** (free) -- sign up at https://vercel.com
3. **Supabase credentials** -- Project URL, Anon key, Service role key

---

## Step 1: Create a Vercel Account

1. Go to **https://vercel.com**
2. Click **Sign Up**
3. Choose your Git provider:
   - **GitHub** (recommended -- auto-connects your repos)
   - GitLab
   - Bitbucket
4. Authorize Vercel to access your repositories

---

## Step 2: Import Your Project

### Option A: From Dashboard

1. Click **Add New... > Project**
2. Find and select the **Gingerco-cms** repository
3. Click **Import**

### Option B: Direct Import

1. Go to **https://vercel.com/new**
2. Paste your repository URL
3. Click **Import**

---

## Step 3: Configure Build Settings

Vercel auto-detects Next.js. Verify these settings before deploying:

### Root Directory

```
Root Directory: cms
```

Since the Next.js app lives in the `cms/` subdirectory, you must set this. Click **Edit** next to Root Directory and type `cms`.

### Build & Output Settings

Vercel fills these in automatically for Next.js:

```
Framework Preset:   Next.js
Build Command:      next build       (or: npm run build)
Output Directory:   .next            (auto-detected)
Install Command:    npm install      (auto-detected)
```

You should not need to change these.

### Node.js Version

Vercel defaults to Node.js 20.x, which is compatible with this project. No changes needed.

---

## Step 4: Add Environment Variables

This is the most critical step. Your app will not work without these.

In the **Environment Variables** section on the import page, add each variable:

### Required Variables

| Variable | Value | Where to Find |
|----------|-------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Supabase Dashboard > Settings > API > Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase Dashboard > Settings > API > `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | Supabase Dashboard > Settings > API > `service_role` key |
| `NEXT_PUBLIC_SITE_URL` | `https://your-project.vercel.app` | Your Vercel domain (update after first deploy) |
| `NODE_ENV` | `production` | Static value |

### Adding Variables

For each variable:
1. Enter the **Name** (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
2. Enter the **Value** (e.g., `https://abcdef.supabase.co`)
3. Leave all environments checked (Production, Preview, Development)
4. Click **Add**

### Security Notes

- `NEXT_PUBLIC_*` variables are exposed to the browser -- this is expected for Supabase URL and anon key
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and never sent to the browser
- Vercel encrypts all environment variables at rest
- Variables are injected at build time and runtime (for server functions)

---

## Step 5: Deploy

1. Click **Deploy**
2. Vercel will:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Run the build (`next build`)
   - Deploy to its global edge network
3. Wait for the build to complete (first build takes 1-3 minutes)

### Successful Build Output

```
Route (app)                    Size     First Load JS
+ First Load JS shared by all  85.2 kB
├ /                            ...
├ /login                       ...
├ /admin/dashboard             ...
└ /api/auth/logout             ...

Build Completed in Xs
```

---

## Step 6: Verify Your Deployment

After deployment completes, Vercel provides a live URL (e.g., `https://gingerco-cms.vercel.app`).

### Test Checklist

- [ ] Home page loads at root URL
- [ ] `/login` page renders correctly
- [ ] Login works with admin credentials
- [ ] `/admin/dashboard` displays after login
- [ ] Sidebar navigation works
- [ ] Logout redirects to login page
- [ ] Unauthenticated access to `/admin/*` redirects to `/login`

### Update NEXT_PUBLIC_SITE_URL

After the first deploy, go to **Settings > Environment Variables** and update `NEXT_PUBLIC_SITE_URL` to match your actual Vercel domain. Then redeploy:

1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Select **Redeploy**

---

## Step 7: Custom Domain (Optional)

To use `cms.gingerandco.at` instead of the default `.vercel.app` domain:

### Add the Domain

1. Go to your project **Settings > Domains**
2. Enter your domain: `cms.gingerandco.at`
3. Click **Add**

### Configure DNS

Vercel will show the DNS records you need to add at your domain registrar.

**For a subdomain** (e.g., `cms.gingerandco.at`):

| Type  | Name  | Value                        |
|-------|-------|------------------------------|
| CNAME | `cms` | `cname.vercel-dns.com` |

**For an apex domain** (e.g., `gingerandco.at`):

| Type | Name | Value          |
|------|------|----------------|
| A    | `@`  | `76.76.21.21`  |

### SSL Certificate

Vercel automatically provisions and renews SSL certificates via Let's Encrypt. No action needed.

### DNS Propagation

- CNAME records: 5-30 minutes
- A records / nameserver changes: up to 48 hours

---

## Automatic Deployments

Every push to your connected Git branch triggers an automatic deployment:

```bash
git add .
git commit -m "Update event page"
git push origin main
```

Vercel detects the push within seconds, builds, and deploys. You can monitor the build in the **Deployments** tab.

### Preview Deployments

Every pull request gets its own preview URL. This lets you test changes before merging to production.

```
Pull Request #5 → https://gingerco-cms-pr-5.vercel.app
```

### Production vs Preview

| Trigger | Environment | URL |
|---------|-------------|-----|
| Push to production branch | Production | `your-domain.vercel.app` |
| Pull request | Preview | `gingerco-cms-<hash>.vercel.app` |

---

## Vercel-Specific Features for Next.js

Vercel provides first-class support for Next.js features that other platforms handle partially or not at all:

### Server-Side Rendering (SSR)

API routes and server components run as Vercel Serverless Functions. The middleware in `middleware.ts` (authentication/route protection) runs on the Edge Runtime with near-zero cold start.

### Image Optimization

Next.js `<Image>` component optimization works out of the box on Vercel. No additional configuration needed.

### Incremental Static Regeneration (ISR)

When you add ISR to pages in later phases (e.g., public event listings), Vercel handles revalidation natively.

### Edge Middleware

The existing `middleware.ts` for auth/route protection automatically runs on Vercel's Edge Network -- close to your users worldwide.

### Analytics & Speed Insights

Enable in **Settings > Analytics** for real-user performance monitoring (Core Web Vitals).

---

## Rollbacks

If a deployment introduces a problem:

1. Go to the **Deployments** tab
2. Find the last known working deployment
3. Click the three dots menu
4. Select **Promote to Production**

The rollback takes effect instantly. No rebuild required.

---

## Environment Variable Management

### Updating Variables

1. Go to **Settings > Environment Variables**
2. Click the variable to edit
3. Update the value
4. Click **Save**

### After Updating Variables

Environment variable changes require a new deployment to take effect:

1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Select **Redeploy**

### Environment Scoping

Vercel lets you set different values per environment:

| Scope | Use Case |
|-------|----------|
| **Production** | Live site (`NEXT_PUBLIC_SITE_URL=https://cms.gingerandco.at`) |
| **Preview** | PR previews (`NEXT_PUBLIC_SITE_URL=https://preview.vercel.app`) |
| **Development** | `vercel dev` locally (`NEXT_PUBLIC_SITE_URL=http://localhost:3000`) |

---

## Monitoring & Logs

### Build Logs

1. Click **Deployments** tab
2. Click any deployment
3. View the full build output

### Runtime Logs

1. Go to **Logs** tab (or **Observability** in newer dashboard)
2. View real-time logs from Serverless Functions and Edge Middleware
3. Filter by status code, path, or time range

### Alerts

Set up notifications in **Settings > Notifications**:
- Deployment succeeded / failed
- Domain configuration issues
- Usage alerts

---

## Troubleshooting

### Build Fails: "Module not found"

**Cause**: Missing dependency or incorrect import path.

**Fix**:
1. Check the build log for the exact module name
2. Verify it is in `package.json` dependencies
3. Run `npm install` locally and push the updated `package-lock.json`

### Build Fails: Environment Variable Errors

**Cause**: Required Supabase variables not set.

**Fix**:
1. Go to **Settings > Environment Variables**
2. Confirm all 5 required variables are present
3. Check for typos (variable names are case-sensitive)
4. Redeploy

### Login Page Returns 500

**Cause**: Invalid or missing Supabase credentials.

**Fix**:
1. Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
2. Verify Supabase project is active and not paused
3. Check Vercel **Logs** tab for the specific error
4. Redeploy after fixing

### Database Connection Issues

**Cause**: Wrong Supabase URL or key, or Supabase project is paused.

**Fix**:
1. Log in to Supabase Dashboard and verify project status
2. Go to Settings > API and re-copy the credentials
3. Update environment variables in Vercel
4. Redeploy

### Middleware Redirect Loop

**Cause**: `NEXT_PUBLIC_SITE_URL` mismatch or Supabase auth cookie configuration issue.

**Fix**:
1. Ensure `NEXT_PUBLIC_SITE_URL` matches your actual Vercel domain exactly (including `https://`)
2. Clear browser cookies and try again
3. Check `middleware.ts` for correct redirect paths

### Slow Cold Starts on API Routes

**Cause**: Serverless functions have cold starts on the Hobby plan.

**Fix**:
- This is normal for the free tier (cold starts are typically under 1 second)
- Vercel Pro plan offers faster cold starts if needed
- Edge Middleware (used for auth) has near-zero cold start by default

---

## Project Configuration Reference

### vercel.json (in `cms/` directory)

```json
{
  "framework": "nextjs"
}
```

This file is optional since Vercel auto-detects Next.js, but it serves as explicit documentation of the framework choice.

### next.config.js

```javascript
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}
module.exports = nextConfig
```

No Vercel-specific configuration is needed. Next.js works natively on Vercel.

---

## Cost Summary

### Vercel Hobby Plan (Free)

| Resource | Limit | Gingerco Usage |
|----------|-------|----------------|
| Bandwidth | 100 GB/month | Well within limit |
| Serverless Function Executions | 100 GB-hours/month | Well within limit |
| Build Minutes | 6,000 min/month | Well within limit |
| Deployments | Unlimited | Unlimited |
| Preview Deployments | Unlimited | Unlimited |
| SSL Certificates | Included | Included |
| Edge Middleware | Included | Used for auth |

### When to Upgrade

The Hobby plan is sufficient for this CMS. Consider the Pro plan ($20/month) if you need:
- Team collaboration (multiple members)
- Faster builds and cold starts
- Advanced analytics
- Password-protected preview deployments
- Higher usage limits

---

## Quick Reference

| Action | How |
|--------|-----|
| Deploy | Push to Git (automatic) |
| View deployments | Vercel Dashboard > Deployments |
| View logs | Vercel Dashboard > Logs |
| Update env vars | Settings > Environment Variables > Edit > Redeploy |
| Add custom domain | Settings > Domains > Add |
| Rollback | Deployments > Select previous > Promote to Production |
| Redeploy | Deployments > Latest > Three dots > Redeploy |

---

## Useful Links

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Vercel CLI**: https://vercel.com/docs/cli
- **Supabase Documentation**: https://supabase.com/docs
- **Next.js Documentation**: https://nextjs.org/docs

---

## Support

If deployment fails:

1. Check **Deployments** tab for build logs
2. Review the **Troubleshooting** section above
3. Search Vercel's documentation: https://vercel.com/docs
4. Vercel support: https://vercel.com/support

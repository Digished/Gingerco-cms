# Vercel Deployment Guide for Gingerco CMS

**The Easy Way to Deploy Next.js** ✅

Vercel is created by the Next.js team and is optimized for Next.js applications. This guide will have your CMS live in **5 minutes**.

**Cost**: Free tier covers everything you need

---

## STEP 1: Prepare Your Repository (Already Done!)

Your code is already pushed to:
```
Branch: claude/plan-headless-cms-OhICB
Repository: Your Git repo (GitHub/GitLab/Bitbucket)
```

✅ All files committed and pushed to Git

---

## STEP 2: Create a Vercel Account

1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose sign-up method:
   - GitHub (recommended - auto-connects your repos)
   - GitLab
   - Bitbucket
   - Email
4. Complete sign-up

---

## STEP 3: Connect Your Repository

### Method A: Import Existing Project (Easiest)

1. After signing up, you'll see **"Create a new project"** or click **"New Project"**
2. Click **"Import Git Repository"**
3. Paste your repository URL OR select from list if using GitHub
4. Click **"Import"**

### Method B: From Dashboard

1. Click **"+ New Project"** button
2. Select your Git provider (GitHub/GitLab/Bitbucket)
3. Find and select **Gingerco** repository
4. Click **"Import"**

---

## STEP 4: Configure Build Settings

Vercel should auto-detect Next.js. Verify these settings:

### Framework Preset
```
✓ Framework: Next.js
✓ Detected automatically
```

### Build Settings
```
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### Root Directory
```
Root Directory: cms/
(Select "cms" from the dropdown or type it)
```

**Screenshot of what it should look like:**
```
Framework: Next.js 14.2.35 ✓
Root Directory: cms ✓
Build Command: npm run build ✓
Install Command: npm install ✓
Output Directory: .next ✓
```

---

## STEP 5: Add Environment Variables

This is critical! Add all your Supabase credentials:

### In Vercel Dashboard:

1. Scroll down to **"Environment Variables"** section
2. Click **"Add Environment Variable"** for each:

**Add these 5 variables:**

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project.supabase.co
[Add]

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: your-actual-anon-key-here
[Add]

Name: SUPABASE_SERVICE_ROLE_KEY
Value: your-actual-service-role-key-here
[Add]

Name: NEXT_PUBLIC_SITE_URL
Value: https://your-domain.vercel.app
[Add]

Name: NODE_ENV
Value: production
[Add]
```

### How to Get Your Keys

**NEXT_PUBLIC_SUPABASE_URL**:
- Go to **Supabase Dashboard** → Your project → **Settings** → **API**
- Copy "Project URL"

**NEXT_PUBLIC_SUPABASE_ANON_KEY**:
- Same location, copy "anon public key"

**SUPABASE_SERVICE_ROLE_KEY**:
- Settings → API, scroll down
- Copy "service_role key"

**NEXT_PUBLIC_SITE_URL**:
- After first deployment, use your Vercel domain
- Format: `https://your-project.vercel.app`
- Or your custom domain once set up

---

## STEP 6: Deploy!

1. Scroll to bottom of settings page
2. Click **"Deploy"** button
3. Vercel will:
   - Install dependencies (434 packages)
   - Build Next.js app
   - Deploy to CDN
   - Show live URL

**Build takes 2-3 minutes**

---

## STEP 7: Get Your Live URL

After deployment completes:

```
✓ Deployment successful
Your site is live at: https://xxx.vercel.app
```

### Test Your CMS

Visit:
```
https://xxx.vercel.app/login
```

Login with:
- Email: your admin email
- Password: your admin password

Expected:
- ✅ Login page loads
- ✅ Login succeeds
- ✅ Dashboard displays
- ✅ Real-time data works
- ✅ Sidebar navigation works
- ✅ All features functional

---

## STEP 8: (Optional) Add Custom Domain

If you want `cms.gingerandco.at` instead of `xxx.vercel.app`:

1. Go to **Vercel Dashboard** → Your project
2. Click **"Settings"** tab
3. Click **"Domains"** in left sidebar
4. Click **"Add"**
5. Enter your domain: `cms.gingerandco.at`
6. Follow DNS instructions:
   - Add CNAME record to your domain registrar
   - OR update nameservers to Vercel's
7. DNS propagates in 5-30 minutes

---

## STEP 9: Enable Auto-Deploys

Every time you push to Git, Vercel automatically rebuilds and deploys!

```bash
git push origin claude/plan-headless-cms-OhICB
```

**Within 30 seconds:**
- Vercel detects the push
- Starts building
- Deploys automatically
- Your changes are live

---

## Troubleshooting

### Build Fails with 500 Error

**Cause**: Environment variables not set or incorrect

**Fix**:
1. Go to **Settings** → **Environment Variables**
2. Verify all 5 variables are present
3. Check values match your Supabase project
4. Click **"Redeploy"** button

### Login Page Shows 404

**Cause**: Similar to Netlify issue

**Fix**:
- This shouldn't happen on Vercel with Next.js ✅
- If it does, redeploy with updated environment variables

### Slow Build Time

**Normal**: First build takes 2-3 minutes

**Subsequent builds**: ~30-60 seconds (Vercel caches dependencies)

### Database Connection Failed

**Cause**: Wrong Supabase URL or key

**Fix**:
1. Verify Supabase project is running
2. Check credentials in Vercel dashboard
3. Ensure `.env.local` works locally first
4. Redeploy

---

## After Deployment

### Monitor Your Site

**Vercel Dashboard shows:**
- ✅ Deployment history
- ✅ Build logs
- ✅ Performance metrics
- ✅ Analytics (pageviews, etc.)

### View Build Logs

1. Click **"Deployments"** tab
2. Click on a deployment
3. Scroll to see build output

### Rollback to Previous Version

If something breaks:
1. Click **"Deployments"** tab
2. Find previous working deployment
3. Click the three dots **⋮**
4. Select **"Promote to Production"**

Your site reverts instantly! ✅

---

## Quick Reference

| Command | What It Does |
|---------|-------------|
| `git push` | Auto-deploys to Vercel |
| Visit Vercel dashboard | View deployment status |
| Settings → Environment | Update secrets/credentials |
| Deployments tab | See build history |
| Custom domain | Add your domain name |

---

## Vercel vs Netlify for Next.js

| Feature | Vercel | Netlify |
|---------|--------|---------|
| **Next.js Support** | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **API Routes** | ✅ Built-in | ⚠️ Requires Functions |
| **Real-time** | ✅ Yes | ⚠️ Limited |
| **SSR/Dynamic** | ✅ Yes | ❌ No |
| **Ease of Deploy** | 2 minutes | 20+ minutes |
| **Cost** | Free tier | Free tier |

---

## Environment Variables Checklist

Before clicking deploy, have these ready:

- [ ] NEXT_PUBLIC_SUPABASE_URL (from Supabase Settings)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (from Supabase Settings)
- [ ] SUPABASE_SERVICE_ROLE_KEY (from Supabase Settings)
- [ ] NEXT_PUBLIC_SITE_URL (your Vercel domain)
- [ ] NODE_ENV (set to "production")

---

## Deploy Now! 🚀

1. Go to **https://vercel.com**
2. Click **"New Project"**
3. Import your Gingerco repository
4. Set Root Directory: **cms**
5. Add Environment Variables (5 of them)
6. Click **"Deploy"**

**That's it!** Your CMS will be live in 3 minutes! 🎉

---

## Support

If deployment fails:
1. Check **Deployments** tab for build logs
2. Verify environment variables are correct
3. Ensure Supabase project is active
4. Redeploy with updated settings

**Vercel support**: https://vercel.com/support

Enjoy your live CMS! ✨
